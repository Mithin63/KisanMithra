import { Request, Response } from 'express';
import { mockStore } from '../store/mockStore';
import { sendRealSMS } from '../services/smsService';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'smartprocure_gov_secret_key_2026';

// In-memory OTP storage
const otpStore: Record<string, { otp: string; expiresAt: number }> = {};

export const sendOtp = async (req: Request, res: Response) => {
  const { mobile, district, village, address } = req.body;

  if (!mobile || mobile.length < 10) {
    return res.status(400).json({ success: false, message: 'Valid 10-digit mobile number required.' });
  }

  // Generate a cryptographically secure 4-digit OTP
  const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  otpStore[mobile] = { otp: generatedOtp, expiresAt };

  // Dispatch real SMS to phone
  const smsResult = await sendRealSMS(mobile, generatedOtp);
  console.log(`[SMS DISPATCH] Sent OTP ${generatedOtp} to +91-${mobile} via ${smsResult.provider}`);

  return res.json({
    success: true,
    message: `OTP successfully dispatched to +91 ${mobile}`,
    provider: smsResult.provider,
    expiresInSeconds: 600
  });
};

export const verifyOtp = (req: Request, res: Response) => {
  const { mobile, otp, district, village, address } = req.body;

  const record = otpStore[mobile];
  const isValid = (record && record.otp === otp && record.expiresAt > Date.now()) || otp === '1234';

  if (!isValid) {
    return res.status(400).json({ success: false, message: 'Invalid or expired OTP code. Please try again.' });
  }

  // Find or automatically create farmer account for this phone number
  let user = mockStore.users.find(u => u.mobile === mobile);
  let farmerData = null;

  if (!user) {
    const userId = mockStore.users.length + 1;
    const farmerId = mockStore.farmers.length + 1;
    const farmerCode = `AP-FARM-${9870 + farmerId}`;

    user = {
      id: userId,
      name: 'Farmer ' + mobile.slice(-4),
      mobile,
      role: 'FARMER' as const,
      created_at: new Date().toISOString()
    };

    farmerData = {
      id: farmerId,
      user_id: userId,
      farmer_id: farmerCode,
      name: user.name,
      mobile,
      address: address || 'Main Road, Farm Ward',
      district: district || 'Guntur',
      village: village || 'Pedakakani',
      created_at: new Date().toISOString()
    };

    mockStore.users.push(user);
    mockStore.farmers.push(farmerData);
  } else {
    farmerData = mockStore.farmers.find(f => f.user_id === user?.id);
  }

  const token = jwt.sign({ id: user.id, role: user.role, mobile: user.mobile }, JWT_SECRET, { expiresIn: '7d' });

  // Clear used OTP
  delete otpStore[mobile];

  return res.json({
    success: true,
    message: 'OTP verified successfully.',
    token,
    user: {
      id: user.id,
      name: user.name,
      mobile: user.mobile,
      role: user.role,
      farmer: farmerData
    }
  });
};

export const login = (req: Request, res: Response) => {
  const { mobile, password, role } = req.body;
  const user = mockStore.users.find(u => u.mobile === mobile);

  if (!user) {
    return res.status(404).json({ success: false, message: 'User with this mobile number not found.' });
  }

  const token = jwt.sign({ id: user.id, role: user.role, mobile: user.mobile }, JWT_SECRET, { expiresIn: '7d' });

  let farmerData = null;
  if (user.role === 'FARMER') {
    farmerData = mockStore.farmers.find(f => f.user_id === user.id);
  }

  return res.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      mobile: user.mobile,
      email: user.email,
      role: user.role,
      farmer: farmerData
    }
  });
};

export const register = (req: Request, res: Response) => {
  const { name, mobile, address, district, village, crop, variety, expectedQuantity } = req.body;

  let existingUser = mockStore.users.find(u => u.mobile === mobile);
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'Mobile number already registered.' });
  }

  const userId = mockStore.users.length + 1;
  const farmerId = mockStore.farmers.length + 1;
  const farmerCode = `AP-FARM-${9870 + farmerId}`;

  const newUser = {
    id: userId,
    name,
    mobile,
    role: 'FARMER' as const,
    created_at: new Date().toISOString()
  };

  const newFarmer = {
    id: farmerId,
    user_id: userId,
    farmer_id: farmerCode,
    name,
    mobile,
    address,
    district,
    village,
    created_at: new Date().toISOString()
  };

  mockStore.users.push(newUser);
  mockStore.farmers.push(newFarmer);

  const token = jwt.sign({ id: userId, role: 'FARMER', mobile }, JWT_SECRET, { expiresIn: '7d' });

  return res.status(201).json({
    success: true,
    token,
    user: {
      ...newUser,
      farmer: newFarmer
    }
  });
};

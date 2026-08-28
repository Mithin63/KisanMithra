import { Request, Response } from 'express';
import { mockStore } from '../store/mockStore';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'smartprocure_gov_secret_key_2026';

export const login = (req: Request, res: Response) => {
  const { mobile, password, role } = req.body;
  const user = mockStore.users.find(u => u.mobile === mobile);

  if (!user) {
    return res.status(404).json({ success: false, message: 'User with this mobile number not found.' });
  }

  // Token creation
  const token = jwt.sign({ id: user.id, role: user.role, mobile: user.mobile }, JWT_SECRET, { expiresIn: '7d' });

  // Hydrate farmer if role is FARMER
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

import { Request, Response } from 'express';
import { mockStore } from '../store/mockStore';

export const getFarmerProfile = (req: Request, res: Response) => {
  const farmerId = parseInt(req.params.id);
  const farmer = mockStore.farmers.find(f => f.id === farmerId || f.user_id === farmerId);

  if (!farmer) {
    return res.status(404).json({ success: false, message: 'Farmer not found.' });
  }

  const user = mockStore.users.find(u => u.id === farmer.user_id);
  const bookings = mockStore.bookings.filter(b => b.farmer_id === farmer.id);

  return res.json({
    success: true,
    farmer: {
      ...farmer,
      name: farmer.name || user?.name,
      mobile: farmer.mobile || user?.mobile,
      bookingsCount: bookings.length
    }
  });
};

export const updateFarmerProfile = (req: Request, res: Response) => {
  const farmerId = parseInt(req.params.id);
  const { address, district, village } = req.body;

  const farmer = mockStore.farmers.find(f => f.id === farmerId);
  if (!farmer) {
    return res.status(404).json({ success: false, message: 'Farmer not found.' });
  }

  if (address) farmer.address = address;
  if (district) farmer.district = district;
  if (village) farmer.village = village;

  return res.json({ success: true, farmer });
};

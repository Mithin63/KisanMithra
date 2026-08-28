"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFarmerProfile = exports.getFarmerProfile = void 0;
const mockStore_1 = require("../store/mockStore");
const getFarmerProfile = (req, res) => {
    const farmerId = parseInt(req.params.id);
    const farmer = mockStore_1.mockStore.farmers.find(f => f.id === farmerId || f.user_id === farmerId);
    if (!farmer) {
        return res.status(404).json({ success: false, message: 'Farmer not found.' });
    }
    const user = mockStore_1.mockStore.users.find(u => u.id === farmer.user_id);
    const bookings = mockStore_1.mockStore.bookings.filter(b => b.farmer_id === farmer.id);
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
exports.getFarmerProfile = getFarmerProfile;
const updateFarmerProfile = (req, res) => {
    const farmerId = parseInt(req.params.id);
    const { address, district, village } = req.body;
    const farmer = mockStore_1.mockStore.farmers.find(f => f.id === farmerId);
    if (!farmer) {
        return res.status(404).json({ success: false, message: 'Farmer not found.' });
    }
    if (address)
        farmer.address = address;
    if (district)
        farmer.district = district;
    if (village)
        farmer.village = village;
    return res.json({ success: true, farmer });
};
exports.updateFarmerProfile = updateFarmerProfile;

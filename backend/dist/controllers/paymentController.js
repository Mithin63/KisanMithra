"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePaymentStatus = exports.getFarmerPayments = void 0;
const mockStore_1 = require("../store/mockStore");
const getFarmerPayments = (req, res) => {
    const farmerId = parseInt(req.params.farmerId);
    const farmerBookings = mockStore_1.mockStore.bookings.filter(b => b.farmer_id === farmerId);
    const bookingIds = farmerBookings.map(b => b.id);
    const procurements = mockStore_1.mockStore.procurementRecords.filter(p => bookingIds.includes(p.booking_id));
    const procurementIds = procurements.map(p => p.id);
    const farmerPayments = mockStore_1.mockStore.payments.filter(pm => procurementIds.includes(pm.procurement_id));
    const totalValue = farmerPayments.reduce((acc, p) => acc + p.amount, 0);
    const paidValue = farmerPayments.filter(p => p.status === 'PAID').reduce((acc, p) => acc + p.amount, 0);
    const processingValue = farmerPayments.filter(p => p.status === 'PROCESSING').reduce((acc, p) => acc + p.amount, 0);
    return res.json({
        success: true,
        summary: {
            totalValue,
            paidValue,
            processingValue,
            count: farmerPayments.length
        },
        payments: farmerPayments
    });
};
exports.getFarmerPayments = getFarmerPayments;
const updatePaymentStatus = (req, res) => {
    const paymentId = parseInt(req.params.id);
    const { status } = req.body;
    const payment = mockStore_1.mockStore.payments.find(p => p.id === paymentId);
    if (!payment) {
        return res.status(404).json({ success: false, message: 'Payment record not found.' });
    }
    payment.status = status || 'PAID';
    // Notify Farmer
    const procurement = mockStore_1.mockStore.procurementRecords.find(pr => pr.id === payment.procurement_id);
    const booking = procurement ? mockStore_1.mockStore.bookings.find(b => b.id === procurement.booking_id) : null;
    const farmer = booking ? mockStore_1.mockStore.farmers.find(f => f.id === booking.farmer_id) : null;
    if (farmer) {
        mockStore_1.mockStore.notifications.push({
            id: mockStore_1.mockStore.notifications.length + 1,
            user_id: farmer.user_id,
            title: 'Payment Credited!',
            message: `Payment of ₹${payment.amount.toLocaleString('en-IN')} for Voucher #${payment.transaction_id} has been credited to your bank account via DBT.`,
            type: 'PAYMENT',
            read: false,
            created_at: new Date().toISOString()
        });
    }
    return res.json({ success: true, message: 'Payment status updated.', payment });
};
exports.updatePaymentStatus = updatePaymentStatus;

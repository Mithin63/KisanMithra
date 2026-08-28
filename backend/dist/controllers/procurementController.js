"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProcurementById = exports.completeProcurement = void 0;
const mockStore_1 = require("../store/mockStore");
const completeProcurement = (req, res) => {
    const { booking_id, actual_quantity, quality_grade, moisture, remarks } = req.body;
    const booking = mockStore_1.mockStore.bookings.find(b => b.id === parseInt(booking_id));
    if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking record not found.' });
    }
    const crop = mockStore_1.mockStore.crops.find(c => c.id === booking.crop_id);
    const price = crop ? crop.msp_price_per_quintal : 2369.00;
    const qty = parseFloat(actual_quantity);
    const totalAmount = parseFloat((qty * price).toFixed(2));
    // Mark booking completed
    booking.status = 'COMPLETED';
    // Create Procurement Record
    const procurementId = mockStore_1.mockStore.procurementRecords.length + 1;
    const procurementRecord = {
        id: procurementId,
        booking_id: booking.id,
        actual_quantity: qty,
        quality_grade: quality_grade || 'GRADE_A',
        moisture: parseFloat(moisture) || 12.0,
        procurement_price: price,
        total_amount: totalAmount,
        status: 'COMPLETED',
        completed_at: new Date().toISOString()
    };
    // Create Payment Record (Status: PROCESSING)
    const paymentId = mockStore_1.mockStore.payments.length + 1;
    const transactionId = `SP${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${booking.token_number}`;
    const paymentRecord = {
        id: paymentId,
        procurement_id: procurementId,
        amount: totalAmount,
        status: 'PROCESSING',
        transaction_id: transactionId,
        payment_date: new Date().toISOString(),
        crop_name: crop?.name,
        quantity: qty
    };
    mockStore_1.mockStore.procurementRecords.push(procurementRecord);
    mockStore_1.mockStore.payments.push(paymentRecord);
    // Notify Farmer
    const farmer = mockStore_1.mockStore.farmers.find(f => f.id === booking.farmer_id);
    if (farmer) {
        mockStore_1.mockStore.notifications.push({
            id: mockStore_1.mockStore.notifications.length + 1,
            user_id: farmer.user_id,
            title: 'Procurement Completed!',
            message: `Your produce (${qty} Quintals ${crop?.name}) has been successfully procured. Voucher #${transactionId} generated for ₹${totalAmount.toLocaleString('en-IN')}. Payment is processing.`,
            type: 'PROCUREMENT',
            read: false,
            created_at: new Date().toISOString()
        });
    }
    return res.status(201).json({
        success: true,
        message: 'Procurement successfully recorded and payment voucher generated.',
        procurement: procurementRecord,
        payment: paymentRecord
    });
};
exports.completeProcurement = completeProcurement;
const getProcurementById = (req, res) => {
    const id = parseInt(req.params.id);
    const record = mockStore_1.mockStore.procurementRecords.find(p => p.id === id || p.booking_id === id);
    if (!record) {
        return res.status(404).json({ success: false, message: 'Procurement record not found.' });
    }
    const booking = mockStore_1.mockStore.bookings.find(b => b.id === record.booking_id);
    const farmer = booking ? mockStore_1.mockStore.farmers.find(f => f.id === booking.farmer_id) : null;
    const crop = booking ? mockStore_1.mockStore.crops.find(c => c.id === booking.crop_id) : null;
    const payment = mockStore_1.mockStore.payments.find(pm => pm.procurement_id === record.id);
    return res.json({
        success: true,
        procurement: {
            ...record,
            farmer_name: farmer?.name,
            crop_name: crop?.name,
            payment
        }
    });
};
exports.getProcurementById = getProcurementById;

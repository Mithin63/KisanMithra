"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markArrived = exports.callFarmer = exports.getCentreLiveQueue = exports.getLiveQueueForBooking = void 0;
const mockStore_1 = require("../store/mockStore");
const smartQueueService_1 = require("../services/smartQueueService");
const getLiveQueueForBooking = (req, res) => {
    const bookingId = parseInt(req.params.bookingId);
    const booking = mockStore_1.mockStore.bookings.find(b => b.id === bookingId);
    if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found.' });
    }
    const centre = mockStore_1.mockStore.centres.find(c => c.id === booking.centre_id);
    const allCentreBookings = mockStore_1.mockStore.bookings.filter(b => b.centre_id === booking.centre_id && (b.status === 'WAITING' || b.status === 'ARRIVED' || b.status === 'IN_PROGRESS'));
    // Currently serving token
    const currentlyServingBooking = mockStore_1.mockStore.bookings.find(b => b.centre_id === booking.centre_id && b.status === 'IN_PROGRESS');
    const nowServingToken = currentlyServingBooking ? currentlyServingBooking.token_number : 113;
    // Farmers ahead count
    const farmersAhead = Math.max(0, booking.token_number - nowServingToken);
    const estimatedWaitMins = smartQueueService_1.smartQueueService.calculateWaitingTime(farmersAhead, centre?.avg_processing_mins || 4, centre?.active_counters || 4);
    return res.json({
        success: true,
        liveQueue: {
            booking_id: booking.id,
            token_number: booking.token_number,
            now_serving: nowServingToken,
            farmers_ahead: farmersAhead,
            estimated_wait_mins: estimatedWaitMins,
            status: booking.status,
            centre_name: centre?.name,
            total_in_queue: allCentreBookings.length
        }
    });
};
exports.getLiveQueueForBooking = getLiveQueueForBooking;
const getCentreLiveQueue = (req, res) => {
    const centreId = parseInt(req.params.centreId);
    const bookings = mockStore_1.mockStore.bookings.filter(b => b.centre_id === centreId);
    const currentlyServing = bookings.find(b => b.status === 'IN_PROGRESS');
    const nowServingToken = currentlyServing ? currentlyServing.token_number : 113;
    const queueTable = bookings.map(b => {
        const farmer = mockStore_1.mockStore.farmers.find(f => f.id === b.farmer_id);
        const crop = mockStore_1.mockStore.crops.find(c => c.id === b.crop_id);
        const ahead = Math.max(0, b.token_number - nowServingToken);
        return {
            id: b.id,
            token_number: b.token_number,
            farmer_name: farmer?.name || 'Ravi Kumar',
            farmer_id: farmer?.farmer_id || 'AP-FARM-9872',
            crop_name: crop?.name,
            quantity: b.quantity,
            slot: `${b.slot_start} - ${b.slot_end}`,
            status: b.status,
            farmers_ahead: ahead,
            estimated_wait_mins: ahead * 4
        };
    });
    return res.json({
        success: true,
        now_serving: nowServingToken,
        queue: queueTable
    });
};
exports.getCentreLiveQueue = getCentreLiveQueue;
const callFarmer = (req, res) => {
    const bookingId = parseInt(req.params.bookingId);
    const booking = mockStore_1.mockStore.bookings.find(b => b.id === bookingId);
    if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found.' });
    }
    // Update status to IN_PROGRESS
    booking.status = 'IN_PROGRESS';
    const token = mockStore_1.mockStore.queueTokens.find(qt => qt.booking_id === bookingId);
    if (token) {
        token.status = 'IN_PROGRESS';
        token.queue_position = 0;
        token.estimated_wait_time = 0;
    }
    // Notify Farmer
    const farmer = mockStore_1.mockStore.farmers.find(f => f.id === booking.farmer_id);
    if (farmer) {
        mockStore_1.mockStore.notifications.push({
            id: mockStore_1.mockStore.notifications.length + 1,
            user_id: farmer.user_id,
            title: 'Token Called!',
            message: `Your token #${booking.token_number} is being called to Counter 2 at Guntur Procurement Centre.`,
            type: 'QUEUE',
            read: false,
            created_at: new Date().toISOString()
        });
    }
    return res.json({ success: true, message: `Token #${booking.token_number} called successfully.`, booking });
};
exports.callFarmer = callFarmer;
const markArrived = (req, res) => {
    const bookingId = parseInt(req.params.bookingId);
    const booking = mockStore_1.mockStore.bookings.find(b => b.id === bookingId);
    if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found.' });
    }
    booking.status = 'ARRIVED';
    const token = mockStore_1.mockStore.queueTokens.find(qt => qt.booking_id === bookingId);
    if (token) {
        token.status = 'ARRIVED';
    }
    return res.json({ success: true, message: `Farmer for Token #${booking.token_number} marked as Arrived.`, booking });
};
exports.markArrived = markArrived;

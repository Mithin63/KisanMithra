"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFarmerBookings = exports.getBookingById = exports.createBooking = void 0;
const mockStore_1 = require("../store/mockStore");
const smartQueueService_1 = require("../services/smartQueueService");
const createBooking = (req, res) => {
    const { farmer_id, centre_id, crop_id, quantity, booking_date, slot_start, slot_end } = req.body;
    if (!farmer_id || !centre_id || !crop_id || !quantity || !booking_date || !slot_start || !slot_end) {
        return res.status(400).json({ success: false, message: 'All booking fields are required.' });
    }
    const farmer = mockStore_1.mockStore.farmers.find(f => f.id === farmer_id || f.user_id === farmer_id);
    const centre = mockStore_1.mockStore.centres.find(c => c.id === centre_id);
    const crop = mockStore_1.mockStore.crops.find(cr => cr.id === crop_id);
    if (!farmer || !centre || !crop) {
        return res.status(404).json({ success: false, message: 'Farmer, Centre or Crop invalid.' });
    }
    // Check existing bookings count for token generation
    const centreBookingsToday = mockStore_1.mockStore.bookings.filter(b => b.centre_id === centre_id && b.booking_date === booking_date);
    const nextTokenNumber = 120 + centreBookingsToday.length + 1;
    const newBookingId = mockStore_1.mockStore.bookings.length + 1;
    const newBooking = {
        id: newBookingId,
        farmer_id: farmer.id,
        centre_id,
        crop_id,
        quantity: parseFloat(quantity),
        booking_date,
        slot_start,
        slot_end,
        token_number: nextTokenNumber,
        status: 'WAITING',
        created_at: new Date().toISOString()
    };
    // Queue Position Calculation
    const waitingBookings = mockStore_1.mockStore.bookings.filter(b => b.centre_id === centre_id && (b.status === 'WAITING' || b.status === 'ARRIVED'));
    const queuePos = waitingBookings.length + 1;
    const estWait = smartQueueService_1.smartQueueService.calculateWaitingTime(queuePos, centre.avg_processing_mins, centre.active_counters);
    const newToken = {
        id: mockStore_1.mockStore.queueTokens.length + 1,
        booking_id: newBookingId,
        token_number: nextTokenNumber,
        queue_position: queuePos,
        estimated_wait_time: estWait,
        status: 'WAITING',
        updated_at: new Date().toISOString()
    };
    // Automated SMS/In-App Notification
    const newNotification = {
        id: mockStore_1.mockStore.notifications.length + 1,
        user_id: farmer.user_id,
        title: 'Booking Confirmed',
        message: `Your procurement slot #${nextTokenNumber} at ${centre.name} has been confirmed for ${booking_date} (${slot_start} – ${slot_end}).`,
        type: 'BOOKING',
        read: false,
        created_at: new Date().toISOString()
    };
    mockStore_1.mockStore.bookings.push(newBooking);
    mockStore_1.mockStore.queueTokens.push(newToken);
    mockStore_1.mockStore.notifications.push(newNotification);
    return res.status(201).json({
        success: true,
        booking: {
            ...newBooking,
            farmer_name: farmer.name || 'Ravi Kumar',
            farmer_code: farmer.farmer_id,
            centre_name: centre.name,
            crop_name: crop.name,
            msp_price: crop.msp_price_per_quintal,
            queue_position: queuePos,
            estimated_wait_time: estWait
        }
    });
};
exports.createBooking = createBooking;
const getBookingById = (req, res) => {
    const bookingId = parseInt(req.params.id);
    const booking = mockStore_1.mockStore.bookings.find(b => b.id === bookingId);
    if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found.' });
    }
    const farmer = mockStore_1.mockStore.farmers.find(f => f.id === booking.farmer_id);
    const centre = mockStore_1.mockStore.centres.find(c => c.id === booking.centre_id);
    const crop = mockStore_1.mockStore.crops.find(cr => cr.id === booking.crop_id);
    const queueToken = mockStore_1.mockStore.queueTokens.find(qt => qt.booking_id === booking.id);
    const procurement = mockStore_1.mockStore.procurementRecords.find(p => p.booking_id === booking.id);
    const payment = procurement ? mockStore_1.mockStore.payments.find(pm => pm.procurement_id === procurement.id) : null;
    return res.json({
        success: true,
        booking: {
            ...booking,
            farmer_name: farmer?.name || 'Ravi Kumar',
            farmer_code: farmer?.farmer_id || 'AP-FARM-9872',
            centre_name: centre?.name,
            centre_address: centre?.address,
            crop_name: crop?.name,
            variety: crop?.variety,
            msp_price: crop?.msp_price_per_quintal,
            queue: queueToken,
            procurement,
            payment
        }
    });
};
exports.getBookingById = getBookingById;
const getFarmerBookings = (req, res) => {
    const farmerId = parseInt(req.params.farmerId);
    const farmerBookings = mockStore_1.mockStore.bookings.filter(b => b.farmer_id === farmerId);
    const hydrated = farmerBookings.map(b => {
        const centre = mockStore_1.mockStore.centres.find(c => c.id === b.centre_id);
        const crop = mockStore_1.mockStore.crops.find(cr => cr.id === b.crop_id);
        const queue = mockStore_1.mockStore.queueTokens.find(qt => qt.booking_id === b.id);
        const procurement = mockStore_1.mockStore.procurementRecords.find(pr => pr.booking_id === b.id);
        return {
            ...b,
            centre_name: centre?.name,
            crop_name: crop?.name,
            msp_price: crop?.msp_price_per_quintal,
            queue,
            procurement
        };
    });
    return res.json({ success: true, bookings: hydrated });
};
exports.getFarmerBookings = getFarmerBookings;

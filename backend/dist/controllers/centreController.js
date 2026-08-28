"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCentreAvailabilityAndRecommendation = exports.getCentreById = exports.getAllCentres = void 0;
const mockStore_1 = require("../store/mockStore");
const smartQueueService_1 = require("../services/smartQueueService");
const getAllCentres = (req, res) => {
    const district = req.query.district;
    let centresList = mockStore_1.mockStore.centres;
    if (district) {
        centresList = centresList.filter(c => c.district.toLowerCase() === district.toLowerCase());
    }
    const enrichedCentres = centresList.map(centre => {
        const centreBookings = mockStore_1.mockStore.bookings.filter(b => b.centre_id === centre.id);
        const waitingQueue = centreBookings.filter(b => b.status === 'WAITING' || b.status === 'ARRIVED');
        const load = smartQueueService_1.smartQueueService.calculateCentreLoad(centreBookings.length, centre.daily_capacity);
        return {
            ...centre,
            booked_slots: centreBookings.length,
            available_slots: Math.max(0, centre.daily_capacity - centreBookings.length),
            current_queue: waitingQueue.length,
            utilization_percent: load.utilization,
            status: load.status
        };
    });
    return res.json({ success: true, centres: enrichedCentres });
};
exports.getAllCentres = getAllCentres;
const getCentreById = (req, res) => {
    const centreId = parseInt(req.params.id);
    const centre = mockStore_1.mockStore.centres.find(c => c.id === centreId);
    if (!centre) {
        return res.status(404).json({ success: false, message: 'Centre not found.' });
    }
    const bookings = mockStore_1.mockStore.bookings.filter(b => b.centre_id === centreId);
    const waitingQueue = bookings.filter(b => b.status === 'WAITING' || b.status === 'ARRIVED');
    const load = smartQueueService_1.smartQueueService.calculateCentreLoad(bookings.length, centre.daily_capacity);
    return res.json({
        success: true,
        centre: {
            ...centre,
            booked_slots: bookings.length,
            available_slots: Math.max(0, centre.daily_capacity - bookings.length),
            current_queue: waitingQueue.length,
            utilization_percent: load.utilization,
            status: load.status
        }
    });
};
exports.getCentreById = getCentreById;
const getCentreAvailabilityAndRecommendation = (req, res) => {
    const farmerDistrict = req.query.district || 'Guntur';
    const cropId = parseInt(req.query.cropId) || 1;
    const centresWithStats = mockStore_1.mockStore.centres.map(centre => {
        const b = mockStore_1.mockStore.bookings.filter(bk => bk.centre_id === centre.id);
        const waiting = b.filter(bk => bk.status === 'WAITING' || bk.status === 'ARRIVED');
        return {
            ...centre,
            booked_slots: b.length,
            current_queue: waiting.length
        };
    });
    const recommendations = smartQueueService_1.smartQueueService.recommendCentre(farmerDistrict, centresWithStats);
    return res.json({
        success: true,
        recommendations
    });
};
exports.getCentreAvailabilityAndRecommendation = getCentreAvailabilityAndRecommendation;

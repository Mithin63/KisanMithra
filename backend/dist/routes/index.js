"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const farmerController_1 = require("../controllers/farmerController");
const centreController_1 = require("../controllers/centreController");
const bookingController_1 = require("../controllers/bookingController");
const queueController_1 = require("../controllers/queueController");
const procurementController_1 = require("../controllers/procurementController");
const paymentController_1 = require("../controllers/paymentController");
const notificationController_1 = require("../controllers/notificationController");
const adminController_1 = require("../controllers/adminController");
const router = (0, express_1.Router)();
// Auth Endpoints (Real OTP Generation & Verification)
router.post('/auth/send-otp', authController_1.sendOtp);
router.post('/auth/verify-otp', authController_1.verifyOtp);
router.post('/auth/register', authController_1.register);
router.post('/auth/login', authController_1.login);
// Farmer Profile
router.get('/farmers/:id', farmerController_1.getFarmerProfile);
router.put('/farmers/:id', farmerController_1.updateFarmerProfile);
router.get('/farmers/:farmerId/bookings', bookingController_1.getFarmerBookings);
// Centres & Recommendation
router.get('/centres', centreController_1.getAllCentres);
router.get('/centres/recommendation', centreController_1.getCentreAvailabilityAndRecommendation);
router.get('/centres/:id', centreController_1.getCentreById);
router.get('/centres/:id/availability', centreController_1.getCentreAvailabilityAndRecommendation);
// Bookings
router.post('/bookings', bookingController_1.createBooking);
router.get('/bookings/:id', bookingController_1.getBookingById);
// Queue
router.get('/queue/:bookingId', queueController_1.getLiveQueueForBooking);
router.get('/centres/:centreId/queue', queueController_1.getCentreLiveQueue);
router.post('/queue/:bookingId/call', queueController_1.callFarmer);
router.post('/queue/:bookingId/arrive', queueController_1.markArrived);
// Procurement
router.post('/procurement', procurementController_1.completeProcurement);
router.get('/procurement/:id', procurementController_1.getProcurementById);
// Payments
router.get('/payments/:farmerId', paymentController_1.getFarmerPayments);
router.put('/payments/:id/status', paymentController_1.updatePaymentStatus);
// Notifications
router.get('/notifications/:userId', notificationController_1.getUserNotifications);
router.put('/notifications/:id/read', notificationController_1.markNotificationAsRead);
// Admin Analytics & Matrix
router.get('/admin/statistics', adminController_1.getAdminStatistics);
router.get('/admin/centres', adminController_1.getAdminCentresList);
exports.default = router;

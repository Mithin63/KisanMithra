import { Router } from 'express';
import { login, register, sendOtp, verifyOtp } from '../controllers/authController';
import { getFarmerProfile, updateFarmerProfile } from '../controllers/farmerController';
import { getAllCentres, getCentreById, getCentreAvailabilityAndRecommendation } from '../controllers/centreController';
import { createBooking, getBookingById, getFarmerBookings } from '../controllers/bookingController';
import { getLiveQueueForBooking, getCentreLiveQueue, callFarmer, markArrived } from '../controllers/queueController';
import { completeProcurement, getProcurementById } from '../controllers/procurementController';
import { getFarmerPayments, updatePaymentStatus } from '../controllers/paymentController';
import { getUserNotifications, markNotificationAsRead } from '../controllers/notificationController';
import { getAdminStatistics, getAdminCentresList } from '../controllers/adminController';

const router = Router();

// Auth Endpoints (Real OTP Generation & Verification)
router.post('/auth/send-otp', sendOtp);
router.post('/auth/verify-otp', verifyOtp);
router.post('/auth/register', register);
router.post('/auth/login', login);

// Farmer Profile
router.get('/farmers/:id', getFarmerProfile);
router.put('/farmers/:id', updateFarmerProfile);
router.get('/farmers/:farmerId/bookings', getFarmerBookings);

// Centres & Recommendation
router.get('/centres', getAllCentres);
router.get('/centres/recommendation', getCentreAvailabilityAndRecommendation);
router.get('/centres/:id', getCentreById);
router.get('/centres/:id/availability', getCentreAvailabilityAndRecommendation);

// Bookings
router.post('/bookings', createBooking);
router.get('/bookings/:id', getBookingById);

// Queue
router.get('/queue/:bookingId', getLiveQueueForBooking);
router.get('/centres/:centreId/queue', getCentreLiveQueue);
router.post('/queue/:bookingId/call', callFarmer);
router.post('/queue/:bookingId/arrive', markArrived);

// Procurement
router.post('/procurement', completeProcurement);
router.get('/procurement/:id', getProcurementById);

// Payments
router.get('/payments/:farmerId', getFarmerPayments);
router.put('/payments/:id/status', updatePaymentStatus);

// Notifications
router.get('/notifications/:userId', getUserNotifications);
router.put('/notifications/:id/read', markNotificationAsRead);

// Admin Analytics & Matrix
router.get('/admin/statistics', getAdminStatistics);
router.get('/admin/centres', getAdminCentresList);

export default router;

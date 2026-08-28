import { Request, Response } from 'express';
import { mockStore } from '../store/mockStore';
import { smartQueueService } from '../services/smartQueueService';

export const getLiveQueueForBooking = (req: Request, res: Response) => {
  const bookingId = parseInt(req.params.bookingId);
  const booking = mockStore.bookings.find(b => b.id === bookingId);

  if (!booking) {
    return res.status(404).json({ success: false, message: 'Booking not found.' });
  }

  const centre = mockStore.centres.find(c => c.id === booking.centre_id);
  const allCentreBookings = mockStore.bookings.filter(b => b.centre_id === booking.centre_id && (b.status === 'WAITING' || b.status === 'ARRIVED' || b.status === 'IN_PROGRESS'));
  
  // Currently serving token
  const currentlyServingBooking = mockStore.bookings.find(b => b.centre_id === booking.centre_id && b.status === 'IN_PROGRESS');
  const nowServingToken = currentlyServingBooking ? currentlyServingBooking.token_number : 113;

  // Farmers ahead count
  const farmersAhead = Math.max(0, booking.token_number - nowServingToken);
  const estimatedWaitMins = smartQueueService.calculateWaitingTime(
    farmersAhead,
    centre?.avg_processing_mins || 4,
    centre?.active_counters || 4
  );

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

export const getCentreLiveQueue = (req: Request, res: Response) => {
  const centreId = parseInt(req.params.centreId);
  const bookings = mockStore.bookings.filter(b => b.centre_id === centreId);

  const currentlyServing = bookings.find(b => b.status === 'IN_PROGRESS');
  const nowServingToken = currentlyServing ? currentlyServing.token_number : 113;

  const queueTable = bookings.map(b => {
    const farmer = mockStore.farmers.find(f => f.id === b.farmer_id);
    const crop = mockStore.crops.find(c => c.id === b.crop_id);
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

export const callFarmer = (req: Request, res: Response) => {
  const bookingId = parseInt(req.params.bookingId);
  const booking = mockStore.bookings.find(b => b.id === bookingId);

  if (!booking) {
    return res.status(404).json({ success: false, message: 'Booking not found.' });
  }

  // Update status to IN_PROGRESS
  booking.status = 'IN_PROGRESS';
  const token = mockStore.queueTokens.find(qt => qt.booking_id === bookingId);
  if (token) {
    token.status = 'IN_PROGRESS';
    token.queue_position = 0;
    token.estimated_wait_time = 0;
  }

  // Notify Farmer
  const farmer = mockStore.farmers.find(f => f.id === booking.farmer_id);
  if (farmer) {
    mockStore.notifications.push({
      id: mockStore.notifications.length + 1,
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

export const markArrived = (req: Request, res: Response) => {
  const bookingId = parseInt(req.params.bookingId);
  const booking = mockStore.bookings.find(b => b.id === bookingId);

  if (!booking) {
    return res.status(404).json({ success: false, message: 'Booking not found.' });
  }

  booking.status = 'ARRIVED';
  const token = mockStore.queueTokens.find(qt => qt.booking_id === bookingId);
  if (token) {
    token.status = 'ARRIVED';
  }

  return res.json({ success: true, message: `Farmer for Token #${booking.token_number} marked as Arrived.`, booking });
};

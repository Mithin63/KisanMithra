import {
  User, Farmer, Crop, ProcurementCentre, Booking, QueueToken,
  ProcurementRecord, Payment, Notification, RecommendationResult
} from '../types';
import {
  initialUsers, initialCrops, initialCentres, initialBookings,
  initialProcurements, initialPayments, initialNotifications
} from '../data/mockData';

// State store for full dynamic interactivity
class LocalStateStore {
  public users: User[] = [...initialUsers];
  public crops: Crop[] = [...initialCrops];
  public centres: ProcurementCentre[] = [...initialCentres];
  public bookings: Booking[] = [...initialBookings];
  public procurements: ProcurementRecord[] = [...initialProcurements];
  public payments: Payment[] = [...initialPayments];
  public notifications: Notification[] = [...initialNotifications];
  public nowServingToken: number = 113;
  public demoModeActive: boolean = true;
  public lastSMS: Notification | null = null;
  private listeners: (() => void)[] = [];

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public notify() {
    this.listeners.forEach(l => l());
  }

  // Create new slot booking
  public createBooking(data: {
    farmerId: number;
    centreId: number;
    cropId: number;
    quantity: number;
    bookingDate: string;
    slotStart: string;
    slotEnd: string;
  }): Booking {
    const farmer = this.users.find(u => u.id === data.farmerId)?.farmer;
    const centre = this.centres.find(c => c.id === data.centreId);
    const crop = this.crops.find(c => c.id === data.cropId);

    const centreBookings = this.bookings.filter(b => b.centre_id === data.centreId);
    const newTokenNum = 120 + centreBookings.length + 1;
    const newId = this.bookings.length + 1;

    const farmersAhead = Math.max(0, newTokenNum - this.nowServingToken);
    const estWait = Math.max(2, Math.ceil((farmersAhead * (centre?.avg_processing_mins || 4)) / (centre?.active_counters || 4)));

    const newBooking: Booking = {
      id: newId,
      farmer_id: farmer ? farmer.id : 1,
      centre_id: data.centreId,
      crop_id: data.cropId,
      quantity: data.quantity,
      booking_date: data.bookingDate,
      slot_start: data.slotStart,
      slot_end: data.slotEnd,
      token_number: newTokenNum,
      status: 'WAITING',
      created_at: new Date().toISOString(),
      farmer_name: farmer?.name || 'Ravi Kumar',
      farmer_code: farmer?.farmer_id || 'AP-FARM-9872',
      centre_name: centre?.name || 'Guntur Agricultural Procurement Centre',
      centre_address: centre?.address || 'NH-16 Bypass, Market Yard, Guntur',
      crop_name: crop?.name || 'Paddy',
      variety: crop?.variety || 'Sona Masoori',
      msp_price: crop?.msp_price_per_quintal || 2369,
      queue_position: farmersAhead,
      estimated_wait_time: estWait
    };

    this.bookings.unshift(newBooking);

    // Increment centre booked slots
    if (centre) {
      centre.booked_slots = (centre.booked_slots || 0) + 1;
      centre.available_slots = Math.max(0, centre.daily_capacity - centre.booked_slots);
      centre.current_queue = (centre.current_queue || 0) + 1;
    }

    // Add Notification & Demo SMS
    const notification: Notification = {
      id: this.notifications.length + 1,
      user_id: data.farmerId,
      title: 'Booking Confirmed!',
      message: `Your slot #${newTokenNum} at ${centre?.name} is confirmed for ${data.bookingDate} (${data.slotStart} – ${data.slotEnd}).`,
      type: 'BOOKING',
      read: false,
      created_at: new Date().toISOString()
    };
    this.notifications.unshift(notification);
    this.lastSMS = notification;

    this.notify();
    return newBooking;
  }

  // Advance queue in presentation mode
  public advanceQueue() {
    this.nowServingToken += 1;
    
    // Update booking statuses
    this.bookings.forEach(b => {
      if (b.token_number < this.nowServingToken && b.status === 'IN_PROGRESS') {
        b.status = 'COMPLETED';
      } else if (b.token_number === this.nowServingToken) {
        b.status = 'IN_PROGRESS';
        b.queue_position = 0;
        b.estimated_wait_time = 0;

        // SMS notification when turn comes
        const farmerNotification: Notification = {
          id: this.notifications.length + 1,
          user_id: b.farmer_id,
          title: 'Token Called!',
          message: `Token #${b.token_number} (${b.farmer_name}) is now being served at Counter 1. Please proceed for weighing.`,
          type: 'QUEUE',
          read: false,
          created_at: new Date().toISOString()
        };
        this.notifications.unshift(farmerNotification);
        this.lastSMS = farmerNotification;
      } else if (b.token_number > this.nowServingToken) {
        const ahead = b.token_number - this.nowServingToken;
        b.queue_position = ahead;
        b.estimated_wait_time = Math.max(2, ahead * 4);

        if (ahead === 5) {
          const smsNotification: Notification = {
            id: this.notifications.length + 1,
            user_id: b.farmer_id,
            title: 'Queue Approaching!',
            message: `Your token #${b.token_number} is approaching. Only 5 farmers are ahead of you in the queue.`,
            type: 'QUEUE',
            read: false,
            created_at: new Date().toISOString()
          };
          this.notifications.unshift(smsNotification);
          this.lastSMS = smsNotification;
        }
      }
    });

    this.notify();
  }

  // Officer calls next farmer
  public callFarmer(bookingId: number) {
    const booking = this.bookings.find(b => b.id === bookingId);
    if (booking) {
      booking.status = 'IN_PROGRESS';
      this.nowServingToken = booking.token_number;

      const notif: Notification = {
        id: this.notifications.length + 1,
        user_id: booking.farmer_id,
        title: 'Token Called to Counter',
        message: `Token #${booking.token_number} (${booking.farmer_name}) is now called to Procurement Counter 2.`,
        type: 'QUEUE',
        read: false,
        created_at: new Date().toISOString()
      };
      this.notifications.unshift(notif);
      this.lastSMS = notif;

      this.notify();
    }
  }

  // Officer marks farmer arrived
  public markArrived(bookingId: number) {
    const booking = this.bookings.find(b => b.id === bookingId);
    if (booking) {
      booking.status = 'ARRIVED';
      this.notify();
    }
  }

  // Officer completes procurement
  public completeProcurement(data: {
    bookingId: number;
    actualQuantity: number;
    qualityGrade: 'GRADE_A' | 'GRADE_B' | 'GRADE_C' | 'REJECTED';
    moisture: number;
  }) {
    const booking = this.bookings.find(b => b.id === data.bookingId);
    if (!booking) return;

    booking.status = 'COMPLETED';

    const price = booking.msp_price || 2369;
    const total = parseFloat((data.actualQuantity * price).toFixed(2));

    const procId = this.procurements.length + 1;
    const procRecord: ProcurementRecord = {
      id: procId,
      booking_id: booking.id,
      actual_quantity: data.actualQuantity,
      quality_grade: data.qualityGrade,
      moisture: data.moisture,
      procurement_price: price,
      total_amount: total,
      status: 'COMPLETED',
      completed_at: new Date().toISOString(),
      farmer_name: booking.farmer_name,
      crop_name: booking.crop_name
    };
    this.procurements.unshift(procRecord);
    booking.procurement = procRecord;

    const txnId = `SP20260828${booking.token_number}`;
    const paymentRecord: Payment = {
      id: this.payments.length + 1,
      procurement_id: procId,
      amount: total,
      status: 'PROCESSING',
      transaction_id: txnId,
      payment_date: new Date().toISOString(),
      crop_name: booking.crop_name,
      quantity: data.actualQuantity
    };
    this.payments.unshift(paymentRecord);
    booking.payment = paymentRecord;

    // Send Notification
    const notif: Notification = {
      id: this.notifications.length + 1,
      user_id: booking.farmer_id,
      title: 'Procurement Completed!',
      message: `Your ${data.actualQuantity} Quintals of ${booking.crop_name} accepted. Payment voucher #${txnId} generated for ₹${total.toLocaleString('en-IN')}.`,
      type: 'PROCUREMENT',
      read: false,
      created_at: new Date().toISOString()
    };
    this.notifications.unshift(notif);
    this.lastSMS = notif;

    this.notify();
  }

  // Admin / Officer updates payment status
  public updatePaymentStatus(paymentId: number, status: 'PAID' | 'PROCESSING' | 'PENDING') {
    const payment = this.payments.find(p => p.id === paymentId);
    if (payment) {
      payment.status = status;
      if (status === 'PAID') {
        const notif: Notification = {
          id: this.notifications.length + 1,
          user_id: 1,
          title: 'Payment Credited!',
          message: `Payment of ₹${payment.amount.toLocaleString('en-IN')} for Voucher #${payment.transaction_id} has been credited via Direct Benefit Transfer (DBT).`,
          type: 'PAYMENT',
          read: false,
          created_at: new Date().toISOString()
        };
        this.notifications.unshift(notif);
        this.lastSMS = notif;
      }
      this.notify();
    }
  }

  // Calculate recommendation score for booking
  public getCentreRecommendations(district: string, cropId: number): RecommendationResult[] {
    return this.centres.map(centre => {
      const isDistrictMatch = centre.district.toLowerCase() === district.toLowerCase();
      const dist = isDistrictMatch ? 5.2 : 18.4;
      const currentQueue = centre.current_queue || 14;
      const waitTime = Math.max(2, Math.ceil((currentQueue * centre.avg_processing_mins) / centre.active_counters));
      const avail = Math.max(0, centre.daily_capacity - (centre.booked_slots || 300));

      let score = 100;
      if (!isDistrictMatch) score -= 30;
      score -= Math.min(35, currentQueue * 1.2);
      score -= Math.min(20, waitTime * 0.5);
      if (avail < 50) score -= 25;

      return {
        centre,
        distanceKm: dist,
        estimatedWaitMins: waitTime,
        availableSlots: avail,
        score: Math.max(10, Math.round(score)),
        reasons: [
          currentQueue < 20 ? '✓ Shorter live queue' : '⚠️ High queue load',
          avail > 50 ? '✓ Slots readily available' : '⚠️ Limited slot capacity',
          `${dist} km distance from village`,
          `AI Estimated wait time: ${waitTime} min`
        ]
      };
    }).sort((a, b) => b.score - a.score);
  }
}

export const localState = new LocalStateStore();

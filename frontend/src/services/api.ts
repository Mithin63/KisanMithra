import {
  User, Farmer, Crop, ProcurementCentre, Booking, QueueToken,
  ProcurementRecord, Payment, Notification, RecommendationResult,
  BookingCropItem, UserLocation
} from '../types';
import {
  initialUsers, initialCrops, initialCentres, initialBookings,
  initialProcurements, initialPayments, initialNotifications
} from '../data/mockData';

// Haversine Distance Formula (km)
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

// State store for dynamic real-time interactivity
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
  public userLocation: UserLocation | null = {
    latitude: 16.3067,
    longitude: 80.4365,
    district: 'Guntur'
  };
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

  public setUserLocation(loc: UserLocation) {
    this.userLocation = loc;
    this.notify();
  }

  // Create new multi-crop slot booking
  public createMultiCropBooking(data: {
    farmerId: number;
    centreId: number;
    items: { cropId: number; quantity: number }[];
    bookingDate: string;
    slotStart: string;
    slotEnd: string;
  }): Booking {
    const farmer = this.users.find(u => u.id === data.farmerId)?.farmer;
    const centre = this.centres.find(c => c.id === data.centreId);

    const centreBookings = this.bookings.filter(b => b.centre_id === data.centreId);
    const newTokenNum = 120 + centreBookings.length + 1;
    const newId = this.bookings.length + 1;

    const farmersAhead = Math.max(0, newTokenNum - this.nowServingToken);
    const estWait = Math.max(2, Math.ceil((farmersAhead * (centre?.avg_processing_mins || 4)) / (centre?.active_counters || 4)));

    let totalQuantity = 0;
    let totalValuation = 0;
    const cropItems: BookingCropItem[] = [];

    data.items.forEach(item => {
      const crop = this.crops.find(c => c.id === item.cropId);
      const msp = crop?.msp_price_per_quintal || 2300;
      const subtotal = parseFloat((item.quantity * msp).toFixed(2));
      totalQuantity += item.quantity;
      totalValuation += subtotal;

      cropItems.push({
        crop_id: item.cropId,
        crop_name: crop?.name || 'Crop',
        variety: crop?.variety || 'Standard',
        quantity: item.quantity,
        msp_price: msp,
        total_amount: subtotal
      });
    });

    const primaryCrop = cropItems[0];

    const newBooking: Booking = {
      id: newId,
      farmer_id: farmer ? farmer.id : 1,
      centre_id: data.centreId,
      crop_id: primaryCrop ? primaryCrop.crop_id : 1,
      quantity: totalQuantity,
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
      crop_name: cropItems.length > 1 ? `${cropItems[0].crop_name} + ${cropItems.length - 1} more` : cropItems[0]?.crop_name || 'Paddy',
      variety: cropItems[0]?.variety || 'Sona Masoori',
      msp_price: cropItems[0]?.msp_price || 2369,
      total_valuation: totalValuation,
      crop_items: cropItems,
      queue_position: farmersAhead,
      estimated_wait_time: estWait
    };

    this.bookings.unshift(newBooking);

    // Update centre statistics
    if (centre) {
      centre.booked_slots = (centre.booked_slots || 0) + 1;
      centre.available_slots = Math.max(0, centre.daily_capacity - centre.booked_slots);
      centre.current_queue = (centre.current_queue || 0) + 1;
    }

    // Add Notification & SMS Alert
    const notification: Notification = {
      id: this.notifications.length + 1,
      user_id: data.farmerId,
      title: 'Booking Confirmed!',
      message: `Your token #${newTokenNum} (${totalQuantity} Qtl across ${cropItems.length} crop(s)) at ${centre?.name} is confirmed for ${data.bookingDate} (${data.slotStart} – ${data.slotEnd}). Total Est. MSP: ₹${totalValuation.toLocaleString('en-IN')}`,
      type: 'BOOKING',
      read: false,
      created_at: new Date().toISOString()
    };
    this.notifications.unshift(notification);
    this.lastSMS = notification;

    this.notify();
    return newBooking;
  }

  // Single Crop fallback
  public createBooking(data: {
    farmerId: number;
    centreId: number;
    cropId: number;
    quantity: number;
    bookingDate: string;
    slotStart: string;
    slotEnd: string;
  }): Booking {
    return this.createMultiCropBooking({
      farmerId: data.farmerId,
      centreId: data.centreId,
      items: [{ cropId: data.cropId, quantity: data.quantity }],
      bookingDate: data.bookingDate,
      slotStart: data.slotStart,
      slotEnd: data.slotEnd
    });
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

        const farmerNotification: Notification = {
          id: this.notifications.length + 1,
          user_id: b.farmer_id,
          title: 'Token Called to Counter!',
          message: `Token #${b.token_number} (${b.farmer_name}) is now being served at Counter 1. Please proceed for weighing & moisture inspection.`,
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

  // Calculate intelligent GPS / location recommendation score
  public getCentreRecommendations(
    districtOrLoc?: string | { latitude: number; longitude: number },
    cropId?: number
  ): RecommendationResult[] {
    let userLat = 16.3067;
    let userLon = 80.4365;
    let userDistrict = 'Guntur';

    if (typeof districtOrLoc === 'object' && districtOrLoc !== null) {
      userLat = districtOrLoc.latitude;
      userLon = districtOrLoc.longitude;
    } else if (typeof districtOrLoc === 'string') {
      userDistrict = districtOrLoc;
      const foundCentre = this.centres.find(c => c.district.toLowerCase() === districtOrLoc.toLowerCase());
      if (foundCentre) {
        userLat = foundCentre.latitude;
        userLon = foundCentre.longitude;
      }
    } else if (this.userLocation) {
      userLat = this.userLocation.latitude;
      userLon = this.userLocation.longitude;
      if (this.userLocation.district) userDistrict = this.userLocation.district;
    }

    return this.centres.map(centre => {
      const dist = calculateDistanceKm(userLat, userLon, centre.latitude, centre.longitude);
      const isDistrictMatch = centre.district.toLowerCase() === userDistrict.toLowerCase();
      const currentQueue = centre.current_queue || 14;
      const waitTime = Math.max(2, Math.ceil((currentQueue * centre.avg_processing_mins) / centre.active_counters));
      const avail = Math.max(0, centre.daily_capacity - (centre.booked_slots || 300));

      let score = 100;
      // Proximity scoring
      if (dist <= 10) score += 15;
      else if (dist <= 30) score += 5;
      else score -= Math.min(35, Math.round((dist - 30) * 0.5));

      if (isDistrictMatch) score += 10;
      score -= Math.min(30, currentQueue * 1.0);
      score -= Math.min(20, waitTime * 0.4);
      if (avail < 50) score -= 20;

      return {
        centre,
        distanceKm: dist,
        estimatedWaitMins: waitTime,
        availableSlots: avail,
        score: Math.max(10, Math.min(99, Math.round(score))),
        reasons: [
          dist <= 15 ? `📍 ${dist} km away (Nearby)` : `📍 ${dist} km away`,
          currentQueue < 15 ? '✓ Short live queue' : '⚠️ Moderate/High queue load',
          avail > 50 ? '✓ Slots readily available' : '⚠️ Limited slot capacity',
          `AI Estimated wait time: ${waitTime} min`
        ]
      };
    }).sort((a, b) => b.score - a.score);
  }
}

export const localState = new LocalStateStore();

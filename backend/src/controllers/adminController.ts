import { Request, Response } from 'express';
import { mockStore } from '../store/mockStore';

export const getAdminStatistics = (req: Request, res: Response) => {
  const totalFarmers = 12845 + mockStore.farmers.length;
  const todayBookings = 1284 + mockStore.bookings.length;
  const procurementCompleted = 932 + mockStore.procurementRecords.length;
  const pendingPaymentsLakhs = 24.8;
  const avgWaitTimeMins = 32;

  // Chart data 1: Daily procurement volume (Quintals)
  const dailyVolumeChart = [
    { date: '22 Aug', Paddy: 4200, Wheat: 3100, Cotton: 1200 },
    { date: '23 Aug', Paddy: 4800, Wheat: 3400, Cotton: 1400 },
    { date: '24 Aug', Paddy: 5100, Wheat: 2900, Cotton: 1600 },
    { date: '25 Aug', Paddy: 5600, Wheat: 3800, Cotton: 1800 },
    { date: '26 Aug', Paddy: 6200, Wheat: 4100, Cotton: 2100 },
    { date: '27 Aug', Paddy: 6900, Wheat: 4500, Cotton: 2400 },
    { date: '28 Aug', Paddy: 7400, Wheat: 4900, Cotton: 2600 }
  ];

  // Chart data 2: Centre-wise queue length
  const centreQueueChart = mockStore.centres.map(c => {
    const centreBookings = mockStore.bookings.filter(b => b.centre_id === c.id);
    const waiting = centreBookings.filter(b => b.status === 'WAITING' || b.status === 'ARRIVED');
    return {
      name: c.name.replace(' Procurement Centre', '').replace(' Agricultural', ''),
      queueLength: waiting.length + (c.id * 7),
      capacity: c.daily_capacity,
      status: c.status
    };
  });

  // Chart data 3: Payment status distribution
  const paymentDistributionChart = [
    { name: 'Paid (DBT Completed)', value: 68, amount: '₹1.68 Cr' },
    { name: 'Processing (Bank Verification)', value: 24, amount: '₹58.4 Lakh' },
    { name: 'Pending Approvals', value: 8, amount: '₹19.2 Lakh' }
  ];

  // Chart data 4: Crop distribution
  const cropDistributionChart = [
    { name: 'Paddy', percentage: 48, volume: '14,250 Q' },
    { name: 'Wheat', percentage: 26, volume: '7,800 Q' },
    { name: 'Cotton', percentage: 14, volume: '4,100 Q' },
    { name: 'Maize', percentage: 8, volume: '2,400 Q' },
    { name: 'Groundnut', percentage: 4, volume: '1,200 Q' }
  ];

  return res.json({
    success: true,
    kpi: {
      totalFarmers,
      todayBookings,
      procurementCompleted,
      pendingPaymentsLakhs,
      avgWaitTimeMins
    },
    charts: {
      dailyVolumeChart,
      centreQueueChart,
      paymentDistributionChart,
      cropDistributionChart
    }
  });
};

export const getAdminCentresList = (req: Request, res: Response) => {
  const centresMatrix = mockStore.centres.map(c => {
    const centreBookings = mockStore.bookings.filter(b => b.centre_id === c.id);
    const waiting = centreBookings.filter(b => b.status === 'WAITING' || b.status === 'ARRIVED');
    const totalBooked = centreBookings.length + (c.id === 5 ? 385 : 240);
    const util = Math.min(100, Math.round((totalBooked / c.daily_capacity) * 100));

    let status = c.status;
    if (util >= 90) status = 'OVERLOADED';
    else if (util >= 75) status = 'HIGH_LOAD';

    return {
      id: c.id,
      name: c.name,
      district: c.district,
      daily_capacity: c.daily_capacity,
      booked_slots: totalBooked,
      current_queue: waiting.length + (c.id * 5),
      utilization_percent: util,
      status,
      active_counters: c.active_counters
    };
  });

  return res.json({ success: true, centres: centresMatrix });
};

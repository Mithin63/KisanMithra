"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.smartQueueService = exports.SmartQueueService = void 0;
class SmartQueueService {
    /**
     * Calculates estimated waiting time based on queue length, counters, and average processing time
     */
    calculateWaitingTime(peopleAhead, avgProcessingMins = 4, activeCounters = 4) {
        if (peopleAhead <= 0)
            return 0;
        const effectiveCounters = Math.max(1, activeCounters);
        const totalMinutes = Math.ceil((peopleAhead * avgProcessingMins) / effectiveCounters);
        return Math.max(2, totalMinutes);
    }
    /**
     * Calculates centre load score and status
     */
    calculateCentreLoad(bookedSlots, dailyCapacity) {
        const utilization = Math.min(100, Math.round((bookedSlots / Math.max(1, dailyCapacity)) * 100));
        let status = 'NORMAL';
        if (utilization >= 90) {
            status = 'OVERLOADED';
        }
        else if (utilization >= 75) {
            status = 'HIGH_LOAD';
        }
        return { utilization, status };
    }
    /**
     * Ranks centres by distance, queue length, capacity, and estimated wait time
     */
    recommendCentre(farmerDistrict, centres) {
        return centres.map(centre => {
            // District match boost
            const districtMatch = centre.district.toLowerCase() === farmerDistrict.toLowerCase();
            const distanceKm = districtMatch ? 5.2 : 18.4;
            const currentQueue = centre.current_queue || 12;
            const waitTime = this.calculateWaitingTime(currentQueue, centre.avg_processing_mins, centre.active_counters);
            const capacityAvailable = centre.daily_capacity - (centre.booked_slots || 300);
            // Score calculation (higher is better)
            let score = 100;
            if (!districtMatch)
                score -= 30;
            score -= Math.min(40, currentQueue * 1.5);
            score -= Math.min(20, waitTime * 0.5);
            if (capacityAvailable <= 50)
                score -= 25;
            return {
                centre,
                distanceKm,
                estimatedWaitMins: waitTime,
                availableSlots: Math.max(0, capacityAvailable),
                score: Math.max(10, Math.round(score)),
                reasons: [
                    currentQueue < 20 ? '✓ Shorter live queue' : '⚠️ Heavy queue load',
                    capacityAvailable > 50 ? '✓ Slots readily available' : '⚠️ Limited slot availability',
                    `${distanceKm} km from your village location`,
                    `Estimated waiting time: ${waitTime} minutes`
                ]
            };
        }).sort((a, b) => b.score - a.score);
    }
}
exports.SmartQueueService = SmartQueueService;
exports.smartQueueService = new SmartQueueService();

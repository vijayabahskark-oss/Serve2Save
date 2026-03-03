const { getDistance } = require('../utils/haversine');
const { calculateScore } = require('../utils/scoreCalculator');

function determineRadius(minutes) {
    if (minutes > 180) return 25;
    if (minutes > 120) return 18;
    if (minutes > 60) return 12;
    if (minutes > 30) return 10;
    return 8;
}

function findBestMatch(listing, ngos) {
    if (!listing || !ngos) {
        throw new Error("Invalid input to matching service");
    }

    const timeRemainingMinutes =
        (listing.expiryTime - Date.now()) / (1000 * 60);

    if (timeRemainingMinutes <= 0) {
        return [];
    }

    const radius = determineRadius(timeRemainingMinutes);

    const rankedNGOs = ngos
        .map(ngo => {
            const distance = getDistance(
                listing.lat,
                listing.lon,
                ngo.lat,
                ngo.lon
            );

            if (distance > radius) {
                return null;
            }

            // ---------------- BASE SCORE ----------------
            const baseScore = calculateScore(
                distance,
                radius,
                ngo.reliability || 0.8,
                ngo.capacityRatio || 0.8
            );

            // ---------------- FAIRNESS PENALTIES ----------------

            // Soft daily load balancing
            const dailyLoadPenalty = (ngo.matchesToday || 0) * 0.05;

            // Cooldown penalty if matched recently
            let cooldownPenalty = 0;

            if (ngo.lastMatchTime) {
                const minutesSinceLastMatch =
                    (Date.now() - new Date(ngo.lastMatchTime).getTime()) / (1000 * 60);

                if (minutesSinceLastMatch < 30) {
                    cooldownPenalty = 0.15;
                }
            }

            // Final adjusted score
            const finalScore = baseScore - dailyLoadPenalty - cooldownPenalty;

            return {
                id: ngo.id,
                name: ngo.name,
                distance: Number(distance.toFixed(2)),
                score: Number(finalScore.toFixed(3)),
                baseScore: Number(baseScore.toFixed(3)),
                matchesToday: ngo.matchesToday || 0
            };
        })
        .filter(Boolean)
        .sort((a, b) => b.score - a.score);

    return rankedNGOs;
}

module.exports = { findBestMatch };

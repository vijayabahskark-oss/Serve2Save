const { getDistance } = require('./utils/haversine');
const { calculateScore } = require('./utils/scoreCalculator');

// ---- Simulated Hotel Listing ----
const listing = {
    lat: 12.9716,
    lon: 77.5946,
    expiryTime: Date.now() + (90 * 60 * 1000) // 90 minutes from now
};

// ---- Simulated NGOs ----
const ngos = [
    { name: "NGO A", lat: 12.9352, lon: 77.6245, reliability: 0.9, capacityRatio: 0.8 },
    { name: "NGO B", lat: 12.9900, lon: 77.6100, reliability: 0.95, capacityRatio: 1.0 },
    { name: "NGO C", lat: 12.9600, lon: 77.5800, reliability: 0.6, capacityRatio: 0.6 }
];

// ---- Step 1: Compute Time Remaining ----
const timeRemainingMinutes = (listing.expiryTime - Date.now()) / (1000 * 60);

// ---- Step 2: Determine Dynamic Radius ----
function determineRadius(minutes) {
    if (minutes > 120) return 20;
    if (minutes > 60) return 12;
    if (minutes > 30) return 8;
    return 5;
}

const radius = determineRadius(timeRemainingMinutes);

console.log("Time Remaining:", Math.floor(timeRemainingMinutes), "minutes");
console.log("Search Radius:", radius, "km");

// ---- Step 3: Compute Scores ----
const rankedNGOs = ngos
    .map(ngo => {
        const distance = getDistance(
            listing.lat,
            listing.lon,
            ngo.lat,
            ngo.lon
        );

        if (distance > radius) return null; // outside radius

        const score = calculateScore(
            distance,
            radius,
            ngo.reliability,
            ngo.capacityRatio
        );

        return {
            name: ngo.name,
            distance: Number(distance.toFixed(2)),
            score
        };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);

// ---- Step 4: Output Ranking ----
console.log("\nRanked NGOs:");
rankedNGOs.forEach((ngo, index) => {
    console.log(
        `${index + 1}. ${ngo.name} | Distance: ${ngo.distance} km | Score: ${ngo.score}`
    );
});
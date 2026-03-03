function clamp(value, min = 0, max = 1) {
    return Math.max(min, Math.min(max, value));
}

function calculateScore(distance, radius, reliability, capacityRatio) {
    if (radius <= 0) {
        throw new Error("Radius must be greater than zero");
    }

    const distanceScore = clamp(1 - (distance / radius));
    const reliabilityScore = clamp(reliability);
    const demandScore = clamp(capacityRatio);

    const wDistance = 0.5;
    const wReliability = 0.3;
    const wDemand = 0.2;

    const finalScore =
        wDistance * distanceScore +
        wReliability * reliabilityScore +
        wDemand * demandScore;

    return Number(finalScore.toFixed(4));
}

module.exports = { calculateScore };

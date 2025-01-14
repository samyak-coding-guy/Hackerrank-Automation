const formatTimeToHHMMSS = (timeText) => {
    const daysMatch = timeText.match(/^(\d+)\s+days?$/); // "X days"
    const hoursMatch = timeText.match(/^(\d+)\s+hours?$/); // "X hours"
    const minutesMatch = timeText.match(/^(\d+)\s+minutes?$/); // "X minutes"

    let totalSeconds = 0;

    // Process days if matched
    if (daysMatch) {
        const days = parseInt(daysMatch[1], 10);
        totalSeconds += days * 24 * 60 * 60; // Convert days to seconds
    }

    // Process hours if matched
    if (hoursMatch) {
        const hours = parseInt(hoursMatch[1], 10);
        totalSeconds += hours * 60 * 60; // Convert hours to seconds
    }

    // Process minutes if matched
    if (minutesMatch) {
        const minutes = parseInt(minutesMatch[1], 10);
        totalSeconds += minutes * 60; // Convert minutes to seconds
    }

    // Convert total seconds to hours, minutes, and seconds
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // Excel understands time as a fraction of a day (1 = 24 hours)
    return hours / 24 + minutes / (24 * 60) + seconds / (24 * 60 * 60);
};

module.exports = formatTimeToHHMMSS;

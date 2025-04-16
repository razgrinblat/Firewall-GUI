 //statsController
 let stats = {};

/**
 * Merges new stats data into the existing stats.
 */
function updateStats(newStats)
{
  // Merge new stats with the current stats
  stats = newStats;
}
/**
 * Returns the current stats.
 */
function getStats()
{
  return stats;
}

module.exports = {
  updateStats,
  getStats,
};

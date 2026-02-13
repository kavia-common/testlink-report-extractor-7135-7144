/**
 * Utility helpers for formatting/cleaning Test Case titles before rendering/export.
 */

/**
 * PUBLIC_INTERFACE
 * Strip any leading prefix that starts with "[CM]" and ends at the first ":" (inclusive),
 * then trims leading whitespace of the remaining string.
 *
 * Example:
 *  - "[CM]-49429:16. #61741..." -> "16. #61741..."
 *
 * Rules:
 *  - Only applies when the first non-whitespace characters are exactly "[CM]".
 *  - Removes everything from that "[CM]" up to and including the first ":" found after it.
 *  - If no ":" exists after "[CM]", returns the original string unchanged (to avoid truncation).
 *
 * @param {unknown} title - Raw title (string-like).
 * @returns {string} Cleaned title for UI/export.
 */
export function stripCmPrefix(title) {
  if (title == null) return "";

  const s = String(title);

  // Only strip if the first non-whitespace characters begin with "[CM]"
  const trimmedLeft = s.replace(/^\s+/, "");
  if (!trimmedLeft.startsWith("[CM]")) return s;

  // Remove from the "[CM]" start up to and including the first ":"
  const firstColonIdx = trimmedLeft.indexOf(":");
  if (firstColonIdx === -1) return s;

  return trimmedLeft.slice(firstColonIdx + 1).replace(/^\s+/, "");
}

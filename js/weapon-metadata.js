/**
 * Special Weapon Metadata and Rules
 * Centralized registry for weapons with non-standard behavior
 */

/**
 * Registry of weapons that require special handling
 * These weapons always show condition columns regardless of potency differences
 */
const WEAPON_SPECIAL_RULES = {
  "Bahamut Greatsword": {
    forceShowCondition: true,
    reason: "Variable potency based on HP threshold"
  },
  "Sabin's Claws": {
    forceShowCondition: true,
    reason: "Multi-hit with conditional bonus"
  },
  "Blade of the Worthy": {
    forceShowCondition: true,
    reason: "Stacking damage buff mechanic"
  },
  "Umbral Blade": {
    forceShowCondition: true,
    reason: "Darkness-dependent potency scaling"
  }
};

/**
 * Check if weapon should display condition column
 * @param {string} weaponName - Name of the weapon
 * @param {number} pot - Base potency value
 * @param {number} maxPot - Maximum potency value
 * @returns {boolean} True if condition should be shown
 */
function shouldShowCondition(weaponName, pot, maxPot) {
  // Check special rules first - these weapons always show conditions
  if (WEAPON_SPECIAL_RULES[weaponName]?.forceShowCondition) {
    return true;
  }

  // Standard logic: show condition if has potency increase
  return maxPot > pot;
}

/**
 * Get weapon condition text from effect1 or effect2
 * Checks which effect contains "DMG" keyword to determine correct condition
 * @param {Array<Object>} weapon - Weapon data object (array of {name, value} pairs)
 * @returns {string} Condition text
 */
function getWeaponCondition(weapon) {
  // Check if DMG condition is in effect1 or effect2
  if (findWeaponWithProperty(weapon, 'effect1', "DMG")) {
    return getValueFromDatabaseItem(weapon, "condition1");
  }
  return getValueFromDatabaseItem(weapon, "condition2");
}

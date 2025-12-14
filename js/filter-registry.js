/**
 * Filter Registry - Configuration-Driven Filter System
 *
 * Consolidates 27+ filter functions into a single registry.
 * Each filter is defined by its configuration rather than duplicate code.
 */

/**
 * Filter configuration registry
 * Each entry defines a filter with its type and parameters
 */
const FILTER_CONFIGS = {
  // Element filters
  'filterFire': {
    type: 'element',
    params: ['Fire']
  },
  'filterIce': {
    type: 'element',
    params: ['Ice']
  },
  'filterLightning': {
    type: 'element',
    params: ['Lightning']
  },
  'filterWater': {
    type: 'element',
    params: ['Water']
  },
  'filterWind': {
    type: 'element',
    params: ['Wind']
  },
  'filterEarth': {
    type: 'element',
    params: ['Earth']
  },
  'filterNonElem': {
    type: 'element',
    params: ['None']
  },

  // Limited/Gacha filter
  'filterLimited': {
    type: 'limited',
    params: ['', 'Limited/Crossover Weapons:']
  },

  // Stat debuff filters
  'filterMatkDown': {
    type: 'statEffect',
    params: ['[Debuff] MATK', 'Weapon with [Debuff] MATK:']
  },
  'filterPatkDown': {
    type: 'statEffect',
    params: ['[Debuff] PATK', 'Weapon with [Debuff] PATK:']
  },
  'filterPdefDown': {
    type: 'statEffect',
    params: ['[Debuff] PDEF', 'Weapon with [Debuff] PDEF:']
  },
  'filterMdefDown': {
    type: 'statEffect',
    params: ['[Debuff] MDEF', 'Weapon with [Debuff] MDEF:']
  },

  // Stat buff filters
  'filterPatkUp': {
    type: 'statEffect',
    params: ['[Buff] PATK', 'Weapon with [Buff] PATK:']
  },
  'filterMatkUp': {
    type: 'statEffect',
    params: ['[Buff] MATK', 'Weapon with [Buff] MATK:']
  },
  'filterPdefUp': {
    type: 'statEffect',
    params: ['[Buff] PDEF', 'Weapon with [Buff] PDEF:']
  },
  'filterMdefUp': {
    type: 'statEffect',
    params: ['[Buff] MDEF', 'Weapon with [Buff] MDEF:']
  },

  // Exploit weakness
  'filterExploitWeakness': {
    type: 'statEffect',
    params: ['[Buff] Weakness', 'Exploit Weakness Weapon:']
  },

  // Materia slot filters
  'filterCircleSigilMateria': {
    type: 'materiaSlot',
    params: ['Circle', 'Weapon with ◯ Sigil Materia Slot:']
  },
  'filterTriangleSigilMateria': {
    type: 'materiaSlot',
    params: ['Triangle', 'Weapon with △ Sigil Materia Slot:']
  },
  'filterXSigilMateria': {
    type: 'materiaSlot',
    params: ['X Sigil', 'Weapon with ✕ Sigil Materia Slot:']
  },

  // Diamond sigil filter (special case)
  'filterDiamondMateria': {
    type: 'diamondSigil',
    params: ['Diamond', 'Weapon with ◊ Sigil:']
  },

  // Composite filters (multiple tables)
  'filterHeal': {
    type: 'composite',
    tables: [
      { func: 'printWeaponElem', params: ['Heal', 'Non-Regen Healing Weapon (> 25% Potency):'] },
      { func: 'printRegenWeapon', params: ['Regen Healing Weapon:'] },
      { func: 'printWeaponMateria', params: ['All (Cure)', 'Weapon with All (Cure) Materia Slot:'] }
    ]
  },
  'filterProvoke': {
    type: 'composite',
    tables: [
      { func: 'printWeaponEffect', params: ['[Buff] Provoke', 'Provoke Weapon:'] },
      { func: 'printWeaponEffect', params: ['[Buff] Veil', 'Veil Weapon:'] }
    ]
  },
  'filterUniqueEffect': {
    type: 'composite',
    tables: [
      { func: 'printWeaponUniqueEffect', params: ['[Status Apply]', 'Weapon Applying Status:'] },
      { func: 'printWeaponUniqueEffect', params: ['[Status Cleanse]', 'Weapon Removing Status:'] },
      { func: 'printWeaponUniqueEffect', params: ['[Dispel', 'Weapon with Dispel Effect:'] },
      { func: 'printWeaponEffect', params: ['Haste', 'Weapon with Haste Effect:'] },
      { func: 'printWeaponEffect', params: ['Increases Command Gauge', 'Weapon with Increase Command Gauge Effect:'] }
    ]
  }
};

/**
 * Execute a filter by its key
 * @param {string} filterKey - The filter function name (e.g., 'filterFire')
 */
function executeFilterByKey(filterKey) {
  const config = FILTER_CONFIGS[filterKey];

  if (!config) {
    console.error(`Unknown filter: ${filterKey}`);
    return;
  }

  switch (config.type) {
    case 'element':
      filterByElement(config.params[0]);
      break;

    case 'limited':
      closeDropdown();
      readDatabase(function() {
        document.getElementById('Output').innerHTML = '';
        printLimitedWeapon(config.params[0], config.params[1]);
      });
      break;

    case 'statEffect':
      filterStatEffect(config.params[0], config.params[1]);
      break;

    case 'materiaSlot':
      filterMateriaSlot(config.params[0], config.params[1]);
      break;

    case 'diamondSigil':
      closeDropdown();
      readDatabase(function() {
        document.getElementById('Output').innerHTML = '';
        printWeaponSigil(config.params[0], config.params[1]);
      });
      break;

    case 'composite':
      closeDropdown();
      readDatabase(function() {
        document.getElementById('Output').innerHTML = '';
        config.tables.forEach(table => {
          const func = window[table.func];
          if (func) {
            func(...table.params);
          }
        });
      });
      break;

    default:
      console.error(`Unknown filter type: ${config.type}`);
  }
}

/**
 * Generate global filter functions from registry
 * This preserves onclick handlers in HTML without modification
 */
(function initializeFilters() {
  // Expose FILTER_CONFIGS to global scope for testing
  window.FILTER_CONFIGS = FILTER_CONFIGS;
  window.executeFilterByKey = executeFilterByKey;

  Object.keys(FILTER_CONFIGS).forEach(filterKey => {
    // Create global function that delegates to executeFilterByKey
    window[filterKey] = function() {
      executeFilterByKey(filterKey);
    };
  });
})();

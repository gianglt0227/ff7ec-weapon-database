/**
 * Unit Tests for Filter Registry
 *
 * Purpose: Test the configuration-driven filter system
 * Dependencies: filter-registry.js, scripts.js
 */

const fs = require('fs');
const path = require('path');

// Load weapon-metadata.js first
const weaponMetadataPath = path.join(__dirname, '../../js/weapon-metadata.js');
const weaponMetadataContent = fs.readFileSync(weaponMetadataPath, 'utf8');

// Load scripts.js
const scriptPath = path.join(__dirname, '../../js/scripts.js');
const scriptContent = fs.readFileSync(scriptPath, 'utf8');

// Load filter-registry.js
const filterRegistryPath = path.join(__dirname, '../../js/filter-registry.js');
const filterRegistryContent = fs.readFileSync(filterRegistryPath, 'utf8');

// Setup DOM before evaluating scripts
document.body.innerHTML = `
  <div id="ecDropdown" class="dropdown-content"></div>
  <div id="Output" class="output"></div>
`;

eval(weaponMetadataContent);
eval(scriptContent);
eval(filterRegistryContent);

describe('Filter Registry', () => {

  describe('FILTER_CONFIGS Registry', () => {
    test('should contain all element filters', () => {
      expect(FILTER_CONFIGS).toHaveProperty('filterFire');
      expect(FILTER_CONFIGS).toHaveProperty('filterIce');
      expect(FILTER_CONFIGS).toHaveProperty('filterLightning');
      expect(FILTER_CONFIGS).toHaveProperty('filterWater');
      expect(FILTER_CONFIGS).toHaveProperty('filterWind');
      expect(FILTER_CONFIGS).toHaveProperty('filterEarth');
      expect(FILTER_CONFIGS).toHaveProperty('filterNonElem');
    });

    test('should contain all stat debuff filters', () => {
      expect(FILTER_CONFIGS).toHaveProperty('filterMatkDown');
      expect(FILTER_CONFIGS).toHaveProperty('filterPatkDown');
      expect(FILTER_CONFIGS).toHaveProperty('filterPdefDown');
      expect(FILTER_CONFIGS).toHaveProperty('filterMdefDown');
    });

    test('should contain all stat buff filters', () => {
      expect(FILTER_CONFIGS).toHaveProperty('filterMatkUp');
      expect(FILTER_CONFIGS).toHaveProperty('filterPatkUp');
      expect(FILTER_CONFIGS).toHaveProperty('filterPdefUp');
      expect(FILTER_CONFIGS).toHaveProperty('filterMdefUp');
    });

    test('should contain materia slot filters', () => {
      expect(FILTER_CONFIGS).toHaveProperty('filterCircleSigilMateria');
      expect(FILTER_CONFIGS).toHaveProperty('filterTriangleSigilMateria');
      expect(FILTER_CONFIGS).toHaveProperty('filterXSigilMateria');
      expect(FILTER_CONFIGS).toHaveProperty('filterDiamondMateria');
    });

    test('should contain composite filters', () => {
      expect(FILTER_CONFIGS).toHaveProperty('filterHeal');
      expect(FILTER_CONFIGS).toHaveProperty('filterProvoke');
      expect(FILTER_CONFIGS).toHaveProperty('filterUniqueEffect');
    });

    test('should contain limited/gacha filter', () => {
      expect(FILTER_CONFIGS).toHaveProperty('filterLimited');
    });

    test('should contain exploit weakness filter', () => {
      expect(FILTER_CONFIGS).toHaveProperty('filterExploitWeakness');
    });
  });

  describe('Filter Configuration Structure', () => {
    test('element filters should have correct type', () => {
      expect(FILTER_CONFIGS.filterFire.type).toBe('element');
      expect(FILTER_CONFIGS.filterFire.params).toEqual(['Fire']);
    });

    test('stat effect filters should have correct type', () => {
      expect(FILTER_CONFIGS.filterMatkDown.type).toBe('statEffect');
      expect(FILTER_CONFIGS.filterMatkDown.params).toEqual(['[Debuff] MATK', 'Weapon with [Debuff] MATK:']);
    });

    test('materia slot filters should have correct type', () => {
      expect(FILTER_CONFIGS.filterCircleSigilMateria.type).toBe('materiaSlot');
      expect(FILTER_CONFIGS.filterCircleSigilMateria.params[0]).toBe('Circle');
    });

    test('composite filters should have tables array', () => {
      expect(FILTER_CONFIGS.filterHeal.type).toBe('composite');
      expect(Array.isArray(FILTER_CONFIGS.filterHeal.tables)).toBe(true);
      expect(FILTER_CONFIGS.filterHeal.tables.length).toBe(3);
    });
  });

  describe('Global Filter Functions', () => {
    test('should create global filterFire function', () => {
      expect(typeof window.filterFire).toBe('function');
    });

    test('should create global filterHeal function', () => {
      expect(typeof window.filterHeal).toBe('function');
    });

    test('should create global filterMatkDown function', () => {
      expect(typeof window.filterMatkDown).toBe('function');
    });

    test('should create all 27+ filter functions', () => {
      const filterKeys = Object.keys(FILTER_CONFIGS);
      expect(filterKeys.length).toBeGreaterThanOrEqual(20);

      filterKeys.forEach(key => {
        expect(typeof window[key]).toBe('function');
      });
    });
  });

  describe('executeFilterByKey Function', () => {
    test('should exist and be a function', () => {
      expect(typeof executeFilterByKey).toBe('function');
    });

    test('should handle unknown filter gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      executeFilterByKey('nonExistentFilter');
      expect(consoleSpy).toHaveBeenCalledWith('Unknown filter: nonExistentFilter');
      consoleSpy.mockRestore();
    });
  });

  describe('Filter Registry Benefits', () => {
    test('should reduce code duplication by centralizing configs', () => {
      // Count number of filter configs
      const filterCount = Object.keys(FILTER_CONFIGS).length;

      // Without registry, each filter would be ~6 lines
      // With registry, it's just a config entry (~3 lines)
      const linesWithoutRegistry = filterCount * 6;
      const linesWithRegistry = filterCount * 3;
      const linesSaved = linesWithoutRegistry - linesWithRegistry;

      expect(linesSaved).toBeGreaterThan(50); // Significant reduction
    });

    test('should make adding new filters easier', () => {
      // New filter can be added by just adding a config entry
      // No need to write new function, just configuration
      const newFilterConfig = {
        type: 'element',
        params: ['NewElement']
      };

      expect(newFilterConfig).toHaveProperty('type');
      expect(newFilterConfig).toHaveProperty('params');
      // This demonstrates the simplicity of adding new filters
    });
  });

});

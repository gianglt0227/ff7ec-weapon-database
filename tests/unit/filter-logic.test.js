/**
 * Unit Tests for Filter Logic Functions
 *
 * Purpose: Test findWeaponWithProperty function
 * Dependencies: scripts.js
 */

const fs = require('fs');
const path = require('path');
const scriptPath = path.join(__dirname, '../../scripts.js');
const scriptContent = fs.readFileSync(scriptPath, 'utf8');

// Setup DOM before evaluating scripts.js
document.body.innerHTML = `
  <div id="ecDropdown" class="dropdown-content"></div>
  <div id="Output" class="output"></div>
`;

eval(scriptContent);

const { createMockWeapon } = require('../fixtures/mock-weapon-data');

describe('Filter Logic - findWeaponWithProperty', () => {

  describe('Basic Substring Matching', () => {
    test('should find exact match', () => {
      const weaponData = createMockWeapon({ element: 'Fire' });
      const result = findWeaponWithProperty(weaponData, 'element', 'Fire');

      expect(result).toBe(true);
    });

    test('should find partial match (substring)', () => {
      const weaponData = createMockWeapon({ effect1: '[Debuff] PDEF -' });
      const result = findWeaponWithProperty(weaponData, 'effect1', 'Debuff');

      expect(result).toBe(true);
    });

    test('should find match at beginning of string', () => {
      const weaponData = createMockWeapon({ effect1: '[Buff] PATK +' });
      const result = findWeaponWithProperty(weaponData, 'effect1', '[Buff]');

      expect(result).toBe(true);
    });

    test('should find match at end of string', () => {
      const weaponData = createMockWeapon({ support3: 'DMG +20% (Phys.)' });
      const result = findWeaponWithProperty(weaponData, 'support3', '(Phys.)');

      expect(result).toBe(true);
    });

    test('should find match in middle of string', () => {
      const weaponData = createMockWeapon({ name: 'Ultimate Weapon' });
      const result = findWeaponWithProperty(weaponData, 'name', 'Ultimate');

      expect(result).toBe(true);
    });
  });

  describe('Case Sensitivity', () => {
    test('should be case-sensitive (exact case match)', () => {
      const weaponData = createMockWeapon({ element: 'Fire' });
      const result = findWeaponWithProperty(weaponData, 'element', 'Fire');

      expect(result).toBe(true);
    });

    test('should not match different case', () => {
      const weaponData = createMockWeapon({ element: 'Fire' });
      const result = findWeaponWithProperty(weaponData, 'element', 'fire');

      expect(result).toBe(false);
    });

    test('should not match uppercase when lowercase in data', () => {
      const weaponData = createMockWeapon({ type: 'Phys.' });
      const result = findWeaponWithProperty(weaponData, 'type', 'PHYS.');

      expect(result).toBe(false);
    });
  });

  describe('No Match Cases', () => {
    test('should return false when substring not found', () => {
      const weaponData = createMockWeapon({ element: 'Fire' });
      const result = findWeaponWithProperty(weaponData, 'element', 'Ice');

      expect(result).toBe(false);
    });

    test('should return false for non-existent property', () => {
      const weaponData = createMockWeapon({ name: 'Test' });
      const result = findWeaponWithProperty(weaponData, 'nonexistent', 'value');

      expect(result).toBe(false);
    });

    test('should return false when property is empty string', () => {
      const weaponData = createMockWeapon({ effect2: '' });
      const result = findWeaponWithProperty(weaponData, 'effect2', 'something');

      expect(result).toBe(false);
    });
  });

  describe('Special Characters and Patterns', () => {
    test('should match patterns with brackets', () => {
      const weaponData = createMockWeapon({ effect1: '[Debuff] PDEF -' });
      const result = findWeaponWithProperty(weaponData, 'effect1', '[Debuff]');

      expect(result).toBe(true);
    });

    test('should match patterns with parentheses', () => {
      const weaponData = createMockWeapon({ support1: 'DMG +20% (Mag.)' });
      const result = findWeaponWithProperty(weaponData, 'support1', '(Mag.)');

      expect(result).toBe(true);
    });

    test('should match unicode characters (sigils)', () => {
      const weaponData = createMockWeapon({ support3: '◯ Circle Sigil +2' });
      const result = findWeaponWithProperty(weaponData, 'support3', '◯');

      expect(result).toBe(true);
    });

    test('should match plus signs', () => {
      const weaponData = createMockWeapon({ effect1: '[Buff] PATK +' });
      const result = findWeaponWithProperty(weaponData, 'effect1', 'PATK +');

      expect(result).toBe(true);
    });

    test('should match minus signs', () => {
      const weaponData = createMockWeapon({ effect1: '[Debuff] PDEF -' });
      const result = findWeaponWithProperty(weaponData, 'effect1', 'PDEF -');

      expect(result).toBe(true);
    });

    test('should match percentage signs', () => {
      const weaponData = createMockWeapon({ support1: 'DMG +10%' });
      const result = findWeaponWithProperty(weaponData, 'support1', '%');

      expect(result).toBe(true);
    });
  });

  describe('Weapon Effect Patterns', () => {
    test('should match debuff patterns', () => {
      const weaponData = createMockWeapon({ effect1: '[Debuff] PATK -' });

      expect(findWeaponWithProperty(weaponData, 'effect1', '[Debuff] PATK')).toBe(true);
      expect(findWeaponWithProperty(weaponData, 'effect1', 'PATK -')).toBe(true);
      expect(findWeaponWithProperty(weaponData, 'effect1', 'Debuff')).toBe(true);
    });

    test('should match buff patterns', () => {
      const weaponData = createMockWeapon({ effect1: '[Buff] MATK +' });

      expect(findWeaponWithProperty(weaponData, 'effect1', '[Buff] MATK')).toBe(true);
      expect(findWeaponWithProperty(weaponData, 'effect1', 'MATK +')).toBe(true);
      expect(findWeaponWithProperty(weaponData, 'effect1', 'Buff')).toBe(true);
    });

    test('should match resist patterns', () => {
      const weaponData = createMockWeapon({ effect1: '[Resist] Thunder' });

      expect(findWeaponWithProperty(weaponData, 'effect1', '[Resist]')).toBe(true);
      expect(findWeaponWithProperty(weaponData, 'effect1', 'Thunder')).toBe(true);
    });

    test('should match enchant patterns', () => {
      const weaponData = createMockWeapon({ effect2: '[Enchant] Fire' });

      expect(findWeaponWithProperty(weaponData, 'effect2', '[Enchant]')).toBe(true);
      expect(findWeaponWithProperty(weaponData, 'effect2', 'Fire')).toBe(true);
    });

    test('should match heal patterns', () => {
      const weaponData = createMockWeapon({ effect1: '[Heal] Regen' });

      expect(findWeaponWithProperty(weaponData, 'effect1', '[Heal]')).toBe(true);
      expect(findWeaponWithProperty(weaponData, 'effect1', 'Regen')).toBe(true);
    });

    test('should match status patterns', () => {
      const weaponData = createMockWeapon({ effect1: '[Status Apply] Poison' });

      expect(findWeaponWithProperty(weaponData, 'effect1', '[Status Apply]')).toBe(true);
      expect(findWeaponWithProperty(weaponData, 'effect1', 'Poison')).toBe(true);
    });
  });

  describe('Element Matching', () => {
    test('should match Fire element', () => {
      const weaponData = createMockWeapon({ element: 'Fire' });
      expect(findWeaponWithProperty(weaponData, 'element', 'Fire')).toBe(true);
    });

    test('should match Ice element', () => {
      const weaponData = createMockWeapon({ element: 'Ice' });
      expect(findWeaponWithProperty(weaponData, 'element', 'Ice')).toBe(true);
    });

    test('should match Lightning element', () => {
      const weaponData = createMockWeapon({ element: 'Lightning' });
      expect(findWeaponWithProperty(weaponData, 'element', 'Lightning')).toBe(true);
    });

    test('should match Water element', () => {
      const weaponData = createMockWeapon({ element: 'Water' });
      expect(findWeaponWithProperty(weaponData, 'element', 'Water')).toBe(true);
    });

    test('should match Wind element', () => {
      const weaponData = createMockWeapon({ element: 'Wind' });
      expect(findWeaponWithProperty(weaponData, 'element', 'Wind')).toBe(true);
    });

    test('should match Earth element', () => {
      const weaponData = createMockWeapon({ element: 'Earth' });
      expect(findWeaponWithProperty(weaponData, 'element', 'Earth')).toBe(true);
    });

    test('should match None element', () => {
      const weaponData = createMockWeapon({ element: 'None' });
      expect(findWeaponWithProperty(weaponData, 'element', 'None')).toBe(true);
    });

    test('should match Heal element', () => {
      const weaponData = createMockWeapon({ element: 'Heal' });
      expect(findWeaponWithProperty(weaponData, 'element', 'Heal')).toBe(true);
    });
  });

  describe('Materia Slot Matching', () => {
    test('should match Fire materia in support slots', () => {
      const weaponData = createMockWeapon({ support3: 'Fire' });
      expect(findWeaponWithProperty(weaponData, 'support3', 'Fire')).toBe(true);
    });

    test('should match Circle sigil', () => {
      const weaponData = createMockWeapon({ support1: '◯ Circle Sigil +2' });
      expect(findWeaponWithProperty(weaponData, 'support1', 'Circle')).toBe(true);
    });

    test('should match Triangle sigil', () => {
      const weaponData = createMockWeapon({ support2: '△ Triangle Sigil' });
      expect(findWeaponWithProperty(weaponData, 'support2', 'Triangle')).toBe(true);
    });

    test('should match X Sigil', () => {
      const weaponData = createMockWeapon({ support3: '✕ X Sigil +2' });
      expect(findWeaponWithProperty(weaponData, 'support3', 'X Sigil')).toBe(true);
    });

    test('should match All (Cure) materia', () => {
      const weaponData = createMockWeapon({ support2: 'All (Cure)' });
      expect(findWeaponWithProperty(weaponData, 'support2', 'All (Cure)')).toBe(true);
    });
  });

  describe('Gacha Type Matching', () => {
    test('should match Limited gacha type', () => {
      const weaponData = createMockWeapon({ gachaType: 'L' });
      expect(findWeaponWithProperty(weaponData, 'gachaType', 'L')).toBe(true);
    });

    test('should match Event gacha type', () => {
      const weaponData = createMockWeapon({ gachaType: 'Y' });
      expect(findWeaponWithProperty(weaponData, 'gachaType', 'Y')).toBe(true);
    });

    test('should match Normal gacha type', () => {
      const weaponData = createMockWeapon({ gachaType: 'N' });
      expect(findWeaponWithProperty(weaponData, 'gachaType', 'N')).toBe(true);
    });
  });

  describe('Multiple Properties Search', () => {
    test('should search across different properties', () => {
      const weaponData = createMockWeapon({
        support1: 'Fire',
        support2: 'Ice',
        support3: 'Lightning'
      });

      expect(findWeaponWithProperty(weaponData, 'support1', 'Fire')).toBe(true);
      expect(findWeaponWithProperty(weaponData, 'support2', 'Ice')).toBe(true);
      expect(findWeaponWithProperty(weaponData, 'support3', 'Lightning')).toBe(true);
    });

    test('should return false when searching wrong property', () => {
      const weaponData = createMockWeapon({ support1: 'Fire' });

      expect(findWeaponWithProperty(weaponData, 'support2', 'Fire')).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty search string', () => {
      const weaponData = createMockWeapon({ element: 'Fire' });
      const result = findWeaponWithProperty(weaponData, 'element', '');

      expect(result).toBe(true); // Empty string is substring of any string
    });

    test('should handle whitespace in search', () => {
      const weaponData = createMockWeapon({ effect1: 'Debuff PDEF -' });
      const result = findWeaponWithProperty(weaponData, 'effect1', 'Debuff PDEF');

      expect(result).toBe(true);
    });

    test('should handle consecutive spaces', () => {
      const weaponData = createMockWeapon({ name: 'Test  Weapon' });
      const result = findWeaponWithProperty(weaponData, 'name', 'Test  Weapon');

      expect(result).toBe(true);
    });

    test('should not match when extra characters present', () => {
      const weaponData = createMockWeapon({ element: 'Fire' });
      const result = findWeaponWithProperty(weaponData, 'element', 'Fire2');

      expect(result).toBe(false);
    });
  });
});

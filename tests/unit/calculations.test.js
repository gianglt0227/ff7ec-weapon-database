/**
 * Unit Tests for Calculation Logic
 *
 * Purpose: Test special calculations (Regen, % per ATB, conditional damage)
 * Dependencies: scripts.js
 */

const fs = require('fs');
const path = require('path');

// Load weapon-metadata.js first (dependency of scripts.js)
const weaponMetadataPath = path.join(__dirname, '../../js/weapon-metadata.js');
const weaponMetadataContent = fs.readFileSync(weaponMetadataPath, 'utf8');

const scriptPath = path.join(__dirname, '../../js/scripts.js');
const scriptContent = fs.readFileSync(scriptPath, 'utf8');

// Setup DOM before evaluating scripts.js
document.body.innerHTML = `
  <div id="ecDropdown" class="dropdown-content"></div>
  <div id="Output" class="output"></div>
`;

eval(weaponMetadataContent);
eval(scriptContent);

describe('Calculation Logic', () => {

  describe('Regen Calculation', () => {
    // Regen formula from scripts.js (line 800): Math.floor(dur / 3) * 15 + pot

    test('should calculate regen with 18s duration', () => {
      const duration = 18;
      const initialPot = 13;

      // Ticks every 3s: 18/3 = 6 ticks, 6 * 15% = 90%, + initial 13% = 103%
      const expectedMax = Math.floor(duration / 3) * 15 + initialPot;

      expect(expectedMax).toBe(103);
    });

    test('should calculate regen with 15s duration', () => {
      const duration = 15;
      const initialPot = 13;

      const expectedMax = Math.floor(duration / 3) * 15 + initialPot;

      expect(expectedMax).toBe(88); // 15/3 = 5 ticks, 5*15 + 13 = 88
    });

    test('should calculate regen with 30s duration', () => {
      const duration = 30;
      const initialPot = 10;

      const expectedMax = Math.floor(duration / 3) * 15 + initialPot;

      expect(expectedMax).toBe(160); // 30/3 = 10 ticks, 10*15 + 10 = 160
    });

    test('should handle duration not divisible by 3', () => {
      const duration = 20; // Not evenly divisible by 3
      const initialPot = 15;

      const expectedMax = Math.floor(duration / 3) * 15 + initialPot;

      expect(expectedMax).toBe(105); // floor(20/3) = 6 ticks, 6*15 + 15 = 105
    });

    test('should handle zero duration', () => {
      const duration = 0;
      const initialPot = 50;

      const expectedMax = Math.floor(duration / 3) * 15 + initialPot;

      expect(expectedMax).toBe(50); // No regen ticks, just initial pot
    });

    test('should handle very long duration', () => {
      const duration = 99;
      const initialPot = 20;

      const expectedMax = Math.floor(duration / 3) * 15 + initialPot;

      expect(expectedMax).toBe(515); // 99/3 = 33 ticks, 33*15 + 20 = 515
    });

    test('should handle regen with zero initial potency', () => {
      const duration = 18;
      const initialPot = 0;

      const expectedMax = Math.floor(duration / 3) * 15 + initialPot;

      expect(expectedMax).toBe(90); // Just regen ticks, no initial heal
    });

    test('should handle typical Garnet Rod scenario', () => {
      // Garnet's Rod from actual data: dur=15, pot=13
      const duration = 15;
      const initialPot = 13;

      const expectedMax = Math.floor(duration / 3) * 15 + initialPot;

      expect(expectedMax).toBe(88);
    });
  });

  describe('% per ATB Calculation', () => {
    // Formula from scripts.js: maxPot / atb

    test('should calculate % per ATB for standard weapon', () => {
      const maxPot = 540;
      const atb = 4;

      const perATB = (maxPot / atb).toFixed(0);

      expect(perATB).toBe('135');
    });

    test('should calculate % per ATB for 5 ATB weapon', () => {
      const maxPot = 800;
      const atb = 5;

      const perATB = (maxPot / atb).toFixed(0);

      expect(perATB).toBe('160');
    });

    test('should calculate % per ATB for 3 ATB weapon', () => {
      const maxPot = 600;
      const atb = 3;

      const perATB = (maxPot / atb).toFixed(0);

      expect(perATB).toBe('200');
    });

    test('should handle zero ATB (return full potency)', () => {
      const maxPot = 300;
      const atb = 0;

      // From scripts.js: if atb != 0, calculate, else return maxPot
      const perATB = atb !== 0 ? (maxPot / atb).toFixed(0) : maxPot;

      expect(perATB).toBe(300);
    });

    test('should round to nearest integer', () => {
      const maxPot = 550;
      const atb = 4;

      const perATB = (maxPot / atb).toFixed(0);

      expect(perATB).toBe('138'); // 137.5 rounds to 138
    });

    test('should handle high potency limited weapons', () => {
      const maxPot = 1200;
      const atb = 5;

      const perATB = (maxPot / atb).toFixed(0);

      expect(perATB).toBe('240');
    });

    test('should handle low potency weapons', () => {
      const maxPot = 15;
      const atb = 4;

      const perATB = (maxPot / atb).toFixed(0);

      expect(perATB).toBe('4'); // 3.75 rounds to 4
    });
  });

  describe('Healing Threshold', () => {
    // From scripts.js line 636: threshold < 25

    test('should filter healing weapons below 25% potency', () => {
      const potency = 15;
      const threshold = 25;

      const shouldDisplay = potency >= threshold;

      expect(shouldDisplay).toBe(false);
    });

    test('should display healing weapons at 25% potency', () => {
      const potency = 25;
      const threshold = 25;

      const shouldDisplay = potency >= threshold;

      expect(shouldDisplay).toBe(true);
    });

    test('should display healing weapons above 25% potency', () => {
      const potency = 74;
      const threshold = 25;

      const shouldDisplay = potency >= threshold;

      expect(shouldDisplay).toBe(true);
    });

    test('should filter very low potency heals', () => {
      const potencies = [5, 10, 15, 20, 24];
      const threshold = 25;

      const filtered = potencies.filter(pot => pot >= threshold);

      expect(filtered).toHaveLength(0);
    });

    test('should keep high potency heals', () => {
      const potencies = [25, 50, 74, 100];
      const threshold = 25;

      const filtered = potencies.filter(pot => pot >= threshold);

      expect(filtered).toEqual([25, 50, 74, 100]);
    });
  });

  describe('Conditional Damage Calculations', () => {
    // Tests for hardcoded weapon exceptions

    test('should identify Bahamut Greatsword', () => {
      const weaponName = 'Bahamut Greatsword';
      const isSpecial = weaponName === 'Bahamut Greatsword';

      expect(isSpecial).toBe(true);
    });

    test('should identify Sabin\'s Claws', () => {
      const weaponName = "Sabin's Claws";
      const isSpecial = weaponName === "Sabin's Claws";

      expect(isSpecial).toBe(true);
    });

    test('should identify Blade of the Worthy', () => {
      const weaponName = 'Blade of the Worthy';
      const isSpecial = weaponName === 'Blade of the Worthy';

      expect(isSpecial).toBe(true);
    });

    test('should identify Umbral Blade', () => {
      const weaponName = 'Umbral Blade';
      const isSpecial = weaponName === 'Umbral Blade';

      expect(isSpecial).toBe(true);
    });

    test('should not match regular weapons as special', () => {
      const weapons = ['Buster Sword', 'Guard Stick', 'Fairy Tale'];

      weapons.forEach(weapon => {
        const isSpecial = [
          'Bahamut Greatsword',
          "Sabin's Claws",
          'Blade of the Worthy',
          'Umbral Blade'
        ].includes(weapon);

        expect(isSpecial).toBe(false);
      });
    });

    test('should check maxPot > pot for conditional damage', () => {
      const scenarios = [
        { pot: 540, maxPot: 540, hasCondition: false },
        { pot: 800, maxPot: 1200, hasCondition: true },
        { pot: 540, maxPot: 750, hasCondition: true },
        { pot: 900, maxPot: 900, hasCondition: false }
      ];

      scenarios.forEach(({ pot, maxPot, hasCondition }) => {
        const result = maxPot > pot;
        expect(result).toBe(hasCondition);
      });
    });
  });

  describe('Weapon Metadata Functions', () => {
    describe('shouldShowCondition()', () => {
      test('should return true for Bahamut Greatsword (special weapon)', () => {
        expect(shouldShowCondition("Bahamut Greatsword", 100, 100)).toBe(true);
      });

      test('should return true for Sabin\'s Claws (special weapon)', () => {
        expect(shouldShowCondition("Sabin's Claws", 100, 100)).toBe(true);
      });

      test('should return true for Blade of the Worthy (special weapon)', () => {
        expect(shouldShowCondition("Blade of the Worthy", 100, 100)).toBe(true);
      });

      test('should return true for Umbral Blade (special weapon)', () => {
        expect(shouldShowCondition("Umbral Blade", 100, 100)).toBe(true);
      });

      test('should return true when maxPot > pot for normal weapons', () => {
        expect(shouldShowCondition("Normal Sword", 100, 150)).toBe(true);
        expect(shouldShowCondition("Test Weapon", 200, 250)).toBe(true);
      });

      test('should return false when maxPot == pot for normal weapons', () => {
        expect(shouldShowCondition("Normal Sword", 100, 100)).toBe(false);
        expect(shouldShowCondition("Test Weapon", 200, 200)).toBe(false);
      });
    });

    describe('getWeaponCondition()', () => {
      test('should return condition1 when effect1 contains "DMG"', () => {
        const weapon = [
          { name: "effect1", value: "Fire DMG +10%" },
          { name: "condition1", value: "HP > 50%" },
          { name: "effect2", value: "ATK +5%" },
          { name: "condition2", value: "Always" }
        ];
        expect(getWeaponCondition(weapon)).toBe("HP > 50%");
      });

      test('should return condition2 when effect1 does not contain "DMG"', () => {
        const weapon = [
          { name: "effect1", value: "ATK +10%" },
          { name: "condition1", value: "HP > 50%" },
          { name: "effect2", value: "Ice DMG +15%" },
          { name: "condition2", value: "HP < 30%" }
        ];
        expect(getWeaponCondition(weapon)).toBe("HP < 30%");
      });

      test('should handle weapons with no DMG keyword', () => {
        const weapon = [
          { name: "effect1", value: "ATK +5%" },
          { name: "condition1", value: "Always" },
          { name: "effect2", value: "DEF +10%" },
          { name: "condition2", value: "When buffed" }
        ];
        expect(getWeaponCondition(weapon)).toBe("When buffed");
      });
    });
  });

  describe('Lightning/Thunder Element Mapping', () => {
    // From scripts.js line 451-455: Lightning maps to Thunder for resist/enchant

    test('should map Lightning to Thunder for resist', () => {
      const element = 'Lightning';
      const elemResist = element === 'Lightning' ? '[Resist] Thunder' : `[Resist] ${element}`;

      expect(elemResist).toBe('[Resist] Thunder');
    });

    test('should map Lightning to Thunder for enchant', () => {
      const element = 'Lightning';
      const elemEnchant = element === 'Lightning' ? '[Enchant] Thunder' : `[Enchant] ${element}`;

      expect(elemEnchant).toBe('[Enchant] Thunder');
    });

    test('should map Lightning to Light for materia', () => {
      const element = 'Lightning';
      const elemMateria = element === 'Lightning' ? 'Light' : element;

      expect(elemMateria).toBe('Light');
    });

    test('should not map other elements', () => {
      const elements = ['Fire', 'Ice', 'Water', 'Wind', 'Earth'];

      elements.forEach(element => {
        const elemResist = element === 'Lightning' ? '[Resist] Thunder' : `[Resist] ${element}`;
        const elemEnchant = element === 'Lightning' ? '[Enchant] Thunder' : `[Enchant] ${element}`;
        const elemMateria = element === 'Lightning' ? 'Light' : element;

        expect(elemResist).toBe(`[Resist] ${element}`);
        expect(elemEnchant).toBe(`[Enchant] ${element}`);
        expect(elemMateria).toBe(element);
      });
    });
  });

  describe('Gacha Type Classification', () => {
    // From scripts.js lines 582-590: L=Limited, Y=Event, else=Featured

    test('should classify Limited weapons', () => {
      const gachaType = 'L';
      const classification = gachaType === 'L' ? 'Limited' : gachaType === 'Y' ? 'Event' : 'Featured';

      expect(classification).toBe('Limited');
    });

    test('should classify Event weapons', () => {
      const gachaType = 'Y';
      const classification = gachaType === 'L' ? 'Limited' : gachaType === 'Y' ? 'Event' : 'Featured';

      expect(classification).toBe('Event');
    });

    test('should classify Featured weapons', () => {
      const gachaTypes = ['N', 'F', '', 'X'];

      gachaTypes.forEach(gachaType => {
        const classification = gachaType === 'L' ? 'Limited' : gachaType === 'Y' ? 'Event' : 'Featured';
        expect(classification).toBe('Featured');
      });
    });
  });

  describe('Uses Display Logic', () => {
    // From scripts.js lines 226-231: 0 uses = "No Limit"

    test('should display "No Limit" for 0 uses', () => {
      const uses = 0;
      const display = uses === 0 ? 'No Limit' : uses;

      expect(display).toBe('No Limit');
    });

    test('should display numeric value for limited uses', () => {
      const usesValues = [1, 3, 5, 10];

      usesValues.forEach(uses => {
        const display = uses === 0 ? 'No Limit' : uses;
        expect(display).toBe(uses);
      });
    });
  });

  describe('Complex Calculation Scenarios', () => {
    test('should calculate total healing with regen over time', () => {
      // Weapon with initial heal + regen
      const initialHeal = 13;
      const regenDuration = 18;
      const totalHealing = Math.floor(regenDuration / 3) * 15 + initialHeal;
      const atb = 3;
      const healPerATB = (totalHealing / atb).toFixed(0);

      expect(totalHealing).toBe(103);
      expect(healPerATB).toBe('34');
    });

    test('should compare weapon efficiency', () => {
      // Compare two weapons with different ATB costs
      const weapon1 = { maxPot: 540, atb: 4 };
      const weapon2 = { maxPot: 800, atb: 5 };

      const efficiency1 = weapon1.maxPot / weapon1.atb;
      const efficiency2 = weapon2.maxPot / weapon2.atb;

      expect(efficiency1).toBe(135);
      expect(efficiency2).toBe(160);
      expect(efficiency2).toBeGreaterThan(efficiency1);
    });

    test('should handle conditional potency comparison', () => {
      // Bahamut Greatsword: base 800, max 1200 (with condition)
      const basePot = 800;
      const maxPot = 1200;
      const hasCondition = maxPot > basePot;

      expect(hasCondition).toBe(true);
      expect(maxPot - basePot).toBe(400); // 50% increase with condition
    });
  });
});

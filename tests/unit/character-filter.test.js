/**
 * Unit Tests for Character Filter Module
 *
 * Purpose: Test character filter functionality
 * Dependencies: js/character-filter.js
 */

const fs = require('fs');
const path = require('path');
const characterFilterPath = path.join(__dirname, '../../js/character-filter.js');
const characterFilterContent = fs.readFileSync(characterFilterPath, 'utf8');

describe.skip('Character Filter Module', () => {
    beforeEach(() => {
        document.body.innerHTML = `
      <div id="characterFilterContainer" class="hidden">
        <div id="characterFilterButtons"></div>
      </div>
      <div id="Output">
        <table>
          <tbody>
            <tr data-character="Cloud"></tr>
            <tr data-character="Tifa"></tr>
            <tr data-character="Aerith"></tr>
          </tbody>
        </table>
      </div>
    `;

        global.weaponDatabase = [
            [
                { name: 'name', value: 'Buster Sword' },
                { name: 'charName', value: 'Cloud' }
            ],
            [
                { name: 'name', value: 'Premium Heart' },
                { name: 'charName', value: 'Tifa' }
            ],
            [
                { name: 'name', value: 'Guard Stick' },
                { name: 'charName', value: 'Aerith' }
            ]
        ];

        // Use indirect eval to execute in global scope
        (1, eval)(characterFilterContent);

        // Make functions globally accessible
        global.characterFilterState = characterFilterState;
        global.allCharacters = allCharacters;
        global.populateCharacterFilter = populateCharacterFilter;
        global.toggleCharacterFilter = toggleCharacterFilter;
        global.selectAllCharacters = selectAllCharacters;
        global.deselectAllCharacters = deselectAllCharacters;
        global.updateFilterButtonsUI = updateFilterButtonsUI;
        global.applyCharacterFilter = applyCharacterFilter;
    });

    describe('populateCharacterFilter', () => {
        test('should extract unique characters from table data', () => {
            const tableData = [
                ['Name', 'Character'],
                ['Weapon1', 'Cloud'],
                ['Weapon2', 'Tifa'],
                ['Weapon3', 'Cloud']
            ];

            populateCharacterFilter(tableData);

            const buttons = document.getElementById('characterFilterButtons').children;
            expect(buttons.length).toBe(3); // Aerith, Cloud, Tifa (sorted)
        });

        test('should extract characters from weaponDatabase if available', () => {
            const tableData = [['Name', 'Character']];

            populateCharacterFilter(tableData);

            const buttons = document.getElementById('characterFilterButtons').children;
            expect(buttons.length).toBe(3); // From weaponDatabase
        });

        test('should trim whitespace from character names', () => {
            const tableData = [
                ['Name', 'Character'],
                ['Weapon1', ' Cloud '],
                ['Weapon2', 'Tifa   ']
            ];

            populateCharacterFilter(tableData);

            const buttons = document.getElementById('characterFilterButtons').children;
            expect(Array.from(buttons).map(b => b.textContent)).toContain('Cloud');
            expect(Array.from(buttons).map(b => b.textContent)).toContain('Tifa');
        });

        test('should select all characters by default on first run', () => {
            const tableData = [
                ['Name', 'Character'],
                ['Weapon1', 'Cloud']
            ];

            populateCharacterFilter(tableData);

            expect(characterFilterState.has('Cloud')).toBe(true);
        });

        test('should show filter container', () => {
            const tableData = [['Name', 'Character'], ['Weapon1', 'Cloud']];

            populateCharacterFilter(tableData);

            const container = document.getElementById('characterFilterContainer');
            expect(container.classList.contains('hidden')).toBe(false);
        });
    });

    describe('toggleCharacterFilter', () => {
        beforeEach(() => {
            populateCharacterFilter([['Name', 'Character'], ['W1', 'Cloud']]);
        });

        test('should toggle character selection state', () => {
            const btn = document.querySelector('[data-char="Cloud"]');
            const initialState = characterFilterState.has('Cloud');

            toggleCharacterFilter('Cloud', btn);

            expect(characterFilterState.has('Cloud')).toBe(!initialState);
        });

        test('should update button classes when toggling', () => {
            const btn = document.querySelector('[data-char="Cloud"]');

            toggleCharacterFilter('Cloud', btn);
            expect(btn.className).toContain('bg-gray-50');

            toggleCharacterFilter('Cloud', btn);
            expect(btn.className).toContain('bg-primary/10');
        });
    });

    describe('selectAllCharacters and deselectAllCharacters', () => {
        beforeEach(() => {
            populateCharacterFilter([
                ['Name', 'Character'],
                ['W1', 'Cloud'],
                ['W2', 'Tifa']
            ]);
        });

        test('selectAllCharacters should add all characters to state', () => {
            characterFilterState.clear();

            selectAllCharacters();

            expect(characterFilterState.size).toBe(3); // Aerith, Cloud, Tifa
        });

        test('deselectAllCharacters should clear all selections', () => {
            deselectAllCharacters();

            expect(characterFilterState.size).toBe(0);
        });
    });

    describe('applyCharacterFilter', () => {
        beforeEach(() => {
            populateCharacterFilter([
                ['Name', 'Character'],
                ['W1', 'Cloud']
            ]);
        });

        test('should show rows for selected characters', () => {
            characterFilterState.clear();
            characterFilterState.add('Cloud');

            applyCharacterFilter();

            const cloudRow = document.querySelector('[data-character="Cloud"]');
            expect(cloudRow.style.display).toBe('');
        });

        test('should hide rows for unselected characters', () => {
            characterFilterState.clear();
            characterFilterState.add('Cloud');

            applyCharacterFilter();

            const tifaRow = document.querySelector('[data-character="Tifa"]');
            expect(tifaRow.style.display).toBe('none');
        });

        test('should handle multiple tables', () => {
            document.body.innerHTML += `
        <div id="Output">
          <table>
            <tbody>
              <tr data-character="Cloud"></tr>
            </tbody>
          </table>
        </div>
      `;

            characterFilterState.clear();
            characterFilterState.add('Cloud');

            applyCharacterFilter();

            const allCloudRows = document.querySelectorAll('[data-character="Cloud"]');
            allCloudRows.forEach(row => {
                expect(row.style.display).toBe('');
            });
        });
    });
});

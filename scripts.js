﻿// python -m http.server

/* Trash code - Need to clean up and add comments and stuff*/
/* When the user clicks on the button, toggle between hiding and showing the dropdown content */

const WEAP_NUM_SKIP_LINE = 1;
const MAX_POT_INDEX = 5;   // Index into the maxPot
let weaponDatabase = [];
function ecSearch() {  document.getElementById("ecDropdown").classList.toggle("show");
    var divToPrint = document.getElementById('Output');                       
    divToPrint.innerHTML = ''
}

/* Create a table to display the result */
function tableCreate(user_row, user_col, list, header) {
    //body reference 
    var body = document.getElementById('Output'); 

    // header
    const h1 = document.createElement("h1"); 
    const textNode = document.createTextNode(header);
    h1.className = "weaponHeader";
    h1.appendChild(textNode);
    body.appendChild(h1);
  
    // create <table> and a <tbody>
    var tbl = document.createElement("table");
    tbl.id = "changeTable";
    var tblBody = document.createElement("tbody");

    // create <tr> and <td>
    for (var j = 0; j < user_row; j++) {
    var row = document.createElement("tr");

    for (var i = 0; i < user_col; i++) {
        var cell = document.createElement("td");
        var cellText;
        cellText = document.createTextNode(list[j][i]);
        cell.appendChild(cellText);
        row.appendChild(cell);
    }

    tblBody.appendChild(row);
    }

    // append the <tbody> inside the <table>
    tbl.appendChild(tblBody);

    // put <table> in the <body>
    body.appendChild(tbl);

    // tbl border attribute to 
    tbl.setAttribute("border", "2");  
}
function readDatabase() {
    if (weaponDatabase[0] != null) {
        return;
    }

    //    result = loadFile('http://localhost:8000/weaponData.csv');
    result = loadFile('https://schau1.github.io/ff7ec/weaponData.csv');

    if (result != null) {
        // By lines
        var lines = result.split('\n');

        for (var line = WEAP_NUM_SKIP_LINE; line < lines.length-1; line++) {

            var row = CSVToArray(lines[line], ',');
            var i = 0;
            let weapData = [];
            weapData.push({ name: 'name', value: row[i][0] });
            weapData.push({ name: 'charName', value: row[i][1] });
            weapData.push({ name: 'sigil', value: row[i][2] });
            weapData.push({ name: 'atb', value: row[i][3] });
            weapData.push({ name: 'type', value: row[i][4] });    // dmg type
            weapData.push({ name: 'element', value: row[i][5] });
            weapData.push({ name: 'range', value: row[i][6] });
            weapData.push({ name: 'effect1Target', value: row[i][7] });
            weapData.push({ name: 'effect1', value: row[i][8] });
            weapData.push({ name: 'effect1Pot', value: row[i][9] });
            weapData.push({ name: 'effect1MaxPot', value: row[i][10] });
            weapData.push({ name: 'effect2Target', value: row[i][11] });
            weapData.push({ name: 'effect2', value: row[i][12] });
            weapData.push({ name: 'effect2Pot', value: row[i][13] });
            weapData.push({ name: 'effect2MaxPot', value: row[i][14] });
            weapData.push({ name: 'support1', value: row[i][15] });
            weapData.push({ name: 'support2', value: row[i][16] });
            weapData.push({ name: 'support3', value: row[i][17] });
            weapData.push({ name: 'rAbility1', value: row[i][18] });
            weapData.push({ name: 'rAbility2', value: row[i][19] });
            weapData.push({ name: 'potOb10', value: row[i][20] });
            weapData.push({ name: 'maxPotOb10', value: row[i][21] });
            weapData.push({ name: 'effect1Dur', value: row[i][22] });
            weapData.push({ name: 'effect2Dur', value: row[i][23] });

            weaponDatabase.push(weapData);
//            console.log(weapData);
        }
    }
}

// Find elements in an array
function findElement(arr, propName, propValue) {
    for (var i = 0; i < arr.length; i++)
        if (arr[i][propName] == propValue)
            return arr[i];

    // will return undefined if not found; you could return a default instead
}

function findWeaponWithProperty(arr, propName, propValue) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].name == propName) {
      /*      if (propName == "effect1") {
                if (arr[i].value == "[Resist] Fire -") {
                    console.log(arr[i].value);
                    console.log(propValue);
                    console.log(arr[i].value.indexOf(propValue));
                }

            }*/
            if (arr[i].value.indexOf(propValue) >= 0) {
                return true;
            }
        }
    }

    return false;
}

function elementalCompare(a, b) {
    var aItem = parseFloat(a[MAX_POT_INDEX]);
    var bItem = parseFloat(b[MAX_POT_INDEX]);
    if (aItem < bItem) {
        return 1;
    }
    if (aItem > bItem) {
        return -1;
    }
    return 0;
}
function filterFire() {
    printElemWeapon("Fire");
}
function filterIce() {
    printElemWeapon("Ice");
}

function filterLightning() {
    printElemWeapon("Lightning");
}

function filterWater() {
    printElemWeapon("Water");
}

function filterWind() {
    printElemWeapon("Wind");
}

function filterEarth() {
    printElemWeapon("Earth");
}

function filterNonElem() {
    printElemWeapon("Non-Elemental");
}

/* I should clean this up and make only 1 function calling into all of these filters... */
function filterMatkDown() {
    document.getElementById("ecDropdown").classList.toggle("show");

    var header = "Weapon with [Debuff] MATK:";
    printWeaponEffect("[Debuff] MATK", header);
}
function filterPatkDown() {
    document.getElementById("ecDropdown").classList.toggle("show");

    var header = "Weapon with [Debuff] PATK:";
    printWeaponEffect("[Debuff] PATK", header);
}
function filterPdefDown() {
    document.getElementById("ecDropdown").classList.toggle("show");

    var header = "Weapon with [Debuff] PDEF:";
    printWeaponEffect("[Debuff] PDEF", header);
}
function filterMdefDown() {
    document.getElementById("ecDropdown").classList.toggle("show");

    var header = "Weapon with [Debuff] MDEF:";
    printWeaponEffect("[Debuff] MDEF", header);
}

function filterPatkUp() {
    document.getElementById("ecDropdown").classList.toggle("show");

    var header = "Weapon with [Buff] PATK:";
    printWeaponEffect("[Buff] PATK", header);
}
function filterMatkUp() {
    document.getElementById("ecDropdown").classList.toggle("show");

    var header = "Weapon with [Buff] MATK:";
    printWeaponEffect("[Buff] MATK", header);
}

function filterPdefUp() {
    document.getElementById("ecDropdown").classList.toggle("show");

    var header = "Weapon with [Buff] PDEF:";
    printWeaponEffect("[Buff] PDEF", header);
}
function filterMdefUp() {
    document.getElementById("ecDropdown").classList.toggle("show");

    var header = "Weapon with [Buff] MDEF:";
    printWeaponEffect("[Buff] MDEF", header);
}

function filterCureAllMateria() {
    document.getElementById("ecDropdown").classList.toggle("show");

    var header = "Weapon with All (Cure):";
    printWeaponMateria("All (Cure)", header);
}

function filterCircleSigilMateria() {
    document.getElementById("ecDropdown").classList.toggle("show");

    var header = "Weapon with ◯ Sigil:";
    printWeaponMateria("Circle", header);
}


function filterTriangleSigilMateria() {
    document.getElementById("ecDropdown").classList.toggle("show");

    var header = "Weapon with △ Sigil:";
    printWeaponMateria("Triangle", header);
}

function filterXSigilMateria() {
    document.getElementById("ecDropdown").classList.toggle("show");

    var header = "Weapon with ✕ Sigil:";
    printWeaponMateria("X Sigil", header);
}

function filterDiamondMateria() {
    document.getElementById("ecDropdown").classList.toggle("show");

    var header = "Weapon with ◊ Sigil:";
    printWeaponSigil("Diamond", header);
}


function printElemWeapon(elem) {
    document.getElementById("ecDropdown").classList.toggle("show");
    readDatabase(); // if database is already loaded, won't do anything
    let elemental = [["Weapon Name", "Char", "AOE", "Type", "Pot%", "Max%"]];
    var elemResist, elemEnchant, elemMateria;

    if (elem == "Lightning") {
        elemResist = "[Resist] Thunder"; // For whatever reseaon, Lightning resist is listed as "[Resist] Thunder";
        elemEnchant = "[Enchant] Thunder";
        elemMateria = "Light";
    }
    else {
        elemResist = "[Resist] " + elem;
        elemEnchant = "[Enchant] " + elem;
        elemMateria = elem;
    }

    for (var i = 0; i < weaponDatabase.length; i++)
    {
        var found = findWeaponWithProperty(weaponDatabase[i], 'element', elem);
        if (found) {
            // Make a new row and push them into the list
            let row = [];
            var item = findElement(weaponDatabase[i], "name", "name");
            row.push(item["value"]);

            //            console.log(item["value"]);
            item = findElement(weaponDatabase[i], "name", "charName");
            row.push(item["value"]);

            item = findElement(weaponDatabase[i], "name", "range");
            row.push(item["value"]);


            item = findElement(weaponDatabase[i], "name", "type");
            row.push(item["value"]);


            item = findElement(weaponDatabase[i], "name", "potOb10");
            row.push(item["value"]);

            item = findElement(weaponDatabase[i], "name", "maxPotOb10");
            row.push(item["value"]);

            elemental.push(row);
        }

        elemental.sort(elementalCompare);
    }

    var header = "Weapon with C-Abilities - " + elem;    
    tableCreate(elemental.length, elemental[0].length, elemental, header);

    if (elem != "Non-Elemental") {
        header = "Weapon with [Debuff] " + elem + " Resist Down:";
        printWeaponEffect(elemResist, header);

        header = "Weapon with [Buff] " + elem + " Damage Up:";
        printWeaponEffect(elemEnchant, header);

        header = "Weapon with " + elem + " Materia Slot:";
        printWeaponMateria(elemMateria, header);
  //      tableCreate(materia.length, materia[0].length, materia, header);
    }
}

function printWeaponSigil(sigil, header) {
    readDatabase();
    let materia = [["Weapon Name", "Char", "AOE", "Type", "Elem", "Pot%", "Max%"]];

    //    console.log(elemMateria);

    for (var i = 0; i < weaponDatabase.length; i++) {
        if (findWeaponWithProperty(weaponDatabase[i], 'sigil', sigil)) {
            // Make a new row and push them into the list
            let row = [];
            var item = findElement(weaponDatabase[i], "name", "name");
            row.push(item["value"]);

            //            console.log(item["value"]);
            item = findElement(weaponDatabase[i], "name", "charName");
            row.push(item["value"]);

            item = findElement(weaponDatabase[i], "name", "range");
            row.push(item["value"]);


            item = findElement(weaponDatabase[i], "name", "type");
            row.push(item["value"]);

            item = findElement(weaponDatabase[i], "name", "element");
            row.push(item["value"]);

            item = findElement(weaponDatabase[i], "name", "potOb10");
            row.push(item["value"]);

            item = findElement(weaponDatabase[i], "name", "maxPotOb10");
            row.push(item["value"]);

            materia.push(row);
        }
    }

    tableCreate(materia.length, materia[0].length, materia, header);
}
function printWeaponMateria(elemMateria, header) {
    readDatabase();
    let materia = [["Weapon Name", "Char", "AOE", "Type", "Elem", "Pot%", "Max%"]];

//    console.log(elemMateria);

    for (var i = 0; i < weaponDatabase.length; i++) {
        if (findWeaponWithProperty(weaponDatabase[i], 'support1', elemMateria) ||
            findWeaponWithProperty(weaponDatabase[i], 'support2', elemMateria) ||
            findWeaponWithProperty(weaponDatabase[i], 'support3', elemMateria)) {
            // Make a new row and push them into the list
            let row = [];
            var item = findElement(weaponDatabase[i], "name", "name");
            row.push(item["value"]);

            //            console.log(item["value"]);
            item = findElement(weaponDatabase[i], "name", "charName");
            row.push(item["value"]);

            item = findElement(weaponDatabase[i], "name", "range");
            row.push(item["value"]);


            item = findElement(weaponDatabase[i], "name", "type");
            row.push(item["value"]);

            item = findElement(weaponDatabase[i], "name", "element");
            row.push(item["value"]);

            item = findElement(weaponDatabase[i], "name", "potOb10");
            row.push(item["value"]);

            item = findElement(weaponDatabase[i], "name", "maxPotOb10");
            row.push(item["value"]);

            materia.push(row);
        }
    }

    tableCreate(materia.length, materia[0].length, materia, header);
}

function printWeaponEffect(text, header) {
    readDatabase();
    let effect = [["Name", "Char", "AOE", "Type", "Elem", "Pot", "Max Pot", "Duration (s)"]];  

    for (var i = 0; i < weaponDatabase.length; i++) {
        if ((found = findWeaponWithProperty(weaponDatabase[i], 'effect1', text)) || findWeaponWithProperty(weaponDatabase[i], 'effect2', text)) {
            // Make a new row and push them into the list
            let row = [];
            var item = findElement(weaponDatabase[i], "name", "name");
            row.push(item["value"]);

            //            console.log(item["value"]);
            item = findElement(weaponDatabase[i], "name", "charName");
            row.push(item["value"]);

            item = findElement(weaponDatabase[i], "name", "range");
            row.push(item["value"]);

            item = findElement(weaponDatabase[i], "name", "type");
            row.push(item["value"]);

            item = findElement(weaponDatabase[i], "name", "element");
            row.push(item["value"]);

            if (found) {
                item = findElement(weaponDatabase[i], "name", "effect1Pot");
                row.push(item["value"]);

                item = findElement(weaponDatabase[i], "name", "effect1MaxPot");
                row.push(item["value"]);

                item = findElement(weaponDatabase[i], "name", "effect1Dur");
                row.push(item["value"]);
            }
            else {
                item = findElement(weaponDatabase[i], "name", "effect2Pot");
                row.push(item["value"]);

                item = findElement(weaponDatabase[i], "name", "effect2MaxPot");
                row.push(item["value"]);

                item = findElement(weaponDatabase[i], "name", "effect2Dur");
                row.push(item["value"]);
            }

            effect.push(row);
        }
    }

    tableCreate(effect.length, effect[0].length, effect, header);
}


// Load file from local server
function loadFile(filePath) {
    var result = null;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, false);
    xmlhttp.send();
    if (xmlhttp.status == 200) {
        result = xmlhttp.responseText;
    }
    return result;
}


// ref: http://stackoverflow.com/a/1293163/2343
// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.
function CSVToArray( strData, strDelimiter ){
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");
//    console.log(strData);
    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
    (
        // Delimiters.
        "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

        // Quoted fields.
        "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

        // Standard fields.
        "([^\"\\" + strDelimiter + "\\r\\n]*))"
    ),
    "gi"
    );


    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;


    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec( strData )){

    // Get the delimiter that was found.
    var strMatchedDelimiter = arrMatches[ 1 ];

    // Check to see if the given delimiter has a length
    // (is not the start of string) and if it matches
    // field delimiter. If id does not, then we know
    // that this delimiter is a row delimiter.
    if (
        strMatchedDelimiter.length &&
        strMatchedDelimiter !== strDelimiter
    ){

        // Since we have reached a new row of data,
        // add an empty row to our data array.
        arrData.push( [] );

    }

    var strMatchedValue;

    // Now that we have our delimiter out of the way,
    // let's check to see which kind of value we
    // captured (quoted or unquoted).
    if (arrMatches[ 2 ]){

        // We found a quoted value. When we capture
        // this value, unescape any double quotes.
        strMatchedValue = arrMatches[ 2 ].replace(
        new RegExp( "\"\"", "g" ),
        "\""
        );

    } else {

        // We found a non-quoted value.
        strMatchedValue = arrMatches[ 3 ];

    }


    // Now that we have our value string, let's add
    // it to the data array.
    arrData[ arrData.length - 1 ].push( strMatchedValue );
    }

    // Return the parsed data.
    return( arrData );
}

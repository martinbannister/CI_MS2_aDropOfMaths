
//  declare an empty object to hold settings used throughout functions
const gblS = {};


/**
 * Stores select game settings in an object to be passed to another function to begin game play with selected options
 * @param {object} e the element whos event triggered the function
 */
function playClick(e) {
    // Prevent default submit from firing
    e.preventDefault();

    // gather input values into an object
    const objSettings = {};
    const settingsForm = document.getElementById('frmSettings');

    // store the game style
    let gameStyle = document.getElementsByName('game_style');
    gameStyle.forEach(i => { if (i.checked) { objSettings.gameStyle = i.value; } });

    // store game setting numbers
    objSettings.maxNumber = settingsForm.elements['max_num'].value;
    objSettings.speed = settingsForm.elements['max_speed'].value;
    objSettings.qTime = settingsForm.elements['q_time'].value;
    objSettings.noOfQs = settingsForm.elements['max_qs'].value;

    // store the selected calculation type
    let calcType = document.getElementsByName('calc_type');
    calcType.forEach(i => { if (i.checked) { objSettings.calcType = i.value } });

    console.log(objSettings);

    // hide/remove the style overlay
    document.getElementById('overlay_div').style.display = 'none';

    startGame(objSettings);
}



/**
 * Adds or removes (toggles) the theme attribute of the document to facilitate a style change
 */
function themeChange() {
    if (document.documentElement.hasAttribute('theme')) {
        document.documentElement.removeAttribute('theme');
    }
    else {
        document.documentElement.setAttribute('theme', 'adult');
    }
}



/**
 * Sets up variables from the passed in object containing settings to be used in the game
 * Launches the game
 * @param {object} objSettings An object containing the games settings
 */
function startGame(objSettings) {
    // constant values determined by chosen user settings
    gblS.calcType = objSettings.calcType;
    gblS.maxNum = objSettings.maxNumber;
    gblS.speed = objSettings.speed;
    gblS.timeLimit = objSettings.qTime;
    gblS.qs = objSettings.noOfQs;

    // get reference to the game container
    gblS.container = document.getElementById('game_container');
    // get constants for container area to user for bubble positions
    gblS.CONTAINER_HEIGHT = parseInt(getComputedStyle(gblS.container).getPropertyValue('height'));
    gblS.CONTAINER_WIDTH = parseInt(getComputedStyle(gblS.container).getPropertyValue('width'));

    // hue for colouring bubbles in child theme
    gblS.hue = 0;
    // opposite of hue for contrasting text colour
    gblS.hueOpp = 0;

    // 'clicks' used to count the number of clicks to determine which operand div to fill
    gblS.clicks = 0;

    let operator = '';

    // target number for the current question
    // minus one prevents the number going over the maximum
    // plus one keeps the number above zero
    let target_num = Math.floor(Math.random() * (gblS.maxNum - 1) + 1);

    // populate the target number div
    document.getElementById('target_result').textContent = target_num;

    switch (gblS.calcType) {
        case 'add':
            gblS.operator = '+'
            break;
        case 'subtract':
            gblS.operator = '−'
            break;
        case 'multiply':
            gblS.operator = '×'
            break;
        case 'divide':
            gblS.operator = '÷'
            break;
        default:
            console.log('Calc Type selection', 'something went wrong');
    }

    document.getElementById('operator').textContent = gblS.operator;

    draw();

    setTimeout(function () {
        cancelAnimationFrame(rAf);
        document.getElementById('countdown').textContent = 'done';
    }, 15000);

}

let startTime = null;
let rAf;
let i = 0;

function draw(timestamp) {
    if (!startTime) {
        startTime = timestamp;
    }

    currentTime = timestamp - startTime;

    // Do something based on current time
    if (currentTime >= 1000) {
        startTime = timestamp;
        ++i;
        document.getElementById('countdown').textContent = i;
    }

    rAf = requestAnimationFrame(draw);
}

/* ------------------ EVENT HANDLERS ------------------ */

// add event listener to form submit (play button)
let settingsForm = document.getElementById('frmSettings');
settingsForm.addEventListener('submit', playClick);

// add event listener to Adult/Child radio buttons
// to vary the theme before Play is clicked (form is submitted)
let radioGameStyle = document.getElementsByName('game_style');
radioGameStyle.forEach(radio => { radio.addEventListener('change', themeChange) });

// add event listener to display settings div after it's been closed
let spanSettings = document.getElementById('show_settings');
spanSettings.addEventListener('click', () => document.getElementById('overlay_div').style.display = 'flex');
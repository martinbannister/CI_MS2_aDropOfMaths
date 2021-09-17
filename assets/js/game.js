
//  declare an empty object to hold settings used throughout functions (global (gbl) Settings (S))
const gblS = {};

// global variables required by bubbleDrop()
/* declared globally otherwise they'd be
    overwitten by each iteration of the
    function and never change */
let startTime = null;
let rAf;
let intCountdown = null;


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
    gblS.maxNum = parseInt(objSettings.maxNumber);
    gblS.speed = parseInt(objSettings.speed);
    gblS.timeLimit = parseInt(objSettings.qTime);
    gblS.qs = parseInt(objSettings.noOfQs);

    // store reference to the game container
    gblS.container = document.getElementById('game_container');
    // store reference to countdown time div
    gblS.countdown = document.getElementById('countdown');
    // store reference to score div
    gblS.score = document.getElementById('score');
    // get constants for container area to user for bubble positions
    gblS.CONTAINER_HEIGHT = parseInt(getComputedStyle(gblS.container).getPropertyValue('height'));
    gblS.CONTAINER_WIDTH = parseInt(getComputedStyle(gblS.container).getPropertyValue('width'));

    // hue for colouring bubbles in child theme
    gblS.hue = 0;
    // opposite of hue for contrasting text colour
    gblS.hueOpp = 0;

    // 'clicks' used to count the number of clicks to determine which operand div to fill
    gblS.clicks = 0;

    // target number for the current question
    // minus one prevents the number going over the maximum
    // plus one keeps the number above zero
    let target_num = Math.floor(Math.random() * (gblS.maxNum - 1) + 1);

    // populate the target number div
    document.getElementById('target_result').textContent = target_num;

    /* store the symbol operator for display based
        on the calcType string */
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

    // display the chosen operator
    document.getElementById('operator').textContent = gblS.operator;

    // set countdown timer to starting/maximum value
    gblS.countdown.textContent = gblS.timeLimit;

    // call bubble creation function for the first time
    bubbleDrop();

    // stop bubble creation after time limit
    // plus one used to ensure timer does not stop early
    setTimeout(function () {
        cancelAnimationFrame(rAf);
        // document.getElementById('countdown').textContent = 'done';
    }, ((gblS.timeLimit + 1) * 1000));

}


/**
 * Generates bubbles and counts timer down
 * @param {object} timestamp The timestamp passed in by being called by requestAnimationFrame()
 */
function bubbleDrop(timestamp) {

    if (!intCountdown) {
        intCountdown = gblS.timeLimit;
    }

    if (!startTime) {
        startTime = timestamp;
    }

    currentTime = timestamp - startTime;

    /* check if 1 or more seconds have passed since
        the last iteration */
    if (currentTime >= 1000) {
        createBubble();
        startTime = timestamp;
        gblS.countdown.textContent = --intCountdown;
    }

    // when the countdown reaches zero remove all bubbles not clicked
    if (intCountdown === 0) {
        gblS.container.replaceChildren();
    }

    rAf = requestAnimationFrame(bubbleDrop);
}

/**
 * Creates a new randomly horizontal positioned div within the limits of the game container
 * styles appropriately, attaches click event listener and adds to the game container
 */
function createBubble() {
    let newBubble = document.createElement('div');
    let size = Math.random() * (100 - 50) + 50;
    let position = Math.floor(Math.random() * gblS.CONTAINER_WIDTH);
    gblS.hueOpp = (gblS.hue + 180) % 360;

    newBubble.classList.add('bubble');
    newBubble.textContent = Math.floor(Math.random() * (gblS.maxNum - 1) + 1);
    newBubble.style.left = (position + size) > gblS.CONTAINER_WIDTH ? `${position - size}px` : `${position}px`;
    newBubble.style.width = `${size}px`;
    newBubble.style.height = `${size}px`;
    newBubble.style.top = 0 - `${size}px`;
    newBubble.style.backgroundColor = `hsl(${gblS.hue}, 100%, 50%)`;
    newBubble.style.color = `hsl(${gblS.hueOpp}, 100%, 50%)`;
    newBubble.addEventListener('click', bubbleClick);
    gblS.container.appendChild(newBubble);
    // increment hue so for child theme bubble colours change
    gblS.hue += 15;
}

/**
 * Handles bubble click. Inserts number into appropriate operand based on how many clicks have been recorded and removes div
 * @param {object} e Event that called the function
 */
function bubbleClick(e) {
    // set target element name based on number of clicks
    /* if a click has not been registered then operand1 is
        chosen, else operand2 is chosen */
    let targetDiv = gblS.clicks === 0 ? 'operand1' : 'operand2';
    // populates the determined operand div with the number of the bubble clicked
    document.getElementById(targetDiv).textContent = e.target.textContent;
    // if clicks is above zero then set to zero else add 1
    // will always be either one or zero
    gblS.clicks = gblS.clicks > 0 ? 0 : +1;
    // remove clicked bubble from container
    gblS.container.removeChild(e.target);
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
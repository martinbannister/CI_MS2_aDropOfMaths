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
    const calcType = objSettings.calcType;
    const maxNum = objSettings.maxNumber;
    const speed = objSettings.speed;
    const timeLimit = objSettings.qTime;
    const qs = objSettings.noOfQs;

    // get reference to the game container
    const container = document.getElementById('game_container');
    // get constants for container area to user for bubble positions
    const CONTAINER_HEIGHT = parseInt(getComputedStyle(container).getPropertyValue('height'));
    const CONTAINER_WIDTH = parseInt(getComputedStyle(container).getPropertyValue('width'));

    // hue for colouring bubbles in child theme
    let hue = 0;
    // opposite of hue for contrasting text colour
    let hueOpp = 0;

    // 'clicks' used to count the number of clicks to determine which operand div to fill
    let clicks = 0;

    // target number for the current question
    // minus one prevents the number going over the maximum
    // plus one keeps the number above zero
    let target_num = Math.floor(Math.random() * (maxNum - 1) + 1);

    // populate the target number div
    document.getElementById('target_result').textContent = target_num;

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
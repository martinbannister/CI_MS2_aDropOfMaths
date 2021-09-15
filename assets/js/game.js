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
}

// add event listener to form submit (play button)
let settingsForm = document.getElementById('frmSettings');
settingsForm.addEventListener('submit', playClick);

// add event listener to Adult/Child radio buttons
// to vary the theme before Play is clicked (form is submitted)
let radioGameStyle = document.getElementsByName('game_style');
radioGameStyle.forEach(radio => { radio.addEventListener('change', themeChange) });

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
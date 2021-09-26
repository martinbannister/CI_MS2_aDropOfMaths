/*jshint esversion: 6 */

//  declare an object to hold settings used throughout functions (global (gbl) Settings (S))
const gblS = {
    gameStyle: '',
    calcType: '',
    maxNum: 0,
    speed: 0,
    timeLimit: 0,
    qs: 0,
    container: '',
    countdown: '',
    score: '',
    operand1: '',
    operand2: '',
    operator: '',
    CONTAINER_HEIGHT: 0,
    CONTAINER_WIDTH: 0,
    hue: 0,
    hueOpp: 0,
    clicks: 0,
    paused: false,
};

// global variables required by bubbleDrop()
/* declared globally otherwise they'd be
    overwitten by each iteration of the
    function and never change */
let startTime = null;
let rAf;
let intCountdown = null;
let timeoutId = null;
// total number of questions answered
let intQuestions = 0;
// backup numbers to ensure questions can be answered
let backupNum1 = 0;
let backupNum2 = 0;
// array to hold numbers for the bubbles
let arrBubbleNums = [];
/* next index of the array of bubble numbers to apply
    the number form the array to a bubble */
let numberIndex = 0;


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
    objSettings.maxNumber = settingsForm.max_num.value;
    objSettings.speed = settingsForm.max_speed.value;
    objSettings.qTime = settingsForm.q_time.value;
    objSettings.noOfQs = settingsForm.max_qs.value;

    // store the selected calculation type
    let calcType = document.getElementsByName('calc_type');
    calcType.forEach(i => { if (i.checked) { objSettings.calcType = i.value; } });

    document.documentElement.style.setProperty('--animation_speed', `${objSettings.speed}s`);

    console.log(objSettings);

    // hide/remove the style overlay
    document.getElementById('overlay_div').style.display = 'none';

    // try to hide the adress bar when the overlay is removed
    window.scroll(0,1);

    // log gblS
    console.log(gblS);

    startGame(objSettings);
}



function pauseClick() {
    let bubbles = document.querySelectorAll('.bubble');
    bubbles.forEach(bubble => {
        let state = bubble.style.animationPlayState;
        bubble.style.animationPlayState = gblS.paused === false ? 'paused' : 'running';
    });
    if (gblS.paused) {
        bubbleDrop();
    } else {
        cancelAnimationFrame(rAf);
    }

    gblS.paused = !gblS.paused;
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
 * Generates a random number limited by the maximum number passed in
 * @param {number} maxNumber the maximum number to generate
 * @returns {number} a randomly generated number
 */
function generateNumber(maxNumber) {
    // minus one prevents the number going over the maximum
    // REMOVED - zero may be needed: plus one keeps the number above zero
    return Math.floor(Math.random() * (maxNumber - 1) + 1);
}



/**
 * Sets up variables from the passed in object containing settings to be used in the game
 * Launches the game
 * @param {object} objSettings An object containing the games settings
 */
function startGame(objSettings) {
    // constant values determined by chosen user settings
    gblS.gameStyle = objSettings.gameStyle;
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
    // store operand divs
    gblS.operand1 = document.getElementById('operand_1');
    gblS.operand2 = document.getElementById('operand_2');
    // get constants for container area to user for bubble positions
    gblS.CONTAINER_HEIGHT = parseInt(getComputedStyle(gblS.container).getPropertyValue('height'));
    gblS.CONTAINER_WIDTH = parseInt(getComputedStyle(gblS.container).getPropertyValue('width'));

    // target number for the current question
    let target_num = generateNumber(gblS.maxNum);

    // populate the target number div
    document.getElementById('target_result').textContent = target_num;

    generateBackupNos(target_num);
    generateNumbers(gblS.maxNum);

    /* store the symbol operator for display based
        on the calcType string */
    switch (gblS.calcType) {
        case 'add':
            gblS.operator = '+';
            break;
        case 'subtract':
            gblS.operator = '−';
            break;
        case 'multiply':
            gblS.operator = '×';
            break;
        case 'divide':
            gblS.operator = '÷';
            break;
        default:
            console.log('Calc Type selection', 'something went wrong');
    }

    // display the chosen operator
    document.getElementById('operator').textContent = gblS.operator;

    // set countdown timer to starting/maximum value
    gblS.countdown.textContent = gblS.timeLimit;

    intQuestions++;

    // call bubble creation function for the first time
    bubbleDrop();

    // stop bubble creation after time limit
    timeoutId = startTimeLimit();

}



/**
 * Generates random numbers and pushes them into an array
 * Inserts backup numbers into random positions in the array
 * @param {number} maxNum The maximum target number for the questions
 */
function generateNumbers(maxNum) {
    let indexNo1 = Math.floor(Math.random() * (gblS.timeLimit - 1));
    let indexNo2 = Math.floor(Math.random() * (gblS.timeLimit - 1));
    // check if index 1 and 2 are equal, increment index 2 if true
    if (indexNo1 === indexNo2) {
        indexNo2++;
    }

    console.log('index1:', indexNo1, 'index2:', indexNo2);

    // calculate the number of numbers required
    let numOfNums = Math.floor(gblS.timeLimit);
    /* loop for the number of times required
        adding numbers to the array each iteration
        insert the backup numbers into random 
        positions in the array */
    for (let i = 0; i < numOfNums; i++) {
        if (i === indexNo1) {
            arrBubbleNums.push(backupNum1);
        } else if (i === indexNo2) {
            arrBubbleNums.push(backupNum2);
        } else {
            arrBubbleNums.push(Math.floor(Math.random() * (maxNum - 1)));
        }
    }

    console.log(arrBubbleNums);
}



/**
 * Generates two numbers and stores them in global variables to be used on bubbles to ensure problems can be solved
 * 
 * @param {number} targetNum The target number to generate backup numbers for
 */
function generateBackupNos(targetNum) {
    // generate two numbers to include in bubbles to ensure question can be answered
    backupNum1 = generateNumber(gblS.maxNum);
    switch (gblS.calcType) {
        case 'add':
            backupNum2 = targetNum - backupNum1;
            break;
        case 'subtract':
            backupNum2 = targetNum + backupNum1;
            break;
        case 'multiply':
            backupNum2 = targetNum / backupNum1;
            break;
        case 'divide':
            backupNum2 = targetNum * backupNum1;
            break;
        default:
            console.log('Generate backup numbers', 'something went wrong');
    }

    console.log('backup1:', backupNum1, 'backup2:', backupNum2);
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

    let currentTime = timestamp - startTime;

    /* check if 1 or more seconds have passed since
        the last iteration */
    if (currentTime >= 1000) {
        createBubble();
        numberIndex++;
        startTime = timestamp;
        gblS.countdown.textContent = --intCountdown;
    }

    // when the countdown reaches zero remove all bubbles not clicked
    if (intCountdown === 0) {

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
    newBubble.textContent = arrBubbleNums[numberIndex];
    newBubble.style.left = (position + size) > gblS.CONTAINER_WIDTH ? `${position - size}px` : `${position}px`;
    newBubble.style.width = `${size}px`;
    newBubble.style.height = `${size}px`;
    newBubble.style.top = 0 - `${size}px`;
    if (gblS.gameStyle === 'child') {
        newBubble.style.backgroundColor = `hsl(${gblS.hue}, 100%, 50%)`;
        newBubble.style.color = `hsl(${gblS.hueOpp}, 100%, 50%)`;
    }
    newBubble.addEventListener('click', bubbleClick);
    // add event listener to remove bubble from DOM when animation ends
    newBubble.addEventListener('animationend', () => gblS.container.removeChild(newBubble));
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
    let targetDiv = gblS.clicks === 0 ? 'operand_1' : 'operand_2';
    // populates the determined operand div with the number of the bubble clicked
    document.getElementById(targetDiv).textContent = e.target.textContent;
    // if clicks is above zero perform a check to see if the corrent answer has been reached
    if (gblS.clicks > 0) {
        let resultCheck = checkResult();
        if (resultCheck) {
            // call a function for next question
            answerCorrect();
        } else {
            // briefly display msg_wrong
            answerWrong();
        }
    } else {
        // remove clicked bubble from container
        console.log(e.target, `clicked`);
        gblS.container.removeChild(e.target);
    }
    // if clicks is above zero then set to zero else add 1
    // will always be either one or zero
    gblS.clicks = gblS.clicks > 0 ? 0 : +1;

}



/**
 * Checks if clicked numbers result in the correct answer
 * @returns Boolean Whether result is correct or not
 */
function checkResult() {
    let op1 = parseInt(document.getElementById('operand_1').textContent);
    let op2 = parseInt(document.getElementById('operand_2').textContent);
    let targetNum = parseInt(document.getElementById('target_result').textContent);

    let result = 0;

    switch (gblS.operator) {
        case '+':
            result = op1 + op2;
            break;
        case '−':
            result = op1 - op2;
            break;
        case '×':
            result = op1 * op2;
            break;
        case '÷':
            result = op1 / op2;
            break;
        default:
            console.log('checkResult()', 'switch operator check failed');
    }

    if (result === targetNum) {
        console.log(true);
        gblS.operand1.textContent = '';
        gblS.operand2.textContent = '';
        return true;
    } else {
        console.log(false);
        return false;
    }
}


/**
 * Stop bubble creation after chosen time limit
 * 
 * @returns ID of setTimeout called for time limit
 */
function startTimeLimit() {
    // plus one used to ensure timer does not stop early
    console.log(`Time limit ${gblS.timeLimit}s started`);
    return setTimeout(function () {
        console.log('countdown has ended, sorry');
        cancelAnimationFrame(rAf);
        // remove any remaining bubbles from container div
        gblS.container.replaceChildren();
        // clear the contents of both operands
        gblS.operand1.textContent = '';
        gblS.operand2.textContent = '';
        // clear timer value
        gblS.countdown.textContent = 0;
        // clear target number
        document.getElementById('target_result').textContent = 0;
        // clear the array of random numbers
        arrBubbleNums.length = 0;
        // reset intCountdown, numberIndex, startTime and clicks
        intCountdown = null;
        numberIndex = 0;
        startTime = null;
        gblS.clicks = 0;
        // log the current state of gblS
        console.log(gblS);
        // display lose message
        let msg = document.getElementById('msg_lose');
        msg.style.display = 'flex';
    }, ((gblS.timeLimit + 1) * 1000));
}



function newQuestion() {
    console.log('new question started');
    intQuestions++;
    // populate the target number div with a new generated number
    let target_num = generateNumber(gblS.maxNum);
    document.getElementById('target_result').textContent = target_num;

    // generate backup numbers and new bubble numbers
    generateBackupNos(target_num);
    generateNumbers(gblS.maxNum);

    // set countdown timer to starting/maximum value
    gblS.countdown.textContent = gblS.timeLimit;

    // reset intCountdown, startTime and numberIndex
    intCountdown = null;
    startTime = null;
    numberIndex = 0;

    // call initial bubble creation for this question
    bubbleDrop();

    // clear the current timeout if there is one
    if (timeoutId) {
        console.log(`clearing timeout ${timeoutId}`);
        clearTimeout(timeoutId);
    }
    // begin the countdown for the question
    timeoutId = startTimeLimit();
}



function answerCorrect() {
    if (intQuestions === gblS.qs) {
        // clear the time limit timeout to prevent lose message
        clearTimeout(timeoutId);
        // display win message
        let msg = document.getElementById('msg_win');
        msg.style.display = 'flex';

        cancelAnimationFrame(rAf);
        // increment score
        gblS.score.textContent = parseInt(gblS.score.textContent) + 1;
        // clear any remaining bubbles from container div
        gblS.container.replaceChildren();
    } else {
        // clear the time limit timeout to prevent lose message
        clearTimeout(timeoutId);
        // display correct message
        let msg = document.getElementById('msg_correct');
        msg.style.display = 'flex';

        cancelAnimationFrame(rAf);
        // increment score
        gblS.score.textContent = parseInt(gblS.score.textContent) + 1;
        // clear any remaining bubbles from container div
        gblS.container.replaceChildren();

        // hide correct message after 2 seconds
        setTimeout(() => {
            msg.style.display = 'none';
            newQuestion();
        }, 2000, msg);
    }

    // empty out random numbers array
    arrBubbleNums.length = 0;
}



function answerWrong() {
    let msg = document.getElementById('msg_wrong');
    msg.style.display = 'flex';
    // cancelAnimationFrame(rAf);

    setTimeout(() => { msg.style.display = 'none'; }, 500, msg);
}

function saveToHighscore(e) {
    try {
        let frm;
        if (e.target.parentNode.id === 'msg_win') {
            frm = document.getElementById('win_save_score');
        } else {
            frm = document.getElementById('lose_save_score');
        }
        
        console.log('form id', frm.id); 
        if (frm.id === 'win_save_score') {
            console.log(frm.win_initials.value);
        } else {
            console.log(frm.lose_initials.value);
        }

        let initals = frm.id === 'win_save_score' ? frm.win_initials.value : frm.lose_initials.value;

        let dataToSend = {
            'data': {
                'initials': initals.toUpperCase(),
                'score': intQuestions
            }
        };

        // SheetDB comes from external SheetDB api referenced in script tag in game.html
        SheetDB.write('https://sheetdb.io/api/v1/o9udtiqi23nf0', dataToSend).then(function(result){
                window.location = 'high_scores.html';
            }, function(error){
                console.log(error);
                throw(error);
        });

        // reset intQuestions once value has been written to high score
        intQuestions = 0;
    }

    catch(err) {
        console.log(err);
    }
}


/* ------------------ EVENT HANDLERS ------------------ */

// add event listener to form submit (play button)
let settingsForm = document.getElementById('frmSettings');
settingsForm.addEventListener('submit', playClick);

// add event listener to Adult/Child radio buttons
// to vary the theme before Play is clicked (form is submitted)
let radioGameStyle = document.getElementsByName('game_style');
radioGameStyle.forEach(radio => { radio.addEventListener('change', themeChange); });

// add event listener to display settings div after it's been closed
let spanSettings = document.getElementById('show_settings');
spanSettings.addEventListener('click', () => document.getElementById('overlay_div').style.display = 'flex');

// add click listener to overlay_div to hide div if not wanting to play the game
let divOverlay = document.getElementById('overlay_div');
divOverlay.addEventListener('click', (e) => {
    if (e.target.id === 'overlay_div') {
        e.target.style.display = 'none';
    }
});

// add click event listener to msg_lose div to restart the game
let msgLose = document.getElementById('msg_lose');
msgLose.addEventListener('click', (e) => {
    if (e.target.id === 'msg_lose') {
        document.getElementById('msg_lose').style.display = 'none';
        document.getElementById('overlay_div').style.display = 'flex';
        // reset intQuestions in case the user doesn't submit their high score
        intQuestions = 0;
    }
});

// add click event listener to msg_win div to restart the game
let msgWin = document.getElementById('msg_win');
msgWin.addEventListener('click', (e) => {
    if (e.target.id === 'msg_win') {
        document.getElementById('msg_win').style.display = 'none';
        document.getElementById('overlay_div').style.display = 'flex';
        // reset intQuestions in case the user doesn't submit their high score
        intQuestions = 0;
    }
});

// add click event listener to save high score buttons
let save_buttons = document.querySelectorAll('.score_save');
save_buttons.forEach(elem => {
    elem.addEventListener('click', saveToHighscore);
});
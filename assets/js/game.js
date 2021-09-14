function playClick(e) {
    // Prevent default submit from firing
    e.preventDefault();

    // gather input values into an object
    const objSettings = {};
    const settingsForm = document.getElementById('frmSettings');

    let gameStyle = document.getElementsByName('game_style');
    gameStyle.forEach(i => { if (i.checked) { objSettings.gameStyle = i.value; } });

    objSettings.maxNumber = settingsForm.elements['max_num'].value;
    objSettings.speed = settingsForm.elements['max_speed'].value;
    objSettings.qTime = settingsForm.elements['q_time'].value;
    objSettings.noOfQs = settingsForm.elements['max_qs'].value;

    let calcType = document.getElementsByName('calc_type');
    calcType.forEach(i => { if (i.checked) { objSettings.calcType = i.value } });

    console.log(objSettings);
}

let settingsForm = document.getElementById('frmSettings');
settingsForm.addEventListener('submit', playClick);
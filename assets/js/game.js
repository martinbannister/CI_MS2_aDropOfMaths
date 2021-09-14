function playClick(e) {
    // Prevent default submit from firing
    e.preventDefault();
}

let settingsForm = document.getElementById('frmSettings');
settingsForm.addEventListener('submit', playClick);
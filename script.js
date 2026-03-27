// ... keep all previous variables ...

// Add this at the bottom of your script.js
const setupMobileControls = () => {
    document.getElementById('up').addEventListener('click', () => {
        if (dy !== 1) { dx = 0; dy = -1; }
    });
    document.getElementById('down').addEventListener('click', () => {
        if (dy !== -1) { dx = 0; dy = 1; }
    });
    document.getElementById('left').addEventListener('click', () => {
        if (dx !== 1) { dx = -1; dy = 0; }
    });
    document.getElementById('right').addEventListener('click', () => {
        if (dx !== -1) { dx = 1; dy = 0; }
    });
};

// Call this function
setupMobileControls();

// PRO TIP: To prevent scrolling while playing on mobile
window.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);

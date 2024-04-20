// Function to toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}

// Event listener for dark mode toggle button
document.getElementById("dark-mode-toggle").addEventListener("click", toggleDarkMode);


function startReading() {
    window.location.href = "login.html";
}

function startWriting() {
    window.location.href = "home.html";
}

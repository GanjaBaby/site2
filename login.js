document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    // Validate username and password (dummy validation)
    if (username === "admin" && password === "password") {
        alert("Login successful!");
        // Redirect to another page or perform other actions after successful login
    } else {
        document.getElementById("error-message").innerText = "Invalid username or password";
    }
});

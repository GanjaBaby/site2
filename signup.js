document.getElementById("signup-form").addEventListener("submit", function(event) {
    event.preventDefault();
    var username = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    // Dummy validation (you can add your own validation logic)
    if (username && email && password) {
        alert("Sign up successful!");
        // Redirect to another page or perform other actions after successful signup
    } else {
        document.getElementById("error-message").innerText = "Please fill in all fields";
    }
});

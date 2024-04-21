// Get the button element
const userMenuButton = document.getElementById('user-menu-button');

// Get the dropdown menu element
const userMenu = document.querySelector('[role="menu"]');

// Add event listener to the button to toggle dropdown menu
userMenuButton.addEventListener('click', function() {
  const expanded = this.getAttribute('aria-expanded') === 'true' || false;
  this.setAttribute('aria-expanded', !expanded);
  userMenu.classList.toggle('hidden');
});

// Close the dropdown menu when user clicks outside of it
document.addEventListener('click', function(event) {
  if (!userMenu.contains(event.target) && !userMenuButton.contains(event.target)) {
    userMenu.classList.add('hidden');
    userMenuButton.setAttribute('aria-expanded', 'false');
  }
});

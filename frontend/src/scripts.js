// Dark mode toggle
document.addEventListener('DOMContentLoaded', function() {
    const themeSwitch = document.getElementById('theme-switch');
    const body = document.body;

    if(themeSwitch) {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            body.classList.add(savedTheme);
            if (savedTheme === 'dark-mode') {
                themeSwitch.checked = true;
            }
        }

        // Theme toggle functionality
        themeSwitch.addEventListener('change', function () {
            if (this.checked) {
                body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark-mode');
            } else {
                body.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light-mode');
            }
        });
    }
});

// Get the navigation bar element
const navBar = document.querySelector('nav');
// Get the offset position of the navigation bar
const navBarOffset = navBar.offsetTop;
// Get the title element
const titleElement = document.querySelector('header h1');

// Add a scroll event listener
window.addEventListener('scroll', () => {
    if (window.scrollY > navBarOffset) {
        navBar.classList.add('sticky');
        navBar.style.backgroundColor = '#f2f2f2'; // Change the background color when sticky
        titleElement.style.marginLeft = '20px'; // Move the title to the left when sticky
    } else {
        navBar.classList.remove('sticky');
        navBar.style.backgroundColor = ''; // Reset the background color when not sticky
        titleElement.style.marginLeft = ''; // Reset the title position when not sticky
    }
});

// Get all filter buttons and project cards
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

// Add click event listener to filter buttons
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all filter buttons
        filterBtns.forEach(btn => btn.classList.remove('active'));
        // Add active class to the clicked button
        btn.classList.add('active');
        // Get the filter value from the data-filter attribute
        const filter = btn.getAttribute('data-filter');
        // Show/hide project cards based on the filter
        projectCards.forEach(card => {
            if (filter === 'all' || card.classList.contains(filter)) {
                card.classList.add('show');
            } else {
                card.classList.remove('show');
            }
        });
    });
});
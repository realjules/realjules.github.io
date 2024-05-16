// script.js

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
// Project filtering functionality
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all') {
                    card.classList.add('show');
                } else {
                    if (card.classList.contains(filterValue)) {
                        card.classList.add('show');
                    } else {
                        card.classList.remove('show');
                    }
                }
            });
        });
    });

    // Set 'All' as default active filter
    document.querySelector('[data-filter="all"]').click();
});

// Sticky navigation
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > nav.offsetTop) {
        nav.classList.add('sticky');
    } else {
        nav.classList.remove('sticky');
    }
});
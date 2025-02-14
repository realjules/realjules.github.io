// Floating Window System
class FloatingWindow {
    constructor(trigger, window, closeBtn) {
        this.trigger = document.querySelector(trigger);
        this.window = document.querySelector(window);
        this.closeBtn = document.querySelector(closeBtn);
        this.isDragging = false;
        this.currentX;
        this.currentY;
        this.initialX;
        this.initialY;
        this.xOffset = 0;
        this.yOffset = 0;

        this.init();
    }

    init() {
        // Show window on trigger click
        this.trigger.addEventListener('click', (e) => {
            e.preventDefault();
            this.window.style.display = 'block';
        });

        // Close window on close button click
        this.closeBtn.addEventListener('click', () => {
            this.window.style.display = 'none';
        });

        // Make window draggable
        this.window.addEventListener('mousedown', (e) => this.dragStart(e));
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('mouseup', () => this.dragEnd());
    }

    dragStart(e) {
        if (e.target === this.window) {
            this.initialX = e.clientX - this.xOffset;
            this.initialY = e.clientY - this.yOffset;
            this.isDragging = true;
        }
    }

    drag(e) {
        if (this.isDragging) {
            e.preventDefault();
            this.currentX = e.clientX - this.initialX;
            this.currentY = e.clientY - this.initialY;
            this.xOffset = this.currentX;
            this.yOffset = this.currentY;
            this.window.style.transform = `translate3d(${this.currentX}px, ${this.currentY}px, 0)`;
        }
    }

    dragEnd() {
        this.isDragging = false;
    }
}

// Social Media Integration
class SocialShare {
    constructor() {
        this.init();
    }

    init() {
        // Add share buttons to all project cards
        document.querySelectorAll('.project-card').forEach(card => {
            const shareContainer = document.createElement('div');
            shareContainer.className = 'social-share';
            
            const title = card.querySelector('h3').textContent;
            const url = window.location.href;
            
            shareContainer.innerHTML = `
                <button onclick="window.open('https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}', '_blank')" class="share-btn twitter">
                    Share on Twitter
                </button>
                <button onclick="window.open('https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}', '_blank')" class="share-btn linkedin">
                    Share on LinkedIn
                </button>
            `;
            
            card.appendChild(shareContainer);
        });
    }
}

// Analytics Tracking
class Analytics {
    constructor() {
        this.init();
    }

    init() {
        // Track page views
        this.trackPageView();

        // Track clicks on all links
        document.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => this.trackEvent('Link Click', link.href));
        });

        // Track project card views
        this.trackProjectViews();

        // Track skill clicks
        document.querySelectorAll('.skill-list li').forEach(skill => {
            skill.addEventListener('click', () => this.trackEvent('Skill Click', skill.textContent.trim()));
        });
    }

    trackPageView() {
        if (window.gtag) {
            gtag('event', 'page_view', {
                page_title: document.title,
                page_location: window.location.href,
                page_path: window.location.pathname
            });
        }
    }

    trackEvent(category, label) {
        if (window.gtag) {
            gtag('event', category, {
                event_label: label,
                event_category: 'User Interaction'
            });
        }
    }

    trackProjectViews() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const projectTitle = entry.target.querySelector('h3').textContent;
                    this.trackEvent('Project View', projectTitle);
                    observer.unobserve(entry.target); // Track only first view
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.project-card').forEach(card => {
            observer.observe(card);
        });
    }
}

// Project Information Handler
class ProjectInfo {
    constructor() {
        this.projectData = {
            'drone-vision': {
                title: 'Drones Computer Vision Project',
                description: `
                    <h4>Technical Details</h4>
                    <ul>
                        <li>Implemented YOLO and Faster R-CNN for real-time object detection</li>
                        <li>Optimized for edge deployment on drone hardware</li>
                        <li>Achieved 90%+ accuracy in object detection tasks</li>
                    </ul>
                    <h4>Impact</h4>
                    <p>This project enables autonomous drone navigation and object tracking, with applications in search and rescue, agriculture, and surveillance.</p>
                `
            },
            // Add more project data here
        };
        this.init();
    }

    init() {
        document.querySelectorAll('.info-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const projectId = btn.dataset.project;
                const projectInfo = this.projectData[projectId];
                if (projectInfo) {
                    const floatContent = document.querySelector('#floatContent');
                    floatContent.innerHTML = projectInfo.description;
                    document.querySelector('#floatWindow h3').textContent = projectInfo.title;
                    document.querySelector('#floatWindow').style.display = 'block';
                }
            });
        });
    }
}

// Analytics Feedback
class AnalyticsFeedback {
    constructor() {
        this.feedbackElement = document.querySelector('#analyticsFeedback');
        this.timeout = null;
    }

    show(message) {
        this.feedbackElement.textContent = message;
        this.feedbackElement.classList.add('show');
        
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        
        this.timeout = setTimeout(() => {
            this.feedbackElement.classList.remove('show');
        }, 3000);
    }
}

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize floating windows
    new FloatingWindow('#openFloat', '#floatWindow', '#closeBtn');
    
    // Initialize social sharing
    new SocialShare();
    
    // Initialize analytics
    const analytics = new Analytics();
    
    // Initialize project info
    new ProjectInfo();
    
    // Initialize analytics feedback
    const feedback = new AnalyticsFeedback();
    
    // Example of analytics feedback
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            feedback.show('Interaction tracked!');
        });
    });
});
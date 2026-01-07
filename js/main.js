/**
 * Portfolio Website JavaScript
 * Consolidated and optimized functionality for Jules Udahemuka's portfolio
 * Includes sticky navigation, error handling, and performance optimizations
 */

(function() {
    'use strict';
    
    // Utility functions
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    const safeQuerySelector = (selector) => {
        try {
            return document.querySelector(selector);
        } catch (error) {
            console.warn(`Failed to query selector: ${selector}`, error);
            return null;
        }
    };

    const safeQuerySelectorAll = (selector) => {
        try {
            return document.querySelectorAll(selector);
        } catch (error) {
            console.warn(`Failed to query selector: ${selector}`, error);
            return [];
        }
    };

    // Navigation functionality
    class NavigationManager {
        constructor() {
            this.navBar = safeQuerySelector('nav');
            this.titleElement = safeQuerySelector('header h1');
            this.navBarOffset = this.navBar ? this.navBar.offsetTop : 0;
            this.isSticky = false;
            
            this.init();
        }

        init() {
            if (!this.navBar) {
                console.warn('Navigation bar not found');
                return;
            }

            // Use debounced scroll handler for better performance
            this.handleScroll = debounce(this.handleScroll.bind(this), 16); // ~60fps
            window.addEventListener('scroll', this.handleScroll, { passive: true });
            
            // Handle smooth scrolling for navigation links
            this.initSmoothScrolling();
        }

        handleScroll() {
            const shouldBeSticky = window.scrollY > this.navBarOffset;
            
            if (shouldBeSticky !== this.isSticky) {
                this.isSticky = shouldBeSticky;
                this.updateStickyState();
            }
        }

        updateStickyState() {
            if (!this.navBar) return;

            if (this.isSticky) {
                this.navBar.classList.add('sticky');
                this.navBar.style.backgroundColor = '#f2f2f2';
                
                if (this.titleElement) {
                    this.titleElement.style.marginLeft = '20px';
                }
            } else {
                this.navBar.classList.remove('sticky');
                this.navBar.style.backgroundColor = '';
                
                if (this.titleElement) {
                    this.titleElement.style.marginLeft = '';
                }
            }
        }

        initSmoothScrolling() {
            const navLinks = safeQuerySelectorAll('nav a[href^="#"]');
            
            navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    const targetId = link.getAttribute('href');
                    const targetElement = safeQuerySelector(targetId);
                    
                    if (targetElement) {
                        e.preventDefault();
                        
                        // Calculate offset for sticky navigation
                        const offset = this.navBar ? this.navBar.offsetHeight : 0;
                        const targetPosition = targetElement.offsetTop - offset - 20; // 20px additional padding
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        }

        destroy() {
            window.removeEventListener('scroll', this.handleScroll);
        }
    }

    // External dependencies manager
    class ExternalDependenciesManager {
        constructor() {
            this.init();
        }

        init() {
            this.handleGitHubChart();
        }

        handleGitHubChart() {
            const chartImg = safeQuerySelector('.github-activity img');
            if (!chartImg) return;

            // Add error handling for GitHub chart
            chartImg.addEventListener('error', () => {
                console.warn('GitHub chart failed to load');
                const fallbackDiv = document.createElement('div');
                fallbackDiv.className = 'github-chart-fallback';
                fallbackDiv.innerHTML = `
                    <p>GitHub activity chart temporarily unavailable</p>
                    <a href="https://github.com/realjules" target="_blank" rel="noopener">
                        View GitHub Profile
                    </a>
                `;
                chartImg.parentNode.replaceChild(fallbackDiv, chartImg);
            });

            // Add loading state
            chartImg.addEventListener('load', () => {
                chartImg.style.opacity = '1';
                chartImg.style.transition = 'opacity 0.3s ease';
            });

            // Set initial loading state
            chartImg.style.opacity = '0.7';
        }
    }

    // Performance monitoring
    class PerformanceMonitor {
        constructor() {
            this.init();
        }

        init() {
            // Monitor page load performance
            window.addEventListener('load', () => {
                if ('performance' in window) {
                    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                    console.log(`Page loaded in ${loadTime}ms`);
                }
            });

            // Monitor scroll performance
            this.monitorScrollPerformance();
        }

        monitorScrollPerformance() {
            let scrollCount = 0;
            let lastScrollTime = 0;
            
            const scrollMonitor = () => {
                const now = performance.now();
                scrollCount++;
                
                if (now - lastScrollTime > 1000) { // Log every second
                    if (scrollCount > 60) { // More than 60 scroll events per second
                        console.warn('High scroll event frequency detected:', scrollCount);
                    }
                    scrollCount = 0;
                    lastScrollTime = now;
                }
            };

            window.addEventListener('scroll', scrollMonitor, { passive: true });
        }
    }

    // Error handling and logging
    class ErrorHandler {
        constructor() {
            this.init();
        }

        init() {
            // Global error handler
            window.addEventListener('error', (event) => {
                console.error('Global error:', event.error);
                this.logError(event.error);
            });

            // Unhandled promise rejection handler
            window.addEventListener('unhandledrejection', (event) => {
                console.error('Unhandled promise rejection:', event.reason);
                this.logError(event.reason);
            });
        }

        logError(error) {
            // In a production environment, you might want to send this to an error tracking service
            const errorData = {
                message: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString(),
                url: window.location.href,
                userAgent: navigator.userAgent
            };
            
            // Store in localStorage for debugging purposes
            try {
                const errors = JSON.parse(localStorage.getItem('portfolio_errors') || '[]');
                errors.push(errorData);
                // Keep only last 10 errors
                if (errors.length > 10) {
                    errors.splice(0, errors.length - 10);
                }
                localStorage.setItem('portfolio_errors', JSON.stringify(errors));
            } catch (e) {
                console.warn('Failed to store error in localStorage:', e);
            }
        }
    }

    // Contact Form Manager
    class ContactFormManager {
        constructor() {
            this.form = safeQuerySelector('#contact-form');
            this.statusElement = safeQuerySelector('#form-status');
            this.submitButton = safeQuerySelector('#contact-form .submit-button');
            this.formFields = {
                name: safeQuerySelector('#name'),
                email: safeQuerySelector('#email'),
                subject: safeQuerySelector('#subject'),
                message: safeQuerySelector('#message')
            };
            
            this.init();
        }

        init() {
            if (!this.form) {
                console.warn('Contact form not found');
                return;
            }

            this.setupEventListeners();
            this.setupRealTimeValidation();
        }

        setupEventListeners() {
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
            
            // Add input event listeners for real-time validation
            Object.keys(this.formFields).forEach(fieldName => {
                const field = this.formFields[fieldName];
                if (field) {
                    field.addEventListener('blur', () => this.validateField(fieldName));
                    field.addEventListener('input', () => this.clearFieldError(fieldName));
                }
            });
        }

        setupRealTimeValidation() {
            // Setup debounced validation for better UX
            const debouncedValidate = debounce((fieldName) => {
                this.validateField(fieldName);
            }, 300);

            Object.keys(this.formFields).forEach(fieldName => {
                const field = this.formFields[fieldName];
                if (field) {
                    field.addEventListener('input', () => {
                        debouncedValidate(fieldName);
                    });
                }
            });
        }

        validateField(fieldName) {
            const field = this.formFields[fieldName];
            const fieldGroup = field.closest('.form-group');
            const errorElement = safeQuerySelector(`#${fieldName}-error`);
            
            if (!field || !fieldGroup || !errorElement) return false;

            const value = field.value.trim();
            let isValid = true;
            let errorMessage = '';

            // Field-specific validation
            switch (fieldName) {
                case 'name':
                    if (!value) {
                        isValid = false;
                        errorMessage = 'Name is required.';
                    } else if (value.length < 2) {
                        isValid = false;
                        errorMessage = 'Name must be at least 2 characters long.';
                    } else if (value.length > 50) {
                        isValid = false;
                        errorMessage = 'Name must be less than 50 characters long.';
                    }
                    break;

                case 'email':
                    if (!value) {
                        isValid = false;
                        errorMessage = 'Email is required.';
                    } else if (!this.isValidEmail(value)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid email address.';
                    }
                    break;

                case 'subject':
                    if (!value) {
                        isValid = false;
                        errorMessage = 'Subject is required.';
                    } else if (value.length < 5) {
                        isValid = false;
                        errorMessage = 'Subject must be at least 5 characters long.';
                    } else if (value.length > 100) {
                        isValid = false;
                        errorMessage = 'Subject must be less than 100 characters long.';
                    }
                    break;

                case 'message':
                    if (!value) {
                        isValid = false;
                        errorMessage = 'Message is required.';
                    } else if (value.length < 10) {
                        isValid = false;
                        errorMessage = 'Message must be at least 10 characters long.';
                    } else if (value.length > 1000) {
                        isValid = false;
                        errorMessage = 'Message must be less than 1000 characters long.';
                    }
                    break;
            }

            // Update UI based on validation result
            if (isValid) {
                fieldGroup.classList.remove('error');
                errorElement.textContent = '';
                errorElement.classList.remove('show');
                field.setAttribute('aria-invalid', 'false');
            } else {
                fieldGroup.classList.add('error');
                errorElement.textContent = errorMessage;
                errorElement.classList.add('show');
                field.setAttribute('aria-invalid', 'true');
            }

            return isValid;
        }

        clearFieldError(fieldName) {
            const field = this.formFields[fieldName];
            const fieldGroup = field.closest('.form-group');
            const errorElement = safeQuerySelector(`#${fieldName}-error`);

            if (fieldGroup && errorElement) {
                fieldGroup.classList.remove('error');
                errorElement.textContent = '';
                errorElement.classList.remove('show');
                field.setAttribute('aria-invalid', 'false');
            }
        }

        isValidEmail(email) {
            // RFC 5322 compliant email validation regex
            const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
            return emailRegex.test(email);
        }

        validateForm() {
            const fieldNames = Object.keys(this.formFields);
            const validationResults = fieldNames.map(fieldName => this.validateField(fieldName));
            return validationResults.every(result => result === true);
        }

        async handleSubmit(event) {
            event.preventDefault();
            
            // Clear previous status
            this.clearStatus();
            
            // Validate form
            if (!this.validateForm()) {
                this.showStatus('Please correct the errors above.', 'error');
                // Focus on first invalid field
                const firstInvalidField = this.form.querySelector('.form-group.error input, .form-group.error textarea');
                if (firstInvalidField) {
                    firstInvalidField.focus();
                }
                return;
            }

            // Disable submit button to prevent double submission
            this.setSubmitButtonState(true);

            try {
                // Simulate form submission (since this is a static site)
                await this.submitForm();
                this.showStatus('Thank you for your message! I\'ll get back to you soon.', 'success');
                this.form.reset();
                
                // Clear any remaining field errors
                Object.keys(this.formFields).forEach(fieldName => {
                    this.clearFieldError(fieldName);
                });
                
            } catch (error) {
                console.error('Form submission error:', error);
                this.showStatus('Sorry, there was an error sending your message. Please try again or contact me directly.', 'error');
            } finally {
                this.setSubmitButtonState(false);
            }
        }

        async submitForm() {
            // Since this is a static site, we'll simulate form submission
            // In a real implementation, you would send this to your backend
            const formData = {
                name: this.formFields.name.value.trim(),
                email: this.formFields.email.value.trim(),
                subject: this.formFields.subject.value.trim(),
                message: this.formFields.message.value.trim(),
                timestamp: new Date().toISOString()
            };

            // Simulate async operation
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    // Store form data in localStorage for demo purposes
                    try {
                        const submissions = JSON.parse(localStorage.getItem('contact_submissions') || '[]');
                        submissions.push(formData);
                        localStorage.setItem('contact_submissions', JSON.stringify(submissions));
                        console.log('Form submitted successfully:', formData);
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                }, 1000); // Simulate network delay
            });
        }

        setSubmitButtonState(isSubmitting) {
            if (!this.submitButton) return;

            if (isSubmitting) {
                this.submitButton.disabled = true;
                this.submitButton.textContent = 'Sending...';
            } else {
                this.submitButton.disabled = false;
                this.submitButton.textContent = 'Send Message';
            }
        }

        showStatus(message, type) {
            if (!this.statusElement) return;

            this.statusElement.textContent = message;
            this.statusElement.className = `form-status ${type}`;
            this.statusElement.setAttribute('aria-live', 'polite');
            
            // Scroll status into view
            this.statusElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        clearStatus() {
            if (!this.statusElement) return;
            
            this.statusElement.textContent = '';
            this.statusElement.className = 'form-status';
        }
    }

    // Accessibility enhancements
    class AccessibilityManager {
        constructor() {
            this.init();
        }

        init() {
            this.enhanceKeyboardNavigation();
            this.addSkipLink();
            this.improveImageAccessibility();
        }

        enhanceKeyboardNavigation() {
            // Add visible focus indicators for keyboard navigation
            const focusableElements = safeQuerySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
            
            focusableElements.forEach(element => {
                element.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        // For links, ensure they can be activated with Enter/Space
                        if (element.tagName === 'A' && e.key === ' ') {
                            e.preventDefault();
                            element.click();
                        }
                    }
                });
            });
        }

        addSkipLink() {
            // Add skip to main content link for screen readers
            const skipLink = document.createElement('a');
            skipLink.href = '#main';
            skipLink.textContent = 'Skip to main content';
            skipLink.className = 'skip-link';
            skipLink.setAttribute('aria-label', 'Skip to main content');
            
            skipLink.addEventListener('focus', () => {
                skipLink.style.top = '6px';
            });
            
            skipLink.addEventListener('blur', () => {
                skipLink.style.top = '-40px';
            });
            
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const mainContent = document.getElementById('main');
                if (mainContent) {
                    mainContent.focus();
                    mainContent.scrollIntoView({ behavior: 'smooth' });
                }
            });
            
            document.body.insertBefore(skipLink, document.body.firstChild);
        }

        improveImageAccessibility() {
            // Ensure all images have proper alt attributes
            const images = safeQuerySelectorAll('img:not([alt])');
            images.forEach(img => {
                console.warn('Image missing alt attribute:', img.src);
                img.setAttribute('alt', '');
            });
        }
    }

    // Main application class
    class PortfolioApp {
        constructor() {
            this.navigationManager = null;
            this.externalDependenciesManager = null;
            this.performanceMonitor = null;
            this.errorHandler = null;
            this.accessibilityManager = null;
            this.contactFormManager = null;
            
            this.init();
        }

        init() {
            // Initialize error handling first
            this.errorHandler = new ErrorHandler();
            
            // Initialize all managers
            this.navigationManager = new NavigationManager();
            this.externalDependenciesManager = new ExternalDependenciesManager();
            this.performanceMonitor = new PerformanceMonitor();
            this.accessibilityManager = new AccessibilityManager();
            this.contactFormManager = new ContactFormManager();
            
            console.log('Portfolio app initialized successfully');
        }

        destroy() {
            // Cleanup method for removing event listeners
            if (this.navigationManager) {
                this.navigationManager.destroy();
            }
        }
    }

    // Initialize the application when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.portfolioApp = new PortfolioApp();
        });
    } else {
        window.portfolioApp = new PortfolioApp();
    }

    // Expose app instance globally for debugging
    window.portfolioApp = window.portfolioApp || null;

})();
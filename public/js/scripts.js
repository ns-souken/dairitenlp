const App = {
    init() {
        this.initFontOptimization();
        lucide.createIcons();
        this.initMobileMenu();
        this.initFaqAccordion();
        this.initAnimations();
        this.initImagePopup();
        this.initMarquee();
    },

    initFontOptimization() {
        if ('fonts' in document) {
            document.fonts.ready.then(() => {
                document.documentElement.classList.add('fonts-loaded');
            });
        } else {
            setTimeout(() => {
                document.documentElement.classList.add('fonts-loaded');
            }, 100);
        }
    },

    initMobileMenu() {
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');

        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });

            mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.add('hidden');
                });
            });
        }
    },

    initFaqAccordion() {
        document.querySelectorAll('.faq-question').forEach(button => {
            button.addEventListener('click', () => {
                const faqItem = button.closest('.faq-item');
                const answer = faqItem.querySelector('.faq-answer');
                const icon = button.querySelector('.icon');

                answer.classList.toggle('hidden');
                button.classList.toggle('active');
                icon.classList.toggle('rotate-180');
            });
        });
    },

    initAnimations() {
        const createObserver = (handler, options) => new IntersectionObserver(handler, options);

        // Counter Animation
        const counterBoxes = document.querySelectorAll('.counter-visual-effect');
        if (counterBoxes.length > 0) {
            const animateCounter = (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const counterBox = entry.target;
                        counterBox.classList.add('in-view');
                        const counter = counterBox.querySelector('.counter-value');
                        const target = +counter.getAttribute('data-target');
                        let current = 0;
                        const speed = 100;
                        const updateCount = () => {
                            const increment = target / speed;
                            if (current < target) {
                                current += increment;
                                counter.innerText = Math.ceil(current);
                                setTimeout(updateCount, 1);
                            } else {
                                counter.innerText = target;
                            }
                        };
                        updateCount();
                        observer.unobserve(counterBox);
                    }
                });
            };
            const counterObserver = createObserver(animateCounter, { threshold: 0.5 });
            counterBoxes.forEach(box => counterObserver.observe(box));
        }

        // Price Bounce Animation
        const priceAnimationTargets = document.querySelectorAll('.price-animation-target');
        if (priceAnimationTargets.length > 0) {
            const animatePriceBounce = (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('price-bounce-animation');
                        observer.unobserve(entry.target);
                    }
                });
            };
            const priceObserver = createObserver(animatePriceBounce, { threshold: 0.8 });
            priceAnimationTargets.forEach(target => priceObserver.observe(target));
        }

        // Feature Card Animation
        const featureCards = document.querySelectorAll('.feature-card');
        if (featureCards.length > 0) {
            const animateFeatureCards = (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const card = entry.target;
                        const index = Array.from(featureCards).indexOf(card);
                        card.classList.add(index % 2 === 0 ? 'slide-in-left' : 'slide-in-right');
                        card.style.animationDelay = `${index * 0.1}s`;
                        observer.unobserve(card);
                    }
                });
            };
            const featureCardObserver = createObserver(animateFeatureCards, { threshold: 0.2 });
            featureCards.forEach(card => featureCardObserver.observe(card));
        }

        // Problem Card Animation
        const problemCards = document.querySelectorAll('.problem-card');
        if (problemCards.length > 0) {
            const animateProblemCards = (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                        observer.unobserve(entry.target);
                    }
                });
            };
            const problemCardObserver = createObserver(animateProblemCards, { threshold: 0.3 });
            problemCards.forEach(card => problemCardObserver.observe(card));
        }

        // Price Card Checkmark Animation
        const priceCardForChecks = document.querySelector('.price-card');
        if (priceCardForChecks) {
            const checkIcons = priceCardForChecks.querySelectorAll('.feature-check-icon');
            const checkObserver = createObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        checkIcons.forEach((icon, index) => {
                            setTimeout(() => icon.classList.add('is-visible'), index * 150);
                        });
                        observer.unobserve(priceCardForChecks);
                    }
                });
            }, { threshold: 0.8 });
            checkObserver.observe(priceCardForChecks);
        }

        // Comparison Table Animation
        const comparisonTableWrapper = document.querySelector('.comparison-table');
        if (comparisonTableWrapper && window.innerWidth < 768) {
            const tableObserver = createObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Animation logic remains complex, keeping it as is for now.
                        // Refactoring this further might be a good next step.
                        let animationInterval;
                        let isAnimating = false;
                        const peekAnimation = () => {
                            if (isAnimating) return;
                            isAnimating = true;
                            const targetScroll = 60, duration = 800, startTime = performance.now();
                            function animateScroll(currentTime) {
                                const progress = Math.min((currentTime - startTime) / duration, 1);
                                const ease = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
                                comparisonTableWrapper.scrollLeft = ease * targetScroll;
                                if (progress < 1) requestAnimationFrame(animateScroll);
                                else {
                                    const returnStartTime = performance.now();
                                    function animateScrollBack(currentTime) {
                                        const progress = Math.min((currentTime - returnStartTime) / duration, 1);
                                        const ease = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
                                        comparisonTableWrapper.scrollLeft = targetScroll * (1 - ease);
                                        if (progress < 1) requestAnimationFrame(animateScrollBack);
                                        else isAnimating = false;
                                    }
                                    setTimeout(() => requestAnimationFrame(animateScrollBack), 300);
                                }
                            }
                            requestAnimationFrame(animateScroll);
                        };
                        const startAnimationCycle = () => {
                            peekAnimation();
                            animationInterval = setInterval(peekAnimation, 1000);
                        };
                        setTimeout(startAnimationCycle, 1500);
                        const stopAnimationOnScroll = () => {
                            if (!isAnimating) {
                                clearInterval(animationInterval);
                                comparisonTableWrapper.removeEventListener('scroll', stopAnimationOnScroll);
                            }
                        };
                        comparisonTableWrapper.addEventListener('scroll', stopAnimationOnScroll);
                        observer.unobserve(comparisonTableWrapper);
                    }
                });
            }, { threshold: 0.05 });
            tableObserver.observe(comparisonTableWrapper);
        }

        // Mobile CTA Bar Animation
        const mobileCtaBar = document.getElementById('mobile-cta-bar');
        const heroSection = document.querySelector('main > section:first-of-type');
        if (mobileCtaBar && heroSection) {
            const ctaObserver = createObserver((entries) => {
                entries.forEach(entry => {
                    mobileCtaBar.classList.toggle('translate-y-full', entry.isIntersecting);
                });
            }, { threshold: 0.1 });
            ctaObserver.observe(heroSection);
        }
    },

    initImagePopup() {
        const pcImage = document.getElementById('pc-image');
        const imagePopup = document.getElementById('image-popup');
        const popupImage = document.getElementById('popup-image');
        const closePopup = document.getElementById('close-popup');

        if (pcImage && imagePopup && popupImage && closePopup) {
            const close = () => imagePopup.classList.add('hidden');
            pcImage.addEventListener('click', () => {
                popupImage.src = pcImage.src;
                imagePopup.classList.remove('hidden');
            });
            closePopup.addEventListener('click', close);
            imagePopup.addEventListener('click', (e) => {
                if (e.target === imagePopup) close();
            });
        }
    },

    initMarquee() {
        const marqueeContainer = document.querySelector('.marquee-container');
        if (marqueeContainer) {
            let isDown = false, startX, scrollLeft, isDragging = false;
            const marqueeContent = document.querySelector('.marquee-content');

            const startInteraction = (pageX) => {
                isDown = true;
                isDragging = false;
                marqueeContainer.classList.add('active');
                startX = pageX - marqueeContainer.offsetLeft;
                scrollLeft = marqueeContainer.scrollLeft;
                if (marqueeContent) marqueeContent.style.animationPlayState = 'paused';
            };

            const endInteraction = () => {
                isDown = false;
                marqueeContainer.classList.remove('active');
                if (marqueeContent) marqueeContent.style.animationPlayState = 'running';
                setTimeout(() => { isDragging = false; }, 50);
            };

            const moveInteraction = (pageX) => {
                if (!isDown) return;
                const x = pageX - marqueeContainer.offsetLeft;
                const walk = x - startX;
                if (Math.abs(walk) > 5) isDragging = true;
                marqueeContainer.scrollLeft = scrollLeft - walk * 2;
            };

            marqueeContainer.addEventListener('mousedown', (e) => {
                e.preventDefault();
                startInteraction(e.pageX);
            });
            marqueeContainer.addEventListener('mouseleave', endInteraction);
            marqueeContainer.addEventListener('mouseup', endInteraction);
            marqueeContainer.addEventListener('mousemove', (e) => {
                if (isDown) {
                    e.preventDefault();
                    moveInteraction(e.pageX);
                }
            });

            marqueeContainer.addEventListener('touchstart', (e) => startInteraction(e.touches[0].pageX), { passive: true });
            marqueeContainer.addEventListener('touchend', endInteraction);
            marqueeContainer.addEventListener('touchmove', (e) => {
                if (isDown) moveInteraction(e.touches[0].pageX);
            }, { passive: true });

            marqueeContainer.querySelectorAll('.marquee-item').forEach(link => {
                link.addEventListener('click', (e) => {
                    if (isDragging) e.preventDefault();
                });
            });
        }
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());

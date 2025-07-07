/**
 * Accessible, animated mobile menu script
 */
class MobileMenu {
  constructor() {
    this.header = document.querySelector('header');
    this.menuButton = document.getElementById('mobile-menu-button');
    this.menu = document.getElementById('mobile-menu');
    
    if (!this.header || !this.menuButton || !this.menu) {
      console.error('Mobile menu elements not found.');
      return;
    }
    
    this.init();
  }

  init() {
    this.setupAccessibility();
    this.bindEvents();
  }

  setupAccessibility() {
    this.menuButton.setAttribute('aria-controls', 'mobile-menu');
    this.menuButton.setAttribute('aria-expanded', 'false');
  }

  bindEvents() {
    this.menuButton.addEventListener('click', () => this.toggleMenu());

    // Close menu when a link is clicked
    this.menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });

    // Close menu with ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen()) {
        this.closeMenu();
      }
    });
  }

  isMenuOpen() {
    return this.header.classList.contains('is-open');
  }

  toggleMenu() {
    this.header.classList.toggle('is-open');
    const isOpen = this.isMenuOpen();
    this.menuButton.setAttribute('aria-expanded', isOpen.toString());

    if (isOpen) {
      // Focus first focusable element in menu
      this.menu.querySelector('a, button')?.focus();
    } else {
      // Return focus to the menu button
      this.menuButton.focus();
    }
  }

  openMenu() {
    if (!this.isMenuOpen()) {
      this.toggleMenu();
    }
  }

  closeMenu() {
    if (this.isMenuOpen()) {
      this.toggleMenu();
    }
  }
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  new MobileMenu();
});

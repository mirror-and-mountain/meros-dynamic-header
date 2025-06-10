import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import './view.scss';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    setupMerosNav();

    const block = document.querySelector('.wp-block-meros-dynamic-header');
    if (!block) return;
    const isWrappedInPersist = block.closest('[x-persist="header"]') !== null;

    const header = isWrappedInPersist
        ? block.closest('[x-persist="header"]')
        : block;

    if (!header) return;

    const isSticky = block.dataset.sticky === 'true';
    const bottomOffset = block.dataset.bottomOffset === 'true';
    const isOverlay = block.dataset.overlay === 'true';
    const blockGap = block.dataset.blockGap;

    if (isSticky) {
        requestAnimationFrame(() => {
            const adminBar = document.getElementById('wpadminbar');
            const adminBarHeight = adminBar ? adminBar.offsetHeight : 0;

            header.style.position = 'sticky';
            header.style.top = adminBarHeight + 'px';
            header.style.zIndex = '50';
        });
    }


    if (bottomOffset || isSticky) {
        if (blockGap) {
            header.style.marginBottom = '-' + blockGap;
        }
    }

    if (isOverlay) {
        let unit = 'rem';
        const bottomMargin = header.style.marginBottom || '0';
        let height = header.offsetHeight;

        if (bottomMargin.endsWith(unit)) {
            height = height / parseFloat(getComputedStyle(document.documentElement).fontSize);
        } else {
            unit = 'px';
        }

        header.style.marginBottom = (parseFloat(bottomMargin.replace(unit, '')) - height) + unit;

        const bgStart = block.dataset.backgroundStart || '#FFFFFF00';
        const bgEnd = block.dataset.backgroundEnd || '#FFFFFF';
        const textStart = block.dataset.textStart || '#000000';
        const textEnd = block.dataset.textEnd || '#000000';

        gsap.fromTo(header,
            {
                backgroundColor: bgStart,
                color: textStart
            },
            {
                backgroundColor: bgEnd,
                color: textEnd,
                scrollTrigger: {
                    trigger: header,
                    start: 'top top',
                    end: '+=100',
                    scrub: true
                }
            }
        );
    }
});

function setupMerosNav() {
    const merosNavs = document.querySelectorAll('[class*="has-meros-nav-"]');
    merosNavs.forEach(merosNav => {
        if (!merosNav) return;
        const merosNavContainer = merosNav.querySelector('.wp-block-navigation__responsive-container');
        if (!merosNavContainer) return;

        const mobileBreakpoint = '(max-width: 599px)';
        const mql = window.matchMedia(mobileBreakpoint);

        function setTopSection(e) {
            const existing = merosNavContainer.querySelector('.meros-nav-top-section');
            const container = merosNavContainer.querySelector('.wp-block-navigation__responsive-dialog');
            const closeButton = container.querySelector('.wp-block-navigation__responsive-container-close');
            const subMenuIcons = container.querySelectorAll('.wp-block-navigation__submenu-icon') || [];
            const logoSrc = merosNav.dataset.merosNavLogo || null;

            if (e.matches || merosNav.classList.contains('has-meros-nav-always')) {

                if (existing || !container) return;

                // Create the top section container
                const topSection = document.createElement('div');
                topSection.className = 'meros-nav-top-section';

                // Setup the logo if provided
                let logoContainer = null;
                let logoLink = null;
                let logoElement = null;
                if (logoSrc) {
                    logoContainer = document.createElement('div');
                    logoContainer.className = 'meros-nav-logo';
                    logoLink = document.createElement('a');
                    logoLink.href = merosNav.dataset.merosNavLogoLink || '#';
                    logoElement = document.createElement('img');
                    logoElement.src = logoSrc;
                    logoElement.alt = 'Site Logo';
                    logoLink.appendChild(logoElement);
                    logoContainer.appendChild(logoLink);
                }

                // Prepend the top section to the container
                container.prepend(topSection);

                // Append/Prepend the close button and logo based on direction
                if (closeButton && logoContainer) {
                    topSection.appendChild(closeButton);
                    topSection.prepend(logoContainer);
                } else if (closeButton && !logoContainer) {
                    topSection.appendChild(closeButton);
                }

                subMenuIcons.forEach((icon) => {
                    const button = icon.previousElementSibling;

                    if (button && button.tagName === 'BUTTON') {
                        button.appendChild(icon);
                    }
                });

            } else {
                // Put the close button back to the top of the container
                if (closeButton && container) {
                    container.prepend(closeButton);
                }
                // If the top section exists and we are not in mobile view, remove it
                const topSection = merosNavContainer.querySelector('.meros-nav-top-section');
                if (topSection) {
                    topSection.remove();
                }

                subMenuIcons.forEach((icon) => {
                    const button = icon.parentElement;
                    const parentOfButton = button.parentElement;

                    if (button && button.tagName === 'BUTTON' && parentOfButton && parentOfButton.tagName === 'LI') {
                        button.after(icon);
                    }
                });
            }
        }

        function applyStyles(e) {
            const merosNavHighlightColor = merosNav.dataset.merosNavHighlightColor || '#f0f0f0';
            const merosNavDesktopHighlight = merosNav.dataset.merosNavDesktopHighlight || 'false';
            const merosNavBackgroundColor = merosNav.dataset.merosNavBackgroundColor || '#FFFFFF';
            const merosNavTextColor = merosNav.dataset.merosNavTextColor || '#000000';
            const root = document.querySelector(':root');
            
            root.style.setProperty('--meros-nav-highlight-color', merosNavHighlightColor);

            const navItems = merosNavContainer.querySelectorAll('.wp-block-navigation-item__content') || [];

            // Ensure the current page has the current-menu-item class
            navItems.forEach(item => {
                if (item.tagName !== 'A') return;
                const normalisedUrl = url => url.replace(/\/+$/, '').replace(/#.*$/, '');
                const itemHref      = normalisedUrl(item.href);
                const currentHref   = normalisedUrl(window.location.href);

                const li = item.closest('li');
                if (!li) return;

                const isCurrent = itemHref === currentHref;
                li.classList.toggle('current-menu-item', isCurrent);
            });

            if (e.matches || merosNav.classList.contains('has-meros-nav-always')) {
                // Add mobile menu styles
                merosNavContainer.style.setProperty('background-color', merosNavBackgroundColor, 'important');
                merosNavContainer.style.setProperty('color', merosNavTextColor, 'important');

                // Remove desktop styling class
                merosNavContainer.classList.remove('has-meros-nav-desktop-highlight');
            }
            else {
                // Remove mobile menu styles
                merosNavContainer.style.removeProperty('background-color');
                merosNavContainer.style.removeProperty('color');

                // Add desktop styling class if provided
                if (merosNavDesktopHighlight === 'true') {
                    merosNavContainer.classList.add('has-meros-nav-desktop-highlight');
                }
            }
        }

        // Needed to avoid mobile nav flicker when the viewport changes width.
        function toggleTransitionTemporarily() {
            merosNavContainer.style.setProperty('transition', 'none', 'important');
            setTimeout(() => {
                merosNavContainer.style.setProperty('transition', 'transform 0.4s cubic-bezier(.77, 0, .18, 1)', 'important');
            }, 100);
        }

        // Initial setup
        setTopSection(mql);
        applyStyles(mql);
        toggleTransitionTemporarily();

        // Listen for viewport changes
        if (typeof mql.addEventListener === 'function') {
            mql.addEventListener('change', (e) => {
                toggleTransitionTemporarily();
                setTopSection(e);
                applyStyles(e);
            });
        }
    });
}

// Update the current menu item class on navigation changes
// This is needed for Livewire navigation updates
document.addEventListener('livewire:navigated', () => {
    requestAnimationFrame(() => {
        setupMerosNav();
    });
});

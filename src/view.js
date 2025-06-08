import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import './view.scss';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {

    setupMerosNav();

    // Handle the dynamic header block
    const block = document.querySelector('.wp-block-meros-dynamic-header');
    const headerEl = block?.parentElement;
    if (!headerEl || headerEl.tagName !== 'HEADER') return;

    const isWrappedInPersist = headerEl.closest('[x-persist="header"]') !== null;
    const header = isWrappedInPersist
        ? headerEl.closest('[x-persist="header"]')
        : headerEl;

    if (!header) return;

    const isSticky = block.dataset.sticky === 'true';
    const bottomOffset = block.dataset.bottomOffset === 'true';
    const isOverlay = block.dataset.overlay === 'true';
    const blockGap = block.dataset.blockGap;

    if (isSticky) {
        const adminBar = document.getElementById('wpadminbar');
        const adminBarHeight = adminBar ? adminBar.offsetHeight : 0;

        header.style.position = 'sticky';
        header.style.top = adminBarHeight + 'px';
        header.style.zIndex = 50;
    }

    if (bottomOffset || isSticky) {
        header.style.marginBottom = '-' + blockGap;
    }

    if (isOverlay) {
        let unit = 'rem';
        const bottomMargin = header.style.marginBottom;
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
    const merosNav = document.querySelector('[class*="has-meros-nav-"]');
    if (!merosNav) return;
    const merosNavContainer = merosNav.querySelector('.wp-block-navigation__responsive-container');
    if (!merosNavContainer) return;
    // Needed globally
    const merosNavHighlightColor = merosNav.dataset.merosNavHighlightColor || '#f0f0f0';

    const mobileBreakpoint = '(max-width: 599px)';
    const mql = window.matchMedia(mobileBreakpoint);

    function setTopSection(e) {
        const existing     = merosNavContainer.querySelector('.meros-nav-top-section');
        const container    = merosNavContainer.querySelector('.wp-block-navigation__responsive-dialog');
        const closeButton  = container.querySelector('.wp-block-navigation__responsive-container-close');
        const logoSrc      = merosNav.dataset.merosNavLogo || null;
        
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
                logoContainer           = document.createElement('div');
                logoContainer.className = 'meros-nav-logo';
                logoLink                = document.createElement('a');
                logoLink.href           = merosNav.dataset.merosNavLogoLink || '#';
                logoElement             = document.createElement('img');
                logoElement.src         = logoSrc;
                logoElement.alt         = 'Site Logo';
                logoLink.appendChild(logoElement);
                logoContainer.appendChild(logoLink);
            }

            // Prepent the top section to the container
            container.prepend(topSection);
            
            // Append/Prpend the close button and logo based on direction
            if (closeButton && logoContainer) {
                topSection.appendChild(closeButton);
                topSection.prepend(logoContainer);
            } else if (closeButton && !logoContainer) {
                topSection.appendChild(closeButton);
            }
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
        }
    }

    function onEnter(e) {
        e.currentTarget.style.setProperty('background-color', merosNavHighlightColor, 'important');
    }
    function onLeave(e) {
        e.currentTarget.style.removeProperty('background-color');
    }
    function onFocus(e) {
        e.currentTarget.style.setProperty('background-color', merosNavHighlightColor, 'important');
    }
    function onBlur(e) {
        e.currentTarget.style.removeProperty('background-color');
    }
    function onMouseDown(e) {
        e.currentTarget.style.setProperty('background-color', merosNavHighlightColor, 'important');
    }
    function onMouseUp(e) {
        e.currentTarget.style.setProperty('background-color', merosNavHighlightColor, 'important');
    }


    function applyColors(e) {
        const merosNavBackgroundColor = merosNav.dataset.merosNavBackgroundColor || '#FFFFFF';
        const merosNavTextColor = merosNav.dataset.merosNavTextColor || '#000000';
        const navContainers = merosNavContainer.querySelectorAll('.wp-block-navigation-item') || [];
        const navItems = merosNavContainer.querySelectorAll('.wp-block-navigation-item__content') || [];
        
        if (e.matches || merosNav.classList.contains('has-meros-nav-always')) {
            merosNavContainer.style.setProperty('background-color', merosNavBackgroundColor, 'important');
            merosNavContainer.style.setProperty('color', merosNavTextColor, 'important');
            navItems.forEach((item) => {
                if (item.tagName === 'A') {
                    const normalizeUrl = url => url.replace(/\/+$/, '').replace(/#.*$/, '');
                    const itemHref = normalizeUrl(item.href);
                    const currentHref = normalizeUrl(window.location.href);

                    const li = item.closest('li');
                    if (!li) return;

                    if (itemHref === currentHref) {
                        li.classList.add('current-menu-item');
                        li.style.setProperty('background-color', merosNavHighlightColor, 'important');
                    } else {
                        li.classList.remove('current-menu-item');
                        li.style.removeProperty('background-color');
                    }
                }
            });
            navContainers.forEach((item) => {
                if (item.tagName !== 'LI') return;
                if (item.classList.contains('current-menu-item')) {
                    item.style.setProperty('background-color', merosNavHighlightColor, 'important');
                    return;
                }
                item.addEventListener('mouseenter', onEnter);
                item.addEventListener('mouseleave', onLeave);
                item.addEventListener('focus', onFocus);
                item.addEventListener('blur', onBlur);
                item.addEventListener('mousedown', onMouseDown);
                item.addEventListener('mouseup', onMouseUp);
            });
        } else {
            // Remove styles when not in mobile view
            merosNavContainer.style.removeProperty('background-color');
            merosNavContainer.style.removeProperty('color');
            navItems.forEach((item) => {
                if (item.tagName === 'A') {
                    item.closest('li').classList.remove('current-menu-item');
                }
            });
            navContainers.forEach((item) => {
                if (item.tagName !== 'LI') return;
                item.style.removeProperty('background-color');
                item.removeEventListener('mouseenter', onEnter);
                item.removeEventListener('mouseleave', onLeave);
                item.removeEventListener('focus', onFocus);
                item.removeEventListener('blur', onBlur);
                item.removeEventListener('mousedown', onMouseDown);
                item.removeEventListener('mouseup', onMouseUp);
            });
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
    applyColors(mql);
    toggleTransitionTemporarily();

    // Listen for viewport changes
    if (typeof mql.addEventListener === 'function') {
        mql.addEventListener('change', (e) => {
            toggleTransitionTemporarily();
            setTopSection(e);
            applyColors(e);
        });
    }
}

// Update the current menu item class on navigation changes
// This is needed for Livewire navigation updates
document.addEventListener('livewire:navigated', () => {
    requestAnimationFrame(() => {
        setupMerosNav();
    });
});

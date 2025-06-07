import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

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

    const merosNavBackgroundColor = merosNav.dataset.merosNavBackgroundColor || '#FFFFFF';
    const merosNavTextColor = merosNav.dataset.merosNavTextColor || '#000000';
    const siteLogo = merosNav.dataset.merosNavLogo || null;
    const merosNavContainer = merosNav.querySelector('.wp-block-navigation__responsive-container');
    if (!merosNavContainer) return;

    const mobileBreakpoint = '(max-width: 599px)';
    const mql = window.matchMedia(mobileBreakpoint);

    function setLogo(e) {
        if (!siteLogo) return; 
        if (e.matches || merosNav.classList.contains('has-meros-nav-always')) {
            const existingLogo = merosNavContainer.querySelector('.meros-nav-logo');
            if (existingLogo) return;
            const logoElement = document.createElement('img');
            logoElement.className = 'meros-nav-logo';
            logoElement.src = siteLogo;
            logoElement.alt = 'Site Logo';
            merosNavContainer.querySelector('.wp-block-navigation__responsive-dialog').prepend(logoElement);
        } else {
            const existingLogo = merosNavContainer.querySelector('.meros-nav-logo');
            if (existingLogo) {
                existingLogo.remove();
            }
        }
    }

    function applyColors(e) {
        if (e.matches || merosNav.classList.contains('has-meros-nav-always')) {
            merosNavContainer.style.setProperty('background-color', merosNavBackgroundColor, 'important');
            merosNavContainer.style.setProperty('color', merosNavTextColor, 'important');
        } else {
            merosNavContainer.style.removeProperty('background-color');
            merosNavContainer.style.removeProperty('color');
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
    setLogo(mql);
    applyColors(mql);
    toggleTransitionTemporarily();

    // Listen for viewport changes
    if (typeof mql.addEventListener === 'function') {
        mql.addEventListener('change', (e) => {
            toggleTransitionTemporarily();
            setLogo(e);
            applyColors(e);
        });
    }
}
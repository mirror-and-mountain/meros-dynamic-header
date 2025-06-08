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
        // Needed globally
        const merosNavHighlightColor = merosNav.dataset.merosNavHighlightColor || '#f0f0f0';

        const mobileBreakpoint = '(max-width: 599px)';
        const mql = window.matchMedia(mobileBreakpoint);

        function setTopSection(e) {
            const existing = merosNavContainer.querySelector('.meros-nav-top-section');
            const container = merosNavContainer.querySelector('.wp-block-navigation__responsive-dialog');
            const closeButton = container.querySelector('.wp-block-navigation__responsive-container-close');
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

        function applyStyles(e) {
            const merosNavBackgroundColor = merosNav.dataset.merosNavBackgroundColor || '#FFFFFF';
            const merosNavTextColor = merosNav.dataset.merosNavTextColor || '#000000';
            const navContainers = merosNavContainer.querySelectorAll('.wp-block-navigation-item') || [];
            const navItems = merosNavContainer.querySelectorAll('.wp-block-navigation-item__content') || [];
            const highlightStyle = merosNav.dataset.merosNavHighlightStyle || 'solid';
            const highlightColor = merosNavHighlightColor;
            const highlightThickness = '2px';

            // Set default transparent border to prevent shifting
            const initBorder = el => el.style.setProperty('border-bottom', `${highlightThickness} ${highlightStyle} transparent`, 'important');

            const setBorderColor = (el, color) => el.style.setProperty('border-bottom-color', color, 'important');
            const removeBorderColor = el => el.style.setProperty('border-bottom-color', 'transparent', 'important');

            const setBackground = el => el.style.setProperty('background-color', highlightColor, 'important');
            const removeBackground = el => el.style.removeProperty('background-color');

            const widenBorderSpan = el => el.style.setProperty('padding-inline', '0.2rem', 'important');

            const handleEnter = e => {
                setBackground(e.currentTarget);
                setBorderColor(e.currentTarget, highlightColor);
            };
            const handleLeave = e => {
                removeBackground(e.currentTarget);
                const isCurrent = e.currentTarget.classList.contains('current-menu-item');
                if (!isCurrent) removeBorderColor(e.currentTarget);
            };
            const handleMouseDown = e => setBackground(e.currentTarget);
            const handleMouseUp = e => setBackground(e.currentTarget);

            const attachInteractiveListeners = el => {
                el.removeEventListener('mouseenter', handleEnter);
                el.removeEventListener('mouseleave', handleLeave);
                el.removeEventListener('focus', handleEnter);
                el.removeEventListener('blur', handleLeave);
                el.removeEventListener('mousedown', handleMouseDown);
                el.removeEventListener('mouseup', handleMouseUp);

                el.addEventListener('mouseenter', handleEnter);
                el.addEventListener('mouseleave', handleLeave);
                el.addEventListener('focus', handleEnter);
                el.addEventListener('blur', handleLeave);
                el.addEventListener('mousedown', handleMouseDown);
                el.addEventListener('mouseup', handleMouseUp);
            };

            if (e.matches || merosNav.classList.contains('has-meros-nav-always')) {
                merosNavContainer.style.setProperty('background-color', merosNavBackgroundColor, 'important');
                merosNavContainer.style.setProperty('color', merosNavTextColor, 'important');

                navItems.forEach(item => {
                    if (item.tagName !== 'A') return;

                    const normalizeUrl = url => url.replace(/\/+$/, '').replace(/#.*$/, '');
                    const itemHref = normalizeUrl(item.href);
                    const currentHref = normalizeUrl(window.location.href);
                    const li = item.closest('li');
                    if (!li) return;

                    // Clean up styles from desktop mode
                    removeBorderColor(li);
                    li.style.removeProperty('padding-inline');

                    // Remove desktop listeners
                    if (li._applyBorder) {
                        li.removeEventListener('mouseenter', li._applyBorder);
                        li.removeEventListener('mouseleave', li._removeBorder);
                        li.removeEventListener('focus', li._applyBorder);
                        li.removeEventListener('blur', li._removeBorder);
                        delete li._applyBorder;
                        delete li._removeBorder;
                    }

                    const isCurrent = itemHref === currentHref;
                    li.classList.toggle('current-menu-item', isCurrent);

                    if (isCurrent) {
                        setBackground(li);
                    } else {
                        removeBackground(li);
                    }
                });

                navContainers.forEach(item => {
                    if (item.tagName !== 'LI') return;

                    // Clean up any styling from desktop mode
                    removeBorderColor(item);
                    item.style.removeProperty('padding-inline');

                    const isCurrent = item.classList.contains('current-menu-item');
                    if (isCurrent) {
                        setBackground(item);
                    } else {
                        removeBackground(item);
                        attachInteractiveListeners(item);
                    }
                });
            }
            else {
                merosNavContainer.style.removeProperty('background-color');
                merosNavContainer.style.removeProperty('color');

                navItems.forEach(item => {
                    if (item.tagName !== 'A') return;

                    const normalizeUrl = url => url.replace(/\/+$/, '').replace(/#.*$/, '');
                    const itemHref = normalizeUrl(item.href);
                    const currentHref = normalizeUrl(window.location.href);
                    const li = item.closest('li');
                    if (!li) return;

                    widenBorderSpan(li);
                    initBorder(li);

                    const isCurrent = itemHref === currentHref;
                    li.classList.toggle('current-menu-item', isCurrent);

                    if (!isCurrent) {
                        removeBorderColor(li);
                        li._applyBorder = () => setBorderColor(li, highlightColor);
                        li._removeBorder = () => removeBorderColor(li);
                        li.addEventListener('mouseenter', li._applyBorder);
                        li.addEventListener('mouseleave', li._removeBorder);
                        li.addEventListener('focus', li._applyBorder);
                        li.addEventListener('blur', li._removeBorder);
                    } else {
                        setBorderColor(li, highlightColor);
                    }
                });

                navContainers.forEach(item => {
                    if (item.tagName !== 'LI') return;
                    removeBackground(item);
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

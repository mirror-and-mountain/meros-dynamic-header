import { mmHeaderColorParser, parseRgbaValues, interpolateColor } from "./view-helpers.js";

document.addEventListener('DOMContentLoaded', function () {
    const mmHeader = document.querySelector('.wp-block-meros-dynamic-header');
    
    if (!mmHeader) {
        return;
    }

    // Get header settings
    const mmHeaderSettings = {
        isSticky: mmHeader.getAttribute('data-sticky') === 'true',
        bottomOffset: mmHeader.getAttribute('data-bottom-offset') === 'true',
        isOverlay: mmHeader.getAttribute('data-overlay') === 'true',
        overlayStartColor: mmHeader.getAttribute('data-overlay-start'),
        overlayEndColor: mmHeader.getAttribute('data-overlay-end'),
        blockGap: mmHeader.getAttribute('data-block-gap')
    };

    // Make the header sticky
    if (mmHeaderSettings.isSticky) {
        mmHeader.style.position = 'sticky';
        mmHeader.style.top = 0;
        mmHeader.style.zIndex = 50
        mmHeaderSettings.bottomOffset = true;
    } else {
        mmHeaderSettings.isOverlay = false;
    }

    // Offset the blockGap with the bottom margin
    if (mmHeaderSettings.bottomOffset) {
        mmHeader.style.marginBottom = '-' + mmHeaderSettings.blockGap;
    }

    // Make the header an overlay
    if (mmHeaderSettings.isOverlay) {
        let unit = 'rem';
        // The existing bottom margin
        const mmHeaderBottomMargin = mmHeader.style.marginBottom;
        // The height of the header element in px
        let mmHeaderHeight = mmHeader.offsetHeight;

        // Convert the px height to rem if existing bottom margin is in rem
        if (mmHeaderBottomMargin.endsWith(unit)) {
            // Divide header height (px) by the root font size to get rem
            mmHeaderHeight = mmHeaderHeight / parseFloat(getComputedStyle(document.documentElement).fontSize);
        } else {
            unit = 'px';
        }

        // Offset the header's bottom margin.
        mmHeader.style.marginBottom = (mmHeaderBottomMargin.replace(unit, '') - mmHeaderHeight) + unit;

        // Convert start and end colors to usable RGBA
        const startColor = mmHeaderColorParser(mmHeaderSettings.overlayStartColor);
        const endColor   = mmHeaderColorParser(mmHeaderSettings.overlayEndColor);

        const startColorValues = parseRgbaValues(startColor);
        const endColorValues   = parseRgbaValues(endColor);

        // Set initial background color
        mmHeader.style.backgroundColor = startColor;

        // Scroll event to adjust opacity dynamically
        window.addEventListener('scroll', function () {
            const mmHeaderScrollTop = window.scrollY || document.documentElement.scrollTop;
            const mmHeaderMaxScroll = 40;
            const mmHeaderOpacity   = Math.min(mmHeaderScrollTop / mmHeaderMaxScroll, 1);

            mmHeader.style.backgroundColor = interpolateColor(startColorValues, endColorValues, mmHeaderOpacity);
        });
         
    }
});

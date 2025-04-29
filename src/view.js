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
        backgroundStartColor: mmHeader.getAttribute('data-background-start'),
        backgroundEndColor: mmHeader.getAttribute('data-background-end'),
        textStartColor: mmHeader.getAttribute('data-text-start'),
        textEndColor: mmHeader.getAttribute('data-text-end'),
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
        const backgroundStartColor = mmHeaderColorParser(mmHeaderSettings.backgroundStartColor);
        const backgroundEndColor   = mmHeaderColorParser(mmHeaderSettings.backgroundEndColor);

        const backgroundStartColorValues = parseRgbaValues(backgroundStartColor);
        const backgroundEndColorValues   = parseRgbaValues(backgroundEndColor);

        const textStartColor = mmHeaderColorParser(mmHeaderSettings.textStartColor);
        const textEndColor   = mmHeaderColorParser(mmHeaderSettings.textEndColor);

        const textStartColorValues = parseRgbaValues(textStartColor);
        const textEndColorValues   = parseRgbaValues(textEndColor);

        // Set initial background color
        mmHeader.style.backgroundColor = backgroundStartColor;
        mmHeader.style.color = textStartColor;

        // Scroll event to adjust opacity dynamically
        window.addEventListener('scroll', function () {
            const mmHeaderScrollTop = window.scrollY || document.documentElement.scrollTop;
            const mmHeaderMaxScroll = 40;
            const mmHeaderOpacity   = Math.min(mmHeaderScrollTop / mmHeaderMaxScroll, 1);

            mmHeader.style.backgroundColor = interpolateColor(backgroundStartColorValues, backgroundEndColorValues, mmHeaderOpacity);
            mmHeader.style.color = interpolateColor(textStartColorValues, textEndColorValues, mmHeaderOpacity);
        });
         
    }
});

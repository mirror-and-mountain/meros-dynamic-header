import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    const block  = document.querySelector('.wp-block-meros-dynamic-header');
    const header = block.parentElement;

    if (!header || header.tagName !== 'HEADER') return;

    const isSticky     = block.dataset.sticky === 'true';
    const bottomOffset = block.dataset.bottomOffset === 'true';
    const isOverlay    = block.dataset.overlay === 'true';
    const blockGap     = block.dataset.blockGap;

    if (isSticky) {
        header.style.position = 'sticky';
        header.style.top = 0;
        header.style.zIndex = 50
    }

    if (bottomOffset || isSticky) {
        header.style.marginBottom = '-' + blockGap;
    }

    if (isOverlay) {
        let unit = 'rem';
        // The existing bottom margin
        const bottomMargin = header.style.marginBottom;
        // The height of the header element in px
        let height = header.offsetHeight;

        // Convert the px height to rem if existing bottom margin is in rem
        if (bottomMargin.endsWith(unit)) {
            // Divide header height (px) by the root font size to get rem
            height = height / parseFloat(getComputedStyle(document.documentElement).fontSize);
        } else {
            unit = 'px';
        }

        // Offset the header's bottom margin.
        header.style.marginBottom = (bottomMargin.replace(unit, '') - height) + unit;

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



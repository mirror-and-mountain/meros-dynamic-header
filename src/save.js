import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save({attributes}) {

    const { 
        isSticky, 
        bottomOffset, 
        isOverlay, 
        backgroundStartColor, 
        backgroundEndColor,
        textStartColor,
        textEndColor
    } = attributes;

    return (
        <div {...useBlockProps.save()}
            data-sticky={ isSticky }
            data-bottom-offset={ bottomOffset }
            data-overlay={ isOverlay }
            data-background-start={ isOverlay ? backgroundStartColor : '' }
            data-background-end={ isOverlay ? backgroundEndColor : '' }
            data-text-start={ isOverlay ? textStartColor : '' }
            data-text-end={ isOverlay ? textEndColor : '' }
        >
            <InnerBlocks.Content />
        </div>
    );
}

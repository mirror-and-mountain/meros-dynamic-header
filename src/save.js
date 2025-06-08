import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save({attributes}) {

    const {
        tagName,
        isSticky, 
        bottomOffset, 
        isOverlay, 
        backgroundStartColor, 
        backgroundEndColor,
        textStartColor,
        textEndColor
    } = attributes;

    const Tag = tagName || 'header';

    return (
        <Tag {...useBlockProps.save()}
            data-sticky={ isSticky }
            data-bottom-offset={ bottomOffset }
            data-overlay={ isOverlay }
            data-background-start={ isOverlay ? backgroundStartColor : '' }
            data-background-end={ isOverlay ? backgroundEndColor : '' }
            data-text-start={ isOverlay ? textStartColor : '' }
            data-text-end={ isOverlay ? textEndColor : '' }
        >
            <InnerBlocks.Content />
        </Tag>
    );
}

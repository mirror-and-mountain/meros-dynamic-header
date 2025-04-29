/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save({attributes}) {

    const { 
        isSticky, 
        bottomOffset, 
        isOverlay, 
        overlayStartColor, 
        overlayEndColor 
    } = attributes;

    return (
        <header {...useBlockProps.save()}
            data-sticky={ isSticky }
            data-bottom-offset={ bottomOffset }
            data-overlay={ isOverlay }
            data-overlay-start={ isOverlay ? JSON.stringify(overlayStartColor) : '' }
            data-overlay-end={ isOverlay ? JSON.stringify(overlayEndColor) : '' }
        >
            <InnerBlocks.Content />
        </header>
    );
}

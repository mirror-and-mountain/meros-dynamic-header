import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { useEffect } from '@wordpress/element';
import { select, dispatch } from '@wordpress/data';

import { Controls } from './components/controls.js';
import './meros-nav.js';
import './editor.scss';

export default function Edit({ attributes, setAttributes, clientId }) {

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

    useEffect(() => {
        const block = select('core/block-editor').getBlock(clientId);
        if (!block) return;

        block.innerBlocks.forEach((innerBlock) => {
            if (innerBlock.name === 'core/site-logo' && !innerBlock.attributes.width) {
                dispatch('core/block-editor').updateBlockAttributes(innerBlock.clientId, { width: 60 });
            }
        });
    }, [clientId]);

    return (
        <>
            <Controls
                attributes={attributes}
                setAttributes={setAttributes}
            />

            <Tag {...useBlockProps()} 
                data-sticky={ isSticky }
                data-bottom-offset={ bottomOffset }
                data-overlay={ isOverlay }
                data-background-start={ isOverlay ? backgroundStartColor : '' }
                data-background-end={ isOverlay ? backgroundEndColor : '' }
                data-text-start={ isOverlay ? textStartColor : '' }
                data-text-end={ isOverlay ? textEndColor : '' }
            >
                <div>
                    <InnerBlocks 
                        template={[
                            ['core/group', { layout: { type: 'flex', orientation: 'horizontal', justifyContent: 'space-between' } }, [
                                ['core/group', { layout: { type: 'flex', orientation: 'horizontal' } }, [
                                    ['core/site-logo', { width: 60 }],
                                    ['core/site-title', {}]
                                ]],
                                ['core/navigation', {}]
                            ]]
                        ]}
                    />
                </div>
            </Tag>
        </>
    );
}


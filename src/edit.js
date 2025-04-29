import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, ColorPicker } from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { select, dispatch } from '@wordpress/data';

export default function Edit({ attributes, setAttributes, clientId }) {

    const { 
        isSticky, 
        bottomOffset, 
        isOverlay, 
        overlayStartColor, 
        overlayEndColor 
    } = attributes;

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
            <InspectorControls>
                <PanelBody title={__( 'Block Settings', 'mm-components' )} initialOpen={ true }>
                    <ToggleControl
                        label={__( 'Sticky', 'mm-components' )}
                        checked={ isSticky }
                        onChange={ ( value ) => setAttributes( { isSticky: value } ) }
                    />
                    <ToggleControl
                        label={__( 'Bottom Offset', 'mm-components' )}
                        checked={ bottomOffset }
                        onChange={ ( value ) => setAttributes( { bottomOffset: value } ) }
                    />
                </PanelBody>

                { isSticky && (
                    <PanelBody title={__( 'Overlay Settings', 'mm-components' )} initialOpen={ false }>
                        <ToggleControl
                            label={__( 'Enable Overlay', 'mm-components' )}
                            checked={ isOverlay }
                            onChange={ ( value ) => setAttributes( { isOverlay: value } ) }
                        />
                        { isOverlay && (
                            <>
                                <div style={ { marginBottom: '15px' } }>
                                    <p>{__( 'Overlay Start Color', 'mm-components' )}</p>
                                    <ColorPicker
                                        color={ overlayStartColor }
                                        onChangeComplete={ ( color ) => setAttributes( { overlayStartColor: color.rgb } ) }
                                    />
                                </div>
                                <div>
                                    <p>{__( 'Overlay End Color', 'mm-components' )}</p>
                                    <ColorPicker
                                        color={ overlayEndColor }
                                        onChangeComplete={ ( color ) => setAttributes( { overlayEndColor: color.rgb } ) }
                                    />
                                </div>
                            </>
                        )}
                    </PanelBody>
                )}
            </InspectorControls>

            <header {...useBlockProps()} 
                data-sticky={ isSticky }
                data-bottom-offset={ bottomOffset }
                data-overlay={ isOverlay }
                data-overlay-start={ isOverlay ? JSON.stringify(overlayStartColor) : '' }
                data-overlay-end={ isOverlay ? JSON.stringify(overlayEndColor) : '' }
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
            </header>
        </>
    );
}


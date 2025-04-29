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
        backgroundStartColor, 
        backgroundEndColor,
        textStartColor,
        textEndColor 
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
                                    <p>{__( 'Background Start Color', 'mm-components' )}</p>
                                    <ColorPicker
                                        color={ backgroundStartColor }
                                        onChangeComplete={ ( color ) => setAttributes( { backgroundStartColor: color.rgb } ) }
                                    />
                                </div>
                                <div>
                                    <p>{__( 'Background End Color', 'mm-components' )}</p>
                                    <ColorPicker
                                        color={ backgroundEndColor }
                                        onChangeComplete={ ( color ) => setAttributes( { backgroundEndColor: color.rgb } ) }
                                    />
                                </div>
                                <div>
                                    <p>{__( 'Text Start Color', 'mm-components' )}</p>
                                    <ColorPicker
                                        color={ textStartColor }
                                        onChangeComplete={ ( color ) => setAttributes( { textStartColor: color.rgb } ) }
                                    />
                                </div>
                                <div>
                                    <p>{__( 'Text End Color', 'mm-components' )}</p>
                                    <ColorPicker
                                        color={ textEndColor }
                                        onChangeComplete={ ( color ) => setAttributes( { textEndColor: color.rgb } ) }
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
                data-background-start={ isOverlay ? JSON.stringify(backgroundStartColor) : '' }
                data-background-end={ isOverlay ? JSON.stringify(backgroundEndColor) : '' }
                data-text-start={ isOverlay ? JSON.stringify(textStartColor) : '' }
                data-text-end={ isOverlay ? JSON.stringify(textEndColor) : '' }
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


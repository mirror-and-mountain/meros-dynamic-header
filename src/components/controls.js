import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
    __experimentalToolsPanel as ToolsPanel,
    __experimentalToolsPanelItem as ToolsPanelItem,
    ToggleControl
} from '@wordpress/components';

import { OverlayColorPicker } from './color-picker.js';

export function Controls ({ attributes, setAttributes }) {

    const { 
        isSticky, 
        bottomOffset, 
        isOverlay, 
        backgroundStartColor, 
        backgroundEndColor,
        textStartColor,
        textEndColor 
    } = attributes;

    const handlePositionReset = () => {
        setAttributes({
            isSticky: true,
            bottomOffset: true
        });
    };

    const handleOverlayReset = () => {
        setAttributes({
            isOverlay: true,
            backgroundStartColor: '#FFFFFF00',
            backgroundEndColor: '#FFFFFF',
            textStartColor: '#000000',
            textEndColor: '#000000'
        });
    };

    return (
        <InspectorControls>
            <ToolsPanel label={__( 'Positioning', 'meros-dynamic-header' )} resetAll={ handlePositionReset }>
                <ToolsPanelItem
                    label={__('Sticky', 'meros-dynamic-header' )}
                    hasValue={() => 
                        isSticky ? false : true
                    }
                    isShownByDefault={true}
                    onDeselect={() => {
                        setAttributes({
                            isSticky: true
                        });
                    }}
                >
                    <ToggleControl
                        label={__( 'Sticky', 'meros-dynamic-header' )}
                        checked={ isSticky }
                        onChange={ ( value ) => {
                            setAttributes( { isSticky: value } );
                            if ( value === false ) {
                                setAttributes({
                                    isOverlay: false
                                });
                            } 
                        }}
                    />
                </ToolsPanelItem>

                <ToolsPanelItem
                    label={__('Bottom Offset', 'meros-dynamic-header')}
                    hasValue={() => 
                        bottomOffset ? false : true
                    }
                    isShownByDefault={true}
                    onDeselect={() => {
                        setAttributes({
                            bottomOffset: true
                        });
                    }}
                >
                    <ToggleControl
                        label={__( 'Bottom Offset', 'meros-dynamic-header' )}
                        checked={ bottomOffset }
                        onChange={ ( value ) => setAttributes( { bottomOffset: value } ) }
                    />
                </ToolsPanelItem>
            </ToolsPanel>

            <ToolsPanel label={__('Overlay', 'meros-dynamic-header')} resetAll={handleOverlayReset}>
                <ToolsPanelItem
                    label={__( 'Is Overlay', 'meros-dynamic-header' )}
                    hasValue={() => 
                        isOverlay ? false : true
                    }
                    isShownByDefault={true}
                    onDeselect={() => {
                        setAttributes({
                            isOverlay: true
                        });
                    }}
                >
                    <ToggleControl
                        label={__( 'Enable Overlay', 'meros-dynamic-header' )}
                        checked={ isOverlay }
                        onChange={ ( value ) => setAttributes( { isOverlay: value } ) }
                        disabled={ !isSticky }
                    />
                </ToolsPanelItem>
                { isOverlay  &&(
                    <>
                        <ToolsPanelItem
                            label={__('Background Start Colour', 'meros-dynamic-header')}
                            hasValue={() => 
                                backgroundStartColor !== '#FFFFFF00' ? true : false
                            }
                            isShownByDefault={true}
                            onDeselect={() => {
                                setAttributes({
                                    backgroundStartColor: '#FFFFFF00'
                                });
                            }}
                        >
                            <OverlayColorPicker
                                attribute="backgroundStartColor"
                                label={__('Background Start Colour', 'meros-dynamic-header')}
                                currentColor={backgroundStartColor || '#FFFFFF00'}
                                setAttributes={setAttributes}
                            />
                        </ToolsPanelItem>

                        <ToolsPanelItem
                            label={__('Background End Colour', 'meros-dynamic-header')}
                            hasValue={() => 
                                backgroundEndColor !== '#FFFFFF' ? true : false
                            }
                            isShownByDefault={true}
                            onDeselect={() => {
                                setAttributes({
                                    backgroundEndColor: '#FFFFFF'
                                });
                            }}
                        >
                            <OverlayColorPicker
                                attribute="backgroundEndColor"
                                label={__('Background End Colour', 'meros-dynamic-header')}
                                currentColor={backgroundEndColor || '#FFFFFF00'}
                                setAttributes={setAttributes}
                            />
                        </ToolsPanelItem>

                        <ToolsPanelItem
                            label={__('Text Start Colour', 'meros-dynamic-header')}
                            hasValue={() => 
                                textStartColor !== '#000000' ? true : false
                            }
                            isShownByDefault={true}
                            onDeselect={() => {
                                setAttributes({
                                    textStartColor: '#000000'
                                });
                            }}
                        >
                            <OverlayColorPicker
                                attribute="textStartColor"
                                label={__('Text Start Colour', 'meros-dynamic-header')}
                                currentColor={textStartColor || '#000000'}
                                setAttributes={setAttributes}
                            />
                        </ToolsPanelItem>

                        <ToolsPanelItem
                            label={__('Text End Colour', 'meros-dynamic-header')}
                            hasValue={() => 
                                textEndColor !== '#000000' ? true : false
                            }
                            isShownByDefault={true}
                            onDeselect={() => {
                                setAttributes({
                                    textEndColor: '#000000'
                                });
                            }}
                        >
                            <OverlayColorPicker
                                attribute="textEndColor"
                                label={__('Text End Colour', 'meros-dynamic-header')}
                                currentColor={textEndColor || '#000000'}
                                setAttributes={setAttributes}
                            />
                        </ToolsPanelItem>
                    </>
                )}
            </ToolsPanel>
        </InspectorControls>
    );
}
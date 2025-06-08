import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, SelectControl, RangeControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';

import { OverlayColorPicker } from './components/color-picker';

wp.domReady(() => {
    // Add sliding menu attributes to the navigation block
    const addNavigationAttributes = (settings, name) => {
        if (name !== 'core/navigation') return settings;
        return {
            ...settings,
            attributes: {
                ...settings.attributes,
                enableMerosNav: { type: 'boolean', default: false },
                merosNavDirection: { type: 'string', default: 'left' },
                merosNavStyle: { type: 'string', default: 'minimal' },
                merosNavBgColor: { type: 'string', default: '#FFFFFF' },
                merosNavTextColor: { type: 'string', default: '#000000' },
                merosNavShowLogo: { type: 'boolean', default: true }
            }
        };
    };
    addFilter('blocks.registerBlockType', 'meros/navigation-attributes', addNavigationAttributes);

    // Add controls to the inspector for the navigation block
    const addNavigationControls = createHigherOrderComponent((BlockEdit) => {
        return (props) => {
            const { name, attributes, setAttributes } = props;

            if (name !== 'core/navigation') {
                return <BlockEdit {...props} />;
            }

            return (
                <Fragment>
                    <BlockEdit {...props} />
                    <InspectorControls>
                        <PanelBody title={__('Meros Navigation Settings', 'meros-dynamic-header')} initialOpen={true}>
                            <ToggleControl
                                label={__('Enable Meros Navigation', 'meros-dynamic-header')}
                                checked={attributes.enableMerosNav}
                                onChange={(value) => setAttributes({ enableMerosNav: value })}
                            />
                            {attributes.enableMerosNav && (
                                <>
                                    <SelectControl
                                        label={__('Direction', 'meros-dynamic-header')}
                                        value={attributes.merosNavDirection}
                                        options={[
                                            { label: __('Slide Left', 'meros-dynamic-header'), value: 'left' },
                                            { label: __('Slide Right', 'meros-dynamic-header'), value: 'right' }
                                        ]}
                                        onChange={(value) => setAttributes({ merosNavDirection: value })}
                                    />
                                    <SelectControl
                                        label={__('Style', 'meros-dynamic-header')}
                                        value={attributes.merosNavStyle}
                                        options={[
                                            { label: __('Minimal', 'meros-dynamic-header'), value: 'minimal' }
                                        ]}
                                        onChange={(value) => setAttributes({ merosNavStyle: value })}
                                    />
                                    <ToggleControl
                                        label={__('Show Site Logo', 'meros-dynamic-header')}
                                        checked={attributes.merosNavShowLogo}
                                        onChange={(value) => setAttributes({ merosNavShowLogo: value })}
                                    />
                                    <OverlayColorPicker
                                        attribute="merosNavBgColor"
                                        label={__('Background Color', 'meros-dynamic-header')}
                                        currentColor={attributes.merosNavBgColor}
                                        setAttributes={setAttributes}
                                    />
                                    <OverlayColorPicker
                                        attribute="merosNavTextColor"
                                        label={__('Text Color', 'meros-dynamic-header')}
                                        currentColor={attributes.merosNavTextColor}
                                        setAttributes={setAttributes}
                                    />
                                </>
                            )}
                        </PanelBody>
                    </InspectorControls>
                </Fragment>
            );
        };
    }, 'addNavigationControls');
    addFilter('editor.BlockEdit', 'meros/navigation-controls', addNavigationControls);
});

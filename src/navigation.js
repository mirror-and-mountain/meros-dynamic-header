import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, SelectControl } from '@wordpress/components';
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
                enableSlidingMenu: { type: 'boolean', default: false },
                slidingMenuType: { type: 'string', default: 'slide-left' },
                slidingMenuBackgroundColor: { type: 'string', default: '#FFFFFF' },
                slidingMenuTextColor: { type: 'string', default: '#000000' }
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
                        <PanelBody title={__('Sliding Menu Settings', 'meros-dynamic-header')} initialOpen={false}>
                            <ToggleControl
                                label={__('Enable Sliding Menu', 'meros-dynamic-header')}
                                checked={attributes.enableSlidingMenu}
                                onChange={(value) => setAttributes({ enableSlidingMenu: value })}
                            />
                            {attributes.enableSlidingMenu && (
                                <>
                                    <SelectControl
                                        label={__('Sliding Menu Type', 'meros-dynamic-header')}
                                        value={attributes.slidingMenuType}
                                        options={[
                                            // { label: __('Slide Right', 'meros-dynamic-header'), value: 'slide-right' },
                                            { label: __('Slide Left', 'meros-dynamic-header'), value: 'slide-left' },
                                            // { label: __('Slide Up', 'meros-dynamic-header'), value: 'slide-up' },
                                            // { label: __('Slide Down', 'meros-dynamic-header'), value: 'slide-down' }
                                        ]}
                                        onChange={(value) => setAttributes({ slidingMenuType: value })}
                                    />
                                    <OverlayColorPicker
                                        attribute="slidingMenuBackgroundColor"
                                        label={__('Sliding Menu Background Color', 'meros-dynamic-header')}
                                        currentColor={attributes.slidingMenuBackgroundColor}
                                        setAttributes={setAttributes}
                                    />
                                    <OverlayColorPicker
                                        attribute="slidingMenuTextColor"
                                        label={__('Sliding Menu Text Color', 'meros-dynamic-header')}
                                        currentColor={attributes.slidingMenuTextColor}
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

    // Apply sliding menu attributes to the save content
    const applySlidingMenuAttributes = (extraProps, blockType, attributes) => {
        if (blockType.name !== 'core/navigation' || !attributes.enableSlidingMenu) {
            return extraProps;
        }
        extraProps.className = `${extraProps.className || ''} has-sliding-menu`;
        extraProps['data-sliding-menu'] = true;
        extraProps['data-sliding-menu-type'] = attributes.slidingMenuType;
        extraProps['data-sliding-menu-background-color'] = attributes.slidingMenuBackgroundColor;
        extraProps['data-sliding-menu-text-color'] = attributes.slidingMenuTextColor;

        return extraProps;
    }
    addFilter('blocks.getSaveContent.extraProps', 'meros/navigation-sliding-menu-attributes', applySlidingMenuAttributes);
});

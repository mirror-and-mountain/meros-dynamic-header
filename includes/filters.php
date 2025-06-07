<?php 

/**
 * Gets the theme's 'blockGap' property and adds it as an HTML attribute
 * to the dynamic header block. Used to calculate header spacing.
 */
add_filter('render_block_meros/dynamic-header', function ( $block_content, $block ) {

    if ( empty( $block_content ) ) {
        return $block_content;
    }

    $processor = new \WP_HTML_Tag_Processor( $block_content );

    if ( $processor->next_tag( 'div' ) ) {
        $block_spacing = wp_get_global_styles( ['styles'] )['spacing']['blockGap'];

        // Update the style attribute
        $processor->set_attribute( 'data-block-gap', $block_spacing );
    }

    return $processor->get_updated_html();
    
}, 10, 2 ); 

/**
 * Adds a class and data attributes to the navigation block
 * when the sliding menu is enabled.
 */
add_filter('render_block_core/navigation', function ($block_content, $block) {
    if (empty($block['attrs']['enableSlidingMenu'])) {
        return $block_content;
    }

    // Use WP_HTML_Tag_Processor to find and modify the <nav> element
    $processor = new WP_HTML_Tag_Processor($block_content);

    if ($processor->next_tag('nav')) {
        // Add the class
        $existing_class = $processor->get_attribute('class') ?: '';
        $processor->set_attribute('class', trim("$existing_class has-sliding-menu"));

        // Add data attributes
        $attrs = $block['attrs'];
        $processor->set_attribute('data-sliding-menu', 'true');
        $processor->set_attribute('data-sliding-menu-type', $attrs['slidingMenuType'] ?? 'slide-left');
        $processor->set_attribute('data-sliding-menu-background-color', $attrs['slidingMenuBackgroundColor'] ?? '#FFFFFF');
        $processor->set_attribute('data-sliding-menu-text-color', $attrs['slidingMenuTextColor'] ?? '#000000');
    }

    return $processor->get_updated_html();
}, 10, 2);

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
 * Adds classes and data attributes to the navigation block
 * when meros nav is enabled.
 */
add_filter('render_block_core/navigation', function ($block_content, $block) {
    if (empty($block['attrs']['enableMerosNav'])) {
        return $block_content;
    }

    $processor = new WP_HTML_Tag_Processor($block_content);

    if ($processor->next_tag('nav')) {
        $existing_class      = $processor->get_attribute('class') ?: '';
        $overlay_menu        = $block['attrs']['overlayMenu'] ?? 'mobile';
        $meros_nav_style     = $block['attrs']['merosNavStyle'] ?? 'minimal';
        $processor->set_attribute('class', trim("$existing_class has-meros-nav-$overlay_menu meros-nav-style-$meros_nav_style"));

        $attrs = $block['attrs'];
        $processor->set_attribute('data-meros-nav-direction', $attrs['merosNavDirection'] ?? 'left');
        $processor->set_attribute('data-meros-nav-background-color', $attrs['merosNavBgColor'] ?? '#FFFFFF');
        $processor->set_attribute('data-meros-nav-highlight-color', $attrs['merosNavHighlightColor'] ?? '#F0F0F0');
        $processor->set_attribute('data-meros-nav-text-color', $attrs['merosNavTextColor'] ?? '#000000');

        if ($attrs['merosNavShowLogo'] ?? true) {
            $custom_logo_id = get_theme_mod('custom_logo');
            if ($custom_logo_id) {
                $logo_image = wp_get_attachment_image_src($custom_logo_id, 'full'); // size can be 'full', 'thumbnail', etc.
                $logo_url = $logo_image[0] ?? false; // URL is first element
                if ($logo_url) {
                    $processor->set_attribute('data-meros-nav-logo', esc_url($logo_url));
                    $processor->set_attribute('data-meros-nav-logo-link', esc_url(site_url()));
                }
            }
        }
    }

    while ($processor->next_tag()) {
        $class = $processor->get_attribute('class') ?: '';
        $classList = explode(' ', $class);
        foreach ($classList as $c) {
            if ($c === 'wp-block-navigation__responsive-container') {
                $existing_class      = $class;
                $meros_nav_direction = $block['attrs']['merosNavDirection'] ?? 'left';
                $processor->set_attribute('class', trim("$existing_class meros-nav-direction-$meros_nav_direction"));
                break 2;
            }
        }
    }

    return $processor->get_updated_html();
}, 10, 2);


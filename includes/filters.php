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
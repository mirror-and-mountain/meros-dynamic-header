<?php
/**
 * Provides a modified URI if the plugin is installed in a Meros powered theme.
 * This is required for properly enqueuing assets.
 *
 * @return string
 */
function get_meros_dyanamic_header_uri(): string {
    if ( dirname(__DIR__, 4) === WP_CONTENT_DIR . '/themes' ) {
        return get_theme_file_uri( '/plugins/' . basename(dirname(__DIR__)) );
    }
    else {
        return plugin_dir_url(dirname(__DIR__));
    }
}

// Register the block.
add_action('init', function () {
    $blocks_path = wp_normalize_path(dirname(__DIR__) . '/build');
    register_block_type( $blocks_path );
});

// Enqueue navigation-block stylesheet.
add_action('wp_enqueue_scripts', function() {
    $src = trailingslashit(get_meros_dyanamic_header_uri()) . 'build/view.css';
    wp_enqueue_style(
        'meros-dynamic-header-styles',
        $src,
        [],
        filemtime(wp_normalize_path(dirname(__DIR__) . '/build/view.css'))
    );
});
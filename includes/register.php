<?php
// Register the block.
add_action('init', function () {
    $blocks_path = wp_normalize_path(dirname(__DIR__) . '/build');
    register_block_type( $blocks_path );
});
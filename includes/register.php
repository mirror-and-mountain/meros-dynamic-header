<?php

function meros_dh_define_constants(): void {
    defined('MEROS_DH_PATH') || define('MEROS_DH_PATH', dirname(__DIR__));
}

function meros_dh_register_blocks() {

    $blocks_path = wp_normalize_path(MEROS_DH_PATH . '/build');

    register_block_type( $blocks_path );
}

meros_dh_define_constants();
add_action('init', 'meros_dh_register_blocks');
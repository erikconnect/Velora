<?php
/**
 * Velora motion-core enqueue — drop into your theme functions.php or a small plugin.
 *
 * Copy packages/css/dist/motion-core.css → assets/css/velora-motion-core.css
 */

declare(strict_types=1);

function velora_enqueue_motion_core(): void {
    $theme_dir = get_stylesheet_directory();
    $theme_uri = get_stylesheet_directory_uri();
    $relative  = '/assets/css/velora-motion-core.css';
    $path      = $theme_dir . $relative;

    if (!is_readable($path)) {
        return;
    }

    wp_enqueue_style(
        'velora-motion-core',
        $theme_uri . $relative,
        [],
        (string) filemtime($path)
    );
}
add_action('wp_enqueue_scripts', 'velora_enqueue_motion_core');

/**
 * Example block markup in a template part (front-page.php, etc.):
 *
 * <section vl-in-view>
 *   <h2 vl-enter="fade-up">Headline</h2>
 *   <p vl-enter="fade-up" vl-delay="120ms">Supporting copy.</p>
 * </section>
 */

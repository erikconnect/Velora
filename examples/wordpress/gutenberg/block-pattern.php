<?php
/**
 * Block pattern registration — add to theme functions.php (block theme).
 */

declare(strict_types=1);

function velora_register_enter_block_pattern(): void {
    register_block_pattern(
        'velora/enter-fade-up',
        [
            'title'       => __('Velora enter fade-up', 'velora'),
            'description' => _x('Declarative enter motion via vl-enter.', 'Block pattern', 'velora'),
            'categories'  => ['text'],
            'content'     => '<!-- wp:group {"className":"velora-enter-group"} -->
<div class="wp-block-group velora-enter-group" vl-in-view><!-- wp:heading {"level":2} -->
<h2 vl-enter="fade-up">Section title</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p vl-enter="fade-up" vl-delay="120ms">Body copy with staggered enter.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->',
        ]
    );
}
add_action('init', 'velora_register_enter_block_pattern');

<?php
/**
 * FC Book functions and definitions
 *
 * @package fc-book
 */

if ( ! function_exists( 'fc_book_setup' ) ) :
	function fc_book_setup() {
		// Add default posts and comments RSS feed links to head.
		add_theme_support( 'automatic-feed-links' );

		// Let WordPress manage the document title.
		add_theme_support( 'title-tag' );

		// Enable support for Post Thumbnails on posts and pages.
		add_theme_support( 'post-thumbnails' );

		// Register Navigation Menus
		register_nav_menus( array(
			'menu-1' => esc_html__( 'Primary Sidebar Menu', 'fc-book' ),
		) );

		// Add support for core custom logo.
		add_theme_support( 'custom-logo', array(
			'height'      => 250,
			'width'       => 250,
			'flex-width'  => true,
			'flex-height' => true,
		) );
	}
endif;
add_action( 'after_setup_theme', 'fc_book_setup' );

/**
 * Enqueue scripts and styles.
 */
function fc_book_scripts() {
	// Main Theme Style
	wp_enqueue_style( 'fc-book-style', get_stylesheet_uri(), array(), '1.0.0' );

	// Tailwind CSS via CDN (Recommended for this conversion to maintain styles)
	wp_enqueue_script( 'tailwind-cdn', 'https://cdn.tailwindcss.com', array(), null, false );

    // Lucide Icons (to match the Lucide icons used in React)
    wp_enqueue_script( 'lucide-icons', 'https://unpkg.com/lucide@latest', array(), null, true );
}
add_action( 'wp_enqueue_scripts', 'fc_book_scripts' );

/**
 * Custom Login Styles (Optional - for a full SaaS feel)
 */
function fc_book_login_stylesheet() {
    wp_enqueue_style( 'custom-login', get_stylesheet_directory_uri() . '/style.css' );
}
add_action( 'login_enqueue_scripts', 'fc_book_login_stylesheet' );

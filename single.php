<?php
/**
 * The template for displaying all pages
 *
 * @package fc-book
 */

get_header();
?>

<div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
    <div class="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
        <h1 class="font-bold text-slate-900 text-2xl">
            <?php the_title(); ?>
        </h1>
    </div>

    <div class="p-8">
        <?php
        while ( have_posts() ) :
            the_post();
            ?>
            <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
                <?php if ( has_post_thumbnail() ) : ?>
                    <div class="mb-8 rounded-2xl overflow-hidden aspect-video relative max-h-[400px]">
                        <?php the_post_thumbnail( 'large', array( 'class' => 'w-full h-full object-cover' ) ); ?>
                    </div>
                <?php endif; ?>

                <div class="text-slate-600 leading-relaxed prose max-w-none">
                    <?php the_content(); ?>
                </div>

                <?php
                wp_link_pages( array(
                    'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'fc-book' ),
                    'after'  => '</div>',
                ) );
                ?>
            </article>

            <?php
            // If comments are open or we have at least one comment, load up the comment template.
            if ( comments_open() || get_comments_number() ) :
                comments_template();
            endif;

        endwhile;
        ?>
    </div>
</div>

<?php
get_footer();

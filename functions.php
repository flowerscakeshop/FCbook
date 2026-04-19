<?php
/**
 * The template for displaying all single posts
 *
 * @package fc-book
 */

get_header();
?>

<div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
    <div class="p-8 pb-4">
        <a href="<?php echo home_url(); ?>" class="inline-flex items-center text-sm text-blue-600 font-medium mb-6 hover:underline">
            <i data-lucide="arrow-left" size="14" class="mr-1"></i> Back to Feed
        </a>
        
        <?php
        while ( have_posts() ) :
            the_post();
            ?>
            <header class="mb-8">
                <h1 class="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                    <?php the_title(); ?>
                </h1>
                
                <div class="flex flex-wrap items-center gap-6 text-sm text-slate-400 border-y border-slate-50 py-4">
                    <span class="flex items-center gap-2">
                        <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                            <i data-lucide="user" size="14" class="text-slate-500"></i>
                        </div>
                        <span class="font-medium text-slate-600"><?php the_author(); ?></span>
                    </span>
                    <span class="flex items-center gap-2">
                        <i data-lucide="calendar" size="16"></i>
                        <?php echo get_the_date(); ?>
                    </span>
                    <span class="flex items-center gap-2">
                        <i data-lucide="tag" size="16"></i>
                        <?php the_category(', '); ?>
                    </span>
                </div>
            </header>

            <?php if ( has_post_thumbnail() ) : ?>
                <div class="mb-8 rounded-2xl overflow-hidden aspect-video relative shadow-lg">
                    <?php the_post_thumbnail( 'large', array( 'class' => 'w-full h-full object-cover' ) ); ?>
                </div>
            <?php endif; ?>

            <div class="text-slate-600 leading-relaxed prose prose-lg prose-slate max-w-none">
                <?php the_content(); ?>
            </div>

            <footer class="mt-12 pt-8 border-t border-slate-100">
                <div class="flex flex-wrap gap-2">
                    <?php the_tags('<span class="text-slate-400 mr-2 font-medium">Tagged in:</span> <span class="bg-slate-50 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold">', '</span><span class="bg-slate-50 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold">', '</span>'); ?>
                </div>
            </footer>

            <?php
            // Post Navigation
            the_post_navigation( array(
                'prev_text' => '<span class="text-slate-400 block mb-1">Previous</span> <span class="font-bold text-slate-900">%title</span>',
                'next_text' => '<span class="text-slate-400 block mb-1">Next</span> <span class="font-bold text-slate-900">%title</span>',
            ) );

            // Comments
            if ( comments_open() || get_comments_number() ) :
                echo '<div class="mt-12 p-8 bg-slate-50 rounded-2xl">';
                comments_template();
                echo '</div>';
            endif;

        endwhile;
        ?>
    </div>
</div>

<?php
get_footer();

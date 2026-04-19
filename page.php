<?php
/**
 * The main template file
 *
 * @package fc-book
 */

get_header();
?>

<?php if ( is_home() && ! is_paged() ) : ?>
    <!-- Dashboard Stats Grid (Dynamic look and feel) -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
            <div class="flex justify-between items-start mb-4">
                <div class="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <i data-lucide="calculator" size="24"></i>
                </div>
                <span class="flex items-center text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full">
                    <i data-lucide="trending-up" size="12" class="mr-1"></i> +12.5%
                </span>
            </div>
            <p class="text-sm font-medium text-slate-500 mb-1">Total Posts</p>
            <h3 class="text-2xl font-bold text-slate-900"><?php echo wp_count_posts()->publish; ?></h3>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
            <div class="flex justify-between items-start mb-4">
                <div class="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <i data-lucide="users" size="24"></i>
                </div>
                <span class="flex items-center text-slate-400 text-xs font-bold bg-slate-50 px-2 py-1 rounded-full">
                    Active
                </span>
            </div>
            <p class="text-sm font-medium text-slate-500 mb-1">Total Users</p>
            <h3 class="text-2xl font-bold text-slate-900"><?php echo count_users()['total_users']; ?></h3>
        </div>
        
        <!-- Placeholder Stats -->
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 opacity-60">
            <div class="p-3 w-fit bg-emerald-50 text-emerald-600 rounded-xl mb-4">
                <i data-lucide="banknote" size="24"></i>
            </div>
            <p class="text-sm font-medium text-slate-500 mb-1">Revenue (Demo)</p>
            <h3 class="text-2xl font-bold text-slate-900">₹0.00</h3>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 opacity-60">
            <div class="p-3 w-fit bg-orange-50 text-orange-600 rounded-xl mb-4">
                <i data-lucide="clock" size="24"></i>
            </div>
            <p class="text-sm font-medium text-slate-500 mb-1">Pending Invoices</p>
            <h3 class="text-2xl font-bold text-slate-900">0</h3>
        </div>
    </div>
<?php endif; ?>

<div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
    <div class="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
        <h3 class="font-bold text-slate-900 text-lg">
            <?php echo is_single() ? 'Viewing Content' : 'Recent Entries'; ?>
        </h3>
        <div class="flex gap-2">
            <input type="text" placeholder="Search..." class="bg-slate-50 border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 w-48 md:w-64">
            <button class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                Add New
            </button>
        </div>
    </div>

    <div class="p-8">
        <?php
        if ( have_posts() ) :
            while ( have_posts() ) :
                the_post();
                ?>
                <article id="post-<?php the_ID(); ?>" <?php post_class( 'mb-8 last:mb-0 pb-8 last:pb-0 border-b last:border-0 border-slate-100' ); ?>>
                    <header class="mb-4">
                        <?php if ( has_post_thumbnail() ) : ?>
                            <div class="mb-4 rounded-xl overflow-hidden aspect-video relative">
                                <?php the_post_thumbnail( 'large', array( 'class' => 'w-full h-full object-cover' ) ); ?>
                            </div>
                        <?php endif; ?>
                        
                        <h2 class="text-2xl font-bold text-slate-900 hover:text-blue-600 transition-colors">
                            <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                        </h2>
                        
                        <div class="flex items-center gap-4 mt-2 text-sm text-slate-400">
                            <span class="flex items-center gap-1">
                                <i data-lucide="calendar" size="14"></i> <?php the_date(); ?>
                            </span>
                            <span class="flex items-center gap-1">
                                <i data-lucide="user" size="14"></i> <?php the_author(); ?>
                            </span>
                        </div>
                    </header>

                    <div class="text-slate-600 leading-relaxed prose max-w-none">
                        <?php
                        if ( is_single() ) {
                            the_content();
                        } else {
                            the_excerpt();
                            ?>
                            <a href="<?php the_permalink(); ?>" class="inline-flex items-center mt-4 text-blue-600 font-semibold hover:underline">
                                Read More <i data-lucide="arrow-right" size="16" class="ml-1"></i>
                            </a>
                        <?php } ?>
                    </div>
                </article>
                <?php
            endwhile;

            the_posts_navigation( array(
                'prev_text' => __( 'Older Entries', 'fc-book' ),
                'next_text' => __( 'Newer Entries', 'fc-book' ),
            ) );

        else :
            ?>
            <div class="py-12 text-center">
                <div class="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i data-lucide="file-x-2" size="32"></i>
                </div>
                <h3 class="text-xl font-bold text-slate-900 mb-2">No Content Found</h3>
                <p class="text-slate-500">It looks like nothing was found at this location. Try a search or return home.</p>
            </div>
            <?php
        endif;
        ?>
    </div>
</div>

<?php
get_footer();

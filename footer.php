<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="https://gmpg.org/xfn/11">
	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<div id="page" class="flex min-h-screen bg-slate-50">
    <!-- Sidebar Navigation -->
    <aside class="hidden md:flex flex-col w-64 bg-slate-900 text-white border-r border-slate-800">
        <div class="p-6 border-b border-slate-800 flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <i data-lucide="shield-check" class="text-white"></i>
            </div>
            <div>
                <h1 class="font-bold text-lg leading-tight"><?php bloginfo( 'name' ); ?></h1>
                <p class="text-xs text-slate-400">Accounting Portal</p>
            </div>
        </div>

        <nav class="flex-1 p-4 space-y-1">
            <?php
            wp_nav_menu( array(
                'theme_location' => 'menu-1',
                'container'      => false,
                'menu_class'     => 'sidebar-nav',
                'fallback_cb'    => '__return_false',
                'items_wrap'     => '<ul id="%1$s" class="%2$s">%3$s</ul>',
            ) );
            ?>
            
            <!-- Fallback if menu is not set -->
            <?php if ( ! has_nav_menu( 'menu-1' ) ) : ?>
                <a href="<?php echo home_url(); ?>" class="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-600 text-white font-medium">
                    <i data-lucide="layout-dashboard" size="20"></i> Dashboard
                </a>
                <a href="#" class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
                    <i data-lucide="users" size="20"></i> Customers
                </a>
                <a href="#" class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
                    <i data-lucide="file-text" size="20"></i> Invoices
                </a>
            <?php endif; ?>
        </nav>

        <div class="p-4 border-t border-slate-800">
            <div class="bg-slate-800/50 rounded-xl p-4">
                <div class="flex items-center gap-3 mb-3">
                    <div class="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/30">
                        <i data-lucide="user" size="16"></i>
                    </div>
                    <div class="overflow-hidden">
                        <p class="text-sm font-medium truncate"><?php echo wp_get_current_user()->display_name; ?></p>
                        <p class="text-xs text-slate-500 truncate capitalize"><?php echo ( current_user_can('administrator') ) ? 'Admin' : 'Subscriber'; ?></p>
                    </div>
                </div>
                <a href="<?php echo wp_logout_url(); ?>" class="flex items-center gap-2 text-xs text-slate-400 hover:text-red-400 transition-colors">
                    <i data-lucide="log-out" size="14"></i> Sign Out
                </a>
            </div>
        </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <!-- Top Header -->
        <header class="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
            <div class="flex items-center gap-4">
                <button class="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                    <i data-lucide="menu"></i>
                </button>
                <h2 class="text-xl font-bold text-slate-900"><?php the_title(); ?></h2>
            </div>
            
            <div class="flex items-center gap-4">
                <button class="p-2 text-slate-400 hover:text-slate-600 relative">
                    <i data-lucide="bell" size="22"></i>
                    <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <div class="h-8 w-[1px] bg-slate-200 mx-2"></div>
                <div class="flex items-center gap-3">
                    <div class="text-right hidden sm:block">
                        <p class="text-xs font-semibold text-slate-900"><?php bloginfo( 'name' ); ?></p>
                        <p class="text-[10px] text-slate-500">ID: FC-<?php echo get_current_user_id(); ?></p>
                    </div>
                </div>
            </div>
        </header>

        <!-- Main Viewport -->
        <div class="flex-1 overflow-y-auto p-4 md:p-8">

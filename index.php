        </div> <!-- End of overflow-y-auto content area -->
    </main>
</div><!-- #page -->

<footer class="bg-white border-t border-slate-200 py-6 px-8 text-center md:flex md:justify-between md:items-center">
    <p class="text-sm text-slate-500">
        &copy; <?php echo date('Y'); ?> <?php bloginfo( 'name' ); ?>. All rights reserved.
    </p>
    <div class="flex gap-6 justify-center mt-4 md:mt-0">
        <a href="#" class="text-sm text-slate-400 hover:text-slate-600">Privacy Policy</a>
        <a href="#" class="text-sm text-slate-400 hover:text-slate-600">Terms of Service</a>
        <a href="#" class="text-sm text-slate-400 hover:text-slate-600">Support</a>
    </div>
</footer>

<script>
    // Initialize Lucide icons after theme scripts load
    document.addEventListener('DOMContentLoaded', function() {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    });
</script>

<?php wp_footer(); ?>

</body>
</html>

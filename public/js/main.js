// Main JavaScript file for client-side functionality

// Wait for both the document to be ready and all scripts to be loaded
function initializeComponents() {
    // Auto-hide alerts after 5 seconds
    if (typeof $ !== 'undefined') {
        setTimeout(function() {
            $('.alert').fadeOut('slow');
        }, 5000);
    }
    
    // Initialize delete confirmation
    if (typeof $ !== 'undefined') {
        $(document).on('submit', '.delete-form', function(e) {
            if (!confirm('Are you sure you want to delete this item?')) {
                e.preventDefault();
            }
        });
    }
}

// Run initialization when document is ready
if (typeof $ !== 'undefined') {
    $(document).ready(initializeComponents);
} else {
    // If jQuery isn't loaded yet, wait for it
    document.addEventListener('DOMContentLoaded', function() {
        // Check if jQuery is loaded every 100ms
        const checkJquery = setInterval(function() {
            if (typeof $ !== 'undefined') {
                clearInterval(checkJquery);
                $(document).ready(initializeComponents);
            }
        }, 100);
    });
}

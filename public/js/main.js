document.addEventListener('DOMContentLoaded', () => {
    // Initialize Bootstrap components
    // Initialize all dropdowns
    const dropdowns = document.querySelectorAll('[data-bs-toggle="dropdown"]');
    for (const dropdown of dropdowns) {
        new bootstrap.Dropdown(dropdown, {
            autoClose: true
        });
    }

    // Initialize all modals
    const modals = document.querySelectorAll('[data-bs-toggle="modal"]');
    for (const modal of modals) {
        new bootstrap.Modal(modal);
    }

    // Initialize tooltips
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    for (const tooltip of tooltips) {
        new bootstrap.Tooltip(tooltip);
    }

    // Add to cart animation and functionality
    // const addToCartButtons = document.querySelectorAll('.add-to-cart');
    // for (const button of addToCartButtons) {
    //     button.addEventListener('click', async (e) => {
    //         e.preventDefault();
    //         const productId = button.dataset.productId;
            
    //         // Show loading state
    //         button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Đang thêm...';
    //         button.disabled = true;

    //         try {
    //             const response = await fetch(`/gio-hang/items/${productId}`, {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 },
    //                 body: JSON.stringify({
    //                     productId,
    //                     quantity: 1
    //                 })
    //             });
                
    //             if (response.ok) {
    //                 // Update cart count
    //                 const cartCount = document.querySelector('.cart-count');
    //                 if (cartCount) {
    //                     const currentCount = Number.parseInt(cartCount.textContent) || 0;
    //                     cartCount.textContent = currentCount + 1;
    //                 }

    //                 // Reset button state
    //                 button.innerHTML = 'Đã thêm vào giỏ';
    //                 button.classList.remove('btn-primary');
    //                 button.classList.add('btn-success');
                    
    //                 // Show success message
    //                 const toast = new bootstrap.Toast(document.querySelector('.toast'));
    //                 toast.show();

    //                 // Reset after 2 seconds
    //                 setTimeout(() => {
    //                     button.innerHTML = 'Thêm vào giỏ';
    //                     button.classList.remove('btn-success');
    //                     button.classList.add('btn-primary');
    //                     button.disabled = false;
    //                 }, 2000);
    //             } else {
    //                 alert('Có lỗi xảy ra khi thêm vào giỏ hàng');
    //             }
    //         } catch (error) {
    //             console.error('Error:', error);
    //             alert('Có lỗi xảy ra khi thêm vào giỏ hàng');
    //         }
    //     });
    // }

    // Smooth scroll
    const anchors = document.querySelectorAll('a[href*="#"]');
    for (const anchor of anchors) {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            
            const href = anchor.getAttribute('href');
            if (!href || href === '#') return;
            
            const targetId = href.split('#')[1];
            if (!targetId) return;
            
            const targetElement = document.getElementById(targetId);
            if (!targetElement) return;
            
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    }

    // Product image gallery
    const productImages = document.querySelectorAll('.product-thumbnail');
    const mainImage = document.querySelector('.product-main-image');
    if (productImages.length && mainImage) {
        for (const img of productImages) {
            img.addEventListener('click', () => {
                mainImage.src = img.src;
                for (const i of productImages) {
                    i.classList.remove('active');
                }
                img.classList.add('active');
            });
        }
    }

    // Quantity input controls
    const quantityInputs = document.querySelectorAll('.quantity-input');
    for (const input of quantityInputs) {
        const decrementBtn = input.previousElementSibling;
        const incrementBtn = input.nextElementSibling;

        decrementBtn?.addEventListener('click', () => {
            const currentValue = Number.parseInt(input.value) || 0;
            if (currentValue > 1) {
                input.value = currentValue - 1;
                input.dispatchEvent(new Event('change'));
            }
        });

        incrementBtn?.addEventListener('click', () => {
            const currentValue = Number.parseInt(input.value) || 0;
            const max = Number.parseInt(input.getAttribute('max')) || 99;
            if (currentValue < max) {
                input.value = currentValue + 1;
                input.dispatchEvent(new Event('change'));
            }
        });

        input.addEventListener('change', () => {
            const value = Number.parseInt(input.value) || 0;
            const min = Number.parseInt(input.getAttribute('min')) || 1;
            const max = Number.parseInt(input.getAttribute('max')) || 99;
            
            if (value < min) input.value = min;
            if (value > max) input.value = max;
        });
    }

    // Form validation
    const forms = document.querySelectorAll('.needs-validation');
    for (const form of forms) {
        form.addEventListener('submit', (event) => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    }

    // Lazy loading images
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ('loading' in HTMLImageElement.prototype) {
        for (const img of lazyImages) {
            img.src = img.dataset.src;
        }
    } else {
        // Fallback for browsers that don't support lazy loading
        const lazyLoadScript = document.createElement('script');
        lazyLoadScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(lazyLoadScript);
    }

    // Product image hover effect
    const productCards = document.querySelectorAll('.product-card');
    for (const card of productCards) {
        card.addEventListener('mouseenter', () => {
            const img = card.querySelector('.product-img img');
            if (img) img.style.transform = 'scale(1.1)';
        });
        
        card.addEventListener('mouseleave', () => {
            const img = card.querySelector('.product-img img');
            if (img) img.style.transform = 'scale(1)';
        });
    }

    // Category slider initialization
    const categorySlider = document.querySelector('.category-slider .row');
    if (categorySlider) {
        $(categorySlider).owlCarousel({
            loop: true,
            margin: 20,
            nav: true,
            dots: false,
            responsive: {
                0: {
                    items: 2
                },
                576: {
                    items: 3
                },
                768: {
                    items: 4
                },
                992: {
                    items: 6
                }
            }
        });
    }
});

// Initialize Owl Carousel
$(document).ready(() => {
    // Initialize category slider
    const owl = $('#slide-sp');
    if (owl.length) {
        owl.owlCarousel({
            items: 5,
            loop: false,
            nav: true,
            autoplay: false,
            autoplayTimeout: 5000,
            autoplayHoverPause: true,
            smartSpeed: 450,
            dots: false,
            margin: 30,
            responsive: {
                0: { items: 2 },
                350: { items: 2 },
                600: { items: 2 },
                768: { items: 3 },
                960: { items: 5 },
                1000: { items: 5 }
            }
        });
    }
}); 

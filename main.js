// Document Ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart
    initializeCart();
    
    // Load featured products on homepage
    if (document.querySelector('.featured-products .product-grid')) {
        loadFeaturedProducts();
    }
    
    // Load products on products page
    if (document.getElementById('products-grid')) {
        loadProducts();
    }
    
    // Load product detail
    if (document.getElementById('product-name')) {
        loadProductDetail();
    }
    
    // Load cart items
    if (document.getElementById('cart-items-container')) {
        loadCartItems();
    }
    
    // Initialize checkout
    if (document.querySelector('.checkout-section')) {
        initializeCheckout();
    }
    
    // Initialize dashboard
    if (document.querySelector('.dashboard-section')) {
        initializeDashboard();
    }
    
    // Setup event listeners
    setupEventListeners();
});

// Initialize Cart
function initializeCart() {
    // Get cart from localStorage or create new one
    let cart = localStorage.getItem('ranggaCart');
    if (!cart) {
        cart = [];
        localStorage.setItem('ranggaCart', JSON.stringify(cart));
    } else {
        cart = JSON.parse(cart);
    }
    
    // Update cart count in header
    updateCartCount(cart.length);
}

// Update Cart Count
function updateCartCount(count) {
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = count;
    });
}

// Load Featured Products
function loadFeaturedProducts() {
    const productGrid = document.querySelector('.featured-products .product-grid');
    
    // Get featured products from API
    getFeaturedProducts()
        .then(products => {
            productGrid.innerHTML = '';
            
            products.forEach(product => {
                const productCard = createProductCard(product);
                productGrid.appendChild(productCard);
            });
        })
        .catch(error => {
            console.error('Error loading featured products:', error);
            productGrid.innerHTML = '<p>Error loading products. Please try again later.</p>';
        });
}

// Load Products
function loadProducts() {
    const productGrid = document.getElementById('products-grid');
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('kategori');
    
    // Update category title
    const categoryTitle = document.getElementById('kategori-title');
    if (category && categoryTitle) {
        categoryTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    }
    
    // Get products from API
    getProducts(category)
        .then(products => {
            productGrid.innerHTML = '';
            
            if (products.length === 0) {
                productGrid.innerHTML = '<p>No products found in this category.</p>';
                return;
            }
            
            products.forEach(product => {
                const productCard = createProductCard(product);
                productGrid.appendChild(productCard);
            });
        })
        .catch(error => {
            console.error('Error loading products:', error);
            productGrid.innerHTML = '<p>Error loading products. Please try again later.</p>';
        });
}

// Create Product Card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const discountPercentage = product.oldPrice ? 
        Math.round((1 - product.price / product.oldPrice) * 100) : 0;
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
            ${discountPercentage > 0 ? `<div class="product-badge">${discountPercentage}% OFF</div>` : ''}
            <div class="product-actions">
                <button class="add-to-wishlist" data-id="${product.id}">
                    <i class="far fa-heart"></i>
                </button>
                <button class="add-to-cart" data-id="${product.id}">
                    <i class="fas fa-shopping-cart"></i>
                </button>
            </div>
        </div>
        <div class="product-info">
            <div class="product-category">${product.category}</div>
            <h3 class="product-name">${product.name}</h3>
            <div class="product-price">
                <span class="current-price">Rp ${formatNumber(product.price)}</span>
                ${product.oldPrice ? `<span class="old-price">Rp ${formatNumber(product.oldPrice)}</span>` : ''}
            </div>
            <div class="product-rating">
                <div class="stars">
                    ${generateStars(product.rating)}
                </div>
                <span>(${product.reviewCount})</span>
            </div>
        </div>
    `;
    
    // Add event listeners
    const addToCartBtn = card.querySelector('.add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            addToCart(product.id);
        });
    }
    
    const addToWishlistBtn = card.querySelector('.add-to-wishlist');
    if (addToWishlistBtn) {
        addToWishlistBtn.addEventListener('click', function() {
            addToWishlist(product.id);
        });
    }
    
    // Make product name clickable
    const productName = card.querySelector('.product-name');
    productName.style.cursor = 'pointer';
    productName.addEventListener('click', function() {
        window.location.href = `detail-produk.html?id=${product.id}`;
    });
    
    // Make product image clickable
    const productImage = card.querySelector('.product-image img');
    productImage.style.cursor = 'pointer';
    productImage.addEventListener('click', function() {
        window.location.href = `detail-produk.html?id=${product.id}`;
    });
    
    return card;
}

// Load Product Detail
function loadProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        console.error('Product ID not found in URL');
        return;
    }
    
    // Get product from API
    getProductById(productId)
        .then(product => {
            // Update breadcrumb
            const breadcrumbName = document.getElementById('product-name-breadcrumb');
            if (breadcrumbName) {
                breadcrumbName.textContent = product.name;
            }
            
            // Update product details
            const productName = document.getElementById('product-name');
            if (productName) {
                productName.textContent = product.name;
            }
            
            const productPrice = document.getElementById('product-price');
            if (productPrice) {
                productPrice.textContent = `Rp ${formatNumber(product.price)}`;
            }
            
            const productOldPrice = document.getElementById('product-old-price');
            if (productOldPrice && product.oldPrice) {
                productOldPrice.textContent = `Rp ${formatNumber(product.oldPrice)}`;
                productOldPrice.style.display = 'inline';
            } else if (productOldPrice) {
                productOldPrice.style.display = 'none';
            }
            
            const productDiscount = document.getElementById('product-discount');
            if (productDiscount && product.oldPrice) {
                const discountPercentage = Math.round((1 - product.price / product.oldPrice) * 100);
                productDiscount.textContent = `${discountPercentage}% OFF`;
                productDiscount.style.display = 'inline';
            } else if (productDiscount) {
                productDiscount.style.display = 'none';
            }
            
            const productDescription = document.getElementById('product-description');
            if (productDescription) {
                productDescription.textContent = product.description;
            }
            
            const fullDescription = document.getElementById('full-description');
            if (fullDescription) {
                fullDescription.textContent = product.fullDescription;
            }
            
            const reviewCount = document.getElementById('review-count');
            if (reviewCount) {
                reviewCount.textContent = product.reviewCount;
            }
            
            // Update product image
            const mainImage = document.getElementById('product-main-image');
            if (mainImage) {
                mainImage.src = product.image;
            }
            
            // Update specifications
            updateSpecifications(product.specifications);
            
            // Load related products
            loadRelatedProducts(product.category, product.id);
            
            // Setup add to cart button
            const addToCartBtn = document.getElementById('add-to-cart-btn');
            if (addToCartBtn) {
                addToCartBtn.addEventListener('click', function() {
                    const quantity = document.getElementById('product-quantity').value;
                    addToCart(product.id, parseInt(quantity));
                });
            }
            
            // Setup quantity selector
            setupQuantitySelector();
            
            // Setup product options
            setupProductOptions();
            
            // Setup product tabs
            setupProductTabs();
            
            // Setup image thumbnails
            setupImageThumbnails();
            
            // Setup review form
            setupReviewForm();
        })
        .catch(error => {
            console.error('Error loading product detail:', error);
            document.querySelector('.product-detail-container').innerHTML = 
                '<p>Error loading product details. Please try again later.</p>';
        });
}

// Update Specifications
function updateSpecifications(specifications) {
    if (!specifications) return;
    
    const specBrand = document.getElementById('spec-brand');
    if (specBrand && specifications.brand) {
        specBrand.textContent = specifications.brand;
    }
    
    const specModel = document.getElementById('spec-model');
    if (specModel && specifications.model) {
        specModel.textContent = specifications.model;
    }
    
    const specDimensions = document.getElementById('spec-dimensions');
    if (specDimensions && specifications.dimensions) {
        specDimensions.textContent = specifications.dimensions;
    }
    
    const specWeight = document.getElementById('spec-weight');
    if (specWeight && specifications.weight) {
        specWeight.textContent = specifications.weight;
    }
    
    const specBattery = document.getElementById('spec-battery');
    if (specBattery && specifications.battery) {
        specBattery.textContent = specifications.battery;
    }
    
    const specOS = document.getElementById('spec-os');
    if (specOS && specifications.os) {
        specOS.textContent = specifications.os;
    }
}

// Load Related Products
function loadRelatedProducts(category, excludeId) {
    const relatedProductsGrid = document.getElementById('related-products-grid');
    if (!relatedProductsGrid) return;
    
    // Get related products from API
    getProducts(category)
        .then(products => {
            relatedProductsGrid.innerHTML = '';
            
            // Filter out the current product
            const relatedProducts = products.filter(p => p.id !== excludeId).slice(0, 4);
            
            relatedProducts.forEach(product => {
                const productCard = createProductCard(product);
                relatedProductsGrid.appendChild(productCard);
            });
        })
        .catch(error => {
            console.error('Error loading related products:', error);
            relatedProductsGrid.innerHTML = '<p>Error loading related products.</p>';
        });
}

// Setup Quantity Selector
function setupQuantitySelector() {
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');
    const quantityInput = document.getElementById('product-quantity');
    
    if (minusBtn && plusBtn && quantityInput) {
        minusBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            if (value > 1) {
                quantityInput.value = value - 1;
            }
        });
        
        plusBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            if (value < 10) {
                quantityInput.value = value + 1;
            }
        });
        
        quantityInput.addEventListener('change', function() {
            let value = parseInt(this.value);
            if (isNaN(value) || value < 1) {
                this.value = 1;
            } else if (value > 10) {
                this.value = 10;
            }
        });
    }
}

// Setup Product Options
function setupProductOptions() {
    // Color options
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            colorOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Storage options
    const storageOptions = document.querySelectorAll('.storage-option');
    storageOptions.forEach(option => {
        option.addEventListener('click', function() {
            storageOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Setup Product Tabs
function setupProductTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update active tab pane
            tabPanes.forEach(pane => {
                if (pane.id === tabId) {
                    pane.classList.add('active');
                } else {
                    pane.classList.remove('active');
                }
            });
        });
    });
}

// Setup Image Thumbnails
function setupImageThumbnails() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('product-main-image');
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Update active thumbnail
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Update main image
            const img = this.querySelector('img');
            if (img && mainImage) {
                mainImage.src = img.src.replace('100x100', '600x600');
            }
        });
    });
}

// Setup Review Form
function setupReviewForm() {
    const reviewForm = document.getElementById('review-form');
    const ratingStars = document.querySelectorAll('.rating-input i');
    
    if (ratingStars.length > 0) {
        ratingStars.forEach((star, index) => {
            star.addEventListener('click', function() {
                const rating = parseInt(this.getAttribute('data-rating'));
                
                // Update star display
                ratingStars.forEach((s, i) => {
                    if (i < rating) {
                        s.classList.remove('far');
                        s.classList.add('fas', 'active');
                    } else {
                        s.classList.remove('fas', 'active');
                        s.classList.add('far');
                    }
                });
            });
        });
    }
    
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const rating = document.querySelectorAll('.rating-input i.active').length;
            const review = this.querySelector('textarea').value;
            
            if (rating === 0) {
                alert('Please select a rating');
                return;
            }
            
            if (!review.trim()) {
                alert('Please write a review');
                return;
            }
            
            // Submit review (in a real app, this would be sent to a server)
            alert('Thank you for your review!');
            this.reset();
            
            // Reset rating stars
            ratingStars.forEach(star => {
                star.classList.remove('fas', 'active');
                star.classList.add('far');
            });
        });
    }
}

// Load Cart Items
function loadCartItems() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartEmpty = document.getElementById('cart-empty');
    const cartTable = document.getElementById('cart-table');
    
    // Get cart from localStorage
    let cart = localStorage.getItem('ranggaCart');
    cart = cart ? JSON.parse(cart) : [];
    
    if (cart.length === 0) {
        // Show empty cart
        if (cartEmpty) cartEmpty.style.display = 'block';
        if (cartTable) cartTable.style.display = 'none';
    } else {
        // Show cart items
        if (cartEmpty) cartEmpty.style.display = 'none';
        if (cartTable) cartTable.style.display = 'block';
        
        // Clear cart items container
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = '';
            
            // Get product details for each cart item
            const productPromises = cart.map(item => getProductById(item.id));
            
            Promise.all(productPromises)
                .then(products => {
                    let subtotal = 0;
                    
                    products.forEach((product, index) => {
                        const cartItem = cart[index];
                        const itemTotal = product.price * cartItem.quantity;
                        subtotal += itemTotal;
                        
                        const cartItemElement = createCartItemElement(product, cartItem);
                        cartItemsContainer.appendChild(cartItemElement);
                    });
                    
                    // Update cart summary
                    updateCartSummary(subtotal);
                })
                .catch(error => {
                    console.error('Error loading cart items:', error);
                    cartItemsContainer.innerHTML = '<p>Error loading cart items. Please try again later.</p>';
                });
        }
    }
}

// Create Cart Item Element
function createCartItemElement(product, cartItem) {
    const item = document.createElement('div');
    item.className = 'cart-item';
    item.dataset.id = product.id;
    
    item.innerHTML = `
        <div class="cart-product-info">
            <div class="cart-product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="cart-product-details">
                <h4>${product.name}</h4>
                <p>${cartItem.color || ''} ${cartItem.storage || ''}</p>
            </div>
        </div>
        <div class="cart-product-price">Rp ${formatNumber(product.price)}</div>
        <div class="cart-product-quantity">
            <div class="cart-quantity-selector">
                <button class="cart-quantity-btn minus">-</button>
                <input type="number" class="cart-quantity-input" value="${cartItem.quantity}" min="1" max="10">
                <button class="cart-quantity-btn plus">+</button>
            </div>
        </div>
        <div class="cart-item-total">Rp ${formatNumber(product.price * cartItem.quantity)}</div>
        <div class="cart-item-remove">
            <i class="fas fa-trash"></i>
        </div>
    `;
    
    // Setup quantity buttons
    const minusBtn = item.querySelector('.cart-quantity-btn.minus');
    const plusBtn = item.querySelector('.cart-quantity-btn.plus');
    const quantityInput = item.querySelector('.cart-quantity-input');
    const itemTotalElement = item.querySelector('.cart-item-total');
    
    if (minusBtn && plusBtn && quantityInput && itemTotalElement) {
        minusBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            if (value > 1) {
                quantityInput.value = value - 1;
                updateCartItem(product.id, value - 1, cartItem.color, cartItem.storage);
                itemTotalElement.textContent = `Rp ${formatNumber(product.price * (value - 1))}`;
                updateCartSummary();
            }
        });
        
        plusBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            if (value < 10) {
                quantityInput.value = value + 1;
                updateCartItem(product.id, value + 1, cartItem.color, cartItem.storage);
                itemTotalElement.textContent = `Rp ${formatNumber(product.price * (value + 1))}`;
                updateCartSummary();
            }
        });
        
        quantityInput.addEventListener('change', function() {
            let value = parseInt(this.value);
            if (isNaN(value) || value < 1) {
                this.value = 1;
                value = 1;
            } else if (value > 10) {
                this.value = 10;
                value = 10;
            }
            
            updateCartItem(product.id, value, cartItem.color, cartItem.storage);
            itemTotalElement.textContent = `Rp ${formatNumber(product.price * value)}`;
            updateCartSummary();
        });
    }
    
    // Setup remove button
    const removeBtn = item.querySelector('.cart-item-remove');
    if (removeBtn) {
        removeBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to remove this item from your cart?')) {
                removeFromCart(product.id);
                item.remove();
                updateCartSummary();
                
                // Check if cart is empty
                const remainingItems = document.querySelectorAll('.cart-item');
                if (remainingItems.length === 0) {
                    location.reload();
                }
            }
        });
    }
    
    return item;
}

// Update Cart Summary
function updateCartSummary(subtotal) {
    if (subtotal === undefined) {
        // Calculate subtotal from cart items
        let calculatedSubtotal = 0;
        const cartItems = document.querySelectorAll('.cart-item');
        
        cartItems.forEach(item => {
            const totalText = item.querySelector('.cart-item-total').textContent;
            const total = parseInt(totalText.replace(/[Rp .]/g, ''));
            calculatedSubtotal += total;
        });
        
        subtotal = calculatedSubtotal;
    }
    
    const shippingCost = 15000; // Fixed shipping cost
    const discount = 0; // No discount for now
    const total = subtotal + shippingCost - discount;
    
    // Update summary elements
    const subtotalElements = document.querySelectorAll('#subtotal, #sidebar-subtotal, #confirm-subtotal');
    subtotalElements.forEach(element => {
        if (element) element.textContent = `Rp ${formatNumber(subtotal)}`;
    });
    
    const shippingElements = document.querySelectorAll('#shipping-cost, #sidebar-shipping, #confirm-shipping');
    shippingElements.forEach(element => {
        if (element) element.textContent = `Rp ${formatNumber(shippingCost)}`;
    });
    
    const discountElements = document.querySelectorAll('#discount, #sidebar-discount, #confirm-discount');
    discountElements.forEach(element => {
        if (element) element.textContent = `- Rp ${formatNumber(discount)}`;
    });
    
    const totalElements = document.querySelectorAll('#total, #sidebar-total, #confirm-total');
    totalElements.forEach(element => {
        if (element) element.textContent = `Rp ${formatNumber(total)}`;
    });
    
    // Update order items in checkout
    updateOrderItems();
}

// Update Order Items
function updateOrderItems() {
    const orderItemsContainers = document.querySelectorAll('#sidebar-order-items, #confirm-order-items');
    
    if (orderItemsContainers.length === 0) return;
    
    // Get cart from localStorage
    let cart = localStorage.getItem('ranggaCart');
    cart = cart ? JSON.parse(cart) : [];
    
    if (cart.length === 0) return;
    
    // Get product details for each cart item
    const productPromises = cart.map(item => getProductById(item.id));
    
    Promise.all(productPromises)
        .then(products => {
            orderItemsContainers.forEach(container => {
                container.innerHTML = '';
                
                products.forEach((product, index) => {
                    const cartItem = cart[index];
                    const orderItem = document.createElement('div');
                    orderItem.className = 'order-item';
                    
                    orderItem.innerHTML = `
                        <div class="order-item-image">
                            <img src="${product.image}" alt="${product.name}">
                        </div>
                        <div class="order-item-details">
                            <div class="order-item-name">${product.name}</div>
                            <div class="order-item-variant">${cartItem.color || ''} ${cartItem.storage || ''}</div>
                        </div>
                        <div class="order-item-quantity">x${cartItem.quantity}</div>
                        <div class="order-item-price">Rp ${formatNumber(product.price)}</div>
                    `;
                    
                    container.appendChild(orderItem);
                });
            });
        })
        .catch(error => {
            console.error('Error updating order items:', error);
            orderItemsContainers.forEach(container => {
                container.innerHTML = '<p>Error loading order items.</p>';
            });
        });
}

// Initialize Checkout
function initializeCheckout() {
    // Setup checkout steps
    const continueToPaymentBtn = document.getElementById('continue-to-payment');
    const backToAddressBtn = document.getElementById('back-to-address');
    const continueToConfirmationBtn = document.getElementById('continue-to-confirmation');
    const backToPaymentBtn = document.getElementById('back-to-payment');
    const placeOrderBtn = document.getElementById('place-order');
    
    if (continueToPaymentBtn) {
        continueToPaymentBtn.addEventListener('click', function() {
            showCheckoutStep(2);
        });
    }
    
    if (backToAddressBtn) {
        backToAddressBtn.addEventListener('click', function() {
            showCheckoutStep(1);
        });
    }
    
    if (continueToConfirmationBtn) {
        continueToConfirmationBtn.addEventListener('click', function() {
            showCheckoutStep(3);
            updateConfirmationDetails();
        });
    }
    
    if (backToPaymentBtn) {
        backToPaymentBtn.addEventListener('click', function() {
            showCheckoutStep(2);
        });
    }
    
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', function() {
            placeOrder();
        });
    }
    
    // Setup payment method selection
    const paymentMethods = document.querySelectorAll('input[name="payment"]');
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            // Hide all payment details
            const paymentDetails = document.querySelectorAll('.payment-details');
            paymentDetails.forEach(detail => {
                detail.style.display = 'none';
            });
            
            // Show selected payment details
            const selectedPayment = this.id;
            const selectedDetails = document.getElementById(`${selectedPayment}-details`);
            if (selectedDetails) {
                selectedDetails.style.display = 'block';
            }
        });
    });
    
    // Setup address form
    const newAddressForm = document.getElementById('new-address-form');
    if (newAddressForm) {
        newAddressForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // In a real app, this would save the address
            alert('Address saved successfully!');
            this.reset();
            document.querySelector('.new-address-form').style.display = 'none';
        });
    }
    
    // Setup add address button
    const addAddressBtn = document.querySelector('.btn-add-address');
    if (addAddressBtn) {
        addAddressBtn.addEventListener('click', function() {
            const newAddressForm = document.querySelector('.new-address-form');
            if (newAddressForm) {
                newAddressForm.style.display = 'block';
            }
        });
    }
    
    // Setup cancel button for new address form
    const cancelBtn = document.querySelector('.btn-cancel');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            const newAddressForm = document.querySelector('.new-address-form');
            if (newAddressForm) {
                newAddressForm.style.display = 'none';
            }
        });
    }
    
    // Setup modal close button
    const modalClose = document.querySelector('.modal-close');
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            const modal = document.getElementById('order-success-modal');
            if (modal) {
                modal.classList.remove('active');
            }
        });
    }
    
    // Update order items
    updateOrderItems();
}

// Show Checkout Step
function showCheckoutStep(stepNumber) {
    // Update step indicators
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        if (index < stepNumber - 1) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (index === stepNumber - 1) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });
    
    // Show/hide step content
    const stepContents = document.querySelectorAll('.checkout-step');
    stepContents.forEach((content, index) => {
        if (index === stepNumber - 1) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
}

// Update Confirmation Details
function updateConfirmationDetails() {
    // Get selected address
    const selectedAddress = document.querySelector('input[name="address"]:checked');
    if (selectedAddress) {
        const addressLabel = selectedAddress.parentElement.querySelector('.address-name').textContent;
        const addressDetails = selectedAddress.parentElement.querySelectorAll('.address-details p');
        
        const confirmAddressName = document.getElementById('confirm-address-name');
        const confirmAddressPhone = document.getElementById('confirm-address-phone');
        const confirmAddressDetail = document.getElementById('confirm-address-detail');
        
        if (confirmAddressName) confirmAddressName.textContent = addressDetails[0].textContent;
        if (confirmAddressPhone) confirmAddressPhone.textContent = addressDetails[1].textContent;
        if (confirmAddressDetail) confirmAddressDetail.textContent = addressDetails[2].textContent;
    }
    
    // Get selected payment method
    const selectedPayment = document.querySelector('input[name="payment"]:checked');
    if (selectedPayment) {
        const paymentLabel = selectedPayment.parentElement.querySelector('.payment-name').textContent;
        const paymentDesc = selectedPayment.parentElement.querySelector('.payment-desc').textContent;
        
        const confirmPaymentName = document.getElementById('confirm-payment-name');
        const confirmPaymentDesc = document.getElementById('confirm-payment-desc');
        
        if (confirmPaymentName) confirmPaymentName.textContent = paymentLabel;
        if (confirmPaymentDesc) confirmPaymentDesc.textContent = paymentDesc;
    }
}

// Place Order
function placeOrder() {
    // Generate order number
    const orderNumber = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 10000)}`;
    
    // Get total amount
    const totalElement = document.getElementById('total');
    const total = totalElement ? totalElement.textContent : 'Rp 0';
    
    // Update order success modal
    const orderNumberElement = document.getElementById('order-number');
    const orderTotalElement = document.getElementById('order-total');
    
    if (orderNumberElement) orderNumberElement.textContent = orderNumber;
    if (orderTotalElement) orderTotalElement.textContent = total;
    
    // Show order success modal
    const modal = document.getElementById('order-success-modal');
    if (modal) {
        modal.classList.add('active');
    }
    
    // Clear cart
    localStorage.removeItem('ranggaCart');
    updateCartCount(0);
}

// Initialize Dashboard
function initializeDashboard() {
    // Get active tab from URL
    const urlParams = new URLSearchParams(window.location.search);
    const activeTab = urlParams.get('tab') || 'dashboard';
    
    // Show active tab
    showDashboardTab(activeTab);
    
    // Setup navigation
    const navLinks = document.querySelectorAll('.dashboard-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get tab from href
            const href = this.getAttribute('href');
            const tab = href.split('=')[1] || 'dashboard';
            
            // Update URL without reloading
            const url = new URL(window.location);
            url.searchParams.set('tab', tab);
            window.history.pushState({}, '', url);
            
            // Show tab
            showDashboardTab(tab);
        });
    });
    
    // Setup logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                // In a real app, this would clear the session
                alert('You have been logged out successfully!');
                window.location.href = 'index.html';
            }
        });
    }
    
    // Load dashboard data
    loadDashboardData();
    
    // Setup profile form
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // In a real app, this would save the profile
            alert('Profile updated successfully!');
        });
    }
    
    // Setup password form
    const passwordForm = document.getElementById('password-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // In a real app, this would change the password
            alert('Password changed successfully!');
            this.reset();
        });
    }
    
    // Setup address modal
    setupAddressModal();
    
    // Load addresses
    loadAddresses();
    
    // Load wishlist
    loadWishlist();
    
    // Load notifications
    loadNotifications();
    
    // Setup notification filters
    setupNotificationFilters();
    
    // Setup mark all as read button
    const markAllReadBtn = document.getElementById('mark-all-read');
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', function() {
            markAllNotificationsAsRead();
        });
    }
}

// Show Dashboard Tab
function showDashboardTab(tab) {
    // Update navigation
    const navLinks = document.querySelectorAll('.dashboard-nav li');
    navLinks.forEach(link => {
        const href = link.querySelector('a').getAttribute('href');
        const linkTab = href.split('=')[1] || 'dashboard';
        
        if (linkTab === tab) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Show tab content
    const tabContents = document.querySelectorAll('.dashboard-tab');
    tabContents.forEach(content => {
        if (content.id === `tab-${tab}`) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
}

// Load Dashboard Data
function loadDashboardData() {
    // Get cart from localStorage
    let cart = localStorage.getItem('ranggaCart');
    cart = cart ? JSON.parse(cart) : [];
    
    // Update stats
    const totalOrdersElement = document.getElementById('total-orders');
    if (totalOrdersElement) {
        // In a real app, this would come from the server
        totalOrdersElement.textContent = Math.floor(Math.random() * 20) + 1;
    }
    
    const totalWishlistElement = document.getElementById('total-wishlist');
    if (totalWishlistElement) {
        // In a real app, this would come from the server
        totalWishlistElement.textContent = Math.floor(Math.random() * 10) + 1;
    }
    
    const totalAddressesElement = document.getElementById('total-addresses');
    if (totalAddressesElement) {
        // In a real app, this would come from the server
        totalAddressesElement.textContent = Math.floor(Math.random() * 5) + 1;
    }
    
    // Load recent orders
    loadRecentOrders();
    
    // Load recommended products
    loadRecommendedProducts();
}

// Load Recent Orders
function loadRecentOrders() {
    const recentOrdersList = document.getElementById('recent-orders-list');
    if (!recentOrdersList) return;
    
    // In a real app, this would come from the server
    const orders = [
        { id: 'ORD-20230510-1234', date: '2023-05-10', total: 6014000, status: 'delivered' },
        { id: 'ORD-20230505-5678', date: '2023-05-05', total: 3299000, status: 'delivered' },
        { id: 'ORD-20230428-9012', date: '2023-04-28', total: 8999000, status: 'shipped' }
    ];
    
    recentOrdersList.innerHTML = '';
    
    orders.forEach(order => {
        const orderRow = document.createElement('div');
        orderRow.className = 'order-row';
        
        orderRow.innerHTML = `
            <div class="order-id">${order.id}</div>
            <div class="order-date">${formatDate(order.date)}</div>
            <div class="order-total">Rp ${formatNumber(order.total)}</div>
            <div class="order-status">
                <span class="order-status status-${order.status}">${formatStatus(order.status)}</span>
            </div>
            <div class="order-action">
                <button>View</button>
            </div>
        `;
        
        recentOrdersList.appendChild(orderRow);
    });
}

// Load Recommended Products
function loadRecommendedProducts() {
    const recommendedProductsGrid = document.getElementById('recommended-products-grid');
    if (!recommendedProductsGrid) return;
    
    // Get recommended products from API
    getProducts()
        .then(products => {
            recommendedProductsGrid.innerHTML = '';
            
            // Show only 4 recommended products
            const recommendedProducts = products.slice(0, 4);
            
            recommendedProducts.forEach(product => {
                const productCard = createProductCard(product);
                recommendedProductsGrid.appendChild(productCard);
            });
        })
        .catch(error => {
            console.error('Error loading recommended products:', error);
            recommendedProductsGrid.innerHTML = '<p>Error loading recommended products.</p>';
        });
}

// Setup Address Modal
function setupAddressModal() {
    const addNewAddressBtn = document.getElementById('add-new-address');
    const addressModal = document.getElementById('address-modal');
    const modalClose = addressModal ? addressModal.querySelector('.modal-close') : null;
    const cancelBtn = addressModal ? addressModal.querySelector('.btn-cancel') : null;
    const addressForm = document.getElementById('address-form');
    
    if (addNewAddressBtn) {
        addNewAddressBtn.addEventListener('click', function() {
            if (addressModal) {
                addressModal.classList.add('active');
                document.getElementById('address-modal-title').textContent = 'Tambah Alamat Baru';
                addressForm.reset();
            }
        });
    }
    
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            if (addressModal) {
                addressModal.classList.remove('active');
            }
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            if (addressModal) {
                addressModal.classList.remove('active');
            }
        });
    }
    
    if (addressForm) {
        addressForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // In a real app, this would save the address
            alert('Address saved successfully!');
            if (addressModal) {
                addressModal.classList.remove('active');
            }
            // Reload addresses
            loadAddresses();
        });
    }
}

// Load Addresses
function loadAddresses() {
    const addressList = document.getElementById('address-list');
    if (!addressList) return;
    
    // In a real app, this would come from the server
    const addresses = [
        {
            id: 1,
            label: 'Rumah',
            recipient: 'John Doe',
            phone: '08123456789',
            address: 'Jl. Contoh No. 123, RT 001/RW 002, Kelurahan Example, Kecamatan Sample, Jakarta Selatan, DKI Jakarta, 12345',
            isDefault: true
        },
        {
            id: 2,
            label: 'Kantor',
            recipient: 'John Doe',
            phone: '08123456789',
            address: 'Jl. Kantor No. 456, RT 003/RW 004, Kelurahan Business, Kecamatan Central, Jakarta Pusat, DKI Jakarta, 12346',
            isDefault: false
        }
    ];
    
    addressList.innerHTML = '';
    
    addresses.forEach(address => {
        const addressCard = document.createElement('div');
        addressCard.className = 'address-card';
        if (address.isDefault) {
            addressCard.classList.add('default');
        }
        
        addressCard.innerHTML = `
            ${address.isDefault ? '<div class="address-badge">Utama</div>' : ''}
            <div class="address-label">${address.label}</div>
            <div class="address-recipient">${address.recipient}</div>
            <div class="address-phone">${address.phone}</div>
            <div class="address-detail">${address.address}</div>
            <div class="address-actions">
                <button class="btn btn-outline edit-address" data-id="${address.id}">Edit</button>
                <button class="btn btn-outline delete-address" data-id="${address.id}">Hapus</button>
                ${!address.isDefault ? `<button class="btn btn-primary set-default-address" data-id="${address.id}">Jadikan Utama</button>` : ''}
            </div>
        `;
        
        addressList.appendChild(addressCard);
    });
    
    // Setup address action buttons
    const editButtons = addressList.querySelectorAll('.edit-address');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const addressId = this.getAttribute('data-id');
            // In a real app, this would load the address data into the form
            if (addressModal) {
                addressModal.classList.add('active');
                document.getElementById('address-modal-title').textContent = 'Edit Alamat';
            }
        });
    });
    
    const deleteButtons = addressList.querySelectorAll('.delete-address');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this address?')) {
                const addressId = this.getAttribute('data-id');
                // In a real app, this would delete the address
                alert('Address deleted successfully!');
                // Reload addresses
                loadAddresses();
            }
        });
    });
    
    const setDefaultButtons = addressList.querySelectorAll('.set-default-address');
    setDefaultButtons.forEach(button => {
        button.addEventListener('click', function() {
            const addressId = this.getAttribute('data-id');
            // In a real app, this would set the address as default
            alert('Address set as default successfully!');
            // Reload addresses
            loadAddresses();
        });
    });
}

// Load Wishlist
function loadWishlist() {
    const wishlistGrid = document.getElementById('wishlist-grid');
    const wishlistEmpty = document.getElementById('wishlist-empty');
    
    if (!wishlistGrid) return;
    
    // In a real app, this would come from the server
    const wishlistProducts = [
        { id: 1, name: 'Smartphone X', price: 5999000, image: 'https://via.placeholder.com/200x200', category: 'smartphone', rating: 4.5, reviewCount: 24 },
        { id: 2, name: 'Laptop Y', price: 12999000, image: 'https://via.placeholder.com/200x200', category: 'laptop', rating: 4.2, reviewCount: 18 },
        { id: 3, name: 'Tablet Z', price: 3999000, image: 'https://via.placeholder.com/200x200', category: 'tablet', rating: 4.0, reviewCount: 12 }
    ];
    
    if (wishlistProducts.length === 0) {
        if (wishlistEmpty) wishlistEmpty.style.display = 'block';
        wishlistGrid.style.display = 'none';
    } else {
        if (wishlistEmpty) wishlistEmpty.style.display = 'none';
        wishlistGrid.style.display = 'grid';
        
        wishlistGrid.innerHTML = '';
        
        wishlistProducts.forEach(product => {
            const wishlistItem = document.createElement('div');
            wishlistItem.className = 'wishlist-item';
            
            const discountPercentage = product.oldPrice ? 
                Math.round((1 - product.price / product.oldPrice) * 100) : 0;
            
            wishlistItem.innerHTML = `
                <button class="remove-wishlist" data-id="${product.id}">
                    <i class="fas fa-times"></i>
                </button>
                <div class="product-card">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}">
                        ${discountPercentage > 0 ? `<div class="product-badge">${discountPercentage}% OFF</div>` : ''}
                        <div class="product-actions">
                            <button class="add-to-cart" data-id="${product.id}">
                                <i class="fas fa-shopping-cart"></i>
                            </button>
                        </div>
                    </div>
                    <div class="product-info">
                        <div class="product-category">${product.category}</div>
                        <h3 class="product-name">${product.name}</h3>
                        <div class="product-price">
                            <span class="current-price">Rp ${formatNumber(product.price)}</span>
                            ${product.oldPrice ? `<span class="old-price">Rp ${formatNumber(product.oldPrice)}</span>` : ''}
                        </div>
                        <div class="product-rating">
                            <div class="stars">
                                ${generateStars(product.rating)}
                            </div>
                            <span>(${product.reviewCount})</span>
                        </div>
                    </div>
                </div>
            `;
            
            wishlistGrid.appendChild(wishlistItem);
        });
        
        // Setup remove from wishlist buttons
        const removeButtons = wishlistGrid.querySelectorAll('.remove-wishlist');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                // In a real app, this would remove from wishlist
                this.closest('.wishlist-item').remove();
                
                // Check if wishlist is empty
                const remainingItems = wishlistGrid.querySelectorAll('.wishlist-item');
                if (remainingItems.length === 0) {
                    if (wishlistEmpty) wishlistEmpty.style.display = 'block';
                    wishlistGrid.style.display = 'none';
                }
            });
        });
        
        // Setup add to cart buttons
        const addToCartButtons = wishlistGrid.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                addToCart(productId);
            });
        });
    }
}

// Load Notifications
function loadNotifications() {
    const notificationsList = document.getElementById('notifications-list');
    if (!notificationsList) return;
    
    // In a real app, this would come from the server
    const notifications = [
        {
            id: 1,
            type: 'order',
            title: 'Pesanan Dikirim',
            message: 'Pesanan #ORD-20230510-1234 telah dikirim. Estimasi tiba 2-3 hari kerja.',
            time: '2 jam yang lalu',
            isRead: false
        },
        {
            id: 2,
            type: 'promotion',
            title: 'Promo Spesial',
            message: 'Dapatkan diskon 10% untuk semua produk smartphone dengan kode promo SMART10.',
            time: '1 hari yang lalu',
            isRead: false
        },
        {
            id: 3,
            type: 'system',
            title: 'Pemeliharaan Sistem',
            message: 'Sistem akan mengalami pemeliharaan pada tanggal 15 Mei 2023 pukul 02:00 - 05:00 WIB.',
            time: '3 hari yang lalu',
            isRead: true
        },
        {
            id: 4,
            type: 'order',
            title: 'Pesanan Dikonfirmasi',
            message: 'Pesanan #ORD-20230505-5678 telah dikonfirmasi dan sedang diproses.',
            time: '5 hari yang lalu',
            isRead: true
        }
    ];
    
    notificationsList.innerHTML = '';
    
    notifications.forEach(notification => {
        const notificationItem = document.createElement('div');
        notificationItem.className = `notification-item ${!notification.isRead ? 'unread' : ''}`;
        notificationItem.dataset.id = notification.id;
        notificationItem.dataset.type = notification.type;
        
        notificationItem.innerHTML = `
            <div class="notification-icon ${notification.type}">
                <i class="fas fa-${getNotificationIcon(notification.type)}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${notification.title}</div>
                <div class="notification-message">${notification.message}</div>
                <div class="notification-time">${notification.time}</div>
            </div>
        `;
        
        notificationItem.addEventListener('click', function() {
            // Mark as read
            this.classList.remove('unread');
            // In a real app, this would update the server
        });
        
        notificationsList.appendChild(notificationItem);
    });
}

// Get Notification Icon
function getNotificationIcon(type) {
    switch (type) {
        case 'order':
            return 'shopping-bag';
        case 'promotion':
            return 'tag';
        case 'system':
            return 'info-circle';
        default:
            return 'bell';
    }
}

// Setup Notification Filters
function setupNotificationFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const notificationItems = document.querySelectorAll('.notification-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active filter
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter notifications
            const filter = this.getAttribute('data-filter');
            
            notificationItems.forEach(item => {
                if (filter === 'all' || item.dataset.type === filter) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Mark All Notifications as Read
function markAllNotificationsAsRead() {
    const notificationItems = document.querySelectorAll('.notification-item');
    
    notificationItems.forEach(item => {
        item.classList.remove('unread');
    });
    
    // In a real app, this would update the server
    alert('All notifications marked as read!');
}

// Setup Event Listeners
function setupEventListeners() {
    // Search form
    const searchForm = document.querySelector('.search-bar');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = this.querySelector('input');
            const searchTerm = searchInput.value.trim();
            
            if (searchTerm) {
                // In a real app, this would redirect to search results
                alert(`Searching for: ${searchTerm}`);
            }
        });
    }
    
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email) {
                // In a real app, this would subscribe the email
                alert(`Thank you for subscribing with: ${email}`);
                emailInput.value = '';
            }
        });
    }
    
    // Product sort
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortBy = this.value;
            // In a real app, this would sort the products
            console.log(`Sorting by: ${sortBy}`);
        });
    }
    
    // Price filter
    const filterPriceBtn = document.getElementById('filter-price');
    if (filterPriceBtn) {
        filterPriceBtn.addEventListener('click', function() {
            const minPrice = document.getElementById('min-price').value;
            const maxPrice = document.getElementById('max-price').value;
            
            // In a real app, this would filter the products
            console.log(`Filtering by price: ${minPrice} - ${maxPrice}`);
        });
    }
    
    // Pagination
    const pageButtons = document.querySelectorAll('.page-btn');
    pageButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.classList.contains('active')) {
                // In a real app, this would load the next page
                console.log(`Loading page: ${this.textContent}`);
            }
        });
    });
    
    // Order status filter
    const orderStatusFilter = document.getElementById('order-status-filter');
    if (orderStatusFilter) {
        orderStatusFilter.addEventListener('change', function() {
            const status = this.value;
            // In a real app, this would filter the orders
            console.log(`Filtering by status: ${status}`);
        });
    }
    
    // Order period filter
    const orderPeriodFilter = document.getElementById('order-period-filter');
    if (orderPeriodFilter) {
        orderPeriodFilter.addEventListener('change', function() {
            const period = this.value;
            // In a real app, this would filter the orders
            console.log(`Filtering by period: ${period}`);
        });
    }
}

// Add to Cart
function addToCart(productId, quantity = 1) {
    // Get cart from localStorage
    let cart = localStorage.getItem('ranggaCart');
    cart = cart ? JSON.parse(cart) : [];
    
    // Check if product is already in cart
    const existingItemIndex = cart.findIndex(item => item.id === productId);
    
    if (existingItemIndex !== -1) {
        // Update quantity if product is already in cart
        cart[existingItemIndex].quantity += quantity;
        if (cart[existingItemIndex].quantity > 10) {
            cart[existingItemIndex].quantity = 10;
        }
    } else {
        // Add new item to cart
        cart.push({
            id: productId,
            quantity: quantity,
            color: '',
            storage: ''
        });
    }
    
    // Save cart to localStorage
    localStorage.setItem('ranggaCart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount(cart.length);
    
    // Show success message
    alert('Product added to cart!');
}

// Update Cart Item
function updateCartItem(productId, quantity, color, storage) {
    // Get cart from localStorage
    let cart = localStorage.getItem('ranggaCart');
    cart = cart ? JSON.parse(cart) : [];
    
    // Find item in cart
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
        // Update item
        cart[itemIndex].quantity = quantity;
        cart[itemIndex].color = color;
        cart[itemIndex].storage = storage;
        
        // Save cart to localStorage
        localStorage.setItem('ranggaCart', JSON.stringify(cart));
    }
}

// Remove from Cart
function removeFromCart(productId) {
    // Get cart from localStorage
    let cart = localStorage.getItem('ranggaCart');
    cart = cart ? JSON.parse(cart) : [];
    
    // Remove item from cart
    cart = cart.filter(item => item.id !== productId);
    
    // Save cart to localStorage
    localStorage.setItem('ranggaCart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount(cart.length);
}

// Add to Wishlist
function addToWishlist(productId) {
    // In a real app, this would add the product to the user's wishlist
    alert('Product added to wishlist!');
}

// Format Number
function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Format Date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

// Format Status
function formatStatus(status) {
    switch (status) {
        case 'pending':
            return 'Menunggu Pembayaran';
        case 'processing':
            return 'Diproses';
        case 'shipped':
            return 'Dikirim';
        case 'delivered':
            return 'Diterima';
        case 'cancelled':
            return 'Dibatalkan';
        default:
            return status;
    }
}

// Generate Stars
function generateStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}
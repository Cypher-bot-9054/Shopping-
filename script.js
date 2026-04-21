// Product Data
const products = [
    { id: 1, name: "Wireless Headphones", price: 2999, image: "🎧", category: "electronics" },
    { id: 2, name: "Smart Watch", price: 4999, image: "⌚", category: "electronics" },
    { id: 3, name: "Running Shoes", price: 3999, image: "👟", category: "fashion" },
    { id: 4, name: "Backpack", price: 1999, image: "🎒", category: "accessories" },
    { id: 5, name: "Sunglasses", price: 1499, image: "🕶️", category: "accessories" },
    { id: 6, name: "Coffee Mug", price: 499, image: "☕", category: "home" },
    { id: 7, name: "T-Shirt", price: 999, image: "👕", category: "fashion" },
    { id: 8, name: "Power Bank", price: 1999, image: "🔋", category: "electronics" }
];

// Cart array
let cart = [];

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('shoppingCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
}

// Display products
function displayProducts() {
    const productGrid = document.getElementById('product-grid');
    
    if (!productGrid) return;
    
    productGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">${product.image}</div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">₹${product.price.toLocaleString()}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartUI();
    
    // Animation feedback
    const button = event.target;
    button.textContent = 'Added!';
    setTimeout(() => {
        button.textContent = 'Add to Cart';
    }, 1000);
    
    // Show cart briefly
    toggleCart();
}

// Update cart UI
function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    // Update count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) cartCount.textContent = totalItems;
    
    // Update cart items display
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = '<p>Your cart is empty</p>';
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">₹${item.price.toLocaleString()}</div>
                    </div>
                    <div class="cart-item-quantity">
                        <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                </div>
            `).join('');
        }
    }
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotal) cartTotal.textContent = total.toLocaleString();
}

// Update quantity
function updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        cart = cart.filter(item => item.id !== productId);
    } else {
        const item = cart.find(item => item.id === productId);
        if (item) item.quantity = newQuantity;
    }
    
    saveCart();
    updateCartUI();
}

// Toggle cart sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('overlay');
    
    if (cartSidebar && overlay) {
        cartSidebar.classList.toggle('open');
        overlay.classList.toggle('active');
    }
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Thank you for your order!\nTotal: ₹${total.toLocaleString()}\n\nYour items will be delivered soon.`);
    
    // Clear cart
    cart = [];
    saveCart();
    updateCartUI();
    toggleCart();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    loadCart();
    updateCartUI();
});
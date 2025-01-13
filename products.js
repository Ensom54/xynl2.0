// 购物车和收藏功能
let cart = [];
let wishlist = [];

// 打开购物车
function openCart() {
    document.getElementById('cartSidebar').classList.add('active');
    document.getElementById('overlay').classList.add('active');
}

// 打开收藏夹
function openWishlist() {
    document.getElementById('wishlistSidebar').classList.add('active');
    document.getElementById('overlay').classList.add('active');
}

// 关闭侧边栏
function closeSidebar() {
    document.getElementById('cartSidebar').classList.remove('active');
    document.getElementById('wishlistSidebar').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}

// 添加到购物车
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({...product, quantity: 1 });
    }
    updateCartUI();
    openCart();
}

// 添加到收藏夹
function addToWishlist(product) {
    const exists = wishlist.some(item => item.id === product.id);
    if (!exists) {
        wishlist.push(product);
        updateWishlistUI();
    }
}

// 更新购物车UI
function updateCartUI() {
    const cartItems = document.querySelector('.cart-items');
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="item-details">
                <h4 class="item-title">${item.name}</h4>
                <div class="item-price">¥${item.price}</div>
                <div class="item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <i class="fas fa-trash remove-item" onclick="removeFromCart(${item.id})"></i>
        </div>
    `).join('');

    // 更新总价
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    document.querySelector('.total-price').textContent = `¥${total.toFixed(2)}`;
}

// 更新收藏夹UI
function updateWishlistUI() {
    const wishlistItems = document.querySelector('.wishlist-items');
    wishlistItems.innerHTML = wishlist.map(item => `
        <div class="wishlist-item">
            <div class="item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="item-details">
                <h4 class="item-title">${item.name}</h4>
                <div class="item-price">¥${item.price}</div>
                <button class="add-to-cart" onclick="moveToCart(${item.id})">
                    <i class="fas fa-shopping-cart"></i> 加入购物车
                </button>
            </div>
            <i class="fas fa-trash remove-item" onclick="removeFromWishlist(${item.id})"></i>
        </div>
    `).join('');
}

// 更新商品数量
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, item.quantity + change);
        updateCartUI();
    }
}

// 从购物车移除商品
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

// 从收藏夹移除商品
function removeFromWishlist(productId) {
    wishlist = wishlist.filter(item => item.id !== productId);
    updateWishlistUI();
}

// 从收藏夹移动到购物车
function moveToCart(productId) {
    const item = wishlist.find(item => item.id === productId);
    if (item) {
        addToCart(item);
        removeFromWishlist(productId);
    }
}

// 事件监听器
document.addEventListener('DOMContentLoaded', () => {
    // 添加到购物车按钮
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            const product = {
                id: parseInt(card.dataset.id),
                name: card.querySelector('h3').textContent,
                price: parseFloat(card.querySelector('.current').textContent.replace('¥', '')),
                image: card.querySelector('img').src
            };
            addToCart(product);
        });
    });

    // 添加到收藏夹按钮
    document.querySelectorAll('.add-to-wishlist').forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            const product = {
                id: parseInt(card.dataset.id),
                name: card.querySelector('h3').textContent,
                price: parseFloat(card.querySelector('.current').textContent.replace('¥', '')),
                image: card.querySelector('img').src
            };
            addToWishlist(product);
        });
    });

    // 关闭按钮
    document.querySelectorAll('.close-cart, .close-wishlist, #overlay').forEach(element => {
        element.addEventListener('click', closeSidebar);
    });

    // 搜索功能
    const searchInput = document.getElementById('searchInput');
    const productCards = document.querySelectorAll('.product-card');

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();

        productCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();

            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // 分类筛选功能
    const filterButtons = document.querySelectorAll('.filter-buttons button');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.textContent.toLowerCase();

            // 更新按钮状态
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // 筛选商品
            productCards.forEach(card => {
                if (category === '全部') {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease';
                } else {
                    const productCategory = card.dataset.category;
                    if (productCategory === category) {
                        card.style.display = 'block';
                        card.style.animation = 'fadeIn 0.5s ease';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });

    // 排序功能
    const sortSelect = document.querySelector('.filter-group select');
    const productsWrapper = document.querySelector('.products-wrapper');

    sortSelect.addEventListener('change', () => {
        const sortType = sortSelect.value;
        const products = Array.from(document.querySelectorAll('.product-card'));

        products.sort((a, b) => {
            const priceA = parseFloat(a.querySelector('.current').textContent.replace('¥', ''));
            const priceB = parseFloat(b.querySelector('.current').textContent.replace('¥', ''));
            const salesA = parseInt(a.querySelector('.rating span').textContent.match(/\d+/)[0]);
            const salesB = parseInt(b.querySelector('.rating span').textContent.match(/\d+/)[0]);

            switch (sortType) {
                case 'price-asc':
                    return priceA - priceB;
                case 'price-desc':
                    return priceB - priceA;
                case 'sales':
                    return salesB - salesA;
                default:
                    // 默认排序（按原始顺序）
                    return products.indexOf(a) - products.indexOf(b);
            }
        });

        // 清空并重新添加排序后的商品
        productsWrapper.innerHTML = '';
        products.forEach(product => {
            product.style.animation = 'fadeIn 0.5s ease';
            productsWrapper.appendChild(product);
        });
    });

    // 添加排序动画
    const sortAnimation = {
        keyframes: [
            { opacity: 0, transform: 'translateY(20px)' },
            { opacity: 1, transform: 'translateY(0)' }
        ],
        options: {
            duration: 500,
            easing: 'ease',
            fill: 'forwards'
        }
    };

    // 排序时添加过渡效果
    function animateSort(products) {
        products.forEach((product, index) => {
            setTimeout(() => {
                product.animate(sortAnimation.keyframes, sortAnimation.options);
            }, index * 100);
        });
    }
});
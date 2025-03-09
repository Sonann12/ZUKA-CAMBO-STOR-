
let cart = [];
let total = 0;

document.addEventListener('DOMContentLoaded', () => {
    const buyButtons = document.querySelectorAll('.buy-btn');
    buyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.game-card');
            const gameName = card.querySelector('h3').textContent;
            // យកតម្លៃពីអត្ថបទ និងបម្លែងទៅជាលេខ
            const priceText = card.querySelector('p').textContent.replace(/តម្លៃ: \$|Price: \$/, '');
            const price = parseFloat(priceText);
            if (!isNaN(price)) { // ត្រួតពិនិត្យថាតម្លៃជាលេខត្រឹមត្រូវ
                addToCart(gameName, price);
            } else {
                console.error(`Invalid price for ${gameName}: ${priceText}`);
            }
        });
    });

    document.querySelector('.checkout-btn').addEventListener('click', checkout);
    document.getElementById('searchInput').addEventListener('keyup', searchGames);
    changeLanguage(); // ផ្លាស់ប្តូរភាសាដំបូង
});

function addToCart(gameName, price) {
    cart.push({ name: gameName, price: price });
    total = cart.reduce((sum, item) => sum + item.price, 0); // គណនាតម្លៃសរុបថ្មី
    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = ''; // លុបអត្ថបទចាស់
    cart.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `${item.name} - $${item.price.toFixed(2)}`;
        cartItems.appendChild(div);
    });
    document.getElementById('cartTotal').textContent = total.toFixed(2); // បង្ហាញតម្លៃសរុប
}

function checkout() {
    if (cart.length === 0) {
        alert(document.documentElement.lang === 'km' ? 'កន្ត្រកទំនិញរបស់អ្នកទទេ!' : 'Your cart is empty!');
        return;
    }

    // បង្កើតសារការបញ្ជាទិញ
    const orderDetails = cart.map(item => `${item.name} - $${item.price.toFixed(2)}`).join('\n');
    const message = `${document.documentElement.lang === 'km' ? 'ការបញ្ជាទិញថ្មី' : 'New Order'}:\n${orderDetails}\n${document.documentElement.lang === 'km' ? 'សរុប' : 'Total'}: $${total.toFixed(2)}`;

    // បើក Telegram ផ្ទាល់ជាមួយ Bot ដោយភ្ជាប់សារការបញ្ជាទិញ
    const botUsername = 'NannShopBot'; // ជំនួសដោយ username របស់ Bot (ឧ. MyGameZoneBot)
    const telegramLink = `https://t.me/${botUsername}?start=order_${encodeURIComponent(message)}`;
    
    // បើក Telegram នៅ tab ថ្មី
    window.open(telegramLink, '_blank');

    // បោសសំអាតកន្ត្រក
    alert(document.documentElement.lang === 'km' ? 'សូមបញ្ជាក់ការបញ្ជាទិញរបស់អ្នកនៅក្នុង Telegram!' : 'Please confirm your order in Telegram!');
    cart = [];
    total = 0;
    updateCart();
}

function searchGames() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const games = document.getElementsByClassName('game-card');
    for (let i = 0; i < games.length; i++) {
        const title = games[i].getElementsByTagName('h3')[0].textContent.toLowerCase();
        if (title.includes(input)) {
            games[i].style.display = '';
        } else {
            games[i].style.display = 'none';
        }
    }
}

function changeLanguage() {
    const lang = document.getElementById('languageSwitch').value;
    document.documentElement.lang = lang;

    // ផ្លាស់ប្តូរអត្ថបទ លើកលែងតែ header h1
    const elements = document.querySelectorAll('[data-km], [data-en]');
    elements.forEach(el => {
        if (el.tagName === 'H1' && el.parentElement.parentElement.className === 'header') {
            return; // រំលង header h1
        }
        if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
            el.placeholder = el.getAttribute(`data-${lang}-placeholder`);
        } else {
            el.textContent = el.getAttribute(`data-${lang}`);
        }
    });

    // កែសម្រួលសរុបនៅកន្ត្រក
    const totalLabel = document.querySelector('.cart p');
    totalLabel.childNodes[0].textContent = lang === 'km' ? 'សរុប: $' : 'Total: $';
}
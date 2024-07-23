let products = JSON.parse(localStorage.getItem('products')) || [];
let editIndex = -1;

function calculateFinalPrice() {
    const price = parseFloat(document.getElementById('product-price').value);
    const expenses = parseFloat(document.getElementById('product-expenses').value) || 0;
    const quantity = parseFloat(document.getElementById('product-quantity').value) || 1;
    const discountCheckbox = document.getElementById('product-discount');
    const discountPercentage = discountCheckbox.checked ? parseFloat(prompt('أدخل نسبة الخصم (%)')) || 0 : 0;

    if (isNaN(price)) return;

    let expensePerUnit = expenses / quantity;
    let finalPrice = price + expensePerUnit;
    if (discountPercentage > 0) {
        finalPrice -= (finalPrice * discountPercentage / 100);
    }

    document.getElementById('final-price').innerText = `السعر النهائي: ${finalPrice.toFixed(2)}`;
}

function addProduct(event) {
    event.preventDefault();

    const productName = document.getElementById('product-name').value;
    const productQuantity = parseFloat(document.getElementById('product-quantity').value) || 1;
    const productCategory = document.getElementById('product-category').value;
    const productPrice = parseFloat(document.getElementById('product-price').value);
    const productExpenses = parseFloat(document.getElementById('product-expenses').value) || 0;
    const productDiscount = document.getElementById('product-discount').checked;

    const discountPercentage = productDiscount ? parseFloat(prompt('أدخل نسبة الخصم (%)')) || 0 : 0;
    let expensePerUnit = productExpenses / productQuantity;
    let finalPrice = productPrice + expensePerUnit;
    if (discountPercentage > 0) {
        finalPrice -= (finalPrice * discountPercentage / 100);
    }

    const product = {
        name: productName,
        quantity: productQuantity,
        category: productCategory,
        price: productPrice,
        expenses: productExpenses,
        discount: productDiscount,
        finalPrice: finalPrice.toFixed(2)
    };

    if (editIndex === -1) {
        products.push(product);
    } else {
        products[editIndex] = product;
        editIndex = -1;
    }

    saveProducts();
    displayProducts();
    document.getElementById('product-form').reset();
    document.getElementById('final-price').innerText = 'السعر النهائي: ';
}

function displayProducts() {
    const tbody = document.querySelector('#product-table tbody');
    tbody.innerHTML = '';

    products.forEach((product, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.quantity}</td>
            <td>${product.category}</td>
            <td>${product.price}</td>
            <td>${product.expenses}</td>
            <td>${product.discount ? 'نعم' : 'لا'}</td>
            <td>${product.finalPrice}</td>
            <td class="actions">
                <button class="edit-btn" onclick="editProduct(${index})">تعديل</button>
                <button class="delete-btn" onclick="deleteProduct(${index})">حذف</button>
            </td>
        `;

        tbody.appendChild(row);
    });
}

function editProduct(index) {
    const product = products[index];

    document.getElementById('product-name').value = product.name;
    document.getElementById('product-quantity').value = product.quantity;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-expenses').value = product.expenses;
    document.getElementById('product-discount').checked = product.discount;

    editIndex = index;
}

function deleteProduct(index) {
    products.splice(index, 1);
    saveProducts();
    displayProducts();
}

function performSearch() {
    const searchName = document.getElementById('search-name').value.toLowerCase();
    const searchCategory = document.getElementById('search-category').value.toLowerCase();

    const rows = document.querySelectorAll('#product-table tbody tr');

    rows.forEach(row => {
        const name = row.cells[0].innerText.toLowerCase();
        const category = row.cells[2].innerText.toLowerCase();

        const matchesName = searchName ? name.includes(searchName) : true;
        const matchesCategory = searchCategory ? category.includes(searchCategory) : true;

        row.style.display = (matchesName && matchesCategory) ? '' : 'none';
    });
}

function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

document.getElementById('product-form').addEventListener('submit', addProduct);

// عند تحميل الصفحة، عرض المنتجات المخزنة
window.onload = displayProducts;

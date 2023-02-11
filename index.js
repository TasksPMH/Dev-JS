const sortNameButton = document.getElementById('sort-name');
const sortPriceButton = document.getElementById('sort-price');
const limitNumberInput = document.getElementById('limit-number');
const limitSubmitButton = document.getElementById('limit-submit');

const productList = document.querySelector('#product-list');
const popupDescription = document.querySelector('#popup-description');
const popupPrice = document.querySelector('#popup-price');
const popupRating = document.querySelector('#popup-rating');
const popupStock = document.querySelector('#popup-stock');
const popupBrand = document.querySelector('#popup-brand');

const popupPanel = document.querySelector('#popup-panel');

var fetchProducts = [];
var displayedProducts = [];

fetch('https://dummyjson.com/products?limit=10')
  .then((res) => res.json())
  .then(({ products }) => {
    fetchProducts = products;
    console.log(products);
    displayedProducts = products;
    renderProducts();
  });

sortNameButton.addEventListener('click', () => {
  displayedProducts.sort((a, b) => {
    if (a.title < b.title) {
      return -1;
    }
    if (a.title > b.title) {
      return 1;
    }
    return 0;
  });
  renderProducts();
});

// sort by price
sortPriceButton.addEventListener('click', () => {
  displayedProducts.sort((a, b) => a.price - b.price);
  renderProducts();
});

// sort by name
limitSubmitButton.addEventListener('click', () => {
  displayedProducts = fetchProducts.slice(0, limitNumberInput.value);
  renderProducts();
});

function renderProducts() {
  productList.innerHTML = '';

  displayedProducts.forEach((product) => {
    const productItem = document.createElement('li');

    productItem.textContent = product.title;

    productItem.addEventListener('mouseenter', () => {
      popupDescription.textContent = product.description;
      popupRating.textContent = product.rating;
      popupStock.textContent = product.stock;
      popupBrand.textContent = product.brand;

      popupPrice.innerHTML = `${product.price} $ <br> Discount: ${product.discountPercentage} %`;
      popupPanel.style.display = 'block';
    });

    productItem.addEventListener('mouseleave', () => {
      popupPanel.style.display = 'none';
    });

    // Add the drag and drop functionality to the items
    var idDragItem=0;
    var idTargetItem=0;
    productItem.setAttribute('draggable', true);
    productItem.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', e.target.innerHTML);
      idDragItem = fetchProducts.findIndex(
        (product) => product.title === e.target.innerHTML
      );
      console.log(idDragItem);
    });

    productItem.addEventListener('dragover', (e) => {
      e.preventDefault();
    });
    productItem.addEventListener('drop', async (e) => {
      e.preventDefault();
      idTargetItem = fetchProducts.findIndex(
        (product) => product.title === e.target.innerHTML
      );
      console.log(idTargetItem);
      swapElements(displayedProducts, idDragItem, idTargetItem);
      console.log(displayedProducts);
      renderProducts();
    });

    productList.appendChild(productItem);
  });
}

function swapElements(arr, i1, i2) {
  [arr[i1], arr[i2]] = [arr[i2], arr[i1]];
}
class Product {
  // title = 'DEFAULT';
  // imageUrl;
  // description;
  // price;
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }
}

class ShoppingCart {
  items = [];

  addProduct(product) {
    this.items.push(product);
    const sum = this.items
      .reduce((prev, curr) => prev + curr.price, 0)
      .toFixed(2);
    this.totalOutput.innerHTML = `<h2>Total: \$${sum}</h2>`;
  }

  render() {
    const cartElement = document.createElement('section');
    cartElement.innerHTML = `
			<h2>Total: \$${0}</h2>
			<button>Order Now!</button>
		`;
    cartElement.className = 'cart';
    this.totalOutput = cartElement.querySelector('h2');
    return cartElement;
  }
}

class ProductItem {
  constructor(product) {
    this.product = product;
  }
  addToCard() {
    App.addProductToCart(this.product);
  }
  render() {
    const productElement = document.createElement('li');
    const { title, price, description, imageUrl } = this.product;
    productElement.className = 'product-item';
    productElement.innerHTML = `
			<div>
				<img src='${imageUrl}' alt='${title}'>
				<div class='title__content'>
					<h2>${title}</h2>
					<h3>\$${price}</h3>
					<p>${description}</p>
					<button>Add to cart</button>
				</div>
			</div>
			`;
    const addCartButton = productElement.querySelector('button');
    addCartButton.addEventListener('click', this.addToCard.bind(this));
    return productElement;
  }
}

class ProductList {
  constructor() {}
  products = [
    new Product(
      'Pillow',
      'https://cdn.shopify.com/s/files/1/2509/4402/products/11-2019_S4A_Supreme_Pillow1_Standard_PDP_Retouched_300dpi_RGB_2x3_M.jpg?v=1583255150',
      'A soft pillow!',
      19.99
    ),
    new Product(
      'A Carpet',
      'https://www.ulcdn.net/images/products/216237/slide/1332x726/Cameroon_Carpet_1.jpg?1539757363',
      'A carpet which you might like - or not.',
      89.99
    ),
  ];
  render() {
    const productListElement = document.createElement('ul');
    productListElement.className = 'product-list';
    this.products.forEach(product => {
      const productItem = new ProductItem(product);
      const productElement = productItem.render();
      productListElement.append(productElement);
    });
    return productListElement;
  }
}

class Shop {
  render() {
    const renderHook = document.getElementById('app');

    this.shoppingCart = new ShoppingCart();
    const shoppingCartElement = this.shoppingCart.render();

    const productList = new ProductList();
    const productListElement = productList.render();

    renderHook.append(shoppingCartElement);
    renderHook.append(productListElement);
  }
}

class App {
  static shoppingCart;

  static init() {
    const shop = new Shop();
    shop.render();
    this.shoppingCart = shop.shoppingCart;
  }

  static addProductToCart(product) {
    this.shoppingCart.addProduct(product);
  }
}

App.init();

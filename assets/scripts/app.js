class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    // title = 'DEFAULT';
    // imageUrl;
    // description;
    // price;
  }
}

class ElementAttribute {
  constructor(attributeName, attributeValue) {
    this.name = attributeName;
    this.value = attributeValue;
  }
}

class Component {
  constructor(renderHookId, shouldRender = true) {
    this.hookId = renderHookId;
    if (shouldRender) {
      this.render();
    }
  }

  render() {}

  createRootElement(tag, cssClasses, attributes) {
    const rootElement = document.createElement(tag);
    if (cssClasses) {
      rootElement.className = cssClasses;
    }
    if (attributes && attributes.length > 0) {
      for (const attribute of attributes) {
        rootElement.setAttribute(attribute.name, attribute.value);
      }
    }
    document.getElementById(this.hookId).append(rootElement);
    return rootElement;
  }
}

class ShoppingCart extends Component {
  constructor(renderHookId) {
    super(renderHookId);
  }

  items = [];

  addProduct(product) {
    this.items.push(product);
    const sum = this.items
      .reduce((prev, curr) => prev + curr.price, 0)
      .toFixed(2);
    this.totalOutput.innerHTML = `<h2>Total: \$${sum}</h2>`;
  }

  render() {
    const cartElement = this.createRootElement('section', 'cart');
    cartElement.innerHTML = `
			<h2>Total: \$${0}</h2>
			<button>Order Now!</button>
		`;
    this.totalOutput = cartElement.querySelector('h2');
  }
}

class ProductItem extends Component {
  constructor(product, renderHookId) {
    super(renderHookId, false);
    this.product = product;
    this.render();
  }

  addToCard() {
    App.addProductToCart(this.product);
  }

  render() {
    const productElement = this.createRootElement('li', 'product-item');
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
  }
}

class ProductList extends Component {
  constructor(renderHookId) {
    super(renderHookId);
    this.fetchProducts();
  }

  products = [];

  fetchProducts() {
    this.products = [
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
    this.renderProducts();
  }

  renderProducts() {
    this.products.forEach(product => {
      new ProductItem(product, 'prod-list');
    });
  }

  render() {
    this.createRootElement('ul', 'product-list', [
      new ElementAttribute('id', 'prod-list'),
    ]);

    if (this.products && this.products.length > 0) {
      this.renderProducts();
    }
  }
}

class Shop extends Component {
  constructor() {
    super();
  }
  render() {
    this.shoppingCart = new ShoppingCart('app');
    new ProductList('app');
  }
}

class App {
  static shoppingCart;

  static init() {
    const shop = new Shop();
    this.shoppingCart = shop.shoppingCart;
  }

  static addProductToCart(product) {
    this.shoppingCart.addProduct(product);
  }
}

App.init();

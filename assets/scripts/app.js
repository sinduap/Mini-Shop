class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }
}

class ElementAttribute {
  constructor(attrName, attrValue) {
    this.name = attrName;
    this.value = attrValue;
  }
}

class Component {
  constructor(renderHookId, shouldRender = true) {
    this.renderHookId = renderHookId;
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
    if (attributes && attributes.length) {
      for (const attribute of attributes) {
        rootElement.setAttribute(attribute.name, attribute.value);
      }
    }
    document.getElementById(this.renderHookId).append(rootElement);
    return rootElement;
  }
}

class ProductList extends Component {
  constructor(renderHookId) {
    super(renderHookId);
    this.fetchProducts();
  }

  fetchProducts() {
    this.products = [
      new Product(
        'Pillow',
        'https://cdn.shopify.com/s/files/1/2509/4402/products/11-2019_S4A_Supreme_Pillow1_Standard_PDP_Retouched_300dpi_RGB_2x3_M.jpg?v=1583255150',
        'A soft pillow!',
        19.99
      ),
      new Product(
        'Carpet',
        'https://www.ulcdn.net/images/products/216237/slide/1332x726/Cameroon_Carpet_1.jpg?1539757363',
        'A carpet which you might like - or not.',
        89.99
      ),
    ];
    this.renderProducts();
  }

  renderProducts() {
    for (let product of this.products) {
      new ProductItem(product, 'prod-list');
    }
  }

  products = [];

  render() {
    this.createRootElement('ul', 'product-list', [
      new ElementAttribute('id', 'prod-list'),
    ]);
    if (this.products && this.products.length) {
      this.renderProducts();
    }
  }
}

class ShoppingCart extends Component {
  constructor(renderHookId) {
    super(renderHookId);
  }

  items = [];

  set cartItems(value) {
    this.items = value;
    this.totalOutput.innerHTML = `<h2>Total: \$${this.totalAmount}</h2>`;
  }

  get totalAmount() {
    const sum = this.items
      .reduce((total, curr) => curr.price + total, 0)
      .toFixed(2);
    return sum;
  }

  addProduct(product) {
    const updatedItem = [...this.items];
    updatedItem.push(product);
    this.cartItems = updatedItem;
  }

  orderProducts() {
    console.log(this.items);
    if (this.items.length) {
      let text = '';
      for (let item of this.items) {
        text += `
        item: ${item.title} price:\$${item.price}`;
      }
      alert(`You purchased 
      ${text}`);
    } else return;
  }

  render() {
    const shoppingCartElement = this.createRootElement('section', 'cart');
    shoppingCartElement.innerHTML = `
      <h2>Total: \$${0}</h2>
      <button>Order Now</button>
    `;
    const orderButton = shoppingCartElement.querySelector('button');
    orderButton.addEventListener('click', () => this.orderProducts());
    this.totalOutput = shoppingCartElement.querySelector('h2');
  }
}

class ProductItem extends Component {
  constructor(product, renderHookId) {
    super(renderHookId, false);
    this.product = product;
    this.render();
  }

  onAddToCart() {
    App.addProductToCart(this.product);
  }

  render() {
    const { imageUrl, title, description, price } = this.product;
    const productItemElement = this.createRootElement('li', 'product-item');
    productItemElement.innerHTML = `
      <div>
        <img src="${imageUrl}" alt="${title}" />
        <div class="product-item__content">
          <h2>${title}</h2>
          <h3>\$${price}</h3>
          <p>${description}</p>
          <button>Add to cart</button>
        </div>  
      </div>
    `;
    const addCartButton = productItemElement.querySelector('button');
    addCartButton.addEventListener('click', this.onAddToCart.bind(this));
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

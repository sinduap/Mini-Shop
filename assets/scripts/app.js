class Product {
  constructor(title, imgUrl, desc, price) {
    this.title = title;
    this.price = price;
    this.imgUrl = imgUrl;
    this.desc = desc;
  }
}

class Element {
  constructor(name, value) {
    this.name = name;
    this.value = value;
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
      for (const attr of attributes) {
        rootElement.setAttribute(attr.name, attr.value);
      }
    }
    document.getElementById(this.renderHookId).append(rootElement);
    return rootElement;
  }
}

class ShoppingCart extends Component {
  constructor(renderHookId) {
    super(renderHookId);
  }

  cartItems = [];

  addToCart(product) {
    this.cartItems.push(product);
    this.totalPrice = this.cartItems
      .reduce((total, currItem) => total + currItem.price, 0)
      .toFixed(2);
    this.totalOutput.innerHTML = `<h2>Total: \$${this.totalPrice}</h2>`;
  }

  orderProducts() {
    console.log(this.cartItems);
    let text = '';
    for (let item of this.cartItems) {
      text += `name:${item.title} : price:${item.price}\n`;
    }
    alert(`
    ${text}
    TOTAL : ${this.totalPrice}
    `);
  }

  render() {
    const cartEl = this.createRootElement('section', 'cart');
    cartEl.innerHTML = `
      <h2>Total: \$${0}</h2>
      <button>Order Now</button>
    `;
    const orderBtn = cartEl.querySelector('button');
    orderBtn.addEventListener('click', this.orderProducts.bind(this));
    this.totalOutput = cartEl.querySelector('h2');
  }
}

class ProductItem extends Component {
  constructor(product, renderHookId) {
    super(renderHookId, false);
    this.product = product;
    this.render();
  }

  addToCart() {
    App.addToCart(this.product);
  }

  render() {
    const prodEl = this.createRootElement('li', 'product-item');
    prodEl.innerHTML = `
        <div>
          <img src="${this.product.imgUrl}" alt="${this.product.title}"/>
          <div class="product-item__content">
            <h2>${this.product.title}</h2>
            <h3>${this.product.price}</h3>
            <p>${this.product.desc}</p>
            <button>Add to Cart</button>
          </div>
        </div>
      `;
    const addCartBtn = prodEl.querySelector('button');
    addCartBtn.addEventListener('click', this.addToCart.bind(this));
  }
}

class ProductList extends Component {
  constructor(renderHookId) {
    super(renderHookId);
    this.fetchProdutcs();
  }

  fetchProdutcs() {
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
    for (const prod of this.products) {
      new ProductItem(prod, 'prod-list');
    }
  }

  render() {
    this.createRootElement('ul', 'product-list', [
      new Element('id', 'prod-list'),
    ]);
    if (this.products && this.products.length) {
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

  static addToCart(product) {
    this.shoppingCart.addToCart(product);
  }
}

App.init();

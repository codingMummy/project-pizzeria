/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      // menuProduct jest właściwością
      menuProduct: '#template-menu-product',
      cartProduct: '#template-cart-product', // CODE ADDED
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input.amount', // CODE CHANGED
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
    // CODE ADDED START
    cart: {
      productList: '.cart__order-summary',
      toggleTrigger: '.cart__summary',
      totalNumber: `.cart__total-number`,
      totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
      subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
      deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
      form: '.cart__order',
      formSubmit: '.cart__order [type="submit"]',
      phone: '[name="phone"]',
      address: '[name="address"]',
    },
    cartProduct: {
      amountWidget: '.widget-amount',
      price: '.cart__product-price',
      edit: '[href="#edit"]',
      remove: '[href="#remove"]',
    },
    // CODE ADDED END
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
    // CODE ADDED START
    cart: {
      wrapperActive: 'active',
    },
    // CODE ADDED END
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }, // CODE CHANGED
    // CODE ADDED START
    cart: {
      defaultDeliveryFee: 20,
    },
    // CODE ADDED END
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
    // CODE ADDED START
    cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
    // CODE ADDED END
  };



  class AmountWidget {
    constructor(element) {
      const thisWidget = this;
      thisWidget.value = settings.amountWidget.defaultValue;
      thisWidget.getElements(element);
      thisWidget.setValue(thisWidget.value);
      console.log('AmountWidget:', thisWidget);
      console.log('constructor arguments', element);
      thisWidget.initActions();
    }

    getElements(element) {
      const thisWidget = this;

      thisWidget.element = element;
      thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
      thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);

    }

    setValue(value) {
      const thisWidget = this;

      const newValue = parseInt(value);

      if (newValue >= settings.amountWidget.defaultMin && newValue <= settings.amountWidget.defaultMax) {
        thisWidget.value = newValue;
        thisWidget.input.value = thisWidget.value;
        thisWidget.announce();
      } else {
        thisWidget.input.value = thisWidget.value;
      }


    }

    initActions() {
      const thisWidget = this;
      thisWidget.input.addEventListener('change', (e) => {
        e.preventDefault();
        console.log('co to jest', this);
        thisWidget.setValue(thisWidget.input.value);
      });
      thisWidget.linkIncrease.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('co to jest', this);
        thisWidget.setValue(parseInt(thisWidget.input.value) + 1);
      });
      thisWidget.linkDecrease.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('co to jest', this);
        thisWidget.setValue(parseInt(thisWidget.input.value) - 1);
      });
    }

    announce() {
      const thisWidget = this;
      const event = new CustomEvent('updated', {
        bubbles: true
      });
      thisWidget.element.dispatchEvent(event);
    }

  }


  class Cart {
    constructor(element) {
      const thisCart = this;
      thisCart.deliveryFee = settings.cart.defaultDeliveryFee;

      thisCart.products = [];

      thisCart.getElements(element);
      thisCart.initActions();
      console.log('new Cart', thisCart);


    }
    add(menuProduct) {
      const thisCart = this;

      const generatedHTML = templates.cartProduct(menuProduct);
      // console.log(generatedHTML);
      /* create element using utils.createElementFromHTML - tworzenie elementu DOM */
      /* CO TO JEST utils.createDOMFromHTML ???, element DOM zapisany jest jako właściwość instalacji */
      const element = utils.createDOMFromHTML(generatedHTML);
      thisCart.products.push(new CartProduct(menuProduct, element));


      /* add element to menu - dodawanie stworzonego elementu na stronę */
      // za pomocą metody appendChild
      thisCart.dom.productList.appendChild(element);

      console.log('adding product', menuProduct);
      thisCart.update();
    }

    update() {
      const thisCart = this;

      thisCart.totalNumber = 0;
      thisCart.subtotalPrice = 0;
      for (let product of thisCart.products) {
        thisCart.totalNumber += product.amount;
        thisCart.subtotalPrice += product.price;
      }
      thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;
      for (let key of thisCart.renderTotalsKeys) {
        for (let elem of thisCart.dom[key]) {
          elem.innerHTML = thisCart[key];
        }
      }
    }


    getElements(element) {
      const thisCart = this;

      thisCart.dom = {};

      thisCart.dom.wrapper = element;
      thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
      thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
      thisCart.renderTotalsKeys = ['totalNumber', 'totalPrice', 'subtotalPrice', 'deliveryFee'];

      for (let key of thisCart.renderTotalsKeys) {
        thisCart.dom[key] = thisCart.dom.wrapper.querySelectorAll(select.cart[key]);
      }
    }
    initActions() {
      const thisCart = this;
      thisCart.dom.toggleTrigger.addEventListener('click', function (e) {
        e.preventDefault();
        if (thisCart.dom.wrapper.classList.contains(classNames.cart.wrapperActive)) {
          thisCart.dom.wrapper.classList.remove(classNames.cart.wrapperActive);
        } else {
          thisCart.dom.wrapper.classList.add(classNames.cart.wrapperActive);
        }
      });
      thisCart.dom.productList.addEventListener('updated', function () {
        thisCart.update();
      });
      thisCart.dom.productList.addEventListener('remove', function (e) {
        thisCart.remove(e.detail.cartProduct);
      });
    }
    remove(cartProduct) {
      const thisCart = this;
      const index = thisCart.products.indexOf(cartProduct);
      console.log(index);
      console.log('przed', thisCart.products);
      thisCart.products = thisCart.products.splice(index, 1);
      console.log('po', thisCart.products);
      thisCart.dom.productList.removeChild(cartProduct.dom.wrapper);
      thisCart.update();
    }
  }


  class CartProduct {
    constructor(menuProduct, element) {
      const thisCartProduct = this;

      thisCartProduct.id = menuProduct.id;
      thisCartProduct.name = menuProduct.name;
      thisCartProduct.price = menuProduct.price;
      thisCartProduct.priceSingle = menuProduct.priceSingle;
      thisCartProduct.amount = menuProduct.amount;
      thisCartProduct.params = JSON.parse(JSON.stringify(menuProduct.params));

      thisCartProduct.getElements(element);
      thisCartProduct.initAmountWidget();
      thisCartProduct.initActions();
      console.log('new cartProduct', thisCartProduct);
      console.log('productData', menuProduct);
    }

    getElements(element) {
      const thisCartProduct = this;

      thisCartProduct.dom = {};

      thisCartProduct.dom.wrapper = element;
      thisCartProduct.dom.amountWidget = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.amountWidget);
      thisCartProduct.dom.price = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.price);
      thisCartProduct.dom.edit = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.edit);
      thisCartProduct.dom.remove = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.remove);
    }

    initAmountWidget() {
      const thisCartProduct = this;

      thisCartProduct.amountWidget = new AmountWidget(thisCartProduct.dom.amountWidget);
      thisCartProduct.amountWidget.setValue(thisCartProduct.amount);
      thisCartProduct.dom.amountWidget.addEventListener('updated', () => {
        thisCartProduct.amount = thisCartProduct.amountWidget.value;
        thisCartProduct.price = thisCartProduct.priceSingle * thisCartProduct.amount;
        thisCartProduct.dom.price.textContent = thisCartProduct.price;
      });
    }
    remove() {
      const thisCartProduct = this;
      const event = new CustomEvent('remove', {
        bubbles: true,
        detail: {
          cartProduct: thisCartProduct
        }
      });
      thisCartProduct.dom.wrapper.dispatchEvent(event);
    }
    initActions() {
      const thisCartProduct = this;
      thisCartProduct.dom.edit.addEventListener('click', function (e) {
        e.preventDefault();
      });
      thisCartProduct.dom.remove.addEventListener('click', function (e) {
        e.preventDefault();
        thisCartProduct.remove();
      });
    }
  }

  const app = {


    initMenu: function () {

      const thisApp = this;

      // console.log('thisApp.data:', thisApp.data);

      for (let productDate in thisApp.data.products) {
        new Product(productDate, thisApp.data.products[productDate]);
      }
    },
    initData: function () {
      const thisApp = this;

      thisApp.data = dataSource;
    },

    initCart: function () {
      const thisApp = this;

      const cartElem = document.querySelector(select.containerOf.cart);
      thisApp.cart = new Cart(cartElem);
    },

    init: function () {
      const thisApp = this;
      // console.log('*** App starting ***');
      // console.log('thisApp:', thisApp);
      // console.log('classNames:', classNames);
      // console.log('settings:', settings);
      // console.log('templates:', templates);

      thisApp.initData();
      thisApp.initMenu();
      thisApp.initCart();
    },
  };

  class Product {

    // argumenty construktor są deklarowane w ten sam sposób co argument funkcji
    constructor(id, data) {
      const thisProduct = this;

      // this jest zapisywany w stałej thisProduct; linia: 61
      thisProduct.id = id;
      thisProduct.data = data;

      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.initAmountWidget();
      thisProduct.processOrder();

      console.log('new Product:', thisProduct);
    }


    renderInMenu() {
      const thisProduct = this;

      /*generate HTML based on template - generowanie HTML*/
      const generatedHTML = templates.menuProduct(thisProduct.data);
      // console.log(generatedHTML);

      /* create element using utils.createElementFromHTML - tworzenie elementu DOM */
      /* CO TO JEST utils.createDOMFromHTML ???, element DOM zapisany jest jako właściwość instalacji */
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);

      /* find menu container - znajdz kontener menu */
      // selektor kontenera produktów zapisany jest w select.containerOf.menu
      // menuCountainer - zapisane manu
      const menuCountainer = document.querySelector(select.containerOf.menu);

      /* add element to menu - dodawanie stworzonego elementu na stronę */
      // za pomocą metody appendChild
      menuCountainer.appendChild(thisProduct.element);
    }


    getElements() {
      const thisProduct = this;

      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      // console.log(thisProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);

      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
      thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
    }

    initAccordion() {
      const thisProduct = this;



      thisProduct.accordionTrigger.addEventListener('click', function () {
        // console.log('clicked');

        const active = document.querySelector(select.all.menuProductsActive);
        if (active != null) {
          active.classList.remove(classNames.menuProduct.wrapperActive);
          if (active != thisProduct.element) {
            thisProduct.element.classList.add(classNames.menuProduct.wrapperActive);
          }
        } else {
          thisProduct.element.classList.add(classNames.menuProduct.wrapperActive);
        }

        /* find the clickable trigger (the element that should react to clicking) - znajdź klikalny przycisk (element, który powinien zareagować na kliknięcie)  */
        /* START: click event listener to trigger; co to jest trigger, toggle */
        /*  prevent default action for event */
        /*  toggle active class on element of thisProduct */
        /*  find all active products */
        /*  START LOOP: for each active product */
        /*    START: if the active product isn't the element of thisProduct */
        /*        remove class active for the active product */
        /*    END: if the active product isn't the element of thisProduct */
        /*  END LOOP: for each active product */
        /* END: click event listener to trigger */


      });


    }
    initOrderForm() {
      const thisProduct = this;
      // console.log(thisProduct);

      thisProduct.form.addEventListener('submit', function (event) {
        event.preventDefault();
        thisProduct.processOrder();
      });

      for (let input of thisProduct.formInputs) {
        input.addEventListener('change', function () {
          thisProduct.processOrder();
        });
      }

      thisProduct.cartButton.addEventListener('click', function (event) {
        event.preventDefault();
        thisProduct.processOrder();
        thisProduct.addToCart();
      });
    }
    addToCart() {
      const thisProduct = this;
      thisProduct.name = thisProduct.data.name;
      thisProduct.amount = thisProduct.amountWidget.value;

      app.cart.add(thisProduct);
    }

    initAmountWidget() {
      const thisProduct = this;

      thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
      thisProduct.amountWidgetElem.addEventListener('updated', () => {
        thisProduct.processOrder();
      });



    }


    processOrder() {
      const thisProduct = this;
      console.log(thisProduct);
      // formData - opcje zaznaczone
      const formData = utils.serializeFormToObject(thisProduct.form);
      console.log('formData', formData);
      // console.log(thisProduct.data['params']);

      let productPrice = thisProduct.data['price'];
      console.log('productPrice', productPrice);
      const params = thisProduct.data['params'];

      thisProduct.params = {};

      for (let productGroup in params) {
        // console.log(productGroup);
        // console.log(params[productGroup]);
        const options = params[productGroup]['options'];

        for (let productName in options) {
          // console.log(productName);
          const price = options[productName]['price'];
          console.log('price', price);
          const defaults = options[productName]['default'];
          console.log('defaults', defaults);
          const optionSelected = formData[productGroup] != undefined && formData[productGroup].indexOf(productName) != -1;
          // pętla poniżej iteruje po parametrach
          if (defaults == undefined && optionSelected) {
            productPrice = productPrice + price;
            // pętla poniżej iteruje po opcjach parametru
          } else if (defaults == true && (formData[productGroup] == undefined || formData[productGroup].indexOf(productName) == -1)) {
            productPrice = productPrice - price;
          }
          if (optionSelected) {
            if (!thisProduct.params[productGroup]) {
              thisProduct.params[productGroup] = {
                label: params[productGroup].label,
                options: {},
              };
            }
            thisProduct.params[productGroup].options[productName] = options[productName].label;
          }
          const imgs = thisProduct.imageWrapper.querySelectorAll('.' + productGroup + '-' + productName);
          // console.log('picture', imgs);
          // console.log('.' + productGroup + '-' + productName);
          for (let img of imgs) {
            console.log(img);
            if (formData[productGroup] != undefined && formData[productGroup].indexOf(productName) != -1) {
              img.classList.add(classNames.menuProduct.imageVisible);
            } else {
              img.classList.remove(classNames.menuProduct.imageVisible);
            }

          }
        }
      }
      console.log('final price', productPrice);
      const htmlPrice = thisProduct.element.querySelector(select.menuProduct.priceElem);
      thisProduct.priceSingle = productPrice;
      thisProduct.price = productPrice * thisProduct.amountWidget.value;
      htmlPrice.textContent = thisProduct.price;
      console.log('productParams', thisProduct.params);
    }

  }

  app.init();
}

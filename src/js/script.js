/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      // menuProduct jest właściwością
      menuProduct: '#template-menu-product',
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
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };

  const templates = {
    // menuProduct jest tworzona za pomocą biblioteki Handlebars
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };

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

    init: function () {
      const thisApp = this;
      // console.log('*** App starting ***');
      // console.log('thisApp:', thisApp);
      // console.log('classNames:', classNames);
      // console.log('settings:', settings);
      // console.log('templates:', templates);

      thisApp.initData();
      thisApp.initMenu();
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
    }


    initAccordion() {
      const thisProduct = this;



      thisProduct.accordionTrigger.addEventListener('click', function () {
        // console.log('clicked');

        const active = document.querySelector(select.all.menuProductsActive);
        if (active != null) {
          active.classList.remove('active');
          if (active != thisProduct.element) {
            thisProduct.element.classList.add('active');
          }
        } else {
          thisProduct.element.classList.add('active');
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
      console.log(thisProduct);

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
      });
    }


    processOrder() {
      const thisProduct = this;
      console.log(thisProduct);

      const formData = utils.serializeFormToObject(thisProduct.form);
      console.log('formData', formData);
      const allFormInput = document.
      console.log(thisProduct.formInputs);
    }

  }

  app.init();
}

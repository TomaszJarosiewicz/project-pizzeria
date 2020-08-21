import { Product } from './components/Product.js';
import { Cart } from './components/Cart.js';
import { Booking } from './components/Booking.js';
import { select, settings, classNames } from './settings.js';

const app = {
  initCart: function(){
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);
    thisApp.productList.addEventListener('add-to-cart', function(event){
      app.cart.add(event.detail.product);
    });
  },

  initMenu: function(){
    const thisApp = this;

    for(let productData in thisApp.data.products){
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
  },

  initData: function(){
    const thisApp = this;

    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.product;

    fetch(url)
      .then(function(rawResponse){
        return rawResponse.json();
      })
      .then(function(parsedResponse){
        console.log('parsedResponse', parsedResponse);
        thisApp.data.products = parsedResponse;
        thisApp.initMenu();
      });

    console.log('thisApp.data', JSON.stringify(thisApp.data));
  },

  initPages: function(){
    const thisApp = this;

    thisApp.pages = Array.from(document.querySelector(select.containerOf.pages).children);
    thisApp.navLinks = Array.from(document.querySelectorAll(select.nav.links));
    for(let link of thisApp.navLinks){
      link.addEventListener('click', function(event){
        const clickedElement = this;
        event.preventDefault();

        const id = clickedElement.getAttribute('href').replace('#', '');
        console.log('Clicked Id', id);
        thisApp.activePage(id);
      });
    }

    let pagesMatchingHash = [];
    thisApp.activePage(pagesMatchingHash.length ? pagesMatchingHash[0].id : thisApp.pages[0].id);
  },

  activePage: function(pageId){
    const thisApp = this;
    window.location.hash = '#/' + pageId;
    console.log('Window.location', window.location.hash = '#/' + pageId);

    for(let link of thisApp.navLinks){
      link.classList.toggle(classNames.nav.active, link.getAttribute('href') == '#' + pageId);
      console.log('Link', link);
    }
    for(let page of thisApp.pages){
      page.classList.toggle(classNames.nav.active, page.id == pageId);
      console.log('Page', page);
    }
  },

  initBooking: function(){
    const thisApp = this;

    thisApp.bookingWrapper = document.querySelector(select.containerOf.booking);
    console.log('thisApp.bookingWrapper', thisApp.bookingWrapper);
    thisApp.booking = new Booking(thisApp.bookingWrapper);
  },

  init: function(){
    const thisApp = this;

    thisApp.initPages();
    thisApp.initData();
    thisApp.initCart();
    thisApp.initBooking();
  },
};

app.init();


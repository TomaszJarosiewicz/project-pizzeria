import { select, classNames, templates } from '../settings.js';
import { utils } from '../utils.js';
import { AmountWidget } from './AmountWidget';

export class Product {
  constructor(id, data) {
    const thisProduct = this;
    thisProduct.id = id;
    thisProduct.data = data;

    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();
  }

  renderInMenu(){
    const thisProduct = this;
    const generateHTML = templates.menuProduct(thisProduct.data);
    thisProduct.element = utils.createDOMFromHTML(generateHTML);
    const menuContainer = document.querySelector(select.containerOf.menu);
    menuContainer.appendChild(thisProduct.element);
  }

  getElements(){
    const thisProduct = this;

    thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form); // .product__order
    thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs); // All 'input, select'
    thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    // [href="#add-to-cart"]
    thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    // .product__total-price .price
    thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper); //.product__images
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);

  }

  initAccordion(){
    const thisProduct = this;
    const clickableTrigger = thisProduct.accordionTrigger;

    clickableTrigger.addEventListener('click', function(event) {
      event.preventDefault();

      thisProduct.element.classList.toggle(classNames.menuProduct.wrapperActive);
      const allActiveProducts = document.querySelectorAll('.product.active');

      for(let allActiveProduct of allActiveProducts){
        if(allActiveProduct != thisProduct.element){
          allActiveProduct.classList.remove(classNames.menuProduct.wrapperActive);
        }
      }
    });
  }

  initOrderForm(){
    const thisProduct = this;
    thisProduct.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisProduct.processOrder();
    });

    for(let input of thisProduct.formInputs){
      input.addEventListener('change', function(){
        thisProduct.processOrder();
      });
    }

    thisProduct.cartButton.addEventListener('click', function(event){
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });
  }

  processOrder(){
    const thisProduct = this;
    thisProduct.params = {};
    const formData = utils.serializeFormToObject(thisProduct.form);
    let price = thisProduct.data.price;

    for(let paramId in thisProduct.data.params){

      const param = thisProduct.data.params[paramId];

      for(let optionId in param.options){
        const option = param.options[optionId];
        const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1;

        if(optionSelected && !option.default){
          price += option.price;
        } else if(!optionSelected === option.default){
          price -= option.price;
        }

        const images = thisProduct.imageWrapper.querySelectorAll('.' + paramId + '-' + optionId);

        if(optionSelected){
          if(!thisProduct.params[paramId]){
            thisProduct.params[paramId] = {
              label: param.label,
              options: {},
            };
          }

          thisProduct.params[paramId].options[optionId] = option.label;

          for(let image of images){
            image.classList.add(classNames.menuProduct.imageVisible);
          }
        } else {
          for(let image of images){
            image.classList.remove(classNames.menuProduct.imageVisible);
          }
        }
      }
    }

    thisProduct.priceSingle = price;
    thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value;
    thisProduct.priceElem.innerHTML = thisProduct.price;
  }

  initAmountWidget(){
    const thisProduct = this;
    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
    thisProduct.amountWidgetElem.addEventListener('updated', function(){
      thisProduct.processOrder();
    });
  }

  addToCart(){
    const thisProduct = this;

    thisProduct.name = thisProduct.data.name;
    thisProduct.amount = thisProduct.amountWidget.value;
    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct,
      },
    });
    thisProduct.element.dispatchEvent(event);
  }
}

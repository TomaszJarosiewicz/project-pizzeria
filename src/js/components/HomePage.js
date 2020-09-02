import { select, templates, classNames } from '../settings.js';
import { utils } from '../utils.js';

export class Home {
  constructor(){
    const thisHome = this;

    thisHome.render(thisHome.homeWrapper);
    thisHome.initPage();
  }

  render(element){
    const thisHome = this;

    thisHome.dom = {};
    thisHome.dom.wrapper = element;

    const generateHTML = templates.homePage();
    thisHome.element = utils.createDOMFromHTML(generateHTML);
    const homeContainer = document.querySelector(select.containerOf.mainPage);
    homeContainer.appendChild(thisHome.element);
  }

  initPage(){
    const thisHome = this;

    thisHome.pages = Array.from(document.querySelector(select.containerOf.pages).children);
    thisHome.homeLinks = Array.from(document.querySelectorAll(select.nav.homeLinks));

    for(let link of thisHome.homeLinks){
      link.addEventListener('click', function(event){
        const clickedElement = this;
        event.preventDefault();

        const id = clickedElement.getAttribute('href').replace('#', '');
        console.log('Clicked Id', id);
        thisHome.activePage(id);
      });
    }
  }

  activePage(pageId){
    const thisHome = this;

    thisHome.isDisabled = document.querySelector(select.containerOf.cart);
    window.location.hash = '#/' + pageId;
    console.log('Window.location', window.location.hash = '#/' + pageId);

    if(window.location.hash === '#/' + 'home'){
      thisHome.isDisabled.classList.add(classNames.cart.disabledCart);
      console.log('test');
    } else {
      if(window.location.hash === '#/' + 'order' || window.location.hash === '#/' + 'booking'){
        thisHome.isDisabled.classList.remove(classNames.cart.enabledCart);
      }
    }

    for(let link of thisHome.homeLinks){
      link.classList.toggle(classNames.nav.active, link.getAttribute('href') == '#' + pageId);
      console.log('Link', link);
    }
    for(let page of thisHome.pages){
      page.classList.toggle(classNames.nav.active, page.id == pageId);
      console.log('Page', page);
    }
  }
}

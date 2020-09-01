import { select, templates } from '../settings.js';
import { utils } from '../utils.js';

export class Home {
  constructor(){
    const thisHome = this;

    thisHome.render(thisHome.homeWrapper);
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
}

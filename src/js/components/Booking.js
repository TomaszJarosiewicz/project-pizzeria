import { select, templates } from '../settings.js';
import { utils } from '../utils.js';
import { AmountWidget } from './AmountWidget.js';

export class Booking {
  constructor(){
    const thisBooking = this;

    thisBooking.render(thisBooking.bookingWrapper);
    thisBooking.initWidget();
  }

  render(element){
    const thisBooking = this;

    thisBooking.dom = {};
    thisBooking.dom.wrapper = element;

    const generateHTML = templates.bookingWidget();
    thisBooking.element = utils.createDOMFromHTML(generateHTML);
    const bookingContainer = document.querySelector(select.containerOf.booking);
    bookingContainer.appendChild(thisBooking.element);

    thisBooking.dom.wrapper = thisBooking.element;
    console.log('thisBooking.dom.wrapper', thisBooking.dom.wrapper);
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
  }

  initWidget(){
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);

    console.log(thisBooking);

  }
}

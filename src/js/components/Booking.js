import { select, templates, settings } from '../settings.js';
import { utils } from '../utils.js';
import { AmountWidget } from './AmountWidget.js';
import { DatePicker } from './DatePicker.js';
import { HourPicker } from './HourPicker.js';

export class Booking {
  constructor(){
    const thisBooking = this;

    thisBooking.render(thisBooking.bookingWrapper);
    thisBooking.initWidget();
    thisBooking.getData();
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
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);
    // thisBooking.bookings = {};
  }

  initWidget(){
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
  }

  getData(){
    const thisBooking = this;

    const startEndDates = {};
    startEndDates[settings.db.dateStartParamKey] = utils.dateToStr(thisBooking.datePicker.minDate);
    startEndDates[settings.db.dateEndParamKey] = utils.dateToStr(thisBooking.datePicker.maxDate);

    const endDate = {};
    endDate[settings.db.dateEndParamKey] = startEndDates[settings.db.dateEndParamKey];

    const params = {
      booking: utils.queryParams(startEndDates),
      eventsCurrent: settings.db.notRepeatParam + '&' + utils.queryParams(startEndDates),
      eventsRepeat: settings.db.repeatParam + '&' + utils.queryParams(endDate),
    };

    console.log('getData params', params);

    const urls = {
      booking: settings.db.url + '/' + settings.db.booking + '?' + params.booking,
      eventsCurrent: settings.db.url + '/' + settings.db.event + '?' + params.eventsCurrent,
      eventsRepeat: settings.db.url + '/' + settings.db.event + '?' + params.eventsRepeat,
    };

    console.log('getData urls', urls);

    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function([bookingsResponse, eventsCurrentResponse, eventsRepeatResponse]){
        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(function([bookings, eventsCurrent, eventsRepeat]){
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });
  }

  parseData(bookings, eventsCurrent, eventsRepeat){
    const thisBooking = this;
    console.log(bookings, eventsCurrent, eventsRepeat);
    thisBooking.booked = {};

    console.log('thisBooking.booked', thisBooking.booked);
    const minDate = thisBooking.datePicker.minDate;
    const maxDate = thisBooking.datePicker.maxDate;

    for(let eventCurrent of eventsCurrent){
      thisBooking.makeBooked(eventCurrent.date, eventCurrent.hour, eventCurrent.duration, eventCurrent.table);
    }

    for(let book of bookings){
      thisBooking.makeBooked(book.date, book.hour, book.duration, book.table);
    }

    for(let eventRepeat of eventsRepeat){
      if(eventRepeat.repeat == 'daily'){
        for(let i = minDate; i <= maxDate; i = utils.addDays(i, 1)){
          thisBooking.makeBooked(utils.dateToStr(i), eventRepeat.hour, eventRepeat.duration, eventRepeat.table);
        }
      }
    }
  }

  makeBooked(date, hour, duration, table){
    const thisBooking = this;

    const startHour = utils.hourToNumber(hour);

    if(typeof thisBooking.booked[date] === 'undefined'){
      thisBooking.booked[date] = {};
    }

    for(let i = startHour; i < startHour + duration; i += 0.5){
      if(typeof thisBooking.booked[date][i] === 'undefined'){
        thisBooking.booked[date][i] = [];
      }
      thisBooking.booked[date][i].push(table);
    }
  }

}



import { utils } from '../utils.js';
import { select, settings } from '../settings.js';
import { BaseWidget } from './BaseWidget.js';

export class DatePicker extends BaseWidget{
  constructor(wrapper){
    super(wrapper, utils.dateToStr(new Date()));

    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);
    thisWidget.initPlugin();
    thisWidget.dom.input.value = utils.dateToStr(new Date());
  }

  initPlugin(){
    const thisWidget = this;

    thisWidget.minDate = new Date(thisWidget.value);
    thisWidget.maxDate = utils.addDays(thisWidget.minDate, settings.datePicker.maxDaysInFuture);
    /* eslint-disable */
    flatpickr(thisWidget.dom.input, {
      defaultDate: thisWidget.minDate,
      minDate: thisWidget.minDate,
      maxDate: thisWidget.maxDate,
      locale: {
        firstDayOfWeek: 1 // start week on Monday
      },
      disable: [
        function(date) {
          // return true to disable
          return (date.getDay() === 1);
        }
      ],
      onChange: function(dateStr) {
        thisWidget.value = dateStr;
      },
    });
  }

  parseValue(){
    const thisWidget = this;

    return thisWidget.wrapper;
  }

  isValid(){

    return true;
  }

  renderValue(){
    return;
  }
}

import {BaseWidget} from './BaseWidget.js';
import {utils} from '../utils.js';
import {select, templates} from '../settings.js';
 
export class DatePicker extends BaseWidget{
    constructor(wrapper){
        super (wrapper, utils.dateToStr(new Date()));
        const thisWidget = this;
        thisWidget.dom = {};
        thisWidget.dom.wrapper  = wrapper;
        thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.datePicker.input);
 
        thisWidget.initPlugin();
    }
 
    initPlugin(){
        const thisWidget = this;
 
        thisWidget.minDate = new Date(thisWidget.value);
        thisWidget.maxDate = utils.addDays(thisWidget.minDate);
 
        flatpickr(thisWidget.dom.input, {
            defaultDate: thisWidget.minDate,
            minDate: thisWidget.minDate,
            maxDate: thisWidget.maxDate,
            "disable": [
                function(date) {
                    // return true to disable
                    return (date.getDay() === 0 || date.getDay() === 6);
       
                }
            ],
            "locale": {
                "firstDayOfWeek": 1 // start week on Monday
            }
        });
    }
 
    parseValue(newValue){
 
        /* metoda nie może pozostać domyślna, ponieważ wartością tego pluginu nie będzie liczba, trzeba ją nadpisać, aby zwracała argument, nie wykonując na nim żadnych operacji */
        return newValue;
    }
 
    isValid(){
        return true;
    }
 
    renderValue(){
 
    }
}
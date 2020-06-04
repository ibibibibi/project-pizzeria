import {AmountWidget} from "./AmountWidget.js";
import {DatePicker} from './DatePicker.js';
import {HourPicker} from './HourPicker.js';
import {select, templates} from '../settings.js';
import {utils} from '../utils.js';
 
 
export class Booking{
    constructor(element){
        const thisBooking = this;
 
        thisBooking.render(element);
        thisBooking.initWidgets();
    }
 
    render(element){
        const thisBooking = this;
 
        const generatedHTML = templates.bookingWidget();
        thisBooking.dom = {};
        thisBooking.dom.wrapper = element;
 
        const generatedDOM = utils.createDOMFromHTML(generatedHTML);
        thisBooking.dom.wrapper.appendChild(generatedDOM);
 
        thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
        thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
        thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.datePicker.wrapper);
        thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.hourPicker.wrapper);
    }
 
    initWidgets(){
        const thisBooking = this;
 
        thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
        thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
        thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
        thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
    }
}
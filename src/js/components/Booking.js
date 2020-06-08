import {AmountWidget} from "./AmountWidget.js";
import {DatePicker} from './DatePicker.js';
import {HourPicker} from './HourPicker.js';
import {select, templates, settings, classNames} from '../settings.js';
import {utils} from '../utils.js';
 
 
export class Booking{
    constructor(element){
        const thisBooking = this;
 
        thisBooking.render(element);
        thisBooking.initWidgets();
        thisBooking.getData();
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
        thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
    }
 
    initWidgets(){
        const thisBooking = this;
 
        thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
        thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
        thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
        thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);

        thisBooking.dom.wrapper.addEventListener('updated', function(){
            thisBooking.updateDOM();
            }
          );
    }

    updateDOM(){
        const thisBooking = this;
        console.log('whatever');

        thisBooking.date = thisBooking.datePicker.value;

        thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);    

        for(let table of thisBooking.dom.tables){
            let tableId = table.getAttribute(settings.booking.tableIdAttribute);

            if (!isNaN(tableId)) {
                tableId = parseInt(tableId);
            }

            if(typeof thisBooking.booked[thisBooking.date] !== 'undefined' && typeof thisBooking.booked[thisBooking.date][thisBooking.hour] !== 'undefined' && thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)){
                table.classList.add(classNames.booking.tableBooked);
            }else{
                table.classList.remove(classNames.booking.tableBooked);
            }
        }
    }

    parseData(){
        const thisBooking = this;

        thisBooking.updateDOM();
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
            }
        );
    }

    parseData(bookings, eventsCurrent, eventsRepeat){
        const thisBooking = this;

        thisBooking.booked = {};

        for (let event of thisBooking.booked){

            thisBooking.makeBooked();
        }
    }
}
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
        thisBooking.dom.selectedTable = null;
 
        thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
        thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
        thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.datePicker.wrapper);
        thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.hourPicker.wrapper);
        thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
        thisBooking.dom.phone = thisBooking.dom.wrapper.querySelectorAll(select.booking.phone);
        thisBooking.dom.address = thisBooking.dom.wrapper.querySelectorAll(select.booking.address);
        thisBooking.dom.starters = element.querySelectorAll(select.booking.starter);
        thisBooking.dom.bookTable = thisBooking.dom.wrapper.querySelector(select.booking.bookTable);
    }
 
    initWidgets(){
        const thisBooking = this;
 
        thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
        thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
        thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
        thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);

        // thisBooking.dom.wrapper.addEventListener('updated', function(){
        //     thisBooking.updateDOM();
        //     }
        //   );

        for (let table of thisBooking.dom.tables){
            table.addEventListener('click', function(){
              console.log('clicked table', table);
              event.preventDefault();
              thisBooking.dom.selectedTable = table.getAttribute(settings.booking.tableIdAttribute);
              for (let t of thisBooking.dom.tables){
                t.classList.remove(classNames.booking.tableSelected);
              }
              table.classList.add(classNames.booking.tableSelected);
            });
        }
      
        for (let table of thisBooking.dom.tables){
            thisBooking.dom.datePicker.addEventListener('updated', function(){
                thisBooking.updateDOM();
                table.classList.remove(classNames.booking.tableSelected);
                table.classList.add(classNames.booking.tableBooked);
            });
        }
    
        thisBooking.dom.hourPicker.addEventListener('updated', function(){
        thisBooking.updateDOM();
        });
    
        thisBooking.dom.wrapper.addEventListener('submit', function(){
        event.preventDefault();
        thisBooking.getData();
        thisBooking.sendBooking();
        alert('Hurray! Your reservation is successfully submitted.');
        });
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

        //console.log('getData params', params);

        const urls = {
            booking: settings.db.url + '/' + settings.db.booking + '?' + params.booking,
            eventsCurrent: settings.db.url + '/' + settings.db.event + '?' + params.eventsCurrent,
            eventsRepeat: settings.db.url + '/' + settings.db.event + '?' + params.eventsRepeat,
          };
          
        //console.log('getData urls', urls);

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

        //console.log(thisBooking.booked, '@@@', bookings, eventsCurrent);

        for (let item of bookings){

            thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
        }

        for (let item of eventsCurrent){
            thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
        }

        const minDate = thisBooking.datePicker.minDate;

        const maxDate = thisBooking.datePicker.maxDate;

        for (let item of eventsRepeat){
            if(item.repeat == 'daily'){
                for(let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)){
                    thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
                }
            }
        }

        thisBooking.updateDOM();
    }

    makeBooked(date, hour, duration, table){
        //console.log("MAKE BOOKED");

        const thisBooking = this;
        if (typeof thisBooking.booked[date] == 'undefined') {
          thisBooking.booked[date] = {};
        }
    
        const startHour = utils.hourToNumber(hour);

        parseFloat(hour);
        parseFloat(duration);
    
        for (let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5) {
          if (typeof thisBooking.booked[date][hourBlock] == 'undefined') {
            thisBooking.booked[date][hourBlock] = [];
          }
          
          thisBooking.booked[date][hourBlock].push(table);
        }
    }

    updateDOM(){
        const thisBooking = this;
        //console.log('whatever');

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

    sendBooking(){
        const thisBooking = this;

        const url = settings.db.url + '/' + settings.db.booking;

        const payload = {
            date: thisBooking.date,
            hour: utils.numberToHour(thisBooking.hour),
            //table: thisBooking.tableId,
            table: [],
            duration: thisBooking.hoursAmount.value,
            ppl: thisBooking.peopleAmount.value,
            phone: thisBooking.dom.phone.value,
            address: thisBooking.dom.address.value,
            starters: [],
        };

        for(let starter of thisBooking.dom.starters){
            if(starter.checked == true){
                payload.starters.push(starter.value);
            }
          };

        for(let table of thisBooking.dom.tables){
            if(table.classList.contains('selected')){
                thisBooking.tableId = table.getAttribute(settings.booking.tableIdAttribute);
                
                if(!isNaN(thisBooking.tableId)){
                thisBooking.tableId = parseInt(thisBooking.tableId);
                }
            payload.table.push(thisBooking.tableId);
            }
        };

        const options = {
        method: 'POST',
        headers: {
            'Content-Type':'application/json',
        },
        body: JSON.stringify(payload),
        };

        fetch(url, options)
        .then(function(response){
            return response.json();
        }).then(function(parsedResponse){
            console.log('parsedResponseBooking', parsedResponse);
        });
    }
}
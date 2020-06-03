import {select, settings} from '../settings.js';
import {BaseWidget} from './BaseWidget.js';

export class AmountWidget extends BaseWidget{
    constructor(wrapper){
      super(wrapper, settings.amountWidget.defaultValue);

      const thisWidget = this;

      thisWidget.getElements();
      thisWidget.value = settings.amountWidget.defaultValue;
      // thisWidget.setValue(thisWidget.input.value);
      thisWidget.initActions();

      //console.log('amountWidget:',thisWidget);
      //console.log('constructor argument:', element);
    }

    /* FIND WIDGET ELEMENTS */
    getElements(){
      const thisWidget = this;

      thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
      thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
    }

    /* SET INITIAL VALUE */
    // setValue(value){
    //   const thisWidget = this;

    //   const newValue = parseInt(value);

    //   if(newValue != thisWidget.value && newValue >= settings.amountWidget.defaultMin && newValue <= settings.amountWidget.defaultMax){
    //     thisWidget.value = newValue;
    //     thisWidget.announce();
    //   };

    //   thisWidget.input.value = thisWidget.value;
    // }

    isValid(newValue){
      return !isNaN(newValue) && newValue >= settings.amountWidget.defaultMin && newValue <= settings.amountWidget.defaultMax;
    }

    initActions(){
      const thisWidget = this;

      /* ADD EVENT LISTENER 1 - CHANGE */
      thisWidget.dom.input.addEventListener('change', function(){
        //thisWidget.setValue(thisWidget.input.value);
        thisWidget.value = thisWidget.dom.input.value;
        console.log(thisWidget.input.value);
        }
      );
      
      /* ADD EVENT LISTENER 2 - CLICK PLUS ONE */
      thisWidget.dom.linkDecrease.addEventListener('click', function(event){
        event.preventDefault();
        //thisWidget.setValue(thisWidget.value - 1);
        thisWidget.value = parseInt(thisWidget.dom.input.value) -1;
        }
      );

      /* ADD EVENT LISTENER 3 - CLICK MINUS ONE */
      thisWidget.dom.linkIncrease.addEventListener('click', function(event){
        event.preventDefault();
        //thisWidget.setValue(thisWidget.value + 1);
        thisWidget.value = parseInt(thisWidget.dom.input.value) +1;
      }
      );
    }

    renderValue(){
      const thisWidget = this;

      thisWidget.dom.input.value = thisWidget.value;
    }

    // announce(){
    //   const thisWidget = this;

    //   const event = new CustomEvent('updated', {
    //     bubbles: true
    //   });
    //   thisWidget.dom.wrapper.dispatchEvent(event);
    // }
  }
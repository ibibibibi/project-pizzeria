import {select, settings} from '../settings.js';

export class AmountWidget{
    constructor(element){
      const thisWidget = this;

      thisWidget.getElements(element);
      thisWidget.value = settings.amountWidget.defaultValue;
      thisWidget.setValue(thisWidget.input.value);
      thisWidget.initActions();

      //console.log('amountWidget:',thisWidget);
      //console.log('constructor argument:', element);
    }

    /* FIND WIDGET ELEMENTS */
    getElements(element){
      const thisWidget = this;

      thisWidget.element = element;
      thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
      thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
    }

    /* SET INITIAL VALUE */
    setValue(value){
      const thisWidget = this;

      const newValue = parseInt(value);

      if(newValue != thisWidget.value && newValue >= settings.amountWidget.defaultMin && newValue <= settings.amountWidget.defaultMax){
        thisWidget.value = newValue;
        thisWidget.announce();
      };

      thisWidget.input.value = thisWidget.value;
    }

    initActions(){
      const thisWidget = this;

      /* ADD EVENT LISTENER 1 - CHANGE */
      thisWidget.input.addEventListener('change', function(){
        thisWidget.setValue(thisWidget.input.value);
        }
      );
      
      /* ADD EVENT LISTENER 2 - CLICK PLUS ONE */
      thisWidget.linkDecrease.addEventListener('click', function(event){
        event.preventDefault();
        thisWidget.setValue(thisWidget.value - 1);
        }
      );

      /* ADD EVENT LISTENER 3 - CLICK MINUS ONE */
      thisWidget.linkIncrease.addEventListener('click', function(event){
        event.preventDefault();
        thisWidget.setValue(thisWidget.value + 1);
      }
      );
    }

    announce(){
      const thisWidget = this;

      const event = new CustomEvent('updated', {
        bubbles: true
      });
      thisWidget.element.dispatchEvent(event);
    }
  }
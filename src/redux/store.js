import { createStore } from 'redux';

const INIT = {
  last: [],
};
const reducer = (state = INIT, action) => {
  switch (action.type) {
    case 'UPDATE':

      let  newData = action.payload
      let lastData = { ...state }.last

      //console.log('new', newData)
      //console.log('last', lastData)

      newData = newData.map((element, index) => {
       

        if (lastData.length) {

          if(!element.hasOwnProperty('statusAsk')){
            element.statusAsk = 'black'
          }

          if(!element.hasOwnProperty('statusBid')){
            element.statusBid = 'black'
          }

          if (newData[index].ask > lastData[index].ask) {
            element.statusAsk = 'green'
          } else if (newData[index].ask < lastData[index].ask) {
            element.statusAsk = 'red'
          }

          if (newData[index].bid > lastData[index].bid) {
            element.statusBid = 'green'
          } else if (newData[index].bid < lastData[index].bid) {
            element.statusBid = 'red'
          }
        }

        return element
      });


      return {
        ...state,
        last: newData,
      };

    /*

   

    return {
      ...state,
      last: action.payload,
    };
    */
    default:
      return state;
  }
};

const store = createStore(reducer);

export default store;
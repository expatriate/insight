import * as types from '../actionTypes.js';

const companiesState = {
  items: [],
  loaded: false,
  selectedCompany: null
};

export default companies = (state = companiesState, action) => {
    switch (action.type) {
      case types.COMPANIES_RECIEVED:
        return {
          ...state,
          items: action.data,
          loaded: true,
        }
      break;
      case types.COMPANY_SELECTED:
        return {
          ...state,
          selectedCompany: action.data
        }
      break;
      default:
          return state;
    }
};

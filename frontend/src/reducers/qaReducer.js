import {
  QA_ADD,
  LOADING
} from '../actions/types';

const initialState = {
  QA: [],
  status: false
};

function qaReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case QA_ADD:
      return {
        ...state,
        QA: [...state.QA, payload]
      };
    case LOADING:
      return {
        ...state,
        status: payload
      }
    default:
      return state;
  }
}

export default qaReducer;
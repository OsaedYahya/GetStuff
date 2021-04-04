import * as types from '../actions/actionTypes';
import Immutable from 'seamless-immutable';

const initialState = Immutable({
  root: 'login', // 'login' / 'home'
  user: undefined,
});

export default function app(state = initialState, action = {}) {
  switch (action.type) {
    case types.ROOT_CHANGED:
      return {...state, root: action.root};

    case types.LOG_IN:
      return {
        ...state,
        root: 'home',
        user: action.user,
      };
    case types.LOGGED_IN:
      return {
        ...state,
        user: action.user,
      }
    default:
      return state;
  }
}

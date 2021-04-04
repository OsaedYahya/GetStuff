import * as types from './actionTypes'

export function appInitialized () {
  return async function (dispatch, getState) {
    const { root } = getState().app
    dispatch(moveTo(root))
  }
}

export function moveTo (root) {
  return { type: types.ROOT_CHANGED, root }
}


import * as ActionTypes from '../actions'
import { updateObject } from './reducerUtilities'

const initialState = {}

function setMessage (state, action) {
  return updateObject(state, {
    message: action.message,
    type: 'error',
    dismissable: false })
}

export const messagesReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.QS_ERROR: return setMessage(state, action)
    default:
      return state
  }
}

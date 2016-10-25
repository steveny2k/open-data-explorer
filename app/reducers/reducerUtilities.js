// utility functions
export function updateObject (oldObject, newValues) {
  return Object.assign({}, oldObject, newValues)
}

export function removeByKey (myObj, deleteKey) {
  return Object.keys(myObj)
    .filter(key => key !== deleteKey)
    .reduce((result, current) => {
      result[current] = myObj[current]
      return result
    }, {})
}

export function updateByKey (myObj, updateKey, payload) {
  return Object.keys(myObj)
    .reduce((result, current) => {
      if (current === updateKey) {
        result[current] = payload
      } else {
        result[current] = myObj[current]
      }
      return result
    }, {})
}

export function clearState (state, action) {
  return updateObject(state, {})
}

export function createReducer (initialState, handlers) {
  return function reducer (state = initialState, action) {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action)
    } else {
      return state
    }
  }
}

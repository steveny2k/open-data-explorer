import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux'
// import reducers
import { metadataReducer } from './metadataReducer'
import { columnsReducer } from './columnsReducer'
import { queryReducer } from './queryReducer'
import { chartReducer } from './chartReducer'
import { tableReducer } from './tableReducer'

function messagesReducer (state = null, action) {
  return state
}

const rootReducer = combineReducers({
  metadata: metadataReducer,
  query: queryReducer,
  chart: chartReducer,
  table: tableReducer,
  columnProps: columnsReducer,
  messages: messagesReducer,
  routing
})

export default rootReducer

import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux'
// import reducers and selectors
import { metadataReducer } from './metadataReducer'
import columnsReducer, * as fromColumns from './columnsReducer'
import { queryReducer } from './queryReducer'
import { chartReducer } from './chartReducer'
import { tableReducer } from './tableReducer'

// move later
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

const getColumnDef = (state, column) => fromColumns.getColumnDef(state.columnProps, column)

export const getSelectedColumnDef = state =>
  getColumnDef(state, state.query.selectedColumn)

export default rootReducer

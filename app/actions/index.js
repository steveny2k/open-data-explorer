import { CALL_API } from '../middleware'
import { Endpoints, Transforms, shouldRunColumnStats } from '../middleware/socrata'

export const METADATA_REQUEST = 'METADATA_REQUEST'
export const METADATA_SUCCESS = 'METADATA_SUCCESS'
export const METADATA_FAILURE = 'METADATA_FAILURE'

// Fetches a single user from Github API.
// Relies on the custom API middleware defined in ../middleware/api.js.
function fetchMetadata (id) {
  return {
    [CALL_API]: {
      types: [METADATA_REQUEST, METADATA_SUCCESS, METADATA_FAILURE],
      endpoint: Endpoints.METADATA(id),
      transform: Transforms.METADATA
    }
  }
}

export const MIGRATION_REQUEST = 'MIGRATION_REQUEST'
export const MIGRATION_FAILURE = 'MIGRATION_FAILURE'
export const MIGRATION_SUCCESS = 'MIGRATION_SUCCESS'

function fetchMigrationId (id) {
  return {
    [CALL_API]: {
      types: [MIGRATION_REQUEST, MIGRATION_SUCCESS, MIGRATION_FAILURE],
      endpoint: Endpoints.MIGRATION(id),
      transform: Transforms.MIGRATION
    }
  }
}

export const COUNT_REQUEST = 'COUNT_REQUEST'
export const COUNT_SUCCESS = 'COUNT_SUCCESS'
export const COUNT_FAILURE = 'COUNT_FAILURE'

function countRows (id) {
  return {
    [CALL_API]: {
      types: [COUNT_REQUEST, COUNT_SUCCESS, COUNT_FAILURE],
      endpoint: Endpoints.COUNT(id),
      transform: Transforms.COUNT
    }
  }
}

export const COLPROPS_REQUEST = 'COLPROPS_REQUEST'
export const COLPROPS_SUCCESS = 'COLPROPS_SUCCESS'
export const COLPROPS_FAILURE = 'COLPROPS_FAILURE'

function fetchColumnProps (id, key) {
  return {
    [CALL_API]: {
      types: [COLPROPS_REQUEST, COLPROPS_SUCCESS, COLPROPS_FAILURE],
      endpoint: Endpoints.COLPROPS(id, key),
      transform: Transforms.COLPROPS,
      params: {
        key: key
      }
    }
  }
}

// Fetches the metadata for the dataset by unique identifier
export function loadMetadata (id) {
  return (dispatch, getState) => {
    return Promise.all([
      dispatch(fetchMetadata(id)),
      dispatch(fetchMigrationId(id)),
      dispatch(countRows(id)),
      dispatch(loadColumnProps())
    ])
  }
}

export function loadColumnProps () {
  return (dispatch, getState) => {
    let id = getState().metadata.migrationId ? getState().metadata.migrationId : getState().metadata.id
    let promises = []
    for (var key in getState().metadata.columns) {
      if (shouldRunColumnStats(getState().metadata.columns[key].type, key)) {
        promises.push(dispatch(fetchColumnProps(id, key)))
      }
    }
    return Promise.all(promises)
  }
}

export const DATA_REQUEST = 'DATA_REQUEST'
export const DATA_SUCCESS = 'DATA_SUCCESS'
export const DATA_FAILURE = 'DATA_FAILURE'

function fetchData (state, isForTable = false) {
  let endpoint
  let transform
  if (!isForTable) {
    endpoint = Endpoints.QUERY(state)
    transform = Transforms.QUERY
  } else {
    endpoint = Endpoints.TABLEQUERY(state)
    transform = Transforms.TABLEQUERY
  }
  return {
    [CALL_API]: {
      types: [DATA_REQUEST, DATA_SUCCESS, DATA_FAILURE],
      endpoint: endpoint,
      transform: transform
    }
  }
}

export const LOAD_TABLE = 'LOAD_TABLE'

export function loadTable () {
  return (dispatch, getState) => {
    dispatch({
      type: LOAD_TABLE
    })
    dispatch(fetchData(getState(), true))
  }
}

// query parameter related actions - these might be able to be collapsed to a single action creator that updates the query params - groupby, dateby, column selection
export const SELECT_COLUMN = 'SELECT_COLUMN'
export const CHANGE_DATEBY = 'CHANGE_DATEBY'
export const GROUP_BY = 'GROUP_BY'
export const SUM_BY = 'SUM_BY'
export const SORT_COLUMN = 'SORT_COLUMN'
export const UPDATE_PAGE = 'UPDATE_PAGE'

export function selectColumn (column) {
  return (dispatch, getState) => {
    dispatch({
      type: SELECT_COLUMN,
      payload: column})
    dispatch(fetchData(getState()))
  }
}

export function changeDateBy (dateBy) {
  return (dispatch, getState) => {
    dispatch({
      type: CHANGE_DATEBY,
      payload: dateBy})
    dispatch(fetchData(getState()))
  }
}

export function groupBy (key) {
  return (dispatch, getState) => {
    dispatch({
      type: GROUP_BY,
      payload: key})
    dispatch(fetchData(getState()))
  }
}

export function sumBy (key) {
  return (dispatch, getState) => {
    dispatch({
      type: SUM_BY,
      payload: key})
    dispatch(fetchData(getState()))
  }
}

export function sortColumn (key, dir) {
  return (dispatch, getState) => {
    dispatch({
      type: SORT_COLUMN,
      key,
      dir})
    dispatch(fetchData(getState(), true))
  }
}

export function updatePage (page) {
  return (dispatch, getState) => {
    dispatch({
      type: UPDATE_PAGE,
      page
    })
    dispatch(fetchData(getState(), true))
  }
}

export const ADD_FILTER = 'ADD_FILTER'
export const REMOVE_FILTER = 'REMOVE_FILTER'
export const UPDATE_FILTER = 'UPDATE_FILTER'
export const APPLY_FILTER = 'APPLY_FILTER'
export const APPLY_CHART_TYPE = 'APPLY_CHART_TYPE'
export const UPDATE_FROM_QS = 'UPDATE_FROM_QS'
export const QS_ERROR = 'QS_ERROR'

export function addFilter (key) {
  return {
    type: ADD_FILTER,
    payload: key}
}

export function applyChartType (chartType) {
  return {
    type: APPLY_CHART_TYPE,
    chartType}
}

export function removeFilter (key) {
  return (dispatch, getState) => {
    dispatch({
      type: REMOVE_FILTER,
      payload: key})
    dispatch(fetchData(getState()))
  }
}

export function updateFilter (key, options) {
  return {
    type: UPDATE_FILTER,
    payload: {
      key,
      options
    }
  }
}

export function applyFilter (key, options) {
  return (dispatch, getState) => {
    dispatch(updateFilter(key, options))
    dispatch(fetchData(getState()))
  }
}

const parseQueryString = (q) => {
  let payload
  let error
  if (typeof q === 'string') {
    try {
      payload = JSON.parse(q)
    } catch (e) {
      error = true
    }
  } else {
    error = true
  }

  if (error) return Promise.reject(new Error('This URL does not point to a valid visual. Please check the URL.'))
  return Promise.resolve(payload)
}

export const loadQueryStateFromString = (q) => (dispatch, getState) => {
  return parseQueryString(q).then(
    response => {
      dispatch({
        type: UPDATE_FROM_QS,
        payload: response
      })
      dispatch(fetchData(getState()))
    },
    error => {
      dispatch({
        type: QS_ERROR,
        message: error.message || 'Something bad happened',
        error: true
      })
    })
}

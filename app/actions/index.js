import { CALL_API, Endpoints, Transforms, shouldRunColumnStats } from '../middleware/socrata'

export const METADATA_REQUEST = 'METADATA_REQUEST'
export const METADATA_SUCCESS = 'METADATA_SUCCESS'
export const METADATA_FAILURE = 'METADATA_FAILURE'

// Fetches a single user from Github API.
// Relies on the custom API middleware defined in ../middleware/api.js.
function fetchMetadata (id) {
  return {
    [CALL_API]: {
      types: [ METADATA_REQUEST, METADATA_SUCCESS, METADATA_FAILURE ],
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
      types: [ MIGRATION_REQUEST, MIGRATION_SUCCESS, MIGRATION_FAILURE ],
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
      types: [ COUNT_REQUEST, COUNT_SUCCESS, COUNT_FAILURE ],
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
      types: [ COLPROPS_REQUEST, COLPROPS_SUCCESS, COLPROPS_FAILURE ],
      endpoint: Endpoints.COLPROPS(id, key),
      transform: Transforms.COLPROPS,
      params: {key: key}
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
    let id = getState().dataset.migrationId ? getState().dataset.migrationId : getState().dataset.id
    let promises = []
    for (var key in getState().dataset.columns) {
      if (shouldRunColumnStats(getState().dataset.columns[key].type, key)) {
        promises.push(dispatch(fetchColumnProps(id, key)))
      }
    }
    return Promise.all(promises)
  }
}

export const DATA_REQUEST = 'DATA_REQUEST'
export const DATA_SUCCESS = 'DATA_SUCCESS'
export const DATA_FAILURE = 'DATA_FAILURE'

function fetchData (state) {
  return {
    [CALL_API]: {
      types: [ DATA_REQUEST, DATA_SUCCESS, DATA_FAILURE ],
      endpoint: Endpoints.QUERY(state),
      transform: Transforms.QUERY
    }
  }
}

export const SELECT_COLUMN = 'SELECT_COLUMN'

export function selectColumn (column) {
  return (dispatch, getState) => {
    dispatch({
      type: SELECT_COLUMN,
      column
    })
    dispatch(fetchData(getState()))
  }
}

export const GROUP_BY = 'GROUP_BY'

export function groupBy (key) {
  return (dispatch, getState) => {
    dispatch({
      type: GROUP_BY,
      key
    })
    dispatch(fetchData(getState()))
  }
}

export const ADD_FILTER = 'ADD_FILTER'
export const REMOVE_FILTER = 'REMOVE_FILTER'
export const UPDATE_FILTER = 'UPDATE_FILTER'
export const APPLY_FILTER = 'APPLY_FILTER'

export function addFilter (key) {
  return {
    type: ADD_FILTER,
    key
  }
}

export function removeFilter (key) {
  return (dispatch, getState) => {
    dispatch({
      type: REMOVE_FILTER,
      key
    })
    dispatch(fetchData(getState()))
  }
}

export function updateFilter (key, options) {
  return {
    type: UPDATE_FILTER,
    key,
    options
  }
}

export function applyFilter (key, options) {
  return (dispatch, getState) => {
    dispatch(updateFilter(key, options))
    dispatch(fetchData(getState()))
  }
}
// set selectCol to key
// build query based on state including selectedCol
//
/*
export function requestMetadata (id) {
  return { type: REQUEST_METADATA, id }
}

export function receiveMetadata (id, json) {
  return {
    type: RECEIVE_METADATA,
    id,
    metadata: json,
    receivedAt: Date.now()
  }
}

export function fetchMetadata (id) {
  return (dispatch) => {
    dispatch(requestMetadata(id))
    return fetch(`http://${API_DOMAIN}/api/views/${id}.json`)
      .then((response) => response.json())
      .then((json) => {
        dispatch(receiveMetadata(id, json))
      })
  }
}
*/

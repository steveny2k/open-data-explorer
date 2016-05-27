import fetch from 'isomorphic-fetch'
import soda from 'soda-js'
import pluralize from 'pluralize'
import { capitalize } from 'underscore.string'

const API_ROOT = 'https://data.sfgov.org/'

// Extracts the next page URL from Github API response.
function getNextPageUrl (response) {
  /* const link = response.headers.get('link')
  if (!link) {
    return null
  }

  const nextLink = link.split(',').find(s => s.indexOf('rel="next"') > -1)
  if (!nextLink) {
    return null
  }

  return nextLink.split(';')[0].slice(1, -1)*/
}

function constructQuery (state) {
  let queryStack = state.dataset.query
  let columns = state.dataset.columns
  let { selectedColumn, dateBy, filters } = queryStack
  let columnType = columns[selectedColumn].type

  let consumerRoot = API_ROOT.split('/')[2]
  let consumer = new soda.Consumer(consumerRoot)
  let id = state.dataset.migrationId || state.dataset.id
  let query = consumer.query().withDataset(id)

  let {groupBy, sumBy} = state.dataset.query
  let dateAggregation = dateBy === 'month' ? 'date_trunc_ym' : 'date_trunc_y'
  let selectAsLabel = selectedColumn + ' as label'
  let orderBy = 'value desc'
  if (columnType === 'date') {
    selectAsLabel = dateAggregation + '(' + selectedColumn + ') as label'
    orderBy = 'label'
  }

  if (groupBy) {
    orderBy = groupBy
    if (columns[groupBy].type === 'date') {
      groupBy = 'date_trunc_y(' + groupBy + ') as date_group_by'
      orderBy = 'date_group_by'
    }
    query.select(groupBy).group(orderBy)
  }

  let base = 'count(*) as value'
  let sumByQry = selectAsLabel + ', sum(' + sumBy + ') as value'

  if (sumBy) {
    query.select(sumByQry)
      .group('label')
      .order(orderBy)
      .where(sumBy + ' is not null')
  } else {
    query = query.select(base)
      .select(selectAsLabel)
      .group('label')
      .order(orderBy)
  }

  // Where (filter)
  if (columnType === 'date') query = query.where('label is not null')
  if (filters) {
    for (let key in filters) {
      let column = key !== 'checkboxes' ? columns[key] : {type: 'checkbox'}
      let filter = filters[key]

      if (column.type === 'date') {
        let start = filter.options.min.format('YYYY-MM-DD')
        let end = filter.options.max.format('YYYY-MM-DD')
        query.where(key + '>="' + start + '" and ' + key + '<="' + end + '"')
      } else if (column.categories && filter.options && filter.options.selected) {
        let enclose = '"'
        let joined = [].concat(filter.options.selected)
        let selectedCount = joined.length
        let blankIdx = joined.indexOf('blank')
        let queryNull = ''

        if (blankIdx > -1) {
          joined.splice(blankIdx, 1)
          queryNull = key + ' is null'
        }

        if (selectedCount > 1) {
          queryNull = queryNull !== '' ? queryNull + ' or ' : ''
          joined = joined.join(enclose + ' or ' + key + '=' + enclose)
          query.where(queryNull + key + '=' + enclose + joined + enclose)
        } else if (selectedCount === 1) {
          let whereString = queryNull !== '' ? queryNull : key + '=' + enclose + joined + enclose
          query.where(whereString)
        }
      } else if (column.type === 'checkbox' && filter.options && filter.options.selected) {
        let join = filter.options.join || 'or'
        let joined = filter.options.selected.join(' ' + join + ' ')
        query.where(joined)
      } else if (column.type === 'number' && !column.categories && filter.options && filter.options.currentRange) {
        let first = parseInt(filter.options.currentRange[0])
        let last = parseInt(filter.options.currentRange[1])
        query.where(key + '>=' + first + ' and ' + key + '<=' + last)
      }
    }
  }
  /*
      if (fieldDef.type == 'calendar_date') {
        query = query
          .select('count(*) as value')
          .select(dateAggregation + '(' + selectedCol + ') as label')
          .where('label is not null')
          .group('label')
          .order('label')
      } else if (fieldDef.type === 'category' || fieldDef.type === 'number') {
        query = query
          .select('count(*) as value')
          .select(selectedCol + ' as label')
          .group('label')
          .order('value desc')
      } else if (fieldDef.type === 'checkbox') {
        query = query
          .select('sum(case(' + selectedCol + '=false,1,true,0)) as ' + selectedCol + '_false')
          .select('sum(case(' + selectedCol + '=true,1,true,0)) as ' + selectedCol + '_true')
          .select('count(*) as total')
          .order('total desc')
      }

      if (this.groupBy) {
        query.select(this.groupBy).group(this.groupBy).order(this.groupBy)
      }

      if (this.state.filters.length > 0) {
        for (var filter of this.state.filters) {
          if (filter.type === 'calendar_date') {
            let start = filter.startDate.format('YYYY-MM-DD'),
              end = filter.endDate.format('YYYY-MM-DD')
            query.where(filter.key + '>="' + start + '" and ' + filter.key + '<="' + end + '"')
          } else if (filter.type === 'category' && filter.selected) {
            let enclose = '"',
              joined = filter.selected
            if (Array.isArray(filter.selected)) {
              joined = filter.selected.join(enclose + ' or ' + filter.key + '=' + enclose)
            }
            query.where(filter.key + '=' + enclose + joined + enclose)
          } else if (filter.type === 'checkbox' && filter.selected && filter.selected.length > 0) {
            let join = filter.join || 'or',
              joined = filter.selected.join(' ' + join + ' ')
            query.where(joined)
          } else if (filter.type === 'number') {
            let first = parseInt(filter.range[0]) - 1
            let last = parseInt(filter.range[1]) + 1
            query.where(filter.key + ' between "' + first + '" and "' + last + '"')
          }
        }
      }

      query = query.limit(50000)
      */
  query = query.limit(50000)
  return query.getURL()
}

function endpointApiMigration (id) {
  return `api/migrations/${id}.json`
}

function endpointMetadata (id) {
  return `api/views/${id}.json`
}

function endpointCount (id) {
  return `resource/${id}.json?$select=count(*)`
}

function endpointQuery (state) {
  return constructQuery(state)
}

function endpointGroupByQuery (id, key) {
  let category = key + ' as category'
  if (key === 'category') {
    category = key
  }
  return `resource/${id}.json?$select=${category},count(*)&$group=category&$order=category asc`
}

function transformMetadata (json) {
  let metadata = {
    id: json['id'],
    name: json['name'],
    description: json['description'],
    type: json['viewType'],
    createdAt: json['createdAt'],
    rowsUpdatedAt: json['rowsUpdatedAt'],
    viewModifiedAt: json['viewLastModified'],
    licenseName: json.license.name || null,
    licenseLink: json.license.termsLink || null,
    publishingDepartment: json.metadata.custom_fields['Department Metrics']['Publishing Department'] || null,
    rowLabel: json.metadata.rowLabel || 'Record',
    columns: {}
  }

  for (let column of json.columns) {
    let typeCast = {
      'calendar_date': 'date',
      'currency': 'number'
    }
    let type = typeCast[column['dataTypeName']] || column['dataTypeName']

    let col = {
      id: column['id'],
      key: column['fieldName'],
      name: column['name'].replace(/[_-]/g, ' '),
      description: column['description'] || '',
      type,
      format: column['format']['view'] || null,
      non_null: column['cachedContents']['non_null'] || 0,
      null: column['cachedContents']['null'] || 0,
      count: column['cachedContents']['non_null'] + column['cachedContents']['null'] || null,
      min: column['cachedContents']['smallest'] || null,
      max: column['cachedContents']['largest'] || null
    }
    metadata.columns[column['fieldName']] = col
  }

  return metadata
}

function transformQuery (json, state) {
  let { columns, query, rowLabel } = state.dataset
  let { selectedColumn, groupBy } = query
  let labels = ['x']
  let keys = []
  let data = []
  let nullText = 'Blank'
  let isCheckbox = columns[selectedColumn].type === 'checkbox'
  let keyIdx = groupBy || 'label'
  if (keyIdx !== 'label' && columns[keyIdx].type === 'date') keyIdx = 'date_group_by'

  rowLabel = pluralize(rowLabel)

  labels = labels.concat(isCheckbox ? rowLabel : json.map((row) => {
    return typeof row.label === 'undefined' ? nullText : (row.label === nullText ? 'False' : capitalize(row.label.toString()))
  }).filter((elem, index, array) => {
    return array.indexOf(elem) === index
  }))

  keys = keys.concat((!isCheckbox && !groupBy) ? rowLabel : json.map((row) => {
    return typeof row[keyIdx] === 'undefined' ? nullText : (row[keyIdx] === nullText ? 'False' : capitalize(row[keyIdx].toString()))
  }).filter((elem, index, array) => {
    return array.indexOf(elem) === index
  }))

  keys.forEach((key, index, array) => data.push([key].concat(Array.apply(null, new Array(labels.length - 1)).map(Number.prototype.valueOf, 0)))
  )

  json.forEach((row) => {
    let label = isCheckbox ? rowLabel : (typeof row.label === 'undefined' ? nullText : (row.label === nullText ? 'False' : capitalize(row.label.toString())))
    let key = (!isCheckbox && !groupBy) ? rowLabel : (typeof row[keyIdx] === 'undefined' ? nullText : (row[keyIdx] === nullText ? 'False' : capitalize(row[keyIdx].toString())))
    data[keys.indexOf(key)][labels.indexOf(label)] = row.value
  })
  data = [labels].concat(data)
  debugger
  return {
    query: {
      isFetching: false,
      data: data
    }
  }
}

function transformCount (json) {
  return {rowCount: json[0].count}
}

function transformApiMigration (json) {
  return {migrationId: json.nbeId}
}

function transformGroupByQuery (json, state, params) {
  let checkFirst = parseInt(json[0].count) / state.dataset.rowCount
  let transformed = {
    columns: {}
  }
  transformed.columns[params['key']] = {}
  if (checkFirst <= 0.95 && json[0].count !== '1' && json.length !== 1000) {
    transformed.columns[params['key']].categories = json
    transformed.categoryColumns = [params['key']]
  } else if (json[0].count === '1') {
    transformed.columns[params['key']].unique = true
  }

  if (checkFirst === 1) {
    transformed.columns[params['key']].singleValue = true
  }

  return transformed
}

export const Endpoints = {
  METADATA: endpointMetadata,
  QUERY: endpointQuery,
  COUNT: endpointCount,
  MIGRATION: endpointApiMigration,
  COLPROPS: endpointGroupByQuery
}

export const Transforms = {
  METADATA: transformMetadata,
  QUERY: transformQuery,
  COUNT: transformCount,
  MIGRATION: transformApiMigration,
  COLPROPS: transformGroupByQuery
}

export const shouldRunColumnStats = (type, key) => {
  /*
   * numericKeys is a bit of a hack to get around the fact that some categorical fields are encoded as numbers on the portal
   * we don't want to run column stats against all numeric columns, so this allows us to control that
  */
  const numericKeys = ['supervisor_district', 'calendar_year', 'fiscal_year']
  let regex = /(year|day|date|month|district|yr)/g
  let isCategorical = regex.test(key)
  if (type === 'text' || (isCategorical && type === 'number')) {
    return true
  } else {
    return false
  }
}

// Fetches an API response and normalizes the result JSON according to a transformation which can involve a normalized schema.
// This makes the shape of API data predictable
function callApi (endpoint, transform, state, params) {
  const fullUrl = (endpoint.indexOf(API_ROOT) === -1) ? API_ROOT + endpoint : endpoint

  return fetch(fullUrl)
    .then((response) => response.json().then((json) => ({ json, response}))
  ).then(({ json, response }) => {
    if (!response.ok) {
      return Promise.reject(json)
    }

    const transformed = transform(json, state, params)
    // const nextPageUrl = null // getNextPageUrl(response)

    return Object.assign({},
      transformed
    )
  })
}

export const CALL_API = Symbol('Call API')

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default (store) => (next) => (action) => {
  const callAPI = action[CALL_API]
  if (typeof callAPI === 'undefined') {
    return next(action)
  }

  let { endpoint } = callAPI
  const { types, transform, params } = callAPI

  if (typeof endpoint === 'function') {
    endpoint = endpoint(store.getState())
  }
  if (typeof endpoint !== 'string') {
    throw new Error('Specify a string endpoint URL.')
  }
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.')
  }
  if (!types.every((type) => typeof type === 'string')) {
    throw new Error('Expected action types to be strings.')
  }

  function actionWith (data) {
    const finalAction = Object.assign({}, action, data)
    delete finalAction[CALL_API]
    return finalAction
  }

  const [requestType, successType, failureType] = types
  next(actionWith({ type: requestType }))

  return callApi(endpoint, transform, store.getState(), params).then(
    (response) => next(actionWith({
      response,
      type: successType
    })),
    (error) => next(actionWith({
      type: failureType,
      error: error.message || 'Something bad happened'
    }))
  )
}

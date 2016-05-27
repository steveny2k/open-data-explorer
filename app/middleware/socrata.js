import fetch from 'isomorphic-fetch'
import soda from 'soda-js'
import pluralize from 'pluralize'
import { capitalize } from 'underscore.string'
import _ from 'lodash'

const API_ROOT = 'https://data.sfgov.org/'

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

function endpointColumnProperties (id, key) {
  let category = key + ' as category'
  if (key === 'category') {
    category = key
  }
  return `resource/${id}.json?$select=${category},count(*)&$group=category&$order=category asc&$limit=50000`
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
  let { selectedColumn, groupBy, sumBy } = query
  let labels = ['x']
  let keys = []
  let data = []
  let nullText = 'Blank'
  let isCheckbox = columns[selectedColumn].type === 'checkbox'
  let keyIdx = groupBy || 'label'
  if (keyIdx !== 'label' && columns[keyIdx].type === 'date') keyIdx = 'date_group_by'

  rowLabel = !sumBy ? pluralize(rowLabel) : 'Sum of ' + columns[sumBy].name

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

  keys.forEach((key, index, array) => data.push([key].concat(Array.apply(null, new Array(labels.length - 1)).map(Number.prototype.valueOf, 0))))

  json.forEach((row) => {
    let label = isCheckbox ? rowLabel : (typeof row.label === 'undefined' ? nullText : (row.label === nullText ? 'False' : capitalize(row.label.toString())))
    let key = (!isCheckbox && !groupBy) ? rowLabel : (typeof row[keyIdx] === 'undefined' ? nullText : (row[keyIdx] === nullText ? 'False' : capitalize(row[keyIdx].toString())))
    data[keys.indexOf(key)][labels.indexOf(label)] = row.value
  })

  if (columns[selectedColumn].type === 'number') {
    let counts = [].concat(data[0])
    let numbers = [].concat(labels)
    counts.shift()
    numbers.shift()

    let vector = numbers.map((number, idx, arr) => {
      let expand = []
      for (let i = 0; i < parseInt(counts[idx]); i++) {
        expand.push(parseInt(number))
      }
      return expand
    }).reduce((a, b) => {
      return a.concat(b)
    }, [])

    vector.sort((a, b) => {
      return a - b
    })

    let quantile = (p, vector) => {
      let idx = 1 + (vector.length - 1) * p
      let lo = Math.floor(idx)
      let hi = Math.ceil(idx)
      let h = idx - lo
      return (1 - h) * vector[lo] + h * vector[hi]
    }

    let freedmanDiaconis = (vector) => {
      let iqr = quantile(0.75, vector) - quantile(0.25, vector)
      return 2 * iqr * Math.pow(vector.length, -1 / 3)
    }

    let pretty = (x) => {
      let scale = Math.pow(10, Math.floor(Math.log(x / 10) / Math.LN10))
      let err = 10 / x * scale
      if (err <= 0.15) scale *= 10
      else if (err <= 0.35) scale *= 5
      else if (err <= 0.75) scale *= 2
      return scale * 10
    }

    let binSize = freedmanDiaconis(vector)
    if (binSize === 0) {
      let vector2 = vector.slice(vector.lastIndexOf(0))
      binSize = freedmanDiaconis(vector2)
    }
    binSize = pretty(binSize)
    let binNumbers = (values, binWidth, array = [], index = 0) => {
      if (index < values.length) {
        let bin = Math.floor(values[index] / binWidth)
        array[bin] = array[bin] ? array[bin] + 1 : 1
        binNumbers(values, binWidth, array, index + 1)
      }
      return array
    }

    let maxBins = Math.floor(vector[vector.length - 1] / binSize)
    let emptyBins = Array(maxBins).fill(0)
    let binFreq = binNumbers(vector, binSize, emptyBins)

    data[0] = ['Count of ' + rowLabel].concat(binFreq)
    labels = ['x'].concat(binFreq.map((d, idx) => {
      return binSize * idx + ' to ' + binSize * (idx + 1)
    }))
  }

  data = [labels].concat(data)
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

function transformColumnProperties (json, state, params) {
  let maxRecord = parseInt(_.maxBy(json, function (o) { return parseInt(o.count) }).count)
  let checkFirst = maxRecord / state.dataset.rowCount
  let checkNumCategories = json.length / state.dataset.rowCount
  let transformed = {
    columns: {}
  }
  transformed.columns[params['key']] = {}
  if ((checkFirst <= 0.95 && checkNumCategories <= 0.95) && maxRecord !== '1' && json.length !== 50000) {
    transformed.columns[params['key']].categories = json
    transformed.categoryColumns = [params['key']]
  } else if (maxRecord === 1) {
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
  COLPROPS: endpointColumnProperties
}

export const Transforms = {
  METADATA: transformMetadata,
  QUERY: transformQuery,
  COUNT: transformCount,
  MIGRATION: transformApiMigration,
  COLPROPS: transformColumnProperties
}

export const shouldRunColumnStats = (type, key) => {
  /*
   * numericKeys is a bit of a hack to get around the fact that some categorical fields are encoded as numbers on the portal
   * we don't want to run column stats against all numeric columns, so this allows us to control that
  */
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
    .then((response) => response.json().then((json) => ({json, response}))
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

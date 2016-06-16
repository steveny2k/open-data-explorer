import React from 'react'
import { Row, Col, Panel } from 'react-bootstrap'
import { Link } from 'react-router'
import slugify from 'underscore.string/slugify'

export default class CatalogItem extends React.Component {
  constructor () {
    super()
  }

  render () {
    let {dataset} = this.props
    let {systemID, _highlightResult, name} = dataset
    let description = dataset.description
    let highlightedName = _highlightResult.name.value
    let category = dataset.category || 'dataset'
    let path = '/' + slugify(category) + '/' + slugify(name) + '/' + systemID
    let link = <Link to={`${path}`}>
               {name}
               </Link>
    return (
    <Row>
      <Col sm={12}>
      <Panel header={link} className="panelItem">
        <p>
          {description}
        </p>
      </Panel>
      </Col>
    </Row>
    )
  }
}

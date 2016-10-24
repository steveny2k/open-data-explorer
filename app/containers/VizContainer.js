import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import VizStage from '../components/VizStage'
import Panel from '../components/ChartExperimental/Panel'
import { Row, Col } from 'react-bootstrap'

const VizContainer = ({chartProps, panelProps}) => {
  <Row>
    <Col>
      <VizStage chart={chartProps} />
    </Col>
    <Col>
      <Panel panel={panelProps} />
    </Col>
  </Row>
}

VizContainer.PropTypes = {
  chartProps: React.PropTypes.shape({
    chartType: React.PropTypes.string,
    chartData: React.PropTypes.object,
    selectedColumn: React.PropTypes.string,
    selectedColumnDef: React.PropTypes.object,
    columns: React.PropTypes.object,
    groupBy: React.PropTypes.string,
    sumBy: React.PropTypes.string,
    dateBy: React.PropTypes.string,
    filters: React.PropTypes.object
  }),
  panelProps: React.PropTypes.shape({
    filters: React.PropTypes.object,
    columns: React.PropTypes.object,
    groupBy: React.PropTypes.string,
    sumBy: React.PropTypes.string
  })
}

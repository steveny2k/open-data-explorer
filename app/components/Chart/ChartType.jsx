import React, { Component } from 'react'
import RadioGroup from 'react-radio-group'
import './_Chart.scss'
import { Panel } from 'react-bootstrap'

class ChartType extends Component {
  renderChartTypes () {
    let {applyChartType, chartType} = this.props
    if (!chartType) {
      chartType = 'line'
    }
    const panelTitle = (
      <div>Chart Type Options</div>
    )
    return (
      <Panel collapsible defaultExpanded header={panelTitle}>
        <div className={'chartTypeRadio'}>
          <RadioGroup
            name='chartTypes'
            selectedValue={chartType}
            onChange={applyChartType}>
              {Radio => (
                <div>
                  <label className={'chartTypeRadioLabel'}>
                    <Radio value='bar' />Bar
                  </label>
                  <label className={'chartTypeRadioLabel'}>
                    <Radio value='line' />Line
                  </label>
                  <label className={'chartTypeRadioLabel'}>
                    <Radio value='area' />Area
                  </label>
                </div>
              )}
          </RadioGroup>
        </div>
      </Panel>
    )
  }

  render () {
    let {displayChartOptions} = this.props
    let chartTypeOptions = null
    if (displayChartOptions) {
      chartTypeOptions = this.renderChartTypes()
    }
    return (
      <div>
        {chartTypeOptions}
      </div>
    )
  }
}
export default ChartType

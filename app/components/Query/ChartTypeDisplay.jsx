import React, { Component } from 'react'
import RadioGroup from 'react-radio-group'
import './_chartTypeDisplay.scss'
import { Panel } from 'react-bootstrap'

class ChartTypeDisplay extends Component {
  isDateColTest (selectedColumnDef) {
    if (selectedColumnDef.type === 'date') {
      return true
    }
    return false
  }

  render () {
    let {applyChartType, chartType, selectedColumnDef} = this.props
    if (!(chartType)) {
      chartType = 'bar'
    }
    let isDateCol = this.isDateColTest(selectedColumnDef)
    const panelTitle = (
      <div>
        Chart Type Options
      </div>
    )
    return (
      <Panel collapsible defaultExpanded header={panelTitle}>
        <Choose>
          <When condition={isDateCol}>
            <div className={'chartTypeRadio'}>
              <RadioGroup name='chartTypes' selectedValue={chartType} onChange={applyChartType}>
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
          </When>
          <Otherwise>
            <div className={'chartTypeRadio'}>
              <RadioGroup name='chartTypes' selectedValue={chartType} onChange={applyChartType}>
                {Radio => (
                  <div>
                    <label className={'chartTypeRadioLabel'}>
                      <Radio value='bar' />Bar
                    </label>
                  </div>
                )}
              </RadioGroup>
            </div>
          </Otherwise>
        </Choose>
      </Panel>
    )
  }
}

ChartTypeDisplay.propTypes = {
  chartType: React.PropTypes.string,
  displayChartOptions: React.PropTypes.bool,
  selectedColumnDef: React.PropTypes.object
}

export default ChartTypeDisplay


//import { BarChart } from 'react-d3';
import React, { Component } from 'react'
import d3 from 'd3'

import { Grid } from 'react-bootstrap'
import LineChart from './LineChart'
import BarChart from './BarChart'
require('./_ChartExperimental.scss')


class ChartExperimental extends Component {

    render() {
    let chart_data=[
            {key:'02-11-2016',value:180},
            {key:'02-12-2016',value:250},
            {key:'02-13-2016',value:150},
            {key:'02-14-2016',value:496},
            {key:'02-15-2016',value:140},
            {key:'02-16-2016',value:380},
            {key:'02-17-2016',value:100},
            {key:'02-18-2016',value:150}
          ]
    let chart_data2 =[
            { key:'Jan', value:40 },
            { key:'Feb', value:50 },
            { key:'Mar', value:65 },
            { key:'Apr', value:60 },
            { key:'May', value:70 },
            { key:'Jun', value:55 },
            { key:'Jul', value:80 },
            { key:'Aug', value:55 },
            { key:'Sep', value:75 },
            { key:'Oct', value:50 },
            { key:'Nov', value:60 },
            { key:'Dec', value:75 }
        ]
    let lineColor="blue"
    let yAxisTicks=5
    let yGridTicks=5
    let chartId = "test one"
    let dotColorOuter = "#7dc7f4"
    let dotColorInner = "#3f5175"
    let barColor = "#74d3eb"

    return (
          <div>
            <div class="paddz">
            <LineChart
              chart_data={chart_data}
              lineColor={lineColor}
              yAxisTicks={yAxisTicks}
              yGridTicks={yGridTicks}
              chartId={chartId}
              dotColorInner = {dotColorInner}
              dotColorOuter= {dotColorOuter}
            />

            </div>

            <div>
              <BarChart

              chart_data={chart_data2}
              barColor={barColor}
              yAxisTicks={yAxisTicks}
              yGridTicks={yGridTicks}
              chartId={chartId}

              />
           </div>
          </div>

    )
  }
}

export default ChartExperimental


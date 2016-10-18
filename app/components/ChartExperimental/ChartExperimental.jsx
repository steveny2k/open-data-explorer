
//import { BarChart } from 'react-d3';
import React, { Component } from 'react'
import d3 from 'd3'

import { Grid } from 'react-bootstrap'
import LineChart from './LineChart'
import BarChart from './BarChart'
require('./_ChartExperimental.scss')


class ChartExperimental extends Component {

    render() {
    let item=[
            {day:'02-11-2016',count:180},
            {day:'02-12-2016',count:250},
            {day:'02-13-2016',count:150},
            {day:'02-14-2016',count:496},
            {day:'02-15-2016',count:140},
            {day:'02-16-2016',count:380},
            {day:'02-17-2016',count:100},
            {day:'02-18-2016',count:150}
          ]
    let color="blue"
    return (
          <div>
            <div class="paddz">
            <LineChart
              chart_data={item}
              color={color}
            />
            </div>

            <div>
           <BarChart color={color}/>
           </div>
          </div>

    )
  }
}

export default ChartExperimental


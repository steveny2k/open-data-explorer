
import React, { Component } from 'react'
import d3 from 'd3'

class Bars extends Component {



    render() {

    let _self=this;
    let chart_data= this.props.chart_data
    let x =this.props.x
    let y =this.props.y
    let h = this.props.h
    let barColor = this.props.barColor

    let bars = chart_data.map(function(d,i){

            return (
              <rect fill={barColor} rx="3" ry="3" key={i}
                      x={x(d.key)} y={y(d.value)}
                      height={h-y(d.value)}
                      width={x.rangeBand()} key={i}
                      onMouseOver={_self.props.showToolTip} onMouseOut={_self.props.hideToolTip}
                      data-key="value" data-value={d.value}/>
            )
        })

    return (
            <g>
                {bars}
            </g>
          )
    }

}


Bars.propTypes={
        chart_data:React.PropTypes.array
    }




export default Bars

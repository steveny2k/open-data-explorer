
import React, { Component } from 'react'
import d3 from 'd3'

class Bars extends Component {

    render() {

    let _self=this;
    let data=this.props.data
    let x =this.props.x
    let y =this.props.y
    let h = this.props.h


    let bars = data.map(function(d,i){

            return (
              <rect fill="#74d3eb" rx="3" ry="3" key={i}
                      x={x(d.month)} y={y(d.value)}
                      height={h-y(d.value)}
                      width={x.rangeBand()-2} key={i}
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
        data:React.PropTypes.array
    }

export default Bars

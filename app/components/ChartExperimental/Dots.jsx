
import React, { Component } from 'react'
import d3 from 'd3'

class Dots extends Component {
    ///To do: will need to check the column type to decide
    ///on how to format
    render() {

        let _self=this;

       //remove last & first point
        let dots_data = this.props.chart_data.splice(1)
        //dots_data= dots_data.splice(1)
        console.log(this.props);
        let dotColorOuter = this.props.dotColorOuter
        let dotColorInner = this.props.dotColorInner

        dots_data.pop()

        let circles = dots_data.map(function(d,i){

            return (<circle className="dot" r="7" cx={_self.props.x(d.key)} cy={_self.props.y(d.value)} fill={dotColorOuter}
                            stroke={dotColorInner} strokeWidth="5px" key={i}
                            onMouseOver={_self.props.showToolTip} onMouseOut={_self.props.hideToolTip}
                            data-key={d3.time.format("%b %e")(d.key)} data-value={d.value}/>)
        })

        return (
            <g>
                {circles}
            </g>
        )
    }

}


Dots.propTypes={
        dots_data:React.PropTypes.array,
        x:React.PropTypes.func,
        y:React.PropTypes.func
    }

export default Dots

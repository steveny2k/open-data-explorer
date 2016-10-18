
import React, { Component } from 'react'
import d3 from 'd3'

class Axis extends Component {

    componentDidUpdate() {this.renderAxis(); }
    componentDidMount() {this.renderAxis(); }

    renderAxis() {
        var ReactDOM = require('react-dom');
        var node = ReactDOM.findDOMNode(this)
        d3.select(node).call(this.props.axis)
    }


    render() {

        var translate = "translate(0,"+(this.props.h)+")";

        return (
            <g className="axis" transform={this.props.axisType=='x'?translate:""}>
            </g>
        )
    }

}


Axis.propTypes = {

    h: React.PropTypes.number,
    axis:React.PropTypes.func,
    axisType:React.PropTypes.oneOf(['x','y'])
}

export default Axis

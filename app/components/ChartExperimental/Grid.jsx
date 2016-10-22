

import React, { Component } from 'react'

import d3 from 'd3'

class Grid extends Component {

    componentDidUpdate() { this.renderGrid(); }
    componentDidMount() { this.renderGrid(); }

    renderGrid() {
        var ReactDOM = require('react-dom');
        var node = ReactDOM.findDOMNode(this);
        d3.select(node).call(this.props.grid);

    }

    render() {

        var translate = "translate(0,"+(this.props.h)+")";

        return (
             <g className="y-grid" transform={this.props.gridType=='x'?translate:""}>
            </g>
        )
    }

}



Grid.propTypes = {
        h:React.PropTypes.number,
        grid:React.PropTypes.func,
        gridType:React.PropTypes.oneOf(['x','y'])
}


export default Grid

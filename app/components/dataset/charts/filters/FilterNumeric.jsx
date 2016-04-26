require('rc-slider/assets/index.css')

import React from 'react'
import {Button} from 'react-bootstrap'
import update from 'react-addons-update'
import Slider from 'rc-slider'

export default class FilterNumeric extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			range: [0,0]
		}

		this.updateInputRange = this.updateInputRange.bind(this)
		this.updateSliderRange = this.updateSliderRange.bind(this)
		this.cancelUpdate = this.cancelUpdate.bind(this)
		this.applyUpdate = this.applyUpdate.bind(this)
	}

	log(value) {
		console.log(value)
	}

	updateInputRange(value) {
		this.setState({
			range: value
		})
	}

	updateSliderRange(minOrMax, ev) {
		console.log(minOrMax)
		console.log(ev.target.value)
		let newRange = []
		if(minOrMax == 'min') {
			newRange = update(this.state.range, {$set: [parseInt(ev.target.value), this.state.range[1]]})
		} else {
			newRange = update(this.state.range, {$set: [this.state.range[0],parseInt(ev.target.value)]})
		}
		console.log(newRange)
		this.setState({
			range: newRange
		})
	}

	cancelUpdate() {
		this.setState({
			range: this.props.range
		})
	}

	applyUpdate() {
		let options = {
			key: this.props.filter.key,
			range: this.state.range
		}

		this.props.onFilter(options)
	}

	componentDidMount() {
		this.setState({
			range: this.props.range
		})
	}

	render() {
		let {range, ...props} = this.props
		let style = {
			marginBottom: 15
		}

		let applyOrCancel = null
		if(this.props.range !== this.state.range) {
			applyOrCancel = (<div style={{textAlign: 'right'}}><Button bsStyle="warning" bsSize="xs" onClick={this.cancelUpdate}>Cancel</Button> <Button bsStyle="success" bsSize="xs" onClick={this.applyUpdate}>Apply</Button></div>)
		}

		return(
			<div>
			<div className="input-group input-group-sm" style={style}>
		    <input type="text" className="form-control" placeholder="Min" value={this.state.range[0]} onChange={this.updateSliderRange.bind(this,'min')}/>
		    <span className="input-group-addon">to</span>
		    <input type="text" className="form-control" placeholder="Max" value={this.state.range[1]} onChange={this.updateSliderRange.bind(this,'max')}/>
			</div>
			<Slider range 
			{...props}
			allowCross={false} 
			defaultValue={range}
			value={this.state.range}
			onChange={this.updateInputRange} 
			style={style}/>
			{applyOrCancel}
			</div>
		)
	}
}
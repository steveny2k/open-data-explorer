import './_loading.scss'

import React, { Component, PropTypes } from 'react'
class Loading extends Component {

  render () {
    let { isFetching } = this.props
    let style = this.props.style ? this.props.style : ''
    let classNames = `Loading-wrapper ${style}`
    return (
      <div>
        {isFetching
        ? <div className={classNames}>
          <div className='Loading-indicator'>
            <svg viewBox='0 0 32 16' width='220' fill='#476481'>
              <circle transform='translate(8 0)' cx='0' cy='8' r='0'>
                <animate attributeName='r' values='0; 4; 0; 0' dur='1.2s' repeatCount='indefinite' begin='0'
                  keyTimes='0;0.2;0.7;1' keySplines='0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8' calcMode='spline' />
              </circle>
              <circle transform='translate(16 0)' cx='0' cy='8' r='0'>
                <animate attributeName='r' values='0; 4; 0; 0' dur='1.2s' repeatCount='indefinite' begin='0.3'
                  keyTimes='0;0.2;0.7;1' keySplines='0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8' calcMode='spline' />
              </circle>
              <circle transform='translate(24 0)' cx='0' cy='8' r='0'>
                <animate attributeName='r' values='0; 4; 0; 0' dur='1.2s' repeatCount='indefinite' begin='0.6'
                  keyTimes='0;0.2;0.7;1' keySplines='0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8' calcMode='spline' />
              </circle>
            </svg>
          </div>
        </div> : this.props.children
      }
      </div>
    )
  }
}

Loading.propTypes = {
  isFetching: PropTypes.bool,
  height: PropTypes.number
}

export default Loading

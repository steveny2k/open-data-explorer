import React, { PropTypes, Component } from 'react'
import { Alert } from 'react-bootstrap'

const Message = (props) => (
  props.type
  ? <Alert bsStyle='danger'>
    <h4>Error</h4>
    <p>{props.message}</p>
  </Alert> : false
)

class Messages extends Component {
  render () {
    let { messages } = this.props

    return (
      <div className='Messages-wrapper'>
        <Message type={messages.type} message={messages.message} />
        {(messages.type !== 'error' && this.props.children)
          ? this.props.children : false }
      </div>
    )
  }
}

Messages.propTypes = {
  messages: PropTypes.object.isRequired
}

export default Messages

import React, { PropTypes, Component } from 'react'
import { FormControl, Button } from 'react-bootstrap'

class CopyEmbedLink extends Component {
  render () {
    let { link } = this.props
    return (
      <div>
        <FormControl
          type='text'
          readOnly
          value={link}
          onFocus={() => { this.select() }}
          />
        <Button>Copy</Button>
      </div>
    )
  }
}

CopyEmbedLink.propTypes = {
  link: PropTypes.string.isRequired
}

export default CopyEmbedLink

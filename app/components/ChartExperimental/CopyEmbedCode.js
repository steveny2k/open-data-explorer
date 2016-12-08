import React, { PropTypes, Component } from 'react'
import { Form, FormGroup, FormControl, Button } from 'react-bootstrap'
import CopyToClipboard from 'react-copy-to-clipboard'

class CopyEmbedCode extends Component {

  render () {
    let { snippet } = this.props
    return (
      <div class='CopyEmbedLink-wrapper'>
        <h3>Embed this visual</h3>
        <Form inline>
          <FormGroup controlId='formInlineName'>
            <FormControl
              type='text'
              readOnly
              value={snippet}
              onFocus={() => { this.select() }}
              />
          </FormGroup>
          <CopyToClipboard text={snippet}>
            <Button>Copy</Button>
          </CopyToClipboard>
        </Form>
      </div>
    )
  }
}

CopyEmbedCode.propTypes = {
  snippet: PropTypes.string.isRequired
}

export default CopyEmbedCode

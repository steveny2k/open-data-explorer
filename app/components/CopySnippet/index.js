import './_CopySnippet.scss'

import React, { PropTypes, Component } from 'react'
import { Form, FormGroup, FormControl, Button } from 'react-bootstrap'
import CopyToClipboard from 'react-copy-to-clipboard'

class CopySnippet extends Component {
  constructor (props) {
    super(props)

    this.state = {
      copied: false
    }

    // this.handleCopy = this.handleCopy.bind(this)
  }

  handleFocus (ev) {
    ev.target.select()
  }

  handleCopy (ev) {
    this.setState({copied: true})
    setTimeout(() => {
      this.setState({copied: false})
    }, 2000)
  }

  render () {
    let { snippet } = this.props
    return (
      <div className='CopyEmbedLink-wrapper'>
        <h3>Embed this visual</h3>
        <small className='text-muted'>Copy the code snippet below and embed in your website</small>
        <Form inline>
          <FormGroup controlId='formInlineName'>
            <FormControl
              type='text'
              readOnly
              value={snippet}
              onClick={this.handleFocus}
              />
          </FormGroup>
          <CopyToClipboard text={snippet} onCopy={this.handleCopy.bind(this)}>
            <Button className={this.state.copied ? 'copied' : 'not-copied'}>
              {this.state.copied ? 'Copied!' : 'Copy'}
            </Button>
          </CopyToClipboard>
        </Form>
      </div>
    )
  }
}

CopySnippet.propTypes = {
  snippet: PropTypes.string.isRequired
}

export default CopySnippet

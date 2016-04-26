import React, { Component, PropTypes } from 'react'
import { MenuItem, DropdownButton } from 'react-bootstrap'

const downloadTypes = {
  'csv': 'CSV',
  'xls': 'Excel 2003',
  'xlsx': 'Excel 2007+',
  'geojson': 'GeoJSON',
  'json': 'JSON'
}
// should be abstracted more to allow different download template links based or an array of link options, maybe can be loaded as part of middleware?
class DownloadLinks extends Component {

  render () {
    let options = Object.keys(downloadTypes)
    let { apiDomain, id } = this.props
    let menuItems = options.map(function (type, i) {
      let downloadLink = 'https://' + apiDomain + '/api/views/' + id + '/rows.' + type + '?accessType=DOWNLOAD'
      return (
        <MenuItem href={downloadLink} key={i} eventKey={i}>
          {downloadTypes[type]}
        </MenuItem>
      )
    })

    return (
      <DropdownButton title='Download' id='bg-nested-dropdown' bsStyle='primary'>
        {menuItems}
      </DropdownButton>
    )
  }
}

export default DownloadLinks

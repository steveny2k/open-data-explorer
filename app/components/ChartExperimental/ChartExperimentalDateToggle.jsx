






renderDateToggle () {
    let {dateBy, changeDateBy} = this.props
    let monthActive = dateBy === 'month' ? 'active' : ''
    let yearActive = dateBy === 'year' ? 'active' : ''
    return (
      <ButtonGroup className='ChartCanvasToggleTime'>
        <Button
          bsStyle='success'
          bsSize='small'
          onClick={() => { changeDateBy('month') }}
          className={monthActive}>
          Month
        </Button>
        <Button
          bsStyle='success'
          bsSize='small'
          onClick={() => { changeDateBy('year') }}
          className={yearActive}>
          Year
        </Button>
      </ButtonGroup>)
  }

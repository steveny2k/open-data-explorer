import React from 'react';

class HomePage extends React.Component {

  render() {
    return (

  <section id="jumbo-search" className={'jumbotron jumbotron-default homepage'}>
    <div className={'container'}>
      <h1>Find the data you need</h1>
      <p>Search hundreds of datasets from the City and County of San Francisco. Or browse on the <a href="#/catalog" className={'ext-sf-opendata'}>data catalog</a></p>
      <div className={'row'}>
        <form action="https://data.sfgov.org/data" role="form" className={'form-inline'}>
          <div className={'col-md-9'}>
            <input id="homepageSearch" className={'search-input form-control input-mysize'} type="text" name="search" placeholder="Search for data, etc."/>
          </div>
          <div className={'col-md-3'}>
            <button className={'btn btn-default btnSearch'} type="submit"><i className={'glyphicon glyphicon-search'}></i></button>
          </div>
        </form>
      </div>
    </div>
  </section>
    );
  }
}

export default HomePage;

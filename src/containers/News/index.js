import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as PaginateActions from '../../actions/PaginateActions'
import * as NewsActions from '../../actions/NewsActions'
import {ROOT_URL} from '../../constants/Common'

import {NewsList} from '../../components/News'
import Paginator from '../Paginator'

class News extends Component {

  componentDidMount() {
    let nextPage = + (this.props.params.page || 1);
    this.props.PreparePagination('news', 1,
        5, ROOT_URL + '/news', nextPage);
  }

  componentWillReceiveProps(nextProps) {
    let nextPage = + (nextProps.params.page || 1);
    let page = + (this.props.params.page || 1);
    if (nextPage != page) {
      this.props.GoPage('news', nextPage);
    }
  }

  render() {    
    let items = this.props.news;
    return (
      <div className='container'>
        <h1>Раздел новости</h1>
        <Paginator objKey='news' linkURL='/news'/>
        <NewsList items={items}/>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    news: state.news && state.news.data || [],
    objCount: state.objCount['news']
  }
}

function mapDispatchToProps(dispatch) {
  return {
    PreparePagination: (objKey, perPage, navMaxCnt, linkURL, nextPage) => {
      dispatch(PaginateActions.InitializePages(
          objKey,
          bindActionCreators(NewsActions.loadNewsLength, dispatch),
          perPage,
          navMaxCnt,
          linkURL,
          bindActionCreators(NewsActions.loadNews, dispatch),
          nextPage));
    },
    GoPage: bindActionCreators(PaginateActions.GoPage, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(News)

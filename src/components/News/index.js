import React, { Component } from 'react'
import './styles.scss'
import { Link } from 'react-router'
import Paginator from '../Paginator'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as PaginateActions from '../../actions/PaginateActions'
import * as NewsActions from '../../actions/NewsActions'
import {ROOT_URL, STATIC_URL} from '../../constants/Common';

export class NewsItem extends Component {
  constructor(props) {
    super(props);
    this.state = {isFullText: false};
  }


  render() {
    let options = {year: 'numeric',
                   month: 'long',
                   day: 'numeric'
                  };
    let published = this.props.published && this.props.published.toLocaleString('ru', options);
    let isFullText =  this.props.isFullText;
    let id = this.props.keyValue;
    return(
      <li key={id}>
        <div className='row'>
          <div className='col-md-2'>
            <img src={this.props.imageURL} style={{height:150,width:150}}/>
          </div>
          <div className='col-md-8'>
            <Link className='h3' to={'/news/' + id}>{this.props.caption}</Link>
            <p className='news_published'>{published}</p>
            <p><span>{this.props.text}</span>{isFullText > 0? <span><Link className='h3' to={'/news/' + id}>...</Link></span>: ''}</p>
          </div>
        </div>
      </li>
    )
  }
}


class News extends Component {
  componentDidMount() {
    let nextPage = + (this.props.params.page || 1);
    this.props.newsActions.loadNewsLength('news')
                          .then(() => {
                             let objCount = this.props.objCount.data;
                             this.props.paginateActions.PreparePagination(
                                'news', 1, objCount, 5, ROOT_URL + '/news', this.props.newsActions.loadNews);
                             this.props.paginateActions.GoPage('news', nextPage);
                          })
                          .catch((error) => {
                            console.log(error);
                          })
  }

  componentWillReceiveProps(nextProps) {
    let nextPage = + (nextProps.params.page || 1);
    let page = + (this.props.params.page || 1);
    if (nextPage != page) {
      this.props.paginateActions.GoPage('news', nextPage);
    }
  }

  render() {
    let items = this.props.news && this.props.news.data;
    let template = '';
    if (items) {
      template = items.map(function(item) {
        let idx = item.id;
        let caption = item.caption;
        let text = item.text;
        let published = new Date(item.releaseDate);
        let isFullText = item.isFullText;
        let imgURL = item.imgURL;

        return <NewsItem
                 imageURL={imgURL || STATIC_URL + '/news.jpg'}
                 keyValue={idx}
                 published={published}
                 caption={caption}
                 text={text}
                 isFullText={isFullText}
              />
      })
    }

    return (
      <div className='container'>
        <h1>Раздел новости</h1>
        <Paginator objKey='news' linkURL='/news'/>
        <ul type='none'>
          {template}
        </ul>
      </div>
    )
  }
}
function mapStateToProps(state) {
  return {
    paginate: state.paginate['news'],
    news: state.news,
    objCount: state.objCount['news']
  }
}

function mapDispatchToProps(dispatch) {
  return {
    paginateActions: bindActionCreators(PaginateActions, dispatch),
    newsActions: bindActionCreators(NewsActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(News)

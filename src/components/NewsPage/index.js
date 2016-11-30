import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as NewsActions from '../../actions/NewsActions'
import './styles.scss'
import {STATIC_URL} from '../../constants/Common';


class NewsPage extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let id = + (this.props.params.id || 1);
    this.props.actions.loadNewsPage(id);
  }

  componentWillReceiveProps(nextProps) {
    let nextId = + (nextProps.params.id || 1);
    let id = + (this.props.params.id || 1);

    if (id !== nextId) {
      this.props.actions.loadNewsPage(nextId)
    }
  }

  render() {
    let options = {year: 'numeric',
                   month: 'long',
                   day: 'numeric'
                  };
    let published = this.props.published && this.props.published.toLocaleString('ru', options);
    let {text, fullText} = this.props;
    return(
      <div className='container'>
        <h3>{this.props.caption}</h3>
        <p className='news_published'>{published}</p>
        <div className='row'>
          <div className='col-md-2'>
            <img src={this.props.imageURL} style={{height:150,width:150}}/>
          </div>
          <div className='news_text'>
            {fullText? fullText: text}
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  let newsPage = state.newsPage.data;
  return {
    published: newsPage && newsPage.releaseDate && new Date(newsPage.releaseDate),
    imageURL: newsPage && (newsPage.imageURL || STATIC_URL + '/news.jpg'),
    caption: newsPage && newsPage.caption,
    text: newsPage && newsPage.text,
    fullText: newsPage && newsPage.fullText
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(NewsActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewsPage)

import React, { Component } from 'react'
import './styles.scss'
import { Link } from 'react-router'
import {STATIC_URL} from '../../constants/Common';

export class NewsItem extends Component {
  static propTypes = {
    published: React.PropTypes.object.isRequired,
    isFullText: React.PropTypes.bool.isRequired,
    keyValue: React.PropTypes.string.isRequired,
    imageURL: React.PropTypes.string.isRequired,
    caption: React.PropTypes.string.isRequired,
    text: React.PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
  }

  render() {
    let options = {year: 'numeric',
                   month: 'long',
                   day: 'numeric'
                  };
    let published = this.props.published && this.props.published.toLocaleString('ru', options);
    let isFullText =  this.props.isFullText;
    let id = this.props.keyValue;
    let key_ = 'news_' + id;
    return(
      <li key={key_}>
        <div className='row'>
          <div className='col-md-2'>
            <img src={this.props.imageURL} style={{height:150,width:150}}/>
          </div>
          <div className='col-md-8'>
            <Link className='h3' to={'/news/' + id}>{this.props.caption}</Link>
            <p className='news_published'>{published}</p>
            <p><span>{this.props.text}</span>{isFullText? <span><Link className='h3' to={'/news/' + id}>...</Link></span>: ''}</p>
          </div>
        </div>
      </li>
    )
  }
}

export class NewsList extends Component {
  static propTypes = {
    items: React.PropTypes.array
  }

  render() {
    let items = this.props.items;
    let template = '';
    if (items) {
      template = items.map(function(item) {
        let idx = item.id;
        let caption = item.caption;
        let text = item.text;
        let published = new Date(item.releaseDate);
        let isFullText = item.isFullText > 0;
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
      <div>
        <ul type='none'>
          {template}
        </ul>
     </div>
    )
  }
}

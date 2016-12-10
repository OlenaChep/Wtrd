import React, { Component } from 'react'
import './styles.scss'

export default class NewsPage extends Component {
  static propTypes = {
    published: React.PropTypes.object.isRequired,
    imageURL: React.PropTypes.string.isRequired,
    caption: React.PropTypes.string.isRequired,
    text: React.PropTypes.string.isRequired,
    fullText : React.PropTypes.string,
    loadNewsPage: React.PropTypes.func.isRequired
  }
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let id = + (this.props.params.id || 1);
    this.props.loadNewsPage(id);
  }

  componentWillReceiveProps(nextProps) {
    let nextId = + (nextProps.params.id || 1);
    let id = + (this.props.params.id || 1);

    if (id !== nextId) {
      this.props.loadNewsPage(nextId)
    }
  }

  render() {
    let options = {year: 'numeric',
                   month: 'long',
                   day: 'numeric'
                  };
    let published = this.props.published && this.props.published.toLocaleString('ru', options);
    let {text, fullText} = this.props;
    let txtTemplate;
    if (!fullText) {
      txtTemplate = (text)
    } else {
      txtTemplate = (fullText)
    }
    return(
      <div className='container'>
        <h3>{this.props.caption}</h3>
        <p className='news_published'>{published}</p>
        <div className='row'>
          <div className='col-md-2'>
            <img src={this.props.imageURL} style={{height:150,width:150}}/>
          </div>
          <div className='news_text'>
            {txtTemplate}
          </div>
        </div>
      </div>
    )
  }
}

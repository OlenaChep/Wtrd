import React, { Component } from 'react'
import { Link } from 'react-router'

export default class Paginator extends Component {
   propTypes: {
        objKey: React.PropTypes.string.isRequired,
        linkURL: React.PropTypes.string.isRequired,
        pageCount: React.PropTypes.number.isRequired,
        currPage: React.PropTypes.number,
        firstPage: React.PropTypes.number,
        navMaxCnt: React.PropTypes.number
   }

   constructor(props) {
     super(props);
   }

  getLink(nextPage, pageCount, linkURL) {
    if (nextPage <= 1) {
      return linkURL;
    } else {
      return linkURL + '/page/' + (nextPage >= pageCount? pageCount: nextPage);
    }
  }

  render() {
    let currPage = this.props.currPage;
    let firstPage = this.props.firstPage;
    let pageCount = this.props.pageCount;
    let navMaxCnt = this.props.navMaxCnt;
    let linkURL = this.props.linkURL;
    let template = [];
    if (pageCount > 1) {
      template = new Array(navMaxCnt + 2);
      //Prev button

      template[0] = <li key={0} className={currPage > 1? '': 'disabled'}><Link to={::this.getLink(currPage - 1, pageCount, linkURL)}>&laquo;</Link></li>
      //Nav page number buttons
      for(let i = 1; i <= navMaxCnt; i++) {
        let page = (firstPage + i - 1);
        template[i] = <li key={i} className={page === currPage? 'active': ''}><Link to={::this.getLink(page, pageCount, linkURL)}>{page}</Link></li>
      }
      //Next button
      template[navMaxCnt + 1] = <li key={navMaxCnt + 1} className={currPage < pageCount ? '': 'disabled'}><Link to={::this.getLink(currPage + 1, pageCount, linkURL)}>&raquo;</Link></li>
    }
    return (
      <ul className='pagination pagination-sm'>
        {template}
      </ul>
    )
  }
}

Paginator.defaultProps = {
  navMaxCnt: 5,
  currPage: 1,
  firstPage: 1,
  pageCount: 1
};

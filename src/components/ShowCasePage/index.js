import React, {Component} from 'react'

import TreeView from '../TreeView'
import {ThumbnailsView} from '../ThumbnailsView'
import Paginator from '../../containers/Paginator'

export default class ShowCasePage extends Component{
  constructor(props) {
    super(props);
    //this.state = {selectedCategory: undefined, thumbnailComp: 'ProductCategoryCard'};
  }

  needCloseCategoriesNode(location) {
    let result = false;
    if (location.query && location.query.hasOwnProperty('open') && (location.query.open === 'false')) {
      result = true
    }
    return result;
  }

  componentDidMount() {
    this.props.categories.load().then(() => {
      let selectedCategory = +this.props.params.category;
      let needClose = this.needCloseCategoriesNode(this.props.location);
      let page = + (this.props.params.page || 1);
      if (selectedCategory) {
          this.props.categories.select(selectedCategory, needClose, page);
      } else {
        this.props.categories.select();
      }
    });
  }

  componentWillReceiveProps(nextProps) {

    let nextCategory = +nextProps.params.category;
    let category = +this.props.params.category;
    let nextNeedClose = this.needCloseCategoriesNode(nextProps.location);
    let needClose = this.needCloseCategoriesNode(this.props.location);
    let nextPage = + (nextProps.params.page || 1);
    let page = + (this.props.params.page || 1);
    let nextItems = nextProps.params.items;

    if ((( category || nextCategory) && (category !== nextCategory)) || (needClose !== nextNeedClose)) {
      this.props.categories.select(nextCategory, nextNeedClose, nextPage);
    } else if (nextCategory && nextItems && (nextPage !== page)) {
       this.props.items.goPage(nextItems, nextPage);
    }
  }

/*
  onNodeClick(togglable, item) {
    this.props.actions.selectProductCategory(item.id, item.children);
  }*/

  onItemClick(id) {
    alert('bbbb' + id);
  }

  getNodeURL(id, isBranch, doOpen) {
    if (isBranch) {
      return { pathname: this.props.categories.pageURL + '/' + id, query: { open: doOpen } }
    } else {
      return this.props.categories.pageURL + '/' + id + this.props.items.pageURL;
    }
  }

  render() {
    let selector = this.props.categoriesSelector;
    let categories = this.props.categories;
    let items = this.props.items;
    
    return (
      <div className='row mainFrame'>
      <h1>{this.props.caption}</h1>
      <div className='col-md-4 treeView'>
        <TreeView
          treeData={categories.treeData}
          plainData={categories.plainData}
          selected={selector.selected}
          opened={selector.opened}
          getNodeURL={::this.getNodeURL}
        />
      </div>
      <div className='col-md-8 listView'>
        {!items.data || (items.data.length === 0)? <p>{this.props.items.noItemsMsg}</p>: null}
        {!selector.children && (items.pageCount > 1) ? <Paginator objKey={items.paginateKey} linkURL={items.linkURL}/>: null}
        <ThumbnailsView
           galleryClassName='gallery'
           itemClassName='col-md-4 listViewItem'
           data = {items.data}
           thumbnailComp = {items.widget}
           linkURL = {items.linkURL}
        />
      </div>
      </div>
    )
  }
}

ShowCasePage.propTypes = {
    caption: React.PropTypes.string,

    categories: React.PropTypes.shape({
      treeData: React.PropTypes.object,
      plainData: React.PropTypes.array,
      pageURL: React.PropTypes.string.isRequired,
      load: React.PropTypes.func.isRequired,
      select: React.PropTypes.func.isRequired
    }),

    categoriesSelector: React.PropTypes.shape({
      selected: React.PropTypes.number,
      opened: React.PropTypes.arrayOf(React.PropTypes.number),
      children: React.PropTypes.array
    }),

    items: React.PropTypes.shape({
      data: React.PropTypes.array,
      pageURL: React.PropTypes.string.isRequired,
      noItemsMsg: React.PropTypes.string,
      paginateKey: React.PropTypes.string.isRequired,
      widget: React.PropTypes.string,
      linkURL: React.PropTypes.string.isRequired,
      pageCount: React.PropTypes.number,
      goPage: React.PropTypes.func.isRequired
    })
}

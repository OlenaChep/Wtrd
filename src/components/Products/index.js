import React, {Component} from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as ProductActions from '../../actions/ProductActions'
import * as PaginateActions from '../../actions/PaginateActions'

import TreeView from '../TreeView'
import {ThumbnailsView} from '../ThumbnailsView'
import Paginator from '../Paginator'

import './styles.scss'

export class Products extends Component{
  constructor(props) {
    super(props);
    this.state = {selectedCategory: undefined, thumbnailComp: 'ProductCategoryCard'};
  }

  needCloseCategoriesNode(location) {
    let result = false;
    if (location.query && location.query.hasOwnProperty('open') && (location.query.open === 'false')) {
      result = true
    }
    return result;
  }

  componentDidMount() {
    this.props.actions.loadProductCategoriesIfNeed().then(() => {
      let selectedCategory = +this.props.params.category;
      let needClose = this.needCloseCategoriesNode(this.props.location);
      let page = + (this.props.params.page || 1);
      if (selectedCategory) {
          this.props.actions.selectCategory(selectedCategory, needClose, page);
      } else {
        this.props.actions.selectCategory();
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
      this.props.actions.selectCategory(nextCategory, nextNeedClose, nextPage);
    } else if (nextCategory && nextItems && (nextPage !== page)) {
       this.props.paginateActions.GoPage('goods', nextPage);
    }
  }


  onNodeClick(togglable, item) {
    this.props.actions.selectProductCategory(item.id, item.children);
  }

  onItemClick(id) {
    alert('bbbb' + id);
  }

  getNodeURL(id, isBranch, doOpen) {
    if (isBranch) {
      return { pathname: '/products/category/' + id, query: { open: doOpen } }
    } else {
      return '/products/category/' + id + '/goods';
    }
  }

  render() {
    let treeProductCategories = this.props.treeProductCategories;
    let listProductCategories = this.props.listProductCategories;
    let selector = this.props.selector;
    let products = this.props.products;
    let data;
    let thumbnailComp;
    let linkURL;

    if (!listProductCategories) {
      data = products;
      thumbnailComp = 'ProductCard';
      linkURL='/products/category/' + (selector.selected || 0) + '/goods';
    } else {
      data = listProductCategories;
      thumbnailComp = 'ProductCategoryCard';
      linkURL='/products/category/';
    }

    return (
      <div className='row mainFrame'>
      <h1>Продукция</h1>
      <div className='col-md-4 treeView'>
        <TreeView
          treeData={treeProductCategories && treeProductCategories.tree}
          plainData={treeProductCategories && treeProductCategories.plain}
          selected={selector.selected}
          opened={selector.opened}
          getNodeURL={::this.getNodeURL}
        />
      </div>
      <div className='col-md-8 listView'>
        {!data || (data.length === 0)? <p>Нет товаров в выбранной категории</p>: ''}
        {!selector.children ? <Paginator objKey='goods' linkURL={linkURL}/>: ''}
        <ThumbnailsView
           galleryClassName='gallery'
           itemClassName='col-md-4 listViewItem'
           onItemClick={::this.onItemClick}
           data = {data}
           thumbnailComp = {thumbnailComp}
           linkURL = {linkURL}
        />
      </div>
      </div>
    )
  }
}


function mapStateToProps(state) {
  return {
    treeProductCategories: state.productCategories.main && state.productCategories.main.data,
    listProductCategories: state.productCategories.selector && state.productCategories.selector.children,
    selector:  state.productCategories.selector,
    paginate: state.paginate['goods'],
    products: state.products.data
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(ProductActions, dispatch),
    paginateActions: bindActionCreators(PaginateActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Products)

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as ProductActions from '../../actions/ProductActions'
import * as PaginateActions from '../../actions/PaginateActions'

import ShowCasePage from '../../components/ShowCasePage'
import './styles.scss'

function mapStateToProps(state) {
  let treeData = state.productCategories.main.data;

  let selector = state.productCategories.selector;

  let items_ = {
      pageURL: '/goods',
      noItemsMsg: 'Нет товаров в выбранной категории',
      paginateKey: 'goods',
      pageCount: (state.paginate['goods'] && state.paginate['goods'].pageCount) || 0
  };
  if (!selector.children) {
    items_.data = state.products.data;
    items_.widget = 'ProductCard';
    items_.linkURL = '/products/category/' + (selector.selected || 0) + '/goods';
  } else {
    items_.data = selector.children;
    items_.widget = 'ProductCategoryCard';
    items_.linkURL= '/products/category/';
  }

  return {
    caption: 'Продукция',
    categories: {
      treeData: treeData && treeData.tree,
      plainData: treeData && treeData.plain,
      pageURL: '/products/category'
    },
    categoriesSelector: {
      selected: selector.selected,
      opened: selector.opened,
      children: selector.children
    },
    items: items_
  }
}

function mapDispatchToProps(dispatch) {
  return {
    load: bindActionCreators(ProductActions.loadProductCategoriesIfNeed, dispatch),
    select: bindActionCreators(ProductActions.selectCategory, dispatch),
    goPage: bindActionCreators(PaginateActions.GoPage, dispatch)
  }
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  stateProps.categories.load = dispatchProps.load;
  stateProps.categories.select = dispatchProps.select;
  stateProps.items.goPage = dispatchProps.goPage;

  return Object.assign({}, ownProps, stateProps, dispatchProps);
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ShowCasePage)

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as OrderActions from '../../actions/OrderActions'

import {GridView} from '../../components/GridView'
import {sumCellRenderer} from '../../components/GridView'
import './styles.css'

class OrderSpec extends Component {
  static propTypes = {
    token: React.PropTypes.string,
    getOrderSpec: React.PropTypes.func,
    getLoading: React.PropTypes.func
  }

  constructor(props) {
    super(props);
    this.columnDefs =  [
        {headerName: 'Наименование', field: 'goods', width: 150},
        {headerName: 'Кол-во', field: 'quantity', cellRenderer: sumCellRenderer, filter: 'number'},
        {headerName: 'Цена', field: 'price', cellRenderer: sumCellRenderer, filter: 'number'},
        {headerName: 'Сумма', field: 'sum_', cellRenderer: sumCellRenderer, filter: 'number'}
    ];
  }

  getOrderId() {
    return this.props.data.id;
  }

  onRefreshData(e) {
    e.preventDefault();
    let orderId = this.getOrderId();
    if (orderId) {
      this.props.actions.loadOrderSpec(orderId, this.props.token);
    }
  }

  componentDidMount() {
    this.props.actions.loadOrderSpec(this.getOrderId(), this.props.token);
  }

  componentWillReceiveProps(nextProps) {
    if ((this.props.data.id !== nextProps.data.id) ||
        (nextProps.token !== this.props.token)) {
      this.props.actions.loadOrderSpec(nextProps.data.id, nextProps.token);
    }
  }

  render() {
    let orderId = this.getOrderId();

    let rowData = this.props.getOrderSpec(orderId);
    let loading = this.props.getLoading(orderId);

    let height = 150;
    return (
      <div className='full-width-panel'>
        <GridView
          height={height}
          columnDefs={this.columnDefs}
          rowData={rowData}
          onRefreshData={::this.onRefreshData}
          divViewClassName=''
          loading={loading}
        />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    getOrderSpec: (orderId) => {return state.orderSpec && state.orderSpec[orderId] && state.orderSpec[orderId].items || []},
    getLoading: (orderId) => {return state.orderSpec && state.orderSpec[orderId] && state.orderSpec[orderId].loading},
    token: state.user && state.user.token
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(OrderActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderSpec)

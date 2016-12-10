import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as OrderActions from '../../actions/OrderActions'
import * as GridActions from '../../actions/GridActions'
//import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import {GridView} from '../../components/GridView'
import {sumCellRenderer} from '../../components/GridView'
import {dateCellRenderer} from '../../components/GridView'
import {localeRUTextFunc} from '../../components/GridView'
import {phaseCellRenderer} from '../../components/GridView'


import OrderSpec from '../../containers/OrderSpec'
import CollapseImg from './collapse-icon.png'

class OrderExtBtnGroup extends Component {
  collapse(e) {
    this.props.collapse && this.props.collapse(e);
  }

  render() {
    return (
      <div className='btn-group'>
         <button className='btn btn-default'
                 onClick={::this.collapse}
         ><img src={CollapseImg} alt='Закрыть узлы'/></button>
      </div>
    )
  }
}

class Orders extends Component {
  static propTypes = {
    userId: React.PropTypes.number,
    token: React.PropTypes.string,
    orders: React.PropTypes.array,
    loading:  React.PropTypes.bool
  }

  constructor(props) {
    super(props);
    this.orderGridName = 'orders';
    this.columnDefs =  [
        {headerName: 'ID', field: 'id', filter: 'number', cellRenderer: 'group'},
        {headerName: 'Дост', field: 'phase', filter: 'number', cellRendererFramework: phaseCellRenderer, cellStyle: {'text-align': 'center'}},
        {headerName: 'Дата', field: 'releaseDate', cellRenderer: dateCellRenderer},
        {headerName: 'Клиент', field: 'contractorName'},
        {headerName: 'Валюта', field: 'currency'},
        {headerName: 'Курс', field: 'rate', filter: 'number'},
        {headerName: 'Сумма', field: 'total_sum', cellRenderer: sumCellRenderer, filter: 'number'},
        {headerName: 'Тип доставки', field: 'delivery_type'},
        {headerName: 'Место доставки', field: 'delivery_point'}

        //{headerName: 'Дата произв.', field: 'realDate', cellRenderer: dateCellRenderer},
        //{headerName: 'Дата отгр.', field: 'finalDate', cellRenderer: dateCellRenderer},
    ];
    this.gridOptions = {
      enableSorting: true,
      enableFilter: true,
      localeTextFunc: localeRUTextFunc,
      rowSelection: 'single',
      doesDataFlower: function() {
        return true;
      },
      fullWidthCellRendererFramework: OrderSpec,
      isFullWidthCell: function(rowNode) {
        var rowIsNestedRow = rowNode.flower;
        return rowIsNestedRow;
      },
      getRowHeight: function(params) {
        var rowIsNestedRow = params.node.flower;
        return rowIsNestedRow ? 200 : 25;
      }
    }
  }

  selectOrder(orderId) {
    this.props.gridActions.gridSetCurrRowKey(this.orderGridName, orderId);
  }

  GridReadyEvent(params) {
    this.api = params.api;
    this.columnApi = params.columnApi;
  }

  onSelectionChanged() {
    let selectedRows = this.api.getSelectedRows();
    /*let selectedRowsString = '';
    selectedRows.forEach( function(selectedRow, index) {
        if (index!=0) {
            selectedRowsString += ', ';
        }
        selectedRowsString += selectedRow.id;
    });*/
    let id = selectedRows[selectedRows.length - 1].id;
    this.selectOrder(id)
 }


  componentDidMount() {
    this.props.actions.loadOrdersIfNeeded(this.props.userId, this.props.token);
  }

  componentWillReceiveProps(nextProps) {
    if ((nextProps.userId !== this.props.userId) ||
       (nextProps.token !== this.props.token)) {
      this.props.actions.loadOrdersIfNeeded(nextProps.userId, nextProps.token);
    }
  }

  expandAll(expand) {
    this.columnApi.setColumnGroupOpened(0, expand);
  }

  collapseAll() {
    this.api.forEachNode(function(node) {
      if (node.expanded) {
        node.expanded = false;
      }
    });
    this.api.onGroupExpandedOrCollapsed();
  }

  onCollapse(e) {
    e.preventDefault();
    this.collapseAll();
  }

  onRefreshData(e) {
    e.preventDefault();
    this.collapseAll();
    let userId = this.props.userId;
    this.props.actions.loadOrders(userId, this.props.token)
                      .then(() => {
                        if (userId) {
                          this.props.actions.InvalidateAllOrderSpec(userId);
                        }
                       })
                      .catch(error => {alert(error);});
  }


  render() {
    let rowData = this.props.orders;

    let height = 700;
    let loading = this.props.loading;

    return (
      <div className='container'>
        <h1>Заказы</h1>
        <GridView
          height={height}
          columnDefs={this.columnDefs}
          rowData={rowData}
          GridReadyEvent={::this.GridReadyEvent}
          gridOptions={this.gridOptions}
          divViewClassName='row'
          onRefreshData={::this.onRefreshData}
          btnGroups={<OrderExtBtnGroup collapse={::this.onCollapse}/>}
          onSelectionChanged={::this.onSelectionChanged}
          loading={loading}
        />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    token: state.user && state.user.token,
    userId: state.user && state.user.user && state.user.user.id,
    orders: state.orders && state.user && state.user.user && state.orders[state.user.user.id] &&
      state.orders[state.user.user.id].items || [],
    loading: state.user && state.user.user && state.orders && state.orders[state.user.user.id] &&
      state.orders[state.user.user.id].loading
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(OrderActions, dispatch),
    gridActions: bindActionCreators(GridActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Orders)

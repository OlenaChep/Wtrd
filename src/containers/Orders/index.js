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

  getUserId(user) {
    if (!user) {
      return undefined;
    } else {
      return user.id;
    }
  }


  selectOrder(orderId) {
    this.props.gridActions.gridSetCurrRowKey(this.orderGridName, orderId);
  }

  GridReadyEvent(params) {
    this.api = params.api;
    console.log(params.columnApi);
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
    this.props.actions.loadOrdersIfNeeded(this.getUserId(this.props.user.user), this.props.user.token);
  }

  componentWillReceiveProps(nextProps) {
    if ((this.getUserId(nextProps.user.user) !== this.getUserId(this.props.user.user)) ||
       (nextProps.user.token !== this.props.user.token)) {
      this.props.actions.loadOrdersIfNeeded(this.getUserId(nextProps.user.user), nextProps.user.token);
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
    let userId = this.getUserId(this.props.user.user);
    this.props.actions.loadOrders(userId, this.props.user.token)
                      .then(() => {
                        if (userId) {
                          this.props.actions.InvalidateAllOrderSpec(userId);
                        }
                       })
                      .catch(error => {alert(error);});


  }


  render() {
    let rowData = [];
    if (this.props.user.user && this.props.orders[this.props.user.user.id]) {
      rowData = this.props.orders[this.props.user.user.id].items;
    }
    let height = 700;
    let loading = this.props.user.user && this.props.orders[this.props.user.user.id] &&
      this.props.orders[this.props.user.user.id].loading;
    //let btnGroup = OrderExtBtnGroup();
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
//
/*

*/

/*
<div className='ag-blue' style={{height: 400}}>
          <AgGridReact
              gridOptions={this.gridOptions}
              columnDefs={this.columnDefs}
              rowData={rowData}
              onGridReady={::this.onGridReady}
              onSelectionChanged={::this.onSelectionChanged}
          />
</div>
onSelectionChanged={::this.onSelectionChanged}
<OrderSpec
  orderId={orderId}
/>*/

//  onGridReady={::this.onGridReady}
/*

*/
/*
<button className='btn btn-primary'
        onClick={::this.clearFilters}
>Очистить фильтр</button>
<div style={{height: 400}} className='ag-blue'>
            <AgGridReact

                // binding to array properties
                gridOptions={this.gridOptions}
                columnDefs={this.state.columnDefs}
                rowData={rowData}
                onGridReady={::this.onGridReady}
            />
        </div>
*/
/*
<BootstrapTable data={ rowData } striped={true} pagination={true} selectRow={selectRowProp}>
  <TableHeaderColumn dataField='id' isKey={ true } dataSort={true}>ID</TableHeaderColumn>
  <TableHeaderColumn dataField='releaseDate' dataFormat={dateFormatter} dataSort={true}>Дата</TableHeaderColumn>
  <TableHeaderColumn dataField='realDate' dataSort={true}>Дата произв.</TableHeaderColumn>
  <TableHeaderColumn dataField='finalDate' dataSort={true}>Дата отгр.</TableHeaderColumn>
  <TableHeaderColumn dataField='currency' dataSort={true}>Валюта</TableHeaderColumn>
  <TableHeaderColumn dataField='rate' dataSort={true}>Курс</TableHeaderColumn>
  <TableHeaderColumn dataField='total_sum' dataFormat={priceFormatter} dataSort={true}>Сумма</TableHeaderColumn>
  <TableHeaderColumn dataField='phase' dataSort={true}>Дост.</TableHeaderColumn>
</BootstrapTable>
*/
function mapStateToProps(state) {
  return {
    user: state.user,
    orders: state.orders,
    grids: state.grids
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(OrderActions, dispatch),
    gridActions: bindActionCreators(GridActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Orders)

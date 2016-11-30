import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as OrderActions from '../../actions/OrderActions'

import {GridView} from '../../components/GridView'
import {sumCellRenderer} from '../../components/GridView'
import './styles.css'

class OrderSpec extends Component {
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
      this.props.actions.loadOrderSpec(orderId, this.props.user.token);
    }
  }

  componentDidMount() {
    this.props.actions.loadOrderSpec(this.getOrderId(), this.props.user.token);
  }

  componentWillReceiveProps(nextProps) {
    if ((this.props.data.id !== nextProps.data.id) ||
        (nextProps.user.token !== this.props.user.token)) {
      this.props.actions.loadOrderSpec(nextProps.data.id, nextProps.user.token);
    }
  }

  render() {
    let rowData = [];
    let orderId = this.getOrderId();
    if (this.props.orderSpec && this.props.orderSpec[orderId]) {
      rowData = this.props.orderSpec[orderId].items;
    }
    let loading = this.props.orderSpec && this.props.orderSpec[orderId] &&
      this.props.orderSpec[orderId].loading;
    /*var selectRowProp = {
           mode: 'radio',
           clickToSelect: true,
           selected: this.state.selected  //give a default selected row.
    };*/
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

/*
*/
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
    orderSpec: state.orderSpec,
    user: state.user
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(OrderActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderSpec)

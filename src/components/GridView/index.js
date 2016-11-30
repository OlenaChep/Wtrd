import React, { Component } from 'react'
import {AgGridReact} from 'ag-grid-react'

import 'ag-grid-root/dist/styles/ag-grid.css';
import 'ag-grid-root/dist/styles/theme-blue.css';
import FilterImg from './filter-delete-icon.png'
import RefreshImg from './Refresh-icon.png'
import {ProgressBar} from '../ProgressBar'

import Phase0Img from './phase0.png'
import Phase1Img from './Phase1.png'
import Phase2Img from './Phase2.png'
import Phase4Img from './Phase4.png'
import Phase5Img from './Phase5.png'

let Phases = {0: Phase0Img, 1: Phase1Img, 2: Phase2Img, 4: Phase4Img, 5: Phase5Img};

let localeTextRu = {
        // for number filter and text filter
        filterOoo: 'Фильтр...',
        applyFilter: 'Фильтровать...',
        // for number filter
        equals: '=',
        notEqual: '!=',
        lessThan: '<',
        lessThanOrEqual: '<=',
        greaterThan: '>',
        greaterThanOrEqual: '>=',
        // for text filter
        contains: 'Содержит',
        startsWith: 'Начинается с',
        endsWith: 'Кончается на',
        notEquals: '!=',
        noRowsToShow: 'Нет данных'
}

export function sumCellRenderer(params) {
    return params.value.toFixed(2).replace(/./g, function(c, i, a) {
      return i && c !== '.' && ((a.length - i) % 3 === 0) ? ',' + c : c;
    });
}

export function dateCellRenderer(params) {
  if (!params.value) {
    return null
  } else {
    let d = new Date(Date.parse(params.value));
    let day = d.getDate() + '';
    day = day.length == 1? '0' + day: day;
    let month = d.getMonth() + 1 + '';
    month = month.length == 1? '0' + month: month;
    let year = d.getFullYear() + '';
    return year + '-' + month + '-' + day;
  }
}

export class phaseCellRenderer extends Component {
  render() {
    let value = this.props.value;
    let template = <span>{value}</span>;

    if ((value === 0) ||
        (value === 1) ||
        (value === 2) ||
        (value === 4) ||
        (value === 5)) {

      template = <img src={Phases[value]}/>
    }
    return template;
  }
}

export function localeRUTextFunc(key, defaultValue) {
  let value = localeTextRu[key];
  return (!value) ? defaultValue : value;
}

export const gridDefaultOptions = {
  enableSorting: true,
  enableFilter: true,
  rowSelection: 'single',
  localeTextFunc: localeRUTextFunc
}

export class GridView extends Component {
    constructor(props) {
      super(props);
      this.api = undefined;
    }

    onGridReady(params) {
      /*console.log('in GridView gridReady');
      console.log(this);
      console.log(params.api);

      this.mes = 'aaaaa';
      if (this.props.onGridReady) {
        this.props.onGridReady(params);
      }*/
      this.api = params.api;
      this.columnApi = params.columnApi;
      this.api.sizeColumnsToFit();
      if (this.props.GridReadyEvent) {
        this.props.GridReadyEvent(params);
      }
    }

    clearFilters() {
       //e.preventDefault();
       //console.log('in GridView clearFilters');
       //console.log(this);
       this.api.setFilterModel(null);
       this.api.onFilterChanged();
    }

    onRefreshData(e) {
      this.props.onRefreshData && this.props.onRefreshData(e);
    }

    render() {
     let h = this.props.height;

     let gridTemplate = (
       <AgGridReact
           gridOptions={this.props.gridOptions || gridDefaultOptions}
           columnDefs={this.props.columnDefs}
           rowData={this.props.rowData}
           onGridReady={::this.onGridReady}
           {...this.props}
       />
     )

     let gridDivTemplate = '';
     if (h) {
       gridDivTemplate = (
        <div className='ag-blue' style={{height: h}}>
          {gridTemplate}
        </div>);
      } else {
       gridDivTemplate = (
        <div className='ag-blue'>
          {gridTemplate}
        </div>);
     }

     //let loading = true;
     return (
      <div className={this.props.divViewClassName} style={{height:'100%'}}>
        <div className='btn-toolbar'>
          <div className='btn-group'>
             <button className='btn btn-default'
                     onClick={::this.clearFilters}
             ><img src={FilterImg} alt='Очистить фильтр'/></button>
             <button className='btn btn-default'
                     onClick={::this.onRefreshData}
             ><img src={RefreshImg} alt='Обновить'/></button>
          </div>
          {this.props.btnGroups}
          <ProgressBar loading={this.props.loading}/>
        </div>
        {gridDivTemplate}
        {this.props.children}
      </div>
    )
  }
  }
  /*

  */
  //onClick={::this.clearFilters} onClick={this.props.RefreshData}
  //{...this.props.gridDiv} {...this.props.grid}
/*
*/

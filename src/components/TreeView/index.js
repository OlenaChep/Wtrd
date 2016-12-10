import React, { Component } from 'react'
import './styles.scss'
import { Link } from 'react-router'

export class TreeNode extends Component {
  static propTypes = {
    data: React.PropTypes.object,
    getNodeData: React.PropTypes.func.isRequired,
    isNodeOpened: React.PropTypes.func.isRequired,
    selected: React.PropTypes.number,
    getNodeURL: React.PropTypes.func.isRequired
  }

  constructor(props, context) {
    super(props, context);
  }

  getLink(id) {
    if (!this.props.data || !this.props.data.children) {
      return this.props.getNodeURL(id, false);
    } else {
      let opened = this.props.isNodeOpened(id);
      return this.props.getNodeURL(id, true, !opened);
    }
  }

  render() {
    const {id, children} = this.props.data;
    const data = this.props.getNodeData(id);
    const selected = (this.props.selected === id);

    //если нет детей
    if (!children) {
      return (
        <li key={id} className='simple'><Link className={selected? 'selected': ''} ref={'node'+id} to={::this.getLink(id)}>{data.id}- {data.name}</Link></li>
      )
    } else {
      //если узел закрыт
      let opened = this.props.isNodeOpened(id);
      if (!opened) {
        return (
          <li key={id}>
            <Link ref={'node'+id} to={::this.getLink(id)} className={selected? 'selected togglable togglable-down': 'togglable togglable-down'}>{data.id}- {data.name}
            </Link>
          </li>
        )
      } else {
        //узел открыт -> добавляем дочерние узлы
        let template = children.map((item) => {
          return <TreeNode
                     data={item}
                     getNodeData={this.props.getNodeData}
                     isNodeOpened={this.props.isNodeOpened}
                     selected={this.props.selected}
                     getNodeURL={this.props.getNodeURL}
                  />
        });
        return (
          <li key={id}>
            <Link ref={'node'+id} to={::this.getLink(id)} className={selected? 'selected togglable togglable-up': 'togglable togglable-up'}>{data.id}- {data.name}
            </Link>
            <ul type='none'>{template}</ul>
          </li>
        )
      }
    }
  }
}

export default class TreeView extends Component {
  static propTypes = {
    treeData: React.PropTypes.array,
    plainData: React.PropTypes.object,
    selected: React.PropTypes.number,
    opened: React.PropTypes.array,
    getNodeURL: React.PropTypes.func.isRequired
  }

  //данные узла
  getNodeData(nodeId) {
    return this.props.plainData[nodeId];
  }

  isNodeOpened(nodeId) {
    return this.props.opened && this.props.opened[nodeId];
  }

  render() {
    let treeData = this.props.treeData;
    let plainData = this.props.plainData;
    let selected = this.props.selected;
    let getNodeData = ::this.getNodeData;
    let isNodeOpened = ::this.isNodeOpened;
    let getNodeURL = this.props.getNodeURL;

    let template;
    if (treeData && plainData) {
      template = treeData.map(function(item) {
        return <TreeNode
                  data={item}
                  getNodeData={getNodeData}
                  isNodeOpened={isNodeOpened}
                  selected={selected}
                  getNodeURL={getNodeURL}
              />
      });
    }
    return (
      <div className='panel panel-default'>
        <div className='panel-body'>
           <ul type='none'>
             {template}
          </ul>
        </div>
    </div>
   )
  }
}

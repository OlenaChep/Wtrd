import React, { Component } from 'react'

export class ProgressBar extends Component{
  render() {
    let template = 'Загрузка...';
    if (!this.props.loading) {
      template = '';
    }
    return (
      <p>{template}</p>
    )
  }
}

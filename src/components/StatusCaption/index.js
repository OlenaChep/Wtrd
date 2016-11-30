import React, {Component} from 'react'

export  default class StatusCaption extends Component{

  render() {
  //  let success = false;//(this.props.user.status === 'authenticated');

    let statusText = this.props.statusText;
    let success = this.props.success;
    let statusTemplate = '';
    //let caption = this.props.caption;

    if (statusText) {
      if (success) {
        statusTemplate = <div className='alert alert-success'><p>{statusText}</p></div>
      } else {
        statusTemplate = <div className='alert alert-danger'><p>{statusText}</p></div>
      }
    }
    return (
        <div>
          <h1>{this.props.caption}</h1>
          {statusTemplate}
        </div>
    )
  }
}

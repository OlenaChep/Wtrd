import React, {Component} from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import StatusCaption from '../StatusCaption'
import * as EmailActions from '../../actions/EmailActions'


export class ValidateEmail extends Component{
  handleResend(e) {
    e.preventDefault();
    this.props.actions.resendValidationEmail(this.props.user.token);
  }

  handleUpdate(e) {
    e.preventDefault();
    alert('Доделать!!!')
  }

  render() {
  //  let success = false;//(this.props.user.status === 'authenticated');
    let statusText = this.props.email.statusText || this.props.user.statusText;
    let success = (!this.props.email.error);
    return (

        <div className='container'>
          <StatusCaption caption={'Подтверждение Email'} statusText={statusText} success={success}/>
          <button className='btn btn-primary'
                     disabled={this.props.email.loading}
                     onClick={::this.handleResend}
          >Отправить заново</button>
          <button className='btn btn-primary' style={{margin:'5px'}}
                     disabled={this.props.email.loading}
                     onClick={::this.handleUpdate}
          >Изменить email</button>
        </div>
    )
  }
}


function mapStateToProps(state) {
  return {
    user: state.user,
    email: state.email
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(EmailActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ValidateEmail)

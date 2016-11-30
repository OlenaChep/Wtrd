import React, {Component} from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import StatusCaption from '../../components/StatusCaption'
import * as UserActions from '../../actions/UserActions'


export class CheckEmail extends Component{
  componentDidMount() {
    this.props.actions.validateEmail(this.props.params.token);
  }

  render() {
    let success = this.props.user.authenticated;
    let statusText = this.props.user.statusText;

    return (

        <div className='container'>
          <StatusCaption caption={'Проверка валидности ключа'} statusText={statusText} success={success}/>          
        </div>
    )
  }
}


function mapStateToProps(state) {
  return {
    user: state.user
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(UserActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckEmail)

import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import StatusCaption from '../../components/StatusCaption'
import * as UserActions from '../../actions/UserActions'
import { Link } from 'react-router'

export class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userNameIsEmpty: true,
      passwordIsEmpty: true,
      loginTried: false
    };
  }

  componentDidMount() {
    ReactDOM.findDOMNode(this.refs.userName).focus();
  }

  onFieldChange(fieldName, e) {
    if (e.target.value.trim().length > 0) {
      this.setState({[''+fieldName]:false})
    } else {
      this.setState({[''+fieldName]:true})
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    var userName = ReactDOM.findDOMNode(this.refs.userName).value.trim();
    var password = ReactDOM.findDOMNode(this.refs.password).value.trim();
    this.setState({loginTried: true});
    this.props.actions.loginUser(userName, password, '/');
  }

  render() {
    let success = (this.props.user.authenticated);
    let statusText = null;
    if (this.state.loginTried) {
      statusText = this.props.user.statusText;
    }

    return (
      <div className='container'>
        <div className='col-sm-6 col-sm-offset-3'>  </div>
          <StatusCaption caption={'Вход'} statusText={statusText} success={success}/>

          <form>
            <div className='form-group'>
              <label htmlFor='username'>Логин</label>
              <input className='form-control'
                     type='text'
                     defaultValue=''
                     ref='userName'
                     id='userName'
                     onChange={this.onFieldChange.bind(this, 'userNameIsEmpty')}
              />
            </div>

            <div className='form-group'>
              <label htmlFor='password'>Пароль</label>
              <input className='form-control'
                    type='password'
                    defaultValue=''
                    ref='password'
                    id='password'
                    onChange={this.onFieldChange.bind(this, 'passwordIsEmpty')}
              />
            </div>

            <button className='btn btn-primary'
                    type='submit'
                    ref='loginBtn'
                    disabled={this.props.user.loading || this.state.userNameIsEmpty || this.state.passwordIsEmpty}
                    onClick={::this.handleSubmit}
            >Войти</button>
          </form>

          <hr/>

          <p>Нужна учетная запись? <a href='#signup'>Регистрация</a></p>
          <p>Или перейти <Link to='/'>На главную</Link>.</p>
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)

import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import StatusCaption from '../../components/StatusCaption'
import * as UserActions from '../../actions/UserActions'
import { Link } from 'react-router'

export class SignupPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userNameIsEmpty: true,
      emailIsEmpty: true,
      passwordIsEmpty: true,
      confirmPasswordIsEmpty: true,
      signupTried: false
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
    //var userName = ReactDOM.findDOMNode(this.refs.userName).value.trim();
    //var email = ReactDOM.findDOMNode(this.refs.email).value.trim();
    var password = ReactDOM.findDOMNode(this.refs.password).value.trim();
    var confirmPassword = ReactDOM.findDOMNode(this.refs.confirmPassword).value.trim();
    if (password !== confirmPassword) {
      alert('Пароль и подтверждающий пароль не совпадают')
    } else {
      this.setState({loginTried: true});
      //this.props.actions.loginUser(userName, password, '/');
    }
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
              <label htmlFor='username'>Имя</label>
              <input className='form-control'
                     type='text'
                     defaultValue=''
                     ref='userName'
                     id='userName'
                     onChange={this.onFieldChange.bind(this, 'userNameIsEmpty')}
              />
            </div>
            <div className='form-group'>
              <label htmlFor='email'>Email</label>
              <input className='form-control'
                     type='text'
                     defaultValue=''
                     ref='email'
                     id='email'
                     onChange={this.onFieldChange.bind(this, 'emailIsEmpty')}
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
            <div className='form-group'>
              <label htmlFor='confirmPassword'>Повторите пароль</label>
              <input className='form-control'
                    type='password'
                    defaultValue=''
                    ref='confirmPassword'
                    id='confirmPassword'
                    onChange={this.onFieldChange.bind(this, 'confirmPasswordIsEmpty')}
              />
            </div>
            <button className='btn btn-primary'
                    type='submit'
                    ref='loginBtn'
                    disabled={this.props.user.loading ||
                       this.state.userNameIsEmpty ||
                       this.state.emailIsEmpty ||
                       this.state.confirmPassword||
                       this.state.passwordIsEmpty}
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

export default connect(mapStateToProps, mapDispatchToProps)(SignupPage)

import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import StatusCaption from '../../components/StatusCaption'
import * as UserActions from '../../actions/UserActions'

const validate = values => {
  const requiredErrorMsg = 'Обязательно к заполнению';
  const errors = {}
  if (!values.userName || values.userName.trim() === '') {
    errors.userName = requiredErrorMsg;
  }
  if (!values.email || values.email.trim() === '') {
    errors.email = requiredErrorMsg;
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Недопустимый email';
  }
  if (!values.password || values.password.trim() === '') {
    errors.password = requiredErrorMsg;
  }
  if (!values.confirmPassword || values.confirmPassword.trim() === '') {
    errors.confirmPassword = requiredErrorMsg;
  }
  if(values.confirmPassword  && values.confirmPassword.trim() !== ''
    && values.password  && values.password.trim() !== ''
    && values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Пароль и пароль-подтверждение не совпадают';
  }
  return errors
}

/*const warn = values => {
  const warnings = {}
  return warnings
}*/

const renderField = ({ input, label, type, meta: { touched, error } }) => (
  <div className='form-group'>
    <label>{label}</label>
    <div>
      <input className='form-control' {...input} placeholder={label} type={type}/>
      {touched && (error && <span className='text-danger'>{error}</span>)}
    </div>
  </div>
)

let SignupForm = (props) => {
  const { handleSubmit, pristine, reset, submitting, invalid } = props
  return (
    <form onSubmit={handleSubmit}>
      <Field name='userName' component={renderField} type='text' label='Логин'/>
      <Field name='email' component={renderField} type='email' label='Email'/>
      <Field name='password' component={renderField} type='password' label='Пароль'/>
      <Field name='confirmPassword' component={renderField} type='password' label='Подтвердите пароль'/>
      <div>
        <button className='btn btn-primary' type='submit' disabled={pristine || submitting || invalid}>Регистрация</button>
        <button className='btn btn-primary' style={{margin:'5px'}} type='button' disabled={pristine || submitting} onClick={reset}>Очистить значения</button>
      </div>
    </form>
  )
}

SignupForm = reduxForm({
  form: 'SignupForm',  // a unique identifier for this form
  validate                // <--- validation function given to redux-form
  //warn                     // <--- warning function given to redux-form
})(SignupForm);

export class SignupPage extends React.Component {
  /*componentWillMount() {
    this.props.actions.resetToken();
  }*/

  handleSubmit = (values) => {
    this.props.actions.signupUser(values.userName, values.password, values.email);
  }

  render() {
    let success = this.props.user.identified;
    let statusText = this.props.user.statusText;

    return (
      <div className='container'>
        <div className='col-sm-6 col-sm-offset-3'>  </div>
        <StatusCaption caption={'Регистрация'} statusText={statusText} success={success}/>
        <SignupForm onSubmit={this.handleSubmit} />
      </div>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(SignupPage);

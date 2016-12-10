import React, {Component} from 'react'
import NavLink from '../../components/NavLink'

export default class Home extends Component {

  componentDidMount() {
  }

  componentWillReceiveProps() {
  }

   render() {
    return (
      <div className='row'>
        <div className='row'>
          <h1>SprintUA</h1>
        </div>
        <div className='jumbotron text-center'>
          <NavLink to='/login' className='btn btn-default'><span className='fa fa-user'></span> Вход</NavLink>
          <NavLink to='/signup' className='btn btn-default'><span className='fa fa-user'></span> Регистрация</NavLink>
        </div>
      </div>
    )
  }
}

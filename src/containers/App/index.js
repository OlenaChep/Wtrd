import React, { Component } from 'react'
import NavLink from '../../components/NavLink'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as UserActions from '../../actions/UserActions'
import * as OrderActions from '../../actions/OrderActions'

import './styles.scss'
//import './react-bootstrap-table.css'

export class App extends Component {

  componentWillMount() {
    let token = localStorage.getItem('token');
    if(!token || token === '') {
      return;
    }
    this.props.actions.meFromToken(token);
  }

  handleLogout(e) {
    e.preventDefault();
    this.props.actions.logoutAndRedirect();
  }

  render() {
    let isAuthenticated = this.props.user.authenticated;
    let isIdentified =  this.props.user.identified;
    let userName = '';
    if (this.props.user.user) {
      userName = this.props.user.user.name;
    }

    return (
    <div className='app_header'>
      <div className='navbar navbar-default navbar-fixed-top'>
        <div className='container'>
          <div className='navbar-header'>
            <button type='button' className='navbar-toggle' data-toggle='collapse' data-target='#responsive-menu'>
              <span className='sr-only'>Открыть навигацию</span>
              <span className='icon-bar'></span>
              <span className='icon-bar'></span>
              <span className='icon-bar'></span>
            </button>
          </div>
          <div className='collapse navbar-collapse' id='responsive-menu'>
              <ul className='nav navbar-nav'>
                      <li><NavLink onlyActiveOnIndex={true} to='/'>Главная</NavLink></li>
                      <li><NavLink to='/news'>Новости</NavLink></li>
                      <li><NavLink to='/products'>Продукция</NavLink></li>
                      <li><NavLink to='/about'>О компании</NavLink></li>
                      <li><NavLink to='/contacts'>Контакты</NavLink></li>
              </ul>
              <ul className='nav navbar-nav navbar-right'>
                {isIdentified?
                  ''
                  :<li><NavLink to='/login'>Вход</NavLink></li>
                }
                {!isAuthenticated && isIdentified?
                  <li><a href='#logout' onClick={::this.handleLogout}>{userName} /Выход</a></li>
                  :''
                }
                {isAuthenticated?
                  <li className='dropdown app_user_data'>
                    <a href='#' className='dropdown-toggle' data-toggle='dropdown'>
                      {userName} /Личный кабинет<b className='caret'></b>
                    </a>
                    <ul className='dropdown-menu'>
                      <li><NavLink to='/orders'>Список заказов</NavLink></li>
                      <li><a href='#trip_list'>Рейсы</a></li>
                      <li><a href='#debt_list'>Взаиморасчеты</a></li>
                      <li className='divider'></li>
                      <li><a href='#logout' onClick={::this.handleLogout}>Выход</a></li>
                    </ul>
                  </li>
                  : ''
                }
                {!(isAuthenticated || isIdentified)?
                  <li><NavLink to='/signup'>Регистрация</NavLink></li>
                  : ''
                }
              </ul>
          </div>
        </div>
      </div>
      <div className='container'>
        {this.props.children}
      </div>
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
    actions: bindActionCreators(UserActions, dispatch),
    actions_: bindActionCreators(OrderActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

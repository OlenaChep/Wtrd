import React, {Component} from 'react'
import NavLink from '../../components/NavLink'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as PaginateActions from '../../actions/PaginateActions'

export class Home extends Component {

  componentDidMount() {
  //  this.props.actions.PreparePagination('news', 5, 26, 5);
  }

  componentWillReceiveProps() {
  }

   test1(objKey, perPage, objCount, navCount)  {
     try {
     this.props.actions.PreparePagination(objKey, perPage, objCount, navCount).then(()=>{
       console.log('aaaa');
     }
     );
   } catch(e){
     alert(e.message);
   }}

   test2(objKey)  {
     try {
     this.props.actions.GoNextPage(objKey);
   } catch(e){
     alert(e.message);
   }}

   test() {
      //objKey, perPage, objCount, navCount = 7
      //this.test1('news', -1, 1, 1);
      //this.test1('news', 0, 1, 1);
      //this.test1('news', 1, -1, 1);
      //this.test1('news', 1, 0, 1);
      //this.test1('news', 1, 1, -1);
      //this.test1('news', 1, 1, 0);
      /*this.test1('news', 1, 1, 10);
      this.test1('news', 5, 2);
      this.test1('news', 5, 10);
      this.test1('news', 5, 12, 4);
      this.test1('news', 5, 26, 7);
      this.test1('news', 5, 19, 7);*/
      //this.test1('news', 5, 26, 5);

    /*  let navList = this.props.paginate['news'].navList;
      let n = {};
      for(let key in navList) {
        //let l = navList[key];
        let l1 = {...navList[key]};
        l1.caption = l1.caption + '-';
        n[key] = l1;
      }*/
      console.log('next 2');
      this.test2('news');
      console.log('next 3');
      this.test2('news');
      console.log('next 4');
      this.test2('news');
      console.log('next 5');
      this.test2('news');
      console.log('next 6');
      this.test2('news');
      console.log('next 7');
      this.test2('news');
      console.log('next 8');
      this.test2('news');
   }

   render() {
    return (
      <div className='row'>
        <div className='row'>
          <h1>SprintUA</h1>
        </div>
        <button className='btn btn-default'
          onClick={::this.test}
        >Test</button>

        <div className='jumbotron text-center'>
          <NavLink to='/login' className='btn btn-default'><span className='fa fa-user'></span> Вход</NavLink>
          <a href='#signup' className='btn btn-default'><span className='fa fa-user'></span> Регистрация</a>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    paginate: state.paginate,
    user: state.user
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(PaginateActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)

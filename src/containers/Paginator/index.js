import { connect } from 'react-redux'
import Paginator from '../../components/Paginator'

function mapStateToProps(state, ownProps) {
    let objKey = ownProps.objKey;
    return {
      pageCount: state.paginate[objKey] && state.paginate[objKey].pageCount,
      currPage: state.paginate[objKey] && state.paginate[objKey].currPage,
      firstPage: state.paginate[objKey] && state.paginate[objKey].firstPage,
      navMaxCnt: state.paginate[objKey] && state.paginate[objKey].navMaxCnt
    }
  }

export default connect(mapStateToProps)(Paginator)

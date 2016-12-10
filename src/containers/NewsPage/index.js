import { connect } from 'react-redux'
import {loadNewsPage} from '../../actions/NewsActions'
import NewsPage from '../../components/NewsPage'
import {STATIC_URL} from '../../constants/Common';

function mapStateToProps(state) {
  let newsPage = state.newsPage && state.newsPage.data;
  return {
    published: newsPage && newsPage.releaseDate && new Date(newsPage.releaseDate),
    imageURL: newsPage && (newsPage.imageURL || STATIC_URL + '/news.jpg'),
    caption: newsPage && newsPage.caption,
    text: newsPage && newsPage.text,
    fullText: newsPage && newsPage.fullText
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadNewsPage: (id) => {
      dispatch(loadNewsPage(id));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewsPage)

import { combineReducers } from 'redux';
import postsReducer from './postsReducer';

const rootReducer = combineReducers({
  posts: postsReducer,
  // Add more reducers as needed
});

export default rootReducer;
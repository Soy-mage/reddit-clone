import axios from 'axios';

export const fetchPosts = () => {
  return async (dispatch) => {
    dispatch({ type: 'FETCH_POSTS_REQUEST' });

    try {
      const response = await axios.get('https://www.reddit.com/r/all.json');
      dispatch({ type: 'FETCH_POSTS_SUCCESS', payload: response.data.data.children });
    } catch (error) {
      dispatch({ type: 'FETCH_POSTS_FAILURE', payload: error.message });
    }
  };
};

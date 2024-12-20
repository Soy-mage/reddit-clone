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

export const fetchMorePosts = (postId) => {
  return async (dispatch) => {
    dispatch({ type: 'FETCH_POSTS_REQUEST' });

    try {
      const response = await axios.get(`https://www.reddit.com/r/all.json?count=25&after=${postId}`);
      dispatch({ type: 'FETCH_POSTS_SUCCESS', payload: response.data.data.children });
    } catch (error) {
      dispatch({ type: 'FETCH_POSTS_FAILURE', payload: error.message });
    }
  };
};

export const FETCH_COMMENTS_SUCCESS = 'FETCH_COMMENTS_SUCCESS';
export const FETCH_COMMENTS_FAILURE = 'FETCH_COMMENTS_FAILURE';

// Action to fetch comments for a specific post
export const fetchComments = (postId) => async (dispatch) => {
  try {
    const response = await fetch(`https://www.reddit.com/comments/${postId}.json`);
    const data = await response.json();
    const postComments = data[1].data.children.map((child) => child.data);
    
    // Dispatch comments to the store
    dispatch({
      type: FETCH_COMMENTS_SUCCESS,
      payload: { postId, comments: postComments },
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    dispatch({
      type: FETCH_COMMENTS_FAILURE,
      payload: error.message,
    });
  }
};
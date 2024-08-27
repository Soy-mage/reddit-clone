import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts } from '../redux/actions/postsActions';

const PostList = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);
  const loading = useSelector((state) => state.posts.loading);
  const error = useSelector((state) => state.posts.error);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  console.log(posts);
  return (
    <div>
      <h2>Reddit Clone</h2>
      {posts.map((post) => (
        <div key={post.data.id}>
          <h3>{post.data.title}</h3>
          <p>{post.data.selftext}</p>
        </div>
      ))}
    </div>
  );
};

export default PostList;

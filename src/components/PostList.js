import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts, fetchComments } from '../redux/actions/postsActions';

const PostList = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);
  const comments = useSelector((state) => state.posts.comments);
  const loading = useSelector((state) => state.posts.loading);
  const error = useSelector((state) => state.posts.error);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  if (loading && posts.length === 0) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  console.log(posts); 

  const handleFetchComments = (postId) => {
    dispatch(fetchComments(postId));
  };
  console.log("Comments in store:", comments);

  const renderMedia = (post) => {
    const mediaUrl = post.data.url;
    const mediaType = post.data.post_hint; // Determine the type of media

    if (mediaType === 'image' || mediaType === 'link') {
      // For images or external links
      return <img src={mediaUrl} alt="Reddit Post Media" style={{ maxWidth: '100%' }} />;
    } else if (mediaType === 'hosted:video' || mediaType === 'rich:video') {
      const videoSources = [
        { src: mediaUrl + "/DASH_1080.mp4", type: "video/mp4" },
        { src: mediaUrl + "/DASH_720.mp4", type: "video/mp4", lowerQualityAlternative: true },
        { src: mediaUrl + "/DASH_480.mp4", type: "video/mp4", lowerQualityAlternative: true },
        { src: mediaUrl + "/DASH_360.mp4", type: "video/mp4" },
        { src: mediaUrl + "/DASH_240.mp4", type: "video/mp4" },
        { src: mediaUrl + "/DASH_96.mp4", type: "video/mp4" },
        { src: mediaUrl + "/DASH_4_8_M", type: "video/mp4" },
        { src: mediaUrl + "/DASH_2_4_M", type: "video/mp4", lowerQualityAlternative: true },
        { src: mediaUrl + "/DASH_1_2_M", type: "video/mp4" },
        { src: mediaUrl + "/DASH_600_K", type: "video/mp4" },
      ];
      const audioSources = [
        { src: mediaUrl + "/DASH_audio.mp4", type: "audio/mp4" },
				{ src: mediaUrl + "/DASH_audio", type: "audio/mp4" },
				{ src: mediaUrl + "/audio.mp4", type: "audio/mp4" },
				{ src: mediaUrl + "/audio", type: "audio/mp4" }
      ];

      return (
      <video
        className="video"
        controls
        style={{ maxWidth: '100%' }}
        controlsList="nodownload"
        autoPlay
        muted={false} // Allow sound
      >
        {/* Map over the video/audio sources and render <source> tags */}
        {videoSources.map((source, index) => (
          <source key={index} src={source.src} type={source.type} />
        ))}
        {audioSources.map((source, index) => (
          <source key={index} src={source.src} type={source.type} />
        ))}

        Your browser does not support the video tag.
      </video>
      );
    } else {
      // For other types of media or external links
      return (
        <a href={mediaUrl} target="_blank" rel="noopener noreferrer">
          View Reddit Post
        </a>
      );
    }
  };
  
  return (
    <div>
      <h2>Reddit Clone</h2>
      <div className="postgrid">
        {posts.map((post) => (
        
        <div className="post-item" key={post.data.id}>
          <h3 className="post-extras">r/{post.data.subreddit} {post.data.ups}</h3>
          <h3 className="post-title">{post.data.title}</h3>
          <div className="media-container" id="media-container">
            {renderMedia(post)}
          </div>
          <button onClick={() => handleFetchComments(post.data.id)}>
            Show Comments
          </button>

          {/* Render comments for the post if they exist in the store */}
          {comments[post.data.id] && (
            <div className="comments">
              <h4>Comments:</h4>
              {comments[post.data.id].map((comment) => (
                <div key={comment.id} className="comment">
                  <p><strong>{comment.author}</strong>: {comment.body}</p>
                </div>
              ))};
          
            </div>
          )}
        </div>
        
      ))}
      {loading && <p>Loading more posts...</p>}
      </div>
      
    </div>
  );
};

export default PostList;

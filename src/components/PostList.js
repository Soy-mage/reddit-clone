import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts, fetchComments, fetchMorePosts } from '../redux/actions/fetching';
import StreamableVideo from './StreamableVideo';
const PostList = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);
  const comments = useSelector((state) => state.posts.comments);
  const loading = useSelector((state) => state.posts.loading);
  const error = useSelector((state) => state.posts.error);

  // Track which post has the comments pane open
  const [activePostId, setActivePostId] = useState(null);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  if (loading && posts.length === 0) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  console.log(posts);

  const handleFetchComments = (postId) => {
    if (activePostId === postId) {
      // Close the comments pane if it's already open
      setActivePostId(null);
    } else {
      // Open the comments pane for the selected post
      setActivePostId(postId);
      dispatch(fetchComments(postId));
      // console.log("Comments in store:", comments);
    }
  };

const renderMedia = (post) => {
  const mediaUrl = post.data.url;
  const mediaType = post.data.post_hint; // Determine the type of media

  if (mediaType === 'image') {
    // For images or external links
    return <img
      className={`img ${activePostId === post.data.id ? 'shrink' : ''}`}
      src={mediaUrl}
      alt="Reddit Post Media"
      style={{ maxWidth: '100%' }} />;
  } else if (mediaType === 'link' || post.data.gallery_data) {
    return <div className="link">
      <a
        href={mediaUrl}
        target="_blank"
        rel="noopener noreferrer">
        {mediaUrl}
      </a>
      <img className='thumbnail' src={post.data.thumbnail} alt="website thumbail"></img>
    </div>
  } else if (post.data.domain === "streamable.com") {
    <StreamableVideo url={post.data.url} />
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
        className={`video ${activePostId === post.data.id ? 'shrink' : ''}`}
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
      <div className="link">
        <a
          className={`a ${activePostId === post.data.id ? 'shrink' : ''}`}
          href={mediaUrl}
          target="_blank"
          rel="noopener noreferrer">
          View Reddit Post
        </a>
        <p className="scrollable-p">{post.data.selftext}</p>
      </div>
      
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

            <div className={`media-container ${activePostId === post.data.id ? 'shrink' : ''}`} id="media-container">
              {renderMedia(post)}
            </div>

            <button className="comments-button" onClick={() => handleFetchComments(post.data.id)}>
              {activePostId === post.data.id ? 'Hide Comments' : 'Show Comments'}
            </button>

            {/* Render comments for the post if they exist in the store */}
            {activePostId === post.data.id && (
              <div className="comments-pane">
                <h4>Comments:</h4>
                {comments[post.data.id] ? (
                  comments[post.data.id].map((comment) => (
                    <div key={comment.id} className="comment">
                      <p><strong>{comment.author} +{comment.ups}</strong>: {comment.body}</p>
                    </div>
                  ))
                ) : (
                  <p>Loading comments...</p>
                )}
              </div>
            )}
          </div>
          
        ))}
        {loading && <p>Loading more posts...</p>}
      </div>
        <button onClick={() => fetchPosts()}>See More Posts</button>
    </div>
  );
};

export default PostList;
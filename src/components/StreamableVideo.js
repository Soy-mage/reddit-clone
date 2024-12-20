import React from 'react';

const StreamableVideo = ({ url }) => {
  // Extract the Streamable video ID from the URL
  const videoID = url.split('/').pop();

  return (
    <div className="video-container">
      <iframe
        src={`https://streamable.com/e/${videoID}`}
        frameBorder="0"
        width="560" // Adjust the width
        height="315" // Adjust the height
        allowFullScreen
        title="Streamable Video"
      ></iframe>
    </div>
  );
};

export default StreamableVideo;
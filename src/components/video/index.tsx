import React, { useEffect, useRef } from "react";

interface IVideoPlayer {
  stream: MediaStream;
}

const VideoPlayer: React.FC<IVideoPlayer> = ({ stream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = stream;
  }, [stream]);

  return (
    <div>
      <video ref={videoRef} autoPlay muted></video>
    </div>
  );
};

export default VideoPlayer;

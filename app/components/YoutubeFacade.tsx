import { useState } from 'react';

interface YouTubeFacadeProps {
  videoId: string;
}

const YouTubeFacade = ({ videoId }: YouTubeFacadeProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const playVideo = () => {
    setIsPlaying(true);
  };

  return (
    <div className="relative w-full max-w-[800px] h-auto" style={{ aspectRatio: '16/9' }}>
      {isPlaying ? (
        <iframe
          className="absolute top-0 left-0 w-full h-full border-0"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <div className="relative cursor-pointer" onClick={playVideo}>
          <img
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            alt="YouTube video thumbnail"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="bg-red-600 bg-opacity-100 text-white rounded-xl p-4 w-[75px]">▶</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default YouTubeFacade;

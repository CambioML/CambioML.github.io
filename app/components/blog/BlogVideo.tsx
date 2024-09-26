interface BlogVideoProps {
  src: string;
}

const BlogVideo = ({ src }: BlogVideoProps) => {
  return (
    <div className="relative w-full max-w-[800px] h-auto" style={{ aspectRatio: '16/9' }}>
      <iframe
        className="absolute top-0 left-0 w-full h-full border-0"
        src={src}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
};

export default BlogVideo;

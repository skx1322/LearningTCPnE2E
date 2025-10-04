import ScreenShare from "../components/Video";

const Video = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-600 p-4">
      <div className="w-full max-w-full h-[800px]">
        <ScreenShare />
      </div>
    </div>
  );
};

export default Video;

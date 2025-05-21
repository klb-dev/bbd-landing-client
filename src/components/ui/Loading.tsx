const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="w-16 h-16 border-4 border-t-transparent border-cyan-500 rounded-full animate-spin shadow-lg shadow-cyan-300"></div>
    </div>
  );
};

export default Loading;
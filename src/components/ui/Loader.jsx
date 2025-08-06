import React from 'react';

const Loader = () => {
  return (
    <div className="flex flex-row gap-2 ">
      <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:.7s]" />
      <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:.3s]" />
      <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:.7s]" />
    </div>
  );
}

export default Loader;

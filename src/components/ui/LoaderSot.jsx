import React from 'react';

export const SoftLoader = () => {
  return (
    <div className="w-full gap-x-2 flex justify-center items-center mt-10">
      <div className="w-5 bg-green-500 animate-pulse h-5 rounded-full animate-bounce" />
      <div className="w-5 animate-pulse h-5 bg-primary rounded-full animate-bounce" />
      <div className="w-5 h-5 animate-pulse bg-secondary rounded-full animate-bounce" />
    </div>
  );
}



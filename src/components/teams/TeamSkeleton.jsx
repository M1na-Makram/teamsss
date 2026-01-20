import React from 'react';

const TeamSkeleton = () => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="h-6 w-3/4 bg-white/10 rounded mb-2" />
          <div className="h-4 w-1/2 bg-white/10 rounded" />
        </div>
        <div className="h-6 w-16 bg-white/10 rounded-full" />
      </div>
      <div className="h-4 w-1/3 bg-white/10 rounded mb-4" />
      <div className="h-4 w-2/3 bg-white/10 rounded mb-2" />
      <div className="h-2 w-full bg-white/10 rounded mb-6" />
      <div className="h-10 w-full bg-white/10 rounded" />
    </div>
  );
};

export default TeamSkeleton;

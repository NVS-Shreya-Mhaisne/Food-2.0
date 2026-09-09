import React from 'react';

const SkeletonRestaurantCard = () => {
  return (
    <div className="rounded-3xl bg-white dark:bg-[#221814] border border-gray-150 dark:border-white/10 p-3.5 shadow-sm overflow-hidden animate-pulse flex flex-col justify-between">
      {/* Cover image skeleton */}
      <div className="w-full h-44 rounded-2xl bg-gray-200 dark:bg-white/10 relative overflow-hidden mb-3">
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent animate-[shimmer_1.5s_infinite]" />
      </div>

      {/* Info skeleton */}
      <div className="space-y-2.5 flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="h-5 bg-gray-200 dark:bg-white/10 rounded-md w-1/2" />
          <div className="h-4 bg-gray-200 dark:bg-white/10 rounded-full w-12" />
        </div>

        <div className="h-3.5 bg-gray-200 dark:bg-white/10 rounded-md w-3/4" />
        <div className="flex gap-2 pt-1">
          <div className="h-4 bg-gray-200 dark:bg-white/10 rounded-md w-16" />
          <div className="h-4 bg-gray-200 dark:bg-white/10 rounded-md w-20" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonRestaurantCard;

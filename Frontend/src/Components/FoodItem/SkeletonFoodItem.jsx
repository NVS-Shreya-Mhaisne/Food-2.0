import React from 'react';

const SkeletonFoodItem = () => {
  return (
    <div className="rounded-3xl bg-white dark:bg-[#221814] border border-gray-150 dark:border-white/10 p-3.5 shadow-sm overflow-hidden animate-pulse flex flex-col justify-between">
      {/* Image skeleton */}
      <div className="w-full h-44 rounded-2xl bg-gray-200 dark:bg-white/10 relative overflow-hidden mb-3">
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent animate-[shimmer_1.5s_infinite]" />
      </div>

      {/* Content skeleton */}
      <div className="space-y-2.5 flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="h-4 bg-gray-200 dark:bg-white/10 rounded-md w-3/5" />
          <div className="h-4 bg-gray-200 dark:bg-white/10 rounded-md w-1/5" />
        </div>

        <div className="h-3 bg-gray-200 dark:bg-white/10 rounded-md w-4/5" />
        <div className="h-3 bg-gray-200 dark:bg-white/10 rounded-md w-2/3" />
      </div>

      {/* Footer skeleton */}
      <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100 dark:border-white/5">
        <div className="h-3.5 bg-gray-200 dark:bg-white/10 rounded-md w-1/4" />
        <div className="h-8 bg-gray-200 dark:bg-white/10 rounded-xl w-20" />
      </div>
    </div>
  );
};

export default SkeletonFoodItem;

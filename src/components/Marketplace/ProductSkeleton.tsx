import React from 'react';
import { Card, Skeleton } from "@heroui/react";

interface ProductSkeletonProps {
  count?: number;
}

export const ProductCardSkeleton: React.FC = () => {
  return (
    <Card className="bg-black border-2 border-gray-600 p-0" radius="lg">
      <div className="p-4 pb-0">
        <Skeleton className="rounded-lg">
          <div className="h-48 rounded-lg bg-default-300" />
        </Skeleton>
      </div>
      
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <Skeleton className="w-3/4 rounded-lg">
            <div className="h-6 w-3/4 rounded-lg bg-default-200" />
          </Skeleton>
          <Skeleton className="w-14 rounded-lg">
            <div className="h-6 w-16 rounded- bg-default-300" />
          </Skeleton>
        </div>
        <div className="space-y-2">
          <Skeleton className="w-3/5 rounded-lg">
            <div className="h-4 w-3/4 rounded-lg bg-default-200" />
          </Skeleton>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Skeleton className="w-12 rounded-lg">
              <div className="h-4 w-12 rounded-lg bg-default-200" />
            </Skeleton>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="w-12 rounded-lg">
              <div className="h-4 w-12 rounded-lg bg-default-200" />
            </Skeleton>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <Skeleton className="w-24 rounded-lg">
              <div className="h-6 w-24 rounded-lg bg-default-200" />
            </Skeleton>
            <Skeleton className="w-13 rounded-lg">
              <div className="h-3 w-16 rounded-lg bg-default-300" />
            </Skeleton>
          </div>
          <Skeleton className="w-24 rounded-lg">
            <div className="h-9 w-24 rounded-lg bg-default-300" />
          </Skeleton>
        </div>
      </div>
    </Card>
  );
};

export const ProductGridSkeleton: React.FC<ProductSkeletonProps> = ({ count = 3 }) => {
  return (
    <div>
      <div className="mb-6">
        <Skeleton className="w-48 rounded-lg">
          <div className="h-4 w-64 rounded-lg bg-default-200" />
        </Skeleton>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <ProductCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
      <div className="p-4 flex items-center justify-between border-t border-gray-600 mt-8">
        <Skeleton className="w-32 rounded-lg">
          <div className="h-4 w-32 rounded-lg bg-default-200" />
        </Skeleton>
        <div className="flex items-center gap-2">
          <Skeleton className="w-8 h-8 rounded-lg">
            <div className="w-8 h-8 rounded-lg bg-default-300" />
          </Skeleton>
          <Skeleton className="w-4 rounded-lg">
            <div className="h-4 w-4 rounded-lg bg-default-200" />
          </Skeleton>
          <Skeleton className="w-8 h-8 rounded-lg">
            <div className="w-8 h-8 rounded-lg bg-default-300" />
          </Skeleton>
        </div>
      </div>
    </div>
  );
};

export const EmptyStateSkeleton: React.FC = () => {
  return (
    <div className="text-center py-20">
      <Skeleton className="w-24 h-24 mx-auto mb-4 rounded-full">
        <div className="w-24 h-24 rounded-full bg-default-300" />
      </Skeleton>
      <Skeleton className="w-48 mx-auto mb-2 rounded-lg">
        <div className="h-6 w-48 rounded-lg bg-default-200" />
      </Skeleton>
      <Skeleton className="w-64 mx-auto rounded-lg">
        <div className="h-4 w-64 rounded-lg bg-default-300" />
      </Skeleton>
    </div>
  );
};
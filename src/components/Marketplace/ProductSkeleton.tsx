import React from 'react';
import { Card, Skeleton } from "@heroui/react";

interface ProductSkeletonProps {
  count?: number;
}

export const ProductCardSkeleton: React.FC = () => {
  return (
    <Card className="bg-black border-2 border-gray-600" radius="lg">
      <div className="p-4">
        <Skeleton className="rounded-lg">
          <div className="h-70 rounded-lg" />
        </Skeleton>
      </div>

      <div className="p-4 space-y-4">
        <div className="justify-between items-start">
          <Skeleton className="w-3/4 rounded-lg">
            <div className="h-6 w-3/4 rounded-lg bg-default-200" />
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
      <div className="mb-6 flex justify-between">
        <Skeleton className="w-48 rounded-lg">
          <div className="h-4 w-64 rounded-lg bg-default-200" />
        </Skeleton>
        <Skeleton className="w-32 rounded-lg">
          <div className="h-4 w-48 rounded-lg bg-default-200" />
        </Skeleton>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <ProductCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    </div>
  );
};
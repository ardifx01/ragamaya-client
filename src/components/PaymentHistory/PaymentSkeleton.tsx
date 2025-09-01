import React from 'react';
import { Card, Skeleton } from "@heroui/react";

interface TransactionSkeletonProps {
    count?: number;
}

export const TransactionCardSkeleton: React.FC = () => {
    return (
        <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20" radius="lg">
            <div className="flex flex-col sm:flex-row">
                {/* Product Image Skeleton */}
                <div className="relative overflow-hidden sm:w-64 flex-shrink-0">
                        <Skeleton className="rounded-lg w-full h-full">
                            <div className="h-full rounded-lg bg-default-300" />
                        </Skeleton>
                </div>

                {/* Transaction Details Skeleton */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                        {/* Header Section */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                {/* Product Name */}
                                <Skeleton className="w-3/4 rounded-lg mb-2">
                                    <div className="h-6 w-3/4 rounded-lg bg-default-200" />
                                </Skeleton>
                                
                                {/* Product Description */}
                                <div className="space-y-2 mb-3">
                                    <Skeleton className="w-full rounded-lg">
                                        <div className="h-4 w-full rounded-lg bg-default-300" />
                                    </Skeleton>
                                    <Skeleton className="w-2/3 rounded-lg">
                                        <div className="h-4 w-2/3 rounded-lg bg-default-300" />
                                    </Skeleton>
                                </div>
                            </div>
                            
                            {/* Price Section */}
                            <div className="text-right ml-4">
                                <Skeleton className="w-24 rounded-lg mb-1">
                                    <div className="h-7 w-24 rounded-lg bg-default-200" />
                                </Skeleton>
                                <Skeleton className="w-12 rounded-lg">
                                    <div className="h-3 w-12 rounded-lg bg-default-300" />
                                </Skeleton>
                            </div>
                        </div>

                        {/* Transaction Info Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            {/* Payment Method */}
                            <div className="flex items-center gap-3">
                                <Skeleton className="rounded-full">
                                    <div className="h-4 w-4 rounded-full bg-default-300" />
                                </Skeleton>
                                <div className="flex-1">
                                    <Skeleton className="w-20 rounded-lg mb-1">
                                        <div className="h-3 w-20 rounded-lg bg-default-300" />
                                    </Skeleton>
                                    <Skeleton className="w-16 rounded-lg">
                                        <div className="h-4 w-16 rounded-lg bg-default-200" />
                                    </Skeleton>
                                </div>
                            </div>
                            
                            {/* Transaction Date */}
                            <div className="flex items-center gap-3">
                                <Skeleton className="rounded-full">
                                    <div className="h-4 w-4 rounded-full bg-default-300" />
                                </Skeleton>
                                <div className="flex-1">
                                    <Skeleton className="w-24 rounded-lg mb-1">
                                        <div className="h-3 w-24 rounded-lg bg-default-300" />
                                    </Skeleton>
                                    <Skeleton className="w-32 rounded-lg">
                                        <div className="h-4 w-32 rounded-lg bg-default-200" />
                                    </Skeleton>
                                </div>
                            </div>
                            
                            {/* Transaction ID */}
                            <div className="flex items-center gap-3">
                                <Skeleton className="rounded-full">
                                    <div className="h-4 w-4 rounded-full bg-default-300" />
                                </Skeleton>
                                <div className="flex-1">
                                    <Skeleton className="w-20 rounded-lg mb-1">
                                        <div className="h-3 w-20 rounded-lg bg-default-300" />
                                    </Skeleton>
                                    <Skeleton className="w-20 rounded-lg">
                                        <div className="h-4 w-20 rounded-lg bg-default-200" />
                                    </Skeleton>
                                </div>
                            </div>
                            
                            {/* Status */}
                            <div className="flex items-center gap-3">
                                <Skeleton className="rounded-full">
                                    <div className="h-4 w-4 rounded-full bg-default-300" />
                                </Skeleton>
                                <div className="flex-1">
                                    <Skeleton className="w-12 rounded-lg mb-1">
                                        <div className="h-3 w-12 rounded-lg bg-default-300" />
                                    </Skeleton>
                                    <Skeleton className="w-16 rounded-lg">
                                        <div className="h-4 w-16 rounded-lg bg-default-200" />
                                    </Skeleton>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-end">
                        <Skeleton className="rounded-xl">
                            <div className="h-12 w-32 rounded-xl bg-default-300" />
                        </Skeleton>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export const TransactionGridSkeleton: React.FC<TransactionSkeletonProps> = ({ count = 3 }) => {
    return (
        <div className="max-w-4xl mx-auto px-4">
            {/* Header Skeleton */}
            <div className="mb-6 flex justify-between items-center">
                <Skeleton className="w-48 rounded-lg">
                    <div className="h-6 w-48 rounded-lg bg-default-200" />
                </Skeleton>
                <Skeleton className="w-32 rounded-lg">
                    <div className="h-4 w-32 rounded-lg bg-default-300" />
                </Skeleton>
            </div>

            {/* Transaction Cards Grid */}
            <div className="grid grid-cols-1 gap-6">
                {Array.from({ length: count }).map((_, index) => (
                    <TransactionCardSkeleton key={`transaction-skeleton-${index}`} />
                ))}
            </div>
        </div>
    );
};

// Alternative compact skeleton for loading states
export const TransactionListSkeleton: React.FC<TransactionSkeletonProps> = ({ count = 5 }) => {
    return (
        <div className="max-w-4xl mx-auto px-4 space-y-4">
            {Array.from({ length: count }).map((_, index) => (
                <Card 
                    key={`transaction-list-skeleton-${index}`}
                    className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm border border-white/10" 
                    radius="lg"
                >
                    <div className="p-4 flex items-center gap-4">
                        {/* Small Image */}
                        <Skeleton className="rounded-lg flex-shrink-0">
                            <div className="h-16 w-16 rounded-lg bg-default-300" />
                        </Skeleton>
                        
                        {/* Content */}
                        <div className="flex-1 space-y-2">
                            <div className="flex justify-between items-start">
                                <Skeleton className="w-1/3 rounded-lg">
                                    <div className="h-5 w-1/3 rounded-lg bg-default-200" />
                                </Skeleton>
                                <Skeleton className="w-20 rounded-lg">
                                    <div className="h-5 w-20 rounded-lg bg-default-200" />
                                </Skeleton>
                            </div>
                            
                            <div className="flex justify-between items-center">
                                <Skeleton className="w-24 rounded-lg">
                                    <div className="h-4 w-24 rounded-lg bg-default-300" />
                                </Skeleton>
                                <Skeleton className="w-16 rounded-full">
                                    <div className="h-6 w-16 rounded-full bg-default-300" />
                                </Skeleton>
                            </div>
                        </div>
                        
                        {/* Action Button */}
                        <Skeleton className="rounded-lg flex-shrink-0">
                            <div className="h-10 w-24 rounded-lg bg-default-300" />
                        </Skeleton>
                    </div>
                </Card>
            ))}
        </div>
    );
};
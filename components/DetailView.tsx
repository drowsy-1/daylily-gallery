'use client';

import { ArrowUpRight, X } from 'lucide-react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Daylily } from '@/types/daylily';
import { getImageUrl } from '@/lib/constants';

interface DetailViewProps {
    daylily: Daylily;
    isOpen: boolean;
    onClose: () => void;
}

export default function DetailView({ daylily, isOpen, onClose }: DetailViewProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl">
                <div className="relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 z-10"
                        onClick={onClose}
                    >
                        <X className="h-5 w-5" />
                    </Button>

                    <div className="aspect-square relative mb-4">
                        <Image
                            src={getImageUrl(daylily.image_url)}
                            alt={daylily.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority
                            className="object-cover rounded-lg"
                        />
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold">{daylily.name}</h2>
                            <p className="text-lg text-muted-foreground">
                                {daylily.hybridizer} ({daylily.year})
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Characteristics</h3>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                <div>
                                    <span className="font-medium">Ploidy:</span> {daylily.ploidy}
                                </div>
                                <div>
                                    <span className="font-medium">Bloom Size:</span> {daylily.bloom_size}
                                </div>
                                <div>
                                    <span className="font-medium">Scape Height:</span> {daylily.scape_height}
                                </div>
                                <div>
                                    <span className="font-medium">Branches:</span> {daylily.branches}
                                </div>
                                <div>
                                    <span className="font-medium">Bud Count:</span> {daylily.bud_count}
                                </div>
                                <div>
                                    <span className="font-medium">Bloom Season:</span> {daylily.bloom_season}
                                </div>
                                <div>
                                    <span className="font-medium">Foliage Type:</span> {daylily.foliage_type}
                                </div>
                                {daylily.fragrance && (
                                    <div>
                                        <span className="font-medium">Fragrance:</span> {daylily.fragrance}
                                    </div>
                                )}
                                {daylily.bloom_habit && (
                                    <div>
                                        <span className="font-medium">Bloom Habit:</span> {daylily.bloom_habit}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">Details</h3>
                            {daylily.color_description && (
                                <p className="text-sm">
                                    <span className="font-medium">Color:</span> {daylily.color_description}
                                </p>
                            )}
                            {daylily.parentage && (
                                <p className="text-sm">
                                    <span className="font-medium">Parentage:</span> {daylily.parentage}
                                </p>
                            )}
                            {daylily.form && (
                                <p className="text-sm">
                                    <span className="font-medium">Form:</span> {daylily.form}
                                </p>
                            )}
                            {daylily.sculpting && (
                                <p className="text-sm">
                                    <span className="font-medium">Sculpting:</span> {daylily.sculpting}
                                </p>
                            )}
                            {daylily.seedling_# && (
                                <p className="text-sm">
                                <span className="font-medium">Seedling #:</span> {daylily.seedling_#}
                        </p>
                        )}
                        {daylily.notes && (
                            <p className="text-sm">
                                <span className="font-medium">Notes:</span> {daylily.notes}
                            </p>
                        )}
                    </div>

                    <div className="pt-4 border-t">
                        <a
                            href={daylily.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                        >
                            View in Daylily Database <ArrowUpRight className="ml-1 h-4 w-4" />
                        </a>
                    </div>
                </div>
            </div>
        </DialogContent>
</Dialog>
);
}

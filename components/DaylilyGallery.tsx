// components/DaylilyGallery.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Sun, Moon, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Daylily, FilterState, INITIAL_FILTER_STATE } from '@/types/daylily';
import { getImageUrl } from '@/lib/constants';
import FilterPanel from './FilterPanel';
import DetailView from './DetailView';
import { Login } from './admin/Login';
import { AdminPanel } from './admin/AdminPanel';
import { useAuth } from '@/lib/auth';
import Papa from 'papaparse';

export default function DaylilyGallery() {
    const [mounted, setMounted] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedDaylily, setSelectedDaylily] = useState<Daylily | null>(null);
    const [daylilies, setDaylilies] = useState<Daylily[]>([]);
    const [filteredDaylilies, setFilteredDaylilies] = useState<Daylily[]>([]);
    const [filters, setFilters] = useState<FilterState>(INITIAL_FILTER_STATE);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
    const { resolvedTheme, setTheme } = useTheme();
    const { isAuthenticated, logout } = useAuth();

    useEffect(() => {
        setMounted(true);
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            const response = await fetch('/data/varieties.jsonl');
            const text = await response.text();
            const lines = text.split('\n').filter(line => line.trim());
            const parsedData: Daylily[] = lines.map(line => JSON.parse(line));
            setDaylilies(parsedData);
            setFilteredDaylilies(parsedData);
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    // ... keep existing filter and utility functions ...

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur">
                <div className="container mx-auto p-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Daylily Gallery</h1>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                            >
                                {resolvedTheme === 'dark' ? (
                                    <Sun className="h-5 w-5" />
                                ) : (
                                    <Moon className="h-5 w-5" />
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setIsFilterOpen(true)}
                            >
                                Filter & Search
                            </Button>
                            {isAuthenticated ? (
                                <>
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsAdminPanelOpen(true)}
                                    >
                                        Admin Panel
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={logout}
                                    >
                                        <LogOut className="h-5 w-5" />
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    variant="outline"
                                    onClick={() => setIsAdminPanelOpen(true)}
                                >
                                    Login
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Admin/Login Dialog */}
            <Dialog open={isAdminPanelOpen} onOpenChange={setIsAdminPanelOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    {isAuthenticated ? <AdminPanel /> : <Login />}
                </DialogContent>
            </Dialog>

            {/* Keep existing FilterPanel, main content, and DetailView */}
            <FilterPanel
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                filters={filters}
                setFilters={setFilters}
            />

            {/* Main Content */}
            <main className="container mx-auto px-4 pt-20 pb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredDaylilies.slice(0, page * 20).map((daylily) => (
                        // ... keep existing card rendering ...
                    ))}
                </div>
                {hasMore && (
                    <div className="mt-8 text-center">
                        <Button onClick={() => setPage(p => p + 1)} disabled={loading}>
                            {loading ? 'Loading...' : 'Load More'}
                        </Button>
                    </div>
                )}
            </main>

            {/* Detail Dialog */}
            {selectedDaylily && (
                <DetailView
                    daylily={selectedDaylily}
                    isOpen={!!selectedDaylily}
                    onClose={() => setSelectedDaylily(null)}
                />
            )}
        </div>
    );
}
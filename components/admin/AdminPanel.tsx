// components/admin/AdminPanel.tsx
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataService } from '@/lib/dataService';
import { Daylily } from '@/types/daylily';

const dataService = new DataService(
    process.env.NEXT_PUBLIC_GITHUB_TOKEN!,
    process.env.NEXT_PUBLIC_GITHUB_OWNER!,
    process.env.NEXT_PUBLIC_GITHUB_REPO!
);

export function AdminPanel() {
    const [loading, setLoading] = useState(false);
    const [url, setUrl] = useState('');

    const handleAdd = async () => {
        try {
            setLoading(true);
            // Extract ID from URL
            const id = url.match(/id=(\d+)/)?.[1];
            if (!id) throw new Error('Invalid URL');

            // Fetch daylily data
            const response = await fetch(`/api/scrape?id=${id}`);
            if (!response.ok) throw new Error('Failed to fetch data');

            const variety: Daylily = await response.json();
            await dataService.addVariety(variety);

            setUrl('');
        } catch (error) {
            console.error('Error adding variety:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <Input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter AHS database URL"
                    className="flex-1"
                />
                <Button onClick={handleAdd} disabled={loading}>
                    {loading ? 'Adding...' : 'Add Variety'}
                </Button>
            </div>
            <RemoveVariety />
        </div>
    );
}

function RemoveVariety() {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRemove = async () => {
        try {
            setLoading(true);
            await dataService.removeVariety(name);
            setName('');
        } catch (error) {
            console.error('Error removing variety:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex gap-2">
            <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter variety name to remove"
                className="flex-1"
            />
            <Button
                onClick={handleRemove}
                disabled={loading}
                variant="destructive"
            >
                {loading ? 'Removing...' : 'Remove Variety'}
            </Button>
        </div>
    );
}

// pages/api/scrape.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { id } = req.query;
    if (!id) {
        return res.status(400).json({ error: 'ID is required' });
    }

    try {
        const response = await fetch(`https://daylilydatabase.org/detail.php?id=${id}`);
        if (!response.ok) throw new Error('Failed to fetch');

        const html = await response.text();
        // Parse HTML and extract data
        // Return formatted daylily data

        res.status(200).json(parsedData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to scrape data' });
    }
}
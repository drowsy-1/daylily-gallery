// lib/adminFlow.ts
import { DataService } from './dataService';

export async function addVariety(url: string) {
    // 1. Extract ID from URL
    const id = url.match(/id=(\d+)/)?.[1];

    // 2. Find variety in admin JSONL
    const adminData = await fetch('/data/admin-varieties.jsonl').then(r => r.text());
    const variety = adminData
        .split('\n')
        .map(line => JSON.parse(line))
        .find(v => v.url.includes(id));

    if (!variety) throw new Error('Variety not found in database');

    // 3. Download image
    const imageResponse = await fetch(variety.image_url);
    const imageBlob = await imageResponse.blob();

    // 4. Add to public data
    await DataService.addVariety({
        ...variety,
        imageBlob
    });
}
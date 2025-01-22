// app/page.tsx
'use client';

import { ThemeProvider } from 'next-themes';
import DaylilyGallery from '@/components/DaylilyGallery';

export default function Home() {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <DaylilyGallery />
        </ThemeProvider>
    );
}
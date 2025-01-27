import { ThemeProvider } from '@/components/theme-provider';
import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';

import './globals.css';

export const metadata: Metadata = {
    title: 'Trouble Tick',
    description: 'An app to track clicks and views on your links',
    icons: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>✅</text></svg>",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <html lang='en' suppressHydrationWarning>
                <head />
                <body>
                    <ThemeProvider
                        attribute='class'
                        defaultTheme='system'
                        enableSystem
                        disableTransitionOnChange
                    >
                        <SessionProvider>{children}</SessionProvider>
                    </ThemeProvider>
                </body>
            </html>
        </>
    );
}

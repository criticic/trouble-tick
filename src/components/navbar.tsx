'use client';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Github, Menu, Moon, Sun } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { signIn, signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';

export function Navbar() {
    const { theme, setTheme } = useTheme();
    const { data: session } = useSession();

    return (
        <nav className='flex items-center justify-between border-b px-4 py-3'>
            <div className='flex items-center gap-6'>
                <Link href='/' className='text-lg font-semibold'>
                    Trouble-Tick
                </Link>

                {/* Desktop Navigation */}
                <NavigationMenu className='hidden md:flex'>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <Link href='/dashboard' legacyBehavior passHref>
                                <NavigationMenuLink
                                    className={navigationMenuTriggerStyle()}
                                >
                                    Dashboard
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href='#' legacyBehavior passHref>
                                <NavigationMenuLink
                                    className={navigationMenuTriggerStyle()}
                                >
                                    Documentation
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>

            <div className='flex items-center gap-4'>
                <Button
                    variant='ghost'
                    size='icon'
                    onClick={() =>
                        setTheme(theme === 'dark' ? 'light' : 'dark')
                    }
                >
                    <Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
                    <Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
                    <span className='sr-only'>Toggle theme</span>
                </Button>

                {session ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant='outline' size='sm'>
                                <Image
                                    src={
                                        session.user?.image ||
                                        'https://ui-avatars.com/api/?name=' +
                                            session.user?.name +
                                            '&background=random'
                                    }
                                    className='h-6 w-6 rounded-full'
                                    width={20}
                                    height={20}
                                    alt={session.user?.name || 'Account'}
                                />
                                {session.user?.name || 'Account'}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                            <DropdownMenuItem onClick={() => signOut()}>
                                Sign Out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <Button size='sm' onClick={() => signIn('github')}>
                        <Github className='mr-2 h-4 w-4' />
                        Sign In with GitHub
                    </Button>
                )}

                {/* Mobile Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild className='md:hidden'>
                        <Button variant='ghost' size='icon'>
                            <Menu className='h-4 w-4' />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                        <DropdownMenuItem asChild>
                            <Link href='/dashboard'>Dashboard</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href='#'>Documentation</Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    );
}

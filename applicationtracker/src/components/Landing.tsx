'use client';

import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import sparkleLeft from '@/assets/sparkleLeft.png';
import sparkleRight from '@/assets/sparkleRight.png';

export default function Landing() {
  return (
    <main>
            <img
        src={sparkleLeft}
        alt="left sparkle"
        className="hidden md:block absolute left-20 bottom-60 w-60 h-60 object-contain"
      />
      <img
        src={sparkleRight}
        alt="right sparkle"
        className="hidden md:block absolute right-20 top-20 w-60 h-60 object-contain"
      />
        <div className="flex items-center justify-center h-[calc(100vh-213px)]">
            <div className='space-y-6 text-center'>
                <h1 className="text-3xl font-semibold">Track applications. Stay on top. Get hired.</h1>
                <p className="text-muted-foreground text-2xl">
                Everything in one place, so you can breathe easy.
                </p>
                <Link to="/">
                  <Button className='mt-5 p-6 rounded-full text-md bg-accent text-primary'> Get Started </Button>
                </Link>
            </div>
        </div>
        <div className='min-w-screen bg-accent h-40'></div>
    </main>
  );
}

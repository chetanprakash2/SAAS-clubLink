import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function WelcomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight text-primary">Welcome to ClubLink</h1>
        <p className="mt-4 text-xl text-muted-foreground">Your modern platform for connecting clubs and communities.</p>
      </div>
      <div className="flex gap-4">
        <Button asChild size="lg">
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/signup">Sign Up</Link>
        </Button>
      </div>
    </div>
  );
}

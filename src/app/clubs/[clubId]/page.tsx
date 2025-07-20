import { Music, Clapperboard, Gamepad2, Cpu } from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

const subdivisions = [
  { name: 'Music', icon: Music, href: 'music/dashboard', description: 'Rhythm and melodies.' },
  { name: 'Dance', icon: Clapperboard, href: 'dance/dashboard', description: 'Movement and expression.' },
  { name: 'Tech', icon: Cpu, href: 'tech/dashboard', description: 'Innovation and code.' },
  { name: 'Games', icon: Gamepad2, href: 'games/dashboard', description: 'Strategy and fun.' },
];

export default function ClubSubdivisionsPage({ params }: { params: { clubId: string } }) {
  const clubName = decodeURIComponent(params.clubId).replace(/-/g, ' ');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight text-primary capitalize">{clubName}</h1>
        <p className="mt-4 text-xl text-muted-foreground">Select a subdivision to continue.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
        {subdivisions.map((subdivision) => (
          <Link href={`/clubs/${params.clubId}/${subdivision.href}`} key={subdivision.name} className="group">
            <Card className="h-full transform transition-transform duration-300 ease-in-out group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-primary/20">
              <CardHeader className="items-center text-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <subdivision.icon className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold">{subdivision.name}</CardTitle>
                <CardDescription>{subdivision.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

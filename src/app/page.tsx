import config from '@/config';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto flex flex-col justify-center items-center min-h-screen text-center space-y-5">
      <h1 className="text-5xl font-bold uppercase">{config.app_name}</h1>
      <p className="text-xl text-secondary-foreground">{config.description}</p>
    </div>
  );
}

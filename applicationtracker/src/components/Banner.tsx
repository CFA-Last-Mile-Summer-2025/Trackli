'use client';

interface BannerProps {
    title: string;
    subtitle: string;
}

export default function Banner(props: BannerProps) {
  return (
    <div className="w-full min-h-40 text-center pt-20 py-5 backdrop-blur-md rounded-4xl bg-gradient-to-br from-[#6B5B95] via-[#8B7EC8] to-[#C8A8E9] shadow-md">
        <h1 className="font-bold text-2xl text-white">{props.title}</h1>
        <p className="text-white mt-3">{props.subtitle}</p>
    </div>
  );
}

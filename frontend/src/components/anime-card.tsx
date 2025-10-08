import Image from "next/image";

export function AnimeCard({
  title,
  image_url,
  episode_no,
  episode_title,
  clip_time,
  summary,
}: {
  title: string;
  image_url: string;
  episode_no: number;
  episode_title: string;
  clip_time: string;
  summary: string;
}) {
  return (
    <div className="w-full md:w-[480px] shrink-0 h-fit bg-primary-foreground pb-8 rounded-xl flex flex-col gap-5 shadow-xl border">
      <Image
        className="rounded-t-lg w-full h-auto"
        src={image_url ?? ""}
        alt={`Image of ${title}`}
        width={384}
        height={216}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={{ objectFit: "cover" }}
      />
      <div className="flex flex-col gap-2 px-5 ">
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {title}
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          Episode {episode_no}: {episode_title}
        </p>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          Clip Time: {clip_time}
        </p>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          {summary}
        </p>
      </div>
    </div>
  );
}

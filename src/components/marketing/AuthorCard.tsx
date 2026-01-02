import Image from "next/image";
import { format } from "date-fns";

interface AuthorCardProps {
  name: string;
  avatar?: string | null;
  date: string;
}

export default function AuthorCard({ name, avatar, date }: AuthorCardProps) {
  const formattedDate = format(new Date(date), "MMMM d, yyyy");

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
        {avatar ? (
          <Image
            src={avatar}
            alt={name}
            fill
            className="object-cover"
            sizes="48px"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-indigo-100 text-indigo-600 font-semibold text-lg">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div>
        <p className="font-semibold text-gray-900">{name}</p>
        <time dateTime={date} className="text-sm text-gray-500">
          {formattedDate}
        </time>
      </div>
    </div>
  );
}

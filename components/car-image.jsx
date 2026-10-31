import Image from "next/image";
import { CarIcon } from "lucide-react";

export default function CarImage({
  src,
  alt,
  sizes,
  priority = false,
  className = "",
  foregroundClassName = "",
}) {
  if (!src) {
    return (
      <div className={`flex h-full w-full items-center justify-center bg-[#111113] ${className}`}>
        <CarIcon className="h-16 w-16 text-white/30" />
      </div>
    );
  }

  return (
    <div className={`relative h-full w-full overflow-hidden bg-[#111113] ${className}`}>
      <Image
        src={src}
        alt=""
        fill
        sizes={sizes}
        className="scale-125 object-cover opacity-40 blur-2xl"
      />
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={`object-contain drop-shadow-[0_24px_40px_rgba(0,0,0,0.55)] ${foregroundClassName}`}
      />
    </div>
  );
}

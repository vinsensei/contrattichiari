import Image from "next/image";

type SectionHeaderProps = {
  title: string;
  subtitle: string;
  icon: string; // es: "summary.svg"
};

export default function SectionHeader({
  title,
  subtitle,
  icon,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-4 sm:mb-5">
      <div className="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] rounded-[4px] border border-neutral-300 flex items-center justify-center shrink-0">
        <Image
          src={`/icons/${icon}`}
          alt=""
          width={20}
          height={20}
          className="opacity-80 sm:w-[24px] sm:h-[24px]"
        />
      </div>

      <div className="flex flex-col">
        <h3 className="text-sm sm:text-base font-semibold text-neutral-900 leading-snug">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-neutral-600 leading-snug">
          <span className="line-clamp-2 sm:line-clamp-none">
            {subtitle}
          </span>
        </p>
      </div>
    </div>
  );
}
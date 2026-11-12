export function ProfileAvatar({ nickname, image }: { nickname: string; image: string }) {
  return image ? (
    <img
      src={image}
      alt={`${nickname} 프로필`}
      className="size-20 shrink-0 rounded-full object-cover"
    />
  ) : (
    <span
      role="img"
      aria-label={`${nickname} 기본 프로필`}
      className="flex size-20 shrink-0 items-center justify-center rounded-full bg-slate-200 text-3xl font-bold text-muted"
    >
      <img src="/icons/person.svg" alt="" className="size-10" />
    </span>
  );
}

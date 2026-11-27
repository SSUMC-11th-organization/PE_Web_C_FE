import Image from 'next/image';
import { cn } from '../../utils/cn';

interface IconProps {
  name: string;
  small?: boolean;
  inverted?: boolean;
}

export function Icon({ name, small = false, inverted = false }: IconProps) {
  return (
    <span aria-hidden="true" className={cn('inline-block size-6 shrink-0', small && 'size-4')}>
      <Image
        src={`/icons/${name}.svg`}
        alt=""
        width={24}
        height={24}
        className={cn(
          'max-w-none',
          small && 'origin-top-left scale-[0.666667]',
          inverted && 'invert',
        )}
      />
    </span>
  );
}

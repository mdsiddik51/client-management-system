import { cn, getInitials } from '@/lib/utils';
import Image from 'next/image';

const colorPalette = [
  'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500',
  'bg-pink-500', 'bg-teal-500', 'bg-indigo-500', 'bg-red-500',
];

function getColor(name) {
  if (!name) return colorPalette[0];
  const idx = name.charCodeAt(0) % colorPalette.length;
  return colorPalette[idx];
}

const sizes = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

export function Avatar({ src, name, size = 'md', className }) {
  const initials = getInitials(name);
  const color = getColor(name);
  const sizeClass = sizes[size] || sizes.md;

  if (src) {
    return (
      <div className={cn('relative rounded-full overflow-hidden flex-shrink-0', sizeClass, className)}>
        <Image src={src} alt={name || 'Avatar'} fill className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0 select-none',
        color,
        sizeClass,
        className
      )}
    >
      {initials}
    </div>
  );
}

export default Avatar;

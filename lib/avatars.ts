// Avatar system using DiceBear API for free, customizable avatars
// You can replace these with your own custom avatar images

export const avatarStyles = [
  'adventurer',
  'avataaars',
  'big-smile',
  'bottts',
  'fun-emoji',
  'lorelei',
  'micah',
  'miniavs',
  'personas',
  'pixel-art',
] as const;

export type AvatarStyle = typeof avatarStyles[number];

export function getAvatarUrl(seed: string, style: AvatarStyle = 'avataaars'): string {
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;
}

// Predefined avatars for quick selection
export const predefinedAvatars = [
  { id: 'avatar1', name: 'Avatar 1', seed: 'Felix', style: 'avataaars' as AvatarStyle },
  { id: 'avatar2', name: 'Avatar 2', seed: 'Aneka', style: 'avataaars' as AvatarStyle },
  { id: 'avatar3', name: 'Avatar 3', seed: 'Charlie', style: 'bottts' as AvatarStyle },
  { id: 'avatar4', name: 'Avatar 4', seed: 'Luna', style: 'lorelei' as AvatarStyle },
  { id: 'avatar5', name: 'Avatar 5', seed: 'Max', style: 'fun-emoji' as AvatarStyle },
  { id: 'avatar6', name: 'Avatar 6', seed: 'Bella', style: 'personas' as AvatarStyle },
  { id: 'avatar7', name: 'Avatar 7', seed: 'Rocky', style: 'pixel-art' as AvatarStyle },
  { id: 'avatar8', name: 'Avatar 8', seed: 'Daisy', style: 'micah' as AvatarStyle },
  { id: 'avatar9', name: 'Avatar 9', seed: 'Oliver', style: 'adventurer' as AvatarStyle },
  { id: 'avatar10', name: 'Avatar 10', seed: 'Sophie', style: 'big-smile' as AvatarStyle },
  { id: 'avatar11', name: 'Avatar 11', seed: 'Leo', style: 'miniavs' as AvatarStyle },
  { id: 'avatar12', name: 'Avatar 12', seed: 'Milo', style: 'bottts' as AvatarStyle },
];

export function getRandomAvatar(): typeof predefinedAvatars[0] {
  return predefinedAvatars[Math.floor(Math.random() * predefinedAvatars.length)];
}

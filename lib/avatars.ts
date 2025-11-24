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

// Predefined avatars for quick selection - Organized by profession
export const predefinedAvatars = [
  // Medical Professionals (5)
  { id: 'doctor', name: 'Doctor', seed: 'Dr-Professional', style: 'avataaars' as AvatarStyle },
  { id: 'nurse', name: 'Nurse', seed: 'Nurse-Care', style: 'lorelei' as AvatarStyle },
  { id: 'dentist', name: 'Dentist', seed: 'Dentist-Smile', style: 'big-smile' as AvatarStyle },
  { id: 'pharmacist', name: 'Pharmacist', seed: 'Pharmacist-Med', style: 'avataaars' as AvatarStyle },
  { id: 'therapist', name: 'Therapist', seed: 'Therapist-Mind', style: 'micah' as AvatarStyle },

  // Legal Professionals (3)
  { id: 'lawyer', name: 'Lawyer', seed: 'Lawyer-Justice', style: 'personas' as AvatarStyle },
  { id: 'judge', name: 'Judge', seed: 'Judge-Authority', style: 'adventurer' as AvatarStyle },
  { id: 'paralegal', name: 'Paralegal', seed: 'Paralegal-Legal', style: 'avataaars' as AvatarStyle },

  // Education Professionals (3)
  { id: 'teacher', name: 'Teacher', seed: 'Teacher-Edu', style: 'big-smile' as AvatarStyle },
  { id: 'professor', name: 'Professor', seed: 'Professor-Academic', style: 'personas' as AvatarStyle },
  { id: 'tutor', name: 'Tutor', seed: 'Tutor-Learning', style: 'micah' as AvatarStyle },

  // Tech Professionals (5)
  { id: 'engineer', name: 'Engineer', seed: 'Engineer-Tech', style: 'bottts' as AvatarStyle },
  { id: 'developer', name: 'Developer', seed: 'Developer-Code', style: 'pixel-art' as AvatarStyle },
  { id: 'designer', name: 'Designer', seed: 'Designer-Creative', style: 'lorelei' as AvatarStyle },
  { id: 'data-scientist', name: 'Data Scientist', seed: 'DataScientist-AI', style: 'miniavs' as AvatarStyle },
  { id: 'it-specialist', name: 'IT Specialist', seed: 'IT-Support', style: 'bottts' as AvatarStyle },

  // Business Professionals (6)
  { id: 'ceo', name: 'CEO', seed: 'CEO-Executive', style: 'adventurer' as AvatarStyle },
  { id: 'manager', name: 'Manager', seed: 'Manager-Lead', style: 'personas' as AvatarStyle },
  { id: 'accountant', name: 'Accountant', seed: 'Accountant-Finance', style: 'avataaars' as AvatarStyle },
  { id: 'consultant', name: 'Consultant', seed: 'Consultant-Advisor', style: 'micah' as AvatarStyle },
  { id: 'realtor', name: 'Real Estate Agent', seed: 'Realtor-Property', style: 'big-smile' as AvatarStyle },
  { id: 'entrepreneur', name: 'Entrepreneur', seed: 'Entrepreneur-Startup', style: 'adventurer' as AvatarStyle },

  // Creative Professionals (6)
  { id: 'artist', name: 'Artist', seed: 'Artist-Creative', style: 'fun-emoji' as AvatarStyle },
  { id: 'photographer', name: 'Photographer', seed: 'Photographer-Lens', style: 'lorelei' as AvatarStyle },
  { id: 'writer', name: 'Writer', seed: 'Writer-Author', style: 'micah' as AvatarStyle },
  { id: 'musician', name: 'Musician', seed: 'Musician-Music', style: 'fun-emoji' as AvatarStyle },
  { id: 'chef', name: 'Chef', seed: 'Chef-Culinary', style: 'big-smile' as AvatarStyle },
  { id: 'barber', name: 'Barber', seed: 'Barber-Stylist', style: 'personas' as AvatarStyle },

  // Service Professionals (4)
  { id: 'mechanic', name: 'Mechanic', seed: 'Mechanic-Auto', style: 'bottts' as AvatarStyle },
  { id: 'electrician', name: 'Electrician', seed: 'Electrician-Power', style: 'miniavs' as AvatarStyle },
  { id: 'plumber', name: 'Plumber', seed: 'Plumber-Pipe', style: 'avataaars' as AvatarStyle },
  { id: 'construction', name: 'Construction Worker', seed: 'Construction-Build', style: 'adventurer' as AvatarStyle },

  // Retail Professionals (2)
  { id: 'shop-owner', name: 'Shop Owner', seed: 'ShopOwner-Retail', style: 'big-smile' as AvatarStyle },
  { id: 'salesperson', name: 'Salesperson', seed: 'Sales-Customer', style: 'personas' as AvatarStyle },

  // Other Professionals (3)
  { id: 'fitness-trainer', name: 'Fitness Trainer', seed: 'Trainer-Fitness', style: 'adventurer' as AvatarStyle },
  { id: 'architect', name: 'Architect', seed: 'Architect-Design', style: 'miniavs' as AvatarStyle },
  { id: 'scientist', name: 'Scientist', seed: 'Scientist-Research', style: 'bottts' as AvatarStyle },
];

export function getRandomAvatar(): typeof predefinedAvatars[0] {
  return predefinedAvatars[Math.floor(Math.random() * predefinedAvatars.length)];
}

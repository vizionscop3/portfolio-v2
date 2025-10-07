// Brand Colors - Import for consistent theming
export * from './brandColors';

export const HERO_TITLE = 'Denward Aulder - Full Stack Developer';
export const HERO_DESCRIPTION =
  'I develop 3D visuals, user interfaces and web applications';

export const ABOUT_TITLE = 'Overview';
export const ABOUT_DESCRIPTION = `I'm a skilled software developer with experience in TypeScript and JavaScript, 
and expertise in frameworks like React, Node.js, and Three.js. I'm a quick learner and collaborate closely 
with clients to create efficient, scalable, and user-friendly solutions that solve real-world problems. 
Let's work together to bring your ideas to life!`;

export const EXPERIENCE_TITLE = 'Work Experience';
export const EXPERIENCE_DESCRIPTION = 'What I have done so far';

export const TECH_TITLE = 'Technologies';
export const TECH_LIST = [
  'JavaScript',
  'TypeScript',
  'React',
  'Three.js',
  'Node.js',
  'MongoDB',
  'Tailwind CSS',
  'Next.js',
  'Git',
  'Docker',
];

export const WORKS_TITLE = 'Projects';
export const WORKS_DESCRIPTION = 'My work';

export const FEEDBACKS_TITLE = 'Testimonials';
export const FEEDBACKS_DESCRIPTION = 'What others say';

export const CONTACT_TITLE = 'Get in touch';
export const CONTACT_DESCRIPTION = 'Contact';

// Services data
export const services = [
  {
    title: 'Web Developer',
    icon: '💻', // We'll replace with proper icons later
  },
  {
    title: 'React Native Developer',
    icon: '📱',
  },
  {
    title: 'Backend Developer',
    icon: '⚙️',
  },
  {
    title: 'Content Creator',
    icon: '🎨',
  },
];

// Technologies data
export const technologies = [
  {
    name: 'HTML 5',
    icon: '🌐',
  },
  {
    name: 'CSS 3',
    icon: '🎨',
  },
  {
    name: 'JavaScript',
    icon: '⚡',
  },
  {
    name: 'TypeScript',
    icon: '📘',
  },
  {
    name: 'React JS',
    icon: '⚛️',
  },
  {
    name: 'Redux Toolkit',
    icon: '🔄',
  },
  {
    name: 'Tailwind CSS',
    icon: '💨',
  },
  {
    name: 'Node JS',
    icon: '🟢',
  },
  {
    name: 'MongoDB',
    icon: '🍃',
  },
  {
    name: 'Three JS',
    icon: '🎮',
  },
  {
    name: 'git',
    icon: '📝',
  },
  {
    name: 'figma',
    icon: '🎨',
  },
  {
    name: 'docker',
    icon: '🐳',
  },
];

// Experience data
export const experiences = [
  {
    title: 'React.js Developer',
    company_name: 'Starbucks',
    icon: '☕', // Will replace with company logos
    iconBg: '#383E56',
    date: 'March 2020 - April 2021',
    points: [
      'Developing and maintaining web applications using React.js and other related technologies.',
      'Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.',
      'Implementing responsive design and ensuring cross-browser compatibility.',
      'Participating in code reviews and providing constructive feedback to other developers.',
    ],
  },
  {
    title: 'React Native Developer',
    company_name: 'Tesla',
    icon: '⚡',
    iconBg: '#E6DEDD',
    date: 'Jan 2021 - Feb 2022',
    points: [
      'Developing and maintaining web applications using React.js and other related technologies.',
      'Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.',
      'Implementing responsive design and ensuring cross-browser compatibility.',
      'Participating in code reviews and providing constructive feedback to other developers.',
    ],
  },
  {
    title: 'Web Developer',
    company_name: 'Shopify',
    icon: '🛒',
    iconBg: '#383E56',
    date: 'Jan 2022 - Jan 2023',
    points: [
      'Developing and maintaining web applications using React.js and other related technologies.',
      'Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.',
      'Implementing responsive design and ensuring cross-browser compatibility.',
      'Participating in code reviews and providing constructive feedback to other developers.',
    ],
  },
  {
    title: 'Full stack Developer',
    company_name: 'Meta',
    icon: '📘',
    iconBg: '#E6DEDD',
    date: 'Jan 2023 - Present',
    points: [
      'Developing and maintaining web applications using React.js and other related technologies.',
      'Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.',
      'Implementing responsive design and ensuring cross-browser compatibility.',
      'Participating in code reviews and providing constructive feedback to other developers.',
    ],
  },
];

// Testimonials data
export const testimonials = [
  {
    testimonial:
      'I thought it was impossible to make a website as beautiful as our product, but Denward Lee proved me wrong.',
    name: 'Sara Lee',
    designation: 'CFO',
    company: 'Acme Co',
    image: 'https://randomuser.me/api/portraits/women/4.jpg',
  },
  {
    testimonial:
      "I've never met a web developer who truly cares about their clients' success like Denward Lee does.",
    name: 'Chris Brown',
    designation: 'COO',
    company: 'DEF Corp',
    image: 'https://randomuser.me/api/portraits/men/5.jpg',
  },
  {
    testimonial:
      "After Denward Lee optimized our website, our traffic increased by 50%. We can't thank them enough!",
    name: 'Lisa Wang',
    designation: 'CTO',
    company: '456 Enterprises',
    image: 'https://randomuser.me/api/portraits/women/6.jpg',
  },
];

// Projects data
export const projects = [
  {
    name: 'Car Rent',
    description:
      'Web-based platform that allows users to search, book, and manage car rentals from various providers, providing a convenient and efficient solution for transportation needs.',
    tags: [
      {
        name: 'react',
        color: 'blue-text-gradient',
      },
      {
        name: 'mongodb',
        color: 'green-text-gradient',
      },
      {
        name: 'tailwind',
        color: 'pink-text-gradient',
      },
    ],
    image: '🚗', // Will replace with project images
    source_code_link: 'https://github.com/',
  },
  {
    name: 'Job IT',
    description:
      'Web application that enables users to search for job openings, view detailed job descriptions, and apply for positions seamlessly.',
    tags: [
      {
        name: 'react',
        color: 'blue-text-gradient',
      },
      {
        name: 'restapi',
        color: 'green-text-gradient',
      },
      {
        name: 'scss',
        color: 'pink-text-gradient',
      },
    ],
    image: '💼',
    source_code_link: 'https://github.com/',
  },
  {
    name: 'Trip Guide',
    description:
      'A comprehensive travel booking platform that allows users to book flights, hotels, and rental cars, and offers curated recommendations for popular destinations.',
    tags: [
      {
        name: 'nextjs',
        color: 'blue-text-gradient',
      },
      {
        name: 'supabase',
        color: 'green-text-gradient',
      },
      {
        name: 'css',
        color: 'pink-text-gradient',
      },
    ],
    image: '✈️',
    source_code_link: 'https://github.com/',
  },
];

export default {
  services,
  technologies,
  experiences,
  testimonials,
  projects,
};

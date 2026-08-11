export type SocialIcon =
  | "instagram"
  | "facebook"
  | "whatsapp"
  | "phone"
  | "mail";

export type Project = {
  slug: string;
  number: string;
  title: string;
  category: string;
  year: string;
  cover: ProjectImage;
  gallery: ProjectImage[];
  summary: string;
  description: string;
  challenge: string;
  solution: string;
  client: string;
  duration: string;
  role: string;
  services: string[];
  technologies: string[];
  projectUrl?: string;
};

export type ProjectImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

/**
 * This is the only file you need to edit for the portfolio content.
 * Put replacement images in /public/images, then change the paths below.
 */
export const portfolio = {
  owner: {
    name: "ڕەهەند جاف",
    latinName: "RAHAND M. JAFF",
    monogram: "RJ",
    role: "گەشەپێدەری ئەپ و وێب",
    eyebrow: "سڵاو، من ڕەهەندم",
    headline: "بیرۆکە دەگۆڕم بۆ بەرهەمی دیجیتاڵ.",
    introduction:
      "ئەزموونێکی سادە، خێرا و مرۆڤانە دروست دەکەم، لە یەکەم هێڵی بیرۆکەوە تا دوا پیکسڵی بەرهەم.",
    availability: "ئامادەم بۆ پرۆژەی نوێ",
    location: "کوردستان، عێراق",
    email: "rahandmjaff@gmail.com",
    phoneLabel: "0750 117 3185",
    phoneHref: "tel:+9647501173185",
  },
  media: {
    hero: "/images/hero.jpg",
    heroAlt: "شوێنی وێنەی سەرەکی ڕەهەند",
    about: "/images/about.jpg",
    aboutAlt: "شوێنی وێنەی بەشی دەربارە",
  },
  menu: [
    { label: "سەرەتا", href: "#home" },
    { label: "دەربارە", href: "#about" },
    { label: "تواناکان", href: "#services" },
    { label: "پرۆژەکان", href: "#projects" },
    { label: "تێبینییەکان", href: "#notes" },
    { label: "پەیوەندی", href: "#contact" },
  ],
  ticker: [
    "وێب دیزاین",
    "گەشەپێدانی ئەپ",
    "UI / UX",
    "بڕاندی دیجیتاڵ",
    "چارەسەری زیرەک",
  ],
  about: {
    title: "سادەیی بۆ من واتای کەم‌کاری نییە، واتای ڕوونییە.",
    paragraphs: [
      "من ڕەهەندم، گەشەپێدەرێکی دیجیتاڵ کە حەزم لە دروستکردنی ئەزموونی خێرا، ڕێک‌وپێک و ئاسانە بۆ بەکارهێنەر.",
      "لە هەر پڕۆژەیەک کێشەکە دەناسین، پاشان شێوازێکی سادە بۆ چارەسەرکردنی دەدۆزمەوە و بە وردەکارییەکی جوان جێبەجێ دەکەم، بێ هیچ بەکارهێنانێکی زیرەکی دەستکرد بۆ درووست کردنی وێب/ئەپ.",
    ],
    facts: [
      { label: "شوێن", value: "کوردستان، عێراق" },
      { label: "زمان", value: "کوردی / English" },
      { label: "فۆکەس", value: "Web & App Mobile" },
      { label: "دۆخ", value: "بەردەستم بۆ کار" },
    ],
  },
  services: [
    {
      number: "٠١",
      title: "دیزاینی UI/UX",
      text: "وایەرفرەیم و ڕووکارێکی سادە کە ڕێگای بەکارهێنەر ڕوون و خۆش دەکات.",
    },
    {
      number: "٠٢",
      title: "گەشەپێدانی وێب",
      text: "ماڵپەڕ و وێب‌ئەپی خێرا، وەڵامدەرەوە و ئامادە بۆ گەشەکردن.",
    },
    {
      number: "٠٣",
      title: "گەشەپێدانی ئەپ",
      text: "ئەپی مۆبایل بە ئەزموونێکی یەکگرتوو، لۆژیکی ڕوون و وردەکارییەکی پاک.",
    },
    {
      number: "٠٤",
      title: "ناسنامەی دیجیتاڵ",
      text: "سیستەمی بینراو و ئاوازێکی یەکگرتوو بۆ ئەوەی بڕاندەکەت بناسرێتەوە.",
    },
  ],
  projects: [
    {
      slug: "rekapps",
      number: "٠١",
      title: "RekApps — سیستەمی ژمێریاری و بەڕێوەبردن",
      category: "ERP / Web Application",
      year: "بەرهەمی ٢٠٢٦",
      cover: {
        src: "/images/projects/rekapps-main.jpg",
        alt: "لۆگۆی سپی RekApps لەسەر پاشبنەمای پرتەقاڵی",
        width: 1254,
        height: 1254,
      },
      gallery: [
        {
          src: "/images/projects/rekapps-2.jpg",
          alt: "داشبۆردی ڕووناکی سیستەمی RekApps بە زمانی کوردی",
          width: 1597,
          height: 772,
        },
        {
          src: "/images/projects/rekapps-3.jpg",
          alt: "داشبۆردی تاریکی سیستەمی RekApps بە زمانی کوردی",
          width: 1600,
          height: 769,
        },
      ],
      summary:
        "سیستەمێکی یەکگرتوو بۆ ژمێریاری، فرۆشتن، کڕین و کۆگا لە کۆمپانیاکانی بیناسازی و پێداویستی خانووبەرە.",
      description:
        "RekApps سیستەمێکی ERP ـە کە کارە ڕۆژانەکانی ژمێریاری، فرۆشتن، کڕین، کۆگا، کاڵا، پسووڵە و ڕاپۆرت لە یەک داشبۆردی کوردیدا کۆدەکاتەوە.",
      challenge:
        "کۆکردنەوەی زانیارییە زۆر و پەیوەستەکانی ژمێریاری و کۆگا بە شێوەیەک کە بەکارهێنەر بە خێرایی دۆخی کارەکەی تێبگات.",
      solution:
        "داشبۆردێکی ڕاست‌بۆچەپ، گەڕانێکی خێرا، کارت و ڕاپۆرتی ڕوون و دۆخی ڕووناک و تاریک دروست کرا تا کارە سەرەکییەکان بە کەمترین هەنگاو ئەنجام بدرێن.",
      client: "کۆمپانیای بیناسازی و پێداویستی خانووبەرە",
      duration: "٦ هەفتە",
      role: "Product Design & Development",
      services: ["UX Research", "UI Design", "ERP Dashboard"],
      technologies: ["Web Application", "REST API", "Database"],
    },
  ] satisfies Project[],
  notes: [
    {
      tag: "دیزاین",
      date: "١٢ / ٠٦ / ٢٠٢٦",
      title: "بۆچی سادەیی باشترین هاوڕێی بەکارهێنەرە؟",
      excerpt:
        "سادەیی تەنها کەمکردنەوەی شتەکان نییە؛ هەڵبژاردنی ئەو شتانەیە کە بەڕاستی گرنگن.",
    },
    {
      tag: "گەشەپێدان",
      date: "٢٨ / ٠٥ / ٢٠٢٦",
      title: "لە بیرۆکەوە بۆ MVP بە ڕێگایەکی ڕوون",
      excerpt:
        "هەر بەرهەمێکی باش بە پرسیارێکی دروست دەست پێدەکات، نەک بە لیستێکی درێژی تایبەتمەندی.",
    },
    {
      tag: "پرۆسە",
      date: "٠٩ / ٠٤ / ٢٠٢٦",
      title: "وردەکارییە بچووکەکان کە متمانە دروست دەکەن",
      excerpt:
        "خێرایی، دەقی ڕوون و وەڵامدانەوەی دروست هەستێکی ئارام و پیشەیی دروست دەکەن.",
    },
  ],
  principles: [
    { number: "٠١", title: "ڕوونی", text: "هەر شتێک هۆکارێکی هەیە." },
    { number: "٠٢", title: "خێرایی", text: "کات بۆ بەکارهێنەر گرنگە." },
    { number: "٠٣", title: "وردی", text: "پیکسڵە بچووکەکان جیاوازی دروست دەکەن." },
  ],
  socials: [
    {
      label: "Instagram — Rahand",
      shortLabel: "Instagram 01",
      href: "https://www.instagram.com/rahandmjaff?igsh=aTNkOHcydGJnNnR3&utm_source=qr",
      icon: "instagram" as SocialIcon,
    },
    {
      label: "Instagram — REK Apps",
      shortLabel: "Instagram 02",
      href: "https://www.instagram.com/rekapps?igsh=Zmcxd25hZmw3M2hn&utm_source=qr",
      icon: "instagram" as SocialIcon,
    },
    {
      label: "Facebook",
      shortLabel: "Facebook",
      href: "https://www.facebook.com/share/1GWj49x2G1/?mibextid=wwXIfr",
      icon: "facebook" as SocialIcon,
    },
    {
      label: "WhatsApp",
      shortLabel: "WhatsApp",
      href: "https://wa.me/qr/EF7VQ7NYMDKYC1",
      icon: "whatsapp" as SocialIcon,
    },
    {
      label: "Phone — 0750 117 3185",
      shortLabel: "Phone",
      href: "tel:+9647501173185",
      icon: "phone" as SocialIcon,
    },
    {
      label: "Email — rahandmjaff@gmail.com",
      shortLabel: "Email",
      href: "mailto:rahandmjaff@gmail.com",
      icon: "mail" as SocialIcon,
    },
  ],
} as const;

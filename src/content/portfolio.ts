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
  cover: string;
  gallery: string[];
  imageAlt: string;
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
      "ئەزموونێکی سادە، خێرا و مرۆڤانە دروست دەکەم؛ لە یەکەم هێڵی بیرۆکەوە تا دوا پیکسڵی بەرهەم.",
    availability: "ئامادەم بۆ پرۆژەی نوێ",
    location: "کوردستان، عێراق",
    email: "rahandmjaff@gmail.com",
    phoneLabel: "٠٧٥٠ ١١٧ ٣١٨٥",
    phoneHref: "tel:+9647501173185",
  },
  media: {
    hero: "/images/hero-placeholder.svg",
    heroAlt: "شوێنی وێنەی سەرەکی ڕەهەند",
    about: "/images/about-placeholder.svg",
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
    title: "سادەیی بۆ من واتای کەم‌کاری نییە؛ واتای ڕوونییە.",
    paragraphs: [
      "من ڕەهەندم، گەشەپێدەرێکی دیجیتاڵ کە حەزم لە دروستکردنی ئەزموونی خێرا، ڕێک‌وپێک و ئاسانە بۆ بەکارهێنەر.",
      "لە هەر پرۆژەیەکدا سەرەتا کێشەکە دەناسین، پاشان شێوازێکی سادە بۆ چارەسەرکردنی دەدۆزمەوە و بە وردەکارییەکی جوان جێبەجێی دەکەم.",
    ],
    facts: [
      { label: "شوێن", value: "کوردستان، عێراق" },
      { label: "زمان", value: "کوردی / English" },
      { label: "فۆکەس", value: "Web & Mobile" },
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
      slug: "rek-mobile",
      number: "٠١",
      title: "REK — ئەزموونی ئەپی مۆبایل",
      category: "Mobile Product",
      year: "٢٠٢٦",
      cover: "/images/projects/rek-mobile.svg",
      gallery: [
        "/images/projects/rek-mobile.svg",
        "/images/projects/brand-system.svg",
      ],
      imageAlt: "نموونەی ڕووکاری ئەپی مۆبایل",
      summary:
        "ڕووکارێکی ڕوون بۆ بەرهەمێکی مۆبایل کە خێرایی و ئاسانی بەکارهێنان لە پێشەوە دادەنێت.",
      description:
        "ئەم پرۆژەیە نموونەیەکی ئامادەیە بۆ پیشاندانی چۆنیەتی باسکردنی پرۆژەکانت. دەتوانیت ناو، دەق، وێنە و هەموو وردەکارییەکانی لە فایلەکەی ناوەڕۆک بگۆڕیت.",
      challenge:
        "ڕێکخستنی زانیارییە زۆرەکان بە شێوەیەک کە بەکارهێنەر لە یەکەم ساتدا بزانێت چی بکات.",
      solution:
        "ڕێڕەوێکی کورت، تایپۆگرافیی بەهێز و سیستەمێکی یەکگرتووی ڕەنگ و بۆشایی بەکار هێنرا.",
      client: "پرۆژەی نموونە",
      duration: "٦ هەفتە",
      role: "UI/UX & Development",
      services: ["UX Research", "UI Design", "Prototype"],
      technologies: ["Figma", "React Native", "API"],
    },
    {
      slug: "store-system",
      number: "٠٢",
      title: "سیستەمی بەڕێوەبردنی فرۆشگا",
      category: "Web Application",
      year: "٢٠٢٥",
      cover: "/images/projects/brand-system.svg",
      gallery: [
        "/images/projects/brand-system.svg",
        "/images/projects/data-dashboard.svg",
      ],
      imageAlt: "نموونەی سیستەمی بەڕێوەبردنی فرۆشگا",
      summary:
        "سیستەمێکی یەکگرتوو بۆ بەڕێوەبردنی کاڵا، فرۆشتن و ڕاپۆرتە ڕۆژانەکان.",
      description:
        "نموونەی وێب‌ئەپێک کە کارە ڕۆژانەکانی فرۆشگا لە یەک داشبۆرددا کۆدەکاتەوە و زانیارییە گرنگەکان بە سادەیی پیشان دەدات.",
      challenge:
        "کەمکردنەوەی هەنگاوە دووبارەکان و دروستکردنی دیدێکی ڕوون بۆ دۆخی فرۆشتن و کۆگا.",
      solution:
        "داشبۆردێکی مۆدیولار، گەڕانێکی خێرا و فۆرمی کورت بۆ تۆمارکردنی مامەڵەکان دروست کرا.",
      client: "پرۆژەی نموونە",
      duration: "٨ هەفتە",
      role: "Product Design & Frontend",
      services: ["Product Strategy", "Dashboard", "Responsive UI"],
      technologies: ["Next.js", "TypeScript", "PostgreSQL"],
    },
    {
      slug: "data-dashboard",
      number: "٠٣",
      title: "داشبۆردی داتای کڕیار",
      category: "Data Experience",
      year: "٢٠٢٥",
      cover: "/images/projects/data-dashboard.svg",
      gallery: [
        "/images/projects/data-dashboard.svg",
        "/images/projects/rek-mobile.svg",
      ],
      imageAlt: "نموونەی داشبۆردی داتا",
      summary:
        "داتای ئاڵۆز بە چارت و نیشاندەری سادە گۆڕدراوە بۆ بڕیاردانی خێراتر.",
      description:
        "ئەم نموونەیە پیشان دەدات چۆن دەتوانرێت ژمارە و ڕاپۆرتی زۆر بە هێرارشییەکی بینراو و ئاسان بخوێندرێتەوە.",
      challenge:
        "پیشاندانی داتای زۆر بەبێ ئەوەی ڕووکارەکە قەرەباڵغ بێت یان بەکارهێنەر ون بێت.",
      solution:
        "زانیارییەکان بە پلەبەندی دابەش کران و تەنها نیشاندەرە پێویستەکان لە یەکەم ئاستدا هێڵرانەوە.",
      client: "پرۆژەی نموونە",
      duration: "٤ هەفتە",
      role: "UX & Data UI",
      services: ["Information Architecture", "Data UI", "Testing"],
      technologies: ["Next.js", "Charts", "REST API"],
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


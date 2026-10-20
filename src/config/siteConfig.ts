import type {
  CalendarEvent,
  DesktopItem,
  Project,
  Skill,
  SiteLinks,
  WindowMeta,
} from "../types";

// ============================================================================
// Site configuration — edit this file with your real information.
// Nothing else in the app needs to change when you update these values.
// ============================================================================

export const siteConfig = {
  name: "Ali Ebrahimnezhad",
  role: "Full-Stack Developer",
  phone: "+98 992 207 3575",
  email: "ebrahimnezhadali8@gmail.com",
  location: "Qaen, South Khorasan, Iran",

  links: {
    linkedin: "https://www.linkedin.com/in/ali-ebrahimnezhad-9500a93b4/",
    github: "https://github.com/ebrahimnezhadali8-gif",
    instagram: "https://instagram.com/yourusername",
    telegram: "https://t.me/yourusername",
    google: "https://google.com",
    microsoft: "https://microsoft.com",
  } satisfies SiteLinks,

  // Screenshots per project id (files live in public/images/projects/<id>/).
  gallery: {
    workchi: ["/images/projects/workchi/1.jpg", "/images/projects/workchi/2.jpg"],
    narvash: ["/images/projects/narvash/1.jpg", "/images/projects/narvash/2.jpg"],
    boomsv: ["/images/projects/boomsv/1.jpg", "/images/projects/boomsv/2.jpg"],
  } as Record<string, string[]>,

  // Dated entries for the Calendar apps, e.g. { date: "2026-03-21", title: "Workchi launch" }.
  events: [] as CalendarEvent[],

  stats: {
    experience: "+2",
    projects: "+3",
    technologies: "+9",
  },

  about: [
    "Hi, I'm Ali Ebrahimnezhad, a full-stack developer who builds practical, production-ready web products. My day-to-day stack is Next.js on the front end with TypeScript, and Node.js / Express and NestJS on the back end, backed by MySQL and PostgreSQL.",
    "Most of my work is for real businesses rather than side demos: an order platform for a digital and printing studio, a wholesale/export storefront for Iranian barberries, and a sports-consulting platform. In each one the hard part is the same — turning an unclear request into a clear, trackable flow that a non-technical customer can actually use.",
    "I care about the details users never name: honest empty states, forms that tell you what went wrong, order tracking that does not require a phone call, and interfaces that stay fast on a mid-range phone and an unreliable connection. I also work with WordPress, WooCommerce and SEO when a client needs a marketing site as well as an application.",
  ],

  skills: [
    { name: "React", pct: 78, icon: "react" },
    { name: "Next.js", pct: 80, icon: "nextjs" },
    { name: "TypeScript", pct: 82, icon: "ts" },
    { name: "Node.js", pct: 85, icon: "node" },
    { name: "NestJS", pct: 68, icon: "nestjs" },
    { name: "Express", pct: 88, icon: "express" },
    { name: "MySQL", pct: 80, icon: "mysql" },
    { name: "PostgreSQL", pct: 70, icon: "postgres" },
    { name: "WordPress", pct: 65, icon: "wordpress" },
  ] satisfies Skill[],

  projects: [
    {
      id: "workchi",
      title: "Workchi",
      tagline: "Ordering platform for a digital & printing studio",
      desc: `Workchi is a specialist platform for text services and publishing. Instead of bouncing between phone calls, message threads and scattered price lists, a customer opens one account and places a real order for anything the studio produces — typing and translation, page layout and typesetting, book printing and binding, and website design.

The whole point of the product is that the order process is simple and fully transparent. From the moment a request is submitted and priced, through production and quality control, to final delivery, every stage is online and trackable. Customers can see exactly where their job is, what it costs and when it will be finished, without needing to chase anyone.

It is built as a modern full-stack application: a Next.js front end for the storefront, the customer dashboard and the studio's internal queue, with an Express API carrying the business logic, authentication and file handling behind it.`,
      highlights: [
        "One online flow from request → automatic pricing → production → delivery",
        "Every order step is visible and trackable for the customer, no phone calls needed",
        "Covers typing & translation, page layout, book printing and website design",
        "Next.js storefront + dashboard on an Express API",
      ],
      tags: ["Next.js", "TypeScript", "Express", "Node.js", "MySQL"],
      link: "https://workchi.ir",
      linkLabel: "Visit workchi.ir",
      year: "2026",
      logo: "/images/workchi.jpg",
    },
    {
      id: "narvash",
      title: "Narvash",
      tagline: "Wholesale & export of Iranian barberries",
      desc: `Narvash is a wholesale storefront for Iranian barberries (zarshk) — the deep-red sour fruit Iran exports all over the world. The company runs the entire production chain itself, from orchard to finished package, from its base in South Khorasan, so quality control never leaves the family's hands.

The site is aimed at buyers, not consumers: distributors, grocers and export partners who order by the kilo and care about grade, cleanliness and consistency. Every batch is laser colour-sorted into puffy (pofaki) and pomegranate-aril varieties, with absolutely nothing added — no sugar, no syrup, no colouring. Wholesale buyers get a clear, trustworthy product story, transparent grading and a reliable path from the orchard to a shipment bound for the domestic market or for export.

The site is built on WordPress, with the catalogue and wholesale enquiry flow managed through the WordPress admin so the team can publish new harvest batches and update grades without touching code.`,
      highlights: [
        "Full in-house chain: orchard → sorting → packing, managed in South Khorasan",
        "Laser colour-sorted into puffy (pofaki) and pomegranate-aril grades",
        "No additives whatsoever — nothing added to the fruit at any stage",
        "Built on WordPress, so the team publishes new harvest batches from the admin",
      ],
      tags: ["WordPress", "WooCommerce", "PHP", "MySQL", "SEO"],
      link: "https://narvash.com",
      linkLabel: "Visit narvash.com",
      year: "2025",
      logo: "/images/narvash.jpg",
    },
    {
      id: "boomsv",
      title: "Boom Sazegan Varzash",
      tagline: "Sports consultancy that builds your training plan",
      desc: `Boom Sazegan Varzash is a sports-consulting platform. It opens with a simple idea: every goal has a right route — you just have to find yours first.

Before anyone starts training, they sit down with a consultant, explain what they actually want out of sport (lose weight, build muscle, prepare for a race, rehabilitate an injury) and describe their current situation. That consultation becomes a formal sports file: measurable targets, a timeline, and a plan built around their real life. From the plan the platform matches them with the right coach and the right method, so nobody is following a generic routine that was never designed for them.

The site's job is to make that first step frictionless — a clear path from "I have a goal" to "here is my coach and here is my programme".`,
      highlights: [
        "Consultation-first flow: state your goal and situation before any training starts",
        "Every consultation turns into a formal, measurable sports file with targets and a timeline",
        "Matches each person with the right coach and training method for their goal",
        "Covers weight loss, muscle building, race preparation and injury rehabilitation",
      ],
      tags: ["Next.js", "TypeScript", "Express", "PostgreSQL", "REST API"],
      link: "https://boomsv.ir",
      linkLabel: "Visit boomsv.ir",
      year: "2025",
    },
  ] satisfies Project[],

  // Items shown as desktop icons AND (minus "contact") inside the Start Menu.
  desktopItems: [
    {
      id: "resume",
      label: "resume.pdf",
      icon: "pdf",
      type: "window",
      target: "resume",
    },
    {
      id: "projects",
      label: "projects",
      icon: "folder",
      type: "window",
      target: "projects",
    },
    {
      id: "about",
      label: "about me",
      icon: "user",
      type: "window",
      target: "about",
    },
    {
      id: "skills",
      label: "skills",
      icon: "skills",
      type: "window",
      target: "skills",
    },
    {
      id: "calculator",
      label: "calculator",
      icon: "calculator",
      type: "window",
      target: "calculator",
    },
    { id: "cmd", label: "cmd", icon: "cmd", type: "window", target: "cmd" },
    {
      id: "ie",
      label: "internet explorer",
      icon: "ie",
      type: "window",
      target: "ie",
    },
    {
      id: "github",
      label: "github",
      icon: "github",
      type: "link",
      target: "github",
    },
    {
      id: "linkedin",
      label: "linkedin",
      icon: "linkedin",
      type: "link",
      target: "linkedin",
    },
    {
      id: "telegram",
      label: "telegram",
      icon: "telegram",
      type: "link",
      target: "telegram",
    },
    {
      id: "instagram",
      label: "instagram",
      icon: "instagram",
      type: "link",
      target: "instagram",
    },
    {
      id: "phone",
      label: "contact",
      icon: "phone",
      type: "window",
      target: "contact",
    },
    {
      id: "photos",
      label: "photos",
      icon: "photos",
      type: "window",
      target: "photos",
    },
    {
      id: "minesweeper",
      label: "minesweeper",
      icon: "minesweeper",
      type: "window",
      target: "minesweeper",
    },
    {
      id: "recycle",
      label: "recycle bin",
      icon: "recycle",
      type: "window",
      target: "recycle",
    },
  ] satisfies DesktopItem[],

  // Extra items that only appear inside the Start Menu.
  startMenuExtraItems: [
    {
      id: "settings",
      label: "Settings",
      icon: "settings",
      type: "window",
      target: "settings",
    },
    { id: "nero", label: "Nero Burning ROM", icon: "nero", type: "window", target: "nero" },
    { id: "solitaire", label: "Solitaire", icon: "solitaire", type: "window", target: "solitaire" },
    { id: "freecell", label: "FreeCell", icon: "freecell", type: "window", target: "freecell" },
    { id: "paint", label: "Paint", icon: "paint", type: "window", target: "paint" },
    { id: "media", label: "Media Player", icon: "media", type: "window", target: "media" },
    { id: "taskmgr", label: "Task Manager", icon: "taskmgr", type: "window", target: "taskmgr" },
    {
      id: "google",
      label: "Google",
      icon: "google",
      type: "link",
      target: "google",
    },
    {
      id: "microsoft",
      label: "Microsoft",
      icon: "microsoft",
      type: "link",
      target: "microsoft",
    },
  ] satisfies DesktopItem[],
};

// Human-readable titles / icons / default sizes for each window.
export const windowMeta: Record<string, WindowMeta> = {
  resume: { title: "resume.pdf", icon: "pdf", width: 820, height: 680 },
  projects: { title: "projects", icon: "folder", width: 860, height: 600 },
  about: { title: "about me", icon: "user", width: 640, height: 560 },
  skills: { title: "skills", icon: "skills", width: 420, height: 560 },
  contact: { title: "contact card", icon: "phone", width: 300, height: 360 },
  calculator: {
    title: "Calculator",
    icon: "calculator",
    width: 260,
    height: 360,
  },
  cmd: {
    title: "C:\\Windows\\system32\\cmd.exe",
    icon: "cmd",
    width: 620,
    height: 400,
  },
  ie: { title: "Internet Explorer", icon: "ie", width: 920, height: 620 },
  settings: { title: "Settings", icon: "settings", width: 520, height: 600 },
  recycle: { title: "Recycle Bin", icon: "recycle", width: 640, height: 420 },
  nero: { title: "Nero Burning ROM", icon: "nero", width: 760, height: 540 },
  minesweeper: { title: "Minesweeper", icon: "minesweeper", width: 740, height: 560 },
  solitaire: { title: "Solitaire", icon: "solitaire", width: 660, height: 560 },
  freecell: { title: "FreeCell", icon: "freecell", width: 700, height: 560 },
  taskmgr: { title: "Task Manager", icon: "taskmgr", width: 640, height: 480 },
  paint: { title: "Paint", icon: "paint", width: 760, height: 600 },
  media: { title: "Media Player", icon: "media", width: 680, height: 440 },
  photos: { title: "Photos", icon: "photos", width: 760, height: 540 },
};

/** Domain of a project link, e.g. "https://workchi.ir" → "workchi.ir". */
export function projectDomain(link: string): string {
  return link.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

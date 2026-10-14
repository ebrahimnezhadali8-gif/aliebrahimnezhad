import type { Language } from "./language";

/**
 * Every user-facing string that isn't personal content (which lives in
 * `siteConfig.ts` / `i18n/fa.ts`). Keys are grouped by surface so it's obvious
 * what's still untranslated when adding a language.
 */
const en = {
  // Shell
  startMenu: "Start menu",
  power: "Restart",
  showDesktop: "Show desktop",
  restart: "Restart",

  // Clock
  calendar: "Calendar",
  gregorian: "Gregorian",
  jalali: "Jalali (Shamsi)",
  toggleCalendar: "Switch calendar system",

  // Windows
  settings: "Settings",
  browser: "Internet Explorer",
  projects: "Projects",
  about: "About Me",
  skills: "Skills",
  calculator: "Calculator",
  resume: "Résumé",
  contact: "Contact",

  // Browser
  address: "Address",
  reload: "Reload",
  openInNewTab: "Open in browser",
  previewUnavailable:
    "Some sites refuse to be embedded. If the page stays blank, open it in a real tab.",
  livePreview: "Live preview",
  favorites: "Favorites",
  back: "Back",
  forward: "Forward",
  home: "Home",

  // Settings
  appearance: "Appearance",
  darkMode: "Dark mode",
  darkModeHint: "Switch the whole interface to a dark theme",
  wallpaper: "Wallpaper",
  nextBackground: "Next background",
  brightness: "Brightness",
  volume: "Volume",
  language: "Language",
  languageHint: "Choose the language and reading direction of the interface",
  screen: "Screen",
  sound: "Sound",
  system: "System",
  on: "On",
  off: "Off",

  // Context menu / tray
  showDesktopIcons: "Show desktop icons",
  refresh: "Refresh",
  nextBackgroundTooltip: "Next background",
  screenBrightness: "Screen brightness",

  // Apps
  notes: "Notes",
  projectsApp: "Projects",
  mail: "Mail",
  phone: "Phone",
  safari: "Safari",
  github: "GitHub",
  linkedin: "LinkedIn",
  instagram: "Instagram",
  telegram: "Telegram",
  calculatorApp: "Calculator",
  aboutApp: "About Me",
  settingsApp: "Settings",
  messagesApp: "Messages",
  messagesGreeting: "Hi! I'm Ali. Thanks for stopping by — send me a message here.",
  messagesReply: "Thanks for the message! I'll get back to you soon. For something quick, Telegram is the fastest way.",
  messagesPlaceholder: "iMessage",
  openTelegram: "Open Telegram",
  today: "Today",
  backToHome: "Back to Home",
  backLabel: "Back",

  // Skills / stats
  years: "Years",
  projectsStat: "Projects",
  tech: "Tech",
  yearsExp: "Years Exp.",
  technologies: "Technologies",
  highlights: "Highlights",
  builtWith: "Built with",
  technologiesLabel: "Technologies",

  // Mail
  to: "To",
  from: "From",
  subject: "Subject",
  subjectPlaceholder: "What is this about?",
  message: "Message",
  messagePlaceholder: "Write your message…",
  yourName: "Your name",
  copy: "Copy",
  copied: "Copied",
  send: "Send",
  sendTo: "Send to",
  mailNote:
    "Sending opens your own mail app with everything pre-filled — nothing is stored on this site.",
  mailOr: "Prefer writing directly?",
  mailSentNote:
    "Your mail app should have opened with the message ready. If nothing happened, email",
  mailPreview: "Preview",

  // Contact
  email: "Email",
  tel: "Phone",
  location: "Location",

  // Control center
  controlCenter: "Control Center",
  openControlCenter: "Open Control Center",
  airplane: "Airplane",
  wifi: "Wi-Fi",
  bluetooth: "Bluetooth",
  focus: "Focus",
  rotation: "Rotation",
} as const;

/** Key set comes from `en`; every value is a plain string so translations fit. */
export type UiStrings = { [K in keyof typeof en]: string };

const fa: UiStrings = {
  startMenu: "منوی استارت",
  power: "راه‌اندازی مجدد",
  showDesktop: "نمایش دسکتاپ",
  restart: "راه‌اندازی مجدد",

  calendar: "تقویم",
  gregorian: "میلادی",
  jalali: "شمسی (هجری)",
  toggleCalendar: "تغییر تقویم",

  settings: "تنظیمات",
  browser: "اینترنت اکسپلورر",
  projects: "پروژه‌ها",
  about: "درباره من",
  skills: "مهارت‌ها",
  calculator: "ماشین‌حساب",
  resume: "رزومه",
  contact: "تماس",

  address: "نشانی",
  reload: "بارگذاری مجدد",
  openInNewTab: "باز کردن در مرورگر",
  previewUnavailable:
    "بعضی سایت‌ها اجازه‌ی نمایش داخل قاب را نمی‌دهند. اگر صفحه خالی ماند، آن را در یک زبانه‌ی واقعی باز کنید.",
  livePreview: "پیش‌نمایش زنده",
  favorites: "علاقه‌مندی‌ها",
  back: "بازگشت",
  forward: "جلو",
  home: "خانه",

  appearance: "ظاهر",
  darkMode: "حالت تاریک",
  darkModeHint: "کل رابط کاربری به تم تیره تغییر کند",
  wallpaper: "پس‌زمینه",
  nextBackground: "پس‌زمینه‌ی بعدی",
  brightness: "روشنایی",
  volume: "صدا",
  language: "زبان",
  languageHint: "زبان و جهت نوشتن رابط کاربری را انتخاب کنید",
  screen: "صفحه",
  sound: "صدا",
  system: "سیستم",
  on: "روشن",
  off: "خاموش",

  showDesktopIcons: "نمایش آیکون‌های دسکتاپ",
  refresh: "تازه‌سازی",
  nextBackgroundTooltip: "پس‌زمینه‌ی بعدی",
  screenBrightness: "روشنایی صفحه",

  notes: "یادداشت‌ها",
  projectsApp: "پروژه‌ها",
  mail: "ایمیل",
  phone: "تلفن",
  safari: "سافاری",
  github: "گیت‌هاب",
  linkedin: "لینکدین",
  instagram: "اینستاگرام",
  telegram: "تلگرام",
  calculatorApp: "ماشین‌حساب",
  aboutApp: "درباره من",
  settingsApp: "تنظیمات",
  messagesApp: "پیام‌ها",
  messagesGreeting: "سلام! من علی هستم. ممنون که سر زدید — همین‌جا برایم پیام بگذارید.",
  messagesReply: "ممنون از پیامتان! به‌زودی پاسخ می‌دهم. برای کار فوری، تلگرام سریع‌ترین راه است.",
  messagesPlaceholder: "پیام",
  openTelegram: "باز کردن تلگرام",
  today: "امروز",
  backToHome: "بازگشت به خانه",
  backLabel: "بازگشت",

  years: "سال",
  projectsStat: "پروژه",
  tech: "فناوری",
  yearsExp: "سال تجربه",
  technologies: "فناوری‌ها",
  highlights: "نکات کلیدی",
  builtWith: "ساخته‌شده با",
  technologiesLabel: "فناوری‌ها",

  to: "به",
  from: "از",
  subject: "موضوع",
  subjectPlaceholder: "موضوع پیام چیست؟",
  message: "پیام",
  messagePlaceholder: "پیامتان را بنویسید…",
  yourName: "نام شما",
  copy: "کپی",
  copied: "کپی شد",
  send: "ارسال",
  sendTo: "ارسال به",
  mailNote:
    "با زدن ارسال، برنامه‌ی ایمیل خودتان با متن کامل باز می‌شود — هیچ چیزی روی این سایت ذخیره نمی‌شود.",
  mailOr: "ترجیح می‌دهید مستقیم بنویسید؟",
  mailSentNote: "برنامه‌ی ایمیل شما باید با پیام آماده باز شده باشد. اگر اتفاقی نیفتاد، ایمیل بزنید به",
  mailPreview: "پیش‌نمایش",

  email: "ایمیل",
  tel: "تلفن",
  location: "موقعیت",

  controlCenter: "مرکز کنترل",
  openControlCenter: "باز کردن مرکز کنترل",
  airplane: "حالت پرواز",
  wifi: "وای‌فای",
  bluetooth: "بلوتوث",
  focus: "تمرکز",
  rotation: "چرخش",
};

export const uiStrings: Record<Language, UiStrings> = { en, fa };

/** Looks up a UI string, falling back to English for any missing translation. */
export function translate(lang: Language, key: keyof UiStrings): string {
  return uiStrings[lang][key] ?? uiStrings.en[key];
}
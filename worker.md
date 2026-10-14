# worker.md — گزارش کار

همه زمان‌ها به وقت تهران (Iran Standard Time, UTC+03:30) است.

---

## 2026-10-14 — ۱۰:۰۱

### ۱. بررسی اولیه پروژه
- خواندن `package.json`، `README.md`، ساختار `src/`، تنظیمات Vite و `App.tsx`.
- پروژه: سایت رزومه به شکل ویندوز ۷ (دسکتاپ) و UI شبیه آیفون (موبایل). React 19 + TypeScript + Vite + Bootstrap.
- ایجاد `.claude/launch.json` برای اجرای dev server روی پورت 5173 (جهت تست در مرورگر داخلی).

### ۲. نتیجه تست‌ها و ابزارها
| ابزار | نتیجه |
|---|---|
| `vitest run` (قبل از تغییر) | ✅ ۲۹ فایل، ۲۴۵ تست — همه پاس |
| `tsc -b` | ✅ بدون خطا |
| `oxlint` | ⚠️ فقط warning: `react(refs)` / `react(globals)` در `Window.tsx` (خواندن/نوشتن ref و متغیر ماژول حین render) و `only-export-components` در `WindowManagerContext.tsx`، `DesktopSettingsContext.tsx`، `main.tsx`. خطای واقعی نیست ولی بدهی فنیِ ثبت‌شده. |
| README | ⚠️ تعداد تست‌ها قدیمی بود (۲۱۸ نوشته بود، واقعی ۲۴۵). |

### ۳. مشکلات UI پیدا شده
1. **آیکون‌های موبایل وسط تایل نبودند** (سند، نوت، پروژه، About، Skills، ماشین‌حساب، لینکدین…): همه به سمت چپ/بالا چسبیده بودند. علت: `<Icon>` یک `span` با `display:block` به عرض کل تایل است و SVG داخلش چپ‌چین می‌ماند.
2. **اپ Résumé موبایل خالی نشان داده می‌شد**: `iframe` با PDF در موبایل (iOS Safari / Android Chrome) معمولاً خالی یا تک‌صفحه‌ای است و هیچ راه جایگزینی نداشت. همچنین CSS آن اشتباهاً داخل `NotesApp.css` بود.
3. **README قدیمی** (تعداد تست).
4. دسکتاپ: Taskbar، Start، پنجره‌های Projects/About/Resume، آیکون‌ها و بوت بررسی شد؛ مشکل بصری جدی دیده نشد.
5. موبایل (۳۲۰×۴۸۰): Notes، Projects (و جزئیات)، About، Skills، Calculator، Phone، Mail، Control Center و صفحه دوم هوم بررسی شد — بقیه سالم بودند. موارد جزئی ثبت‌شده در `idea.md`.

### ۴. تغییرات انجام شده
- `src/components/mobile/HomeScreen/AppIcon.css`: اضافه شدن `.app-icon__glyph .icon { display:flex; align-items:center; justify-content:center; width:100%; height:100% }` → آیکون‌ها دقیقاً وسط تایل (برای سیستمی، برند، دوک و دسکتاپ‌سایز تبلت). با JS اندازه‌گیری و با اسکرین‌شات تأیید شد (اختلاف مرکز SVG و تایل = ۰px).
- `src/components/mobile/apps/ResumeApp.tsx` + جدید `ResumeApp.css`: نوار **Open PDF** و **Download** بالای iframe، iframe پرکننده‌ی فضای باقی‌مانده؛ CSS از `NotesApp.css` به فایل خودش منتقل شد.
- `src/components/mobile/apps/ResumeApp.test.tsx` (جدید): ۲ تست — لینک‌های Open/Download و iframe.
- `README.md`: تعداد تست‌ها به ۲۴۷ در ۳۰ فایل اصلاح شد.
- `CLAUDE.md` (جدید): توضیح پروژه، دستورات، ساختار، قراردادها، نکات آموخته‌شده.
- `idea.md` (جدید): ایده‌های پیشنهادی.

### ۵. تأیید نهایی
- `vitest run src/components/mobile` → ✅ ۸ فایل، ۹۴ تست پاس. `tsc -b` ✅.
- تست دستی در ۳۲۰×۴۸۰ (آیفون ۴): آیکون‌ها وسط، رزومه با دکمه‌ها.

### ۶. نکته‌ها
- ساعت Git Bash روی این سیستم `TZ` را نادیده می‌گیرد و UTC می‌دهد؛ ساعت تهران با PowerShell (`Iran Standard Time`) گرفته شد.
- Control Center در ۴۸۰px ارتفاع، ردیف دوم دکمه‌ها (۳+۲) یک خانه خالی دارد (جزئی، در ایده‌ها).

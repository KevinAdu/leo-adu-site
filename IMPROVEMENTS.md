# Improvements Backlog

## Content + i18n
- Expand album age buckets beyond 6 months in `src/helpers/age.ts` and add matching i18n keys in `src/i18n/ui.ts` so older photos map to a real album label.
- Align locale filters with content; right now all content is under `en/`, so the default `ja` locale will show empty content unless you add `ja` content.
- Remove unused i18n keys like `tabs.youtube` and `more_videos` after removing YouTube.

## Routing + Slugs
- Fix `src/components/PostPreview.astro` slug trimming to remove only the `en/` prefix instead of slicing the first two characters, so non-English content works correctly.

## Sharing + SEO
- Add per-photo social cards and metadata so individual photos share better (Open Graph image and description per entry).

## Weekly Email
- Add a scheduled job (Netlify Scheduled Function) to email photos added in the last 7 days.
- Decide the weekly window timezone (e.g., Asia/Tokyo) and use `publish-date` for filtering.
- Render a lightweight HTML email with thumbnails + links and send via Resend/SendGrid/Postmark.
- Store config in env vars: email provider key, sender, recipients list, timezone.

## GitHub Issues (Open)
- Use DeepL API to auto fill out English posts. (#52)
- Fix issue which prevents uploading of photos. (#50)
- Mark photos which arent translated in CMS page. (#49)
- Automatically copy over title and caption to English translation when first uploaded. (#48)
- Add pagination to all photos page. (#47)
- Add pagination to Netlify CMS page. (#46)
- Update Netlify CMS. (#45)
- Update Astro. (#44)
- Add favicon. (#40)
- Add correct meta data for search results for each page. (#37)
- Add splash page when opening home page with logo. (#33)
- Add Share button and modal to Show Photo page. (#25)
- Add Skeletons to pages with images. (#17)
- Add About Us page. (#10)

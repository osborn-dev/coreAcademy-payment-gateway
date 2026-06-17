# ROADMAP — Future Ideas

> Sketches, not full briefs. This is a "build as ideas come" project — capture ideas here, then promote one to a numbered `0X_*.md` brief (with contracts + tier tags + Sonnet blocks) when it's time to build it. Local-only doc.

---

## Likely next phases (rough priority)

### Content Admin UI (replaces seed scripts) — ✅ PROMOTED to `09_ADMIN_DASHBOARD.md`
Now a full brief: `/admin` for posts + courses/lessons CRUD + comment moderation, gated by an `ADMIN_EMAILS` allowlist. Not yet built. See `09_ADMIN_DASHBOARD.md`.

### User accounts & saved roadmaps
Let users log in and save the AI-generated roadmaps + bookmark content. Turns the one-shot search into a returning experience.
- New tables (Drizzle): `users` (platform users, distinct from payment `User`), `bookmarks`, `saved_roadmaps`.
- Auth via `next-auth`. **Promote when:** people ask to "come back to my roadmap."

### Engagement: comments / reactions
Lightweight reactions (👍 / "helpful") and/or comments on posts to make it feel like a community, not a brochure.
- New table `reactions` / `comments`; rate-limited write routes; moderation consideration.

### Newsletter / digest
Capture emails and send a weekly "trending on CoreAcademy" digest. `nodemailer` is already wired for the payment flow — reuse the transporter.

### Bookings deepening
The `/bookings` page exists (Calendly + timezone). Could integrate session history, reminders, or tie a booked session to a user account once accounts exist.

### Search upgrades
- Vector search (embeddings) if the content library grows past what Postgres FTS handles well.
- Save & refine roadmaps; "continue where you left off."

---

## The eventual big one: Mongo → Postgres payment migration

Today the app is dual-DB on purpose (content in Postgres/Drizzle, payment in MongoDB/Mongoose). When ready:
1. Model `users` + `payments` in Drizzle.
2. Migrate existing Mongo documents into Postgres (one-off script).
3. Rewrite `app/api/{submit,stripe,paystack,paystack-webhook,payment-success}` to use Drizzle.
4. Update `/payment` to read/write Postgres.
5. Drop MongoDB + `Config/DataBase.js` + Mongoose dependency.

This is a large, money-touching, all-`[OPUS]` migration. It gets its own dedicated brief with a rollback plan. **Do not start it until the content platform is stable and the payment flow has a tested staging environment.**

---

## Parking lot (unsorted ideas)

- Dark/light theme toggle (currently dark-only)
- RSS feed for posts
- Series/multi-part courses (group posts into an ordered curriculum)
- Author profiles (when content has multiple authors)
- Analytics dashboard for the owner (views, popular topics)
- _Add new ideas here as they come — then graft the good ones into a numbered brief._

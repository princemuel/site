# Project Roadmap

## Design System

### Color Schemes
- Light/dark mode with system preference detection
- Color palette inspired by appwrite.io docs
- Smooth theme transitions
- Consider: accent colors for CTAs, links, code blocks

### Typography
**Sans-serif candidates:** cabin, wotfard, zeitung, quicksand, proxima nova, manrope, ubuntu, maven pro, josefin sans, PT sans narrow, Sen

**Monospace candidates:** source code pro, jetbrains mono, monaco, cascadia code

**Typography scale:**
- Heading hierarchy (h1-h6)
- Body text (regular, small, large)
- Code blocks and inline code
- Captions and metadata

### Layout Components
- **Header:** logo, main navigation, theme toggle, search(?), newsletter CTA(?)
- **Footer:** secondary navigation, social links, copyright, theme toggle(?), back-to-top
- **Sidebar:** table of contents, related posts, tag cloud, recent posts(?)
- Mobile-first responsive breakpoints
- Container max-widths for readability

---

## Core Pages

### 1. Landing/Home
- Hero section with brief introduction
- Featured projects (2-3 highlights)
- Recent blog posts (3-5 latest)
- Quick links to key sections
- Optional: testimonials, skills showcase, stats counter
- **Decision needed:** Should main nav be on landing or separate?

### 2. About Me
- Professional bio
- Photo/headshot
- Skills and technologies
- Experience timeline
- Education
- Interests/hobbies
- Current availability status
- Optional: now page (what I'm doing now)

### 3. Contact/Say Hello
- Contact form with fields:
  - Name
  - Email
  - Subject
  - Message
  - Optional: Project budget, timeline
- Email delivery service (Resend, SendGrid, Mailgun?)
- Spam protection (Turnstile, reCAPTCHA, honeypot?)
- Success/error states
- Alternative contact methods (email, social media)
- Response time expectations

### 4. Newsletter
- Subscription form with email validation
- Double opt-in confirmation
- Unsubscribe link
- Archive of past newsletters (paginated)
- Email service provider (ConvertKit, Buttondown, Mailchimp?)
- Optional: subscriber count, frequency info

### 5. Resume/CV
- Web version (HTML/CSS)
- PDF download option (generated from Google Docs or Typst?)
- Print-friendly stylesheet
- Sections: experience, education, skills, projects, certifications
- Optional: interactive timeline

---

## Content Pages

### Blog
**List page (`/blog`):**
- Paginated posts (10-20 per page)
- Search functionality
- Filter by tags/categories
- Sort options (newest, popular, alphabetical)
- Featured posts section
- Estimated read time for each post

**Individual post (`/blog/[slug]`):**
- Table of contents (sticky sidebar or collapsible)
- Estimated read time
- Publication/update dates
- Author info (if multi-author in future)
- Tags/categories
- Social share buttons
- Comments system (Giscus/GitHub Discussions, Utterances, or custom?)
- Code syntax highlighting with copy button
- Image zoom/lightbox
- "Report an issue" link (opens GitHub issue)
- Related posts
- Newsletter CTA
- Previous/next post navigation
- **Optional:** reactions/likes, reading progress bar

**OG Images (`/blog/[slug]/og.png`):**
- Dynamic OG image generation
- Include post title, author, date
- Consistent branding

**Tags (`/blog/tags/[tag]`):**
- All posts with specific tag
- Tag description/context
- Tag cloud or list view

**Feeds:**
- RSS (`/blog/rss.xml`)
- Atom (`/blog/atom.xml`)
- JSON Feed (`/blog/feed.json`)

### Projects
**List page (`/projects`):**
- Grid or card layout
- Filter by technology/category
- Sort by date/popularity
- Featured projects
- Status indicators (active, archived, WIP)

**Individual project (`/projects/[slug]`):**
- Project description and goals
- Technologies used (with icons?)
- Screenshots/demo video
- Live site link
- Repository link (if public)
- Key features
- Challenges and learnings
- Table of contents (if detailed)
- Optional: comments, related projects

### Journal
**List page (`/journal`):**
- Chronological entries (paginated)
- Date-based filtering
- Tags/moods(?)
- Search functionality

**Individual entry (`/journal/[slug]`):**
- Date and time
- Mood/tags
- Content with markdown support
- Optional: location, weather, photos

**Privacy considerations:**
- Public vs private entries
- Authentication for private content?

### Articles (External)
**List page (`/articles`):**
- Curated list of articles published elsewhere
- Publication name/logo
- Publication date
- External link indicator
- Brief excerpt

**Individual page (`/articles/[slug]`):**
- Summary/key takeaways
- Link to original article
- Discussion/thoughts
- Related internal posts

---

## Utility Pages

### Legal
- **Terms of Service:** usage terms, disclaimers
- **Privacy Policy:** data collection, cookies, analytics, email list
- **License:** content license (CC BY-SA?), code license (MIT?)
- **Cookie Policy** (if using cookies)

### Error Pages
- **404 (Not Found):** friendly message, search, popular pages, home link
- **500 (Server Error):** maintenance message, contact info, status page link
- **Offline:** service worker page for PWA, cached content

### Health/Status
- **All Systems Normal:** uptime status, latest deploy, build info
- Optional: link to status.io or custom status page

---

## Dashboard (Admin/Personal)

### Changelog
- Site updates and version history
- Feature releases
- Bug fixes
- Design changes
- Grouped by date/version

### Analytics
**Public metrics:**
- Popular posts
- Total page views (aggregated)
- Top countries/regions

**Private analytics (authenticated):**
- Detailed page views
- Referrers
- User flow
- Performance metrics (Core Web Vitals)
- Search queries
- Service: Plausible, Fathom, Umami, or custom?

### Resources
- Curated books (with ratings/notes)
- Videos/courses
- Useful articles
- Conferences attended/want to attend
- Tools and software
- Organized by category/topic

### Snippets
- Code snippets with explanations
- Searchable and filterable by language/category
- Copy button
- Syntax highlighting
- Use cases and examples

---

## Technical Features

### Performance
- Image optimization (Sharp, Astro's Image component)
- Lazy loading
- Code splitting
- Critical CSS
- Preloading/prefetching
- CDN for assets
- Service worker for offline support (PWA?)

### SEO
- Meta tags (title, description, keywords)
- Open Graph tags
- Twitter Card tags
- Canonical URLs
- Structured data (JSON-LD) for blog posts, breadcrumbs
- Sitemap (`sitemap.xml`)
- Robots.txt

### Accessibility
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation
- Focus indicators
- Skip to content link
- Alt text for images
- Color contrast compliance (WCAG AA/AAA)
- Screen reader testing

### Internationalization (i18n)
- **Decision needed:** Single language or multi-language?
- If multi-language: date formatting, number formatting, content translation strategy

### Search
- Global search functionality
- Search posts, projects, journal entries
- Algolia, Pagefind, or custom implementation?
- Search shortcuts (Cmd+K)

### Content Management
- Markdown/MDX for content authoring
- Frontmatter validation (Zod schemas)
- Content collections with TypeScript types
- Draft posts (unpublished)
- Scheduled publishing
- Version control (Git-based)

### Comments System
- **Options:** 
  - Giscus (GitHub Discussions)
  - Utterances (GitHub Issues)
  - Custom with Supabase/Firebase
  - Self-hosted (Commento)
- Comment moderation
- Email notifications for replies

### Email System
**Transactional emails:**
- Newsletter confirmation
- Contact form submission (to you)
- Contact form auto-reply (to sender)
- Newsletter welcome email

**Email templates:**
- Responsive HTML templates
- Plain text fallbacks
- Consistent branding
- Unsubscribe links

**Provider:** Resend, SendGrid, Postmark, AWS SES?

### Forms
- Client-side validation
- Server-side validation
- Rate limiting
- CSRF protection
- Accessibility (labels, error messages)
- Loading states

---

## Missing/Additional Considerations

### Content Strategy
1. **Uses page** (`/uses`): tools, software, hardware, desk setup
2. **Bookmarks** (`/bookmarks`): curated links to interesting content
3. **Speaking** (`/speaking`): talks, presentations, podcasts (if applicable)
4. **Media** (`/media`): press mentions, interviews
5. **Stats page**: personal statistics, year in review
6. **TIL (Today I Learned)** (`/til`): micro-posts of learnings

### Features to Consider
1. **Reading list/bookshelf**: books you're reading or have read
2. **Link in bio page**: social media aggregator
3. **Digital garden**: interconnected notes (if journal evolves)
4. **Webmentions**: show responses from other sites
5. **Guestbook**: visitor messages
6. **AMA (Ask Me Anything)**: Q&A section
7. **Series/Collections**: group related posts
8. **Estimated time to read** across all content types
9. **View counter**: how many times content has been viewed
10. **Related content** algorithm: suggest similar posts/projects

### Technical Decisions Needed
1. **Hosting:** Vercel, Netlify, Cloudflare Pages, self-hosted?
2. **Database:** Do you need one? (comments, analytics, bookmarks)
   - Options: Supabase, PlanetScale, Turso, SQLite
3. **Authentication:** Needed for dashboard/admin?
   - Options: Auth.js, Supabase Auth, Clerk, custom
4. **Email provider:** Transactional + newsletter or separate?
5. **Media storage:** Where to host images/videos?
   - Options: Cloudinary, Uploadthing, S3, Vercel Blob
6. **Search provider:** Client-side or server-side?
7. **Analytics provider:** Self-hosted vs SaaS?
8. **Form backend:** Handle in API routes or service?
9. **Rate limiting:** How to prevent abuse?
10. **Monitoring:** Sentry, LogRocket for error tracking?

### Performance Targets
- Lighthouse score: 95+ across all metrics
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Bundle size goals
- Image optimization strategy

### Content Workflow
1. **Draft → Review → Publish** process
2. **Content calendar**: planning future posts
3. **Version history**: track content changes
4. **Collaboration**: if multiple authors in future
5. **Backup strategy**: content backup solution

### Mobile Experience
1. **Mobile navigation**: hamburger menu or bottom nav?
2. **Touch targets**: minimum 44x44px
3. **Swipe gestures**: next/previous post navigation?
4. **Mobile-specific features**: share sheet, install prompt (PWA)

### Progressive Web App (PWA)
- Service worker for offline content
- Installable to home screen
- Manifest.json
- Offline page with cached content
- Push notifications for new posts?

### Social Features
1. **Social links**: GitHub, Twitter/X, LinkedIn, Mastodon, etc.
2. **Share buttons**: Native share API on mobile
3. **Social cards**: Custom OG images for each page type
4. **Profile links**: Link aggregator (Linktree alternative?)

### Analytics & Metrics
**Track:**
- Page views
- Unique visitors
- Bounce rate
- Time on page
- Popular content
- Conversion funnels (newsletter signups, contact form)
- External link clicks
- Download tracking (resume, PDFs)
- Search queries
- Error tracking

### Content Types/Post Formats
- **Tutorial**: step-by-step guides
- **Deep dive**: long-form technical analysis
- **Quick tip**: short, actionable advice
- **Showcase**: project highlights
- **Opinion**: thought pieces
- **Case study**: problem-solving breakdowns
- **Link post**: commentary on external content

### Accessibility Enhancements
1. **Reduced motion**: respect prefers-reduced-motion
2. **Font scaling**: respect user font size preferences
3. **High contrast mode**: support for prefers-contrast
4. **Focus visible**: clear focus indicators
5. **Screen reader landmarks**: proper ARIA landmarks

---

## Questions to Answer

### Content & Strategy
1. What's your primary goal? (Portfolio, blog, thought leadership, all three?)
2. How often will you publish? (Daily, weekly, monthly?)
3. Who's your target audience? (Recruiters, peers, beginners, enterprise?)
4. Will this be a personal brand or professional brand?
5. Do you want comments? If yes, moderated or open?
6. Will you monetize? (Ads, sponsorships, courses, products?)
7. Do you want a newsletter? If yes, what cadence?

### Technical
1. What's your budget for hosting and services?
2. Do you need a CMS or is Git + markdown enough?
3. Will you need a database for dynamic features?
4. Do you want real-time features (live comments, chat)?
5. How important is SEO vs. design aesthetics?
6. Self-hosted analytics or third-party?
7. Will you need authentication for any features?

### Design
1. Minimalist or feature-rich UI?
2. Animation-heavy or subtle animations?
3. Sidebar navigation or header-only?
4. Single-column or multi-column layouts?
5. Card-based or list-based content display?

### Features Priority
1. What are must-haves for v1.0?
2. What can wait for v2.0?
3. What's a nice-to-have but not essential?

---

## Suggested Phased Rollout

### Phase 1: MVP (Launch)
- Landing page
- About page
- Blog (list + individual posts)
- Projects (list + individual)
- Contact form
- RSS feed
- Basic SEO
- Light/dark mode
- Mobile responsive

### Phase 2: Enhancement
- Newsletter integration
- Comments system
- Search functionality
- Tags/categories
- Analytics
- OG images
- Legal pages

### Phase 3: Advanced
- Journal section
- Dashboard
- Resources/snippets
- Advanced search
- Performance optimizations
- PWA features
- Webmentions

### Phase 4: Community
- Guestbook
- Bookmarks
- TIL section
- Speaking/media pages
- Enhanced social features

---

## Recommended Tech Stack (Suggestions)

**Core:**
- Astro (static site generation)
- TypeScript (type safety)
- Tailwind CSS (styling)
- MDX (content)

**Content:**
- Content Collections API
- Zod (schema validation)
- rehype/remark plugins (markdown processing)

**Features:**
- Pagefind (search)
- Giscus (comments)
- Resend (email)
- Vercel (hosting)
- Plausible/Umami (analytics)
- Cloudinary (images)

**Development:**
- Prettier (formatting)
- ESLint (linting)
- Husky (git hooks)
- Vitest (testing)

---

## Performance Checklist

- [ ] Image optimization (WebP, AVIF)
- [ ] Lazy loading images
- [ ] Code splitting
- [ ] CSS minification
- [ ] JS minification
- [ ] Critical CSS inlining
- [ ] Font subsetting
- [ ] Preload critical assets
- [ ] Compress assets (gzip/brotli)
- [ ] CDN for static assets
- [ ] Cache headers
- [ ] Service worker for offline
- [ ] Bundle size budget
- [ ] Lighthouse CI integration

---

## Accessibility Checklist

- [ ] Semantic HTML5 elements
- [ ] ARIA labels for icons
- [ ] Keyboard navigation
- [ ] Focus indicators
- [ ] Skip to content link
- [ ] Alt text for images
- [ ] Color contrast (WCAG AA minimum)
- [ ] Text resizing support
- [ ] Screen reader testing
- [ ] Reduced motion support
- [ ] Form validation messages
- [ ] Error handling
- [ ] Accessible modals/dialogs

---

## SEO Checklist

- [ ] Unique title tags (< 60 chars)
- [ ] Meta descriptions (< 160 chars)
- [ ] Open Graph tags
- [ ] Twitter Card tags
- [ ] Canonical URLs
- [ ] Sitemap.xml
- [ ] Robots.txt
- [ ] Structured data (JSON-LD)
- [ ] Internal linking
- [ ] Descriptive URLs
- [ ] 404 page
- [ ] Mobile-friendly
- [ ] Fast loading times
- [ ] HTTPS
- [ ] XML sitemap submission

---

## Content Ideas

### Blog Post Topics
- Technical tutorials (Rust, Python, TypeScript, Bash)
- Project deep-dives
- Performance optimization case studies
- Code quality and best practices
- Learning journeys
- Problem-solving approaches
- Tool reviews and comparisons
- Conference/meetup recaps

### Projects to Showcase
- Open source contributions
- Personal tools/utilities
- Client work (if shareable)
- Experimental projects
- Code libraries
- Side projects

### Resources to Curate
- Books that influenced your coding
- Courses worth taking
- Articles that changed your perspective
- Talks and presentations
- Tools that boost productivity
- Blogs worth following

---

## Maintenance Plan

### Regular Tasks
- **Daily:** Monitor analytics, respond to comments/contact
- **Weekly:** Publish content, check performance metrics
- **Monthly:** Review analytics, update content, security patches
- **Quarterly:** Dependency updates, feature roadmap review
- **Yearly:** Design refresh, content audit, goal setting

### Monitoring
- Uptime monitoring (UptimeRobot, Better Uptime)
- Error tracking (Sentry)
- Performance monitoring (Speedlify, Lighthouse CI)
- SEO monitoring (Search Console)
- Broken link checking

---

This roadmap should give you a comprehensive foundation. Start with Phase 1 MVP, then iterate based on user feedback and your goals.

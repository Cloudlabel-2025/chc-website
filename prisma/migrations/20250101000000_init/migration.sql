-- CHC CMS — Initial Migration
-- Generated from prisma/schema.prisma
-- Apply with: npx prisma migrate deploy (against a live DATABASE_URL)

-- ─── Enums ───────────────────────────────────────────────────────────────────

CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'SUPER_ADMIN');
CREATE TYPE "BlockType" AS ENUM ('TEXT', 'RICH_TEXT', 'IMAGE', 'URL', 'SELECT');
CREATE TYPE "FormType" AS ENUM ('CONTACT', 'GIVE_ONE_HOUR', 'NEWSLETTER');

-- ─── Users ───────────────────────────────────────────────────────────────────

CREATE TABLE "users" (
    "id"           TEXT NOT NULL,
    "email"        TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name"         TEXT NOT NULL,
    "role"         "UserRole" NOT NULL DEFAULT 'ADMIN',
    "isActive"     BOOLEAN NOT NULL DEFAULT true,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,
    "lastLoginAt"  TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- ─── Sessions ────────────────────────────────────────────────────────────────

CREATE TABLE "sessions" (
    "id"           TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId"       TEXT NOT NULL,
    "expires"      TIMESTAMP(3) NOT NULL,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

ALTER TABLE "sessions"
    ADD CONSTRAINT "sessions_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ─── Login Attempts ───────────────────────────────────────────────────────────

CREATE TABLE "login_attempts" (
    "id"          TEXT NOT NULL,
    "identifier"  TEXT NOT NULL,
    "attemptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "success"     BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "login_attempts_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "login_attempts_identifier_attemptedAt_idx"
    ON "login_attempts"("identifier", "attemptedAt");

-- ─── Media Assets ─────────────────────────────────────────────────────────────

CREATE TABLE "media_assets" (
    "id"           TEXT NOT NULL,
    "filename"     TEXT NOT NULL,
    "storageKey"   TEXT NOT NULL,
    "publicUrl"    TEXT NOT NULL,
    "mimeType"     TEXT NOT NULL,
    "sizeBytes"    INTEGER NOT NULL,
    "width"        INTEGER,
    "height"       INTEGER,
    "altText"      TEXT NOT NULL DEFAULT '',
    "uploadedById" TEXT NOT NULL,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "media_assets_storageKey_key" ON "media_assets"("storageKey");

-- ─── Pages ───────────────────────────────────────────────────────────────────

CREATE TABLE "pages" (
    "id"          TEXT NOT NULL,
    "slug"        TEXT NOT NULL,
    "title"       TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,
    "updatedById" TEXT NOT NULL,

    CONSTRAINT "pages_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "pages_slug_key" ON "pages"("slug");

-- ─── Sections ────────────────────────────────────────────────────────────────

CREATE TABLE "sections" (
    "id"          TEXT NOT NULL,
    "pageId"      TEXT NOT NULL,
    "sectionKey"  TEXT NOT NULL,
    "sortOrder"   INTEGER NOT NULL DEFAULT 0,
    "isVisible"   BOOLEAN NOT NULL DEFAULT true,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,
    "updatedById" TEXT NOT NULL,

    CONSTRAINT "sections_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "sections_pageId_sectionKey_key" ON "sections"("pageId", "sectionKey");

ALTER TABLE "sections"
    ADD CONSTRAINT "sections_pageId_fkey"
    FOREIGN KEY ("pageId") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ─── Content Blocks ───────────────────────────────────────────────────────────

CREATE TABLE "content_blocks" (
    "id"           TEXT NOT NULL,
    "sectionId"    TEXT NOT NULL,
    "fieldKey"     TEXT NOT NULL,
    "blockType"    "BlockType" NOT NULL,
    "textValue"    TEXT,
    "mediaAssetId" TEXT,
    "sortOrder"    INTEGER NOT NULL DEFAULT 0,
    "isPublished"  BOOLEAN NOT NULL DEFAULT false,
    "parentId"     TEXT,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,
    "createdById"  TEXT NOT NULL,
    "updatedById"  TEXT NOT NULL,

    CONSTRAINT "content_blocks_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "content_blocks_sectionId_fieldKey_idx"
    ON "content_blocks"("sectionId", "fieldKey");

ALTER TABLE "content_blocks"
    ADD CONSTRAINT "content_blocks_sectionId_fkey"
    FOREIGN KEY ("sectionId") REFERENCES "sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "content_blocks"
    ADD CONSTRAINT "content_blocks_mediaAssetId_fkey"
    FOREIGN KEY ("mediaAssetId") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "content_blocks"
    ADD CONSTRAINT "content_blocks_parentId_fkey"
    FOREIGN KEY ("parentId") REFERENCES "content_blocks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ─── Navigation Items ─────────────────────────────────────────────────────────

CREATE TABLE "navigation_items" (
    "id"          TEXT NOT NULL,
    "label"       TEXT NOT NULL,
    "href"        TEXT NOT NULL,
    "sortOrder"   INTEGER NOT NULL DEFAULT 0,
    "badge"       TEXT,
    "parentId"    TEXT,
    "isVisible"   BOOLEAN NOT NULL DEFAULT true,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL,
    "updatedById" TEXT NOT NULL,

    CONSTRAINT "navigation_items_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "navigation_items"
    ADD CONSTRAINT "navigation_items_parentId_fkey"
    FOREIGN KEY ("parentId") REFERENCES "navigation_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ─── Footer Config ────────────────────────────────────────────────────────────

CREATE TABLE "footer_config" (
    "id"            TEXT NOT NULL,
    "address1Label" TEXT NOT NULL DEFAULT '',
    "address1Text"  TEXT NOT NULL DEFAULT '',
    "address2Label" TEXT NOT NULL DEFAULT '',
    "address2Text"  TEXT NOT NULL DEFAULT '',
    "ctaText"       TEXT NOT NULL DEFAULT '',
    "ctaLinkText"   TEXT NOT NULL DEFAULT '',
    "ctaLinkHref"   TEXT NOT NULL DEFAULT '',
    "copyrightText" TEXT NOT NULL DEFAULT '',
    "facebookUrl"   TEXT NOT NULL DEFAULT '',
    "instagramUrl"  TEXT NOT NULL DEFAULT '',
    "youtubeUrl"    TEXT NOT NULL DEFAULT '',
    "linkedinUrl"   TEXT NOT NULL DEFAULT '',
    "updatedAt"     TIMESTAMP(3) NOT NULL,
    "updatedById"   TEXT NOT NULL,

    CONSTRAINT "footer_config_pkey" PRIMARY KEY ("id")
);

-- ─── SEO Meta ─────────────────────────────────────────────────────────────────

CREATE TABLE "seo_meta" (
    "id"              TEXT NOT NULL,
    "pageId"          TEXT NOT NULL,
    "metaTitle"       TEXT NOT NULL DEFAULT '',
    "metaDescription" TEXT NOT NULL DEFAULT '',
    "ogTitle"         TEXT NOT NULL DEFAULT '',
    "ogDescription"   TEXT NOT NULL DEFAULT '',
    "ogImageUrl"      TEXT NOT NULL DEFAULT '',
    "canonical"       TEXT NOT NULL DEFAULT '',
    "noIndex"         BOOLEAN NOT NULL DEFAULT false,
    "updatedAt"       TIMESTAMP(3) NOT NULL,
    "updatedById"     TEXT NOT NULL,

    CONSTRAINT "seo_meta_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "seo_meta_pageId_key" ON "seo_meta"("pageId");

ALTER TABLE "seo_meta"
    ADD CONSTRAINT "seo_meta_pageId_fkey"
    FOREIGN KEY ("pageId") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ─── Form Submissions ─────────────────────────────────────────────────────────

CREATE TABLE "form_submissions" (
    "id"          TEXT NOT NULL,
    "formType"    "FormType" NOT NULL,
    "data"        JSONB NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress"   TEXT,
    "isRead"      BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "form_submissions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "form_submissions_formType_submittedAt_idx"
    ON "form_submissions"("formType", "submittedAt");

-- ─── Audit Log ────────────────────────────────────────────────────────────────

CREATE TABLE "audit_logs" (
    "id"         TEXT NOT NULL,
    "userId"     TEXT NOT NULL,
    "action"     TEXT NOT NULL,
    "entityType" TEXT,
    "entityId"   TEXT,
    "metadata"   JSONB,
    "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "audit_logs_userId_createdAt_idx" ON "audit_logs"("userId", "createdAt");
CREATE INDEX "audit_logs_entityType_entityId_idx" ON "audit_logs"("entityType", "entityId");

ALTER TABLE "audit_logs"
    ADD CONSTRAINT "audit_logs_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

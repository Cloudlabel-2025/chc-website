-- Add icon and description columns to navigation_items
-- Used by "What we do" dropdown children in the header

ALTER TABLE "navigation_items"
    ADD COLUMN IF NOT EXISTS "icon"        TEXT,
    ADD COLUMN IF NOT EXISTS "description" TEXT;

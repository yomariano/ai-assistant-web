CREATE TABLE directory_clicks (
  id BIGSERIAL PRIMARY KEY,
  business_slug TEXT NOT NULL,
  business_name TEXT,
  vertical TEXT,
  city TEXT,
  city_slug TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_country TEXT,
  click_type TEXT NOT NULL DEFAULT 'website' CHECK (click_type IN ('website', 'phone')),
  clicked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_clicks_slug_date ON directory_clicks (business_slug, clicked_at);
CREATE INDEX idx_clicks_vertical_date ON directory_clicks (vertical, clicked_at);
CREATE INDEX idx_clicks_city_slug_date ON directory_clicks (city_slug, clicked_at);

CREATE MATERIALIZED VIEW directory_clicks_monthly AS
SELECT
  business_slug,
  business_name,
  vertical,
  city,
  city_slug,
  DATE_TRUNC('month', clicked_at) AS month,
  COUNT(*) AS clicks,
  COUNT(*) FILTER (WHERE click_type = 'website') AS website_clicks,
  COUNT(*) FILTER (WHERE click_type = 'phone') AS phone_clicks
FROM directory_clicks
GROUP BY business_slug, business_name, vertical, city, city_slug, DATE_TRUNC('month', clicked_at);

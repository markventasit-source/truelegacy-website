# Shared security headers for truelegacyindia.com
# Include inside every `location` that also uses `add_header`
# (nginx does not inherit parent add_header into child locations).
#
#   include /path/to/true-legacy-new/deploy/nginx-security-headers.inc;
#
# IMPORTANT: Replace any existing Content-Security-Policy-Report-Only header
# with this enforcing Content-Security-Policy (or update the report-only value
# to match). The live report-only policy was too strict and logged false/noisy
# violations for blog images (Linode), GA regions, and CRM.

add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), interest-cohort=()" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
# 'unsafe-inline' needed for index.html boot scripts (analytics defer, LCP path, async CSS activator).
# img-src https: covers Linode blog images + OG assets.
# connect-src covers API, CRM, GA regional endpoints, Meta Pixel.
add_header Content-Security-Policy "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'self'; form-action 'self' https://wa.me; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https://api.truelegacy.in https://crm.truelegacy.in https://www.google-analytics.com https://region1.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://www.googletagmanager.com https://connect.facebook.net https://www.facebook.com https://*.facebook.com https://*.google-analytics.com https://*.analytics.google.com; frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com https://www.facebook.com; media-src 'self' https: blob:; upgrade-insecure-requests" always;

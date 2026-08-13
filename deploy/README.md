# Production nginx (truelegacyindia.com)

## Cache lifetime (Lighthouse “Use efficient cache lifetimes”)

Lighthouse reports **Cache TTL: None** when the server omits `Cache-Control`.
That is **not** fixed by the Vite build — nginx must send headers.

| Path | Policy |
|------|--------|
| `/assets/*` (hashed JS/CSS/mp4/images) | `public, max-age=31536000, immutable` |
| Root media (`/whatsapp.png`, hero webp, fonts, …) | same |
| HTML (`/`, `/contact`, …) | `no-cache, must-revalidate` |

### Apply on the VPS (one-time)

1. Open the live nginx site config for `truelegacyindia.com`
   (often under `/etc/nginx/sites-enabled/` or `/etc/nginx/conf.d/`).
2. Merge the `location` blocks from [`nginx-truelegacyindia.conf`](./nginx-truelegacyindia.conf)
   (or the shorter [`nginx-cache-headers.conf`](./nginx-cache-headers.conf) if you only need caching).
3. Test and reload:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

4. Confirm:

```bash
curl -sI https://truelegacyindia.com/assets/react-dom-CbJg_STV.js | grep -i cache-control
curl -sI https://truelegacyindia.com/whatsapp.png | grep -i cache-control
curl -sI https://truelegacyindia.com/ | grep -i cache-control
```

CI (`.github/workflows/cicd.yml`) only syncs `dist/` and reloads nginx — it does **not**
update site config. Cache headers must be present in the server block before reload helps.

## HTTP security headers

Scanners report **0/6 security headers** when nginx omits them. That is also a
**server config** fix (not the Vite build).

[`nginx-truelegacyindia.conf`](./nginx-truelegacyindia.conf) sets:

| Header | Value |
|--------|--------|
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `SAMEORIGIN` |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` |
| `Content-Security-Policy` | SPA-safe policy (self + GA + Meta Pixel + API + YouTube/Vimeo frames) |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | disables camera/mic/geo/etc. |

Reusable snippet: [`nginx-security-headers.inc`](./nginx-security-headers.inc)

After reload, confirm:

```bash
curl -sI https://truelegacyindia.com/ | grep -iE \
  'strict-transport|x-content-type|x-frame|content-security|referrer-policy|permissions-policy'
```

If the site breaks (blocked script/image), check the browser console CSP error and
add that host to the matching CSP directive in the nginx config.

**If you already added a `Content-Security-Policy-Report-Only` header** that is
stricter than this file (missing blog image hosts / `'unsafe-inline'`), either:

1. Remove the report-only header and use the enforcing policy above, or
2. Update the report-only value to match `nginx-security-headers.inc`

Also redeploy the frontend after the `vite.config.js` change that removes the
CSS `onload=` handler (that was the “inline event handler” console warning).

## Sensitive file “exposure” scanners (usually false positives)

Probes like `/.env`, `/.git/config`, `/phpinfo.php`, `/wp-config.php` often get
**HTTP 200** because the SPA catch-all serves `/index.html` — not because those
files exist. Deploy only uploads `dist/` (no `.env`, `.git`, PHP, or WordPress).

`nginx-truelegacyindia.conf` includes deny rules so those paths return **404**
instead of the homepage. After merging on the VPS:

```bash
for p in /.env /.git/config /.htpasswd /phpinfo.php /wp-config.php; do
  echo -n "$p -> "
  curl -sS -o /dev/null -w "%{http_code}\n" "https://truelegacyindia.com$p"
done
# Expect: 404 for each
```

# Connect a Squarespace domain to Vercel

## Recommended setup: keep DNS at Squarespace

1. Keep Squarespace as the domain's nameserver/DNS provider and point only the website records to Vercel.
2. This keeps DNS and existing email records in one place; moving nameservers to Vercel is optional, not required to host the site there.
3. Use Vercel nameservers only if you specifically want Vercel to manage all DNS records or need a feature that requires them, such as wildcard domains.

## Add the domain in Vercel

1. Open the Vercel project and go to **Settings → Domains**.
2. Add the apex domain (for example, `tactspaces.in`) and the `www` version (for example, `www.tactspaces.in`).
3. Choose the preferred primary domain and configure the other to redirect to it.
4. Keep the Vercel Domains page open; use the exact DNS record values it displays for each domain.

## Point Squarespace DNS to Vercel

1. In Squarespace, open **Domains → [your domain] → DNS → DNS Settings**.
2. Under **Custom Records**, add or update the records Vercel requested: typically an **A** record for the apex (`@`) and a **CNAME** record for `www`.
3. Copy each record's host and value exactly from Vercel; its recommended values can vary, so do not rely on examples from older guides.
4. Remove only conflicting website records for `@` or `www`; leave email records (such as **MX**, **TXT**, **DKIM**, and **DMARC**) and unrelated verification records unchanged.
5. Do not change the nameservers if Squarespace should remain the DNS provider.

## Verify the connection

1. Return to **Vercel → Project → Settings → Domains** and wait for each domain to show as configured and valid.
2. Allow time for DNS changes to propagate; then open both the apex and `www` URLs and confirm the redirect and HTTPS certificate work.
3. If Vercel still reports a DNS issue, compare the Squarespace records with the current values shown in Vercel and remove any conflicting web records.

## References

1. [Vercel: Set up a custom domain](https://vercel.com/docs/domains/set-up-custom-domain)
2. [Vercel: Managing DNS records](https://vercel.com/docs/domains/managing-dns-records)
3. [Squarespace: Edit DNS records](https://support.squarespace.com/hc/en-us/articles/360002101888-Edit-your-domain-s-DNS-records)

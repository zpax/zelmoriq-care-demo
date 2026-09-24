# Zelmoriq Care — myzPAX Dev SSO sample

Fictional Next.js + React client app demonstrating the actual myzPAX banner above an existing application. The workspace is now gated by real OpenID Connect login; unsigned demo tokens have been removed.

Hosted demo: https://dev.zelmoriq.zpaxapps.com

See [deployment notes](deployment/README.md) for AWS resources and operational limits.

## Local setup

1. Register a dedicated client in **myzPAX Dev** with authorization code grant, S256 PKCE, scopes `openid email`, and exact redirect URI `http://127.0.0.1:3000/auth/callback` (no trailing slash).
2. Copy `.env.example` to `.env.local`. Set `SSO_CLIENT_ID`. For a confidential registration, put its secret in `SSO_CLIENT_SECRET` locally; never in chat, source control, or `NEXT_PUBLIC_*` variables. The sample uses client_secret_post when a secret is supplied and none for an explicitly registered public client. Dev discovery advertises confidential authentication methods; confirm the client registration type.
3. `npm ci`, then `npm run dev`. Open http://127.0.0.1:3000. Use the exact configured origin, not localhost as an alias.
4. Sign in with a Dev account. Login credentials are entered only on the myzPAX identity provider.

The dedicated client is registered in Dev and SSO_REGISTRATION_READY is enabled locally. Real authorization-code exchange, authenticated workspace access, local session logout, and Dev SSO logout redirect were verified. See SSO-REGISTRATION.md.

## Verified Dev endpoints

- Issuer: https://dapi.auth.myzpax.com/
- Discovery: https://dapi.auth.myzpax.com/.well-known/openid-configuration
- Portal: https://dev.redesign.myzpax.com/home
- Banner-compatible logout: https://dapi.auth.myzpax.com/api/account/logout

The banner script is loaded from https://dev.zpax-banner.myzpax.com/banner/v1/banner.js. Its issuer, portal, and logout endpoint are explicitly configured for Dev.

## Authentication and sessions

`lib/auth.ts` uses openid-client discovery and authorization code exchange, S256 PKCE, one-time state, nonce validation, and ID-token signature verification through the provider's JWKS. Secrets and exchange requests stay on the server. Login transactions expire after ten minutes. Sessions use random opaque IDs in HttpOnly, SameSite=Lax cookies (Secure on HTTPS) and expire at the earliest ID token expiry, access-token expiry, or one hour. No refresh token is requested; sign in again after expiry.

The authenticated server page passes the access token to the banner's browser-side getToken contract. It is not put in URLs or browser storage. The sample has no patient APIs; all referral data is fictional. Any future protected APIs must validate authorization independently of the banner.

Logout POST checks the request origin and a session-bound CSRF value, removes the server session, and expires its cookie. The widget awaits this hook, then performs top-level Dev SSO logout and returns to the Dev portal. The upstream widget proceeds to SSO even if the hook fails, per its current contract. This app does not claim global logout across other apps' independent local sessions.

The session store is **in-memory and single-process**, appropriate for this local sample. A server restart signs everyone out. Before a multi-instance AWS deployment, replace it with a shared expiring store. The app now requires a Next.js server (`npm run build` then `npm start`), not static S3 hosting.

## Banner integration

`app/suite-banner.tsx` mounts only after a verified session exists. It uses the minimal white style, one-time initialization, real token accessor, and session-clearing onLogout callback. The banner inserts itself above the complete workspace with styles isolated in its Shadow DOM. Session expiry returns the browser to sign-in.

## Validation

Run `npm run build`. Negative-flow checks should confirm that unauthenticated requests return no workspace, session checks return 401, missing/invalid callbacks do not create sessions, and cross-origin logout requests return 403. Real-account sign-in, redirect registration, token exchange, workspace gating, invalid-CSRF rejection, local logout, and Dev SSO logout redirect were verified on September 24, 2026.

The banner’s Return to myzPAX link and logout redirect both use https://dev.redesign.myzpax.com/home. Logout first clears the app session, then uses the Dev authentication logout endpoint with that return destination.

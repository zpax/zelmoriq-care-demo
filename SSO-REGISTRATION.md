# myzPAX Dev client registration

- Client ID: `zelmoriq-care-dev-34c40e5724eb`
- Display name: Zelmoriq Care Demo
- Client type: Confidential web application
- Client authentication: client_secret_post
- Grant: authorization_code
- Response type: code
- PKCE: required, S256
- Local redirect URI: `http://127.0.0.1:3000/auth/callback`
- Hosted redirect URI: `https://dev.zelmoriq.zpaxapps.com/auth/callback`
- Scopes: openid email
- Secret: stored in local `.env.local` and AWS Secrets Manager for hosting; never commit its value.
- Banner logout return destination: `https://dev.redesign.myzpax.com/home` (must be accepted by Dev SSO).

Status: registered and credentials verified in myzPAX Dev. Local SSO is enabled. Access is available to Dev SSO users; the client is confidential, authorization-code only, with email scope and no service-account or elevation permissions.

- Consent denial fallback URI: `https://dev.redesign.myzpax.com/home` (also sent as `fallback_uri` in authorization requests).

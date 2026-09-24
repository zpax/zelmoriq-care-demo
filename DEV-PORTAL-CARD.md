# Zelmoriq Care Dev portal card

Hosted app: https://dev.zelmoriq.zpaxapps.com/

Portal: https://dev.redesign.myzpax.com/home

Verified hosted HTTPS sign-in through Dev SSO, authenticated workspace rendering, session validation, logout CSRF protection, successful logout, and rejection of signed-out sessions. Public DNS resolvers resolve the hosted URL; local DNS may cache the earlier negative lookup until its TTL expires.

The card uses hosted HTTPS full-view capabilities on desktop, tablet and mobile. Live Tile points to /tile, a public preview clearly labeled as fictional sample data. The banner and fictional workspace also support anonymous visitors. Portal full-app launch still starts SSO; direct visits to the app root allow guest exploration.

Record identifiers:
```json
{
  "clientId": 200,
  "appId": 266,
  "linkId": 200,
  "tileGroupId": 233,
  "capabilityIds": [
    544,
    545,
    546,
    547
  ],
  "tileIds": [
    339,
    340
  ]
}
```

Client: zelmoriq-care-dev-34c40e5724eb. See deployment/README.md for hosting and session limitations.

Full-app launch links now point directly to https://dev.zelmoriq.zpaxapps.com/auth/login on desktop, tablet and mobile, so portal users start SSO without an extra sign-in click. Verified authorization redirect, callback and authenticated workspace with an active Dev SSO session.

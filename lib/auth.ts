import * as oidc from 'openid-client';
import { randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';
export const issuer = process.env.SSO_ISSUER || 'https://dapi.auth.myzpax.com/';
export const appOrigin = process.env.APP_ORIGIN || 'http://127.0.0.1:3000';
export const callbackUrl = new URL('/auth/callback', appOrigin).href;
export const sessionCookie = 'zelmoriq_session';
export const transactionCookie = 'zelmoriq_login';
export const cookieOptions = { httpOnly: true, secure: new URL(appOrigin).protocol === 'https:', sameSite: 'lax' as const, path: '/' };
export type Session = { accessToken: string; name: string; expires: number; csrf: string };
type Transaction = { verifier: string; state: string; nonce: string; expires: number };
// Single-process sample store. Replace with a shared store before multi-instance deployment.
const globalAuth = globalThis as typeof globalThis & { zelmoriqAuth?: { sessions: Map<string, Session>; transactions: Map<string, Transaction> } };
export const store = globalAuth.zelmoriqAuth ??= { sessions: new Map(), transactions: new Map() };
export const randomId = () => randomBytes(32).toString('base64url');
export function prune() {
  for (const map of [store.sessions, store.transactions]) for (const [key,value] of map) if(value.expires <= Date.now()) map.delete(key);
}
export const configured = () => Boolean(process.env.SSO_CLIENT_ID) && process.env.SSO_REGISTRATION_READY === 'true';
let configPromise: Promise<oidc.Configuration> | undefined;
export async function getConfig() {
  if (!configured()) throw new Error('SSO client registration is missing');
  if (!configPromise) configPromise = oidc.discovery(new URL(issuer), process.env.SSO_CLIENT_ID!, process.env.SSO_CLIENT_SECRET || undefined, process.env.SSO_CLIENT_SECRET ? oidc.ClientSecretPost(process.env.SSO_CLIENT_SECRET) : oidc.None()).then(config => { oidc.enableNonRepudiationChecks(config); return config; }).catch(error => { configPromise = undefined; throw error; });
  return configPromise;
}
export async function getSession() {
  prune();
  const id = (await cookies()).get(sessionCookie)?.value;
  return id ? store.sessions.get(id) : undefined;
}

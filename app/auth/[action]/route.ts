import { NextRequest, NextResponse } from 'next/server';
import * as oidc from 'openid-client';
import { appOrigin, callbackUrl, configured, cookieOptions, getConfig, getSession, prune, randomId, sessionCookie, store, transactionCookie } from '../../../lib/auth';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
function redirect(path: string) { const response = NextResponse.redirect(new URL(path, appOrigin), 303); response.headers.set('Cache-Control','no-store'); response.headers.set('Referrer-Policy','no-referrer'); return response; }
export async function GET(request: NextRequest, context: { params: Promise<{ action: string }> }) {
 const { action } = await context.params;
 prune();
 if(action === 'login') {
  if(!configured()) return redirect('/?authError=configuration');
  try {
   const config = await getConfig();
   const verifier = oidc.randomPKCECodeVerifier(), state = oidc.randomState(), nonce = oidc.randomNonce();
   const previous = request.cookies.get(transactionCookie)?.value;
   if(previous) store.transactions.delete(previous);
   const id = randomId();
   store.transactions.set(id, { verifier,state,nonce,expires:Date.now()+600_000 });
   const target = oidc.buildAuthorizationUrl(config, {redirect_uri:callbackUrl,scope:process.env.SSO_SCOPE || 'openid email',response_type:'code',response_mode:'query',code_challenge:await oidc.calculatePKCECodeChallenge(verifier),code_challenge_method:'S256',state,nonce});
   const response = redirect(target.href); response.cookies.set(transactionCookie,id,{...cookieOptions,maxAge:600}); return response;
  } catch { return redirect('/?authError=login'); }
 }
 if(action === 'callback') {
  const id = request.cookies.get(transactionCookie)?.value;
  const transaction = id ? store.transactions.get(id) : undefined;
  if(id) store.transactions.delete(id);
  let response: NextResponse;
  try {
   if(!transaction) throw new Error('Missing or expired login transaction');
   const config = await getConfig();
   const url = new URL(callbackUrl); url.search = request.nextUrl.search;
   const tokens = await oidc.authorizationCodeGrant(config,url,{pkceCodeVerifier:transaction.verifier,expectedState:transaction.state,expectedNonce:transaction.nonce,idTokenExpected:true});
   const claims = tokens.claims();
   if(!claims || !tokens.access_token) throw new Error('Missing identity');
   const expires = Math.min(Number(claims.exp)*1000, Date.now()+(tokens.expires_in ?? 3600)*1000,Date.now()+3600_000);
   if(!Number.isFinite(expires) || expires<=Date.now()) throw new Error('Expired identity');
   const oldId = request.cookies.get(sessionCookie)?.value; if(oldId) store.sessions.delete(oldId);
   const sessionId = randomId();
   store.sessions.set(sessionId,{accessToken:tokens.access_token,name:typeof claims.name==='string'?claims.name:typeof claims.email==='string'?claims.email:'myzPAX user',expires,csrf:randomId()});
   response = redirect('/'); response.cookies.set(sessionCookie,sessionId,{...cookieOptions,maxAge:Math.floor((expires-Date.now())/1000)});
  } catch { response = redirect('/?authError=callback'); }
  response.cookies.set(transactionCookie,'',{...cookieOptions,maxAge:0}); return response;
 }
 if(action === 'session') {
  const session = await getSession();
  return NextResponse.json(session ? {authenticated:true,expires:session.expires} : {authenticated:false},{status:session?200:401,headers:{'Cache-Control':'no-store'}});
 }
 return new NextResponse('Not found',{status:404});
}
export async function POST(request:NextRequest, context:{params:Promise<{action:string}>}) {
 if((await context.params).action!=='logout') return new NextResponse('Not found',{status:404});
 const session = await getSession();
 if(request.headers.get('origin')!==appOrigin || (session && request.headers.get('x-csrf-token')!==session.csrf)) return new NextResponse('Forbidden',{status:403});
 const id=request.cookies.get(sessionCookie)?.value;if(id)store.sessions.delete(id);
 const response = new NextResponse(null,{status:204,headers:{'Cache-Control':'no-store'}});
 response.cookies.set(sessionCookie,'',{...cookieOptions,maxAge:0});return response;
}

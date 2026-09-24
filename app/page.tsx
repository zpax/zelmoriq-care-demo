import { configured, getSession, issuer } from '../lib/auth';
import Workspace from './workspace';
import SuiteBanner from './suite-banner';
export const dynamic = 'force-dynamic';
export default async function Home({searchParams}:{searchParams:Promise<{authError?:string}>}) {
 const session = await getSession();
 const error = (await searchParams).authError;
 return <>
  <SuiteBanner accessToken={session?.accessToken ?? null} issuer={issuer} csrf={session?.csrf ?? ''} expires={session?.expires ?? 0}/>
  {!session && <div style={{padding:'12px 24px',display:'flex',gap:16,alignItems:'center',flexWrap:'wrap',background:'#edf4ec',color:'#173e38'}}>
   <span>Exploring as a guest · Fictional demo data</span>
   {configured() && <a href="/auth/login" style={{fontWeight:700,textDecoration:'underline'}}>Sign in with myzPAX →</a>}
   {error && <span role="alert">Sign-in could not be completed. You can continue exploring or try again.</span>}
  </div>}
  <Workspace userName={session?.name ?? 'Guest visitor'} isGuest={!session}/>
 </>;
}

import { configured, getSession, issuer } from '../lib/auth';
import Workspace from './workspace';
import SuiteBanner from './suite-banner';
export const dynamic = 'force-dynamic';
export default async function Home({searchParams}:{searchParams:Promise<{authError?:string}>}) {
 const session = await getSession();
 if(session) return <><SuiteBanner accessToken={session.accessToken} issuer={issuer} csrf={session.csrf} expires={session.expires}/><Workspace userName={session.name}/></>;
 const error = (await searchParams).authError;
 return <main className="sign-in-page"><div className="sign-in-card"><p className="eyebrow">ZELMORIQ CARE</p><h1>Your care workspace.</h1><p>Sign in with your myzPAX account to continue.</p>{error && <p role="alert" className="sign-in-error">Sign-in could not be completed. Please try again or contact your SSO administrator.</p>}{configured()?<a className="primary-button" href="/auth/login">Sign in with myzPAX →</a>:<p className="setup-message">SSO setup is awaiting this sample app’s client registration.</p>}<small>Sample application · Fictional patient data</small></div></main>;
}

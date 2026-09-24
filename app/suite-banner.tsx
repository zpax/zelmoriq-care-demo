'use client';
import Script from 'next/script';
import { useEffect, useState } from 'react';
type BannerOptions = {appId:string;getToken:()=>string|null;issuer:string;style:'minimal';position:'static';portalUrl:string;logoutUrl:string;onLogout:()=>Promise<void>};
declare global {interface Window {MyzpaxBanner?:{init:(options:BannerOptions)=>void};zelmoriqBannerStarted?:boolean}}
export default function SuiteBanner({accessToken,issuer,csrf,expires}:{accessToken:string;issuer:string;csrf:string;expires:number}) {
 const [failed,setFailed]=useState(false);
 useEffect(()=>{
  const timeout=setTimeout(()=>window.location.replace('/'),Math.max(0,expires-Date.now()));
  const check=()=>{ if(document.visibilityState==='visible') fetch('/auth/session',{cache:'no-store'}).then(r=>{if(r.status===401)window.location.replace('/')}).catch(()=>{}); };
  document.addEventListener('visibilitychange',check);
  return ()=>{clearTimeout(timeout);document.removeEventListener('visibilitychange',check)};
 },[expires]);
 function start(){
  if(!window.MyzpaxBanner||window.zelmoriqBannerStarted||document.getElementById('myzpax-banner-host'))return;
  window.zelmoriqBannerStarted=true;
  window.MyzpaxBanner.init({appId:'zelmoriq-care-demo',getToken:()=>Date.now()<expires?accessToken:null,issuer,style:'minimal',position:'static',portalUrl:'https://dev.redesign.myzpax.com/home',logoutUrl:'https://dapi.auth.myzpax.com/api/account/logout',onLogout:async()=>{
   const response=await fetch('/auth/logout',{method:'POST',headers:{'x-csrf-token':csrf}});
   if(!response.ok)throw new Error('Unable to clear client session');
  }});
 }
 return <><Script src="https://dev.zpax-banner.myzpax.com/banner/v1/banner.js" strategy="afterInteractive" onReady={start} onError={()=>setFailed(true)}/>{failed&&<div role="status" className="banner-error">The myzPAX banner could not load. Refresh to try again.</div>}</>;
}

export default function DemoTile() {
  return <main style={{padding:28,background:'#f5f8f5',minHeight:'100vh',color:'#173e38'}}>
    <p className="eyebrow">ZELMORIQ CARE · SAMPLE DATA</p>
    <h1 style={{fontSize:28,margin:'16px 0'}}>A clearer view of admissions.</h1>
    <p>A fictional workspace demonstrating the myzPAX banner and single sign-on.</p>
    <div style={{display:'flex',flexWrap:'wrap',gap:16,margin:'28px 0'}}>
      {[[6,'Sample referrals'],[3,'Ready for review'],[2,'Accepted']].map(([value,label]) =>
        <div key={label} style={{background:'white',borderRadius:16,padding:20,flex:'1 1 130px'}}>
          <strong style={{display:'block',fontSize:32}}>{value}</strong><span>{label}</span>
        </div>)}
    </div>
    <a className="primary-button" href="/auth/login" target="_blank" rel="noopener noreferrer">Open workspace with myzPAX →</a>
    <p style={{fontSize:12,marginTop:20}}>Demo preview only. These figures are fictional and do not reflect a signed-in user’s activity.</p>
  </main>;
}

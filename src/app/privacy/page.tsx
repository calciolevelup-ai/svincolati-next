'use client'
import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div style={{background:'var(--bg)',color:'var(--text)',minHeight:'100vh',padding:'40px 20px'}}>
      <div style={{maxWidth:800,margin:'0 auto'}}>
        <h1 style={{fontFamily:'Anton',fontSize:32,marginBottom:32,textAlign:'center'}}>Privacy Policy</h1>
        
        <section style={{marginBottom:24}}>
          <h2 style={{fontFamily:'Anton',fontSize:20,marginBottom:12}}>1. Introduzione</h2>
          <p style={{color:'var(--muted)',lineHeight:1.6}}>SVINCOLATI è impegnata a proteggere la tua privacy. Questa Privacy Policy spiega come raccogliamo e utilizziamo i tuoi dati.</p>
        </section>

        <section style={{marginBottom:24}}>
          <h2 style={{fontFamily:'Anton',fontSize:20,marginBottom:12}}>2. Dati Raccolti</h2>
          <ul style={{marginLeft:20,color:'var(--muted)',lineHeight:1.6}}>
            <li>Email e password (autenticazione)</li>
            <li>Profilo personale (nome, DOB, posizione)</li>
            <li>Storico carriera</li>
            <li>Messaggi e comunicazioni</li>
          </ul>
        </section>

        <section style={{marginBottom:24}}>
          <h2 style={{fontFamily:'Anton',fontSize:20,marginBottom:12}}>3. Utilizzo</h2>
          <p style={{color:'var(--muted)',lineHeight:1.6}}>I dati vengono utilizzati per fornire il servizio di matching e comunicazione tra utenti.</p>
        </section>

        <div style={{borderTop:'1px solid var(--line)',paddingTop:20,marginTop:40,textAlign:'center'}}>
          <Link href="/dashboard" style={{color:'var(--acid)',textDecoration:'none'}}>← Torna</Link>
        </div>
      </div>
    </div>
  )
}

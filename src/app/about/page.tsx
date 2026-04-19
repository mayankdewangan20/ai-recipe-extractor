import Link from "next/link";
import { ArrowLeft, Sparkles, Code, ShoppingCart, ChefHat } from "lucide-react";
import styles from "./page.module.css";

export default function AboutPage() {
  return (
    <main className={styles.main}>
      <div className={styles.blob1}></div>
      <div className={styles.blob2}></div>

      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.logo}>
            <ChefHat size={32} className={styles.logoIcon} />
            <h1 className="gradient-text">Recipe AI</h1>
          </div>
          <nav className={styles.nav}>
            <Link href="/" className={styles.navBtn} style={{ textDecoration: 'none' }}>
               <ArrowLeft size={16} /> Back to Home
            </Link>
          </nav>
        </header>

        <section className={styles.hero}>
          <h2 className={styles.heroTitle}>
            About <span className="gradient-text">AI Recipe Extractor</span>
          </h2>
          <p className={styles.heroSubtitle}>
            Transforming cooking videos into actionable, structured recipes with the power of AI.
          </p>
        </section>

        <div className={styles.contentGrid}>
          <section className="glass-panel fade-in" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className={styles.iconWrapper}><Sparkles size={24} /></div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 600 }}>The Concept</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '1.05rem' }}>
              Cooking videos are amazing for inspiration, but terrible for actual cooking. You have to constantly pause, rewind, and write down ingredients. 
              <strong> AI Recipe Extractor</strong> bridges this gap by automatically parsing the video's transcript and using large language models to format it into a clean, easy-to-read digital recipe.
            </p>
          </section>

          <section className="glass-panel fade-in" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px', animationDelay: '0.1s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className={styles.iconWrapper}><Code size={24} /></div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 600 }}>How it Works</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '1.05rem' }}>
              When you paste a YouTube link, our system fetches the raw video captions. This unstructured text is then fed into <strong>Google's Gemini AI</strong>, which is specifically prompted to identify the recipe title, exact ingredient measurements, and chronological step-by-step cooking instructions.
            </p>
          </section>

          <section className="glass-panel fade-in" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px', gridColumn: '1 / -1', animationDelay: '0.2s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className={styles.iconWrapper}><ShoppingCart size={24} /></div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Quick-Commerce Integration</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '1.05rem' }}>
              One of the most powerful features of this platform is the ability to easily copy your ingredient list and paste it directly into your favorite grocery delivery apps for a one-click cart checkout.
            </p>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', marginTop: '8px' }}>
              <ol style={{ paddingLeft: '20px', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '16px', lineHeight: 1.5, fontSize: '1.05rem' }}>
                <li>
                  <strong>Select Ingredients:</strong> Uncheck the ingredients you already have in your kitchen from the extracted recipe view.
                </li>
                <li>
                  <strong>Copy List:</strong> Click the <span style={{ color: 'var(--accent-color)', fontWeight: 600 }}>"Copy Selected"</span> button to copy the remaining items to your clipboard.
                </li>
                <li>
                  <strong>Open App:</strong> Open a quick-commerce app that supports list parsing (like Blinkit, Zepto, Swiggy Instamart, or BigBasket).
                </li>
                <li>
                  <strong>Paste & Add to Cart:</strong> Paste the text into their smart search/list bar. The app will automatically match the items and add them to your cart in seconds!
                </li>
              </ol>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

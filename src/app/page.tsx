"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Link2, Loader2, ChefHat, Video, BookmarkPlus, Copy, Check } from "lucide-react";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  const { data: session } = useSession();
  const [url, setUrl] = useState("");
  const [language, setLanguage] = useState("English");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [result, setResult] = useState<null | any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState<boolean[]>([]);

  const handleCopyIngredients = () => {
    if (!result?.ingredients) return;
    const itemsToCopy = result.ingredients.filter((_: string, i: number) => selectedIngredients[i]);
    if (itemsToCopy.length === 0) return;
    navigator.clipboard.writeText(itemsToCopy.join('\n'));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const toggleIngredient = (index: number) => {
    const newSelected = [...selectedIngredients];
    newSelected[index] = !newSelected[index];
    setSelectedIngredients(newSelected);
  };

  const toggleAllIngredients = () => {
    const allSelected = selectedIngredients.every(Boolean);
    setSelectedIngredients(new Array(result.ingredients.length).fill(!allSelected));
  };

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, language })
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to extract recipe.");
      }

      setResult(data);
      setSelectedIngredients(new Array(data.ingredients.length).fill(true));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result || !session) return;
    setIsSaving(true);
    try {
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: result.title,
          ingredients: result.ingredients,
          steps: result.steps,
          sourceUrl: url
        })
      });

      let errorMsg = "Failed to save";
      if (!response.ok) {
        try {
          const data = await response.json();
          if (data.error) errorMsg = data.error;
        } catch (e) { }
        throw new Error(errorMsg);
      }
      alert("Recipe saved to favorites!");
    } catch (err: any) {
      alert("Error saving recipe: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

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
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Link href="/about" className={styles.navBtn} style={{ textDecoration: 'none' }}>About</Link>
              {session && (
                <Link href="/saved" className={styles.navBtn} style={{ textDecoration: 'none' }}>Saved</Link>
              )}
              {session ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '1px solid var(--border-color)', paddingLeft: '16px' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Hi, {session.user?.name}</span>
                  <button onClick={() => signOut()} className={styles.navBtn}>Log Out</button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', borderLeft: '1px solid var(--border-color)', paddingLeft: '16px' }}>
                  <button onClick={() => signIn("google")} className={styles.navBtn}>Login</button>
                </div>
              )}
            </div>
          </nav>
        </header>

        <section className={styles.hero}>
          <h2 className={styles.heroTitle}>
            Turn Any Video Into a <br />
            <span className="gradient-text">Structured Recipe</span>
          </h2>
          <p className={styles.heroSubtitle}>
            Paste a link from Instagram Reels or YouTube Shorts. Our AI will instantly extract the ingredients and step-by-step instructions.
          </p>

          <form className={`${styles.inputWrapper} glass-panel`} onSubmit={handleExtract}>
            <Link2 className={styles.inputIcon} size={20} />
            <input
              type="url"
              placeholder="Paste Instagram or YouTube video link here..."
              className={styles.urlInput}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
            <select
              className={styles.langSelect}
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              title="Select language"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
            </select>
            <button
              type="submit"
              className={styles.extractBtn}
              disabled={isLoading || !url}
            >
              {isLoading ? <Loader2 className={styles.spinIcon} size={20} /> : "Extract Recipe"}
            </button>
          </form>

          {error && (
            <div className={`${styles.errorMsg} glass-panel fade-in`}>
              {error}
            </div>
          )}
        </section>

        {result && (
          <section className={`${styles.results} glass-panel fade-in`}>
            <div className={styles.resultHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3>{result.title}</h3>
                <div className={styles.badges} style={{ marginTop: '12px' }}>
                  <span className={styles.badge}><Video size={14} /> Extracted from Video</span>
                </div>
              </div>
              {session ? (
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className={styles.extractBtn}
                  style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                >
                  {isSaving ? <Loader2 className={styles.spinIcon} size={16} /> : <BookmarkPlus size={18} />}
                  {isSaving ? "Saving..." : "Save Recipe"}
                </button>
              ) : (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', padding: '10px' }}>
                  Login to save recipes
                </div>
              )}
            </div>

            <div className={styles.recipeContent}>
              <div className={styles.ingredientsCol}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <h4 className={styles.sectionTitle} style={{ marginBottom: 0 }}>Ingredients</h4>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={selectedIngredients.length > 0 && selectedIngredients.every(Boolean)}
                        onChange={toggleAllIngredients}
                        style={{ accentColor: 'var(--accent-color)', width: '16px', height: '16px', cursor: 'pointer' }}
                      />
                      Select All
                    </label>
                  </div>
                  <button
                    onClick={handleCopyIngredients}
                    className={styles.copyBtn}
                    title="Copy selected ingredients"
                  >
                    {isCopied ? <Check size={14} style={{ color: 'var(--accent-color)' }} /> : <Copy size={14} />}
                    {isCopied ? "Copied!" : "Copy Selected"}
                  </button>
                </div>
                <ul className={styles.ingredientList}>
                  {result.ingredients.map((item: string, i: number) => (
                    <li key={i} className={styles.ingredientItem} style={{ opacity: selectedIngredients[i] ? 1 : 0.5, transition: 'opacity 0.2s', cursor: 'pointer' }} onClick={() => toggleIngredient(i)}>
                      <input
                        type="checkbox"
                        checked={selectedIngredients[i] || false}
                        onChange={() => toggleIngredient(i)}
                        onClick={(e) => e.stopPropagation()}
                        style={{ accentColor: 'var(--accent-color)', width: '18px', height: '18px', cursor: 'pointer', marginTop: '2px', flexShrink: 0 }}
                      />
                      <span style={{ textDecoration: selectedIngredients[i] ? 'none' : 'line-through' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.stepsCol}>
                <h4 className={styles.sectionTitle}>Instructions</h4>
                <div className={styles.stepsList}>
                  {result.steps.map((step: string, i: number) => (
                    <div key={i} className={styles.stepItem}>
                      <div className={styles.stepNumber}>{i + 1}</div>
                      <p className={styles.stepText}>{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

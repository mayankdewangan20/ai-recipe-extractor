"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronDown, ChevronUp, Copy, Check, Trash2, ArrowLeft, Loader2, Link2, BookmarkPlus } from "lucide-react";
import styles from "./saved.module.css";

interface Recipe {
  _id: string;
  title: string;
  ingredients: string[];
  steps: string[];
  sourceUrl: string;
  createdAt: string;
}

function RecipeCard({ recipe, onDelete }: { recipe: Recipe, onDelete: (id: string, e: React.MouseEvent) => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState<boolean[]>(new Array(recipe.ingredients.length).fill(true));

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const toggleIngredient = (index: number) => {
    const newSelected = [...selectedIngredients];
    newSelected[index] = !newSelected[index];
    setSelectedIngredients(newSelected);
  };

  const toggleAllIngredients = () => {
    const allSelected = selectedIngredients.every(Boolean);
    setSelectedIngredients(new Array(recipe.ingredients.length).fill(!allSelected));
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const itemsToCopy = recipe.ingredients.filter((_, i) => selectedIngredients[i]);
    if (itemsToCopy.length === 0) return;
    navigator.clipboard.writeText(itemsToCopy.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader} onClick={toggleExpand}>
        <div>
          <h3 className={styles.cardTitle}>{recipe.title}</h3>
          <div className={styles.cardMeta}>
            <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
              <Link2 size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
              Source Video
            </a>
            <span>• {new Date(recipe.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <button className={styles.expandBtn}>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {isExpanded && (
        <div className={styles.expandedContent}>
          <div className={styles.sectionHeader}>
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
            <button onClick={handleCopy} className={styles.copyBtn} title="Copy selected ingredients">
              {copied ? <Check size={14} color="var(--accent-color)" /> : <Copy size={14} />}
              {copied ? "Copied!" : "Copy Selected"}
            </button>
          </div>
          <ul className={styles.ingredientList}>
            {recipe.ingredients.map((item, i) => (
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

          <h4 className={styles.sectionTitle} style={{ marginBottom: '16px' }}>Instructions</h4>
          <div className={styles.stepsList}>
            {recipe.steps.map((step, i) => (
              <div key={i} className={styles.stepItem}>
                <div className={styles.stepNumber}>{i + 1}</div>
                <p className={styles.stepText}>{step}</p>
              </div>
            ))}
          </div>

          <div className={styles.cardFooter}>
            <button onClick={(e) => onDelete(recipe._id, e)} className={styles.deleteBtn}>
              <Trash2 size={16} /> Delete Recipe
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SavedRecipes() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (status === "authenticated") {
      fetchRecipes();
    }
  }, [status, router]);

  const fetchRecipes = async () => {
    try {
      const res = await fetch("/api/recipes");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setRecipes(data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this recipe?")) return;
    
    try {
      const res = await fetch(`/api/recipes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setRecipes(recipes.filter(r => r._id !== id));
    } catch (error) {
      alert("Failed to delete recipe");
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <main className={styles.main}>
        <div className={styles.blob1}></div>
        <div className={styles.blob2}></div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Loader2 className={styles.spinIcon || "spin"} size={48} color="var(--accent-color)" style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.blob1}></div>
      <div className={styles.blob2}></div>

      <div className={styles.container}>
        <header className={styles.pageHeader}>
          <div>
            <Link href="/" className={styles.backBtn}>
              <ArrowLeft size={18} /> Back to Extractor
            </Link>
            <h1 className={styles.pageTitle} style={{ marginTop: '16px' }}>Your Saved Recipes</h1>
          </div>
        </header>

        {recipes.length === 0 ? (
          <div className={styles.emptyState}>
            <BookmarkPlus size={48} color="var(--accent-color)" opacity={0.5} />
            <h3>No recipes saved yet</h3>
            <p>Extract your first recipe from a video and save it to see it here.</p>
            <Link href="/" className={styles.exploreBtn}>Extract a Recipe</Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {recipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

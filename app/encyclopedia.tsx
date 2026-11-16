"use client";
import { useEffect, useMemo, useState } from "react";
import { lessons } from "../lib/encyclopedia-lessons";

type View = "all" | "saved" | "completed";
const KEY = "crochet-chaos-bible-v2";
export default function Encyclopedia() {
 const [search,setSearch] = useState("");
 const [category,setCategory] = useState("All topics");
 const [level,setLevel] = useState("All levels");
 const [view,setView] = useState<View>("all");
 const [openId,setOpenId] = useState<string|null>(null);
 const [saved,setSaved] = useState<string[]>([]);
 const [completed,setCompleted] = useState<string[]>([]);
 const [ready,setReady] = useState(false);
 useEffect(()=>{try { const data=JSON.parse(localStorage.getItem(KEY)||"{}"); if(Array.isArray(data.saved)) setSaved(data.saved); if(Array.isArray(data.completed)) setCompleted(data.completed); } catch {} setReady(true);},[]);
 useEffect(()=>{if(ready) {try{localStorage.setItem(KEY,JSON.stringify({saved,completed}));}catch{}}},[saved,completed,ready]);
 const categories = useMemo(()=>["All topics",...Array.from(new Set(lessons.map(l=>l.category)))],[]);
 const results = useMemo(()=>lessons.filter(l=> (category==="All topics"||l.category===category) && (level==="All levels"||l.level===level||l.level==="All levels") && (view!=="saved"||saved.includes(l.id)) && (view!=="completed"||completed.includes(l.id)) && [l.title,l.summary,l.tip,l.category,...l.steps].join(" ").toLowerCase().includes(search.toLowerCase().trim())),[search,category,level,view,saved,completed]);
 const toggle=(id:string,items:string[],set:(x:string[])=>void)=>set(items.includes(id)?items.filter(x=>x!==id):[...items,id]);
 return <section className="panel encyclopedia">
 <p className="eyebrow">THE CROCHET CHAOS LIBRARY</p><h2>The Ultimate Crochet Bible</h2>
 <p className="muted">Practical lessons, rescue tricks, garment fitting, and the little details patterns forget to tell you.</p>
 <div className="bible-progress"><strong>{completed.length} of {lessons.length} lessons completed</strong><div className="bible-progress-track" role="progressbar" aria-label="Lessons completed" aria-valuenow={completed.length} aria-valuemin={0} aria-valuemax={lessons.length}><span style={{width:`${100*completed.length/lessons.length}%`}}/></div><small>Saved lessons and progress stay on this device.</small></div>
 <div className="encyclopedia-filters"><label>Search lessons<input type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Try magic ring, frogging, dog sweaters…" /></label><label>Topic<select value={category} onChange={e=>setCategory(e.target.value)}>{categories.map(c=><option key={c}>{c}</option>)}</select></label><label>Difficulty<select value={level} onChange={e=>setLevel(e.target.value)}>{["All levels","Beginner","Intermediate"].map(x=><option key={x}>{x}</option>)}</select></label></div>
 <div className="bible-view-tabs" aria-label="Lesson view">{(["all","saved","completed"] as View[]).map(v=><button key={v} className={view===v?"active":""} aria-pressed={view===v} onClick={()=>setView(v)}>{v==="all"?"All lessons":v==="saved"?`Bookmarked (${saved.length})`:`Completed (${completed.length})`}</button>)}</div>
 <p className="muted" aria-live="polite">{results.length} {results.length===1?"lesson":"lessons"} found</p>
 <div className="encyclopedia-list">{results.map(l=><article className="encyclopedia-card" key={l.id}><button className="encyclopedia-toggle" aria-expanded={openId===l.id} onClick={()=>setOpenId(openId===l.id?null:l.id)}><span><small>{l.category} · {l.level}{completed.includes(l.id)?" · ✓ Completed":""}</small><strong>{l.title}</strong><span>{l.summary}</span></span><b aria-hidden="true">{openId===l.id?"−":"+"}</b></button>{openId===l.id&&<div className="encyclopedia-detail"><ol>{l.steps.map(s=><li key={s}>{s}</li>)}</ol><p><strong>Wish I’d known:</strong> {l.tip}</p><div className="bible-actions"><button type="button" aria-pressed={saved.includes(l.id)} onClick={()=>toggle(l.id,saved,setSaved)}>{saved.includes(l.id)?"★ Bookmarked":"☆ Bookmark"}</button><button type="button" aria-pressed={completed.includes(l.id)} onClick={()=>toggle(l.id,completed,setCompleted)}>{completed.includes(l.id)?"✓ Completed":"Mark complete"}</button></div></div>}</article>)}</div>
 {!results.length&&<p>No lessons matched. Try clearing the search or changing filters.</p>}
 </section>;
}

import { useState, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Product {
   id: number;
   name: string;
   description: string;
   image: string;
   rating: number;
   reviews: number;
   confidence: number;
   price: string;
   tag?: string;
}

// ─── Mock ─────────────────────────────────────────────────────────────────────

const PRODUCTS_MOCK: Product[] = [
   {
      id: 1,
      name: "Nike Air Zoom Pegasus 40",
      description: "Amortecimento responsivo e leve para corridas diárias.",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80",
      rating: 4.8,
      reviews: 6123,
      confidence: 97,
      price: "R$ 799,90",
      tag: "Melhor escolha",
   },
   {
      id: 2,
      name: "Adidas Duramo SL",
      description: "Versátil e confortável para treinos e uso casual.",
      image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=200&q=80",
      rating: 4.6,
      reviews: 3840,
      confidence: 93,
      price: "R$ 299,90",
      tag: "Custo-benefício",
   },
   {
      id: 3,
      name: "Asics Gel-Kayano 30",
      description: "Estabilidade premium com suporte avançado para longas distâncias.",
      image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=200&q=80",
      rating: 4.9,
      reviews: 2710,
      confidence: 95,
      price: "R$ 1.199,00",
      tag: "Premium",
   },
   {
      id: 4,
      name: "Puma Smash v2",
      description: "Design clássico e confortável para uso diário.",
      image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=200&q=80",
      rating: 4.5,
      reviews: 1987,
      confidence: 86,
      price: "R$ 249,90",
   },
   {
      id: 5,
      name: "Vans Old Skool",
      description: "Ícone do streetwear com solado resistente e estilo atemporal.",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=200&q=80",
      rating: 4.7,
      reviews: 4550,
      confidence: 90,
      price: "R$ 399,90",
      tag: "Popular",
   }
];

const FEEDBACK_STEPS = [
   "Analisando a página…",
   "Coletando dados do mercado…",
   "Comparando especificações…",
   "Calculando compatibilidade…",
   "Priorizando resultados…",
];

type SortKey = "confidence" | "rating" | "price";

// ─── Atoms ────────────────────────────────────────────────────────────────────

/** A10 — Badge tonal com dot de status */
function ConfidenceBadge({ value }: { value: number }) {
   const isHigh = value >= 90;
   return (
      <span
         className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium border"
         style={{
            background: isHigh ? "#f0f4ec" : "#eef1ff",
            color: isHigh ? "#A3B18A" : "#5271FF",
            borderColor: isHigh ? "#c8d9b8" : "#c5cfff",
         }}
      >
         <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: isHigh ? "#A3B18A" : "#5271FF" }}
            aria-hidden="true"
         />
         {value}% compat.
      </span>
   );
}

/** A10 — Stars read-only */
function Stars({ rating }: { rating: number }) {
   return (
      <div className="flex items-center gap-0.5" aria-label={`${rating} de 5 estrelas`}>
         {[1, 2, 3, 4, 5].map((s) => (
            <svg
               key={s}
               className="w-3 h-3"
               fill={s <= Math.round(rating) ? "#FFB800" : "#E9ECEF"}
               viewBox="0 0 20 20"
               aria-hidden="true"
            >
               <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
         ))}
      </div>
   );
}

/** A17 — Spinner inline */
function Spinner() {
   return (
      <span
         role="status"
         aria-label="Carregando"
         className="inline-block w-3.5 h-3.5 border-2 rounded-full animate-spin shrink-0"
         style={{ borderColor: "#c5cfff", borderTopColor: "#5271FF" }}
      />
   );
}

// ─── Molecules ────────────────────────────────────────────────────────────────

/** M03 — Alert info com progresso segmentado (A15 stepped) */
function LoadingBanner({ step, total }: { step: number; total: number }) {
   return (
      <div
         role="status"
         aria-live="polite"
         className="flex gap-3 p-3 border"
         style={{ background: "#eef1ff", borderColor: "#c5cfff" }}
      >
         <Spinner />
         <div className="flex-1 min-w-0 space-y-2">
            <p className="text-xs font-medium" style={{ color: "#5271FF" }}>
               {FEEDBACK_STEPS[step]}
            </p>
            {/* A15 stepped — segmentos */}
            <div className="flex gap-0.5">
               {Array.from({ length: total }).map((_, i) => (
                  <div
                     key={i}
                     className="flex-1 h-1 transition-all duration-500"
                     style={{
                        background:
                           i < step ? "#5271FF" : i === step ? "#a5b4fc" : "#E9ECEF",
                     }}
                  />
               ))}
            </div>
         </div>
      </div>
   );
}

/** A14 — Skeleton card fiel à estrutura final */
function SkeletonCard({ prominent = false }: { prominent?: boolean }) {
   return (
      <div
         className="bg-white border animate-pulse"
         style={{
            borderColor: prominent ? "#c8d9b8" : "#E9ECEF",
            opacity: prominent ? 1 : 0.65,
         }}
      >
         {prominent && (
            <div className="h-6 w-full" style={{ background: "#E9ECEF" }} />
         )}
         <div className="p-3 flex gap-3">
            <div
               className="shrink-0"
               style={{
                  width: prominent ? 56 : 36,
                  height: prominent ? 56 : 36,
                  background: "#F0F1F3",
               }}
            />
            <div className="flex-1 space-y-2 py-0.5">
               <div className="h-3 w-3/4" style={{ background: "#F0F1F3" }} />
               <div className="h-2.5 w-full" style={{ background: "#F0F1F3" }} />
               {prominent && <div className="h-2.5 w-1/2" style={{ background: "#F0F1F3" }} />}
               <div className="flex gap-2 pt-0.5">
                  <div className="h-4 w-16" style={{ background: "#F0F1F3" }} />
                  <div className="h-4 w-14 ml-auto" style={{ background: "#F0F1F3" }} />
               </div>
            </div>
         </div>
         {prominent && (
            <div
               className="h-8 mx-3 mb-3"
               style={{ background: "#F0F1F3" }}
            />
         )}
      </div>
   );
}

/** M09 — Pill tabs de ordenação */
function SortTabs({ active, onChange }: { active: SortKey; onChange: (k: SortKey) => void }) {
   const opts: { key: SortKey; label: string }[] = [
      { key: "confidence", label: "Compatível" },
      { key: "rating", label: "Avaliação" },
      { key: "price", label: "Preço" },
   ];
   return (
      <div
         role="tablist"
         aria-label="Ordenar resultados"
         className="flex gap-1 p-1"
         style={{ background: "#F0F1F3" }}
      >
         {opts.map((o) => (
            <button
               key={o.key}
               role="tab"
               aria-selected={active === o.key}
               onClick={() => onChange(o.key)}
               className="flex-1 px-2 py-1 text-[10px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-inset cursor-pointer"
               style={{
                  background: active === o.key ? "#FFFFFF" : "transparent",
                  color: active === o.key ? "#212529" : "#6C757D",
                  boxShadow: active === o.key ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
               }}
            >
               {o.label}
            </button>
         ))}
      </div>
   );
}

// ─── Organisms ────────────────────────────────────────────────────────────────

/** M04 — Card com header + footer — Top 3 */
function TopCard({ product, rank, visible }: { product: Product; rank: number; visible: boolean }) {
   const isPrimary = rank === 1;

   return (
      <div
         className="bg-white border overflow-hidden transition-all duration-500"
         style={{
            borderColor: isPrimary ? "#A3B18A" : "#E9ECEF",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(8px)",
         }}
      >
         {/* M04 header */}
         {product.tag && (
            <div
               className="px-3 py-1.5 flex items-center justify-between border-b"
               style={{
                  background: isPrimary ? "#A3B18A" : "#5271FF",
                  borderColor: isPrimary ? "#8fa876" : "#4460E8",
               }}
            >
               <p className="mono text-[10px] font-semibold uppercase tracking-widest text-white">
                  #{rank} · {product.tag}
               </p>
            </div>
         )}

         {/* M04 body */}
         <div className="p-3 flex gap-3">
            <img
               src={product.image}
               alt={product.name}
               className="shrink-0 object-cover"
               style={{ width: 56, height: 56 }}
            />
            <div className="flex-1 min-w-0 space-y-1.5">
               <p className="text-sm font-semibold text-[#212529] leading-snug truncate">
                  {product.name}
               </p>
               <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "#6C757D" }}>
                  {product.description}
               </p>
               <div className="flex items-center gap-1.5">
                  <Stars rating={product.rating} />
                  <span className="text-[10px]" style={{ color: "#6C757D" }}>
                     ({product.reviews})
                  </span>
               </div>
               <div className="flex items-center justify-between">
                  <ConfidenceBadge value={product.confidence} />
                  <span className="text-sm font-bold" style={{ color: "#5271FF" }}>
                     {product.price}
                  </span>
               </div>
            </div>
         </div>

         {/* M04 footer */}
         <div
            className="px-3 py-2 border-t flex items-center gap-2"
            style={{ background: "#F8F9FA", borderColor: "#F0F1F3" }}
         >
            <button
               type="button"
               className="flex-1 inline-flex items-center justify-center px-3 py-1.5 text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors cursor-pointer"
               style={{ background: isPrimary ? "#A3B18A" : "#5271FF" }}
            >
               Ver Detalhes
            </button>
            <button
               type="button"
               aria-label="Salvar produto"
               className="p-1.5 border border-transparent hover:border-[#E9ECEF] focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
               style={{ color: "#6C757D" }}
            >
               <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                     d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
               </svg>
            </button>
         </div>
      </div>
   );
}

/** M13 — List item compacto */
function ProductRow({ product, visible }: { product: Product; visible: boolean }) {
   return (
      <li
         className="flex items-center gap-3 px-3 py-2.5 bg-white hover:bg-[#F8F9FA] transition-colors"
         style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : "translateX(-4px)",
            transition: "opacity 0.4s ease, transform 0.4s ease",
         }}
      >
         <img
            src={product.image}
            alt={product.name}
            className="w-9 h-9 object-cover shrink-0"
         />
         <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#212529] truncate">{product.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
               <Stars rating={product.rating} />
               <span className="text-[10px]" style={{ color: "#6C757D" }}>({product.reviews})</span>
            </div>
         </div>
         <div className="flex flex-col items-end gap-1 shrink-0">
            <span className="text-xs font-bold" style={{ color: "#5271FF" }}>{product.price}</span>
            <ConfidenceBadge value={product.confidence} />
         </div>
      </li>
   );
}

const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

function formatDate(date: Date): string {
   return `${date.getDate()} de ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export function ExtensionView() {
   const [enabled, setEnabled] = useState(true);
   const [phase, setPhase] = useState<"loading" | "results">("loading");
   const [feedbackStep, setFeedbackStep] = useState(0);
   const [visibleTop, setVisibleTop] = useState([false, false, false]);
   const [visibleOthers, setVisibleOthers] = useState([false, false]);
   const [sort, setSort] = useState<SortKey>("confidence");

   useEffect(() => {
      if (phase !== "loading") return;
      const t = setInterval(() => {
         setFeedbackStep((s) => {
            if (s >= FEEDBACK_STEPS.length - 1) {
               clearInterval(t);
               setTimeout(() => {
                  setPhase("results");
                  [0, 1, 2].forEach((i) =>
                     setTimeout(
                        () => setVisibleTop((v) => { const n = [...v]; n[i] = true; return n; }),
                        i * 280
                     )
                  );
                  [0, 1].forEach((i) =>
                     setTimeout(
                        () => setVisibleOthers((v) => { const n = [...v]; n[i] = true; return n; }),
                        900 + i * 180
                     )
                  );
               }, 300);
               return s;
            }
            return s + 1;
         });
      }, 650);
      return () => clearInterval(t);
   }, [phase]);

   const sortFn = (a: Product, b: Product) => {
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "price")
         return (
            parseFloat(a.price.replace(/[^\d,]/g, "").replace(",", ".")) -
            parseFloat(b.price.replace(/[^\d,]/g, "").replace(",", "."))
         );
      return b.confidence - a.confidence;
   };

   const top3 = [...PRODUCTS_MOCK.slice(0, 3)].sort(sortFn);
   const others = [...PRODUCTS_MOCK.slice(3)].sort(sortFn);

   return (
      <div
         className="w-90 flex flex-col overflow-hidden"
         style={{
            height: 580,
            background: "#F8F9FA",
            fontFamily: "'DM Sans', system-ui, sans-serif",
            border: "1px solid #DEE2E6",
         }}
      >
         {/* ── Header (sticky) ── */}
         <header
            className="sticky top-0 z-10 bg-white border-b shrink-0"
            style={{ borderColor: "#E9ECEF" }}
         >
            <div className="h-12 px-4 flex items-center justify-between">
               {/* logo */}
               <div className="flex items-center gap-2.5">
                  <div
                     className="w-5 h-5 grid place-items-center shrink-0"
                     style={{ background: "#5271FF" }}
                  >
                     <div className="w-1.5 h-1.5 bg-white" />
                  </div>
                  <span className="text-sm font-semibold tracking-tight text-[#212529]">
                     SmartFind
                  </span>
                  <span
                     className="mono text-[10px] px-1.5 py-0.5"
                     style={{ color: "#6C757D", background: "#F0F1F3" }}
                  >
                     v1.0
                  </span>
               </div>

               {/* A09 toggle */}
               <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs select-none" style={{ color: "#6C757D" }}>
                     {enabled ? "Ativo" : "Pausado"}
                  </span>
                  <span className="relative shrink-0">
                     <input
                        type="checkbox"
                        role="switch"
                        className="peer sr-only"
                        checked={enabled}
                        onChange={(e) => setEnabled(e.target.checked)}
                     />
                     <span
                        className="block w-9 h-5 border transition-all
                  peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2"
                        style={{
                           background: enabled ? "#A3B18A" : "#E9ECEF",
                           borderColor: enabled ? "#A3B18A" : "#DEE2E6",
                        }}
                     />
                     <span
                        className="absolute top-[3px] left-[3px] w-3.5 h-3.5 bg-white border transition-all peer-checked:translate-x-4"
                        style={{ borderColor: enabled ? "#8fa876" : "#DEE2E6" }}
                     />
                  </span>
               </label>
            </div>
         </header>

         {/* ── Body ── */}
         <div className="flex-1 overflow-y-auto">

            {/* LOADING */}
            {phase === "loading" && (
               <div className="p-3 space-y-2.5">
                  <LoadingBanner step={feedbackStep} total={FEEDBACK_STEPS.length} />

                  <p className="mono text-[10px] font-semibold uppercase tracking-widest px-1 pt-1"
                     style={{ color: "#6C757D" }}>
                     Top 3 mais relevantes
                  </p>
                  <SkeletonCard prominent />
                  <SkeletonCard prominent />
                  <SkeletonCard prominent />

                  {/* A13 divider com label */}
                  <div className="flex items-center gap-3 py-1">
                     <hr className="flex-1 border-0 border-t" style={{ borderColor: "#E9ECEF" }} />
                     <span className="mono text-[10px] font-medium uppercase tracking-widest"
                        style={{ color: "#6C757D" }}>
                        Outros
                     </span>
                     <hr className="flex-1 border-0 border-t" style={{ borderColor: "#E9ECEF" }} />
                  </div>
                  <SkeletonCard />
                  <SkeletonCard />
               </div>
            )}

            {/* RESULTS */}
            {phase === "results" && (
               <div className="p-3 space-y-2.5">
                  {/* M03 success banner */}
                  <div
                     role="alert"
                     className="flex gap-3 p-3 border"
                     style={{ background: "#f0f4ec", borderColor: "#c8d9b8" }}
                  >
                     <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none"
                        stroke="#A3B18A" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                           d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>
                     <div>
                        <p className="text-xs font-semibold" style={{ color: "#3d6b37" }}>
                           Análise concluída
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: "#5a8a4d" }}>
                           {PRODUCTS_MOCK.length} produtos encontrados para esta página.
                        </p>
                     </div>
                  </div>

                  {/* M09 pill tabs */}
                  <SortTabs active={sort} onChange={setSort} />

                  {/* top 3 label */}
                  <p className="mono text-[10px] font-semibold uppercase tracking-widest px-1 pt-1"
                     style={{ color: "#6C757D" }}>
                     Top 3 mais relevantes
                  </p>

                  {/* M04 cards */}
                  <div className="space-y-2">
                     {top3.map((p, i) => (
                        <TopCard key={p.id} product={p} rank={i + 1} visible={visibleTop[i]} />
                     ))}
                  </div>

                  {/* A13 divider */}
                  <div className="flex items-center gap-3 py-1">
                     <hr className="flex-1 border-0 border-t" style={{ borderColor: "#E9ECEF" }} />
                     <span className="mono text-[10px] font-medium uppercase tracking-widest"
                        style={{ color: "#6C757D" }}>
                        Outros resultados
                     </span>
                     <hr className="flex-1 border-0 border-t" style={{ borderColor: "#E9ECEF" }} />
                  </div>

                  {/* M13 list */}
                  <ul className="border divide-y divide-zinc-200" style={{ borderColor: "#E9ECEF" }}>
                     {others.map((p, i) => (
                        <ProductRow key={p.id} product={p} visible={visibleOthers[i]} />
                     ))}
                  </ul>
               </div>
            )}
         </div>

         {/* ── Footer ── */}
         <footer
            className="bg-white border-t shrink-0 px-4 py-2.5 flex items-center justify-between"
            style={{ borderColor: "#E9ECEF" }}
         >
            <span className="mono text-[10px]" style={{ color: "#6C757D" }}>
               SmartFind · {formatDate(new Date)}
            </span>
            <a
               href="#"
               className="text-[11px] font-medium transition-colors"
               style={{ color: "#5271FF" }}
            >
               Ver todos →
            </a>
         </footer>
      </div>
   );
}

export default ExtensionView;
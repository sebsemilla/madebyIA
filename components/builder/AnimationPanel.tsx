"use client";

import { useState } from "react";
import { useBuilderStore } from "@/store/builder";
import { streamFromAPI } from "@/lib/sandbox";
import { AnimationCategory } from "@/types";

const ANIMATION_CATEGORIES: AnimationCategory[] = [
  {
    id: "entrance",
    name: "Entradas",
    icon: "↓",
    presets: [
      { id: "fade-up", label: "Fade Up", prompt: "Agrega animaciones de entrada fade-up con GSAP a todos los elementos principales de la página. Cada elemento debe entrar con un pequeño retraso escalonado (stagger)." },
      { id: "split-text", label: "Texto partido", prompt: "Usa GSAP TextPlugin o SplitText para animar los títulos letra por letra o palabra por palabra al cargar la página." },
      { id: "clip-reveal", label: "Clip Reveal", prompt: "Agrega una animación de clip-path reveal a las secciones principales. Las secciones deben aparecer como si una máscara las descubriera." },
      { id: "scale-in", label: "Scale In", prompt: "Agrega animaciones de entrada con scale (de 0.8 a 1) y fade a todos los elementos de la página usando GSAP con stagger." },
    ],
  },
  {
    id: "scroll",
    name: "Scroll",
    icon: "↕",
    presets: [
      { id: "parallax", label: "Parallax", prompt: "Agrega efecto parallax a las secciones usando GSAP ScrollTrigger. Las imágenes o fondos deben moverse más lento que el scroll." },
      { id: "scroll-reveal", label: "Scroll Reveal", prompt: "Usa GSAP ScrollTrigger para que cada sección entre animada cuando el usuario hace scroll hacia ella. Efecto fade + translateY." },
      { id: "progress-bar", label: "Barra progreso", prompt: "Agrega una barra de progreso de scroll en la parte superior de la página usando GSAP ScrollTrigger." },
      { id: "pin-sections", label: "Pin & Scale", prompt: "Usa GSAP ScrollTrigger pin para crear secciones que se quedan fijas mientras el contenido interno se anima al hacer scroll." },
    ],
  },
  {
    id: "hover",
    name: "Hover",
    icon: "◎",
    presets: [
      { id: "magnetic", label: "Magnético", prompt: "Agrega un efecto magnético a los botones: cuando el mouse se acerca, el botón se desplaza levemente hacia el cursor usando mousemove + GSAP." },
      { id: "tilt", label: "Tilt 3D", prompt: "Agrega efecto tilt 3D a las cards o elementos principales. Al mover el mouse sobre ellos rotan sutilmente en perspectiva 3D usando GSAP + CSS transform." },
      { id: "cursor-glow", label: "Cursor Glow", prompt: "Agrega un glow/spotlight que sigue al cursor por la página. El efecto debe iluminar el área cercana al mouse con un gradiente radial suave." },
      { id: "text-morph", label: "Text Morph", prompt: "Agrega un efecto de texto que cambia/morphea entre diferentes palabras en el título principal usando GSAP." },
    ],
  },
  {
    id: "threed",
    name: "3D / WebGL",
    icon: "◈",
    presets: [
      { id: "particles", label: "Partículas", prompt: "Agrega un fondo de partículas animadas con Three.js. Las partículas deben reaccionar sutilmente al movimiento del mouse." },
      { id: "geometry-bg", label: "Geometría BG", prompt: "Crea un fondo WebGL con Three.js que muestre formas geométricas abstractas (torus, icosahedro, etc.) rotando lentamente. Semi-transparente para no ocultar el contenido." },
      { id: "wave-plane", label: "Ola de vértices", prompt: "Agrega un plano 3D con Three.js que ondule como una ola detrás del hero. Usar ShaderMaterial o PlaneGeometry con vértices animados." },
      { id: "floating-spheres", label: "Esferas flotantes", prompt: "Agrega esferas 3D flotantes con Three.js que se muevan lentamente en el fondo. Usar material con wireframe o vidrio (MeshPhysicalMaterial)." },
    ],
  },
  {
    id: "transitions",
    name: "Transiciones",
    icon: "→",
    presets: [
      { id: "page-loader", label: "Page Loader", prompt: "Agrega un loader animado al inicio de la página que cubre la pantalla y se revela con GSAP cuando todo está listo." },
      { id: "smooth-scroll", label: "Smooth Scroll", prompt: "Implementa smooth scrolling personalizado con GSAP o Lenis-style. El scroll debe sentirse fluido y con inercia." },
      { id: "section-counter", label: "Contadores", prompt: "Agrega animaciones de contador numérico a las estadísticas o números de la página. Los números deben incrementarse con ease cuando entran al viewport." },
      { id: "stagger-grid", label: "Stagger Grid", prompt: "Anima los elementos de la grilla con un stagger usando GSAP. Cada elemento entra con un pequeño retraso en cascada." },
    ],
  },
];

export default function AnimationPanel() {
  const [activeCategory, setActiveCategory] = useState(ANIMATION_CATEGORIES[0].id);
  const { html, isGenerating, setHtml, setIsGenerating, addMessage, updateLastMessage } =
    useBuilderStore();

  const activePresets =
    ANIMATION_CATEGORIES.find((c) => c.id === activeCategory)?.presets ?? [];

  const handlePreset = async (prompt: string, label: string) => {
    if (!html || isGenerating) return;
    addMessage({ role: "user", content: `Animación: ${label}` });
    addMessage({ role: "assistant", content: "..." });
    setIsGenerating(true);

    let accumulated = "";
    try {
      await streamFromAPI(prompt, html, "generate", null, (chunk) => {
        accumulated += chunk;
        setHtml(accumulated);
      });
      updateLastMessage(`Animación "${label}" aplicada.`);
      useBuilderStore.getState().setHtml(accumulated, true);
    } catch (err) {
      updateLastMessage("Error aplicando la animación.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Category tabs */}
      <div className="flex border-b border-border overflow-x-auto flex-shrink-0 scrollbar-none">
        {ANIMATION_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex-shrink-0 flex items-center gap-1 px-3 py-2.5 text-xs font-medium transition-colors ${
              activeCategory === cat.id
                ? "text-accent border-b-2 border-accent"
                : "text-text-muted hover:text-text"
            }`}
          >
            <span className="text-base leading-none">{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Presets */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {!html && (
          <p className="text-xs text-text-muted text-center pt-6 leading-relaxed">
            Genera una página primero para aplicar animaciones.
          </p>
        )}
        {activePresets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => handlePreset(preset.prompt, preset.label)}
            disabled={!html || isGenerating}
            className="w-full text-left p-3 rounded-xl bg-surface-2 border border-border hover:border-accent hover:bg-surface-3 disabled:opacity-40 disabled:cursor-not-allowed transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text group-hover:text-accent transition-colors">
                {preset.label}
              </span>
              <svg
                className="w-3.5 h-3.5 text-text-muted group-hover:text-accent transition-colors opacity-0 group-hover:opacity-100"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
            <p className="text-xs text-text-muted mt-1 leading-relaxed line-clamp-2">
              {preset.prompt.slice(0, 80)}...
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

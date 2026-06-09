"use client";

import { useBuilderStore } from "@/store/builder";
import { streamFromAPI } from "@/lib/sandbox";
import { Template } from "@/types";

const TEMPLATES: Template[] = [
  {
    id: "hero-3d",
    name: "Hero 3D",
    description: "Partículas Three.js + título animado con GSAP",
    preview: "✦",
    prompt:
      "Crea una landing page hero de pantalla completa con un fondo de partículas animadas con Three.js, un título grande con animación de entrada usando GSAP TextPlugin, y un botón CTA con hover effect. Dark theme, estético y moderno.",
  },
  {
    id: "portfolio",
    name: "Portfolio",
    description: "Grid con animaciones scroll reveal",
    preview: "◈",
    prompt:
      "Crea una página de portfolio con un header minimalista, una grilla de proyectos que aparece con scroll reveal usando GSAP ScrollTrigger, y una sección de contacto. Dark theme con acentos violeta.",
  },
  {
    id: "abstract-art",
    name: "Arte Abstracto",
    description: "Canvas WebGL interactivo",
    preview: "◉",
    prompt:
      "Crea una página artística con un canvas Three.js que genere formas geométricas abstractas animadas que reaccionen al movimiento del mouse. Colores vibrantes, efecto de profundidad.",
  },
  {
    id: "product",
    name: "Producto",
    description: "Presentación con morphing y transiciones",
    preview: "◇",
    prompt:
      "Crea una landing page de producto con un hero llamativo, sección de features con iconos animados con GSAP, contadores animados, y un CTA final. Estilo tech moderno, dark theme.",
  },
];

export default function TemplateGallery() {
  const { setHtml, addMessage, setIsGenerating } = useBuilderStore();

  const handleSelect = async (template: Template) => {
    addMessage({ role: "user", content: `Template: ${template.name}` });
    setIsGenerating(true);

    let accumulated = "";
    try {
      await streamFromAPI(template.prompt, "", "generate", null, (chunk) => {
        accumulated += chunk;
        setHtml(accumulated);
      });
      addMessage({
        role: "assistant",
        content: `Template "${template.name}" generado. Hacé click en cualquier elemento para modificarlo.`,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2 p-4">
      {TEMPLATES.map((t) => (
        <button
          key={t.id}
          onClick={() => handleSelect(t)}
          className="group text-left p-3 rounded-xl bg-surface-2 border border-border hover:border-accent transition-all hover:bg-surface-3"
        >
          <div className="text-2xl mb-2 text-text-muted group-hover:text-accent transition-colors">
            {t.preview}
          </div>
          <p className="text-sm font-medium text-text">{t.name}</p>
          <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
            {t.description}
          </p>
        </button>
      ))}
    </div>
  );
}

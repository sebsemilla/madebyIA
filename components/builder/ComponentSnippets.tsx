"use client";

import { useState } from "react";
import { useBuilderStore } from "@/store/builder";
import { streamFromAPI } from "@/lib/sandbox";

interface Snippet {
  id: string;
  label: string;
  icon: string;
  prompt: string;
}

interface SnippetGroup {
  name: string;
  items: Snippet[];
}

const GROUPS: SnippetGroup[] = [
  {
    name: "Estructura",
    items: [
      { id: "navbar", label: "Navbar", icon: "▬", prompt: "Agrega un navbar fijo en la parte superior con logo a la izquierda, links de navegación al centro y un botón CTA a la derecha. Dark theme, con efecto blur al hacer scroll. Animación de entrada sutil." },
      { id: "hero", label: "Hero Section", icon: "◈", prompt: "Agrega una sección hero de pantalla completa con un título grande, subtítulo, dos botones CTA y un fondo degradado animado. El texto debe entrar con GSAP." },
      { id: "footer", label: "Footer", icon: "▬", prompt: "Agrega un footer completo con columnas de links, redes sociales, copyright y un separador animado. Dark y minimalista." },
      { id: "section", label: "Sección genérica", icon: "□", prompt: "Agrega una sección de contenido con un título, párrafo descriptivo y un contenedor centrado de ancho máximo. Con padding generoso y separador visual." },
    ],
  },
  {
    name: "Contenido",
    items: [
      { id: "cards-grid", label: "Grid de cards", icon: "⊞", prompt: "Agrega una grilla de 3 cards con icono, título y descripción. Hover effect con GSAP (elevación + sombra). Dark theme con bordes sutiles." },
      { id: "features", label: "Features", icon: "✦", prompt: "Agrega una sección de features con 4 ítems en grid. Cada feature tiene un icono SVG, título y descripción corta. Animación de entrada al entrar al viewport con GSAP ScrollTrigger." },
      { id: "testimonials", label: "Testimonios", icon: "❝", prompt: "Agrega una sección de testimonios con 3 cards que incluyan avatar (inicial del nombre), nombre, cargo y texto. Con animación de entrada escalonada." },
      { id: "pricing", label: "Pricing", icon: "◇", prompt: "Agrega una sección de pricing con 3 planes (Básico, Pro, Enterprise). El plan Pro debe estar destacado. Incluir lista de features con checkmarks y botón CTA en cada plan." },
      { id: "stats", label: "Estadísticas", icon: "◉", prompt: "Agrega una sección con 4 estadísticas numéricas animadas (contador con GSAP) al entrar al viewport. Números grandes, etiquetas descriptivas, fondo oscuro con contraste." },
      { id: "faq", label: "FAQ / Acordeón", icon: "≡", prompt: "Agrega una sección FAQ con 5 preguntas en formato acordeón. Al hacer click en una pregunta se expande la respuesta con animación suave usando GSAP. Solo una abierta a la vez." },
    ],
  },
  {
    name: "Visual",
    items: [
      { id: "image-gallery", label: "Galería", icon: "⊟", prompt: "Agrega una galería de imágenes en grid masonry con placeholders de colores y hover zoom. Al hacer click se abre un lightbox simple con transición." },
      { id: "timeline", label: "Timeline", icon: "⌇", prompt: "Agrega una sección de timeline vertical con 4-5 ítems. Cada ítem tiene fecha, título y descripción. La línea vertical y los puntos se animan al hacer scroll con GSAP ScrollTrigger." },
      { id: "marquee", label: "Marquee / Logos", icon: "»", prompt: "Agrega una banda horizontal con logos de clientes o tecnologías (texto con estilo tipográfico) en movimiento continuo con CSS animation o GSAP. Efecto infinito suave." },
      { id: "divider-wave", label: "Divisor wave", icon: "∿", prompt: "Agrega un divisor animado entre secciones usando SVG wave o Three.js. El divisor debe ser dinámico y fluir suavemente." },
    ],
  },
  {
    name: "Interactivo",
    items: [
      { id: "contact-form", label: "Formulario", icon: "✉", prompt: "Agrega un formulario de contacto con campos nombre, email, mensaje y botón enviar. Con animaciones de foco en los inputs y validación visual. Dark theme." },
      { id: "modal", label: "Modal / Dialog", icon: "◫", prompt: "Agrega un botón que abre un modal centrado con overlay oscuro y animación de entrada/salida con GSAP. El modal tiene título, contenido y botón de cerrar." },
      { id: "tabs", label: "Tabs", icon: "⊡", prompt: "Agrega una sección de tabs con 4 pestañas. Al cambiar de tab el contenido se anima con GSAP (fade + slide). Tabs con indicador animado deslizante." },
      { id: "progress-skills", label: "Skill bars", icon: "▰", prompt: "Agrega una sección de habilidades con barras de progreso animadas. Las barras se llenan cuando entran al viewport usando GSAP ScrollTrigger. Porcentaje visible." },
    ],
  },
];

export default function ComponentSnippets() {
  const [activeGroup, setActiveGroup] = useState(GROUPS[0].name);
  const { html, isGenerating, setHtml, addMessage, updateLastMessage, setIsGenerating } =
    useBuilderStore();

  const currentItems = GROUPS.find((g) => g.name === activeGroup)?.items ?? [];

  const handleAdd = async (snippet: Snippet) => {
    if (isGenerating) return;
    const prompt = !html
      ? snippet.prompt + " Crea una página completa con dark theme que incluya esta sección."
      : snippet.prompt + " Integralo de forma coherente con el estilo visual existente de la página.";

    addMessage({ role: "user", content: `+ ${snippet.label}` });
    addMessage({ role: "assistant", content: "..." });
    setIsGenerating(true);

    let accumulated = "";
    try {
      await streamFromAPI(prompt, html, "generate", null, (chunk) => {
        accumulated += chunk;
        setHtml(accumulated);
      });
      setHtml(accumulated, true);
      updateLastMessage(`Componente "${snippet.label}" agregado.`);
    } catch {
      updateLastMessage("Error al agregar el componente.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Group tabs */}
      <div className="flex border-b border-border overflow-x-auto flex-shrink-0">
        {GROUPS.map((g) => (
          <button
            key={g.name}
            onClick={() => setActiveGroup(g.name)}
            className={`flex-shrink-0 px-3 py-2.5 text-xs font-medium transition-colors ${
              activeGroup === g.name
                ? "text-accent border-b-2 border-accent"
                : "text-text-muted hover:text-text"
            }`}
          >
            {g.name}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {currentItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleAdd(item)}
            disabled={isGenerating}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-surface-2 border border-border hover:border-accent hover:bg-surface-3 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-left group"
          >
            <span className="text-lg text-text-muted group-hover:text-accent transition-colors leading-none flex-shrink-0">
              {item.icon}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-text group-hover:text-accent transition-colors leading-none">
                {item.label}
              </p>
            </div>
            <svg
              className="w-3.5 h-3.5 text-text-muted ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

export interface GuideTerm {
  term: string;
  desc: string;
  example: string;
}

export interface GuideCategory {
  id: string;
  name: string;
  icon: string;
  terms: GuideTerm[];
}

export const GUIDE_CATEGORIES: GuideCategory[] = [
  {
    id: "gsap",
    name: "GSAP",
    icon: "⚡",
    terms: [
      {
        term: "gsap.from()",
        desc: "Anima desde propiedades definidas hacia el estado actual del elemento. Ideal para entradas.",
        example: "Animá el hero con gsap.from() para que el título entre desde abajo con fade.",
      },
      {
        term: "gsap.to()",
        desc: "Anima desde el estado actual hacia propiedades destino. Usado para salidas o cambios de estado.",
        example: "Al hacer hover, usá gsap.to() para mover la card 8px hacia arriba.",
      },
      {
        term: "gsap.fromTo()",
        desc: "Define explícitamente el estado inicial y el final. Da control total sobre la animación.",
        example: "Usá gsap.fromTo() para animar la opacidad de 0 a 1 y el y de 40 a 0 en cada sección.",
      },
      {
        term: "timeline",
        desc: "Encadena múltiples animaciones en secuencia con control total de tiempos y solapamiento.",
        example: "Creá un gsap.timeline() para animar primero el título, luego el subtítulo y después los botones.",
      },
      {
        term: "stagger",
        desc: "Aplica un retardo escalonado entre múltiples elementos del mismo tipo.",
        example: "Animá la grilla de cards con stagger: 0.1 para que entren en cascada.",
      },
      {
        term: "ease",
        desc: "Curva de velocidad de la animación. Opciones: power1-4, back, bounce, elastic, expo, circ, sine.",
        example: "Usá ease: 'back.out(1.7)' en los botones para un efecto de rebote al entrar.",
      },
      {
        term: "ScrollTrigger",
        desc: "Plugin que dispara animaciones basadas en la posición del scroll del usuario.",
        example: "Con ScrollTrigger, animá cada sección cuando el 20% del elemento entre al viewport.",
      },
      {
        term: "scrub",
        desc: "Sincroniza la animación directamente con la posición del scroll. scrub: true o un número para suavidad.",
        example: "Agregá scrub: 1 al parallax del hero para que el movimiento siga suavemente al scroll.",
      },
      {
        term: "pin",
        desc: "Fija un elemento en su posición mientras el scroll avanza, creando secciones de scroll largo.",
        example: "Usá pin: true para fijar el texto del hero mientras el fondo 3D se transforma al hacer scroll.",
      },
      {
        term: "TextPlugin",
        desc: "Plugin para animar texto carácter por carácter o palabra por palabra.",
        example: "Usá TextPlugin para escribir el título principal como si se estuviera tipeando.",
      },
    ],
  },
  {
    id: "threejs",
    name: "Three.js",
    icon: "◈",
    terms: [
      {
        term: "scene",
        desc: "Contenedor principal donde se agregan todos los objetos, luces y cámaras 3D.",
        example: "Creá una scene con fondo oscuro y agregá niebla sutil con THREE.FogExp2.",
      },
      {
        term: "PerspectiveCamera",
        desc: "Cámara con perspectiva realista. Parámetros: FOV (campo visual), aspect ratio, near, far.",
        example: "Usá PerspectiveCamera con FOV 75 y posicionala en z: 5 para ver la escena completa.",
      },
      {
        term: "WebGLRenderer",
        desc: "Motor de renderizado que dibuja la escena 3D en un canvas HTML.",
        example: "Configurá el WebGLRenderer con antialias: true y alpha: true para fondo transparente.",
      },
      {
        term: "mesh",
        desc: "Objeto 3D visible compuesto por una geometría y un material.",
        example: "Creá un mesh con TorusGeometry y MeshPhysicalMaterial para una esfera de vidrio flotante.",
      },
      {
        term: "geometría",
        desc: "Forma del objeto 3D. Opciones: BoxGeometry, SphereGeometry, TorusGeometry, PlaneGeometry, IcosahedronGeometry.",
        example: "Usá IcosahedronGeometry con detail: 2 y wireframe para el fondo abstracto.",
      },
      {
        term: "MeshPhysicalMaterial",
        desc: "Material físicamente correcto con soporte para transparencia, metalness, roughness y refracción.",
        example: "Aplicá MeshPhysicalMaterial con transmission: 0.9 y roughness: 0.1 para efecto vidrio.",
      },
      {
        term: "ShaderMaterial",
        desc: "Material con shaders GLSL personalizados para efectos visuales únicos.",
        example: "Usá ShaderMaterial para crear un plano con efecto de olas usando vértices animados en el vertex shader.",
      },
      {
        term: "raycaster",
        desc: "Detecta qué objetos 3D intersectan el cursor del mouse. Permite interactividad en la escena.",
        example: "Usá raycaster para que las partículas del fondo huyan del cursor del mouse.",
      },
    ],
  },
  {
    id: "layout",
    name: "Layout & Estructura",
    icon: "▦",
    terms: [
      {
        term: "hero section",
        desc: "Primera sección de pantalla completa (100vh). Define la primera impresión visual del sitio.",
        example: "Creá una hero section de pantalla completa con un canvas Three.js de fondo y el título centrado.",
      },
      {
        term: "above the fold",
        desc: "Contenido visible sin hacer scroll. Área de máximo impacto y atención del usuario.",
        example: "Asegurate que el CTA principal esté above the fold, visible sin scroll en cualquier dispositivo.",
      },
      {
        term: "bento grid",
        desc: "Layout de grilla asimétrica con cards de distintos tamaños, popularizado por Apple.",
        example: "Creá un bento grid de 4 columnas con cards de tamaño variable para mostrar features.",
      },
      {
        term: "masonry",
        desc: "Grilla sin filas fijas donde los elementos se apilan verticalmente según su altura.",
        example: "Usá un layout masonry de 3 columnas para la galería de proyectos.",
      },
      {
        term: "sticky nav",
        desc: "Navbar que permanece fija en la parte superior al hacer scroll.",
        example: "Agregá un sticky nav con backdrop-filter blur que aparece con opacidad al bajar 80px.",
      },
      {
        term: "scroll snapping",
        desc: "El viewport se ancla automáticamente a secciones completas al hacer scroll.",
        example: "Implementá scroll snapping para que cada sección de portfolio ocupe pantalla completa.",
      },
      {
        term: "max-width container",
        desc: "Contenedor con ancho máximo (ej. 1200px) centrado horizontalmente con padding lateral.",
        example: "Envolvé el contenido en un max-width container de 1100px con padding de 24px en móvil.",
      },
      {
        term: "aspect-ratio",
        desc: "Propiedad CSS que mantiene la proporción de un elemento (ej. 16/9, 1/1).",
        example: "Usá aspect-ratio: 16/9 en las cards de video para que mantengan proporción en cualquier ancho.",
      },
    ],
  },
  {
    id: "visual",
    name: "Visual & Color",
    icon: "✦",
    terms: [
      {
        term: "glassmorphism",
        desc: "Efecto de vidrio esmerilado: fondo semi-transparente con backdrop-filter blur.",
        example: "Aplicá glassmorphism a la navbar: background rgba con 10% opacidad y backdrop-filter: blur(20px).",
      },
      {
        term: "gradient mesh",
        desc: "Degradado con múltiples puntos de color distribuidos, crea fondos ricos y orgánicos.",
        example: "Creá un gradient mesh de fondo con morado, azul y negro mezclados.",
      },
      {
        term: "CSS custom properties",
        desc: "Variables CSS reutilizables definidas con --nombre. Permiten theming y consistencia visual.",
        example: "Definí CSS custom properties para --color-primary, --color-accent y usalas en todos los elementos.",
      },
      {
        term: "mix-blend-mode",
        desc: "Define cómo un elemento se mezcla visualmente con lo que tiene detrás. Opciones: multiply, screen, overlay.",
        example: "Aplicá mix-blend-mode: screen al texto del hero para que se integre con el fondo 3D.",
      },
      {
        term: "clamp()",
        desc: "Función CSS para tamaños fluidos entre un mínimo y un máximo según el viewport.",
        example: "Usá clamp(2rem, 6vw, 5rem) para el título del hero, fluido entre mobile y desktop.",
      },
      {
        term: "text-gradient",
        desc: "Relleno degradado en texto usando background-clip: text y color: transparent.",
        example: "Aplicá un text-gradient de morado a azul en el título principal para darle profundidad.",
      },
    ],
  },
  {
    id: "strategy",
    name: "Estrategia de Prompt",
    icon: "◎",
    terms: [
      {
        term: "referenciar estilo",
        desc: "Mencionar marcas o productos con estética conocida acelera el entendimiento del mood buscado.",
        example: "Creá una landing con estética similar a Linear.app: minimalista, dark, tipografía Inter.",
      },
      {
        term: "especificar paleta",
        desc: "Dar colores HEX específicos produce resultados más consistentes que descripciones genéricas.",
        example: "Usá la paleta: fondo #0a0a0a, acento #7c3aed, texto #e5e7eb, superficies #1a1a1a.",
      },
      {
        term: "describir comportamiento",
        desc: "Especificar cuándo y cómo ocurren las animaciones evita resultados genéricos.",
        example: "Al hacer scroll, cuando el 30% del elemento entre al viewport, animalo con fade + translateY(-20px).",
      },
      {
        term: "aislar cambios",
        desc: "Pedirle que modifique solo una parte evita que reescriba todo y rompa el diseño.",
        example: "Solo modificá la sección de pricing, sin tocar el navbar ni el hero.",
      },
      {
        term: "mood / atmósfera",
        desc: "Palabras que definen la sensación general: minimal, brutal, editorial, futurista, orgánico, luxury.",
        example: "Quiero una atmósfera editorial y luxury, tipografía serif grande, mucho espacio en blanco.",
      },
      {
        term: "especificar interacción",
        desc: "Describir exactamente qué pasa en hover, click o scroll para evitar animaciones genéricas.",
        example: "En hover sobre la card, que el título se desplace 4px hacia arriba y aparezca una línea underline con GSAP.",
      },
    ],
  },
];

export function searchTerms(query: string): Array<GuideTerm & { category: string }> {
  const q = query.toLowerCase();
  const results: Array<GuideTerm & { category: string }> = [];
  for (const cat of GUIDE_CATEGORIES) {
    for (const term of cat.terms) {
      if (
        term.term.toLowerCase().includes(q) ||
        term.desc.toLowerCase().includes(q) ||
        term.example.toLowerCase().includes(q)
      ) {
        results.push({ ...term, category: cat.name });
      }
    }
  }
  return results;
}

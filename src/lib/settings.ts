import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_DIR = join(__dirname, '..', '..', 'data');
const SETTINGS_FILE = join(DATA_DIR, 'settings.json');

export interface ServiceTag {
  text: string;
  borderColor: string;
}

export interface ServiceItem {
  id: string;
  num: string;
  active: boolean;
  order: number;
  detailUrl?: string;                   // e.g. "/servicios/inteligencia-artificial-para-empresas/"
  image?: string;                       // URL of header image
  label: Record<string, string>;       // { es: "...", ca: "..." }
  title: Record<string, string>;
  description: Record<string, string>;
  tags: ServiceTag[];
  colors: {
    numColor: string;
    labelColor: string;
    titleColor: string;
    descriptionColor: string;
    hoverBorderColor: string;
  };
}

export interface HeroSlideHeading {
  line1: string;
  line2: string;
  line3: string;
  full: string;
}

export interface HeroSlideTerminal {
  cmd: string;
  flag: string;
  lines: string[];
}

export interface HeroSlideButton {
  href: string;
  label: Record<string, string>;
  style: 'primary' | 'secondary';
}

export interface HeroSlide {
  id: string;
  active: boolean;
  order: number;
  duration: number;
  accentColor: 'orange' | 'teal';
  backgroundImage?: string;
  badges: Record<string, string[]>;
  heading: Record<string, HeroSlideHeading>;
  subtitle: Record<string, string>;
  terminal: Record<string, HeroSlideTerminal>;
  buttons: HeroSlideButton[];
  microcopy?: Record<string, string>;
}

export interface ProcessStep {
  id: string;
  num: string;
  active: boolean;
  order: number;
  image?: string;
  title: Record<string, string>;
  description: Record<string, string>;
}

export interface TypographyConfig {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing: string;
}

export type TypoElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';

export interface SiteSettings {
  parameters: {
    heroSlideDuration: number;
  };
  visual: {
    primaryColor: string;
    secondaryColor: string;
    customCSS: string;
  };
  heroSlides: HeroSlide[];
  services: ServiceItem[];
  processSteps: ProcessStep[];
  typography: Record<TypoElement, TypographyConfig>;
}

const DEFAULT_TYPOGRAPHY: Record<TypoElement, TypographyConfig> = {
  h1: { fontFamily: "'Inter', sans-serif", fontSize: 'clamp(3rem,8vw,7rem)', fontWeight: '900', lineHeight: '0.9', letterSpacing: '-0.05em' },
  h2: { fontFamily: "'Inter', sans-serif", fontSize: 'clamp(2.5rem,5vw,4.5rem)', fontWeight: '900', lineHeight: '0.95', letterSpacing: '-0.025em' },
  h3: { fontFamily: "'Inter', sans-serif", fontSize: '1.25rem', fontWeight: '700', lineHeight: '1.3', letterSpacing: '-0.01em' },
  h4: { fontFamily: "'Inter', sans-serif", fontSize: '1.125rem', fontWeight: '700', lineHeight: '1.4', letterSpacing: '0' },
  h5: { fontFamily: "'Inter', sans-serif", fontSize: '1rem', fontWeight: '600', lineHeight: '1.4', letterSpacing: '0' },
  h6: { fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', fontWeight: '600', lineHeight: '1.5', letterSpacing: '0' },
  p: { fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', fontWeight: '400', lineHeight: '1.6', letterSpacing: '0' },
  span: { fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', fontWeight: '400', lineHeight: '1.5', letterSpacing: '0.05em' },
};

const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    active: true,
    order: 0,
    duration: 6,
    accentColor: 'orange',
    badges: {
      es: ['CIBAI_STUDIO', 'BERGA, BARCELONA, ESPAÑA', 'STATUS: ONLINE'],
      ca: ['CIBAI_STUDIO', 'BERGA, BARCELONA, ESPANYA', 'STATUS: ONLINE'],
    },
    heading: {
      es: {
        line1: 'LA TECNOLOGÍA NO',
        line2: 'TRANSFORMA EMPRESAS.',
        line3: 'LOS SISTEMAS BIEN DISEÑADOS, SÍ.',
        full: 'La tecnología no transforma empresas. Los sistemas bien diseñados, sí.',
      },
      ca: {
        line1: 'LA TECNOLOGIA NO',
        line2: 'TRANSFORMA EMPRESES.',
        line3: 'ELS SISTEMES BEN DISSENYATS, SÍ.',
        full: 'La tecnologia no transforma empreses. Els sistemes ben dissenyats, sí.',
      },
    },
    subtitle: {
      es: 'En CIBAI.Studio diseñamos e implementamos soluciones reales de IA, automatización, software y activos digitales para que tu empresa opere mejor, venda más y escale sin multiplicar el caos.',
      ca: 'A CIBAI.Studio dissenyem i implementem solucions reals d\'IA, automatització, software i actius digitals perquè la teva empresa operi millor, vengui més i escali sense multiplicar el caos.',
    },
    terminal: {
      es: {
        cmd: 'cibai',
        flag: '--diagnostico',
        lines: [
          '> IA aplicada. Automatización real. Software que encaja.',
          '> Del diagnóstico a la implantación, sin atajos.',
          '> Sistemas que funcionan donde importa.',
        ],
      },
      ca: {
        cmd: 'cibai',
        flag: '--diagnostic',
        lines: [
          '> IA aplicada. Automatització real. Software que encaixa.',
          '> Del diagnòstic a la implantació, sense dreceres.',
          '> Sistemes que funcionen on importa.',
        ],
      },
    },
    buttons: [
      {
        href: '#contacto',
        label: { es: 'Solicitar diagnóstico', ca: 'Sol·licitar diagnòstic' },
        style: 'primary',
      },
      {
        href: '#servicios',
        label: { es: 'Ver qué resolvemos', ca: 'Veure què resolem' },
        style: 'secondary',
      },
    ],
    microcopy: {
      es: 'Sin demos vacías. Sin promesas infladas. Solo soluciones que funcionan donde importa: en el trabajo real de tu empresa.',
      ca: 'Sense demos buides. Sense promeses inflades. Només solucions que funcionen on importa: en el treball real de la teva empresa.',
    },
  },
  {
    id: 'slide-2',
    active: true,
    order: 1,
    duration: 6,
    accentColor: 'teal',
    badges: {
      es: ['IA_AUTOMATIZACIÓN', 'EFICIENCIA OPERATIVA', 'SIGNAL: ACTIVE'],
      ca: ['IA_AUTOMATITZACIÓ', 'EFICIÈNCIA OPERATIVA', 'SIGNAL: ACTIVE'],
    },
    heading: {
      es: {
        line1: 'RECUPERA EL TIEMPO',
        line2: 'QUE TU EQUIPO',
        line3: 'PIERDE EN TAREAS REPETITIVAS',
        full: 'Recupera el tiempo que tu equipo pierde en tareas que ya puede hacer una máquina',
      },
      ca: {
        line1: 'RECUPERA EL TEMPS',
        line2: 'QUE EL TEU EQUIP',
        line3: 'PERD EN TASQUES REPETITIVES',
        full: 'Recupera el temps que el teu equip perd en tasques que ja pot fer una màquina',
      },
    },
    subtitle: {
      es: 'Diseñamos e implementamos flujos inteligentes, automatizaciones e integraciones que eliminan el trabajo repetitivo, reducen errores y dan a tu equipo tiempo para lo que genera valor real.',
      ca: 'Dissenyem i implementem fluxos intel·ligents, automatitzacions i integracions que eliminen el treball repetitiu, redueixen errors i donen al teu equip temps per al que genera valor real.',
    },
    terminal: {
      es: {
        cmd: 'automatizar',
        flag: '--impacto=real',
        lines: [
          '> Flujos inteligentes. Integraciones. Cero trabajo doble.',
          '> Menos tareas manuales, más tiempo para lo que importa.',
          '> Eficiencia operativa activada.',
        ],
      },
      ca: {
        cmd: 'automatitzar',
        flag: '--impacte=real',
        lines: [
          '> Fluxos intel·ligents. Integracions. Zero treball doble.',
          '> Menys tasques manuals, més temps per al que importa.',
          '> Eficiència operativa activada.',
        ],
      },
    },
    buttons: [
      {
        href: '/ia-automatizacion-empresas',
        label: { es: 'Explorar IA y automatización', ca: 'Explorar IA i automatització' },
        style: 'primary',
      },
      {
        href: '#contacto',
        label: { es: 'Solicitar diagnóstico', ca: 'Sol·licitar diagnòstic' },
        style: 'secondary',
      },
    ],
  },
  {
    id: 'slide-3',
    active: true,
    order: 2,
    duration: 6,
    accentColor: 'teal',
    badges: {
      es: ['AGENTES_IA', 'RAG · CHATBOTS · VOZ', 'NODE: ACTIVE'],
      ca: ['AGENTS_IA', 'RAG · CHATBOTS · VEU', 'NODE: ACTIVE'],
    },
    heading: {
      es: {
        line1: 'RESPONDE MÁS RÁPIDO,',
        line2: 'ATIENDE MEJOR,',
        line3: 'CONVIERTE MÁS OPORTUNIDADES',
        full: 'Responde más rápido, atiende mejor y convierte el conocimiento disperso en ventaja operativa',
      },
      ca: {
        line1: 'RESPON MÉS RÀPID,',
        line2: 'ATÉN MILLOR,',
        line3: 'CONVERTEIX MÉS OPORTUNITATS',
        full: 'Respon més ràpid, atén millor i converteix el coneixement dispers en avantatge operatiu',
      },
    },
    subtitle: {
      es: 'Construimos chatbots, agentes IA especializados, sistemas RAG y soluciones de voz inteligente que mejoran la atención, el soporte interno, las ventas y la gestión del conocimiento de tu empresa.',
      ca: 'Construïm chatbots, agents IA especialitzats, sistemes RAG i solucions de veu intel·ligent que milloren l\'atenció, el suport intern, les vendes i la gestió del coneixement de la teva empresa.',
    },
    terminal: {
      es: {
        cmd: 'agentes-ia',
        flag: '--modo=produccion',
        lines: [
          '> Agentes entrenados sobre tu empresa, no plantillas.',
          '> Atención 24/7 sin aumentar el equipo.',
          '> Conocimiento accesible al instante.',
        ],
      },
      ca: {
        cmd: 'agents-ia',
        flag: '--mode=produccio',
        lines: [
          '> Agents entrenats sobre la teva empresa, no plantilles.',
          '> Atenció 24/7 sense augmentar l\'equip.',
          '> Coneixement accessible a l\'instant.',
        ],
      },
    },
    buttons: [
      {
        href: '/agentes-ia-rag',
        label: { es: 'Ver agentes IA y RAG', ca: 'Veure agents IA i RAG' },
        style: 'primary',
      },
      {
        href: '#contacto',
        label: { es: 'Solicitar diagnóstico', ca: 'Sol·licitar diagnòstic' },
        style: 'secondary',
      },
    ],
  },
  {
    id: 'slide-4',
    active: true,
    order: 3,
    duration: 6,
    accentColor: 'orange',
    badges: {
      es: ['SOFTWARE_WEB', 'WEB · ECOMMERCE · APPS', 'STACK: ACTIVE'],
      ca: ['SOFTWARE_WEB', 'WEB · ECOMMERCE · APPS', 'STACK: ACTIVE'],
    },
    heading: {
      es: {
        line1: 'ACTIVOS DIGITALES',
        line2: 'QUE POSICIONAN,',
        line3: 'CONVIERTEN Y ESCALAN',
        full: 'Activos digitales que no solo se ven bien: posicionan, convierten y escalan con tu negocio',
      },
      ca: {
        line1: 'ACTIUS DIGITALS',
        line2: 'QUE POSICIONEN,',
        line3: 'CONVERTEIXEN I ESCALEN',
        full: 'Actius digitals que no només es veuen bé: posicionen, converteixen i escalen amb el teu negoci',
      },
    },
    subtitle: {
      es: 'Desarrollamos webs corporativas, ecommerce y herramientas a medida que se alinean con tus procesos reales, tu forma de vender y los objetivos concretos de tu empresa.',
      ca: 'Desenvolupem webs corporatives, ecommerce i eines a mida que s\'alineen amb els teus processos reals, la teva forma de vendre i els objectius concrets de la teva empresa.',
    },
    terminal: {
      es: {
        cmd: 'web-ecommerce',
        flag: '--objetivo=conversion',
        lines: [
          '> Webs que posicionan y convierten, no solo informan.',
          '> Ecommerce sólido, escalable y optimizado.',
          '> Software a medida para tu operativa real.',
        ],
      },
      ca: {
        cmd: 'web-ecommerce',
        flag: '--objectiu=conversio',
        lines: [
          '> Webs que posicionen i converteixen, no només informen.',
          '> Ecommerce sòlid, escalable i optimitzat.',
          '> Software a mida per a la teva operativa real.',
        ],
      },
    },
    buttons: [
      {
        href: '/web-corporativa',
        label: { es: 'Ver desarrollo a medida', ca: 'Veure desenvolupament a mida' },
        style: 'primary',
      },
      {
        href: '#contacto',
        label: { es: 'Solicitar diagnóstico', ca: 'Sol·licitar diagnòstic' },
        style: 'secondary',
      },
    ],
  },
];

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 'svc-ia',
    num: '01',
    active: true,
    order: 0,
    detailUrl: '/servicios/inteligencia-artificial-para-empresas/',
    label: { es: 'INTELIGENCIA_ARTIFICIAL', ca: 'INTELLIGENCIA_ARTIFICIAL' },
    title: { es: 'IA que trabaja para tu negocio', ca: 'IA que treballa per al teu negoci' },
    description: {
      es: 'Agentes IA personalizados, chatbots inteligentes y análisis predictivo. No plantillas genéricas: inteligencia artificial diseñada específicamente para tu empresa, que aprende tus procesos y escala sin aumentar tu nómina.',
      ca: 'Agents IA personalitzats, chatbots intel·ligents i anàlisi predictiva. Res de plantilles genèriques: intel·ligència artificial dissenyada específicament per a la teva empresa, que aprèn els teus processos i escala sense augmentar la teva nòmina.',
    },
    tags: [
      { text: 'AGENTES_IA', borderColor: '#2a2a2a' },
      { text: 'CHATBOTS', borderColor: '#2a2a2a' },
      { text: 'PREDICTIVO', borderColor: '#2a2a2a' },
    ],
    colors: {
      numColor: '#FFFFFF12',
      labelColor: '#00FFB2',
      titleColor: '#F5F5F5',
      descriptionColor: '#888888',
      hoverBorderColor: '#FF4D00',
    },
  },
  {
    id: 'svc-web',
    num: '02',
    active: true,
    order: 1,
    detailUrl: '/servicios/diseno-web-profesional/',
    label: { es: 'DISEÑO_WEB', ca: 'DISSENY_WEB' },
    title: { es: 'Webs que venden mientras duermes', ca: 'Webs que venen mentre dorms' },
    description: {
      es: 'Webs corporativas, ecommerce y plataformas e-learning diseñadas para convertir. Cada decisión responde a un objetivo de negocio concreto. Una web que no convierte es un gasto; nosotros construimos webs que trabajan.',
      ca: 'Webs corporatives, ecommerce i plataformes e-learning dissenyades per convertir. Cada decisió respon a un objectiu de negoci concret. Una web que no converteix és una despesa; nosaltres construïm webs que treballen.',
    },
    tags: [
      { text: 'CORPORATIVA', borderColor: '#2a2a2a' },
      { text: 'ECOMMERCE', borderColor: '#2a2a2a' },
      { text: 'E-LEARNING', borderColor: '#2a2a2a' },
    ],
    colors: {
      numColor: '#FFFFFF12',
      labelColor: '#00FFB2',
      titleColor: '#F5F5F5',
      descriptionColor: '#888888',
      hoverBorderColor: '#FF4D00',
    },
  },
  {
    id: 'svc-software',
    num: '03',
    active: true,
    order: 2,
    detailUrl: '/servicios/desarrollo-software-medida/',
    label: { es: 'PROGRAMACIÓN_A_MEDIDA', ca: 'PROGRAMACIÓ_A_MIDA' },
    title: { es: 'Software hecho para ti', ca: 'Software fet per a tu' },
    description: {
      es: 'SaaS, apps, plataformas de gestión y cuadros de mando. Cuando las herramientas del mercado no encajan con tu negocio, construimos la tuya. Tuya para siempre, sin límites de licencias ni funciones que no usas.',
      ca: 'SaaS, apps, plataformes de gestió i quadres de comandament. Quan les eines del mercat no encaixen amb el teu negoci, construïm la teva. Teva per sempre, sense límits de llicències ni funcions que no fas servir.',
    },
    tags: [
      { text: 'SAAS', borderColor: '#2a2a2a' },
      { text: 'APPS', borderColor: '#2a2a2a' },
      { text: 'DASHBOARDS', borderColor: '#2a2a2a' },
    ],
    colors: {
      numColor: '#FFFFFF12',
      labelColor: '#00FFB2',
      titleColor: '#F5F5F5',
      descriptionColor: '#888888',
      hoverBorderColor: '#FF4D00',
    },
  },
  {
    id: 'svc-automatizacion',
    num: '04',
    active: true,
    order: 3,
    detailUrl: '/servicios/automatizacion-procesos-empresariales/',
    label: { es: 'AUTOMATIZACIÓN', ca: 'AUTOMATITZACIÓ' },
    title: { es: 'Automatiza. Escala. Libérate.', ca: 'Automatitza. Escala. Allibera\'t.' },
    description: {
      es: 'Si tu equipo hace lo mismo una y otra vez, hay un problema. Conectamos tus herramientas, automatizamos tus procesos con N8N e IA y liberamos a tu equipo para lo que de verdad importa: crecer.',
      ca: 'Si el teu equip fa el mateix una vegada i una altra, hi ha un problema. Connectem les teves eines, automatitzem els teus processos amb N8N i IA i alliberem el teu equip per al que de veritat importa: créixer.',
    },
    tags: [
      { text: 'N8N', borderColor: '#2a2a2a' },
      { text: 'IA', borderColor: '#2a2a2a' },
      { text: 'INTEGRACIONES', borderColor: '#2a2a2a' },
    ],
    colors: {
      numColor: '#FFFFFF12',
      labelColor: '#00FFB2',
      titleColor: '#F5F5F5',
      descriptionColor: '#888888',
      hoverBorderColor: '#FF4D00',
    },
  },
  {
    id: 'svc-neuromarketing',
    num: '05',
    active: true,
    order: 4,
    detailUrl: '/servicios/copywriting-persuasivo/',
    label: { es: 'NEUROMARKETING_COPY', ca: 'NEUROMARKETING_COPY' },
    title: { es: 'Palabras que venden', ca: 'Paraules que venen' },
    description: {
      es: 'Copy estratégico con neurociencia aplicada y psicología del consumidor. Webs, landing pages y campañas con mensajes que conectan y convierten. Tu cliente decide en segundos: las palabras correctas marcan la diferencia.',
      ca: 'Copy estratègic amb neurociència aplicada i psicologia del consumidor. Webs, landings i campanyes amb missatges que connecten i converteixen. El teu client decideix en segons: les paraules correctes marquen la diferència.',
    },
    tags: [
      { text: 'COPY', borderColor: '#2a2a2a' },
      { text: 'NEUROCIENCIA', borderColor: '#2a2a2a' },
      { text: 'CONVERSIÓN', borderColor: '#2a2a2a' },
    ],
    colors: {
      numColor: '#FFFFFF12',
      labelColor: '#00FFB2',
      titleColor: '#F5F5F5',
      descriptionColor: '#888888',
      hoverBorderColor: '#FF4D00',
    },
  },
  {
    id: 'svc-growth',
    num: '06',
    active: true,
    order: 5,
    detailUrl: '/servicios/estrategia-crecimiento-digital/',
    label: { es: 'DIGITAL_BUSINESS_GROWTH', ca: 'DIGITAL_BUSINESS_GROWTH' },
    title: { es: 'De marca a negocio digital', ca: 'De marca a negoci digital' },
    description: {
      es: 'Estrategia de crecimiento digital para empresas y marcas personales. Posicionamiento real, embudo de ventas y diferenciación que el mercado percibe. Visibilidad sin estrategia es invisibilidad disfrazada: nosotros construimos la estrategia.',
      ca: 'Estratègia de creixement digital per a empreses i marques personals. Posicionament real, embut de vendes i diferenciació que el mercat percep. Visibilitat sense estratègia és invisibilitat disfressada: nosaltres construïm l\'estratègia.',
    },
    tags: [
      { text: 'ESTRATEGIA', borderColor: '#2a2a2a' },
      { text: 'GROWTH', borderColor: '#2a2a2a' },
      { text: 'EMBUDO_VENTAS', borderColor: '#2a2a2a' },
    ],
    colors: {
      numColor: '#FFFFFF12',
      labelColor: '#00FFB2',
      titleColor: '#F5F5F5',
      descriptionColor: '#888888',
      hoverBorderColor: '#FF4D00',
    },
  },
];

const DEFAULT_PROCESS_STEPS: ProcessStep[] = [
  {
    id: 'step-diagnostico',
    num: '01',
    active: true,
    order: 0,
    title: { es: 'DIAGNÓSTICO', ca: 'DIAGNÒSTIC' },
    description: {
      es: 'Analizamos tu punto de partida: procesos, fricciones, herramientas actuales y oportunidades de mejora. Sin diagnóstico, no hay propuesta seria.',
      ca: 'Analitzem el teu punt de partida: processos, friccions, eines actuals i oportunitats de millora. Sense diagnòstic, no hi ha proposta seriosa.',
    },
  },
  {
    id: 'step-estrategia',
    num: '02',
    active: true,
    order: 1,
    title: { es: 'ESTRATEGIA', ca: 'ESTRATÈGIA' },
    description: {
      es: 'Definimos qué tiene sentido hacer primero, qué solución genera más impacto con menos complejidad y qué resultado concreto esperamos conseguir.',
      ca: 'Definim què té sentit fer primer, quina solució genera més impacte amb menys complexitat i quin resultat concret esperem aconseguir.',
    },
  },
  {
    id: 'step-desarrollo',
    num: '03',
    active: true,
    order: 2,
    title: { es: 'DISEÑO Y DESARROLLO', ca: 'DISSENY I DESENVOLUPAMENT' },
    description: {
      es: 'Construimos la solución: automatización, agente IA, software, web o sistema integrado. Sin atajos, sin deuda técnica acumulada.',
      ca: 'Construïm la solució: automatització, agent IA, software, web o sistema integrat. Sense dreceres, sense deute tècnic acumulat.',
    },
  },
  {
    id: 'step-implantacion',
    num: '04',
    active: true,
    order: 3,
    title: { es: 'IMPLANTACIÓN', ca: 'IMPLANTACIÓ' },
    description: {
      es: 'La llevamos a producción, la conectamos con tu operativa real, formamos a quienes la van a usar y validamos que funcione en condiciones reales.',
      ca: 'La portem a producció, la connectem amb la teva operativa real, formem a qui la farà servir i validem que funcioni en condicions reals.',
    },
  },
  {
    id: 'step-optimizacion',
    num: '05',
    active: true,
    order: 4,
    title: { es: 'OPTIMIZACIÓN', ca: 'OPTIMITZACIÓ' },
    description: {
      es: 'Medimos, identificamos mejoras y evolucionamos la solución. Una implantación bien hecha es el inicio, no el final.',
      ca: 'Mesurem, identifiquem millores i evolucionem la solució. Una implantació ben feta és l\'inici, no el final.',
    },
  },
];

const DEFAULT_SETTINGS: SiteSettings = {
  parameters: {
    heroSlideDuration: 6,
  },
  visual: {
    primaryColor: '#FF4D00',
    secondaryColor: '#00FFB2',
    customCSS: '',
  },
  heroSlides: DEFAULT_HERO_SLIDES,
  services: DEFAULT_SERVICES,
  processSteps: DEFAULT_PROCESS_STEPS,
  typography: DEFAULT_TYPOGRAPHY,
};

function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function loadSettings(): SiteSettings {
  ensureDataDir();
  if (!existsSync(SETTINGS_FILE)) {
    writeFileSync(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2));
    return structuredClone(DEFAULT_SETTINGS);
  }
  const raw = JSON.parse(readFileSync(SETTINGS_FILE, 'utf-8'));

  // Migrate heroSlides: use defaults if not present
  const heroSlides: HeroSlide[] = Array.isArray(raw.heroSlides) && raw.heroSlides.length > 0
    ? raw.heroSlides
    : DEFAULT_HERO_SLIDES;

  // Migrate services: add active/order if missing
  const services: ServiceItem[] = Array.isArray(raw.services) && raw.services.length > 0
    ? raw.services.map((s: any, idx: number) => {
        // Find default for detailUrl migration
        const defaultSvc = DEFAULT_SERVICES.find(d => d.id === s.id);
        return {
          ...s,
          active: s.active !== undefined ? s.active : true,
          order: s.order !== undefined ? s.order : idx,
          detailUrl: s.detailUrl || (defaultSvc ? defaultSvc.detailUrl : undefined),
          image: s.image || undefined,
          // Migrate old string[] tags to ServiceTag[] format
          tags: Array.isArray(s.tags)
            ? s.tags.map((t: any) => typeof t === 'string' ? { text: t, borderColor: '#2a2a2a' } : t)
            : [],
        };
      })
    : DEFAULT_SERVICES;

  // Migrate processSteps
  const processSteps: ProcessStep[] = Array.isArray(raw.processSteps) && raw.processSteps.length > 0
    ? raw.processSteps.map((s: any, idx: number) => ({
        ...s,
        active: s.active !== undefined ? s.active : true,
        order: s.order !== undefined ? s.order : idx,
        image: s.image || undefined,
      }))
    : DEFAULT_PROCESS_STEPS;

  return {
    parameters: { ...DEFAULT_SETTINGS.parameters, ...raw.parameters },
    visual: { ...DEFAULT_SETTINGS.visual, ...raw.visual },
    heroSlides,
    services,
    processSteps,
    typography: { ...DEFAULT_SETTINGS.typography, ...raw.typography },
  };
}

export function saveSettings(settings: SiteSettings) {
  ensureDataDir();
  writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
}

export function lightenColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, ((num >> 16) & 0xFF) + amount);
  const g = Math.min(255, ((num >> 8) & 0xFF) + amount);
  const b = Math.min(255, (num & 0xFF) + amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0').toUpperCase()}`;
}

export function generateId(): string {
  return 'svc-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function generateSlideId(): string {
  return 'slide-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function generateStepId(): string {
  return 'step-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

import { useState, useEffect, useRef } from 'react';
import { ArrowRight, ExternalLink, Menu, X, Mail } from 'lucide-react';

// ─── TEAM DATA ────────────────────────────────────────────────────────────────

const FACULTY = [
  {
    initials: 'IC',
    name: 'Irene Chen',
    affiliation: 'Assistant Professor, UCSF & UC Berkeley',
    bio: '',
    photo: '/images/team/irene.jpeg',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    initials: 'MA',
    name: 'Monica Agrawal',
    affiliation: 'Assistant Professor',
    bio: '',
    photo: '/images/team/monica.jpg',
    gradient: 'from-rose-500 to-pink-600',
  },
  {
    initials: 'YH',
    name: 'Yulin Hswen',
    affiliation: 'Associate Professor, UC San Francisco',
    bio: '',
    photo: '/images/team/yulin.jpeg',
    gradient: 'from-sky-500 to-blue-600',
  },
];

const STUDENTS = [
  {
    initials: 'NT',
    name: 'Nitya Thakkar',
    affiliation: 'CS PhD, Stanford University',
    bio: '',
    photo: '/images/team/nitya.jpeg',
    gradient: 'from-teal-500 to-emerald-600',
  },
  {
    initials: 'SP',
    name: 'Sarika Pasumarthy',
    affiliation: 'CS + Business, UC Berkeley',
    bio: '',
    photo: '/images/team/sarika_linkedin.png',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    initials: 'SS',
    name: 'Sraavya Sambara',
    affiliation: 'CS + Biology, Harvard University',
    bio: '',
    photo: '/images/team/sraavya.jpeg',
    gradient: 'from-indigo-500 to-blue-600',
  },
  {
    initials: 'TM',
    name: 'Tanya Mehta',
    affiliation: 'MS CS, Columbia University',
    bio: '',
    photo: '/images/team/tanya.jpeg',
    gradient: 'from-fuchsia-500 to-pink-600',
  },
];

// ─── NEWS DATA ────────────────────────────────────────────────────────────────

const NEWS = [
  {
    id: 1,
    title: 'Memory Decline After Menopause Linked to Loss of Estrogen in Brain Tissue',
    date: 'May 2026',
    source: 'Northwestern Medicine',
    url: 'https://news.northwestern.edu/stories/2026/05/memory-decline-after-menopause-linked-to-loss-of-estrogen-production-in-brain-tissue',
    summary: 'A preclinical study from Northwestern found that aging females uniquely depend on brain estrogen for memory protection. The findings may help explain why nearly two-thirds of Alzheimer\'s cases occur in women.',
  },
  {
    id: 2,
    title: 'Antihistamines for Perimenopause? Fact vs. Fiction on a Viral Trend',
    date: '2026',
    source: 'The Cut',
    url: 'https://www.thecut.com/article/antihistamines-pepcid-ac-perimenopause-pmdd-fact-fiction.html',
    summary: 'Pepcid AC and other antihistamines have been circulating on social media as a perimenopause remedy. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.',
  },
  {
    id: 3,
    title: 'Menopause Is a Glitch in the Simulation',
    date: '2026',
    source: 'Substack',
    url: 'https://hukmanimansi.substack.com/p/menopause-is-a-glitch-in-the-simulation',
    summary: 'An essay arguing that menopause is an evolutionary holdover that no longer serves women, and asking what medicine could do if we actually tried to change that.',
  },
];

// ─── IMPACT GRAPHIC ───────────────────────────────────────────────────────────

function ImpactGraphic() {
  const [active, setActive] = useState(null);

  const items = [
    {
      id: 0,
      value: '10 yrs',
      caption: 'Most clinical guidelines are built on data from the 1990s.',
      note: 'Before EHR data, before social media, before modern ML.',
      accent: '#c4a8e0',
      rotate: '-2deg',
    },
    {
      id: 1,
      value: '1 in 3',
      caption: 'Women are misdiagnosed before menopause is considered.',
      note: 'Symptoms are often attributed to anxiety, depression, or just aging.',
      accent: '#e0a8c8',
      rotate: '1.5deg',
    },
    {
      id: 2,
      value: '7 years',
      caption: 'The transition can last nearly a decade.',
      note: 'Most research captures a single moment, not the full arc.',
      accent: '#b8a8e0',
      rotate: '-1deg',
    },
    {
      id: 3,
      value: '3x',
      caption: 'Black and Hispanic women are less likely to receive treatment.',
      note: 'Even when symptoms are the same.',
      accent: '#d4a8d4',
      rotate: '2deg',
    },
    {
      id: 4,
      value: '$28B',
      caption: 'Lost each year in productivity.',
      note: 'A number nearly absent from health policy conversations.',
      accent: '#a8c4e0',
      rotate: '-1.5deg',
    },
  ];

  return (
    <div className="w-full relative" style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}>
      <svg viewBox="0 0 400 320" className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} aria-hidden="true">
        <ellipse cx="60" cy="80" rx="38" ry="55" fill="#e8d5f5" fillOpacity="0.35" transform="rotate(-20 60 80)" />
        <ellipse cx="60" cy="80" rx="38" ry="55" fill="#f0c8dc" fillOpacity="0.25" transform="rotate(40 60 80)" />
        <ellipse cx="340" cy="240" rx="32" ry="48" fill="#d8c8f0" fillOpacity="0.3" transform="rotate(15 340 240)" />
        <ellipse cx="340" cy="240" rx="32" ry="48" fill="#f5dce8" fillOpacity="0.2" transform="rotate(75 340 240)" />
        <ellipse cx="200" cy="160" rx="22" ry="32" fill="#e8d5f5" fillOpacity="0.15" transform="rotate(-5 200 160)" />
        <path d="M 60 120 Q 80 105 70 90" stroke="#c4a8e0" strokeWidth="0.8" fill="none" strokeOpacity="0.5" />
        <path d="M 55 125 Q 45 108 58 98" stroke="#c4a8e0" strokeWidth="0.8" fill="none" strokeOpacity="0.5" />
        <path d="M 340 200 Q 355 188 348 175" stroke="#e0a8c8" strokeWidth="0.8" fill="none" strokeOpacity="0.5" />
        <path d="M 335 205 Q 322 192 332 180" stroke="#e0a8c8" strokeWidth="0.8" fill="none" strokeOpacity="0.5" />
      </svg>

      <div className="relative flex flex-col gap-8 py-6 px-2" style={{ zIndex: 1 }}>
        {items.map((item, i) => (
          <button
            key={item.id}
            onClick={() => setActive(active === item.id ? null : item.id)}
            className="text-left group w-full"
            style={{ transform: `rotate(${item.rotate})`, transformOrigin: 'left center' }}
          >
            <div className="flex items-baseline gap-5">
              <span style={{
                fontSize: i === 0 || i === 2 ? '3.2rem' : i === 3 ? '2.6rem' : '2.9rem',
                lineHeight: 1,
                color: active === item.id ? item.accent : '#1e1030',
                fontStyle: 'italic',
                fontWeight: 500,
                transition: 'color 0.25s',
                letterSpacing: '-0.01em',
              }}>
                {item.value}
              </span>
              <span style={{
                fontSize: '0.78rem',
                color: '#7a6a8a',
                fontFamily: 'Inter, sans-serif',
                fontStyle: 'normal',
                lineHeight: 1.4,
                maxWidth: '220px',
              }}>
                {item.caption}
              </span>
            </div>
            {active === item.id && (
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.72rem',
                color: item.accent,
                marginTop: '4px',
                paddingLeft: 'calc(3.2rem + 20px)',
                fontStyle: 'italic',
                animation: 'fadeIn 0.2s ease',
              }}>
                {item.note}
              </p>
            )}
            <div style={{
              height: '1px',
              background: `linear-gradient(to right, ${item.accent}60, transparent)`,
              marginTop: '10px',
              width: active === item.id ? '100%' : '60%',
              transition: 'width 0.3s ease',
            }} />
          </button>
        ))}
      </div>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.65rem', color: '#b0a0c0', textAlign: 'center', marginTop: '4px' }}>click to expand</p>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(3px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}

// ─── HOOKS ────────────────────────────────────────────────────────────────────

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08, rootMargin: '0px 0px -20px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0, className = '' }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : 'translateY(20px)',
      transition: `opacity 0.55s ease-out ${delay}ms, transform 0.55s ease-out ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

// ─── DECORATIVE COMPONENTS ────────────────────────────────────────────────────

function FloralBloom({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <ellipse cx="300" cy="300" rx="180" ry="260" fill="url(#p1)" transform="rotate(-15 300 300)" />
      <ellipse cx="300" cy="300" rx="180" ry="260" fill="url(#p2)" transform="rotate(45 300 300)" />
      <ellipse cx="300" cy="300" rx="180" ry="260" fill="url(#p3)" transform="rotate(105 300 300)" />
      <ellipse cx="300" cy="300" rx="180" ry="260" fill="url(#p4)" transform="rotate(165 300 300)" />
      <ellipse cx="300" cy="300" rx="90" ry="130" fill="url(#center)" />
      <defs>
        <radialGradient id="p1" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#e8d5f5" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#c4b8e8" stopOpacity="0.1" />
        </radialGradient>
        <radialGradient id="p2" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#f0c8dc" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#e8b8d0" stopOpacity="0.05" />
        </radialGradient>
        <radialGradient id="p3" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#d8c8f0" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#b8a8e0" stopOpacity="0.05" />
        </radialGradient>
        <radialGradient id="p4" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#f5dce8" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#e0c0d8" stopOpacity="0.05" />
        </radialGradient>
        <radialGradient id="center" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#f8d8e8" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#e8c8f0" stopOpacity="0.3" />
        </radialGradient>
      </defs>
    </svg>
  );
}

function PetalDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-2">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-purple-200/60" />
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <ellipse cx="10" cy="5" rx="3" ry="5" fill="#c4a8e0" fillOpacity="0.5" />
        <ellipse cx="10" cy="15" rx="3" ry="5" fill="#e0a8c8" fillOpacity="0.5" />
        <ellipse cx="5" cy="10" rx="5" ry="3" fill="#c4a8e0" fillOpacity="0.5" />
        <ellipse cx="15" cy="10" rx="5" ry="3" fill="#e0a8c8" fillOpacity="0.5" />
        <circle cx="10" cy="10" r="2.5" fill="#d4b0ec" fillOpacity="0.7" />
      </svg>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-purple-200/60" />
    </div>
  );
}

// ─── NAV ──────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { id: 'home',     label: 'Home' },
  { id: 'about',    label: 'About' },
  { id: 'research', label: 'Research' },
  { id: 'people',   label: 'People' },
  { id: 'news',     label: 'News' },
  { id: 'contact',  label: 'Contact' },
];

function Nav({ currentPage, setCurrentPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#fdfbff] ${
      scrolled ? 'bg-[#fdfbff]/95 backdrop-blur-md border-b border-purple-100 shadow-sm' : 'bg-[#fdfbff] border-b border-purple-50'
    }`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => { setCurrentPage('home'); setOpen(false); }}
            className="tracking-tight text-[#1e1030]"
          >
            <span className="font-display text-lg font-semibold">Menopause</span><span className="text-sm font-semibold text-purple-700 tracking-wide">AI</span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <button
                key={link.id}
                onClick={() => setCurrentPage(link.id)}
                className={`text-sm px-3 py-1.5 rounded-md transition-all ${
                  currentPage === link.id
                    ? 'text-purple-700 font-semibold'
                    : 'text-[#7a6a8a] hover:text-[#1e1030]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <button
            className="md:hidden p-2 text-[#7a6a8a]"
            onClick={() => setOpen(o => !o)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-[#fdfbff] border-t border-purple-50">
          {NAV_LINKS.map(link => (
            <button
              key={link.id}
              onClick={() => { setCurrentPage(link.id); setOpen(false); }}
              className={`block w-full text-left px-6 py-3.5 text-sm border-b border-purple-50 ${
                currentPage === link.id ? 'text-purple-700 font-semibold' : 'text-[#7a6a8a]'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

function Footer({ setCurrentPage }) {
  return (
    <footer className="relative border-t border-purple-100 bg-[#f9f5ff] overflow-hidden">
      <FloralBloom className="absolute -bottom-16 -left-16 w-[200px] h-[200px] opacity-20 pointer-events-none select-none" />
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-wrap justify-between gap-8">
        <div>
          <p className="mb-1"><span className="font-display text-lg font-semibold text-[#1e1030]">Menopause</span><span className="text-sm font-semibold text-purple-700">AI</span></p>
          <p className="text-sm text-[#9a8aaa] max-w-xs leading-relaxed">
            Using AI and real-world data to understand menopause.
          </p>
        </div>
        <div className="flex gap-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#9a8aaa] mb-3">Pages</p>
            <div className="flex flex-col gap-2">
              {NAV_LINKS.slice(1).map(l => (
                <button key={l.id} onClick={() => setCurrentPage(l.id)}
                  className="text-sm text-[#7a6a8a] hover:text-[#1e1030] text-left transition-colors">
                  {l.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#9a8aaa] mb-3">Contact</p>
            <a href="mailto:iychen@berkeley.edu" className="text-sm text-[#7a6a8a] hover:text-[#1e1030] transition-colors leading-relaxed">
              iychen@berkeley.edu
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-purple-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between text-xs text-[#9a8aaa]">
          <span>© 2026 Menopause AI Initiative</span>
          <span>Not a clinical service</span>
        </div>
      </div>
    </footer>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────

function HomePage({ setCurrentPage }) {
  return (
    <div>
      {/* HERO */}
      <section className="relative pt-32 pb-24 max-w-6xl mx-auto px-6 overflow-hidden">
        <FloralBloom className="absolute -top-20 -right-32 w-[500px] h-[500px] opacity-40 pointer-events-none select-none" />
        <FloralBloom className="absolute -bottom-40 -left-40 w-[380px] h-[380px] opacity-20 pointer-events-none select-none" />
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-widest text-purple-500 mb-6 flex items-center gap-2">
            <span className="text-rose-300">✦</span> AI + Menopause Science
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-[#1e1030] leading-[1.1] mb-8 max-w-3xl">
            Understanding menopause through AI and data.
          </h1>
          <p className="text-xl text-[#5a4a6a] max-w-xl leading-relaxed mb-10">
            We study perimenopause and menopause using machine learning and real-world data, from electronic health records to what people say online. We look at how people describe menopause on social media, what that reveals about symptoms and misinformation, and which conditions tend to cluster with the transition over time. Our goal is to surface patterns that clinical research has largely overlooked, and to do it in a way that reflects the full diversity of people who go through menopause.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setCurrentPage('research')}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-rose-400 hover:from-purple-700 hover:to-rose-500 text-white font-medium px-7 py-3 rounded-full transition-all shadow-sm"
            >
              Our Research <ArrowRight size={15} />
            </button>
            <button
              onClick={() => setCurrentPage('about')}
              className="inline-flex items-center gap-2 border border-purple-200 text-purple-700 hover:border-purple-300 hover:bg-purple-50/50 font-medium px-7 py-3 rounded-full transition-colors"
            >
              About
            </button>
          </div>
        </Reveal>
      </section>

      {/* DIVIDER STATS */}
      <section className="border-t border-b border-purple-100 bg-gradient-to-r from-violet-50/60 via-purple-50/40 to-rose-50/40">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { n: '47M', label: 'US women in menopause transition annually' },
            { n: '<5%', label: 'of NIH funding historically for menopause' },
            { n: '80%', label: 'report symptoms affecting daily life' },
            { n: '2/3', label: 'of Alzheimer\'s cases occur in women' },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 80}>
              <div>
                <div className="text-3xl font-black text-purple-600 mb-1">{s.n}</div>
                <p className="text-sm text-[#7a6a8a] leading-snug">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* RESEARCH THEMES */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-widest text-purple-500 mb-4 flex items-center gap-2"><span className="text-rose-300">✦</span> What we study</p>
          <h2 className="text-4xl font-semibold text-[#1e1030] mb-16 max-w-lg leading-tight">
            Three themes drive our work.
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <Reveal delay={80}>
            <div>
              <div className="mb-5 flex items-center gap-2"><span className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-purple-500 text-xs font-semibold">01</span></div>
              <h3 className="text-2xl font-semibold text-[#1e1030] mb-3">Menopause on social media</h3>
              <p className="text-[#5a4a6a] leading-relaxed">
                How do people talk about menopause online (on Reddit, Facebook, Tiktok, etc.), and what does that tell us about symptoms, misinformation, and unmet needs that clinical data misses?
              </p>
              <button onClick={() => setCurrentPage('research')} className="mt-5 text-sm text-purple-600 font-semibold hover:text-purple-800 inline-flex items-center gap-1 transition-colors">
                Learn more <ArrowRight size={13} />
              </button>
            </div>
          </Reveal>
          <Reveal delay={160}>
            <div>
              <div className="mb-5 flex items-center gap-2"><span className="w-7 h-7 rounded-full bg-rose-100 flex items-center justify-center text-rose-400 text-xs font-semibold">02</span></div>
              <h3 className="text-2xl font-semibold text-[#1e1030] mb-3">Conditions co-occurring with menopause</h3>
              <p className="text-[#5a4a6a] leading-relaxed">
                What conditions cluster alongside menopause (gastrointestinal, cardiovascular, mental health, etc.), and can we find patterns in those trends?
              </p>
              <button onClick={() => setCurrentPage('research')} className="mt-5 text-sm text-purple-600 font-semibold hover:text-purple-800 inline-flex items-center gap-1 transition-colors">
                Learn more <ArrowRight size={13} />
              </button>
            </div>
          </Reveal>
          <Reveal delay={240}>
            <div>
              <div className="mb-5 flex items-center gap-2"><span className="w-7 h-7 rounded-full bg-fuchsia-100 flex items-center justify-center text-fuchsia-400 text-xs font-semibold">03</span></div>
              <h3 className="text-2xl font-semibold text-[#1e1030] mb-3">Menopause across populations</h3>
              <p className="text-[#5a4a6a] leading-relaxed">
                How do race, ethnicity, and socioeconomic factors shape when and how menopause happens? We look at who is represented in existing data.
              </p>
              <button onClick={() => setCurrentPage('research')} className="mt-5 text-sm text-purple-600 font-semibold hover:text-purple-800 inline-flex items-center gap-1 transition-colors">
                Learn more <ArrowRight size={13} />
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="border-t border-purple-100 py-24">
        <Reveal>
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-semibold text-[#1e1030] mb-4">Reach out</h2>
            <p className="text-[#5a4a6a] mb-8 max-w-md mx-auto leading-relaxed">
              If this work interests you or you want to collaborate, get in touch.
            </p>
            <button onClick={() => setCurrentPage('contact')}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-rose-400 hover:from-purple-700 hover:to-rose-500 text-white font-medium px-7 py-3 rounded-full transition-all shadow-sm">
              Get in Touch <Mail size={15} />
            </button>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

// ─── ABOUT ────────────────────────────────────────────────────────────────────

function AboutPage({ setCurrentPage }) {
  return (
    <div className="relative pt-28 pb-24 max-w-6xl mx-auto px-6 overflow-hidden">
      <FloralBloom className="absolute -top-16 -right-24 w-[320px] h-[320px] opacity-30 pointer-events-none select-none" />
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-widest text-purple-500 mb-4">About</p>
        <h1 className="text-5xl font-semibold text-[#1e1030] mb-6 leading-tight max-w-2xl">About the Initiative</h1>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-16">
        <Reveal>
          <div>
            <h2 className="text-xl font-semibold text-[#1e1030] mb-4">What we do</h2>
            <p className="text-[#5a4a6a] leading-relaxed mb-4">
              We study menopause using AI and real-world data. That means electronic health records, wearables, and something most clinical research ignores: what people actually say online.
            </p>
            <p className="text-[#5a4a6a] leading-relaxed mb-4">
              Some of the questions that drive our work: how do people talk about menopause on social media (on Reddit, Facebook, TikTok, etc.), and what does that tell us about symptoms, misinformation, and unmet needs? What conditions cluster alongside menopause (gastrointestinal, cardiovascular, mental health, etc.), and can we find patterns in those trends? How do race, ethnicity, and socioeconomic factors shape when and how menopause happens?
            </p>
            <p className="text-[#5a4a6a] leading-relaxed">
              We want the science to be open and the tools to be useful: publishing datasets, sharing code, and writing about the work in ways that go beyond academic papers.
            </p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div>
            <h2 className="text-xl font-semibold text-[#1e1030] mb-6" style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontStyle: 'italic', fontWeight: 500, fontSize: '1.5rem' }}>a body overlooked</h2>
            <ImpactGraphic />
            <div className="mt-8">
              <button onClick={() => setCurrentPage('people')}
                className="inline-flex items-center gap-2 text-sm text-purple-600 font-semibold hover:text-purple-800 transition-colors">
                Meet the team <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

// ─── RESEARCH CHARTS ──────────────────────────────────────────────────────────

function ForestPlot() {
  const rows = [
    { label: 'Black',                  c2: -0.307, c2lo: -0.635, c2hi: 0.021,  c3: -0.246, c3lo: -0.582, c3hi: 0.090,  sig: 'ns' },
    { label: 'Asian & Pacific Islander', c2: -2.056, c2lo: -2.838, c2hi: -1.273, c3: -2.018, c3lo: -2.809, c3hi: -1.227, sig: '***' },
    { label: 'Indigenous / Other',      c2: -1.438, c2lo: -1.756, c2hi: -1.120, c3: -1.409, c3lo: -1.731, c3hi: -1.086, sig: '***' },
  ];
  const minX = -3.2, maxX = 0.6;
  const W = 320, rowH = 38, padL = 108, padR = 30, padT = 20, padB = 28;
  const H = padT + rows.length * rowH + padB;
  const chartW = W - padL - padR;
  const toX = v => padL + ((v - minX) / (maxX - minX)) * chartW;
  const ticks = [-3, -2, -1, 0];
  const c2col = '#b8a8e0', c3col = '#e0a8c8';

  return (
    <div>
      <p className="text-xs text-[#9a8aaa] mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
        Adjusted onset age difference vs. White women (years)
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ overflow: 'visible' }}>
        {ticks.map(v => {
          const x = toX(v);
          return (
            <g key={v}>
              <line x1={x} x2={x} y1={padT - 4} y2={padT + rows.length * rowH} stroke="#ede8f5" strokeWidth={v === 0 ? 1 : 0.5} strokeDasharray={v === 0 ? '2 1.5' : undefined} />
              <text x={x} y={padT + rows.length * rowH + 10} textAnchor="middle" fontSize="6.5" fill="#b0a0c0" fontFamily="Inter, sans-serif">{v}</text>
            </g>
          );
        })}
        <rect x={padL} y={padT - 4} width={toX(0) - padL} height={rows.length * rowH} fill="#fce7f3" fillOpacity="0.3" />
        {rows.map((r, i) => {
          const y2 = padT + i * rowH + rowH / 2 - 5;
          const y3 = padT + i * rowH + rowH / 2 + 5;
          return (
            <g key={i}>
              <text x={padL - 5} y={(y2 + y3) / 2 + 3} textAnchor="end" fontSize="7" fill="#5a4a6a" fontFamily="Inter, sans-serif">{r.label}</text>
              <line x1={toX(r.c2lo)} x2={toX(r.c2hi)} y1={y2} y2={y2} stroke={c2col} strokeWidth="1.2" />
              <circle cx={toX(r.c2)} cy={y2} r="3" fill={c2col} />
              <line x1={toX(r.c3lo)} x2={toX(r.c3hi)} y1={y3} y2={y3} stroke={c3col} strokeWidth="1.2" />
              <circle cx={toX(r.c3)} cy={y3} r="3" fill={c3col} />
              <text x={padL + chartW + 4} y={y2 + 3} fontSize="6.5" fill={r.sig === 'ns' ? '#b0a0c0' : c2col} fontFamily="Inter, sans-serif">{r.sig}</text>
            </g>
          );
        })}
        <text x={padL + chartW / 2} y={H - 2} textAnchor="middle" fontSize="6" fill="#9a8aaa" fontFamily="Inter, sans-serif">← earlier onset than White women</text>
      </svg>
      <div className="flex gap-4 mt-1">
        {[['Cohort 2 (ICD)', c2col], ['Cohort 3 (+ surgical exclusion)', c3col]].map(([label, col]) => (
          <div key={label} className="flex items-center gap-1">
            <svg width="10" height="10"><circle cx="5" cy="5" r="3.5" fill={col} /></svg>
            <span style={{ fontSize: '0.6rem', color: '#9a8aaa', fontFamily: 'Inter, sans-serif' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CumulativeIncidenceChart() {
  const logistic = (x, mu, sigma) => 1 / (1 + Math.exp(-(x - mu) / sigma));
  const ages = Array.from({ length: 51 }, (_, i) => 40 + i * 0.5);
  const groups = [
    { label: 'White',                  mu: 51.5, sigma: 3.8, color: '#a78bfa', dash: '' },
    { label: 'Black',                  mu: 51.3, sigma: 3.8, color: '#e07aaa', dash: '3 2' },
    { label: 'Asian & Pacific Islander', mu: 49.5, sigma: 3.6, color: '#c084fc', dash: '5 2 1 2' },
    { label: 'Indigenous / Other',      mu: 50.1, sigma: 3.7, color: '#d4a8d4', dash: '2 2' },
  ];
  const W = 320, H = 160, padL = 28, padR = 12, padT = 12, padB = 24;
  const chartW = W - padL - padR, chartH = H - padT - padB;
  const toX = age => padL + ((age - 40) / 25) * chartW;
  const toY = p => padT + chartH - p * chartH;
  const yTicks = [0, 0.25, 0.5, 0.75, 1.0];
  const xTicks = [40, 45, 50, 55, 60, 65];

  return (
    <div className="mt-4">
      <p className="text-xs text-[#9a8aaa] mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
        Cumulative incidence of menopause onset by race group (Cohort 3)
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {yTicks.map(v => (
          <g key={v}>
            <line x1={padL} x2={padL + chartW} y1={toY(v)} y2={toY(v)} stroke="#ede8f5" strokeWidth="0.4" />
            <text x={padL - 3} y={toY(v) + 3} textAnchor="end" fontSize="6" fill="#b0a0c0" fontFamily="Inter, sans-serif">{v}</text>
          </g>
        ))}
        {xTicks.map(v => (
          <g key={v}>
            <text x={toX(v)} y={H - 4} textAnchor="middle" fontSize="6" fill="#b0a0c0" fontFamily="Inter, sans-serif">{v}</text>
          </g>
        ))}
        {groups.map((g) => {
          const pts = ages.map(a => `${toX(a)},${toY(logistic(a, g.mu, g.sigma))}`).join(' ');
          return <polyline key={g.label} points={pts} fill="none" stroke={g.color} strokeWidth="1.5" strokeDasharray={g.dash || undefined} />;
        })}
        <line x1={padL} x2={padL} y1={padT} y2={padT + chartH} stroke="#d8d0e8" strokeWidth="0.5" />
        <line x1={padL} x2={padL + chartW} y1={padT + chartH} y2={padT + chartH} stroke="#d8d0e8" strokeWidth="0.5" />
        <text x={padL + chartW / 2} y={H - 1} textAnchor="middle" fontSize="6" fill="#9a8aaa" fontFamily="Inter, sans-serif">age at first menopause diagnosis</text>
      </svg>
      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
        {groups.map(g => (
          <div key={g.label} className="flex items-center gap-1">
            <svg width="14" height="6"><line x1="0" y1="3" x2="14" y2="3" stroke={g.color} strokeWidth="1.8" strokeDasharray={g.dash || undefined} /></svg>
            <span style={{ fontSize: '0.6rem', color: '#9a8aaa', fontFamily: 'Inter, sans-serif' }}>{g.label}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-[#b8aac8] mt-1" style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic' }}>Kruskal-Wallis p &lt; 0.0001 across all three cohorts. Source: All of Us Controlled Tier v8.</p>
    </div>
  );
}

function DiseaseTrajectoryFig() {
  const hazards = [
    { label: 'Osteoporosis',            hr: 12.40, lo: 10.55, hi: 14.56, elevated: true },
    { label: 'Atherosclerosis',         hr:  3.96, lo:  3.18, hi:  4.93, elevated: true },
    { label: 'Lupus',                   hr:  2.61, lo:  1.46, hi:  4.69, elevated: true },
    { label: 'Rheumatoid arthritis',    hr:  2.43, lo:  1.70, hi:  3.50, elevated: true },
    { label: 'Mental/Behavioral',       hr:  2.38, lo:  2.22, hi:  2.56, elevated: true },
    { label: "Alzheimer's",             hr:  1.80, lo:  1.04, hi:  3.09, elevated: true },
    { label: 'Ischemic heart disease',  hr:  0.87, lo:  0.80, hi:  0.93, elevated: false },
    { label: 'Stroke',                  hr:  0.79, lo:  0.69, hi:  0.91, elevated: false },
    { label: 'Hypertension',            hr:  0.69, lo:  0.65, hi:  0.74, elevated: false },
    { label: 'Type 2 diabetes',         hr:  0.45, lo:  0.41, hi:  0.50, elevated: false },
    { label: 'Heart failure',           hr:  0.33, lo:  0.28, hi:  0.39, elevated: false },
    { label: "Parkinson's",             hr:  0.30, lo:  0.20, hi:  0.45, elevated: false },
  ];
  const W = 320, rowH = 16, padL = 108, padR = 20, padT = 8, padB = 20;
  const H = padT + hazards.length * rowH + padB;
  const chartW = W - padL - padR;
  const minX = 0, maxX = 16;
  const toX = v => padL + (v / maxX) * chartW;
  const elCol = '#c084fc', loCol = '#a8c4e0';
  const ticks = [0, 2, 4, 6, 8, 10, 12, 14, 16];

  const curves = [
    {
      title: 'Osteoporosis', wCol: '#e0a8c8', mCol: '#b8a8e0',
      wPts: [[-10,0.3],[-8,0.5],[-6,0.8],[-4,1.2],[-2,2.0],[0,4.5],[2,9],[4,14],[6,19],[8,23],[10,27]],
      mPts: [[-10,0.1],[-5,0.15],[0,0.2],[5,0.5],[10,1.0]],
    },
    {
      title: 'Rheumatoid arthritis', wCol: '#e0a8c8', mCol: '#b8a8e0',
      wPts: [[-10,0.05],[-5,0.1],[0,0.3],[2,0.5],[5,1.0],[10,1.75]],
      mPts: [[-10,0.02],[0,0.05],[5,0.12],[10,0.25]],
    },
    {
      title: 'Mental/Behavioral', wCol: '#e0a8c8', mCol: '#b8a8e0',
      wPts: [[-10,4],[-8,5],[-6,6],[-4,7],[-2,8.5],[0,11],[2,15],[4,21],[6,28],[8,35],[10,42]],
      mPts: [[-10,1.5],[-5,2.5],[0,4],[5,9],[10,17]],
    },
  ];
  const cW = 86, cH = 60, cPadL = 14, cPadB = 12, cPadT = 14;

  return (
    <div>
      <p className="text-xs text-[#9a8aaa] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
        Risk-adjusted hazard ratios vs. age-matched men after menopause onset
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ overflow: 'visible' }}>
        {ticks.map(v => {
          const x = toX(v);
          return (
            <g key={v}>
              <line x1={x} x2={x} y1={padT} y2={padT + hazards.length * rowH} stroke={v === 1 ? '#c4b8e0' : '#ede8f5'} strokeWidth={v === 1 ? 0.8 : 0.4} strokeDasharray={v === 1 ? '2 1.5' : undefined} />
              <text x={x} y={H - 4} textAnchor="middle" fontSize="5.5" fill="#b0a0c0" fontFamily="Inter, sans-serif">{v === 0 ? '' : v}</text>
            </g>
          );
        })}
        <line x1={toX(1)} x2={toX(1)} y1={padT} y2={padT + hazards.length * rowH} stroke="#9a8aaa" strokeWidth="0.8" strokeDasharray="2 1.5" />
        {hazards.map((h, i) => {
          const y = padT + i * rowH + rowH / 2;
          const col = h.elevated ? elCol : loCol;
          return (
            <g key={i}>
              <text x={padL - 4} y={y + 3} textAnchor="end" fontSize="6.5" fill="#5a4a6a" fontFamily="Inter, sans-serif">{h.label}</text>
              <line x1={toX(Math.max(h.lo, 0.01))} x2={toX(Math.min(h.hi, maxX))} y1={y} y2={y} stroke={col} strokeWidth="1" />
              <circle cx={toX(h.hr)} cy={y} r="2.5" fill={col} />
            </g>
          );
        })}
        <text x={padL + chartW / 2} y={H - 1} textAnchor="middle" fontSize="6" fill="#9a8aaa" fontFamily="Inter, sans-serif">risk-adjusted hazard ratio</text>
      </svg>

      <p className="text-xs text-[#9a8aaa] mt-4 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
        Cumulative prevalence: women vs. age-matched men (years from menopause onset)
      </p>
      <div className="flex gap-1">
        {curves.map((c) => {
          const innerW = cW - cPadL - 4, innerH = cH - cPadT - cPadB;
          const xs = c.wPts.map(p => p[0]), maxY = Math.max(...c.wPts.map(p => p[1]));
          const toXc = x => cPadL + ((x + 10) / 20) * innerW;
          const toYc = y => cPadT + innerH - (y / (maxY * 1.05)) * innerH;
          const wPath = c.wPts.map(([x,y]) => `${toXc(x)},${toYc(y)}`).join(' ');
          const mPath = c.mPts.map(([x,y]) => `${toXc(x)},${toYc(y)}`).join(' ');
          return (
            <div key={c.title} className="flex-1 min-w-0">
              <svg viewBox={`0 0 ${cW} ${cH}`} className="w-full h-auto block" style={{ overflow: 'visible' }}>
                <line x1={cPadL} x2={cW - 4} y1={cPadT} y2={cPadT} stroke="#ede8f5" strokeWidth="0.3" />
                <line x1={cPadL} x2={cW - 4} y1={cPadT + innerH} y2={cPadT + innerH} stroke="#d8d0e8" strokeWidth="0.4" />
                <line x1={toXc(0)} x2={toXc(0)} y1={cPadT} y2={cPadT + innerH} stroke="#c4b8e0" strokeWidth="0.6" strokeDasharray="1.5 1" />
                <polyline points={wPath} fill="none" stroke={c.wCol} strokeWidth="1.2" />
                <polyline points={mPath} fill="none" stroke={c.mCol} strokeWidth="1.2" strokeDasharray="2 1" />
                <text x={cPadL + innerW / 2} y={cPadT - 4} textAnchor="middle" fontSize="5.5" fill="#7a6a8a" fontFamily="Inter, sans-serif">{c.title}</text>
                <text x={cPadL - 2} y={cPadT + innerH + 9} fontSize="5" fill="#b0a0c0" fontFamily="Inter, sans-serif">-10</text>
                <text x={toXc(0)} y={cPadT + innerH + 9} textAnchor="middle" fontSize="5" fill="#b0a0c0" fontFamily="Inter, sans-serif">0</text>
                <text x={cW - 4} y={cPadT + innerH + 9} textAnchor="end" fontSize="5" fill="#b0a0c0" fontFamily="Inter, sans-serif">+10</text>
              </svg>
            </div>
          );
        })}
      </div>
      <div className="flex gap-4 mt-1">
        {[['Women', '#e0a8c8', ''], ['Age-matched men', '#b8a8e0', '3 2']].map(([label, col, dash]) => (
          <div key={label} className="flex items-center gap-1">
            <svg width="14" height="6"><line x1="0" y1="3" x2="14" y2="3" stroke={col} strokeWidth="1.5" strokeDasharray={dash || undefined} /></svg>
            <span style={{ fontSize: '0.6rem', color: '#9a8aaa', fontFamily: 'Inter, sans-serif' }}>{label}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-[#b8aac8] mt-1" style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic' }}>UCSF cohort, n = 33,444. Dashed vertical line = menopause onset.</p>
      <p className="text-xs text-[#b8aac8] mt-2" style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic' }}>Thakkar N, Patil R, Levy-Gantt R, Hswen Y, Agrawal M, Zou J, Chen IY. Characterization of menopause onset and associated disease risks using large-scale electronic health records. medRxiv. 2026.</p>
    </div>
  );
}

function SexMorbidityChart() {
  const bins = [
    { label: '18–29', male: 14.92, female: 20.88 },
    { label: '30–39', male: 20.76, female: 28.72 },
    { label: '40–49', male: 26.12, female: 35.05 },
    { label: '50–59', male: 33.19, female: 42.10 },
    { label: '60–69', male: 41.06, female: 48.76 },
    { label: '70–79', male: 46.70, female: 52.81 },
    { label: '80–89', male: 48.14, female: 53.78 },
    { label: '90–99', male: 48.28, female: 53.86 },
  ];
  const W = 320, H = 200, pad = { top: 16, right: 12, bottom: 30, left: 26 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;
  const groupW = chartW / bins.length;
  const barW = groupW * 0.32;
  const max = 60;
  const maleCol = '#b8a8e0', femaleCol = '#e0a8c8';
  const toY = v => pad.top + chartH - (v / max) * chartH;

  return (
    <div>
      <p className="text-xs text-[#9a8aaa] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
        Mean number of morbidities by age and sex
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ overflow: 'visible' }}>
        {[0, 20, 40, 60].map(v => (
          <g key={v}>
            <line x1={pad.left} x2={pad.left + chartW} y1={toY(v)} y2={toY(v)} stroke="#ede8f5" strokeWidth="0.5" />
            <text x={pad.left - 4} y={toY(v) + 3} textAnchor="end" fontSize="6.5" fill="#b0a0c0" fontFamily="Inter, sans-serif">{v}</text>
          </g>
        ))}
        {bins.map((b, i) => {
          const cx = pad.left + i * groupW + groupW / 2;
          return (
            <g key={b.label}>
              <rect x={cx - barW - 1} y={toY(b.male)} width={barW} height={pad.top + chartH - toY(b.male)} fill={maleCol} rx="1.5" />
              <rect x={cx + 1} y={toY(b.female)} width={barW} height={pad.top + chartH - toY(b.female)} fill={femaleCol} rx="1.5" />
              <text x={cx} y={pad.top + chartH + 10} textAnchor="middle" fontSize="6" fill="#9a8aaa" fontFamily="Inter, sans-serif">{b.label}</text>
            </g>
          );
        })}
        <line x1={pad.left} x2={pad.left} y1={pad.top} y2={pad.top + chartH} stroke="#d8d0e8" strokeWidth="0.5" />
        <text x={pad.left + chartW / 2} y={H - 2} textAnchor="middle" fontSize="6.5" fill="#9a8aaa" fontFamily="Inter, sans-serif">age interval (years)</text>
      </svg>
      <div className="flex gap-4 mt-1">
        {[['Male', maleCol], ['Female', femaleCol]].map(([label, col]) => (
          <div key={label} className="flex items-center gap-1">
            <svg width="10" height="10"><rect x="0" y="0" width="10" height="10" rx="2" fill={col} /></svg>
            <span style={{ fontSize: '0.6rem', color: '#9a8aaa', fontFamily: 'Inter, sans-serif' }}>{label}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-[#b8aac8] mt-1" style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic' }}>All of Us Research Program, n = 344,038. Differences significant at every age interval (p &lt; 0.01).</p>
      <p className="text-xs text-[#b8aac8] mt-2" style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic' }}>Pasumarthy SL, Brubaker L, Chen IY, Hswen Y. Sex-differences in Morbidity Burden. Preprint, 2026.</p>
    </div>
  );
}

// ─── RESEARCH ─────────────────────────────────────────────────────────────────

function ResearchPage() {
  return (
    <div className="relative pt-28 pb-24 max-w-6xl mx-auto px-6 overflow-hidden">
      <FloralBloom className="absolute -top-10 -right-20 w-[280px] h-[280px] opacity-25 pointer-events-none select-none" />
      <FloralBloom className="absolute top-[55%] -left-28 w-[240px] h-[240px] opacity-15 pointer-events-none select-none" />
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-widest text-purple-500 mb-4">Research</p>
        <h1 className="text-5xl font-semibold text-[#1e1030] mb-6 leading-tight max-w-2xl">Our Research</h1>
        <p className="text-xl text-[#5a4a6a] max-w-xl leading-relaxed">
          We use machine learning and real-world data to study menopause from angles that clinical research has largely missed.
        </p>
      </Reveal>

      <div className="mt-20 flex flex-col gap-20">
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-purple-400 mb-4">Theme 01</p>
              <h2 className="text-2xl font-semibold text-[#1e1030] mb-5 leading-tight">
                Menopause and social media
              </h2>
              <p className="text-[#5a4a6a] leading-relaxed mb-4">
                People talk about menopause online in ways they rarely do in a doctor's office. We look at those conversations to understand how symptoms get described in everyday language, what treatments people are seeking out, and what misinformation is spreading.
              </p>
              <p className="text-[#5a4a6a] leading-relaxed">
                It's messy data, but it captures something clinical records miss: what the experience actually feels like, in people's own words.
              </p>
            </div>
            <div className="bg-purple-50/50 rounded-xl border border-purple-100 p-8">
              <p className="text-sm font-semibold text-[#3d2a5a] mb-4">Some of the questions we ask</p>
              <ul className="flex flex-col gap-3">
                {[
                  'How do people describe symptoms online versus in clinical notes?',
                  'What misinformation about menopause treatment spreads on social media, and how far does it reach?',
                  'Do online conversations look different across demographic groups?',
                  'What needs show up in social data that health systems are not addressing?',
                ].map((q, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[#5a4a6a]">
                    <span className="mt-2 w-1 h-1 rounded-full bg-purple-300 flex-shrink-0" />
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        <PetalDivider />

        <Reveal>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-rose-400 mb-4">Theme 02</p>
            <h2 className="text-2xl font-semibold text-[#1e1030] mb-5 leading-tight">
              Conditions co-occurring with menopause
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
              <div>
                <p className="text-[#5a4a6a] leading-relaxed mb-4">
                  Menopause marks a turning point, not just a biological event. In this work, we ask how disease trajectories in women diverge from those of age-matched men in the years around menopause onset, using EHR data from two demographically distinct health systems: UCSF Health (n = 33,444) and the San Francisco Department of Public Health safety-net hospitals (n = 7,041), one of the most racially and socioeconomically diverse menopause cohorts in the literature.
                </p>
                <p className="text-[#5a4a6a] leading-relaxed mb-4">
                  We apply an ICD-10 phenotyping algorithm to identify menopause onset, then use a two-stage NLP pipeline to extract symptom burden from unstructured clinical notes across 13 categories. Despite an estimated population prevalence of 90%, only 38.8% of patients had any documented menopause symptom in structured EHR fields, suggesting widespread underdocumentation.
                </p>
                <p className="text-[#5a4a6a] leading-relaxed mb-4">
                  Women showed substantially elevated risk for osteoporosis (HR 12.40), rheumatoid arthritis (HR 2.43), and mental and behavioral disorders (HR 2.38) relative to age-matched men, with divergence beginning near the time of menopause onset. We also find that adverse pregnancy outcomes predict earlier menopause, with a significant dose-response relationship: women with 2 or more obstetric complications reached menopause about 1.3 years earlier than women with none.
                </p>
                <a href="https://www.medrxiv.org/content/10.64898/2026.05.08.26352769v1.full.pdf"
                  target="_blank" rel="noopener noreferrer"
                  className="text-sm text-purple-500 font-medium hover:text-purple-700 transition-colors">
                  Preprint (medRxiv) &rarr;
                </a>
              </div>
              <div className="pt-2">
                <DiseaseTrajectoryFig />
              </div>
            </div>

            <div className="mt-14 pt-10 border-t border-purple-100">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#9a8aaa] mb-4">Related work</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                <div>
                  <p className="text-sm text-[#7a6a8a] leading-relaxed mb-3">
                    In a separate study using the All of Us Research Program (n = 344,038), we found that women carry a significantly higher morbidity burden than men across every age group from 18 to 125 years (differences of 5.6–8.9 conditions, p &lt; 0.01). The gap was widest in midlife, ages 40–49, when women averaged 8.93 more morbidities than men — coinciding with the perimenopausal and menopausal transitions, and persisting, though narrowing, into older age.
                  </p>
                  <a href="/papers/sex-differences-morbidity-burden.pdf"
                    target="_blank" rel="noopener noreferrer"
                    className="text-sm text-purple-500 font-medium hover:text-purple-700 transition-colors">
                    Preprint &rarr;
                  </a>
                </div>
                <div className="pt-2">
                  <SexMorbidityChart />
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <PetalDivider />

        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-fuchsia-400 mb-4">Theme 03</p>
              <h2 className="text-2xl font-semibold text-[#1e1030] mb-5 leading-tight">
                Menopause across populations
              </h2>
              <p className="text-[#5a4a6a] leading-relaxed mb-4">
                We study how race, ethnicity, and socioeconomic factors shape when menopause begins, and how much of that variation reflects true biological differences versus the conditions people live in. Most prior estimates of menopause onset come from studies conducted over two decades ago with limited sample diversity we use All of Us to update those estimates with a much larger, more representative cohort.
              </p>
              <p className="text-[#5a4a6a] leading-relaxed mb-4">
                In a broad descriptive study (n = 37,548 with menopause-related EHR diagnoses, from 861,000 All of Us participants), we found that menopause onset timing varied significantly by ethnicity (p = 1e-21). Hispanic women had the earliest average onset (50.3 years), followed by Indigenous/Other (50.5), Asian & Pacific Islander (51.0), and Non-Hispanic White women (51.4). The pattern highlights greater racial and ethnic heterogeneity than many earlier studies reported.
              </p>
              <p className="text-[#5a4a6a] leading-relaxed mb-4">
                In a second, more methodologically rigorous study (n = 11,306), we used three progressively refined cohort definitions, adjusting for neighborhood deprivation, smoking, and alcohol use, and excluding surgically menopausal individuals, to test how robust these patterns are. Asian &amp; Pacific Islander individuals experienced onset about 2 years earlier than White individuals (p &lt; 0.001) and Indigenous/Other individuals about 1.4 years earlier (p &lt; 0.001) across all cohort definitions. The Black-White gap attenuated after covariate adjustment, suggesting socioeconomic and behavioral factors explain much of that difference. Current smoking was the only behavioral predictor that remained significant across models (~1.1 years earlier onset).
              </p>
              <a href="/papers/heterogeneity-race-ethnicity-menopause-onset.pdf"
                target="_blank" rel="noopener noreferrer"
                className="text-sm text-purple-500 font-medium hover:text-purple-700 transition-colors">
                Preprint &rarr;
              </a>
            </div>
            <div className="pt-2 flex flex-col gap-2">
              <ForestPlot />
              <CumulativeIncidenceChart />
              <p className="text-xs text-[#b8aac8] mt-1" style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic' }}>Pasumarthy S, Hurley M, Chen IY, Thakkar N, Agrawal M, Hswen Y. Heterogeneity across race and ethnicity for menopause onset. Preprint, 2026.</p>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

// ─── PEOPLE ───────────────────────────────────────────────────────────────────

function PersonCard({ person }) {
  return (
    <div className="bg-white rounded-2xl border border-purple-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {person.photo ? (
        <div className="relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
          <img
            src={person.photo}
            alt={person.name}
            className="w-full h-full object-cover object-top"
          />
        </div>
      ) : (
        <div className={`w-full bg-gradient-to-br ${person.gradient} flex items-center justify-center font-bold text-white text-2xl`} style={{ aspectRatio: '3/4' }}>
          {person.initials}
        </div>
      )}
      <div className="px-4 py-3">
        <p className="font-bold text-[#1e1030] text-sm">{person.name}</p>
        <p className="text-xs text-[#9a8aaa] mt-0.5">{person.affiliation}</p>
      </div>
    </div>
  );
}

function PeoplePage() {
  return (
    <div className="relative pt-28 pb-24 max-w-6xl mx-auto px-6 overflow-hidden">
      <FloralBloom className="absolute -top-12 -right-16 w-[260px] h-[260px] opacity-25 pointer-events-none select-none" />
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-widest text-purple-500 mb-4">People</p>
        <h1 className="text-5xl font-semibold text-[#1e1030] mb-12 leading-tight">The team</h1>
      </Reveal>

      <div className="mb-16">
        <Reveal>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#9a8aaa] mb-6">Faculty</h2>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FACULTY.map((p, i) => (
            <Reveal key={i} delay={i * 80}>
              <PersonCard person={p} />
            </Reveal>
          ))}
        </div>
      </div>

      <div className="pt-4"><PetalDivider /></div>
      <div className="pt-8">
        <Reveal>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#9a8aaa] mb-6">Students</h2>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STUDENTS.map((p, i) => (
            <Reveal key={i} delay={i * 60}>
              <PersonCard person={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── NEWS ─────────────────────────────────────────────────────────────────────

function NewsPage() {
  return (
    <div className="relative pt-28 pb-24 max-w-6xl mx-auto px-6 overflow-hidden">
      <FloralBloom className="absolute -top-12 -right-16 w-[240px] h-[240px] opacity-20 pointer-events-none select-none" />
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-widest text-purple-500 mb-4">News</p>
        <h1 className="text-5xl font-semibold text-[#1e1030] mb-16 leading-tight">Menopause In the News</h1>
      </Reveal>

      <div className="flex flex-col divide-y divide-purple-100">
        {NEWS.map((item, i) => (
          <Reveal key={item.id} delay={i * 60}>
            <a href={item.url} target="_blank" rel="noreferrer"
              className="group py-8 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-start hover:bg-purple-50/40 -mx-4 px-4 rounded-xl transition-colors">
              <div>
                <p className="text-xs text-[#9a8aaa] mb-2">{item.source} · {item.date}</p>
                <h3 className="text-lg font-semibold text-[#1e1030] group-hover:text-purple-700 leading-snug mb-3 transition-colors">{item.title}</h3>
                <p className="text-sm text-[#5a4a6a] leading-relaxed max-w-2xl">{item.summary}</p>
              </div>
              <ExternalLink size={15} className="text-purple-200 group-hover:text-purple-500 flex-shrink-0 mt-1 transition-colors" />
            </a>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

// ─── CONTACT ──────────────────────────────────────────────────────────────────

function ContactPage() {
  return (
    <div className="relative pt-28 pb-24 max-w-6xl mx-auto px-6 overflow-hidden">
      <FloralBloom className="absolute -top-16 -right-20 w-[300px] h-[300px] opacity-25 pointer-events-none select-none" />
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-widest text-purple-500 mb-4">Contact</p>
        <h1 className="text-5xl font-semibold text-[#1e1030] mb-6 leading-tight max-w-xl">Get in touch</h1>
        <p className="text-xl text-[#5a4a6a] max-w-md leading-relaxed mb-16">
          We are always looking for collaborators, dataset contributors, and people who want to help make this work better.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <Reveal>
          <div>
            <h2 className="text-xl font-semibold text-[#1e1030] mb-3">Reach out</h2>
            <p className="text-[#5a4a6a] text-sm leading-relaxed mb-6">
              Questions about our work, interest in collaborating, or just want to connect? Reach out to us directly.
            </p>
            <a href="mailto:iychen@berkeley.edu"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-rose-400 hover:from-purple-700 hover:to-rose-500 text-white font-medium px-6 py-2.5 rounded-full text-sm transition-all shadow-sm">
              <Mail size={14} /> iychen@berkeley.edu
            </a>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div>
            <h2 className="text-xl font-semibold text-[#1e1030] mb-3">Who we work with</h2>
            <p className="text-[#5a4a6a] text-sm leading-relaxed">
              We welcome collaborators across disciplines clinicians who want to bring research questions from the bedside, researchers with complementary datasets or methods, and funders interested in supporting rigorous, equity-focused work on women's health. If any of that sounds like you, we'd love to hear from you.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const pages = {
    home:     <HomePage setCurrentPage={setCurrentPage} />,
    about:    <AboutPage setCurrentPage={setCurrentPage} />,
    research: <ResearchPage />,
    people:   <PeoplePage />,
    news:     <NewsPage />,
    contact:  <ContactPage />,
  };

  return (
    <div className="min-h-screen bg-[#fdfbff] text-[#1e1030]">
      <Nav currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main>{pages[currentPage] ?? pages.home}</main>
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}

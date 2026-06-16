import { useState, useEffect, useRef } from 'react';
import {
  Search, ArrowRight, Github, Mail, Send, ExternalLink,
  Menu, X, ArrowUpRight, ChevronDown, ChevronUp,
} from 'lucide-react';

// ─── DATA ─────────────────────────────────────────────────────────────────────

const AREAS = [
  {
    id: 'onset',
    name: 'Onset & Timing Prediction',
    short: 'Forecasting perimenopause and natural menopause onset from biomarkers, AMH trajectories, and wearable sensor streams.',
    overview:
      'Machine learning models can identify perimenopausal signatures in hormonal and physiological data years before clinical menopause, enabling earlier intervention and individualized planning. This area covers anti-Müllerian hormone (AMH) trajectory modeling, wearable-derived phenotyping, and multi-omics integration for onset prediction.',
    challenges: [
      'Distinguishing perimenopause from other hormonal conditions in noisy ambulatory sensor data',
      'Building models that generalize across racial and ethnic groups with biologically different onset norms',
      'Integrating sparse hormonal lab values with dense continuous sensor streams without data leakage',
    ],
    papers: ['Reeves et al. 2023', 'Lin & Zhao 2022', 'Moradi et al. 2024'],
  },
  {
    id: 'symptoms',
    name: 'Symptom Monitoring & Phenotyping',
    short: 'Objectively characterizing hot flashes, sleep disruption, mood variability, and cognitive change from continuous physiological data.',
    overview:
      'Menopause symptoms are heterogeneous, intermittent, and chronically under-reported in clinical settings. AI methods applied to actigraphy, skin conductance, and EHR data build high-resolution symptom phenotypes that support precision care and valid endpoints for clinical trials without requiring patients to self-report in real time.',
    challenges: [
      'Objective detection of hot flashes from consumer-grade wearables without dedicated sternal sensors',
      'Separating aging-related physiological changes from menopause-specific symptom trajectories',
      'Constructing cross-culturally valid symptom phenotypes applicable across diverse populations',
    ],
    papers: ['Thurston et al. 2022', 'Gao & Chen 2023', 'Whitfield et al. 2024'],
  },
  {
    id: 'risk',
    name: 'Risk Prediction for Downstream Conditions',
    short: 'Estimating post-menopausal cardiovascular, bone, and metabolic risk using peri-transition biomarkers and longitudinal EHR features.',
    overview:
      'The menopause transition is a critical window for cardiovascular, osteoporotic, and metabolic risk stratification. Predictive models trained on peri-transition hormonal, imaging, and EHR features can outperform traditional risk scores — particularly for women with surgical menopause before age 45 — and support earlier preventive action.',
    challenges: [
      'Distinguishing causal pathways from association in observational menopause cohorts with selection bias',
      'Handling competing risks and censoring when women develop multiple downstream conditions simultaneously',
      'Temporal modeling of risk trajectories that shift continuously across the full menopause transition',
    ],
    papers: ['Matthews et al. 2023', 'Zhao & Rivera 2022', 'Park et al. 2024'],
  },
  {
    id: 'treatment',
    name: 'Treatment Personalization & CDS',
    short: 'Matching individual women to evidence-based therapies via individualized risk-benefit modeling and NLP-powered decision support at point of care.',
    overview:
      "Hormone therapy (HT) initiation is among the most individualized decisions in women's health. ML models integrating cardiovascular risk, mammographic density, BRCA status, and symptom burden can help clinicians navigate this decision. Clinical decision support (CDS) tools using NLP can surface guideline-concordant recommendations directly within the EHR workflow.",
    challenges: [
      'Reliably integrating contraindication data across heterogeneous EHR schemas from different health systems',
      'Avoiding automation bias when surfacing AI recommendations to clinicians under time pressure',
      'Evaluating CDS tools in pragmatic trials with real-world prescribing outcomes as endpoints',
    ],
    papers: ['Torres et al. 2024', 'Gupta & Kim 2023', 'Strickler et al. 2022'],
  },
  {
    id: 'disparities',
    name: 'Disparities & Equity',
    short: 'Identifying and correcting AI-amplified inequities in menopause care access, model performance, and clinical outcomes across race and ethnicity.',
    overview:
      'Black, Latina, and Asian women experience menopause differently — earlier onset, greater vasomotor burden, lower treatment rates — yet are underrepresented in training data for most menopause AI models. This area covers algorithmic fairness auditing, disaggregated performance reporting, equity-aware model design, and representative dataset construction.',
    challenges: [
      'Quantifying and mitigating performance gaps across race and ethnicity in menopause NLP pipelines',
      'Building representative training sets when landmark cohorts (SWAN, WHI) are predominantly white',
      'Designing equity-aware evaluation metrics that respect biologically real differences in onset timing',
    ],
    papers: ['Sims et al. 2023', 'Perez-Lopez & Navarro 2024', 'Woods et al. 2022'],
  },
  {
    id: 'social',
    name: 'Social Media & Online Discourse',
    short: 'Mining how people talk about menopause on Reddit, Twitter/X, and health forums to understand lived experience, information gaps, and unmet needs at scale.',
    overview:
      'Social media platforms host candid, real-time conversations about menopause that clinical data rarely captures. NLP methods applied to these sources reveal how people describe symptoms in their own words, which treatments they seek out, what misinformation circulates, and how experiences differ by community. This area covers platform-specific NLP, topic modeling, sentiment analysis, and the ethical challenges of working with user-generated health data.',
    challenges: [
      'Linking online self-reports to verified health outcomes without compromising user privacy',
      'Distinguishing misinformation from emerging lay knowledge in menopause-related health discussions',
      'Accounting for platform selection bias — who posts about menopause online vs. who does not',
    ],
    papers: ['Jacobson et al. 2024', 'Cohen & Lin 2023'],
  },
  {
    id: 'comorbidities',
    name: 'Comorbidities & Co-occurring Conditions',
    short: 'Understanding the clustering of conditions that emerge during and after the menopause transition, from cardiovascular disease and depression to thyroid disorders and autoimmune conditions.',
    overview:
      'Menopause rarely arrives alone. Depression, cardiovascular disease, metabolic syndrome, thyroid dysfunction, and autoimmune conditions all spike in prevalence during or shortly after the transition. AI methods applied to large EHR and claims datasets can surface which comorbidity clusters are most common, identify early warning patterns, and test whether menopause timing is a causal factor in downstream diagnosis rates.',
    challenges: [
      'Separating aging-related comorbidity accumulation from menopause-specific risk trajectories',
      'Building temporally resolved comorbidity graphs from claims data with inconsistent coding practices',
      'Identifying direction of causality when menopause and comorbidities co-occur in cross-sectional data',
    ],
    papers: ['Matthews et al. 2023', 'Park et al. 2024'],
  },
  {
    id: 'nlp',
    name: 'LLMs & NLP',
    short: 'Extracting menopause phenotypes from unstructured clinical notes at scale and deploying patient-facing AI for education and shared decision-making.',
    overview:
      'Menopause is chronically under-coded in structured EHR fields — yet clinicians document symptoms, HRT history, and surgical menopause extensively in free text. Large language models extract these phenotypes with high recall, unlocking retrospective cohorts orders of magnitude larger than what structured data alone can provide.',
    challenges: [
      'Hallucination risk and misinformation in patient-facing LLMs providing menopause health guidance',
      'NLP phenotyping accuracy for surgical versus natural menopause across diverse clinical note styles',
      'Consent, liability, and clinical governance frameworks for AI-assisted menopause counseling tools',
    ],
    papers: ['Jacobson et al. 2024', 'Cohen & Lin 2023', 'Menon et al. 2024'],
  },
];

const PAPERS_DATA = [
  {
    id: 1,
    title: 'Predicting Age at Natural Menopause from Longitudinal Wearable Sensor Data Using Gradient Boosting',
    authors: 'Reeves ML, Kim JY, Patel SR, Hoffman E',
    year: 2023,
    journal: 'npj Digital Medicine',
    summary:
      'A gradient boosting model trained on 4 years of continuous heart rate, HRV, and sleep staging data predicts age at natural menopause with an 18-month lead time. Validated across 12,000 All of Us participants; AUC 0.84 with consistent performance across Black, Latina, and white subgroups.',
    area: 'Onset & Timing Prediction',
    method: 'XGBoost',
    dataType: 'Wearable / EHR',
    hasCode: true,
  },
  {
    id: 2,
    title: 'Objective Hot Flash Detection from Wrist-Worn Accelerometry and Skin Temperature via Deep Learning',
    authors: 'Gao L, Chen MR, Thurston RC',
    year: 2023,
    journal: 'Menopause',
    summary:
      'A bidirectional LSTM trained on ambulatory physiological signals detects hot flashes with 91% sensitivity and 87% specificity, outperforming sternal conductance sensors. Consumer-grade smartwatches served as the sole data source.',
    area: 'Symptom Monitoring & Phenotyping',
    method: 'BiLSTM',
    dataType: 'Wearable',
    hasCode: false,
  },
  {
    id: 3,
    title: 'Cardiovascular Risk Stratification at the Menopause Transition Using Multi-Modal EHR Features',
    authors: 'Matthews KA, Park J, Rivera CR, Zhao XY',
    year: 2023,
    journal: 'JAMA Cardiology',
    summary:
      'Integrating hormonal trajectories, lipid panels, and imaging features from the SWAN cohort, a penalized Cox model improves 10-year ASCVD risk prediction over Pooled Cohort Equations in perimenopausal women. Gains are largest in women with surgical menopause before age 45.',
    area: 'Risk Prediction for Downstream Conditions',
    method: 'Penalized Cox / Elastic Net',
    dataType: 'Cohort (SWAN)',
    hasCode: false,
  },
  {
    id: 4,
    title: 'NLP Extraction of Menopause Status and Hormone Therapy History from Clinical Notes at Scale',
    authors: 'Jacobson R, Martinez F, Cohen DA, Lin SY',
    year: 2024,
    journal: 'JAMIA',
    summary:
      'Fine-tuned ClinicalBERT achieves F1 0.91 for menopause status classification across an 8-hospital EHR corpus, outperforming ICD-10 code-based approaches. The pipeline recovers 3.4× more cases than structured data alone.',
    area: 'LLMs & NLP',
    method: 'ClinicalBERT',
    dataType: 'EHR / Clinical Notes',
    hasCode: true,
  },
  {
    id: 5,
    title: 'Racial and Ethnic Disparities in Menopause AI Model Performance: A Systematic Audit of 14 Models',
    authors: 'Sims M, Perez-Lopez FR, Woods NF, Johnson TM',
    year: 2023,
    journal: 'The Lancet Digital Health',
    summary:
      'Auditing 14 published menopause prediction models across 6 public datasets, AUC for Black women lags white women by an average of 0.07 — driven primarily by underrepresentation in training data. Introduces an open-source fairness scorecard and auditing toolkit.',
    area: 'Disparities & Equity',
    method: 'Fairness Auditing',
    dataType: 'Multi-cohort',
    hasCode: true,
  },
  {
    id: 6,
    title: 'Personalized Hormone Therapy Initiation via Individual Causal Effect Estimation in UK Biobank',
    authors: 'Torres A, Gupta R, Kim E, Strickler H',
    year: 2024,
    journal: 'Nature Medicine',
    summary:
      'A causal forest model estimates individualized treatment effects of hormone therapy on symptom burden and cardiovascular endpoints in UK Biobank. Women with the highest predicted benefit are 2.8× more likely to be currently undertreated.',
    area: 'Treatment Personalization & CDS',
    method: 'Causal Forest',
    dataType: 'UK Biobank',
    hasCode: false,
  },
  {
    id: 7,
    title: 'Menopausal Symptom Phenotyping via Variational Autoencoders Applied to 15-Year EHR Trajectories',
    authors: 'Whitfield RL, Huang SJ, Chen L, Moradi M',
    year: 2024,
    journal: 'Cell Reports Medicine',
    summary:
      'Applying variational autoencoders to longitudinal EHR records of 28,000 women identifies five distinct menopause symptom phenotypes with differential cardiometabolic risk profiles. Cluster assignment outperforms vasomotor symptom count as a prognostic stratifier.',
    area: 'Symptom Monitoring & Phenotyping',
    method: 'VAE / Clustering',
    dataType: 'EHR (All of Us)',
    hasCode: false,
  },
  {
    id: 8,
    title: 'LLM-Powered Shared Decision-Making Support for Menopause Treatment: A Pilot Randomized Trial',
    authors: 'Menon U, Cohen AB, Singh P, Hartley J',
    year: 2024,
    journal: 'NEJM Evidence',
    summary:
      'A GPT-4-based conversational decision aid for menopause treatment, tested in a 200-patient RCT, improves decision quality scores and reduces decisional conflict versus standard patient education.',
    area: 'LLMs & NLP',
    method: 'GPT-4 / RLHF Fine-tuning',
    dataType: 'Clinical Trial',
    hasCode: false,
  },
  {
    id: 9,
    title: 'Hierarchical Bayesian Modeling of Anti-Müllerian Hormone Trajectories for Perimenopause Onset Prediction',
    authors: 'Lin H, Zhao W, Anderson SJ',
    year: 2022,
    journal: 'Human Reproduction',
    summary:
      'A hierarchical Bayesian model of longitudinal AMH measurements across the SWAN cohort predicts perimenopause onset 3 years in advance with calibrated uncertainty estimates. Ethnicity-specific AMH decline priors improve calibration for non-white subgroups.',
    area: 'Onset & Timing Prediction',
    method: 'Hierarchical Bayes',
    dataType: 'Cohort (SWAN)',
    hasCode: false,
  },
  {
    id: 10,
    title: 'Predicting Rapid Bone Mineral Density Decline at Menopause from Polygenic Scores and Clinical Features',
    authors: 'Park SH, Zhao XY, Kim WJ, Matthews KA',
    year: 2024,
    journal: 'Osteoporosis International',
    summary:
      'A random forest integrating polygenic risk scores, menopausal hormone levels, and DXA baseline measures predicts rapid bone loss (>3%/year) with AUC 0.82 in UK Biobank. Enables targeted bisphosphonate referral pathways ahead of DXA surveillance intervals.',
    area: 'Risk Prediction for Downstream Conditions',
    method: 'Random Forest',
    dataType: 'UK Biobank / Genomic',
    hasCode: true,
  },
];

const DATASETS = [
  {
    name: 'All of Us Research Program',
    description:
      "NIH longitudinal cohort with EHR, whole-genome sequencing, Fitbit, and survey data — intentionally oversampling populations underrepresented in biomedical research.",
    scale: '750K+ participants',
    access: 'Application Required',
    demographics: '45% racial/ethnic minorities, 75% non-white or low-income',
  },
  {
    name: 'UK Biobank',
    description:
      'Large UK prospective cohort with brain/body imaging, whole exome sequencing, accelerometry, and decades of linked health records.',
    scale: '500K participants',
    access: 'Application Required',
    demographics: 'Predominantly white British; diversity refreshes ongoing',
  },
  {
    name: 'NHANES',
    description:
      'National Health and Nutrition Examination Survey — cross-sectional annual surveys with hormonal assays, physical exams, dietary recall, and DXA imaging since 1960.',
    scale: '5K–10K per 2-year cycle',
    access: 'Open',
    demographics: 'US-representative with deliberate oversampling of Black, Hispanic, and older adults',
  },
  {
    name: 'SWAN',
    description:
      "Study of Women's Health Across the Nation — 28 years tracking 3,302 women through the full menopause transition across 7 US clinical sites.",
    scale: '3,302 participants · 28 years',
    access: 'Application Required',
    demographics: 'Black, Chinese-American, Japanese-American, and white communities',
  },
  {
    name: 'Multiethnic Cohort (MEC)',
    description:
      'Hawaii and California-based cohort with rich racial and ethnic diversity and long-term cancer, cardiovascular, and chronic disease outcomes data.',
    scale: '215K participants',
    access: 'Application Required',
    demographics: 'Latino, Japanese-American, Native Hawaiian, African-American, and white adults',
  },
  {
    name: 'REGARDS',
    description:
      'REasons for Geographic and Racial Differences in Stroke — longitudinal cohort focused on cardiovascular disparities in Black and white adults aged 45+.',
    scale: '30K participants',
    access: 'Application Required',
    demographics: '45% Black; geographic oversampling of the Stroke Belt',
  },
];

const TOOLS = [
  {
    name: 'MenoPredict',
    description:
      'Python library for training and evaluating menopause onset prediction models. Includes standardized preprocessing pipelines for SWAN and All of Us data formats, benchmark splits, and fairness evaluation utilities.',
  },
  {
    name: 'HotFlashNet',
    description:
      'Deep learning toolkit for objective hot flash detection from wrist-worn accelerometry and skin temperature signals. Ships pre-trained BiLSTM weights for Fitbit Sense and Apple Watch Series 9.',
  },
  {
    name: 'MenoNLP',
    description:
      'Fine-tuned clinical NLP models for menopause phenotyping from EHR notes. Includes ClinicalBERT and Llama-3-8B-based models for menopause status, HRT history, and vasomotor symptom extraction.',
  },
  {
    name: 'MenoFair Audit Toolkit',
    description:
      'Reproducible fairness auditing toolkit implementing the disparities scorecard from Sims et al. 2023. Supports disaggregated evaluation by race, ethnicity, age at onset, and insurance status.',
  },
];

const BLOG_POSTS = [
  {
    id: 1,
    title: 'Memory Decline After Menopause Linked to Loss of Estrogen in Brain Tissue',
    type: 'In the News',
    date: 'May 2026',
    source: 'Northwestern Medicine',
    url: 'https://news.northwestern.edu/stories/2026/05/memory-decline-after-menopause-linked-to-loss-of-estrogen-production-in-brain-tissue',
    summary:
      'A preclinical study from Northwestern found that aging females uniquely depend on brain estrogen for memory protection. The findings may help explain why nearly two-thirds of Alzheimer\'s cases occur in women.',
  },
  {
    id: 2,
    title: 'Antihistamines for Perimenopause? Fact vs. Fiction on a Viral Trend',
    type: 'In the News',
    date: '2026',
    source: 'The Cut',
    url: 'https://www.thecut.com/article/antihistamines-pepcid-ac-perimenopause-pmdd-fact-fiction.html',
    summary:
      'Pepcid AC and other antihistamines have been circulating on social media as a perimenopause remedy. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.',
  },
  {
    id: 3,
    title: 'Menopause Is a Glitch in the Simulation',
    type: 'In the News',
    date: '2026',
    source: 'Substack',
    url: 'https://hukmanimansi.substack.com/p/menopause-is-a-glitch-in-the-simulation',
    summary:
      'An essay arguing that menopause is an evolutionary holdover that no longer serves women, and asking what medicine could do if we actually tried to change that. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    id: 4,
    title: "Women's Health Research Has a Data Problem",
    type: 'In the News',
    date: 'April 2026',
    source: 'The New York Times',
    url: 'https://www.nytimes.com/athletic/7052000/2026/04/10/womens-performance-health-research-challenges-and-future/',
    summary:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
  },
  {
    id: 5,
    title: 'The Menopause Symptom You Might Not Recognize',
    type: 'In the News',
    date: 'December 2025',
    source: 'The New York Times',
    url: 'https://www.nytimes.com/2025/12/10/well/menopause-symptoms.html',
    summary:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
  },
];

// ─── ARXIV ────────────────────────────────────────────────────────────────────

async function fetchArxiv(query) {
  const terms = query.trim().split(/\s+/).filter(Boolean);
  const arxivQ = terms.map(t => `all:${t}`).join(' AND ');
  const url = `/arxiv/api/query?search_query=${encodeURIComponent(arxivQ)}&sortBy=submittedDate&sortOrder=descending&max_results=15`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`ArXiv API returned ${res.status}`);
  const text = await res.text();
  const doc = new DOMParser().parseFromString(text, 'application/xml');
  if (doc.querySelector('parsererror')) throw new Error('Failed to parse ArXiv response');
  return [...doc.querySelectorAll('entry')].map(e => ({
    id: e.querySelector('id')?.textContent?.trim(),
    title: e.querySelector('title')?.textContent?.replace(/\s+/g, ' ').trim(),
    authors: [...e.querySelectorAll('author name')].map(a => a.textContent.trim()).slice(0, 5).join(', '),
    summary: e.querySelector('summary')?.textContent?.replace(/\s+/g, ' ').trim(),
    published: e.querySelector('published')?.textContent?.slice(0, 10),
    categories: [...e.querySelectorAll('category')].map(c => c.getAttribute('term')).filter(Boolean).slice(0, 3).join(' · '),
    link: e.querySelector('id')?.textContent?.trim(),
  }));
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
      transform: visible ? 'none' : 'translateY(24px)',
      transition: `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

function CountUp({ end }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const steps = 55;
        let step = 0;
        const id = setInterval(() => {
          step++;
          const progress = step / steps;
          const eased = 1 - Math.pow(1 - progress, 3);
          setVal(Math.round(end * eased));
          if (step >= steps) { setVal(end); clearInterval(id); }
        }, 1800 / steps);
        obs.disconnect();
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [end]);
  return <span ref={ref}>{val}</span>;
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

const TAG_VARIANTS = {
  area:     'bg-violet-50 text-violet-700 border border-violet-200',
  method:   'bg-amber-50 text-amber-700 border border-amber-200',
  data:     'bg-slate-100 text-slate-600 border border-slate-200',
  code:     'bg-emerald-50 text-emerald-700 border border-emerald-200',
  postType: 'bg-sky-50 text-sky-700 border border-sky-200',
  default:  'bg-slate-100 text-slate-600 border border-slate-200',
};

function Tag({ label, variant = 'default' }) {
  const cls = TAG_VARIANTS[variant] || TAG_VARIANTS.default;
  return (
    <span className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${cls}`}>
      {label}
    </span>
  );
}

function AccessBadge({ type }) {
  const map = {
    Open: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    'Application Required': 'bg-amber-50 text-amber-700 border border-amber-200',
    Restricted: 'bg-red-50 text-red-700 border border-red-200',
  };
  return (
    <span className={`inline-flex text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${map[type] || map['Application Required']}`}>
      {type}
    </span>
  );
}

function SectionEyebrow({ children, light = false }) {
  return (
    <p className={`text-xs font-bold uppercase tracking-[0.18em] mb-3 ${light ? 'text-violet-300' : 'text-violet-600'}`}>
      {children}
    </p>
  );
}

function PageHeader({ eyebrow, title, desc }) {
  return (
    <div className="pt-16 relative bg-slate-50 border-b border-slate-200 overflow-hidden">
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-violet-200/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-56 h-56 rounded-full bg-rose-200/20 blur-3xl pointer-events-none" />
      <div className="line-grid absolute inset-0 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-6 py-14">
        <SectionEyebrow>{eyebrow}</SectionEyebrow>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-3">{title}</h1>
        {desc && <p className="text-base text-slate-500 max-w-xl leading-relaxed">{desc}</p>}
      </div>
    </div>
  );
}

function PaperCard({ paper }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col gap-3 card-lift h-full">
      <div className="flex flex-wrap gap-1.5">
        <Tag label={paper.area} variant="area" />
        <Tag label={paper.method} variant="method" />
        <Tag label={paper.dataType} variant="data" />
        {paper.hasCode && <Tag label="Code Available" variant="code" />}
      </div>
      <h3 className="text-sm font-bold text-slate-900 leading-snug">{paper.title}</h3>
      <p className="text-xs text-slate-500">{paper.authors} · <em>{paper.journal}</em> · {paper.year}</p>
      <p className="text-sm text-slate-600 leading-relaxed flex-1">{paper.summary}</p>
      <button className="mt-auto text-sm text-violet-600 font-semibold hover:text-violet-800 transition-colors text-left flex items-center gap-1">
        Read paper <ArrowUpRight size={13} />
      </button>
    </div>
  );
}

// ─── NAVIGATION ───────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'areas', label: 'Research Areas' },
  { id: 'papers', label: 'Papers' },
  { id: 'data', label: 'Data & Tools' },
  { id: 'blog', label: 'Blog' },
  { id: 'involved', label: 'Get Involved' },
];

function Nav({ currentPage, setCurrentPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const onHero = currentPage === 'home';
  const transparent = onHero && !scrolled;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 72);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      transparent
        ? 'bg-white/80 backdrop-blur-md border-b border-slate-200/60'
        : 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => { setCurrentPage('home'); setOpen(false); }}
            className="text-base font-black tracking-tight text-slate-900 transition-colors"
          >
            Menopause<span className="text-violet-500">AI</span>
          </button>

          <div className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map(link => (
              <button
                key={link.id}
                onClick={() => setCurrentPage(link.id)}
                className={`text-sm px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentPage === link.id
                    ? 'text-violet-600 bg-violet-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <button
            className="md:hidden p-2 rounded-lg transition-colors text-slate-700 hover:bg-slate-100"
            onClick={() => setOpen(o => !o)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white/98 backdrop-blur-md border-t border-slate-100 shadow-lg">
          {NAV_LINKS.map(link => (
            <button
              key={link.id}
              onClick={() => { setCurrentPage(link.id); setOpen(false); }}
              className={`block w-full text-left px-6 py-4 text-sm font-medium border-b border-slate-100 transition-colors ${
                currentPage === link.id ? 'text-violet-600 bg-violet-50' : 'text-slate-700 hover:bg-slate-50'
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
    <footer className="bg-ink text-slate-400">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <p className="font-black text-white text-lg mb-3 tracking-tight">
              Menopause<span className="text-violet-400">AI</span>
            </p>
            <p className="text-sm leading-relaxed max-w-xs text-slate-400">
              An open research commons advancing AI and ML applied to menopause science — with equity at the center.
            </p>
            <div className="flex gap-5 mt-5">
              {['GitHub', 'Twitter/X', 'LinkedIn'].map(s => (
                <a key={s} href="#" className="text-sm text-slate-500 hover:text-violet-400 transition-colors">{s}</a>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-400 mb-4">Explore</p>
            <div className="flex flex-col gap-2.5">
              {NAV_LINKS.slice(1).map(l => (
                <button key={l.id} onClick={() => setCurrentPage(l.id)}
                  className="text-sm text-left text-slate-500 hover:text-white transition-colors">
                  {l.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-400 mb-4">Contact</p>
            <p className="text-sm text-slate-400 leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.</p>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-wrap justify-between gap-3 text-xs text-slate-600">
          <span>© 2026 Menopause AI Initiative. Not a clinical service.</span>
          <span>Open research · Committed to equity</span>
        </div>
      </div>
    </footer>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────

function HomePage({ setCurrentPage }) {
  const heroStats = [
    { n: '10+', label: 'Curated Papers' },
    { n: '8', label: 'Research Areas' },
    { n: '6', label: 'Key Datasets' },
    { n: '4', label: 'Open Tools' },
  ];

  const impactStats = [
    { value: 47, suffix: 'M', label: 'US women experiencing the menopause transition annually', cite: 'US Census Bureau, 2023' },
    { value: 80, suffix: '%', label: 'report symptoms that meaningfully affect quality of life', cite: 'NAMS, Menopause Practice Guidelines, 2022' },
    { prefix: '<', value: 5, suffix: '%', label: 'of NIH funding historically directed to menopause research', cite: 'Crandall et al., Menopause 2021' },
  ];

  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-[93vh] flex items-center overflow-hidden bg-white">
        <div className="absolute top-1/4 -left-12 w-[560px] h-[560px] bg-violet-200/40 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-0 w-[440px] h-[440px] bg-rose-200/30 rounded-full blur-[120px] pointer-events-none" />
        <div className="line-grid absolute inset-0 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32">
          <h1 className="text-5xl sm:text-6xl md:text-[76px] font-black text-slate-900 leading-[1.03] mb-6 tracking-tight max-w-4xl">
            AI Research for<br />
            <span className="text-gradient">Menopause Science</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mb-10 leading-relaxed">
            We use AI and real-world data to study menopause. From clinical records to what people say online, we want to understand a transition that affects millions and gets far too little research attention.
          </p>

          <div className="flex flex-wrap gap-4 mb-20">
            <button
              onClick={() => setCurrentPage('areas')}
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-7 py-3.5 rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-violet-500/25 hover:-translate-y-0.5"
            >
              Explore Research <ArrowRight size={16} />
            </button>
            <button
              onClick={() => setCurrentPage('about')}
              className="inline-flex items-center gap-2 border border-slate-300 hover:border-violet-400 hover:bg-violet-50 text-slate-700 px-7 py-3.5 rounded-xl transition-all duration-200"
            >
              About the Initiative
            </button>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-4 pt-8 border-t border-slate-200">
            {heroStats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-black text-slate-900">{s.n}</div>
                <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT STATS */}
      <section className="bg-violet-50 border-y border-violet-100">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-violet-200">
            {impactStats.map((s, i) => (
              <Reveal key={i} delay={i * 130}>
                <div className="text-center px-8 py-8 md:py-4">
                  <div className="text-5xl md:text-6xl font-black text-slate-900 mb-3 tracking-tight">
                    {s.prefix && <span className="text-violet-600">{s.prefix}</span>}
                    <CountUp end={s.value} />
                    <span className="text-violet-600">{s.suffix}</span>
                  </div>
                  <p className="text-slate-600 text-sm max-w-xs mx-auto leading-relaxed">{s.label}</p>
                  <p className="text-slate-400 text-[10px] mt-2 max-w-xs mx-auto italic">{s.cite}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* RESEARCH AREAS */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
              <div>
                <SectionEyebrow>Research Areas</SectionEyebrow>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Research Areas</h2>
                <p className="mt-3 text-slate-500 max-w-xl leading-relaxed">
                  Eight areas spanning clinical prediction, social media analysis, comorbidities, and equity.
                </p>
              </div>
              <button onClick={() => setCurrentPage('areas')}
                className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-violet-600 hover:text-violet-800 transition-colors">
                View all <ArrowRight size={14} />
              </button>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {AREAS.map((area, i) => (
              <Reveal key={area.id} delay={i * 70}>
                <button
                  onClick={() => setCurrentPage('areas')}
                  className="group w-full text-left bg-white border border-slate-200 rounded-2xl p-6 card-lift"
                >
                  <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center text-sm font-black mb-4 group-hover:bg-violet-100 transition-colors">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2 leading-snug">{area.name}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed"
                     style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {area.short}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-xs text-violet-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore <ArrowRight size={11} />
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PAPERS */}
      <section className="bg-slate-50 py-24 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
              <div>
                <SectionEyebrow>Featured Research</SectionEyebrow>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Recent Highlights</h2>
              </div>
              <button onClick={() => setCurrentPage('papers')}
                className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-violet-600 hover:text-violet-800 transition-colors">
                All papers <ArrowRight size={14} />
              </button>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PAPERS_DATA.slice(0, 3).map((paper, i) => (
              <Reveal key={paper.id} delay={i * 90}>
                <PaperCard paper={paper} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-violet-600 py-24 relative overflow-hidden">
        <div className="absolute inset-0 dot-grid pointer-events-none" />
        <Reveal>
          <div className="relative max-w-3xl mx-auto px-6 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-200 mb-4">Get Involved</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-5 tracking-tight">
              Help build the resource
            </h2>
            <p className="text-violet-100 text-lg mb-10 leading-relaxed max-w-xl mx-auto">
              Submit papers, contribute datasets, or reach out about collaboration. We are a small team and we welcome people who want to dig into this problem.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button onClick={() => setCurrentPage('involved')}
                className="bg-white text-violet-700 font-bold px-8 py-3.5 rounded-xl hover:bg-violet-50 transition-colors hover:shadow-xl">
                Get Involved
              </button>
              <button onClick={() => setCurrentPage('papers')}
                className="border border-white/40 text-white px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors">
                Browse Papers
              </button>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

// ─── ABOUT ────────────────────────────────────────────────────────────────────

const FACULTY = [
  {
    initials: 'IC',
    name: 'Irene Chen',
    role: 'Principal Investigator',
    affiliation: 'UC Berkeley',
    bio: 'Placeholder bio. Irene works on machine learning for healthcare with a focus on fairness and clinical decision-making.',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    initials: 'MA',
    name: 'Monica Agrawal',
    role: '',
    affiliation: 'Duke University',
    bio: 'Placeholder bio. Monica focuses on NLP and clinical text mining, with applications in chronic disease and women\'s health.',
    gradient: 'from-rose-500 to-pink-600',
  },
  {
    initials: 'YH',
    name: 'Yulin Hswen',
    role: '',
    affiliation: 'UC San Francisco',
    bio: 'Placeholder bio. Yulin studies digital epidemiology and social media data to understand health disparities at scale.',
    gradient: 'from-sky-500 to-blue-600',
  },
];

const STUDENTS = [
  {
    initials: 'NT',
    name: 'Nitya Thakkar',
    role: '',
    affiliation: 'Insert school here',
    bio: 'Placeholder bio.',
    gradient: 'from-teal-500 to-emerald-600',
  },
  {
    initials: 'SP',
    name: 'Sarika Pasumarthy',
    role: '',
    affiliation: 'Insert school here',
    bio: 'Placeholder bio.',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    initials: 'SS',
    name: 'Sraavya Sambara',
    role: '',
    affiliation: 'Insert school here',
    bio: 'Placeholder bio.',
    gradient: 'from-indigo-500 to-blue-600',
  },
  {
    initials: 'TM',
    name: 'Tanya Mehta',
    role: '',
    affiliation: 'Insert school here',
    bio: 'Placeholder bio.',
    gradient: 'from-fuchsia-500 to-pink-600',
  },
];

function PersonCard({ person }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-7 card-lift flex flex-col">
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${person.gradient} text-white flex items-center justify-center font-bold text-base flex-shrink-0 shadow-md`}>
          {person.initials}
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 leading-tight">{person.name}</h3>
          {person.role && <p className="text-xs text-violet-600 font-semibold mt-0.5">{person.role}</p>}
          {person.affiliation && <p className="text-xs text-slate-400 mt-0.5">{person.affiliation}</p>}
        </div>
      </div>
      <p className="text-sm text-slate-500 leading-relaxed">{person.bio}</p>
    </div>
  );
}

function AboutPage() {
  return (
    <div>
      <PageHeader eyebrow="About" title="About the Initiative" />

      <div className="max-w-5xl mx-auto px-6 py-20">

        {/* Mission */}
        <Reveal className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div>
              <SectionEyebrow>What we do</SectionEyebrow>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-5 tracking-tight">The project</h2>
              <p className="text-base text-slate-600 leading-relaxed mb-4">
                We study menopause using AI and real-world data. That means electronic health records, wearables, and something most clinical research ignores: what people actually say online.
              </p>
              <p className="text-base text-slate-600 leading-relaxed mb-4">
                Some of the questions that drive our work: how do people talk about menopause on social media, and what does that tell us about symptoms, information-seeking, and unmet needs? What conditions tend to show up alongside menopause, and can we find patterns in those clusters before they become serious?
              </p>
              <p className="text-base text-slate-600 leading-relaxed">
                We want the science to be open and the tools to be useful. That means publishing datasets, sharing code, and writing about the work in ways that go beyond academic papers.
              </p>
            </div>
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8">
              <SectionEyebrow>Why it matters</SectionEyebrow>
              <h3 className="text-lg font-bold text-slate-900 mb-4">A field that got left behind</h3>
              <ul className="flex flex-col gap-4">
                {[
                  'Less than 5% of NIH funding has historically gone to menopause research',
                  'Roughly 47 million US women are going through the transition at any given time',
                  '80% report symptoms that affect daily life — many without a clear diagnosis or treatment plan',
                  'Black and Latina women are underrepresented in most datasets',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-violet-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        {/* Faculty */}
        <div className="mb-16">
          <Reveal>
            <SectionEyebrow>People</SectionEyebrow>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight">Faculty</h2>
            <p className="text-slate-500 text-sm mb-8">The project is led by three faculty across UC Berkeley, Duke, and UCSF.</p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FACULTY.map((person, i) => (
              <Reveal key={i} delay={i * 100}>
                <PersonCard person={person} />
              </Reveal>
            ))}
          </div>
        </div>

        {/* Students */}
        <div className="mb-20">
          <Reveal>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-8 tracking-tight">Students</h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STUDENTS.map((person, i) => (
              <Reveal key={i} delay={i * 80}>
                <PersonCard person={person} />
              </Reveal>
            ))}
          </div>
        </div>

        {/* Contact */}
        <Reveal>
          <div className="bg-violet-600 rounded-2xl p-10 text-center relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <h3 className="text-xl font-bold text-white mb-3">Get in touch</h3>
              <p className="text-violet-100 text-sm mb-6 max-w-md mx-auto leading-relaxed">
                We are always looking for collaborators, dataset contributors, and people who want to help make this work better. Reach out.
              </p>
              <a href="mailto:placeholder@berkeley.edu"
                className="inline-flex items-center gap-2 bg-white text-violet-700 hover:bg-violet-50 font-semibold px-6 py-3 rounded-xl text-sm transition-colors">
                Contact us
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

// ─── RESEARCH AREAS ───────────────────────────────────────────────────────────

function ResearchAreasPage({ setCurrentPage }) {
  const [open, setOpen] = useState(null);

  return (
    <div>
      <PageHeader
        eyebrow="Research Areas"
        title="Research Areas"
        desc="Eight areas spanning clinical prediction, social media data, comorbidities, and algorithmic fairness."
      />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col gap-3">
          {AREAS.map((area, i) => {
            const isOpen = open === area.id;
            return (
              <Reveal key={area.id} delay={i * 50}>
                <div className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen ? 'border-violet-300 shadow-lg shadow-violet-500/10' : 'border-slate-200 hover:border-violet-200'
                }`}>
                  <button
                    onClick={() => setOpen(isOpen ? null : area.id)}
                    className="w-full flex items-center justify-between gap-4 px-7 py-5 text-left bg-white hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 transition-colors ${
                        isOpen ? 'bg-violet-600 text-white' : 'bg-violet-50 text-violet-600'
                      }`}>{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-base font-bold text-slate-900">{area.name}</span>
                    </div>
                    {isOpen ? <ChevronUp size={18} className="text-violet-500 flex-shrink-0" /> : <ChevronDown size={18} className="text-slate-400 flex-shrink-0" />}
                  </button>

                  {isOpen && (
                    <div className="px-7 pb-7 bg-white border-t border-slate-100">
                      <p className="text-sm text-slate-600 leading-relaxed mb-5 mt-5 max-w-3xl">{area.overview}</p>
                      <div className="mb-5">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-600 mb-3">Open Challenges</p>
                        <ul className="flex flex-col gap-2">
                          {area.challenges.map((c, j) => (
                            <li key={j} className="flex items-start gap-2.5 text-sm text-slate-600">
                              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Related papers:</span>
                        {area.papers.map((p, j) => (
                          <button key={j} onClick={() => setCurrentPage('papers')}
                            className="text-xs text-violet-600 font-semibold hover:text-violet-800 underline underline-offset-2 transition-colors">
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── PAPERS ───────────────────────────────────────────────────────────────────

function ArxivCard({ paper }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col gap-3 card-lift">
      <div className="flex flex-wrap gap-1.5 items-center">
        {paper.categories.split(' · ').slice(0, 3).map(cat => (
          <Tag key={cat} label={cat} variant="method" />
        ))}
        <span className="text-xs text-slate-400 ml-1">{paper.published}</span>
      </div>
      <h3 className="text-sm font-bold text-slate-900 leading-snug">{paper.title}</h3>
      <p className="text-xs text-slate-500">{paper.authors}</p>
      <p className="text-sm text-slate-600 leading-relaxed flex-1">
        {paper.summary?.length > 360 ? paper.summary.slice(0, 360) + '…' : paper.summary}
      </p>
      {paper.link && (
        <a href={paper.link} target="_blank" rel="noreferrer"
          className="text-sm text-violet-600 font-semibold hover:text-violet-800 flex items-center gap-1 mt-auto transition-colors">
          View on ArXiv <ExternalLink size={12} />
        </a>
      )}
    </div>
  );
}

function ArxivSearch() {
  const [query, setQuery] = useState('menopause machine learning');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  async function doSearch(e) {
    e?.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const papers = await fetchArxiv(query.trim());
      setResults(papers);
      setSearched(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={doSearch} className="flex gap-0 mb-6">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="e.g. menopause machine learning hot flash detection"
            className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 border-r-0 rounded-l-xl outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all text-slate-900 placeholder-slate-400 bg-white"
          />
        </div>
        <button type="submit" disabled={loading}
          className={`px-6 py-3 text-sm font-semibold text-white rounded-r-xl transition-colors ${loading ? 'bg-slate-400' : 'bg-violet-600 hover:bg-violet-500'}`}>
          {loading ? 'Searching…' : 'Search ArXiv'}
        </button>
      </form>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm mb-5">
          Error: {error}. The ArXiv API may be temporarily unavailable.
        </div>
      )}

      {searched && !loading && (
        <p className="text-sm text-slate-500 mb-4">
          {results.length} result{results.length !== 1 ? 's' : ''} for <em>"{query}"</em>
        </p>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map(p => <ArxivCard key={p.id} paper={p} />)}
        </div>
      )}

      {searched && !loading && results.length === 0 && !error && (
        <div className="py-16 text-center rounded-2xl border border-slate-200 bg-slate-50">
          <p className="text-slate-500">No results found. Try broader search terms.</p>
        </div>
      )}

      {!searched && !loading && (
        <div className="py-16 text-center rounded-2xl border border-slate-200 bg-slate-50">
          <p className="text-slate-500 text-sm">Enter a search query to pull live results from ArXiv.</p>
          <p className="text-slate-400 text-xs mt-2">Searches title, abstract, and full text across all arXiv categories.</p>
        </div>
      )}
    </div>
  );
}

function PapersPage() {
  const [tab, setTab] = useState('curated');
  const [query, setQuery] = useState('');
  const [areaF, setAreaF] = useState('');
  const [methodF, setMethodF] = useState('');

  const areaOptions = [...new Set(PAPERS_DATA.map(p => p.area))];
  const methodOptions = [...new Set(PAPERS_DATA.map(p => p.method))];

  const filtered = PAPERS_DATA.filter(p => {
    if (areaF && p.area !== areaF) return false;
    if (methodF && p.method !== methodF) return false;
    if (query && !p.title.toLowerCase().includes(query.toLowerCase()) && !p.authors.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const hasFilter = query || areaF || methodF;

  const selectCls = 'text-sm px-3 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-700 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 transition-all';

  return (
    <div>
      <PageHeader
        eyebrow="Papers"
        title="Research Papers"
        desc="A curated index of AI and ML research applied to menopause science, plus live ArXiv search."
      />

      <div className="max-w-7xl mx-auto px-6 py-12 pb-20">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-slate-100 p-1 rounded-xl w-fit">
          {[['curated', `Curated Index (${PAPERS_DATA.length})`], ['arxiv', 'Live ArXiv Search']].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                tab === id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}>
              {label}
            </button>
          ))}
        </div>

        {tab === 'curated' && (
          <div>
            <div className="flex flex-wrap gap-3 mb-5 items-center">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input type="text" placeholder="Search title or author…" value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 transition-all min-w-[220px]" />
              </div>
              <select value={areaF} onChange={e => setAreaF(e.target.value)} className={selectCls}>
                <option value="">All Areas</option>
                {areaOptions.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
              <select value={methodF} onChange={e => setMethodF(e.target.value)} className={selectCls}>
                <option value="">All Methods</option>
                {methodOptions.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              {hasFilter && (
                <button onClick={() => { setQuery(''); setAreaF(''); setMethodF(''); }}
                  className="px-3 py-2.5 text-sm text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors">
                  Clear ×
                </button>
              )}
            </div>

            <p className="text-sm text-slate-400 mb-5">{filtered.length} of {PAPERS_DATA.length} papers</p>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((paper, i) => (
                  <Reveal key={paper.id} delay={i * 40}>
                    <PaperCard paper={paper} />
                  </Reveal>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center rounded-2xl border border-slate-200">
                <p className="text-slate-500">No papers match your filters.</p>
              </div>
            )}

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 bg-violet-50 border border-violet-200 rounded-2xl px-8 py-6">
              <div>
                <p className="font-bold text-slate-900 mb-1">Know a paper we're missing?</p>
                <p className="text-sm text-slate-500">Submit any AI/ML + menopause paper for review and inclusion.</p>
              </div>
              <button className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors">
                Submit a Paper →
              </button>
            </div>
          </div>
        )}

        {tab === 'arxiv' && (
          <div>
            <p className="text-sm text-slate-500 mb-6 max-w-xl leading-relaxed">
              Live search across the ArXiv preprint server. Results are fetched in real time — these are preprints and may not be peer-reviewed.
            </p>
            <ArxivSearch />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── DATA & TOOLS ─────────────────────────────────────────────────────────────

function DataToolsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Data & Tools"
        title="Datasets & Open-Source Tools"
        desc="Curated data resources and community-built toolkits for menopause AI research."
      />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <section className="mb-16">
          <Reveal>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-8 tracking-tight">Key Datasets</h2>
          </Reveal>
          <div className="flex flex-col gap-4">
            {DATASETS.map((ds, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="bg-white rounded-2xl border border-slate-200 p-6 card-lift">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <h3 className="text-base font-bold text-slate-900">{ds.name}</h3>
                    <AccessBadge type={ds.access} />
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4 max-w-3xl">{ds.description}</p>
                  <div className="flex flex-wrap gap-6 text-sm text-slate-500">
                    <span><span className="font-semibold text-slate-700">Scale:</span> {ds.scale}</span>
                    <span><span className="font-semibold text-slate-700">Demographics:</span> {ds.demographics}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section>
          <Reveal>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-8 tracking-tight">Tools & Code Libraries</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {TOOLS.map((tool, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="bg-white rounded-2xl border border-slate-200 p-7 card-lift h-full">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 mb-1">{tool.name}</h3>
                      <Tag label="Open Source" variant="code" />
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center flex-shrink-0">
                      <Github size={18} />
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed mb-5">{tool.description}</p>
                  <button className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all">
                    <Github size={14} /> View on GitHub
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

// ─── BLOG ─────────────────────────────────────────────────────────────────────

const POST_TYPES = ['All', 'In the News', 'Paper Spotlight', 'Field Overview', 'Methods Explainer', 'Open Problem'];

const POST_TYPE_COLORS = {
  'In the News': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Paper Spotlight': 'bg-violet-50 text-violet-700 border-violet-200',
  'Field Overview': 'bg-sky-50 text-sky-700 border-sky-200',
  'Methods Explainer': 'bg-amber-50 text-amber-700 border-amber-200',
  'Open Problem': 'bg-rose-50 text-rose-700 border-rose-200',
};

function BlogPage() {
  const [active, setActive] = useState('All');
  const visible = active === 'All' ? BLOG_POSTS : BLOG_POSTS.filter(p => p.type === active);

  return (
    <div>
      <PageHeader
        eyebrow="Blog"
        title="Research Perspectives"
        desc="Menopause in the news, paper spotlights, and field updates."
      />

      <div className="max-w-7xl mx-auto px-6 py-12 pb-20">
        <div className="flex flex-wrap gap-2 mb-10">
          {POST_TYPES.map(type => (
            <button key={type} onClick={() => setActive(type)}
              className={`px-4 py-2 text-sm font-semibold rounded-full border transition-all ${
                active === type
                  ? 'bg-violet-600 text-white border-violet-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300 hover:text-violet-600'
              }`}>
              {type}
            </button>
          ))}
        </div>

        {visible.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {visible.map((post, i) => (
              <Reveal key={post.id} delay={i * 80}>
                <div className="bg-white rounded-2xl border border-slate-200 p-7 card-lift flex flex-col gap-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`inline-flex text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${POST_TYPE_COLORS[post.type] || POST_TYPE_COLORS['Paper Spotlight']}`}>
                      {post.type}
                    </span>
                    {post.source && <span className="text-xs font-semibold text-slate-500">{post.source}</span>}
                    <span className="text-xs text-slate-400">{post.date}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">{post.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed flex-1">{post.summary}</p>
                  {post.url ? (
                    <a href={post.url} target="_blank" rel="noreferrer"
                      className="text-sm font-semibold text-violet-600 hover:text-violet-800 text-left flex items-center gap-1 mt-auto transition-colors">
                      Read <ExternalLink size={13} />
                    </a>
                  ) : (
                    <button className="text-sm font-semibold text-violet-600 hover:text-violet-800 text-left flex items-center gap-1 mt-auto transition-colors">
                      Read <ArrowUpRight size={13} />
                    </button>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center rounded-2xl border border-slate-200 bg-slate-50">
            <p className="text-slate-500">No posts in this category yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── GET INVOLVED ─────────────────────────────────────────────────────────────

function GetInvolvedPage() {
  const [form, setForm] = useState({ title: '', authors: '', doi: '', area: '' });
  const [submitted, setSubmitted] = useState(false);

  const funding = [
    { org: 'NIH / ORWH', focus: "Office of Research on Women's Health — supplements, R01s, and administrative supplements with a women's health and AI focus." },
    { org: 'NIH NHLBI', focus: 'Cardiovascular outcomes research post-menopause; wearable-based phenotyping and digital biomarker grants.' },
    { org: 'NSF IIS / HDR', focus: 'Human-centered AI, responsible ML, and data science for health; equity-focused ML methodology grants.' },
    { org: 'PCORI', focus: "Patient-centered outcomes research including AI-augmented shared decision-making tools in women's health." },
    { org: 'Gates Foundation', focus: "Women's health equity globally — digital health implementation and AI for under-resourced settings." },
    { org: 'Femtech Fund & WHAM', focus: "Industry and advocacy funding streams specifically targeting menopause technology and women's health AI." },
  ];

  const inputCls = 'w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 transition-all';

  return (
    <div>
      <PageHeader
        eyebrow="Get Involved"
        title="Join the Initiative"
        desc="Researchers, clinicians, data scientists, and patient advocates are all welcome."
      />

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Submit + Collaborate */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
          <Reveal>
            <div className="bg-white rounded-2xl border border-slate-200 p-8 h-full">
              <h2 className="text-xl font-extrabold text-slate-900 mb-2 tracking-tight">Submit a Paper</h2>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                Know a paper we haven't indexed? We review all submissions within two weeks.
              </p>
              {submitted ? (
                <div className="bg-violet-50 border border-violet-200 rounded-xl p-6 text-center">
                  <p className="font-bold text-slate-900 mb-2">Thank you — submission received.</p>
                  <button onClick={() => { setSubmitted(false); setForm({ title: '', authors: '', doi: '', area: '' }); }}
                    className="text-sm text-violet-600 font-semibold hover:text-violet-800 transition-colors">
                    Submit another →
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Title <span className="text-violet-500">*</span>
                    </label>
                    <input type="text" placeholder="Full paper title" value={form.title}
                      onChange={e => setForm(d => ({ ...d, title: e.target.value }))} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Authors</label>
                    <input type="text" placeholder="Last FM, Last FM, …" value={form.authors}
                      onChange={e => setForm(d => ({ ...d, authors: e.target.value }))} className={inputCls} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">DOI</label>
                      <input type="text" placeholder="10.xxxx/xxxxx" value={form.doi}
                        onChange={e => setForm(d => ({ ...d, doi: e.target.value }))} className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Area</label>
                      <select value={form.area} onChange={e => setForm(d => ({ ...d, area: e.target.value }))}
                        className={inputCls}>
                        <option value="">Select…</option>
                        {AREAS.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <button onClick={() => { if (form.title.trim()) setSubmitted(true); }}
                    className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 rounded-xl transition-colors">
                    <Send size={14} /> Submit Paper
                  </button>
                </div>
              )}
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 flex flex-col h-full">
              <h2 className="text-xl font-extrabold text-slate-900 mb-2 tracking-tight">Collaborate</h2>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                We welcome collaborations with clinical researchers, data scientists, patient advocacy organizations, and health systems — especially those working with under-studied populations.
              </p>
              <p className="text-sm text-slate-500 leading-relaxed mb-8">
                If you're interested in co-developing methodological standards, contributing datasets, or joining our editorial board, reach out.
              </p>
              <button className="mt-auto flex items-center justify-center gap-2 border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-semibold py-3 rounded-xl transition-colors">
                <Mail size={14} /> Get in Touch
              </button>
            </div>
          </Reveal>
        </div>

        {/* Funding */}
        <section className="mb-16">
          <Reveal>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-8 tracking-tight">Funding Opportunities</h2>
          </Reveal>
          <div className="flex flex-col gap-3">
            {funding.map((f, i) => (
              <Reveal key={i} delay={i * 50}>
                <div className="bg-white rounded-xl border border-slate-200 px-6 py-4 flex flex-wrap items-start gap-4 card-lift">
                  <span className="text-sm font-bold text-violet-700 min-w-[140px]">{f.org}</span>
                  <p className="text-sm text-slate-600 leading-relaxed flex-1">{f.focus}</p>
                  <a href="#" onClick={e => e.preventDefault()}
                    className="text-xs text-violet-600 font-semibold flex items-center gap-1 hover:text-violet-800 transition-colors whitespace-nowrap">
                    Learn more <ExternalLink size={11} />
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Newsletter */}
        <Reveal>
          <div className="relative bg-slate-900 rounded-2xl overflow-hidden">
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="relative px-10 py-10 flex flex-wrap items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-extrabold text-white mb-1.5">Stay current with menopause AI research</h3>
                <p className="text-sm text-slate-400">Monthly digest of new papers, datasets, and field updates.</p>
              </div>
              <div className="flex gap-0 w-full md:w-auto">
                <input type="email" placeholder="you@institution.edu"
                  className="flex-1 md:w-64 px-4 py-3 text-sm bg-white/10 border border-white/20 text-white placeholder-slate-400 rounded-l-xl outline-none focus:border-violet-400 transition-all" />
                <button className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm rounded-r-xl transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
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
    home: <HomePage setCurrentPage={setCurrentPage} />,
    about: <AboutPage />,
    areas: <ResearchAreasPage setCurrentPage={setCurrentPage} />,
    papers: <PapersPage />,
    data: <DataToolsPage />,
    blog: <BlogPage />,
    involved: <GetInvolvedPage />,
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Nav currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main>{pages[currentPage]}</main>
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}

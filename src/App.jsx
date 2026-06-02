import { useState, useEffect } from 'react';
import { Search, ArrowRight, Github, Mail, Send, ExternalLink, Menu, X } from 'lucide-react';

// ─── PALETTE ──────────────────────────────────────────────────────────────────
const C = {
  navy: '#003865',
  navyDark: '#002347',
  navyLight: '#e8f0f8',
  gold: '#b5922a',
  goldLight: '#fdf8ed',
  teal: '#1a6b6b',
  tealLight: '#e6f4f4',
  text: '#1a1a1a',
  muted: '#556070',
  mutedLight: '#8a99a8',
  bg: '#fff',
  cream: '#faf7f1',
  border: '#d4cec7',
};

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
    title: 'How Consumer Wearables Are Transforming Menopause Research',
    type: 'Field Overview',
    date: 'May 14, 2026',
    summary:
      'Fitbit, Apple Watch, and Oura Ring now capture HRV, skin temperature, SpO₂, and sleep staging at population scale — opening windows into perimenopausal physiology that clinical research could never match.',
  },
  {
    id: 2,
    title: 'Paper Spotlight: ClinicalBERT for Menopause Phenotyping (Jacobson et al., 2024)',
    type: 'Paper Spotlight',
    date: 'April 28, 2026',
    summary:
      'A walkthrough of the methods, multi-site validation, and key findings of the JAMIA paper on NLP-based menopause status extraction — and what it means for building large retrospective cohorts from existing EHR data.',
  },
  {
    id: 3,
    title: 'Open Problem: Evaluating Fairness When Onset Age Differs by Biology',
    type: 'Open Problem',
    date: 'March 30, 2026',
    summary:
      "Standard fairness metrics like equalized odds don't map cleanly onto menopause prediction tasks where onset age varies across racial groups for partly biological reasons. A proposed framework and call for community input.",
  },
  {
    id: 4,
    title: 'Causal Forests for Personalized HRT Decisions: A Methods Explainer',
    type: 'Methods Explainer',
    date: 'February 18, 2026',
    summary:
      'The intuition behind causal forests, the assumptions they require, and how Torres et al. 2024 applied them to UK Biobank to identify women who are systematically undertreated.',
  },
];

// ─── ARXIV ────────────────────────────────────────────────────────────────────

async function fetchArxiv(query) {
  // Each space-separated word must be explicitly ANDed; bare spaces in ArXiv fields act as OR
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
    authors: [...e.querySelectorAll('author name')]
      .map(a => a.textContent.trim())
      .slice(0, 5)
      .join(', '),
    summary: e.querySelector('summary')?.textContent?.replace(/\s+/g, ' ').trim(),
    published: e.querySelector('published')?.textContent?.slice(0, 10),
    categories: [...e.querySelectorAll('category')]
      .map(c => c.getAttribute('term'))
      .filter(Boolean)
      .slice(0, 3)
      .join(' · '),
    link: e.querySelector('id')?.textContent?.trim(),
  }));
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

function Tag({ label, variant = 'default' }) {
  const styles = {
    area: { color: C.navy, borderColor: '#9ab3cf', background: C.navyLight },
    method: { color: '#7a5c00', borderColor: '#d4b46a', background: C.goldLight },
    data: { color: C.muted, borderColor: C.border, background: C.cream },
    code: { color: '#166534', borderColor: '#86efac', background: '#f0fdf4' },
    postType: { color: C.teal, borderColor: '#9dd4d4', background: C.tealLight },
    default: { color: C.muted, borderColor: C.border, background: '#fff' },
  };
  const s = styles[variant] || styles.default;
  return (
    <span style={{
      display: 'inline-block',
      fontSize: '11px',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      padding: '2px 7px',
      border: `1px solid ${s.borderColor}`,
      color: s.color,
      background: s.background,
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
}

function AccessTag({ type }) {
  const colors = {
    Open: { color: '#166534', border: '#86efac', bg: '#f0fdf4' },
    'Application Required': { color: '#92400e', border: '#fcd34d', bg: '#fffbeb' },
    Restricted: { color: '#991b1b', border: '#fca5a5', bg: '#fef2f2' },
  };
  const s = colors[type] || colors['Application Required'];
  return (
    <span style={{
      display: 'inline-block',
      fontSize: '11px',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      padding: '2px 7px',
      border: `1px solid ${s.border}`,
      color: s.color,
      background: s.bg,
      whiteSpace: 'nowrap',
    }}>
      {type}
    </span>
  );
}

function SectionLabel({ children }) {
  return (
    <p style={{
      fontSize: '11px',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
      color: C.gold,
      marginBottom: '8px',
    }}>
      {children}
    </p>
  );
}

function Divider() {
  return <hr style={{ border: 'none', borderTop: `1px solid ${C.border}`, margin: 0 }} />;
}

function PaperCard({ paper }) {
  return (
    <div style={{ padding: '22px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
        <Tag label={paper.area} variant="area" />
        <Tag label={paper.method} variant="method" />
        <Tag label={paper.dataType} variant="data" />
        {paper.hasCode && <Tag label="Code" variant="code" />}
      </div>
      <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: C.navy, lineHeight: 1.4, margin: 0 }}>
        {paper.title}
      </h3>
      <p style={{ fontSize: '12px', color: C.muted, margin: 0 }}>
        {paper.authors} &middot; <em>{paper.journal}</em> &middot; {paper.year}
      </p>
      <p style={{ fontSize: '13px', color: '#3a3a3a', lineHeight: 1.65, margin: 0, flex: 1 }}>
        {paper.summary}
      </p>
      <a href="#" style={{ color: C.teal, fontSize: '13px', textDecoration: 'none', marginTop: 'auto' }}
        onClick={e => e.preventDefault()}>
        Read paper →
      </a>
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
  const [open, setOpen] = useState(false);
  return (
    <nav style={{ backgroundColor: C.navy, position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '54px' }}>
          <button
            onClick={() => { setCurrentPage('home'); setOpen(false); }}
            style={{ fontWeight: 'bold', fontSize: '15px', color: '#fff', background: 'none', border: 'none', padding: 0, letterSpacing: '0.01em', fontFamily: 'Georgia, serif' }}
          >
            Menopause AI Initiative
          </button>

          <div className="hidden md:flex" style={{ gap: '0' }}>
            {NAV_LINKS.map(link => (
              <button
                key={link.id}
                onClick={() => setCurrentPage(link.id)}
                style={{
                  fontSize: '13px',
                  padding: '6px 11px',
                  background: 'none',
                  border: 'none',
                  color: currentPage === link.id ? '#fff' : 'rgba(255,255,255,0.7)',
                  borderBottom: currentPage === link.id ? `2px solid ${C.gold}` : '2px solid transparent',
                  fontFamily: 'Georgia, serif',
                  fontWeight: currentPage === link.id ? 'bold' : 'normal',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => { if (currentPage !== link.id) e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { if (currentPage !== link.id) e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
              >
                {link.label}
              </button>
            ))}
          </div>

          <button
            className="md:hidden"
            style={{ background: 'none', border: 'none', color: '#fff', padding: '4px' }}
            onClick={() => setOpen(o => !o)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden" style={{ borderTop: '1px solid rgba(255,255,255,0.15)', backgroundColor: C.navyDark }}>
          {NAV_LINKS.map(link => (
            <button key={link.id} onClick={() => { setCurrentPage(link.id); setOpen(false); }}
              style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px 24px', background: 'none', border: 'none', fontSize: '14px', color: currentPage === link.id ? C.gold : '#fff', fontFamily: 'Georgia, serif', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
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
    <footer style={{ backgroundColor: C.navy, marginTop: '0', color: 'rgba(255,255,255,0.75)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '36px', marginBottom: '40px' }}>
          <div>
            <p style={{ fontWeight: 'bold', fontSize: '15px', color: '#fff', marginBottom: '10px', fontFamily: 'Georgia, serif' }}>
              Menopause AI Initiative
            </p>
            <p style={{ fontSize: '13px', lineHeight: 1.65 }}>
              An open research commons advancing AI and ML applied to menopause science — with equity at the center.
            </p>
          </div>
          <div>
            <p style={{ fontWeight: 'bold', fontSize: '11px', color: C.gold, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Explore</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {NAV_LINKS.slice(1).map(l => (
                <button key={l.id} onClick={() => setCurrentPage(l.id)}
                  style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', background: 'none', border: 'none', padding: 0, textAlign: 'left', fontFamily: 'Georgia, serif', cursor: 'pointer' }}>
                  {l.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontWeight: 'bold', fontSize: '11px', color: C.gold, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Contact</p>
            <p style={{ fontSize: '13px' }}>menopauseai@research.edu</p>
            <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
              {['GitHub', 'Twitter/X', 'LinkedIn'].map(s => (
                <a key={s} href="#" style={{ fontSize: '12px', color: C.gold }}>{s}</a>
              ))}
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{ fontSize: '12px' }}>© 2026 Menopause AI Initiative. Not a clinical service.</span>
          <span style={{ fontSize: '12px' }}>Open research · Committed to equity</span>
        </div>
      </div>
    </footer>
  );
}

// ─── PAGE 1: HOME ─────────────────────────────────────────────────────────────

function HomePage({ setCurrentPage }) {
  const stats = [
    { n: '47M', label: 'US women experiencing the menopause transition annually' },
    { n: '80%', label: 'report symptoms that meaningfully affect quality of life' },
    { n: '<5%', label: 'of NIH funding historically directed to menopause research' },
  ];

  return (
    <div>
      {/* HERO */}
      <section style={{ backgroundColor: C.navy, padding: '64px 24px 56px', borderBottom: `4px solid ${C.gold}` }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.12em', color: C.gold, marginBottom: '16px' }}>
            Menopause AI Initiative
          </p>
          <h1 style={{ fontSize: '2.5rem', lineHeight: 1.2, color: '#fff', marginBottom: '18px' }}>
            Advancing Menopause Science<br />with Artificial Intelligence
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.78)', lineHeight: 1.7, marginBottom: '32px', maxWidth: '580px' }}>
            A catalog of AI and ML research applied to perimenopause and menopause — organized by research area, dataset, and method, with equity at the center.
          </p>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <button onClick={() => setCurrentPage('areas')}
              style={{ fontSize: '14px', color: C.navy, backgroundColor: C.gold, border: 'none', padding: '9px 20px', fontFamily: 'Georgia, serif', fontWeight: 'bold', cursor: 'pointer' }}>
              Explore the Research →
            </button>
            <button onClick={() => setCurrentPage('about')}
              style={{ fontSize: '14px', color: '#fff', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.45)', padding: '9px 20px', fontFamily: 'Georgia, serif', cursor: 'pointer' }}>
              About the Initiative
            </button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ backgroundColor: C.cream, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {stats.map((s, i) => (
            <div key={i} style={{ padding: '28px 32px', borderRight: i < stats.length - 1 ? `1px solid ${C.border}` : 'none' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 'bold', color: C.navy, marginBottom: '5px' }}>{s.n}</div>
              <div style={{ fontSize: '13px', color: C.muted, lineHeight: 1.5 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PAPERS */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
          <div>
            <SectionLabel>Featured Research</SectionLabel>
            <h2 style={{ fontSize: '1.5rem', color: C.navy, margin: 0 }}>Recent Highlights</h2>
          </div>
          <button onClick={() => setCurrentPage('papers')}
            style={{ fontSize: '13px', color: C.teal, background: 'none', border: 'none', fontFamily: 'Georgia, serif', cursor: 'pointer' }}>
            View all papers →
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', border: `1px solid ${C.border}` }}>
          {PAPERS_DATA.slice(0, 3).map((paper, i) => (
            <div key={paper.id} style={{ borderRight: i < 2 ? `1px solid ${C.border}` : 'none' }}>
              <PaperCard paper={paper} />
            </div>
          ))}
        </div>
      </section>

      {/* RESEARCH AREAS */}
      <section style={{ backgroundColor: C.navyLight, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
            <div>
              <SectionLabel>Research Areas</SectionLabel>
              <h2 style={{ fontSize: '1.5rem', color: C.navy, margin: 0 }}>Six Research Frontiers</h2>
            </div>
            <button onClick={() => setCurrentPage('areas')}
              style={{ fontSize: '13px', color: C.teal, background: 'none', border: 'none', fontFamily: 'Georgia, serif', cursor: 'pointer' }}>
              Explore all →
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1px', backgroundColor: C.border }}>
            {AREAS.map(area => (
              <button key={area.id} onClick={() => setCurrentPage('areas')}
                style={{ backgroundColor: '#fff', padding: '22px', textAlign: 'left', border: 'none', fontFamily: 'Georgia, serif', cursor: 'pointer' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: C.navy, marginBottom: '7px' }}>{area.name}</h3>
                <p style={{ fontSize: '13px', color: C.muted, lineHeight: 1.55, margin: 0 }}>{area.short}</p>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── PAGE 2: ABOUT ────────────────────────────────────────────────────────────

function AboutPage() {
  const team = [
    {
      initials: 'AO',
      name: 'Dr. Amara Osei-Bonsu',
      affiliation: 'Department of Biomedical Informatics · Stanford University',
      bio: 'Develops fairness-aware ML models for reproductive aging and hormonal transitions. PI of the PRISM menopause equity study; member of the All of Us Diversity Working Group.',
    },
    {
      initials: 'LN',
      name: 'Dr. Linda Nguyen',
      affiliation: "Division of Women's Health · Brigham and Women's Hospital",
      bio: 'Gynecologist-epidemiologist specializing in hormonal transitions and clinical decision support. Leads the clinical validation arm of AI-based HRT personalization tools in the MGB system.',
    },
    {
      initials: 'MW',
      name: 'Dr. Marcus Webb',
      affiliation: 'Bakar Computational Health Sciences Institute · UCSF',
      bio: 'Builds deep learning models for physiological signal processing applied to reproductive health. Created HotFlashNet and the MenoNLP toolkit; serves on the NEJM AI editorial board.',
    },
  ];

  return (
    <div>
      {/* Page header band */}
      <div style={{ backgroundColor: C.navy, padding: '40px 24px 36px', borderBottom: `3px solid ${C.gold}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <SectionLabel>About</SectionLabel>
          <h1 style={{ fontSize: '2rem', color: '#fff', margin: 0 }}>About the Initiative</h1>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '56px 24px' }}>
        {/* Mission */}
        <div style={{ maxWidth: '740px', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '1.25rem', color: C.navy, marginBottom: '16px' }}>Mission</h2>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: '#333', marginBottom: '14px' }}>
            The Menopause AI Initiative is an open research hub dedicated to cataloging, connecting, and accelerating AI and machine learning research applied to perimenopause and menopause. We believe that women — particularly Black, Latina, and Asian women who have been historically excluded from menopause research — deserve science that reflects their biology, their lives, and their priorities.
          </p>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: '#333' }}>
            We are a research commons: indexing papers, surfacing open datasets and tools, and building a community of researchers committed to rigorous, equitable, and reproducible menopause AI science. The menopause transition is a window into women's cardiovascular, metabolic, neurological, and bone health for the second half of their lives.
          </p>
        </div>

        {/* Team */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '1.25rem', color: C.navy, marginBottom: '20px' }}>Advisory & Editorial Board</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1px', border: `1px solid ${C.border}`, backgroundColor: C.border }}>
            {team.map((person, i) => (
              <div key={i} style={{ backgroundColor: '#fff', padding: '28px' }}>
                <div style={{
                  width: '46px', height: '46px', backgroundColor: C.navy, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 'bold', fontSize: '15px', marginBottom: '14px',
                }}>
                  {person.initials}
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: C.navy, marginBottom: '4px' }}>{person.name}</h3>
                <p style={{ fontSize: '12px', color: C.gold, fontWeight: 'bold', marginBottom: '10px' }}>{person.affiliation}</p>
                <p style={{ fontSize: '13px', color: C.muted, lineHeight: 1.6 }}>{person.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scope */}
        <div style={{ borderLeft: `4px solid ${C.gold}`, paddingLeft: '24px', maxWidth: '740px', backgroundColor: C.goldLight, padding: '24px 24px 24px 28px', borderLeft: `4px solid ${C.gold}` }}>
          <h3 style={{ fontSize: '1.1rem', color: C.navy, marginBottom: '12px' }}>What counts as "Menopause × AI"?</h3>
          <p style={{ fontSize: '14px', color: '#333', lineHeight: 1.7, marginBottom: '12px' }}>
            We index research that applies machine learning, statistical learning, or NLP to questions substantively about perimenopause, menopause, or post-menopausal health:
          </p>
          <ul style={{ paddingLeft: '18px', margin: '0 0 12px 0', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {[
              'Prediction of menopause onset, timing, or hormonal trajectory',
              'Symptom detection, classification, or unsupervised phenotyping',
              'Post-menopausal risk stratification for cardiovascular, bone, or metabolic outcomes',
              'NLP extraction of menopause-related phenotypes from clinical notes',
              'AI-assisted treatment decision support for hormone therapy',
              'Algorithmic fairness auditing of tools used in women\'s health',
            ].map((item, i) => (
              <li key={i} style={{ fontSize: '14px', color: '#333', lineHeight: 1.6 }}>{item}</li>
            ))}
          </ul>
          <p style={{ fontSize: '13px', color: C.muted, margin: 0 }}>
            General women's health AI papers without menopause-specific findings, and clinical studies without an ML component, are outside scope.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE 3: RESEARCH AREAS ───────────────────────────────────────────────────

function ResearchAreasPage({ setCurrentPage }) {
  return (
    <div>
      <div style={{ backgroundColor: C.navy, padding: '40px 24px 36px', borderBottom: `3px solid ${C.gold}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <SectionLabel>Research Areas</SectionLabel>
          <h1 style={{ fontSize: '2rem', color: '#fff', margin: '0 0 8px 0' }}>Six Research Frontiers</h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.72)', margin: 0, maxWidth: '600px' }}>
            Each area represents a distinct scientific challenge with its own data requirements, methodological landscape, and equity considerations.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ border: `1px solid ${C.border}` }}>
          {AREAS.map((area, i) => (
            <div key={area.id} style={{ padding: '36px', borderBottom: i < AREAS.length - 1 ? `1px solid ${C.border}` : 'none' }}>
              <h2 style={{ fontSize: '1.25rem', color: C.navy, marginBottom: '12px' }}>{area.name}</h2>
              <p style={{ fontSize: '14px', color: '#333', lineHeight: 1.7, marginBottom: '20px', maxWidth: '840px' }}>
                {area.overview}
              </p>
              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.07em', color: C.gold, marginBottom: '8px' }}>
                  Open Challenges
                </p>
                <ul style={{ paddingLeft: '18px', margin: 0, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {area.challenges.map((c, j) => (
                    <li key={j} style={{ fontSize: '13px', color: '#444', lineHeight: 1.6 }}>{c}</li>
                  ))}
                </ul>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.07em', color: C.muted }}>Papers:</span>
                {area.papers.map((p, j) => (
                  <button key={j} onClick={() => setCurrentPage('papers')}
                    style={{ fontSize: '12px', color: C.teal, background: 'none', border: 'none', padding: 0, fontFamily: 'Georgia, serif', textDecoration: 'underline', cursor: 'pointer' }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PAGE 4: PAPERS ───────────────────────────────────────────────────────────

function ArxivCard({ paper }) {
  const year = paper.published?.slice(0, 4);
  return (
    <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', alignItems: 'center' }}>
        {paper.categories.split(' · ').slice(0, 3).map(cat => (
          <Tag key={cat} label={cat} variant="method" />
        ))}
        <span style={{ fontSize: '11px', color: C.mutedLight, marginLeft: '4px' }}>{paper.published}</span>
      </div>
      <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: C.navy, lineHeight: 1.4, margin: 0 }}>
        {paper.title}
      </h3>
      <p style={{ fontSize: '12px', color: C.muted, margin: 0 }}>{paper.authors}{year ? ` · ${year}` : ''}</p>
      <p style={{ fontSize: '13px', color: '#3a3a3a', lineHeight: 1.65, margin: 0 }}>
        {paper.summary?.length > 360 ? paper.summary.slice(0, 360) + '…' : paper.summary}
      </p>
      {paper.link && (
        <a href={paper.link} target="_blank" rel="noreferrer"
          style={{ color: C.teal, fontSize: '13px', textDecoration: 'none', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          View on ArXiv <ExternalLink size={11} />
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
  const [hasSearched, setHasSearched] = useState(false);

  async function doSearch(e) {
    e?.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const papers = await fetchArxiv(query.trim());
      setResults(papers);
      setHasSearched(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={doSearch} style={{ display: 'flex', gap: '0', marginBottom: '20px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: C.mutedLight }} />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="e.g. menopause machine learning hot flash detection"
            style={{ width: '100%', padding: '9px 12px 9px 32px', fontSize: '13px', border: `1px solid ${C.border}`, borderRight: 'none', color: C.text, fontFamily: 'Georgia, serif', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{ padding: '9px 20px', fontSize: '13px', fontWeight: 'bold', backgroundColor: loading ? C.muted : C.navy, color: '#fff', border: 'none', fontFamily: 'Georgia, serif', cursor: loading ? 'default' : 'pointer', whiteSpace: 'nowrap' }}>
          {loading ? 'Searching…' : 'Search ArXiv'}
        </button>
      </form>

      {error && (
        <div style={{ padding: '14px 16px', border: `1px solid #fca5a5`, backgroundColor: '#fef2f2', color: '#991b1b', fontSize: '13px', marginBottom: '16px' }}>
          Error: {error}. The ArXiv API may be temporarily unavailable.
        </div>
      )}

      {hasSearched && !loading && (
        <p style={{ fontSize: '13px', color: C.muted, marginBottom: '16px' }}>
          {results.length} result{results.length !== 1 ? 's' : ''} for <em>"{query}"</em>
        </p>
      )}

      {results.length > 0 && (
        <div style={{ border: `1px solid ${C.border}`, backgroundColor: C.border, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1px' }}>
          {results.map(p => (
            <div key={p.id} style={{ backgroundColor: '#fff' }}>
              <ArxivCard paper={p} />
            </div>
          ))}
        </div>
      )}

      {hasSearched && !loading && results.length === 0 && !error && (
        <div style={{ padding: '48px', textAlign: 'center', border: `1px solid ${C.border}` }}>
          <p style={{ color: C.muted }}>No results found. Try broader search terms.</p>
        </div>
      )}

      {!hasSearched && !loading && (
        <div style={{ padding: '48px', textAlign: 'center', border: `1px solid ${C.border}`, backgroundColor: C.cream }}>
          <p style={{ color: C.muted, fontSize: '14px' }}>Enter a search query above to pull live results from ArXiv.</p>
          <p style={{ color: C.mutedLight, fontSize: '12px', marginTop: '6px' }}>Searches title, abstract, and full text across all arXiv categories.</p>
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
  const [dataF, setDataF] = useState('');

  const areaOptions = [...new Set(PAPERS_DATA.map(p => p.area))];
  const methodOptions = [...new Set(PAPERS_DATA.map(p => p.method))];
  const dataOptions = [...new Set(PAPERS_DATA.map(p => p.dataType))];

  const filtered = PAPERS_DATA.filter(p => {
    if (areaF && p.area !== areaF) return false;
    if (methodF && p.method !== methodF) return false;
    if (dataF && p.dataType !== dataF) return false;
    if (query && !p.title.toLowerCase().includes(query.toLowerCase()) && !p.authors.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const hasFilter = query || areaF || methodF || dataF;

  const filterStyle = {
    fontSize: '13px', padding: '8px 10px', border: `1px solid ${C.border}`,
    color: C.text, background: '#fff', fontFamily: 'Georgia, serif', outline: 'none',
  };

  const tabStyle = (active) => ({
    fontSize: '13px', padding: '10px 18px', background: 'none', border: 'none',
    borderBottom: active ? `2px solid ${C.gold}` : '2px solid transparent',
    color: active ? C.navy : C.muted, fontFamily: 'Georgia, serif',
    fontWeight: active ? 'bold' : 'normal', cursor: 'pointer', marginBottom: '-1px',
  });

  return (
    <div>
      <div style={{ backgroundColor: C.navy, padding: '40px 24px 36px', borderBottom: `3px solid ${C.gold}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <SectionLabel>Papers</SectionLabel>
          <h1 style={{ fontSize: '2rem', color: '#fff', margin: '0 0 8px 0' }}>Research Papers</h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.72)', margin: 0, maxWidth: '600px' }}>
            A curated index of AI and ML research applied to menopause science, plus live ArXiv search.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}`, marginBottom: '28px', paddingTop: '24px' }}>
          <button style={tabStyle(tab === 'curated')} onClick={() => setTab('curated')}>
            Curated Index ({PAPERS_DATA.length})
          </button>
          <button style={tabStyle(tab === 'arxiv')} onClick={() => setTab('arxiv')}>
            Live ArXiv Search
          </button>
        </div>

        {tab === 'curated' && (
          <div style={{ paddingBottom: '60px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <Search size={13} style={{ position: 'absolute', left: '9px', top: '50%', transform: 'translateY(-50%)', color: C.mutedLight }} />
                <input type="text" placeholder="Search title or author…" value={query} onChange={e => setQuery(e.target.value)}
                  style={{ ...filterStyle, paddingLeft: '28px', minWidth: '220px' }} />
              </div>
              <select value={areaF} onChange={e => setAreaF(e.target.value)} style={{ ...filterStyle, minWidth: '160px' }}>
                <option value="">All Areas</option>
                {areaOptions.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
              <select value={methodF} onChange={e => setMethodF(e.target.value)} style={{ ...filterStyle, minWidth: '140px' }}>
                <option value="">All Methods</option>
                {methodOptions.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select value={dataF} onChange={e => setDataF(e.target.value)} style={{ ...filterStyle, minWidth: '140px' }}>
                <option value="">All Data Types</option>
                {dataOptions.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              {hasFilter && (
                <button onClick={() => { setQuery(''); setAreaF(''); setMethodF(''); setDataF(''); }}
                  style={{ ...filterStyle, cursor: 'pointer', color: C.muted }}>
                  Clear ×
                </button>
              )}
            </div>
            <p style={{ fontSize: '13px', color: C.muted, marginBottom: '18px' }}>
              {filtered.length} of {PAPERS_DATA.length} papers
            </p>
            {filtered.length > 0 ? (
              <div style={{ border: `1px solid ${C.border}`, backgroundColor: C.border, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1px' }}>
                {filtered.map(paper => (
                  <div key={paper.id} style={{ backgroundColor: '#fff' }}>
                    <PaperCard paper={paper} />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '60px', textAlign: 'center', border: `1px solid ${C.border}` }}>
                <p style={{ color: C.muted }}>No papers match your filters.</p>
              </div>
            )}
            <div style={{ marginTop: '40px', padding: '24px', backgroundColor: C.goldLight, border: `1px solid #e0d0a0`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <p style={{ fontWeight: 'bold', color: C.navy, margin: '0 0 4px 0' }}>Know a paper we're missing?</p>
                <p style={{ fontSize: '13px', color: C.muted, margin: 0 }}>Submit any AI/ML + menopause paper for review and inclusion.</p>
              </div>
              <button style={{ fontSize: '13px', color: '#fff', backgroundColor: C.navy, border: 'none', padding: '9px 18px', fontFamily: 'Georgia, serif', cursor: 'pointer', fontWeight: 'bold' }}>
                Submit a Paper →
              </button>
            </div>
          </div>
        )}

        {tab === 'arxiv' && (
          <div style={{ paddingBottom: '60px' }}>
            <p style={{ fontSize: '13px', color: C.muted, marginBottom: '20px', maxWidth: '680px', lineHeight: 1.6 }}>
              Live search across the ArXiv preprint server. Results are fetched in real time — these are preprints and may not be peer-reviewed.
            </p>
            <ArxivSearch />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PAGE 5: DATA & TOOLS ─────────────────────────────────────────────────────

function DataToolsPage() {
  return (
    <div>
      <div style={{ backgroundColor: C.navy, padding: '40px 24px 36px', borderBottom: `3px solid ${C.gold}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <SectionLabel>Data & Tools</SectionLabel>
          <h1 style={{ fontSize: '2rem', color: '#fff', margin: '0 0 8px 0' }}>Datasets & Open-Source Tools</h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.72)', margin: 0, maxWidth: '580px' }}>
            Curated data resources and community-built toolkits for menopause AI research.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '56px 24px' }}>
        <section style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: '1.25rem', color: C.navy, marginBottom: '20px' }}>Key Datasets</h2>
          <div style={{ border: `1px solid ${C.border}` }}>
            {DATASETS.map((ds, i) => (
              <div key={i} style={{ padding: '24px 28px', borderBottom: i < DATASETS.length - 1 ? `1px solid ${C.border}` : 'none', backgroundColor: i % 2 === 0 ? '#fff' : C.cream }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '10px', flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: C.navy, margin: 0 }}>{ds.name}</h3>
                  <AccessTag type={ds.access} />
                </div>
                <p style={{ fontSize: '13px', color: '#333', lineHeight: 1.65, marginBottom: '10px', maxWidth: '720px' }}>{ds.description}</p>
                <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '12px', color: C.muted }}><strong>Scale:</strong> {ds.scale}</span>
                  <span style={{ fontSize: '12px', color: C.muted }}><strong>Demographics:</strong> {ds.demographics}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 style={{ fontSize: '1.25rem', color: C.navy, marginBottom: '20px' }}>Tools & Code Libraries</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1px', border: `1px solid ${C.border}`, backgroundColor: C.border }}>
            {TOOLS.map((tool, i) => (
              <div key={i} style={{ backgroundColor: '#fff', padding: '26px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: C.navy, margin: 0 }}>{tool.name}</h3>
                  <Tag label="Open Source" variant="code" />
                </div>
                <p style={{ fontSize: '13px', color: C.muted, lineHeight: 1.65, marginBottom: '18px' }}>{tool.description}</p>
                <button style={{ fontSize: '13px', color: C.text, border: `1px solid ${C.border}`, padding: '7px 14px', background: 'none', fontFamily: 'Georgia, serif', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <Github size={13} /> View on GitHub
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

// ─── PAGE 6: BLOG ─────────────────────────────────────────────────────────────

const POST_TYPES = ['All', 'Paper Spotlight', 'Field Overview', 'Methods Explainer', 'Open Problem'];

function BlogPage() {
  const [activeType, setActiveType] = useState('All');
  const visible = activeType === 'All' ? BLOG_POSTS : BLOG_POSTS.filter(p => p.type === activeType);

  return (
    <div>
      <div style={{ backgroundColor: C.navy, padding: '40px 24px 36px', borderBottom: `3px solid ${C.gold}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <SectionLabel>Blog</SectionLabel>
          <h1 style={{ fontSize: '2rem', color: '#fff', margin: '0 0 8px 0' }}>Research Perspectives</h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.72)', margin: 0 }}>
            Paper spotlights, field overviews, methods explainers, and open problems.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px 60px' }}>
        <div style={{ display: 'flex', gap: '0', borderBottom: `1px solid ${C.border}`, marginBottom: '32px', flexWrap: 'wrap' }}>
          {POST_TYPES.map(type => (
            <button key={type} onClick={() => setActiveType(type)}
              style={{ fontSize: '13px', padding: '9px 16px', background: 'none', border: 'none',
                borderBottom: activeType === type ? `2px solid ${C.gold}` : '2px solid transparent',
                color: activeType === type ? C.navy : C.muted, fontFamily: 'Georgia, serif',
                fontWeight: activeType === type ? 'bold' : 'normal', cursor: 'pointer', marginBottom: '-1px' }}>
              {type}
            </button>
          ))}
        </div>

        {visible.length > 0 ? (
          <div style={{ border: `1px solid ${C.border}` }}>
            {visible.map((post, i) => (
              <div key={post.id} style={{ padding: '28px', borderBottom: i < visible.length - 1 ? `1px solid ${C.border}` : 'none', backgroundColor: i % 2 === 0 ? '#fff' : C.cream }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                  <Tag label={post.type} variant="postType" />
                  <span style={{ fontSize: '12px', color: C.mutedLight }}>{post.date}</span>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: C.navy, marginBottom: '8px', lineHeight: 1.4 }}>{post.title}</h3>
                <p style={{ fontSize: '14px', color: C.muted, lineHeight: 1.65, marginBottom: '12px', maxWidth: '720px' }}>{post.summary}</p>
                <a href="#" style={{ color: C.teal, fontSize: '13px', textDecoration: 'none' }} onClick={e => e.preventDefault()}>Read →</a>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '48px', textAlign: 'center', border: `1px solid ${C.border}` }}>
            <p style={{ color: C.muted }}>No posts in this category yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PAGE 7: GET INVOLVED ─────────────────────────────────────────────────────

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

  const inputStyle = {
    width: '100%', padding: '8px 10px', fontSize: '13px', border: `1px solid ${C.border}`,
    color: C.text, fontFamily: 'Georgia, serif', outline: 'none', boxSizing: 'border-box', background: '#fff',
  };

  return (
    <div>
      <div style={{ backgroundColor: C.navy, padding: '40px 24px 36px', borderBottom: `3px solid ${C.gold}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <SectionLabel>Get Involved</SectionLabel>
          <h1 style={{ fontSize: '2rem', color: '#fff', margin: '0 0 8px 0' }}>Join the Initiative</h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.72)', margin: 0, maxWidth: '580px' }}>
            Researchers, clinicians, data scientists, and patient advocates are all welcome.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '56px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1px', border: `1px solid ${C.border}`, backgroundColor: C.border, marginBottom: '56px' }}>
          {/* Submit */}
          <div style={{ backgroundColor: '#fff', padding: '32px' }}>
            <h2 style={{ fontSize: '1.2rem', color: C.navy, marginBottom: '8px' }}>Submit a Paper</h2>
            <p style={{ fontSize: '13px', color: C.muted, marginBottom: '20px', lineHeight: 1.6 }}>
              Know a paper we haven't indexed? We review all submissions within two weeks.
            </p>
            {submitted ? (
              <div style={{ backgroundColor: C.goldLight, border: `1px solid #d4b46a`, padding: '16px', textAlign: 'center' }}>
                <p style={{ color: C.navy, fontWeight: 'bold', margin: '0 0 8px 0' }}>Thank you — submission received.</p>
                <button onClick={() => { setSubmitted(false); setForm({ title: '', authors: '', doi: '', area: '' }); }}
                  style={{ fontSize: '12px', color: C.muted, background: 'none', border: 'none', fontFamily: 'Georgia, serif', cursor: 'pointer' }}>
                  Submit another →
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { key: 'title', label: 'Title', placeholder: 'Full paper title', required: true },
                  { key: 'authors', label: 'Authors', placeholder: 'Last FM, Last FM, …', required: false },
                ].map(field => (
                  <div key={field.key}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.06em', color: C.muted, marginBottom: '5px' }}>
                      {field.label} {field.required && <span style={{ color: C.gold }}>*</span>}
                    </label>
                    <input type="text" placeholder={field.placeholder} value={form[field.key]}
                      onChange={e => setForm(d => ({ ...d, [field.key]: e.target.value }))} style={inputStyle} />
                  </div>
                ))}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.06em', color: C.muted, marginBottom: '5px' }}>DOI</label>
                    <input type="text" placeholder="10.xxxx/xxxxx" value={form.doi}
                      onChange={e => setForm(d => ({ ...d, doi: e.target.value }))} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.06em', color: C.muted, marginBottom: '5px' }}>Area</label>
                    <select value={form.area} onChange={e => setForm(d => ({ ...d, area: e.target.value }))}
                      style={{ ...inputStyle }}>
                      <option value="">Select…</option>
                      {AREAS.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                  </div>
                </div>
                <button onClick={() => { if (form.title.trim()) setSubmitted(true); }}
                  style={{ padding: '10px', fontSize: '13px', fontWeight: 'bold', backgroundColor: C.navy, color: '#fff', border: 'none', fontFamily: 'Georgia, serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}>
                  <Send size={13} /> Submit Paper
                </button>
              </div>
            )}
          </div>

          {/* Collaborate */}
          <div style={{ backgroundColor: C.cream, padding: '32px', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '1.2rem', color: C.navy, marginBottom: '8px' }}>Collaborate</h2>
            <p style={{ fontSize: '13px', color: C.muted, lineHeight: 1.7, marginBottom: '12px' }}>
              We welcome collaborations with clinical researchers, data scientists, patient advocacy organizations, and health systems — especially those working with under-studied populations.
            </p>
            <p style={{ fontSize: '13px', color: C.muted, lineHeight: 1.7 }}>
              If you're interested in co-developing methodological standards, contributing datasets, or joining our editorial board, reach out.
            </p>
            <button style={{ marginTop: 'auto', paddingTop: '24px', padding: '10px', fontSize: '13px', color: C.navy, border: `1px solid ${C.navy}`, background: 'none', fontFamily: 'Georgia, serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer', marginTop: '24px' }}>
              <Mail size={13} /> Get in Touch
            </button>
          </div>
        </div>

        {/* Funding */}
        <section style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: '1.25rem', color: C.navy, marginBottom: '20px' }}>Funding Opportunities</h2>
          <div style={{ border: `1px solid ${C.border}` }}>
            {funding.map((f, i) => (
              <div key={i} style={{ padding: '16px 24px', borderBottom: i < funding.length - 1 ? `1px solid ${C.border}` : 'none', display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap', backgroundColor: i % 2 === 0 ? '#fff' : C.cream }}>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: C.navy, minWidth: '140px' }}>{f.org}</span>
                <span style={{ fontSize: '13px', color: C.muted, lineHeight: 1.6, flex: 1 }}>{f.focus}</span>
                <a href="#" style={{ fontSize: '12px', color: C.teal, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }} onClick={e => e.preventDefault()}>
                  Learn more <ExternalLink size={11} />
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Mailing list */}
        <div style={{ backgroundColor: C.navy, padding: '36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', color: '#fff', margin: '0 0 6px 0' }}>Stay current with menopause AI research</h3>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', margin: 0 }}>Monthly digest of new papers, datasets, and field updates.</p>
          </div>
          <div style={{ display: 'flex', gap: '0' }}>
            <input type="email" placeholder="you@institution.edu"
              style={{ padding: '10px 14px', fontSize: '13px', border: 'none', fontFamily: 'Georgia, serif', outline: 'none', minWidth: '240px', boxSizing: 'border-box' }} />
            <button style={{ padding: '10px 20px', fontSize: '13px', fontWeight: 'bold', backgroundColor: C.gold, color: C.navy, border: 'none', fontFamily: 'Georgia, serif', cursor: 'pointer' }}>
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────

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
    <div style={{ backgroundColor: C.bg, minHeight: '100vh', color: C.text }}>
      <Nav currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main>{pages[currentPage]}</main>
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}

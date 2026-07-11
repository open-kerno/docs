import type {ReactNode} from 'react';
import {useState} from 'react';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import {
  Hexagon, Package,
  Copy, Check,
  FileCode2, Blocks, Zap,
} from 'lucide-react';

// lucide-react dropped the Github icon — use an inline SVG instead
function Github({className}: {className?: string}) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
      <path d="M9 18c-4.51 2-5-2-7-2"/>
    </svg>
  );
}

// ── Data ────────────────────────────────────────────────────────

type Lang = 'nodejs' | 'go' | 'python' | 'rust';

const LANGS: {id: Lang; label: string}[] = [
  {id: 'nodejs', label: 'Node.js'},
  {id: 'go', label: 'Go'},
  {id: 'python', label: 'Python'},
  {id: 'rust', label: 'Rust'},
];

const COMMANDS: Record<Lang, {cmd: string; repo: string; file: string}> = {
  nodejs: {cmd: 'npm install @open-kerno/commons', repo: 'github.com/open-kerno/commons-ts', file: 'package.json'},
  go: {cmd: 'go get github.com/open-kerno/commons-go', repo: 'github.com/open-kerno/commons-go', file: 'go.mod'},
  python: {cmd: 'pip install open-kerno-commons', repo: 'github.com/open-kerno/commons-py', file: 'current environment'},
  rust: {cmd: 'cargo add open-kerno-commons', repo: 'github.com/open-kerno/commons-rs', file: 'Cargo.toml'},
};

const FEATURES = [
  {Icon: FileCode2, title: 'TypeScript Native', desc: 'Written entirely in TypeScript with strict mode enabled. Enjoy flawless autocompletion, type safety, and robust internal interfaces out of the box.'},
  {Icon: Blocks, title: 'Modular Design', desc: 'Import only what you need. From error handlers to data mappers and utility wrappers, keep your backend bundles lean and performant.'},
  {Icon: Zap, title: 'MVP Ready', desc: 'Skip the repetitive setup phase. Our battle-tested components are specifically designed to help startups and makers launch their APIs faster.'},
];

const APPS = [
  {name: 'weapon-x', description: 'Feature flags & remote config. A self-hosted Statsig alternative.', github: 'https://github.com/open-kerno/weapon-x', badge: 'Feature Flags'},
  {name: 'app-mock-2', description: 'Placeholder application. Coming soon.', github: 'https://github.com/open-kerno'},
  {name: 'app-mock-3', description: 'Placeholder application. Coming soon.', github: 'https://github.com/open-kerno'},
  {name: 'app-mock-4', description: 'Placeholder application. Coming soon.', github: 'https://github.com/open-kerno'},
  {name: 'app-mock-5', description: 'Placeholder application. Coming soon.', github: 'https://github.com/open-kerno'},
  {name: 'app-mock-6', description: 'Placeholder application. Coming soon.', github: 'https://github.com/open-kerno'},
];

// ── Helpers ──────────────────────────────────────────────────────

function copyText(text: string, cb: () => void) {
  const fallback = () => {
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed';
    document.body.appendChild(ta); ta.focus(); ta.select();
    try { document.execCommand('copy'); cb(); } catch (_) {}
    document.body.removeChild(ta);
  };
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(cb).catch(fallback);
  } else { fallback(); }
}

// ── Reusable command box ─────────────────────────────────────────

function CmdBox({cmd}: {cmd: string}) {
  const [copied, setCopied] = useState(false);
  function copy() {
    copyText(cmd, () => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }
  return (
    <div className="relative bg-okc-black border border-okc-cobalt rounded-xl p-1 shadow-glow transition-shadow duration-300 hover:shadow-glow-intense flex items-center overflow-hidden group">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-ribbon" />
      <div className="flex-grow pl-4 pr-2 py-3 font-mono text-sm md:text-base text-okc-white overflow-x-auto whitespace-nowrap text-left flex items-center">
        <span className="text-okc-cyan mr-2">$</span>
        <span>{cmd}</span>
      </div>
      <button onClick={copy} aria-label="Copy command"
        className={clsx(
          'p-2 rounded-lg transition-all duration-200 flex-shrink-0 active:scale-95 flex items-center justify-center min-w-[44px]',
          copied
            ? 'bg-okc-cobalt/40 border border-okc-cyan text-okc-cyan'
            : 'bg-okc-cobalt/20 hover:bg-okc-cobalt text-okc-white group-hover:bg-okc-cobalt/50',
        )}>
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
}

// ── Sections ────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="w-full pt-24 pb-20 md:pt-32 md:pb-28 px-4 flex flex-col items-center justify-center text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-okc-cobalt bg-okc-cobalt/10 text-okc-cyan text-xs font-semibold uppercase tracking-wider mb-8 shadow-glow">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-okc-cyan opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-okc-cyan" />
        </span>
        v1.2.0 is now live
      </div>

      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mb-6">
        Ship your MVP{' '}
        <br className="hidden md:block" />
        <span className="text-ribbon leading-tight">Fast &amp; Reliably.</span>
      </h1>

      <p className="text-lg md:text-xl text-okc-white/70 max-w-2xl mb-10 leading-relaxed">
        <strong className="text-okc-white font-semibold">@open-kerno/commons</strong> provides the essential,
        robust TypeScript backend components so you can focus on building your product, not boilerplate.
      </p>

      <div className="w-full max-w-md mx-auto mb-10">
        <CmdBox cmd="npm install @open-kerno/commons" />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full">
        <Link to="/intro"
          className="px-8 py-3.5 rounded-lg bg-gradient-ribbon text-okc-white font-bold tracking-wide shadow-ribbon hover:shadow-ribbon-hover transform hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto text-center border border-white/10">
          Read the Documentation
        </Link>
        <a href="https://github.com/open-kerno" target="_blank" rel="noopener noreferrer"
          className="px-8 py-3.5 rounded-lg bg-transparent border border-okc-cobalt hover:bg-okc-cobalt/10 text-okc-white font-semibold tracking-wide transition-all duration-300 w-full sm:w-auto text-center shadow-glow">
          View Source
        </a>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="w-full py-20 px-4 border-t border-okc-cobalt/30 bg-gradient-to-b from-okc-black to-okc-cobalt/5 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Open Kerno?</h2>
          <p className="text-okc-white/60">Built for modern TypeScript backend ecosystems.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {FEATURES.map(({Icon, title, desc}) => (
            <div key={title} className="bg-okc-black border border-okc-cobalt rounded-2xl p-8 hover:border-okc-electric/50 transition-all duration-300 group hover:-translate-y-1 transform">
              <div className="w-12 h-12 rounded-xl bg-gradient-ribbon p-0.5 mb-6 shadow-glow">
                <div className="w-full h-full bg-okc-black rounded-[10px] flex items-center justify-center">
                  <Icon className="w-6 h-6 text-okc-cyan group-hover:text-okc-white transition-colors duration-300" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-okc-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-ribbon transition-all duration-300">
                {title}
              </h3>
              <p className="text-okc-white/60 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CommonsSection() {
  const [active, setActive] = useState<Lang>('nodejs');
  const {cmd, repo, file} = COMMANDS[active];

  return (
    <section className="w-full py-20 px-4 border-t border-okc-cobalt/30 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Commons Libraries</h2>
          <p className="text-okc-white/60">
            📦 Shared core utilities, base configurations, and essential building blocks for open-kerno projects.
          </p>
        </div>

        <div className="flex gap-2 justify-center flex-wrap mb-6">
          {LANGS.map(({id, label}) => (
            <button key={id} onClick={() => setActive(id)}
              className={clsx(
                'px-5 py-1.5 rounded-full border text-sm font-medium transition-all duration-200 cursor-pointer',
                active === id
                  ? 'bg-gradient-ribbon border-transparent text-okc-white'
                  : 'border-okc-cobalt text-okc-white/70 hover:border-okc-electric hover:text-okc-white bg-transparent',
              )}>
              {label}
            </button>
          ))}
        </div>

        <div className="w-full max-w-lg mx-auto mb-4">
          <CmdBox cmd={cmd} />
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-okc-white/50 flex-wrap">
          <Github className="w-3.5 h-3.5" />
          <a href={`https://${repo}`} target="_blank" rel="noopener noreferrer"
            className="text-okc-electric hover:text-okc-cyan transition-colors">
            {repo}
          </a>
          <span className="opacity-40">·</span>
          <span>
            Updates{' '}
            <code className="bg-okc-cobalt/20 border border-okc-cobalt/40 rounded px-1 text-okc-cyan text-xs">{file}</code>
          </span>
        </div>
      </div>
    </section>
  );
}

function AppsSection() {
  return (
    <section className="w-full py-20 px-4 border-t border-okc-cobalt/30 bg-gradient-to-b from-okc-black to-okc-cobalt/5 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Applications</h2>
          <p className="text-okc-white/60">Open-source applications built on the Open Kerno platform.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {APPS.map((app) => (
            <div key={app.name} className="bg-okc-black border border-okc-cobalt rounded-2xl p-6 hover:border-okc-electric/50 transition-all duration-300 group hover:-translate-y-1 transform flex flex-col gap-3 relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-gradient-ribbon opacity-0 blur-xl group-hover:opacity-10 transition-opacity" />
              {app.badge && (
                <span className="self-start px-2.5 py-0.5 rounded-full bg-gradient-ribbon text-white text-xs font-bold uppercase tracking-widest">
                  {app.badge}
                </span>
              )}
              <p className="text-okc-white/70 text-sm font-mono">
                open-kerno/<strong className="text-okc-white font-semibold">{app.name}</strong>
              </p>
              <p className="text-okc-white/50 text-sm leading-relaxed flex-1">{app.description}</p>
              <a href={app.github} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-okc-electric hover:text-okc-cyan text-sm font-medium transition-colors duration-200">
                <Github className="w-4 h-4" />
                View on GitHub
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PageFooter() {
  return (
    <footer className="w-full border-t border-okc-cobalt/40 bg-okc-black py-8 px-4 z-10 relative">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Hexagon className="text-okc-cobalt w-5 h-5" />
          <span className="text-okc-white/50 text-sm">© 2026 Open Kerno. MIT Licensed.</span>
        </div>
        <div className="flex gap-6">
          <a href="https://github.com/open-kerno" target="_blank" rel="noopener noreferrer"
            className="text-okc-white/50 hover:text-okc-cyan transition-colors duration-200">
            <span className="sr-only">GitHub</span>
            <Github className="w-5 h-5" />
          </a>
          <a href="https://www.npmjs.com/package/@open-kerno/commons" target="_blank" rel="noopener noreferrer"
            className="text-okc-white/50 hover:text-okc-electric transition-colors duration-200">
            <span className="sr-only">NPM</span>
            <Package className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}

// ── Page ─────────────────────────────────────────────────────────

export default function Home(): ReactNode {
  return (
    <>
      <Head>
        <title>Open Kerno | Backend Essentials for MVPs</title>
        <meta name="description" content="Shared core utilities, base configurations, and essential building blocks for open-kerno projects." />
        <style>{`
          .okc-page {
            background-color: #000000;
            color: #FFFFFF;
            -webkit-font-smoothing: antialiased;
          }
          .okc-page .bg-grid {
            background-size: 40px 40px;
            background-image: linear-gradient(to right, rgba(0, 58, 140, 0.15) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(0, 58, 140, 0.15) 1px, transparent 1px);
            mask-image: linear-gradient(to bottom, black 40%, transparent 100%);
            -webkit-mask-image: linear-gradient(to bottom, black 40%, transparent 100%);
          }
          .okc-page .text-ribbon {
            background: linear-gradient(135deg, #0F62FE, #00D8F6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-shadow: 0px 4px 15px rgba(0, 58, 140, 0.5);
          }
          .okc-page::-webkit-scrollbar { width: 8px; }
          .okc-page::-webkit-scrollbar-track { background: #000000; }
          .okc-page::-webkit-scrollbar-thumb { background: #003A8C; border-radius: 4px; }
          .okc-page::-webkit-scrollbar-thumb:hover { background: #0F62FE; }
        `}</style>
      </Head>

      <div className="okc-page min-h-screen flex flex-col relative overflow-x-hidden selection:bg-okc-electric selection:text-okc-white">
        {/* Ambient glow */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-okc-cobalt opacity-20 blur-[120px] pointer-events-none" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-okc-electric opacity-10 blur-[100px] pointer-events-none" />

        {/* Nav */}
        <nav className="w-full border-b border-okc-cobalt/40 bg-okc-black/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hexagon className="text-okc-cyan w-6 h-6" />
              <span className="font-bold text-xl tracking-tight text-okc-white">
                Open<span className="text-ribbon">Kerno</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <a href="https://www.npmjs.com/package/@open-kerno/commons" target="_blank" rel="noopener noreferrer"
                className="text-okc-white/70 hover:text-okc-white transition-colors duration-200 flex items-center gap-1.5 text-sm font-medium">
                <Package className="w-4 h-4" /> NPM
              </a>
              <a href="https://github.com/open-kerno/commons-ts" target="_blank" rel="noopener noreferrer"
                className="text-okc-white/70 hover:text-okc-white transition-colors duration-200 flex items-center gap-1.5 text-sm font-medium">
                <Github className="w-4 h-4" /> GitHub
              </a>
            </div>
          </div>
        </nav>

        {/* Content */}
        <main className="flex-grow flex flex-col relative z-10">
          <div className="absolute inset-0 bg-grid pointer-events-none -z-10" />
          <Hero />
          <FeaturesSection />
          <CommonsSection />
          <AppsSection />
        </main>

        <PageFooter />
      </div>
    </>
  );
}

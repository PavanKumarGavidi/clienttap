import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { auth } from '../lib/auth';
import { plans } from '../data/mockData';
import { 
  Zap, Shield, Users, FileText, CreditCard, MessageSquare, Star, 
  ArrowRight, Check, Menu, X, ChevronDown, BarChart3,
  Globe, Lock, Download, Clock, TrendingUp, Award, Sparkles,
  Quote, Cookie
} from 'lucide-react';

export default function MarketingSite() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [isIndia, setIsIndia] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [cookieOpen, setCookieOpen] = useState(() => {
    // Check if user has already accepted cookies
    const accepted = localStorage.getItem('clienttap-cookies-accepted');
    return !accepted;
  });
  const [journeyStep, setJourneyStep] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    auth.isAuthenticated().then(setIsAuthenticated);
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem('clienttap-cookies-accepted', 'true');
    setCookieOpen(false);
  };

  const handleRejectCookies = () => {
    localStorage.setItem('clienttap-cookies-accepted', 'false');
    setCookieOpen(false);
  };

  const journeyActs = [
    { title: 'The lead', subtitle: 'Act I', steps: ['New enquiry lands in pipeline', 'Auto-tagged by source', 'Assigned to team member', 'Follow-up reminder set'] },
    { title: 'The client', subtitle: 'Act II', steps: ['Lead converted to client', 'Portal access enabled', 'Welcome email sent', 'Project created'] },
    { title: 'The work', subtitle: 'Act III', steps: ['Tasks assigned to team', 'Progress tracked visually', 'Files shared with client', 'Updates posted in portal'] },
    { title: 'Her side', subtitle: 'Act IV', steps: ['Client logs into portal', 'Reviews project progress', 'Approves deliverables', 'Downloads shared files'] },
    { title: 'The loop', subtitle: 'Act V', steps: ['Invoice auto-generated', 'Payment received & tracked', 'Review request sent', 'Referral captured'] },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFF8F2', color: '#1C1917' }}>
      {/* Announcement Bar */}
      <div className="text-center py-2 text-sm font-medium text-white" style={{ background: 'linear-gradient(90deg, #ea580c, #f97316)' }}>
        <span className="inline-flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          New: Introducing the Marketplace — Get discovered by clients worldwide
          <button onClick={() => navigate('/signup')} className="underline ml-2 font-semibold">Learn more →</button>
        </span>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md border-b" style={{ backgroundColor: 'rgba(255,248,242,0.9)', borderColor: '#E7E5E4' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <span className="text-xl font-bold tracking-tight">Client<span style={{ color: '#ea580c' }}>Tap</span></span>
              </div>
              <div className="hidden lg:flex items-center gap-6">
                <button className="text-sm font-medium flex items-center gap-1 transition hover:text-orange-600" style={{ color: '#78716C' }}>
                  Solutions <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => navigate('/pricing')} className="text-sm font-medium transition hover:text-orange-600" style={{ color: '#78716C' }}>Pricing</button>
                <button className="text-sm font-medium transition hover:text-orange-600" style={{ color: '#78716C' }}>Marketplace</button>
                <button className="text-sm font-medium flex items-center gap-1 transition hover:text-orange-600" style={{ color: '#78716C' }}>
                  Free Tools <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button className="text-sm font-medium transition hover:text-orange-600" style={{ color: '#78716C' }}>Contact</button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <button onClick={() => navigate('/app/dashboard')} className="hidden sm:block text-sm font-medium transition hover:text-orange-600" style={{ color: '#78716C' }}>Go to app</button>
                  <button onClick={() => navigate('/app/dashboard')} className="btn-primary text-sm !py-2 !px-4">Dashboard</button>
                </>
              ) : (
                <>
                  <button onClick={() => navigate('/login')} className="hidden sm:block text-sm font-medium transition hover:text-orange-600" style={{ color: '#78716C' }}>Sign in</button>
                  <button onClick={() => navigate('/signup')} className="btn-primary text-sm !py-2 !px-4">Start free</button>
                </>
              )}
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2">
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="lg:hidden border-t px-4 py-4 space-y-3 bg-white" style={{ borderColor: '#E7E5E4' }}>
            <button className="block text-sm font-medium py-2 text-left">Solutions</button>
            <button onClick={() => { navigate('/pricing'); setMobileMenuOpen(false); }} className="block text-sm font-medium py-2 text-left">Pricing</button>
            <button className="block text-sm font-medium py-2 text-left">Marketplace</button>
            <button className="block text-sm font-medium py-2 text-left">Free Tools</button>
            <button className="block text-sm font-medium py-2 text-left">Contact</button>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 -left-20 w-96 h-96 rounded-full opacity-20 animate-drift" style={{ background: 'radial-gradient(circle, #fdba74, transparent)' }} />
          <div className="absolute bottom-20 -right-20 w-80 h-80 rounded-full opacity-15 animate-drift" style={{ background: 'radial-gradient(circle, #fb923c, transparent)', animationDelay: '4s' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-display font-extrabold tracking-tight leading-tight" style={{ color: '#1C1917' }}>
              Run every client from first enquiry to{' '}
              <span className="font-serif-display font-normal" style={{ color: '#ea580c' }}>final payment</span>
            </h1>
            <p className="mt-6 text-lg max-w-measure mx-auto" style={{ color: '#78716C' }}>
              One login for leads, quotes, e-signed contracts, projects, your client portal, invoices and payment tracking. Built for agencies and established freelancers, in about 30 currencies, with GST-compliant invoicing in India.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => navigate('/signup')} className="btn-primary text-base flex items-center gap-2">
                Start free <ArrowRight className="w-5 h-5" />
              </button>
              <button onClick={() => navigate('/demo')} className="px-8 py-3.5 rounded-xl text-base font-semibold transition border hover:bg-white/50" style={{ borderColor: '#E7E5E4', color: '#1C1917' }}>
                See how it works
              </button>
            </div>
            <p className="mt-4 text-xs" style={{ color: '#A8A29E' }}>
              No credit card required · Free forever plan · Setup in 2 minutes
            </p>
            
            {/* Trust strip */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm" style={{ color: '#78716C' }}>
              <span className="flex items-center gap-1.5"><Lock className="w-4 h-4" /> Encrypted in transit</span>
              <span className="flex items-center gap-1.5"><Shield className="w-4 h-4" /> Per-account data isolation</span>
              <span className="flex items-center gap-1.5"><Download className="w-4 h-4" /> Export anytime</span>
              <span className="flex items-center gap-1.5"><CreditCard className="w-4 h-4" /> No card required to start</span>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-16 max-w-5xl mx-auto animate-float-slow">
            <div className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: '#E7E5E4', boxShadow: '0 40px 80px -20px rgba(67,36,16,0.20)' }}>
              <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: '#E7E5E4' }}>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#fca5a5' }} />
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#fcd34d' }} />
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#86efac' }} />
                </div>
                <span className="text-xs ml-2" style={{ color: '#A8A29E' }}>app.clienttap.io/dashboard</span>
              </div>
              <div className="p-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Pipeline Value', value: '₹18.5L', change: '+12%' },
                  { label: 'Revenue (Jan)', value: '₹6.25L', change: '+24%' },
                  { label: 'Active Clients', value: '6', change: '+2' },
                  { label: 'Win Rate', value: '68%', change: '+5%' },
                ].map((stat, i) => (
                  <div key={i} className="p-4 rounded-xl" style={{ backgroundColor: '#FAFAF8' }}>
                    <p className="text-xs mb-1" style={{ color: '#78716C' }}>{stat.label}</p>
                    <p className="text-2xl font-bold" style={{ color: '#1C1917' }}>{stat.value}</p>
                    <p className="text-xs mt-1" style={{ color: '#16a34a' }}>{stat.change}</p>
                  </div>
                ))}
              </div>
              <div className="px-6 pb-6">
                <div className="rounded-xl p-4" style={{ backgroundColor: '#FAFAF8' }}>
                  <div className="flex items-end gap-2 h-20">
                    {[45, 62, 55, 78, 68, 85].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full rounded-t-sm bg-gradient-to-t from-orange-600 to-orange-400" style={{ height: `${h}%` }} />
                        <span className="text-[10px]" style={{ color: '#A8A29E' }}>{['Aug','Sep','Oct','Nov','Dec','Jan'][i]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <section className="py-8 border-y overflow-hidden" style={{ borderColor: '#E7E5E4', backgroundColor: '#FAEFE2' }}>
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, setIdx) => (
            <div key={setIdx} className="flex items-center gap-6 px-3">
              {['Spreadsheets', 'Word invoices', 'WhatsApp threads', 'Sticky notes', 'Email chains', 'Calendar apps', 'Payment trackers', 'Reminder alarms'].map((tool, i) => (
                <span key={i} className="text-sm font-medium px-5 py-2.5 rounded-full border" style={{ borderColor: '#E7E5E4', color: '#78716C', backgroundColor: 'rgba(255,255,255,0.7)' }}>
                  {tool}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Old way vs New way */}
      <section className="py-24" style={{ backgroundColor: '#FFF8F2' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-display-sm font-bold" style={{ color: '#1C1917' }}>One app instead of <span className="font-serif-display" style={{ color: '#ea580c' }}>ten tabs</span></h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl border" style={{ borderColor: '#fecaca', backgroundColor: '#fef2f2' }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#991b1b' }}>The old way</h3>
              <ul className="space-y-3">
                {['Spreadsheets for leads', 'Separate invoicing tool', 'Email for client comms', 'Google Drive for files', 'No client portal', 'Manual follow-ups', 'No verified reviews'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm" style={{ color: '#78716C' }}>
                    <X className="w-4 h-4 shrink-0" style={{ color: '#dc2626' }} /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-8 rounded-2xl border" style={{ borderColor: '#bbf7d0', backgroundColor: '#f0fdf4' }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#166534' }}>With ClientTap</h3>
              <ul className="space-y-3">
                {['Visual CRM pipeline', 'Built-in GST invoicing', 'In-app messaging', 'Project file storage', 'Branded client portal', 'Auto follow-up reminders', 'Verified review system'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm" style={{ color: '#78716C' }}>
                    <Check className="w-4 h-4 shrink-0" style={{ color: '#16a34a' }} /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5-act Journey */}
      <section className="py-24" style={{ backgroundColor: '#FAEFE2' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-display-sm font-bold" style={{ color: '#1C1917' }}>One client, <span className="font-serif-display" style={{ color: '#ea580c' }}>end to end</span></h2>
            <p className="mt-4 text-lg max-w-measure mx-auto" style={{ color: '#78716C' }}>5 acts, every step covered.</p>
          </div>

          <div className="flex items-center justify-center gap-2 mb-12 flex-wrap">
            {journeyActs.map((act, i) => (
              <button
                key={i}
                onClick={() => setJourneyStep(i)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition ${
                  journeyStep === i ? 'text-white' : 'hover:bg-white/50'
                }`}
                style={journeyStep === i ? { backgroundColor: '#ea580c' } : { color: '#78716C' }}
              >
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs" style={journeyStep === i ? { backgroundColor: 'rgba(255,255,255,0.2)' } : { backgroundColor: '#E7E5E4' }}>{i + 1}</span>
                <span className="hidden sm:inline">{act.title}</span>
              </button>
            ))}
          </div>

          <div className="rounded-2xl border bg-white p-8" style={{ borderColor: '#E7E5E4', boxShadow: '0 10px 40px -8px rgba(28,25,23,0.12)' }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#ea580c' }}>{journeyActs[journeyStep].subtitle}</p>
                <h3 className="text-2xl font-bold mb-6" style={{ color: '#1C1917' }}>{journeyActs[journeyStep].title}</h3>
                <div className="space-y-3">
                  {journeyActs[journeyStep].steps.map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#fff7ed' }}>
                        <Check className="w-3.5 h-3.5" style={{ color: '#ea580c' }} />
                      </div>
                      <span className="text-sm" style={{ color: '#1C1917' }}>{step}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => navigate('/signup')} className="mt-8 btn-primary text-sm inline-flex items-center gap-2">
                  Get started <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="rounded-xl p-8 aspect-video flex items-center justify-center" style={{ backgroundColor: '#FAFAF8' }}>
                <div className="text-center">
                  <div className="text-5xl mb-3">
                    {journeyStep === 0 && '🎯'}
                    {journeyStep === 1 && '🤝'}
                    {journeyStep === 2 && '⚡'}
                    {journeyStep === 3 && '👩‍💼'}
                    {journeyStep === 4 && '🔄'}
                  </div>
                  <p className="text-sm" style={{ color: '#78716C' }}>Interactive demo</p>
                </div>
              </div>
            </div>
          </div>
          <p className="text-center mt-8 text-lg font-semibold" style={{ color: '#1C1917' }}>
            One client. Not one <span className="font-serif-display" style={{ color: '#ea580c' }}>spreadsheet</span>.
          </p>
        </div>
      </section>

      {/* Verified Reviews - Espresso band */}
      <section className="py-24" style={{ backgroundColor: '#17100B' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-display-sm font-bold" style={{ color: '#EFE4D8' }}>Verified reviews, <span className="font-serif-display" style={{ color: '#fb923c' }}>built in</span></h2>
            <p className="mt-4 text-lg" style={{ color: '#A08A76' }}>Every review comes from a real client who completed a project.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            {[
              { name: 'James Wilson', rating: 5, text: 'Outstanding brand identity work. Their attention to detail exceeded our expectations.' },
              { name: 'Vikram Malhotra', rating: 5, text: 'Exceptional CRM integration. Responsive, professional, delivered ahead of schedule.' },
              { name: 'Sarah Miller', rating: 4, text: 'Great design work and smooth collaboration. Would love to work together again.' },
            ].map((review, i) => (
              <div key={i} className="p-6 rounded-2xl border" style={{ borderColor: '#3B291D', backgroundColor: '#231710' }}>
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className={`w-4 h-4 ${j < review.rating ? 'fill-orange-400' : ''}`} style={{ color: j < review.rating ? '#fb923c' : '#3B291D' }} />
                  ))}
                </div>
                <p className="text-sm mb-4" style={{ color: '#EFE4D8' }}>"{review.text}"</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: '#A08A76' }}>{review.name}</span>
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(34,197,94,0.15)', color: '#86efac' }}>
                    <Check className="w-3 h-3" /> Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { num: '01', title: 'Collected automatically', desc: 'Review requests sent when projects complete' },
              { num: '02', title: 'Genuinely verified', desc: 'Only authenticated portal clients can review' },
              { num: '03', title: 'A public page on us', desc: 'SEO-friendly review page for your agency' },
              { num: '04', title: 'An embeddable badge', desc: 'Live star rating for your website' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl font-bold mb-2" style={{ color: '#fb923c' }}>{item.num}</p>
                <h4 className="font-semibold text-sm" style={{ color: '#EFE4D8' }}>{item.title}</h4>
                <p className="text-xs mt-1" style={{ color: '#A08A76' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24" style={{ backgroundColor: '#FFF8F2' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-display-sm font-bold" style={{ color: '#1C1917' }}>Simple, transparent <span className="font-serif-display" style={{ color: '#ea580c' }}>pricing</span></h2>
            <p className="mt-4 text-lg" style={{ color: '#78716C' }}>Start free. Upgrade when you're ready.</p>
          </div>

          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="flex items-center rounded-lg p-1" style={{ backgroundColor: '#FAEFE2' }}>
              <button onClick={() => setIsIndia(true)} className={`px-3 py-1.5 text-sm rounded-md transition ${isIndia ? 'text-white' : ''}`} style={isIndia ? { backgroundColor: '#ea580c' } : {}}>₹ INR</button>
              <button onClick={() => setIsIndia(false)} className={`px-3 py-1.5 text-sm rounded-md transition ${!isIndia ? 'text-white' : ''}`} style={!isIndia ? { backgroundColor: '#ea580c' } : {}}>$ USD</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {(['free', 'pro', 'ultra'] as const).map((planKey) => {
              const plan = plans[planKey];
              const price = isIndia ? plan.priceINR : plan.priceUSD;
              const symbol = isIndia ? '₹' : '$';
              const isPopular = planKey === 'pro';
              
              return (
                <div key={planKey} className={`relative p-8 rounded-2xl border ${isPopular ? '' : 'bg-white'}`} style={{
                  borderColor: isPopular ? '#ea580c' : '#E7E5E4',
                  backgroundColor: isPopular ? '#fff7ed' : '#FFFFFF',
                  boxShadow: isPopular ? '0 30px 80px -24px rgba(234,88,12,0.55)' : '0 1px 2px rgba(67,36,16,0.05), 0 3px 8px -2px rgba(67,36,16,0.05)',
                }}>
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-white text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: '#ea580c' }}>Most popular</div>
                  )}
                  <h3 className="text-xl font-bold" style={{ color: '#1C1917' }}>{plan.name}</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold" style={{ color: '#1C1917' }}>{price === 0 ? 'Free' : `${symbol}${price}`}</span>
                    {price > 0 && <span className="text-sm" style={{ color: '#78716C' }}>/month</span>}
                  </div>
                  <ul className="mt-6 space-y-3">
                    {plan.features.slice(0, 6).map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#ea580c' }} />
                        <span style={{ color: '#1C1917' }}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => navigate('/signup')} className={`mt-8 w-full py-3 rounded-xl text-sm font-semibold transition ${isPopular ? 'text-white' : ''}`} style={{
                    backgroundColor: isPopular ? '#ea580c' : '#FAEFE2',
                    color: isPopular ? '#FFFFFF' : '#1C1917',
                    boxShadow: isPopular ? '0 18px 48px -16px rgba(234,88,12,0.45)' : 'none',
                  }}>
                    {planKey === 'free' ? 'Get started free' : 'Start 14-day trial'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security band */}
      <section className="py-16 border-y" style={{ borderColor: '#E7E5E4', backgroundColor: '#FAEFE2' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { icon: Shield, title: 'Row-level security' },
              { icon: Lock, title: 'AES-256 encryption' },
              { icon: Users, title: 'No data sharing ever' },
              { icon: Users, title: 'Isolated per-account' },
              { icon: Download, title: 'Export anytime' },
              { icon: Lock, title: 'Encrypted in transit' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <item.icon className="w-6 h-6 mb-2" style={{ color: '#ea580c' }} />
                <span className="text-xs font-medium" style={{ color: '#78716C' }}>{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder note */}
      <section className="py-24" style={{ backgroundColor: '#FFF8F2' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl" style={{ backgroundColor: '#FAEFE2' }}>
            👨‍💻
          </div>
          <Quote className="w-8 h-8 mx-auto mb-4" style={{ color: '#ea580c' }} />
          <p className="text-lg italic leading-relaxed max-w-measure mx-auto" style={{ color: '#1C1917' }}>
            "I built ClientTap because I was tired of juggling 8 different tools to run my freelance design business. Every feature exists because I needed it first."
          </p>
          <div className="mt-6">
            <p className="font-semibold" style={{ color: '#1C1917' }}>Arjun Mehta</p>
            <p className="text-sm" style={{ color: '#78716C' }}>Founder, ClientTap</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24" style={{ backgroundColor: '#FAEFE2' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-display-sm font-bold text-center mb-12" style={{ color: '#1C1917' }}>Frequently asked questions</h2>
          <div className="space-y-3">
            {[
              { q: 'Is there a free plan?', a: 'Yes! The Free plan includes 3 clients, 5 projects, lead pipeline, invoicing, e-signed documents, client portal for 1 client, and verified reviews.' },
              { q: 'Do you support GST-compliant invoicing?', a: 'Absolutely. ClientTap generates GST-compliant invoices with GSTIN, place of supply, CGST+SGST for intra-state and IGST for inter-state.' },
              { q: 'Can I use my own domain for the client portal?', a: 'Yes, on the Ultra plan you can connect a custom domain for your client portal with automatic SSL.' },
              { q: 'Can I export my data?', a: 'Yes, anytime. Export all your data as CSV/JSON/ZIP. No lock-in, ever.' },
              { q: 'Is my data secure?', a: 'Every record is isolated by workspace with Row-Level Security. AES-256 encryption at rest, TLS in transit.' },
            ].map((faq, i) => (
              <div key={i} className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: '#E7E5E4' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left hover:bg-stone-50 transition">
                  <span className="font-medium" style={{ color: '#1C1917' }}>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} style={{ color: '#78716C' }} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm" style={{ color: '#78716C' }}>{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24" style={{ backgroundColor: '#FFF8F2' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-display-sm font-bold" style={{ color: '#1C1917' }}>Ready to <span className="font-serif-display" style={{ color: '#ea580c' }}>tap</span> into better client management?</h2>
          <button onClick={() => navigate('/signup')} className="mt-8 btn-primary text-lg inline-flex items-center gap-2">
            Start free today <ArrowRight className="w-5 h-5" />
          </button>
          <p className="mt-4 text-sm" style={{ color: '#A8A29E' }}>No credit card required</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t" style={{ backgroundColor: '#17100B', borderColor: '#3B291D' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold" style={{ color: '#EFE4D8' }}>Client<span style={{ color: '#fb923c' }}>Tap</span></span>
              </div>
              <p className="text-sm" style={{ color: '#A08A76' }}>Run every client from first enquiry to final payment.</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3" style={{ color: '#EFE4D8' }}>Product</h4>
              <ul className="space-y-2 text-sm" style={{ color: '#A08A76' }}>
                <li><button className="hover:text-orange-400 transition">Features</button></li>
                <li><button className="hover:text-orange-400 transition">Pricing</button></li>
                <li><button className="hover:text-orange-400 transition">Demo</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3" style={{ color: '#EFE4D8' }}>Use cases</h4>
              <ul className="space-y-2 text-sm" style={{ color: '#A08A76' }}>
                <li><button className="hover:text-orange-400 transition">Freelancers</button></li>
                <li><button className="hover:text-orange-400 transition">Agencies</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3" style={{ color: '#EFE4D8' }}>Free tools</h4>
              <ul className="space-y-2 text-sm" style={{ color: '#A08A76' }}>
                <li><button className="hover:text-orange-400 transition">GST Invoice Generator</button></li>
                <li><button className="hover:text-orange-400 transition">GST Calculator</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3" style={{ color: '#EFE4D8' }}>Company</h4>
              <ul className="space-y-2 text-sm" style={{ color: '#A08A76' }}>
                <li><button className="hover:text-orange-400 transition">About</button></li>
                <li><button className="hover:text-orange-400 transition">Contact</button></li>
                <li><button className="hover:text-orange-400 transition">Security</button></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderColor: '#3B291D' }}>
            <p className="text-xs" style={{ color: '#A08A76' }}>© 2025 ClientTap. All rights reserved.</p>
            <div className="flex items-center gap-4 text-xs" style={{ color: '#A08A76' }}>
              <button className="hover:text-orange-400 transition">Privacy</button>
              <button className="hover:text-orange-400 transition">Terms</button>
              <button onClick={() => setCookieOpen(true)} className="hover:text-orange-400 transition">Cookie preferences</button>
              <button className="hover:text-orange-400 transition">Grievance Officer</button>
            </div>
          </div>
        </div>
      </footer>

      {/* Cookie Banner */}
      {cookieOpen && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 rounded-2xl border bg-white p-5 animate-slide-up" style={{ borderColor: '#E7E5E4', boxShadow: '0 40px 80px -20px rgba(67,36,16,0.20)' }}>
          <div className="flex items-start gap-3">
            <Cookie className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#ea580c' }} />
            <div className="flex-1">
              <h4 className="font-semibold text-sm mb-1" style={{ color: '#1C1917' }}>Cookie preferences</h4>
              <p className="text-xs" style={{ color: '#78716C' }}>We use cookies to improve your experience.</p>
              <div className="flex items-center gap-2 mt-3">
                <button onClick={handleAcceptCookies} className="text-xs text-white px-3 py-1.5 rounded-lg font-medium" style={{ backgroundColor: '#ea580c' }}>Accept all</button>
                <button onClick={handleAcceptCookies} className="text-xs px-3 py-1.5 rounded-lg font-medium border" style={{ borderColor: '#E7E5E4', color: '#1C1917' }}>Manage</button>
                <button onClick={handleRejectCookies} className="text-xs px-3 py-1.5 rounded-lg font-medium" style={{ color: '#78716C' }}>Reject</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

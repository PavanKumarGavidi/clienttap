import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { plans } from '../data/mockData';
import { 
  Zap, Shield, Users, FileText, CreditCard, MessageSquare, Star, 
  ArrowRight, Check, Menu, X, Moon, Sun, ChevronDown, BarChart3,
  Globe, Lock, Download, Clock, TrendingUp, Award, Sparkles,
  Target, Briefcase, CheckCircle2, Heart, Quote, Cookie
} from 'lucide-react';

export default function MarketingSite() {
  const { darkMode, toggleDarkMode } = useApp();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [isIndia, setIsIndia] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [cookieOpen, setCookieOpen] = useState(true);
  const [journeyStep, setJourneyStep] = useState(0);

  const solutions = [
    { icon: Users, title: 'Client Management', desc: 'Complete profiles with projects, payments & history' },
    { icon: BarChart3, title: 'CRM & Lead Pipeline', desc: 'Custom Kanban pipeline with drag-and-drop' },
    { icon: Briefcase, title: 'Project Management', desc: 'Track progress, assign team, share updates' },
    { icon: CreditCard, title: 'Invoicing & Payments', desc: 'GST-ready invoices, payment tracking, expenses' },
    { icon: Globe, title: 'Client Portal', desc: 'White-label portal for clients to view & approve' },
    { icon: Star, title: 'Verified Reviews', desc: 'Automatic review requests after project completion' },
  ];

  const tools = [
    { title: 'GST Invoice Generator', desc: 'Create GST-compliant invoices with PDF download' },
    { title: 'GST Calculator', desc: 'Add/remove GST with CGST/SGST split' },
    { title: 'Freelance Rate Calculator', desc: 'Calculate your ideal hourly rate' },
    { title: 'Time Zone Converter', desc: 'Convert times across zones for meetings' },
    { title: 'Templates Hub', desc: 'Free contracts, proposals & invoice templates' },
  ];

  const journeyActs = [
    { title: 'Lead', steps: ['New enquiry lands in pipeline', 'Auto-tagged by source', 'Assigned to team member', 'Follow-up reminder set'] },
    { title: 'Client', steps: ['Lead converted to client', 'Portal access enabled', 'Welcome email sent', 'Project created'] },
    { title: 'Work', steps: ['Tasks assigned to team', 'Progress tracked visually', 'Files shared with client', 'Updates posted in portal'] },
    { title: 'Her Side', steps: ['Client logs into portal', 'Reviews project progress', 'Approves deliverables', 'Downloads shared files'] },
    { title: 'The Loop', steps: ['Invoice auto-generated', 'Payment received & tracked', 'Review request sent', 'Referral captured'] },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#0f0f0f] text-white' : 'bg-white text-gray-900'}`}>
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white text-center py-2 text-sm font-medium">
        <span className="inline-flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          New: Marketplace — Get discovered by clients worldwide
          <button onClick={() => navigate('/app')} className="underline ml-2 font-semibold">Learn more →</button>
        </span>
      </div>

      {/* Navigation */}
      <nav className={`sticky top-0 z-50 ${darkMode ? 'bg-[#0f0f0f]/95' : 'bg-white/95'} backdrop-blur-md border-b ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Client<span className="text-orange-600">tap</span></span>
              </div>
              
              <div className="hidden lg:flex items-center gap-6">
                {/* Solutions Dropdown */}
                <div className="relative">
                  <button 
                    onMouseEnter={() => setSolutionsOpen(true)}
                    onMouseLeave={() => setSolutionsOpen(false)}
                    className={`text-sm font-medium flex items-center gap-1 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition`}
                  >
                    Solutions <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  {solutionsOpen && (
                    <div onMouseEnter={() => setSolutionsOpen(true)} onMouseLeave={() => setSolutionsOpen(false)} className={`absolute top-full left-0 mt-2 w-80 rounded-xl border shadow-xl ${darkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'} p-2`}>
                      {solutions.map((s, i) => (
                        <button key={i} className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition ${darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                          <div className="w-9 h-9 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center shrink-0">
                            <s.icon className="w-4.5 h-4.5 text-orange-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{s.title}</p>
                            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{s.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button onClick={() => navigate('/pricing')} className={`text-sm font-medium ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition`}>Pricing</button>
                <button className={`text-sm font-medium ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition`}>Marketplace</button>

                {/* Free Tools Dropdown */}
                <div className="relative">
                  <button 
                    onMouseEnter={() => setToolsOpen(true)}
                    onMouseLeave={() => setToolsOpen(false)}
                    className={`text-sm font-medium flex items-center gap-1 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition`}
                  >
                    Free Tools <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  {toolsOpen && (
                    <div onMouseEnter={() => setToolsOpen(true)} onMouseLeave={() => setToolsOpen(false)} className={`absolute top-full left-0 mt-2 w-72 rounded-xl border shadow-xl ${darkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'} p-2`}>
                      {tools.map((t, i) => (
                        <button key={i} className={`w-full flex flex-col p-3 rounded-lg text-left transition ${darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                          <p className="text-sm font-medium">{t.title}</p>
                          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{t.desc}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button className={`text-sm font-medium ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition`}>Contact</button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={toggleDarkMode} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'} transition`}>
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button onClick={() => navigate('/login')} className="hidden sm:block text-sm font-medium text-orange-600 hover:text-orange-700 transition">Sign in</button>
              <button onClick={() => navigate('/signup')} className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm">Start free</button>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2">
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className={`lg:hidden border-t ${darkMode ? 'border-white/10 bg-[#0f0f0f]' : 'border-gray-100 bg-white'} px-4 py-4 space-y-3`}>
            <button className="block text-sm font-medium py-2 text-left">Solutions</button>
            <button onClick={() => { navigate('/pricing'); setMobileMenuOpen(false); }} className="block text-sm font-medium py-2 text-left">Pricing</button>
            <button className="block text-sm font-medium py-2 text-left">Marketplace</button>
            <button className="block text-sm font-medium py-2 text-left">Free Tools</button>
            <button className="block text-sm font-medium py-2 text-left">Contact</button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-orange-50/30 dark:from-orange-950/20 dark:via-[#0f0f0f] dark:to-[#0f0f0f]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Now with AI-powered quotes & contracts
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Run every client from{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-500">first enquiry</span>
              {' '}to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-500">final payment</span>
            </h1>
            <p className={`mt-6 text-lg sm:text-xl max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              One workspace for leads, quotes, contracts, projects, invoicing, your client portal, and verified reviews. Built for agencies and freelancers worldwide.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => navigate('/signup')} className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white px-8 py-3.5 rounded-xl text-base font-semibold transition shadow-lg shadow-orange-600/20 flex items-center justify-center gap-2">
                Start free <ArrowRight className="w-5 h-5" />
              </button>
              <button onClick={() => navigate('/demo')} className={`w-full sm:w-auto px-8 py-3.5 rounded-xl text-base font-semibold transition border ${darkMode ? 'border-white/20 hover:bg-white/5' : 'border-gray-200 hover:bg-gray-50'} flex items-center justify-center gap-2`}>
                See how it works <BarChart3 className="w-5 h-5" />
              </button>
            </div>
            <p className={`mt-4 text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
              No credit card required · Free forever plan · Setup in 2 minutes
            </p>
            
            {/* Trust strip */}
            <div className={`mt-12 flex flex-wrap items-center justify-center gap-6 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              <span className="flex items-center gap-1.5"><Lock className="w-4 h-4" /> Encrypted in transit</span>
              <span className="flex items-center gap-1.5"><Shield className="w-4 h-4" /> Per-account isolation</span>
              <span className="flex items-center gap-1.5"><Download className="w-4 h-4" /> Export anytime</span>
              <span className="flex items-center gap-1.5"><CreditCard className="w-4 h-4" /> No card required</span>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-16 max-w-5xl mx-auto">
            <div className={`rounded-2xl border ${darkMode ? 'border-white/10 bg-[#1a1a1a]' : 'border-gray-200 bg-white'} shadow-2xl shadow-orange-600/5 overflow-hidden`}>
              <div className={`flex items-center gap-2 px-4 py-3 border-b ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} ml-2`}>app.clienttap.io/dashboard</span>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Pipeline Value', value: '₹18.5L', change: '+12%', icon: TrendingUp },
                  { label: 'Revenue (Jan)', value: '₹6.25L', change: '+24%', icon: BarChart3 },
                  { label: 'Active Clients', value: '6', change: '+2', icon: Users },
                  { label: 'Win Rate', value: '68%', change: '+5%', icon: Award },
                ].map((stat, i) => (
                  <div key={i} className={`p-4 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <stat.icon className={`w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      <span className="text-xs text-green-500 font-medium">{stat.change}</span>
                    </div>
                    <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="px-6 pb-6">
                <div className={`rounded-xl ${darkMode ? 'bg-white/5' : 'bg-gray-50'} p-4`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>6-Month Revenue</span>
                  </div>
                  <div className="flex items-end gap-2 h-24">
                    {[45, 62, 55, 78, 68, 85].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full bg-gradient-to-t from-orange-600 to-orange-400 rounded-t-sm transition-all" style={{ height: `${h}%` }} />
                        <span className={`text-[10px] ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>{['Aug','Sep','Oct','Nov','Dec','Jan'][i]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scrolling Marquee - Tools You Replace */}
      <section className={`py-8 border-y ${darkMode ? 'border-white/10 bg-[#1a1a1a]' : 'border-gray-100 bg-gray-50'} overflow-hidden`}>
        <div className="flex animate-[scroll_30s_linear_infinite] whitespace-nowrap">
          {[...Array(2)].map((_, setIdx) => (
            <div key={setIdx} className="flex items-center gap-8 px-4">
              {['Spreadsheets', 'Word Invoices', 'WhatsApp Threads', 'Sticky Notes', 'Email Chains', 'Trello Boards', 'Google Sheets', 'Dropbox Folders', 'Zoom Links', 'Stripe Dashboard'].map((tool, i) => (
                <span key={i} className={`text-sm font-medium px-4 py-2 rounded-full border ${darkMode ? 'border-white/10 text-gray-500' : 'border-gray-200 text-gray-400'}`}>
                  {tool}
                </span>
              ))}
            </div>
          ))}
        </div>
        <style>{`@keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
      </section>

      {/* Features Grid */}
      <section className={`py-24 ${darkMode ? 'bg-[#0f0f0f]' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">Everything you need to run your practice</h2>
            <p className={`mt-4 text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>From the first hello to the final invoice. One workspace, zero tab-switching.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Users, title: 'Client Management', desc: 'Complete profiles with projects, payments, documents, and activity history. All in one place.' },
              { icon: BarChart3, title: 'CRM & Lead Pipeline', desc: 'Custom Kanban pipeline with drag-and-drop. Track every lead from enquiry to won.' },
              { icon: FileText, title: 'Projects & Tasks', desc: 'Track progress, assign team, manage deliverables, and share updates with clients.' },
              { icon: CreditCard, title: 'GST-Ready Invoicing', desc: 'Professional invoices with GST, CGST/SGST, IGST. Auto-numbering, PDF export, and payment tracking.' },
              { icon: Globe, title: 'White-Label Client Portal', desc: 'Branded portal where clients see projects, approve work, pay invoices, and leave reviews.' },
              { icon: Star, title: 'Verified Reviews', desc: 'Automatic review requests after project completion. Public review page with SEO markup.' },
              { icon: MessageSquare, title: 'Real-Time Messaging', desc: 'Thread per client, shared with the portal. Attachments, read receipts, email fallback.' },
              { icon: Clock, title: 'Meetings & Calendar', desc: 'Schedule meetings, Google Calendar sync, auto-generated Meet links, and reminders.' },
              { icon: Sparkles, title: 'AI Quotes & Contracts', desc: 'Generate professional quotes and contracts from a brief. E-signature built in.' },
            ].map((feature, i) => (
              <div key={i} className={`p-6 rounded-2xl border ${darkMode ? 'border-white/10 bg-[#1a1a1a] hover:border-orange-500/30' : 'border-gray-200 bg-white hover:border-orange-200'} transition group`}>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <feature.icon className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Old Way vs Our Way */}
      <section className={`py-24 ${darkMode ? 'bg-[#1a1a1a]' : 'bg-gray-50/50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">Stop juggling tools. Start closing clients.</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className={`p-8 rounded-2xl border ${darkMode ? 'border-red-900/30 bg-red-950/10' : 'border-red-100 bg-red-50/50'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-red-400' : 'text-red-700'}`}>The old way</h3>
              <ul className="space-y-3">
                {['Spreadsheets for leads', 'Separate invoicing tool', 'Email for client comms', 'Google Drive for files', 'No client portal', 'Manual follow-ups', 'No verified reviews'].map((item, i) => (
                  <li key={i} className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <X className="w-4 h-4 text-red-500 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className={`p-8 rounded-2xl border ${darkMode ? 'border-green-900/30 bg-green-950/10' : 'border-green-100 bg-green-50/50'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-green-400' : 'text-green-700'}`}>With Clienttap</h3>
              <ul className="space-y-3">
                {['Visual CRM pipeline', 'Built-in GST invoicing', 'In-app messaging', 'Project file storage', 'Branded client portal', 'Auto follow-up reminders', 'Verified review system'].map((item, i) => (
                  <li key={i} className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <Check className="w-4 h-4 text-green-500 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Journey */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold">The complete client lifecycle</h2>
            <p className={`mt-4 text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>5 acts, every step covered. From first hello to final review.</p>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-2 mb-12">
            {journeyActs.map((act, i) => (
              <button
                key={i}
                onClick={() => setJourneyStep(i)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
                  journeyStep === i
                    ? 'bg-orange-600 text-white'
                    : darkMode ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">{i + 1}</span>
                <span className="hidden sm:inline">{act.title}</span>
              </button>
            ))}
          </div>

          {/* Active act content */}
          <div className={`rounded-2xl border p-8 ${darkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'}`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Act {journeyStep + 1}: {journeyActs[journeyStep].title}</h3>
                <div className="space-y-3">
                  {journeyActs[journeyStep].steps.map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 text-orange-600" />
                      </div>
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{step}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => navigate('/signup')} className="mt-6 bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition inline-flex items-center gap-2">
                  Get started <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className={`rounded-xl ${darkMode ? 'bg-white/5' : 'bg-gray-50'} p-6 aspect-video flex items-center justify-center`}>
                <div className="text-center">
                  <div className="text-4xl mb-3">
                    {journeyStep === 0 && '🎯'}
                    {journeyStep === 1 && '🤝'}
                    {journeyStep === 2 && '⚡'}
                    {journeyStep === 3 && '👩‍💼'}
                    {journeyStep === 4 && '🔄'}
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {journeyActs[journeyStep].title} — Interactive demo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className={`py-24 ${darkMode ? 'bg-[#1a1a1a]' : 'bg-gray-50/50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold">Simple, transparent pricing</h2>
            <p className={`mt-4 text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Start free. Upgrade when you're ready. No hidden fees.</p>
          </div>

          <div className="flex items-center justify-center gap-4 mb-12">
            <div className={`flex items-center rounded-lg p-1 ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
              <button onClick={() => setIsIndia(true)} className={`px-3 py-1.5 text-sm rounded-md transition ${isIndia ? 'bg-orange-600 text-white' : ''}`}>₹ INR</button>
              <button onClick={() => setIsIndia(false)} className={`px-3 py-1.5 text-sm rounded-md transition ${!isIndia ? 'bg-orange-600 text-white' : ''}`}>$ USD</button>
            </div>
            <div className={`flex items-center rounded-lg p-1 ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
              <button onClick={() => setBillingCycle('monthly')} className={`px-3 py-1.5 text-sm rounded-md transition ${billingCycle === 'monthly' ? 'bg-orange-600 text-white' : ''}`}>Monthly</button>
              <button onClick={() => setBillingCycle('annual')} className={`px-3 py-1.5 text-sm rounded-md transition ${billingCycle === 'annual' ? 'bg-orange-600 text-white' : ''}`}>Annual <span className="text-xs opacity-75">-20%</span></button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {(['free', 'pro', 'ultra'] as const).map((planKey) => {
              const plan = plans[planKey];
              const price = isIndia ? plan.priceINR : plan.priceUSD;
              const symbol = isIndia ? '₹' : '$';
              const displayPrice = billingCycle === 'annual' ? Math.round(price * 0.8) : price;
              const isPopular = planKey === 'pro';
              
              return (
                <div key={planKey} className={`relative p-8 rounded-2xl border ${isPopular ? 'border-orange-500 shadow-lg shadow-orange-600/10' : darkMode ? 'border-white/10' : 'border-gray-200'} ${darkMode ? 'bg-[#0f0f0f]' : 'bg-white'} ${isPopular ? 'ring-2 ring-orange-500' : ''}`}>
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-600 text-white text-xs font-semibold px-3 py-1 rounded-full">Most popular</div>
                  )}
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold">{displayPrice === 0 ? 'Free' : `${symbol}${displayPrice}`}</span>
                    {displayPrice > 0 && <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>/month</span>}
                  </div>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                        <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => navigate('/signup')} className={`mt-8 w-full py-3 rounded-xl text-sm font-semibold transition ${isPopular ? 'bg-orange-600 hover:bg-orange-700 text-white' : darkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}>
                    {planKey === 'free' ? 'Get started free' : 'Start 14-day trial'}
                  </button>
                </div>
              );
            })}
          </div>
          <p className={`text-center text-xs mt-6 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
            {isIndia ? 'Billed in INR via Razorpay' : 'Billed in USD via PayPal'} · Cancel anytime
          </p>
        </div>
      </section>

      {/* Security Band */}
      <section className={`py-16 ${darkMode ? 'bg-[#0f0f0f]' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold">Security you can trust</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Row-Level Security', desc: 'Every record isolated by workspace' },
              { icon: Lock, title: 'AES-256 Encryption', desc: 'Data encrypted at rest and in transit' },
              { icon: Users, title: 'No Data Sharing', desc: 'Your data is never shared or sold' },
              { icon: Download, title: 'Export Anytime', desc: 'Full data export, no lock-in ever' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verified Reviews */}
      <section className={`py-24 ${darkMode ? 'bg-[#1a1a1a]' : 'bg-gray-50/50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold">Verified reviews, built in</h2>
            <p className={`mt-4 text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Every review comes from a real client who completed a project. No fake reviews, ever.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            {[
              { name: 'James Wilson', company: 'Nordic Design Co', rating: 5, text: 'Outstanding brand identity work. Their attention to detail exceeded our expectations.' },
              { name: 'Vikram Malhotra', company: 'TechVault Solutions', rating: 5, text: 'Exceptional CRM integration. Responsive, professional, delivered ahead of schedule.' },
              { name: 'Sarah Miller', company: 'GreenLeaf Organics', rating: 4, text: 'Great design work and smooth collaboration. Would love to work together again.' },
            ].map((review, i) => (
              <div key={i} className={`p-6 rounded-2xl border ${darkMode ? 'border-white/10 bg-[#0f0f0f]' : 'border-gray-200 bg-white'}`}>
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className={`w-4 h-4 ${j < review.rating ? 'text-orange-500 fill-orange-500' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>"{review.text}"</p>
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{review.name}</span>
                  <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full">
                    <Check className="w-3 h-3" /> Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { num: '1', title: 'Automatic', desc: 'Review requests sent when projects complete' },
              { num: '2', title: 'Verified', desc: 'Only authenticated portal clients can review' },
              { num: '3', title: 'Public', desc: 'SEO-friendly public review page for your agency' },
              { num: '4', title: 'Embeddable', desc: 'Live star rating badge for your website' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-orange-600 font-bold">{item.num}</span>
                </div>
                <h4 className="font-semibold text-sm">{item.title}</h4>
                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Note */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
            👨‍💻
          </div>
          <Quote className={`w-8 h-8 mx-auto mb-4 ${darkMode ? 'text-orange-500' : 'text-orange-600'}`} />
          <p className={`text-lg sm:text-xl italic leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            "I built Clienttap because I was tired of juggling 8 different tools to run my freelance design business. Every feature exists because I needed it first. I hope it saves you the same time it saved me."
          </p>
          <div className="mt-6">
            <p className="font-semibold">Arjun Mehta</p>
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Founder, Clienttap</p>
            <div className="flex items-center justify-center gap-3 mt-3">
              <a href="#" className={`text-sm ${darkMode ? 'text-gray-500 hover:text-orange-500' : 'text-gray-400 hover:text-orange-600'} transition`}>Twitter</a>
              <a href="#" className={`text-sm ${darkMode ? 'text-gray-500 hover:text-orange-500' : 'text-gray-400 hover:text-orange-600'} transition`}>LinkedIn</a>
              <a href="#" className={`text-sm ${darkMode ? 'text-gray-500 hover:text-orange-500' : 'text-gray-400 hover:text-orange-600'} transition`}>GitHub</a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={`py-24 ${darkMode ? 'bg-[#1a1a1a]' : 'bg-gray-50/50'}`}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently asked questions</h2>
          <div className="space-y-3">
            {[
              { q: 'Is there a free plan?', a: 'Yes! The Free plan includes 3 clients, 5 projects, lead pipeline, invoicing, e-signed documents, client portal for 1 client, and verified reviews. No credit card required.' },
              { q: 'Do you support GST-compliant invoicing?', a: 'Absolutely. Clienttap generates GST-compliant invoices with GSTIN, place of supply, CGST+SGST for intra-state and IGST for inter-state, SAC/HSN codes, and amount in words.' },
              { q: 'Can I use my own domain for the client portal?', a: 'Yes, on the Ultra plan you can connect a custom domain for your client portal with automatic SSL and DNS instructions.' },
              { q: 'How does the client portal work?', a: 'Enable the portal per client. They get an email invite, set their password, and can view projects, download files, approve work, pay invoices, and leave verified reviews — all branded with your logo.' },
              { q: 'Can I export my data?', a: 'Yes, anytime. Export all your data as CSV/JSON/ZIP. No lock-in, ever.' },
              { q: 'Is my data secure?', a: 'Every record is isolated by workspace with Row-Level Security. AES-256 encryption at rest, TLS in transit, audit logs, and rate limiting.' },
              { q: 'Do you offer refunds?', a: 'Yes. If you\'re not satisfied within 14 days of your first payment, contact us for a full refund. See our Refund Policy for details.' },
            ].map((faq, i) => (
              <div key={i} className={`rounded-xl border ${darkMode ? 'border-white/10' : 'border-gray-200'} overflow-hidden`}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className={`w-full flex items-center justify-between p-5 text-left ${darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'} transition`}>
                  <span className="font-medium">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${openFaq === i ? 'rotate-180' : ''} ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                </button>
                {openFaq === i && (
                  <div className={`px-5 pb-5 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">Ready to tap into better client management?</h2>
          <p className={`mt-4 text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Join agencies and freelancers worldwide who run their practice on Clienttap.</p>
          <button onClick={() => navigate('/signup')} className="mt-8 bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition shadow-lg shadow-orange-600/20 inline-flex items-center gap-2">
            Start free today <ArrowRight className="w-5 h-5" />
          </button>
          <p className={`mt-4 text-sm ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>No credit card required · Free forever plan</p>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t ${darkMode ? 'border-white/10 bg-[#0f0f0f]' : 'border-gray-100 bg-white'} py-12`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold">Client<span className="text-orange-600">tap</span></span>
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'} mb-4`}>Run every client from first enquiry to final payment.</p>
              <a href="#" className={`inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border ${darkMode ? 'border-white/10 text-gray-400' : 'border-gray-200 text-gray-500'}`}>
                🚀 Featured on Product Hunt
              </a>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Product</h4>
              <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                <li><button className="hover:text-orange-600 transition">Features</button></li>
                <li><button className="hover:text-orange-600 transition">Pricing</button></li>
                <li><button className="hover:text-orange-600 transition">Demo</button></li>
                <li><button className="hover:text-orange-600 transition">Changelog</button></li>
                <li><button className="hover:text-orange-600 transition">Download App</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Use Cases</h4>
              <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                <li><button className="hover:text-orange-600 transition">For Freelancers</button></li>
                <li><button className="hover:text-orange-600 transition">Web Design Agencies</button></li>
                <li><button className="hover:text-orange-600 transition">Marketing Agencies</button></li>
                <li><button className="hover:text-orange-600 transition">Dev Shops</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Free Tools</h4>
              <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                <li><button className="hover:text-orange-600 transition">GST Invoice Generator</button></li>
                <li><button className="hover:text-orange-600 transition">GST Calculator</button></li>
                <li><button className="hover:text-orange-600 transition">Rate Calculator</button></li>
                <li><button className="hover:text-orange-600 transition">Templates</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Company</h4>
              <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                <li><button className="hover:text-orange-600 transition">About</button></li>
                <li><button className="hover:text-orange-600 transition">Blog</button></li>
                <li><button className="hover:text-orange-600 transition">Contact</button></li>
                <li><button className="hover:text-orange-600 transition">Careers</button></li>
              </ul>
            </div>
          </div>

          <div className={`mt-12 pt-8 border-t ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className={`flex flex-wrap items-center gap-4 text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                <span>© 2025 Clienttap. All rights reserved.</span>
                <button className="hover:text-orange-600 transition">Privacy Policy</button>
                <button className="hover:text-orange-600 transition">Terms of Service</button>
                <button className="hover:text-orange-600 transition">Security</button>
                <button className="hover:text-orange-600 transition">Refund Policy</button>
                <button onClick={() => setCookieOpen(true)} className="hover:text-orange-600 transition">Cookie Preferences</button>
              </div>
              <div className="flex items-center gap-4">
                <button className={`text-xs ${darkMode ? 'text-gray-500 hover:text-orange-500' : 'text-gray-400 hover:text-orange-600'} transition`}>Grievance Officer</button>
                <button className={`text-xs ${darkMode ? 'text-gray-500 hover:text-orange-500' : 'text-gray-400 hover:text-orange-600'} transition`}>DPO Contact</button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Cookie Banner */}
      {cookieOpen && (
        <div className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 rounded-xl border shadow-2xl ${darkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'} p-5 animate-fade-in`}>
          <div className="flex items-start gap-3">
            <Cookie className={`w-5 h-5 shrink-0 mt-0.5 ${darkMode ? 'text-orange-500' : 'text-orange-600'}`} />
            <div className="flex-1">
              <h4 className="font-semibold text-sm mb-1">Cookie preferences</h4>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>We use cookies to improve your experience. You can manage your preferences anytime.</p>
              <div className="flex items-center gap-2 mt-3">
                <button onClick={() => setCookieOpen(false)} className="text-xs bg-orange-600 text-white px-3 py-1.5 rounded-lg font-medium">Accept all</button>
                <button onClick={() => setCookieOpen(false)} className={`text-xs px-3 py-1.5 rounded-lg font-medium border ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>Manage</button>
                <button onClick={() => setCookieOpen(false)} className={`text-xs px-3 py-1.5 rounded-lg font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Reject</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

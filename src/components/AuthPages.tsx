import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../lib/auth';
import { Zap, Mail, Lock, User, Building2, ArrowRight, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';

export default function AuthPages() {
  const location = useLocation();
  const path = location.pathname;

  // If already logged in and trying to access auth pages, redirect
  useEffect(() => {
    if (auth.isAuthenticated() && (path === '/login' || path === '/signup')) {
      // Already logged in, stay on auth page but user can re-login
    }
  }, [path]);

  if (path.includes('/signup')) return <SignupPage />;
  if (path.includes('/forgot-password')) return <ForgotPasswordPage />;
  return <LoginPage />;
}

function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    workspaceName: '',
    workspaceSlug: '',
    country: 'IN',
    agreeTerms: false,
  });

  const passwordStrength = formData.password.length >= 8 ? 
    formData.password.match(/[A-Z]/) && formData.password.match(/[0-9]/) ? 'strong' : 'medium' : 'weak';

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name.trim()) { setError('Please enter your name'); return; }
    if (!formData.email.trim()) { setError('Please enter your email'); return; }
    if (!formData.password) { setError('Please enter a password'); return; }
    if (formData.password.length < 8) { setError('Password must be at least 8 characters'); return; }
    
    setStep(2);
  };

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.workspaceName.trim()) { setError('Please enter your agency name'); return; }
    if (!formData.workspaceSlug.trim()) { setError('Please enter an agency slug'); return; }
    
    setStep(3);
  };

  const handleStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = auth.signup(
      formData.name,
      formData.email,
      formData.password,
      formData.workspaceName,
      formData.workspaceSlug,
      formData.country
    );

    setLoading(false);

    if (result.success) {
      navigate('/app/dashboard');
    } else {
      setError(result.error || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#FAFAF8' }}>
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight" style={{ color: '#1C1917' }}>Client<span style={{ color: '#ea580c' }}>Tap</span></span>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1 h-1 rounded-full overflow-hidden" style={{ backgroundColor: '#E7E5E4' }}>
                <div className="h-full transition-all" style={{ backgroundColor: '#ea580c', width: s <= step ? '100%' : '0%' }} />
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg flex items-start gap-2" style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}>
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#dc2626' }} />
              <p className="text-sm" style={{ color: '#991b1b' }}>{error}</p>
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleStep1} className="animate-fade-in">
              <h1 className="text-display-sm font-bold mb-2" style={{ color: '#1C1917' }}>Create your account</h1>
              <p className="text-sm mb-6" style={{ color: '#78716C' }}>Start free. No credit card required.</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C1917' }}>Full name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#A8A29E' }} />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Arjun Mehta"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white border focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                      style={{ borderColor: '#E7E5E4', color: '#1C1917' }}
                      autoFocus
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C1917' }}>Work email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#A8A29E' }} />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="you@agency.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white border focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                      style={{ borderColor: '#E7E5E4', color: '#1C1917' }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C1917' }}>Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#A8A29E' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      placeholder="Create a strong password"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm bg-white border focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                      style={{ borderColor: '#E7E5E4', color: '#1C1917' }}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#A8A29E' }}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {formData.password && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#E7E5E4' }}>
                        <div className="h-full rounded-full transition-all" style={{
                          width: passwordStrength === 'strong' ? '100%' : passwordStrength === 'medium' ? '66%' : '33%',
                          backgroundColor: passwordStrength === 'strong' ? '#16a34a' : passwordStrength === 'medium' ? '#d97706' : '#dc2626'
                        }} />
                      </div>
                      <span className="text-xs" style={{ color: passwordStrength === 'strong' ? '#16a34a' : passwordStrength === 'medium' ? '#d97706' : '#dc2626' }}>{passwordStrength}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C1917' }}>Country</label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl text-sm bg-white border focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                    style={{ borderColor: '#E7E5E4', color: '#1C1917' }}
                  >
                    <option value="IN">India (₹ INR)</option>
                    <option value="US">United States ($ USD)</option>
                    <option value="GB">United Kingdom (£ GBP)</option>
                    <option value="AU">Australia ($ AUD)</option>
                    <option value="CA">Canada ($ CAD)</option>
                    <option value="DE">Germany (€ EUR)</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="w-full mt-6 btn-primary flex items-center justify-center gap-2">
                Continue <ArrowRight className="w-4 h-4" />
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t" style={{ borderColor: '#E7E5E4' }} /></div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2" style={{ backgroundColor: '#FAFAF8', color: '#A8A29E' }}>or</span>
                </div>
              </div>

              <button type="button" onClick={() => { auth.loginWithGoogle(); navigate('/app/dashboard'); }} className="w-full py-3 rounded-xl font-medium border transition flex items-center justify-center gap-2 hover:bg-stone-50" style={{ borderColor: '#E7E5E4', color: '#1C1917' }}>
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Continue with Google
              </button>

              <p className="text-xs text-center mt-6" style={{ color: '#A8A29E' }}>
                Already have an account?{' '}
                <button type="button" onClick={() => navigate('/login')} className="font-medium" style={{ color: '#ea580c' }}>Sign in</button>
              </p>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleStep2} className="animate-fade-in">
              <h1 className="text-display-sm font-bold mb-2" style={{ color: '#1C1917' }}>Set up your workspace</h1>
              <p className="text-sm mb-6" style={{ color: '#78716C' }}>Tell us about your agency or freelance business.</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C1917' }}>Agency name</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#A8A29E' }} />
                    <input
                      type="text"
                      value={formData.workspaceName}
                      onChange={(e) => setFormData({...formData, workspaceName: e.target.value})}
                      placeholder="Pixel & Code Studio"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white border focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                      style={{ borderColor: '#E7E5E4', color: '#1C1917' }}
                      autoFocus
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C1917' }}>Agency slug</label>
                  <div className="flex">
                    <span className="px-3 py-2.5 rounded-l-xl text-sm border" style={{ backgroundColor: '#FAFAF8', borderColor: '#E7E5E4', color: '#78716C' }}>portal.clienttap.io/</span>
                    <input
                      type="text"
                      value={formData.workspaceSlug}
                      onChange={(e) => setFormData({...formData, workspaceSlug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})}
                      placeholder="pixelcode"
                      className="flex-1 px-4 py-2.5 rounded-r-xl text-sm bg-white border focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                      style={{ borderColor: '#E7E5E4', color: '#1C1917' }}
                    />
                  </div>
                  {formData.workspaceSlug && (
                    <p className="text-xs mt-1 flex items-center gap-1" style={{ color: '#16a34a' }}><Check className="w-3 h-3" /> Available</p>
                  )}
                </div>
              </div>

              <button type="submit" className="w-full mt-6 btn-primary flex items-center justify-center gap-2">
                Continue <ArrowRight className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => setStep(1)} className="w-full mt-3 py-3 rounded-xl font-medium transition hover:bg-stone-100" style={{ color: '#78716C' }}>Back</button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleStep3} className="animate-fade-in">
              <h1 className="text-display-sm font-bold mb-2" style={{ color: '#1C1917' }}>Almost there!</h1>
              <p className="text-sm mb-6" style={{ color: '#78716C' }}>Review your details and create your account.</p>

              <div className="bg-white rounded-xl border p-5 space-y-3" style={{ borderColor: '#E7E5E4' }}>
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: '#78716C' }}>Name</span>
                  <span className="text-sm font-medium" style={{ color: '#1C1917' }}>{formData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: '#78716C' }}>Email</span>
                  <span className="text-sm font-medium" style={{ color: '#1C1917' }}>{formData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: '#78716C' }}>Agency</span>
                  <span className="text-sm font-medium" style={{ color: '#1C1917' }}>{formData.workspaceName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: '#78716C' }}>Region</span>
                  <span className="text-sm font-medium" style={{ color: '#1C1917' }}>{formData.country === 'IN' ? 'India (₹ INR)' : formData.country === 'US' ? 'USA ($ USD)' : formData.country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: '#78716C' }}>Plan</span>
                  <span className="text-sm font-medium" style={{ color: '#ea580c' }}>Free</span>
                </div>
              </div>

              <label className="flex items-start gap-2 cursor-pointer mt-6">
                <input type="checkbox" checked={formData.agreeTerms} onChange={(e) => setFormData({...formData, agreeTerms: e.target.checked})} className="mt-1 rounded" style={{ accentColor: '#ea580c' }} />
                <span className="text-xs" style={{ color: '#A8A29E' }}>
                  I agree to the <a href="#" style={{ color: '#ea580c' }}>Terms of Service</a> and <a href="#" style={{ color: '#ea580c' }}>Privacy Policy</a>
                </span>
              </label>

              <button type="submit" disabled={!formData.agreeTerms || loading} className="w-full mt-6 btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Creating account...' : 'Create Account'} {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
              <button type="button" onClick={() => setStep(2)} className="w-full mt-3 py-3 rounded-xl font-medium transition hover:bg-stone-100" style={{ color: '#78716C' }}>Back</button>
            </form>
          )}
        </div>
      </div>

      {/* Right side - Hero */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-12" style={{ background: 'linear-gradient(135deg, #ea580c, #f97316)' }}>
        <div className="max-w-md text-white">
          <h2 className="text-display-sm font-bold mb-4">Run every client from first enquiry to <span className="font-serif-display font-normal">final payment</span></h2>
          <p className="text-lg opacity-90 mb-8">One workspace for leads, quotes, contracts, projects, invoicing, your client portal, and verified reviews.</p>
          <div className="space-y-3">
            {['GST-compliant invoicing', 'White-label client portal', 'AI-powered quotes & contracts', 'Verified reviews built-in'].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = auth.login(email, password);
    setLoading(false);

    if (result.success) {
      navigate('/app/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: '#FAFAF8' }}>
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold tracking-tight" style={{ color: '#1C1917' }}>Client<span style={{ color: '#ea580c' }}>Tap</span></span>
        </div>

        <div className="bg-white border rounded-2xl p-8" style={{ borderColor: '#E7E5E4', boxShadow: '0 2px 8px -2px rgba(28,25,23,0.06), 0 6px 20px -4px rgba(28,25,23,0.06)' }}>
          <h1 className="text-display-sm font-bold mb-2" style={{ color: '#1C1917' }}>Welcome back</h1>
          <p className="text-sm mb-6" style={{ color: '#78716C' }}>Sign in to your workspace</p>

          {error && (
            <div className="mb-4 p-3 rounded-lg flex items-start gap-2" style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}>
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#dc2626' }} />
              <p className="text-sm" style={{ color: '#991b1b' }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C1917' }}>Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#A8A29E' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@agency.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-stone-50 border focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:bg-white"
                  style={{ borderColor: '#E7E5E4', color: '#1C1917' }}
                  autoFocus
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C1917' }}>Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#A8A29E' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm bg-stone-50 border focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:bg-white"
                  style={{ borderColor: '#E7E5E4', color: '#1C1917' }}
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#A8A29E' }}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded" style={{ accentColor: '#ea580c' }} />
                <span className="text-sm" style={{ color: '#1C1917' }}>Remember me</span>
              </label>
              <button type="button" onClick={() => navigate('/forgot-password')} className="text-sm font-medium" style={{ color: '#ea580c' }}>Forgot password?</button>
            </div>

            <button type="submit" disabled={loading} className="w-full mt-2 btn-primary disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t" style={{ borderColor: '#E7E5E4' }} /></div>
            <div className="relative flex justify-center text-xs"><span className="px-2 bg-white" style={{ color: '#A8A29E' }}>or</span></div>
          </div>

          <button onClick={() => { auth.loginWithGoogle(); navigate('/app/dashboard'); }} className="w-full py-3 rounded-xl font-medium border transition flex items-center justify-center gap-2 hover:bg-stone-50" style={{ borderColor: '#E7E5E4', color: '#1C1917' }}>
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>

          {/* Demo Login */}
          <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: '#FFF8F2', border: '1px solid #fed7aa' }}>
            <p className="text-xs font-medium mb-2" style={{ color: '#9a3412' }}>🎯 Try the demo</p>
            <button
              type="button"
              onClick={() => {
                // Create demo account if it doesn't exist
                const users = auth.getUsers();
                const demoUser = users.find(u => u.email === 'demo@clienttap.io');
                if (demoUser) {
                  const result = auth.login('demo@clienttap.io', 'demo1234');
                  if (result.success) navigate('/app/dashboard');
                } else {
                  const result = auth.signup('Demo User', 'demo@clienttap.io', 'demo1234', 'Demo Agency', 'demo', 'IN');
                  if (result.success) navigate('/app/dashboard');
                }
              }}
              className="w-full py-2 rounded-lg text-sm font-medium transition hover:opacity-90"
              style={{ backgroundColor: '#ea580c', color: '#FFFFFF' }}
            >
              Login as Demo User
            </button>
            <p className="text-xs mt-2 text-center" style={{ color: '#9a3412' }}>demo@clienttap.io / demo1234</p>
          </div>

          <p className="text-xs text-center mt-6" style={{ color: '#A8A29E' }}>
            Don't have an account?{' '}
            <button onClick={() => navigate('/signup')} className="font-medium" style={{ color: '#ea580c' }}>Sign up free</button>
          </p>
        </div>
      </div>
    </div>
  );
}

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production: send reset email via Supabase
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: '#FAFAF8' }}>
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold tracking-tight" style={{ color: '#1C1917' }}>Client<span style={{ color: '#ea580c' }}>Tap</span></span>
        </div>

        <div className="bg-white border rounded-2xl p-8" style={{ borderColor: '#E7E5E4', boxShadow: '0 2px 8px -2px rgba(28,25,23,0.06), 0 6px 20px -4px rgba(28,25,23,0.06)' }}>
          {!sent ? (
            <form onSubmit={handleSubmit}>
              <h1 className="text-display-sm font-bold mb-2" style={{ color: '#1C1917' }}>Forgot password?</h1>
              <p className="text-sm mb-6" style={{ color: '#78716C' }}>Enter your email and we'll send you a reset link.</p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@agency.com"
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-stone-50 border focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                style={{ borderColor: '#E7E5E4', color: '#1C1917' }}
                required
                autoFocus
              />
              <button type="submit" className="w-full mt-6 btn-primary">Send reset link</button>
            </form>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#f0fdf4' }}>
                <Mail className="w-8 h-8" style={{ color: '#16a34a' }} />
              </div>
              <h1 className="text-display-sm font-bold mb-2" style={{ color: '#1C1917' }}>Check your email</h1>
              <p className="text-sm mb-6" style={{ color: '#78716C' }}>We've sent a password reset link to <strong>{email}</strong>. The link expires in 1 hour.</p>
              <button onClick={() => navigate('/login')} className="font-medium" style={{ color: '#ea580c' }}>Back to sign in</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

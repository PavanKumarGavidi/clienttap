import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Zap, Mail, Lock, User, Building2, ArrowRight, Eye, EyeOff, Check } from 'lucide-react';

export default function AuthPages() {
  const location = useLocation();
  const path = location.pathname;

  if (path.includes('/signup')) return <SignupPage />;
  if (path.includes('/forgot-password')) return <ForgotPasswordPage />;
  return <LoginPage />;
}

function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');

  const passwordStrength = password.length >= 8 ? 
    password.match(/[A-Z]/) && password.match(/[0-9]/) ? 'strong' : 'medium' : 'weak';

  const handleContinue = () => {
    if (step < 3) setStep(step + 1);
    else navigate('/app/dashboard');
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
                <div className={`h-full transition-all ${s <= step ? 'w-full' : 'w-0'}`} style={{ backgroundColor: '#ea580c' }} />
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="animate-fade-in">
              <h1 className="text-display-sm font-bold mb-2" style={{ color: '#1C1917' }}>Create your account</h1>
              <p className="text-sm mb-6" style={{ color: '#78716C' }}>Start free. No credit card required.</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C1917' }}>Full name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#A8A29E' }} />
                    <input type="text" placeholder="Arjun Mehta" className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white border focus:outline-none focus:ring-2 focus:ring-orange-500/30" style={{ borderColor: '#E7E5E4', color: '#1C1917' }} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C1917' }}>Work email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#A8A29E' }} />
                    <input type="email" placeholder="you@agency.com" className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white border focus:outline-none focus:ring-2 focus:ring-orange-500/30" style={{ borderColor: '#E7E5E4', color: '#1C1917' }} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C1917' }}>Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#A8A29E' }} />
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a strong password" className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm bg-white border focus:outline-none focus:ring-2 focus:ring-orange-500/30" style={{ borderColor: '#E7E5E4', color: '#1C1917' }} />
                    <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#A8A29E' }}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {password && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#E7E5E4' }}>
                        <div className={`h-full rounded-full transition-all ${
                          passwordStrength === 'strong' ? 'w-full' : passwordStrength === 'medium' ? 'w-2/3' : 'w-1/3'
                        }`} style={{ backgroundColor: passwordStrength === 'strong' ? '#16a34a' : passwordStrength === 'medium' ? '#d97706' : '#dc2626' }} />
                      </div>
                      <span className="text-xs" style={{ color: passwordStrength === 'strong' ? '#16a34a' : passwordStrength === 'medium' ? '#d97706' : '#dc2626' }}>{passwordStrength}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C1917' }}>Country</label>
                  <select className="w-full px-4 py-2.5 rounded-xl text-sm bg-white border focus:outline-none focus:ring-2 focus:ring-orange-500/30" style={{ borderColor: '#E7E5E4', color: '#1C1917' }}>
                    <option value="IN">India (₹ INR)</option>
                    <option value="US">United States ($ USD)</option>
                    <option value="GB">United Kingdom (£ GBP)</option>
                  </select>
                </div>
              </div>

              <button onClick={handleContinue} className="w-full mt-6 btn-primary flex items-center justify-center gap-2">
                Continue <ArrowRight className="w-4 h-4" />
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t" style={{ borderColor: '#E7E5E4' }} /></div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2" style={{ backgroundColor: '#FAFAF8', color: '#A8A29E' }}>or</span>
                </div>
              </div>

              <button className="w-full py-3 rounded-xl font-medium border transition flex items-center justify-center gap-2 hover:bg-stone-50" style={{ borderColor: '#E7E5E4', color: '#1C1917' }}>
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Continue with Google
              </button>

              <p className="text-xs text-center mt-6" style={{ color: '#A8A29E' }}>
                Already have an account?{' '}
                <button onClick={() => navigate('/login')} className="font-medium" style={{ color: '#ea580c' }}>Sign in</button>
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <h1 className="text-display-sm font-bold mb-2" style={{ color: '#1C1917' }}>Set up your workspace</h1>
              <p className="text-sm mb-6" style={{ color: '#78716C' }}>Tell us about your agency or freelance business.</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C1917' }}>Agency name</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#A8A29E' }} />
                    <input type="text" placeholder="Pixel & Code Studio" className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white border focus:outline-none focus:ring-2 focus:ring-orange-500/30" style={{ borderColor: '#E7E5E4', color: '#1C1917' }} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C1917' }}>Agency slug</label>
                  <div className="flex">
                    <span className="px-3 py-2.5 rounded-l-xl text-sm border" style={{ backgroundColor: '#FAFAF8', borderColor: '#E7E5E4', color: '#78716C' }}>portal.clienttap.io/</span>
                    <input type="text" placeholder="pixelcode" className="flex-1 px-4 py-2.5 rounded-r-xl text-sm bg-white border focus:outline-none focus:ring-2 focus:ring-orange-500/30" style={{ borderColor: '#E7E5E4', color: '#1C1917' }} />
                  </div>
                  <p className="text-xs mt-1 flex items-center gap-1" style={{ color: '#16a34a' }}><Check className="w-3 h-3" /> Available</p>
                </div>
              </div>

              <button onClick={handleContinue} className="w-full mt-6 btn-primary flex items-center justify-center gap-2">
                Continue <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => setStep(1)} className="w-full mt-3 py-3 rounded-xl font-medium transition hover:bg-stone-100" style={{ color: '#78716C' }}>Back</button>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in">
              <h1 className="text-display-sm font-bold mb-2" style={{ color: '#1C1917' }}>Add your first client</h1>
              <p className="text-sm mb-6" style={{ color: '#78716C' }}>You can skip this and add clients later.</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C1917' }}>Client name</label>
                  <input type="text" placeholder="GreenLeaf Organics" className="w-full px-4 py-2.5 rounded-xl text-sm bg-white border focus:outline-none focus:ring-2 focus:ring-orange-500/30" style={{ borderColor: '#E7E5E4', color: '#1C1917' }} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C1917' }}>Client email</label>
                  <input type="email" placeholder="client@example.com" className="w-full px-4 py-2.5 rounded-xl text-sm bg-white border focus:outline-none focus:ring-2 focus:ring-orange-500/30" style={{ borderColor: '#E7E5E4', color: '#1C1917' }} />
                </div>
              </div>

              <button onClick={handleContinue} className="w-full mt-6 btn-primary">Go to Dashboard</button>
              <button onClick={handleContinue} className="w-full mt-3 py-3 rounded-xl font-medium transition hover:bg-stone-100" style={{ color: '#78716C' }}>Skip for now</button>
            </div>
          )}

          <div className="mt-6">
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" className="mt-1 rounded" style={{ accentColor: '#ea580c' }} />
              <span className="text-xs" style={{ color: '#A8A29E' }}>
                I agree to the <a href="#" style={{ color: '#ea580c' }}>Terms of Service</a> and <a href="#" style={{ color: '#ea580c' }}>Privacy Policy</a>
              </span>
            </label>
          </div>
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

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C1917' }}>Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#A8A29E' }} />
                <input type="email" placeholder="you@agency.com" className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-stone-50 border focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:bg-white" style={{ borderColor: '#E7E5E4', color: '#1C1917' }} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C1917' }}>Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#A8A29E' }} />
                <input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm bg-stone-50 border focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:bg-white" style={{ borderColor: '#E7E5E4', color: '#1C1917' }} />
                <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#A8A29E' }}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded" style={{ accentColor: '#ea580c' }} />
                <span className="text-sm" style={{ color: '#1C1917' }}>Remember me</span>
              </label>
              <button onClick={() => navigate('/forgot-password')} className="text-sm font-medium" style={{ color: '#ea580c' }}>Forgot password?</button>
            </div>
          </div>

          <button onClick={() => navigate('/app/dashboard')} className="w-full mt-6 btn-primary">Sign in</button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t" style={{ borderColor: '#E7E5E4' }} /></div>
            <div className="relative flex justify-center text-xs"><span className="px-2 bg-white" style={{ color: '#A8A29E' }}>or</span></div>
          </div>

          <button className="w-full py-3 rounded-xl font-medium border transition flex items-center justify-center gap-2 hover:bg-stone-50" style={{ borderColor: '#E7E5E4', color: '#1C1917' }}>
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>

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
  const [sent, setSent] = useState(false);

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
            <>
              <h1 className="text-display-sm font-bold mb-2" style={{ color: '#1C1917' }}>Forgot password?</h1>
              <p className="text-sm mb-6" style={{ color: '#78716C' }}>Enter your email and we'll send you a reset link.</p>
              <input type="email" placeholder="you@agency.com" className="w-full px-4 py-2.5 rounded-xl text-sm bg-stone-50 border focus:outline-none focus:ring-2 focus:ring-orange-500/30" style={{ borderColor: '#E7E5E4', color: '#1C1917' }} />
              <button onClick={() => setSent(true)} className="w-full mt-6 btn-primary">Send reset link</button>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#f0fdf4' }}>
                <Mail className="w-8 h-8" style={{ color: '#16a34a' }} />
              </div>
              <h1 className="text-display-sm font-bold mb-2" style={{ color: '#1C1917' }}>Check your email</h1>
              <p className="text-sm mb-6" style={{ color: '#78716C' }}>We've sent a password reset link to your email.</p>
              <button onClick={() => navigate('/login')} className="font-medium" style={{ color: '#ea580c' }}>Back to sign in</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

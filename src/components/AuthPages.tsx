import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../App';
import { Zap, Mail, Lock, User, Building2, Globe, ArrowRight, Check, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function AuthPages() {
  const location = useLocation();
  const path = location.pathname;

  if (path.includes('/signup')) return <SignupPage />;
  if (path.includes('/login')) return <LoginPage />;
  if (path.includes('/forgot-password')) return <ForgotPasswordPage />;
  if (path.includes('/reset-password')) return <ResetPasswordPage />;
  if (path.includes('/accept-invite')) return <AcceptInvitePage />;
  if (path.includes('/portal') && path.includes('/login')) return <PortalLoginPage />;
  
  return <LoginPage />;
}

function SignupPage() {
  const { darkMode, toggleDarkMode } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
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

  const handleContinue = () => {
    if (step < 3) setStep(step + 1);
    else navigate('/app/dashboard');
  };

  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-[#0f0f0f] text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Client<span className="text-orange-600">tap</span></span>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1 h-1 rounded-full overflow-hidden bg-gray-200 dark:bg-white/10">
                <div className={`h-full transition-all ${s <= step ? 'bg-orange-600 w-full' : 'w-0'}`} />
              </div>
            ))}
          </div>

          {/* Step 1: Account */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h1 className="text-2xl font-bold mb-2">Create your account</h1>
              <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Start free. No credit card required.</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Full name</label>
                  <div className="relative">
                    <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Arjun Mehta"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400'} border focus:outline-none focus:ring-2 focus:ring-orange-500/50`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Work email</label>
                  <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="you@agency.com"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400'} border focus:outline-none focus:ring-2 focus:ring-orange-500/50`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      placeholder="Create a strong password"
                      className={`w-full pl-10 pr-10 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400'} border focus:outline-none focus:ring-2 focus:ring-orange-500/50`}
                    />
                    <button onClick={() => setShowPassword(!showPassword)} className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {formData.password && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${
                          passwordStrength === 'strong' ? 'bg-green-500 w-full' :
                          passwordStrength === 'medium' ? 'bg-amber-500 w-2/3' : 'bg-red-500 w-1/3'
                        }`} />
                      </div>
                      <span className={`text-xs ${
                        passwordStrength === 'strong' ? 'text-green-500' :
                        passwordStrength === 'medium' ? 'text-amber-500' : 'text-red-500'
                      }`}>{passwordStrength}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Country</label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    className={`w-full px-4 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'} border focus:outline-none focus:ring-2 focus:ring-orange-500/50`}
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

              <button onClick={handleContinue} className="w-full mt-6 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-medium transition flex items-center justify-center gap-2">
                Continue <ArrowRight className="w-4 h-4" />
              </button>

              <div className="relative my-6">
                <div className={`absolute inset-0 flex items-center ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
                  <div className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className={`px-2 ${darkMode ? 'bg-[#0f0f0f] text-gray-500' : 'bg-gray-50 text-gray-500'}`}>or</span>
                </div>
              </div>

              <button className={`w-full py-3 rounded-lg font-medium border transition flex items-center justify-center gap-2 ${darkMode ? 'border-white/10 hover:bg-white/5' : 'border-gray-200 hover:bg-gray-50'}`}>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <p className={`text-xs text-center mt-6 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Already have an account?{' '}
                <button onClick={() => navigate('/login')} className="text-orange-600 font-medium">Sign in</button>
              </p>
            </div>
          )}

          {/* Step 2: Workspace */}
          {step === 2 && (
            <div className="animate-fade-in">
              <h1 className="text-2xl font-bold mb-2">Set up your workspace</h1>
              <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Tell us about your agency or freelance business.</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Agency / Business name</label>
                  <div className="relative">
                    <Building2 className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    <input
                      type="text"
                      value={formData.workspaceName}
                      onChange={(e) => setFormData({...formData, workspaceName: e.target.value})}
                      placeholder="Pixel & Code Studio"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400'} border focus:outline-none focus:ring-2 focus:ring-orange-500/50`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Agency slug</label>
                  <div className="flex">
                    <span className={`px-3 py-2.5 rounded-l-lg text-sm ${darkMode ? 'bg-white/10 border-white/10 text-gray-400' : 'bg-gray-100 border-gray-200 text-gray-500'} border`}>
                      portal.clienttap.io/
                    </span>
                    <input
                      type="text"
                      value={formData.workspaceSlug}
                      onChange={(e) => setFormData({...formData, workspaceSlug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                      placeholder="pixelcode"
                      className={`flex-1 px-4 py-2.5 rounded-r-lg text-sm ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400'} border focus:outline-none focus:ring-2 focus:ring-orange-500/50`}
                    />
                  </div>
                  {formData.workspaceSlug && (
                    <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Available
                    </p>
                  )}
                </div>

                {formData.country === 'IN' && (
                  <div>
                    <label className="block text-sm font-medium mb-1.5">GSTIN (optional)</label>
                    <input
                      type="text"
                      placeholder="29ABCDE1234F1Z5"
                      className={`w-full px-4 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400'} border focus:outline-none focus:ring-2 focus:ring-orange-500/50`}
                    />
                    <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>For GST-compliant invoicing</p>
                  </div>
                )}
              </div>

              <button onClick={handleContinue} className="w-full mt-6 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-medium transition flex items-center justify-center gap-2">
                Continue <ArrowRight className="w-4 h-4" />
              </button>

              <button onClick={() => setStep(1)} className={`w-full mt-3 py-3 rounded-lg font-medium transition ${darkMode ? 'text-gray-400 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-100'}`}>
                Back
              </button>
            </div>
          )}

          {/* Step 3: First Client */}
          {step === 3 && (
            <div className="animate-fade-in">
              <h1 className="text-2xl font-bold mb-2">Add your first client</h1>
              <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>You can skip this and add clients later.</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Client name</label>
                  <input
                    type="text"
                    placeholder="GreenLeaf Organics"
                    className={`w-full px-4 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400'} border focus:outline-none focus:ring-2 focus:ring-orange-500/50`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Client email</label>
                  <input
                    type="email"
                    placeholder="client@example.com"
                    className={`w-full px-4 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400'} border focus:outline-none focus:ring-2 focus:ring-orange-500/50`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Invite a teammate (optional)</label>
                  <input
                    type="email"
                    placeholder="teammate@agency.com"
                    className={`w-full px-4 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400'} border focus:outline-none focus:ring-2 focus:ring-orange-500/50`}
                  />
                </div>
              </div>

              <button onClick={handleContinue} className="w-full mt-6 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-medium transition">
                Go to Dashboard
              </button>

              <button onClick={handleContinue} className={`w-full mt-3 py-3 rounded-lg font-medium transition ${darkMode ? 'text-gray-400 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-100'}`}>
                Skip for now
              </button>
            </div>
          )}

          {/* Terms */}
          <div className="mt-6">
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" className="mt-1 rounded text-orange-600" />
              <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                I agree to the <a href="#" className="text-orange-600">Terms of Service</a> and <a href="#" className="text-orange-600">Privacy Policy</a>
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Right side - Hero */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-orange-600 to-orange-500 items-center justify-center p-12">
        <div className="max-w-md text-white">
          <h2 className="text-3xl font-bold mb-4">Run every client from first enquiry to final payment</h2>
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
  const { darkMode } = useApp();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`min-h-screen flex items-center justify-center p-8 ${darkMode ? 'bg-[#0f0f0f] text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">Client<span className="text-orange-600">tap</span></span>
        </div>

        <div className={`${darkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'} border rounded-2xl p-8`}>
          <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
          <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Sign in to your workspace</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  type="email"
                  placeholder="you@agency.com"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'} border focus:outline-none focus:ring-2 focus:ring-orange-500/50`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'} border focus:outline-none focus:ring-2 focus:ring-orange-500/50`}
                />
                <button onClick={() => setShowPassword(!showPassword)} className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-orange-600" />
                <span className="text-sm">Remember me</span>
              </label>
              <button onClick={() => navigate('/forgot-password')} className="text-sm text-orange-600 font-medium">Forgot password?</button>
            </div>
          </div>

          <button onClick={() => navigate('/app/dashboard')} className="w-full mt-6 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-medium transition">
            Sign in
          </button>

          <div className="relative my-6">
            <div className={`absolute inset-0 flex items-center ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className={`px-2 ${darkMode ? 'bg-[#1a1a1a] text-gray-500' : 'bg-white text-gray-500'}`}>or</span>
            </div>
          </div>

          <button className={`w-full py-3 rounded-lg font-medium border transition flex items-center justify-center gap-2 ${darkMode ? 'border-white/10 hover:bg-white/5' : 'border-gray-200 hover:bg-gray-50'}`}>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p className={`text-xs text-center mt-6 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            Don't have an account?{' '}
            <button onClick={() => navigate('/signup')} className="text-orange-600 font-medium">Sign up free</button>
          </p>
        </div>
      </div>
    </div>
  );
}

function ForgotPasswordPage() {
  const { darkMode } = useApp();
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);

  return (
    <div className={`min-h-screen flex items-center justify-center p-8 ${darkMode ? 'bg-[#0f0f0f] text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">Client<span className="text-orange-600">tap</span></span>
        </div>

        <div className={`${darkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'} border rounded-2xl p-8`}>
          {!sent ? (
            <>
              <h1 className="text-2xl font-bold mb-2">Forgot password?</h1>
              <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Enter your email and we'll send you a reset link.</p>

              <div>
                <label className="block text-sm font-medium mb-1.5">Email</label>
                <input
                  type="email"
                  placeholder="you@agency.com"
                  className={`w-full px-4 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'} border focus:outline-none focus:ring-2 focus:ring-orange-500/50`}
                />
              </div>

              <button onClick={() => setSent(true)} className="w-full mt-6 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-medium transition">
                Send reset link
              </button>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Check your email</h1>
              <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>We've sent a password reset link to your email. The link expires in 1 hour.</p>
              <button onClick={() => navigate('/login')} className="text-orange-600 font-medium">Back to sign in</button>
            </div>
          )}

          <p className={`text-xs text-center mt-6 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            Remember your password?{' '}
            <button onClick={() => navigate('/login')} className="text-orange-600 font-medium">Sign in</button>
          </p>
        </div>
      </div>
    </div>
  );
}

function ResetPasswordPage() {
  const { darkMode } = useApp();
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen flex items-center justify-center p-8 ${darkMode ? 'bg-[#0f0f0f] text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">Client<span className="text-orange-600">tap</span></span>
        </div>

        <div className={`${darkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'} border rounded-2xl p-8`}>
          <h1 className="text-2xl font-bold mb-2">Reset your password</h1>
          <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Enter your new password below.</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">New password</label>
              <input
                type="password"
                placeholder="Enter new password"
                className={`w-full px-4 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'} border focus:outline-none focus:ring-2 focus:ring-orange-500/50`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Confirm password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                className={`w-full px-4 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'} border focus:outline-none focus:ring-2 focus:ring-orange-500/50`}
              />
            </div>
          </div>

          <button onClick={() => navigate('/login')} className="w-full mt-6 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-medium transition">
            Reset password
          </button>
        </div>
      </div>
    </div>
  );
}

function PortalLoginPage() {
  const { darkMode } = useApp();
  const navigate = useNavigate();
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  return (
    <div className={`min-h-screen flex items-center justify-center p-8 ${darkMode ? 'bg-[#0f0f0f] text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="w-full max-w-md">
        {/* Agency branding */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          <span className="text-3xl">🎨</span>
          <div>
            <p className="text-lg font-bold">Pixel & Code Studio</p>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Client Portal</p>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'} border rounded-2xl p-8`}>
          {isFirstLogin ? (
            <>
              <h1 className="text-2xl font-bold mb-2">Set your password</h1>
              <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Welcome! Please set a new password for your portal account.</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">New password</label>
                  <input type="password" placeholder="Create a password" className={`w-full px-4 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'} border focus:outline-none focus:ring-2 focus:ring-orange-500/50`} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Confirm password</label>
                  <input type="password" placeholder="Confirm password" className={`w-full px-4 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'} border focus:outline-none focus:ring-2 focus:ring-orange-500/50`} />
                </div>
              </div>

              <button onClick={() => navigate('/portal')} className="w-full mt-6 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-medium transition">
                Set password & continue
              </button>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-2">Sign in to portal</h1>
              <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Access your projects, invoices, and documents.</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Email</label>
                  <input type="email" placeholder="you@example.com" className={`w-full px-4 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'} border focus:outline-none focus:ring-2 focus:ring-orange-500/50`} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Password</label>
                  <input type="password" placeholder="Enter your password" className={`w-full px-4 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'} border focus:outline-none focus:ring-2 focus:ring-orange-500/50`} />
                </div>
              </div>

              <button onClick={() => navigate('/portal')} className="w-full mt-6 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-medium transition">
                Sign in
              </button>

              <div className="flex items-center justify-between mt-4">
                <button className="text-sm text-orange-600 font-medium">Forgot password?</button>
                <button onClick={() => setIsFirstLogin(true)} className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>First time? Set password</button>
              </div>
            </>
          )}
        </div>

        <p className={`text-xs text-center mt-6 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
          Powered by <span className="font-medium">Clienttap</span>
        </p>
      </div>
    </div>
  );
}

function AcceptInvitePage() {
  const { darkMode } = useApp();
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen flex items-center justify-center p-8 ${darkMode ? 'bg-[#0f0f0f] text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">Client<span className="text-orange-600">tap</span></span>
        </div>

        <div className={`${darkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'} border rounded-2xl p-8`}>
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-orange-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">You're invited!</h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <strong>Arjun Mehta</strong> has invited you to join <strong>Pixel & Code Studio</strong> as a <strong>Team Member</strong>.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Your name</label>
              <input type="text" placeholder="Your full name" className={`w-full px-4 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'} border focus:outline-none focus:ring-2 focus:ring-orange-500/50`} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Create a password</label>
              <input type="password" placeholder="Create a password" className={`w-full px-4 py-2.5 rounded-lg text-sm ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'} border focus:outline-none focus:ring-2 focus:ring-orange-500/50`} />
            </div>
          </div>

          <button onClick={() => navigate('/app/dashboard')} className="w-full mt-6 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-medium transition">
            Accept invitation
          </button>
        </div>
      </div>
    </div>
  );
}

import { SignIn, useAuth, useClerk } from '@clerk/react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const DEMO_CREDENTIALS = {
  identifier: 'demo@fridgewise.app',
  password: 'DemoUser123!',
} as const;

export default function SignInPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const { client, setActive } = useClerk();
  const navigate = useNavigate();

  const [demoLoading, setDemoLoading] = useState(false);
  const [demoError, setDemoError] = useState('');

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    setDemoError('');

    try {
      const result = await client.signIn.create(DEMO_CREDENTIALS);

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        navigate('/dashboard');
        return;
      }

      if (result.status === 'needs_second_factor') {
        setDemoError('Demo login blocked — disable MFA in Clerk dashboard.');
        return;
      }

      setDemoError('Unexpected sign-in state. Please try again.');
    } catch (err) {
      console.error('[Demo login failed]:', err);
      setDemoError('Demo unavailable right now. Try again shortly.');
    } finally {
      setDemoLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a4731]" />
      </div>
    );
  }

  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center gap-4 w-full max-w-md px-4">

        <button
          onClick={handleDemoLogin}
          disabled={demoLoading}
          className="w-full bg-[#1a4731] text-white py-3 px-6 rounded-xl font-medium hover:bg-[#133524] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {demoLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              Signing you in...
            </span>
          ) : (
            ' Try Demo — No Sign Up Needed'
          )}
        </button>

        {demoError && (
          <p className="text-red-500 text-sm text-center">{demoError}</p>
        )}

        <div className="flex items-center gap-2 text-gray-400 text-sm w-full">
          <div className="flex-1 h-px bg-gray-200" />
          <span>or sign in with your account</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <SignIn
          signUpUrl="/sign-up"
          fallbackRedirectUrl="/dashboard"
          appearance={{
            variables: {
              colorPrimary: '#1a4731',
              colorBackground: '#ffffff',
              colorText: '#111827',
              borderRadius: '0.75rem',
            },
            elements: {
              card: 'shadow-sm border border-gray-100 rounded-2xl p-8',
              headerTitle: 'font-serif text-3xl font-bold text-gray-900',
              headerSubtitle: 'text-gray-500 text-base',
              formButtonPrimary: 'bg-[#1a4731] hover:bg-[#133524] text-white py-3',
              socialButtonsBlockButton: 'border-gray-200 text-gray-700 hover:bg-gray-50 py-3',
              formFieldInput: 'bg-gray-50 border-gray-200 py-3 rounded-lg',
              footerActionLink: 'text-[#1a4731] hover:text-[#133524] font-bold',
            },
          }}
        />
      </div>
    </div>
  );
}
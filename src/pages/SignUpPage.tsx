import { SignUp } from '@clerk/react';

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <SignUp 
        signInUrl="/sign-in"
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
          }
        }}
      />
    </div>
  );
}
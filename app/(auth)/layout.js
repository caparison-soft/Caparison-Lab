export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-primary p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: 'var(--gradient-mesh)' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      {/* Auth Content */}
      <div className="relative z-10 w-full max-w-md animate-slide-up">
        {children}
      </div>
    </div>
  );
}

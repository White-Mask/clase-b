type AppShellProps = {
  children: React.ReactNode;
  className?: string;
};

export function AppShell({
  children,
  className = "",
}: AppShellProps) {
  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <div
        className={`mx-auto w-full max-w-[760px] px-5 pb-28 pt-6 sm:px-8 sm:pt-8 ${className}`}
      >
        {children}
      </div>
    </main>
  );
}

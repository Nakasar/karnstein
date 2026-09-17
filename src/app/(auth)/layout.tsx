export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col justify-center px-4 py-16 sm:px-6 sm:py-24">
      {children}
    </div>
  );
}

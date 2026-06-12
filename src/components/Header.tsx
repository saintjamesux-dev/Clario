export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground">
            <span className="text-xs font-bold text-background">C</span>
          </div>
          <span className="text-sm font-semibold tracking-tight">Clario</span>
        </div>
        <span className="text-xs text-muted">Design critique, not chat</span>
      </div>
    </header>
  );
}
import BottomNav from "@/components/bottomNav/index.bottomNav";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
      <BottomNav  />
    </div>
  );
}

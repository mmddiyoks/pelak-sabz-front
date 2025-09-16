import BottomNav from "@/components/bottomNav/index.bottomNav";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[425px] mx-auto ">
      {children}
      <BottomNav />
    </div>
  );
}

import PageTransition from "@/components/page-transition";

const MainLayout = ({ children }) => {
  return (
    <div className="container mx-auto my-32">
      <PageTransition>{children}</PageTransition>
    </div>
  );
};

export default MainLayout;

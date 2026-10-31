import Header from "@/components/header";
import SiteFooter from "@/components/home/site-footer";
import PageTransition from "@/components/page-transition";

const MainLayout = ({ children }) => {
  return (
    <>
      <Header />
      <div className="container mx-auto my-32">
        <PageTransition>{children}</PageTransition>
      </div>
      <SiteFooter />
    </>
  );
};

export default MainLayout;

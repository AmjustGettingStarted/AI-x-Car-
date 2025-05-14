import HomeSearch from "@/components/home-search";
import "../app/globals.css";

export default function Home() {
  return (
    <div className="pt-20 flex flex-col">
      {/* Header */}
      <section className="relative dotted-background py-16 md:py-28 ">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-8xl mb-4 gradient font-extrabold tracking-tighter pr-2 pb-2 text-transparent bg-clip-text bg-gradient-to-br from-blue-500 to-green-500">
              Find Your Dream Car with AIxCAR
            </h1>
            <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto">
              Advanced AI Car Search and test drive from thousands of vehicles
            </p>
          </div>
          {/* Search */}
          <HomeSearch />
        </div>
      </section>
    </div>
  );
}

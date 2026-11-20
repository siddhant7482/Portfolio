import SmoothScroll from "@/components/SmoothScroll";
import Loader from "@/components/Loader";
import Hero from "@/components/Hero";
import Origin from "@/components/Origin";
import Journey from "@/components/Journey";
import Arrival from "@/components/Arrival";
import BestWork from "@/components/BestWork";
import Depot from "@/components/Depot";
import Contact from "@/components/Contact";
import Chrome from "@/components/Chrome";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Loader />
      <main>
        <Hero />
        <Origin />
        <Journey />
        <Arrival />
        <BestWork />
        <Depot />
        <Contact />
      </main>
      <Chrome />
    </>
  );
}

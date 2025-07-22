import { Footer } from "../Components/Footer"
import { ContactPreview } from "../Components/Home/ContactPreview"
import { DoctorsPreview } from "../Components/Home/DoctorsPreview"
import { Hero } from "../Components/Home/Hero"
import { Services } from "../Components/Home/Services"
import { WhyChooseUs } from "../Components/Home/WhyChooseUs"
import { NavBar } from "../Components/NavBar"

export const Home = () => {
  return (
    <div>
        <NavBar/>
        <Hero/>
        <Services/>
        <WhyChooseUs/>
        <DoctorsPreview/>
        <ContactPreview/>
        <Footer/>
    </div>
  )
}

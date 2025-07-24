import Container from "../Components/Container"
import { Footer } from "../Components/Footer"
import { DoctorsPreview } from "../Components/Home/DoctorsPreview"
import { NavBar } from "../Components/NavBar"


export const DoctorPage = () => {
  return (
    <div>
         <NavBar />
         <Container>
        <DoctorsPreview/>
         </Container>
        <Footer />
    </div>
  )
}

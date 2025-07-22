import { Footer } from "../Footer"
import { NavBar } from "../NavBar"
import { DoctorsLayout } from "../../dashBoardDesign/DoctorsLayout"

export const DoctorDashBoard = () => {
  return (
    <div>
        <NavBar/>
        <DoctorsLayout/>
        <Footer/>
    </div>
  )
}

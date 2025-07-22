import { useSelector } from "react-redux";
import { Profile } from "../../Components/dashboard/Profile";
import type { RootState } from "../../App/store";

export const DoctorProfile = () => {
  useSelector((state: RootState) => state.auth);

  return (
    <Profile />
  );
};

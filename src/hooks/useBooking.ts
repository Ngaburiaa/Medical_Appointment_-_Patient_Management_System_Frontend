import Swal from "sweetalert2";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { appointmentApi } from "../Features/api/appointmentAPI";
import type { RootState } from '../App/store';
import { useNavigate } from "react-router";

type Doctor = {
  doctorId: number;
  specialization: string;
  bio: string;
  availableDays: string;
  user: {
    firstName: string;
    lastName: string;
    address: string;
    profileURL: string | null;
  };
  appointments: {
    userId: number | undefined;
    appointmentId: number;
    appointmentDate: string;
    timeSlot: string;
    appointmentStatus: string;
  }[];
};

export const useBooking = (navigate: ReturnType<typeof useNavigate>) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [createAppointment] = appointmentApi.useCreateAppoinmentMutation();

  const timeSlots = [
    "8:00am - 10:00am",
    "10:00am - 12:00pm",
    "12:00pm - 2:00pm",
    "2:00pm - 4:00pm",
    "4:00pm - 6:00pm",
  ];

  const dayNameToNumber: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  const getDayNumbers = (availableDays: string): number[] => {
    return availableDays
      .split(",")
      .map((day) => day.trim())
      .map((day) => dayNameToNumber[day])
      .filter((day): day is number => day !== undefined);
  };

  const handleBook = async (doctor: Doctor) => {
    const allowedDays = getDayNumbers(doctor.availableDays);
    let selectedDate = "";
    
    if (!user) {
      Swal.fire("Not Logged In", "Please log in to book an appointment.", "warning");
       localStorage.setItem("pendingBookingDoctorId", doctor.doctorId.toString());
    navigate("/login")
     return;
    }

    const hasExistingAppointment = doctor.appointments.some(
      (appt) =>
        appt.appointmentStatus.toLowerCase() === "confirmed"  &&
        appt.userId === user?.userId 
    );

    if (hasExistingAppointment) {
      Swal.fire({
        icon: "info",
        title: "Already Booked",
        text: `You already have an active appointment with Dr. ${doctor.user.lastName}.`,
        confirmButtonColor: "#1AB2E5",
      });
      return;
    }

    await Swal.fire({
      title: `Book Appointment with Dr. ${doctor.user.lastName}`,
      html: `
        <div class="text-left">
          <p class="mb-2"><strong>Specialization:</strong> ${doctor.specialization}</p>
          <p class="mb-4"><strong>Available Days:</strong> ${doctor.availableDays}</p>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Appointment Date</label>
              <input 
                type="date" 
                id="appointment-date" 
                class="swal2-input w-full p-2 border rounded"
                min="${new Date().toISOString().split("T")[0]}"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
              <select id="time-slot" class="swal2-input w-full p-2 border rounded">
                <option value="">Select a date first</option>
              </select>
            </div>
          </div>
        </div>
      `,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: "Confirm Booking",
      confirmButtonColor: "#1AB2E5",
      cancelButtonText: "Cancel",
      didOpen: () => {
        const dateInput = document.getElementById("appointment-date") as HTMLInputElement;
        const slotSelect = document.getElementById("time-slot") as HTMLSelectElement;

        dateInput?.addEventListener("change", () => {
          selectedDate = dateInput.value;
          const selectedDay = new Date(selectedDate).getDay();

          if (!allowedDays.includes(selectedDay)) {
            Swal.showValidationMessage(
              `Doctor is not available on ${new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' })}`
            );
            slotSelect.innerHTML = `<option value="">Unavailable</option>`;
            return;
          }

          Swal.resetValidationMessage();

          // Find booked time slots for the selected date
          const bookedSlots = doctor.appointments
            .filter(
              (appt) =>
                appt.appointmentDate === selectedDate &&
                appt.appointmentStatus.toLowerCase() !== "cancelled"
            )
            .map((appt) => appt.timeSlot);

          const availableSlots = timeSlots.filter((slot) => !bookedSlots.includes(slot));

          if (availableSlots.length === 0) {
            slotSelect.innerHTML = `<option value="">No available time slots</option>`;
          } else {
            slotSelect.innerHTML =
              `<option value="">Select Time Slot</option>` +
              availableSlots.map((slot) => `<option value="${slot}">${slot}</option>`).join("");
          }
        });
      },
      preConfirm: () => {
        const dateInput = document.getElementById("appointment-date") as HTMLInputElement;
        const timeSelect = document.getElementById("time-slot") as HTMLSelectElement;

        const date = dateInput?.value;
        const timeSlot = timeSelect?.value;

        if (!date || !timeSlot) {
          Swal.showValidationMessage("Please select both date and time slot");
          return;
        }

        const selectedDay = new Date(date).getDay();
        if (!allowedDays.includes(selectedDay)) {
          Swal.showValidationMessage(
            `Doctor is not available on ${new Date(date).toLocaleDateString('en-US', { weekday: 'long' })}`
          );
          return;
        }

        return { date, timeSlot };
      },
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        const { date, timeSlot } = result.value;
        const payload = {
          userId: user?.userId,
          doctorId: doctor.doctorId,
          appointmentDate: date,
          timeSlot,
          totalAmount: "200.0",
        };

        try {
          await createAppointment(payload).unwrap();
          toast.success(`Appointment booked with Dr. ${doctor.user.lastName}`, {
            description: `${date} at ${timeSlot}`,
          });
          Swal.fire({
            title: "Success!",
            text: `Your appointment is scheduled for ${date} at ${timeSlot}`,
            icon: "success",
            confirmButtonColor: "#1AB2E5",
          });
        } catch (error) {
          console.error("Booking failed:", error);
          toast.error("Failed to book appointment");
          Swal.fire({
            title: "Error",
            text: "Failed to book appointment. Please try again.",
            icon: "error",
            confirmButtonColor: "#1AB2E5",
          });
        }
      }
    });
  };

  return { handleBook };
};
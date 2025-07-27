import { useState, useEffect } from "react";
import { FiX, FiClock, FiUser, FiMapPin, FiChevronLeft } from "react-icons/fi";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { appointmentApi } from "../Features/api/appointmentAPI";
import { doctorApi } from "../Features/api/doctorAPI";
import { userApi } from "../Features/api/userAPI";
import type { RootState } from "../App/store";
import { format, isAfter, isEqual, parseISO, startOfDay } from "date-fns";

interface BookingModalProps {
  onClose: () => void;
  onSuccess: (newAppointment?: any) => void;
  doctor?: Doctor;
  initialDate?: string;
  initialTime?: string;
  mode?: "new" | "reschedule";
  appointmentIdToUpdate?: number;
}

interface Doctor {
  doctorId: number;
  specialization: string;
  bio: string;
  availableDays: string;
  user: {
    firstName: string;
    lastName: string;
    address: string;
    profileURL?: string;
  };
}

interface Appointment {
  appointmentId: number;
  doctorId: number;
  userId: number;
  appointmentDate: string;
  timeSlot: string;
  appointmentStatus: "Pending" | "Confirmed" | "Cancelled";
}

const DAY_MAP: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

const TIME_SLOTS = [
  "8:00am - 10:00am",
  "10:00am - 12:00pm",
  "12:00pm - 2:00pm",
  "2:00pm - 4:00pm",
  "4:00pm - 6:00pm",
];

export const BookingModal = ({
  onClose,
  onSuccess,
  doctor,
  initialDate = "",
  initialTime = "",
  mode = "new",
  appointmentIdToUpdate,
}: BookingModalProps) => {
  const { user } = useSelector((state: RootState) => state.auth);

  const { data: doctors = [], isLoading: loadingDoctors } =
    doctorApi.useGetAllDoctorsQuery(undefined);
  const { data: userDetails, isLoading: loadingUser } =
    userApi.useGetUserByIdQuery(user?.userId!);
  const appointments = userDetails?.appointments ?? [];

  const [createAppointment] = appointmentApi.useCreateAppointmentMutation();
  const [updateAppointment] =
    appointmentApi.useUpdateAppointmentProfileMutation();

  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(
    doctor || null
  );
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedTime, setSelectedTime] = useState(initialTime);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(doctor ? 2 : 1);
  const [hasShownInvalidDayToast, setHasShownInvalidDayToast] = useState(false);

  useEffect(() => {
    if (!selectedDate || !selectedDoctor) return;

    const selectedDay = new Date(selectedDate).getDay();
    const doctorDays = selectedDoctor.availableDays
      .split(",")
      .map((day) => DAY_MAP[day.trim()])
      .filter((day) => day !== undefined);

    const isValidDay = doctorDays.includes(selectedDay);

    if (!isValidDay) {
      if (!hasShownInvalidDayToast) {
        toast.error(
          `Doctor not available on ${new Date(selectedDate).toLocaleDateString(
            "en-US",
            { weekday: "long" }
          )}`
        );
        setHasShownInvalidDayToast(true);
      }
      setAvailableSlots([]);
      return;
    }

    setHasShownInvalidDayToast(false);

    const bookedSlots = appointments
      .filter(
        (appt: Appointment) =>
          appt.doctorId === selectedDoctor.doctorId &&
          appt.appointmentDate === selectedDate &&
          appt.appointmentStatus !== "Cancelled" &&
          (mode === "new" || appt.appointmentId !== appointmentIdToUpdate)
      )
      .map((appt: { timeSlot: any }) => appt.timeSlot);

    const sortedAvailableSlots = TIME_SLOTS.filter(
      (slot) => !bookedSlots.includes(slot)
    ).sort((a, b) => {
      const getTimeValue = (slot: string) => {
        const [time, period] = slot.split(" - ")[0].split(/(am|pm)/i);
        const [hours, minutes] = time.split(":").map(Number);
        let total = hours * 60 + (minutes || 0);
        if (period === "pm" && hours !== 12) total += 12 * 60;
        if (period === "am" && hours === 12) total -= 12 * 60;
        return total;
      };
      return getTimeValue(a) - getTimeValue(b);
    });

    setAvailableSlots(sortedAvailableSlots);
  }, [
    selectedDate,
    selectedDoctor,
    appointments,
    mode,
    appointmentIdToUpdate,
    hasShownInvalidDayToast,
  ]);

  const handleSubmit = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime || !user) {
      toast.error("Please complete all fields and log in");
      return;
    }

    const formattedDate = parseISO(selectedDate);
    const formattedDateString = format(formattedDate, "yyyy-MM-dd");

    const payload = {
      doctorId: selectedDoctor.doctorId,
      appointmentDate: formattedDateString,
      timeSlot: selectedTime,
      userId: user.userId,
      totalAmount: "2",
    };

    try {
      if (mode === "reschedule" && appointmentIdToUpdate) {
        await updateAppointment({
          appointment_id: appointmentIdToUpdate,
          ...payload,
        }).unwrap();
        toast.success("Appointment rescheduled successfully");
        onSuccess();
        onClose();
      } else {
        const today = startOfDay(new Date());

        const hasActiveAppointment = appointments.some((appt: Appointment) => {
          const isActiveStatus =
            appt.appointmentStatus === "Pending" ||
            appt.appointmentStatus === "Confirmed";
          const apptDate = startOfDay(parseISO(appt.appointmentDate));
          const isFutureOrToday =
            isAfter(apptDate, today) || isEqual(apptDate, today);
          return isActiveStatus && isFutureOrToday;
        });

        if (hasActiveAppointment) {
          toast.error("You already have an active appointment...");
          return;
        }

        const newAppointment = await createAppointment(payload).unwrap();
        console.log('API Response:', newAppointment); 
        toast.success("Appointment booked successfully");
        onSuccess({appointmentId:newAppointment.appointmentId, 
  totalAmount: newAppointment.totalAmount
});
        onClose();
      }
    } catch {
      toast.error(
        `Failed to ${mode === "reschedule" ? "reschedule" : "book"} appointment`
      );
    }
  };

  if (loadingUser) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-md p-6 text-center">
          <p className="text-gray-600">Loading your appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {currentStep === 1 ? "Select Doctor" : "Select Date & Time"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX className="text-xl" />
            </button>
          </div>

          {currentStep === 1 ? (
            <div className="space-y-4">
              {loadingDoctors ? (
                <p className="text-center text-gray-500">Loading doctors...</p>
              ) : (
                doctors.map((doc: Doctor) => (
                  <div
                    key={doc.doctorId}
                    onClick={() => {
                      setSelectedDoctor(doc);
                      setCurrentStep(2);
                    }}
                    className="p-4 border rounded-lg cursor-pointer hover:border-blue-500"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                        <FiUser className="text-xl" />
                      </div>
                      <div>
                        <h3 className="font-medium truncate">
                          Dr. {doc.user.firstName} {doc.user.lastName}
                        </h3>
                        <p className="text-blue-600 text-sm">
                          {doc.specialization}
                        </p>
                        <p className="text-600 text-sm">{doc.availableDays}</p>
                        <p className="text-gray-500 text-sm flex items-center">
                          <FiMapPin className="mr-1" /> {doc.user.address}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="p-2 text-gray-500 hover:text-blue-600"
                >
                  <FiChevronLeft />
                </button>
                <div className="bg-white p-3 rounded-full text-blue-600">
                  <FiUser />
                </div>
                <div>
                  <h3 className="font-medium">
                    Dr. {selectedDoctor?.user?.firstName}{" "}
                    {selectedDoctor?.user?.lastName}
                  </h3>
                  <p className="text-blue-600 text-sm">
                    {selectedDoctor?.specialization}
                  </p>
                  <p className="text-600 text-sm">
                    {selectedDoctor?.availableDays}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Appointment Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedTime("");
                  }}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />

                {selectedDate && (
                  <>
                    <label className="block text-sm font-medium text-gray-700">
                      Available Time Slots
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {availableSlots.length > 0 ? (
                        availableSlots.map((slot) => (
                          <button
                            key={slot}
                            onClick={() => setSelectedTime(slot)}
                            className={`p-3 border rounded-lg text-center ${
                              selectedTime === slot
                                ? "border-blue-500 bg-blue-50 text-blue-600"
                                : "border-gray-200 hover:border-blue-300"
                            }`}
                          >
                            <FiClock className="inline mr-2" />
                            {slot}
                          </button>
                        ))
                      ) : (
                        <div className="col-span-2 text-center text-gray-500">
                          No available slots for this date
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={!selectedDate || !selectedTime}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
                >
                  {mode === "reschedule"
                    ? "Confirm Changes"
                    : "Book Appointment"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

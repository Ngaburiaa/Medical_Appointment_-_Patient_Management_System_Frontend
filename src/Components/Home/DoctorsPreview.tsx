import { useState } from "react";
import doctor1 from "../../assets/undraw_doctors_djoj.svg";
import doctor2 from "../../assets/undraw_medicine_hqqg.svg";
import { doctorApi } from "../../Features/api/doctorAPI";
import { useBooking } from "../../hooks/useBooking"
import { useNavigate } from "react-router";


type Doctor = {
  doctorId: number;
  userId: number;
  specialization: string;
  bio: string;
  availableDays: string;
  user: {
    userId: number;
    firstName: string;
    lastName: string;
    profileURL: string | null;
    address: string;
    contactPhone: string;
  };
  appointments: { // Add this to match the Doctor type in useBooking
    userId: number | undefined;
    appointmentId: number;
    appointmentDate: string;
    timeSlot: string;
    appointmentStatus: string;
  }[];
};

export const DoctorsPreview = () => {
  const { data: doctors = [] } = doctorApi.useGetAllDoctorsQuery(undefined);
    const navigate = useNavigate();
  const { handleBook } = useBooking(navigate);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const experienceMap = [
    "15+ years experience",
    "12+ years experience",
    "10+ years experience",
    "8+ years experience",
    "20+ years experience",
  ];

  const iconMap = {
    pediatrics: "👶",
    cardiology: "❤️",
    neurology: "🧠",
    surgery: "🩺",
    dermatology: "🧴",
    general: "🏥",
  };

  const placeholderImages = [doctor1, doctor2];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-[#F0F9FF] px-6">
      <div className="max-w-7xl mx-auto">
        {/* Modal */}
        {selectedDoctor && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xl relative">
              <button
                onClick={() => setSelectedDoctor(null)}
                className="absolute top-2 right-3 text-gray-400 hover:text-red-500 text-xl"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold text-[#1AB2E5] mb-2">
                Dr. {selectedDoctor.user.firstName} {selectedDoctor.user.lastName}
              </h2>
              <p className="text-[#1AB2E5] font-medium">{selectedDoctor.specialization}</p>
              <p className="text-gray-600 mt-2">{selectedDoctor.bio}</p>
              <p className="text-sm text-gray-500 mt-2">
                <strong>Available:</strong> {selectedDoctor.availableDays}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                <strong>Phone:</strong> {selectedDoctor.user.contactPhone}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                <strong>Address:</strong> {selectedDoctor.user.address}
              </p>
            </div>
          </div>
        )}

        {/* Title */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 text-sm font-semibold text-[#1AB2E5] bg-[#E6F7FF] rounded-full mb-4">
            Our Medical Experts
          </span>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Meet Our Specialists</h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-[#1AB2E5] to-[#0E8FC2] mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Our board-certified physicians combine world-class expertise with compassionate care.
          </p>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doc: Doctor, index: number) => {
            const specializationKey = (doc.specialization || "general").toLowerCase() as keyof typeof iconMap;
            const image = doc.user.profileURL || placeholderImages[index % placeholderImages.length];
            const experience = experienceMap[index % experienceMap.length];
            const icon = iconMap[specializationKey] || "🏥";

            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border border-gray-100 overflow-hidden"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={image}
                    alt={doc.user.firstName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1AB2E5]/30 to-transparent"></div>
                  <div className="absolute top-4 right-4 text-4xl bg-white/90 p-3 rounded-full">
                    {icon}
                  </div>
                </div>

                <div className="p-6 relative">
                  <div className="absolute -top-5 left-6 bg-gradient-to-r from-[#1AB2E5] to-[#0E8FC2] text-white px-4 py-1 rounded-full text-xs font-semibold shadow-sm">
                    {experience}
                  </div>

                  <div className="mt-4">
                    <h3 className="text-xl font-bold text-gray-800">
                      Dr. {doc.user.firstName} {doc.user.lastName}
                    </h3>
                    <p className="text-[#1AB2E5] font-medium mt-1">{doc.specialization}</p>
                    <p className="text-gray-600 mt-3 text-sm leading-relaxed">{doc.bio}</p>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => setSelectedDoctor(doc)}
                      className="flex-1 py-2.5 bg-gradient-to-r from-[#1AB2E5] to-[#0E8FC2] text-white rounded-lg hover:from-[#1489b8] hover:to-[#0C76A4] transition-all text-sm font-medium shadow-sm"
                    >
                      View Profile
                    </button>
                    <button
                    onClick={() => handleBook(doc)} 
                    className="flex-1 py-2.5 border border-[#1AB2E5] text-[#1AB2E5] rounded-lg hover:bg-[#E6F7FF] transition-colors text-sm font-medium">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* CTA Card */}
          <div className="bg-gradient-to-br from-[#1AB2E5] to-[#0E8FC2] rounded-xl shadow-lg p-8 flex flex-col justify-center text-white overflow-hidden relative">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full"></div>
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-3">Join Our Team</h3>
              <p className="mb-6 text-blue-100">
                We're seeking exceptional healthcare professionals to join our mission of excellence.
              </p>
              <button className="mt-auto px-6 py-2.5 bg-white text-[#1AB2E5] rounded-lg font-medium hover:bg-gray-100 transition-colors self-start text-sm shadow-sm">
                Career Opportunities
              </button>
            </div>
          </div>
        </div>

        {/* View All */}
        <div className="text-center mt-16">
          <button className="px-8 py-3.5 bg-gradient-to-r from-[#1AB2E5] to-[#0E8FC2] text-white font-medium rounded-lg hover:from-[#1489b8] hover:to-[#0C76A4] transition-all duration-300 shadow-md hover:shadow-lg inline-flex items-center">
            View All Specialists
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};
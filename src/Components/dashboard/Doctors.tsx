import { useState } from "react";
import { DoctorCard } from "../../dashBoardDesign/DoctorCard";
import { doctorApi } from "../../Features/api/doctorAPI";
import { useBooking } from "../../hooks/useBooking";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";


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
  prescriptions: {
    prescriptionId: number;
    notes: string;
  }[];
};

const ITEMS_PER_PAGE = 6;

export const Doctors = () => {
  const { data: doctors = [], isLoading } = doctorApi.useGetAllDoctorsQuery(undefined);
    const navigate = useNavigate();
  const { handleBook } = useBooking(navigate);
    const [specialization, setSpecialization] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
  const bookId = searchParams.get("book");
  if (bookId && doctors.length > 0) {
    const doctorToBook = doctors.find((d: { doctorId: number; })=> d.doctorId === Number(bookId));
    if (doctorToBook) {
      handleBook(doctorToBook);
      searchParams.delete("book");
      setSearchParams(searchParams);
    }
  }
}, [searchParams, doctors, handleBook, setSearchParams]);



  const filteredDoctors = doctors.filter((doc: Doctor) => {
    const matchesSpecialization = specialization
      ? doc.specialization?.toLowerCase() === specialization.toLowerCase()
      : true;
    const matchesSearch = searchTerm
      ? doc.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.user.address.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesSpecialization && matchesSearch;
  });

  const totalPages = Math.ceil(filteredDoctors.length / ITEMS_PER_PAGE);
  const paginatedDoctors = filteredDoctors.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const specializations:string[] = Array.from(
    new Set(
      doctors
        .map((doc: Doctor) => doc.specialization)
        .filter((spec:any): spec is string => typeof spec === "string")
    )
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#1AB2E5] mb-2">Find a Doctor</h1>
        <p className="text-gray-600">Book appointments with our specialist doctors</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded-lg shadow-sm">
        <select
          value={specialization}
          onChange={(e) => {
            setSpecialization(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/3 focus:ring-2 focus:ring-[#1AB2E5] focus:border-[#1AB2E5] outline-none transition"
        >
          <option value="">All Specializations</option>
          {specializations.map((spec) => (
            <option key={spec} value={spec}>
              {spec}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search by name, specialization or location"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-2/3 focus:ring-2 focus:ring-[#1AB2E5] focus:border-[#1AB2E5] outline-none transition"
        />
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1AB2E5]"></div>
        </div>
      ) : paginatedDoctors.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedDoctors.map((doctor: Doctor) => (
              <div
                key={doctor.doctorId}
                className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 rounded-lg overflow-hidden"
              >
                <DoctorCard 
                  doctor={doctor} 
                  onBook={() => handleBook(doctor)} 
                />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    className={`px-4 py-2 border rounded ${
                      currentPage === pageNum ? "bg-[#1AB2E5] text-white" : "bg-white"
                    }`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500 text-lg mb-4">No doctors match your search criteria</p>
          <button
            onClick={() => {
              setSpecialization("");
              setSearchTerm("");
              setCurrentPage(1);
            }}
            className="text-[#1AB2E5] hover:text-[#1489b8] font-medium underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};
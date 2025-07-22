import { useState } from "react";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { userApi } from "../../Features/api/userAPI";
import type { RootState } from "../../App/store";
import { PrescriptionDetailsModal } from "../../hooks/prescriptionDetailsModal";

export const Prescriptions = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const {data: userDetails,isLoading,  isError, } = userApi.useGetUserByIdQuery(user?.userId!); 

  const [selectedPrescription, setSelectedPrescription] = useState<any>(null);

  const prescriptions = userDetails?.prescriptions ?? [];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold text-[#4CAF50]">My Prescriptions</h2>

      {isLoading ? (
        <p>Loading prescriptions...</p>
      ) : isError ? (
        <p className="text-red-600">Failed to load prescriptions.</p>
      ) : prescriptions.length === 0 ? (
        <p className="italic text-gray-500">No prescriptions available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow border text-sm">
            <thead className="bg-[#E6F7FF] text-[#1AB2E5] uppercase text-left">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Issued</th>
                <th className="px-4 py-3">Diagnosis</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {prescriptions.map((rx: any) => (
                <tr
                  key={rx.prescriptionId}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-[#1AB2E5] font-medium">
                    #{rx.prescriptionId}
                  </td>
                  <td className="px-4 py-3">
                    {format(new Date(rx.issuedAt), "PPP")}
                  </td>
                  <td className="px-4 py-3">{rx.diagnosis}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        rx.status === "active"
                          ? "bg-green-100 text-green-700"
                          : rx.status === "expired"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {rx.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center space-x-2">
                    <button
                      onClick={() => setSelectedPrescription(rx)}
                      className="bg-[#1AB2E5] hover:bg-[#1798c5] text-white text-xs px-3 py-1 rounded-md"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {selectedPrescription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-3xl rounded-lg p-6 relative shadow-xl">
            <button
              onClick={() => setSelectedPrescription(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl"
            >
              &times;
            </button>
            <PrescriptionDetailsModal
              prescription={selectedPrescription}
              onClose={() => setSelectedPrescription(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

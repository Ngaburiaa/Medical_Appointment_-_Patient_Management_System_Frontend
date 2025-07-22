import { format } from "date-fns";

export const PrescriptionDetailsModal = ({ prescription, onClose }: { prescription: any, onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white max-w-2xl w-full rounded-lg p-6 shadow space-y-4 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-lg font-bold">×</button>

        <h2 className="text-xl font-semibold text-[#4CAF50]">Prescription Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <p><strong>ID:</strong> #{prescription.prescriptionId}</p>
          <p><strong>Date:</strong> {format(new Date(prescription.issuedAt), "PPP")}</p>
          <p><strong>Status:</strong> {prescription.status}</p>
          <p><strong>Diagnosis:</strong> {prescription.diagnosis}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded">
          <h3 className="text-[#1AB2E5] font-medium mb-1">Doctor</h3>
          <p>{prescription.doctor?.user?.firstName} {prescription.doctor?.user?.lastName}</p>
          <p className="text-sm text-gray-500">{prescription.doctor?.specialization}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded">
          <h3 className="text-[#1AB2E5] font-medium mb-1">Patient</h3>
          <p>{prescription.patient?.firstName} {prescription.patient?.lastName}</p>
          <p className="text-sm text-gray-500">{prescription.patient?.contactPhone}</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-[#1AB2E5] font-semibold">Medications</h3>
          {prescription.items?.map((item: any) => (
            <div key={item.itemId} className="border border-gray-200 p-3 rounded">
              <p><strong>Drug:</strong> {item.drugName}</p>
              <p><strong>Dosage:</strong> {item.dosage}</p>
              <p><strong>Route:</strong> {item.route}</p>
              <p><strong>Frequency:</strong> {item.frequency}</p>
              <p><strong>Duration:</strong> {item.duration}</p>
              <p><strong>Substitution Allowed:</strong> {item.substitutionAllowed ? "Yes" : "No"}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

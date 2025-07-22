import { Dialog } from "@headlessui/react";
import { format } from "date-fns";
import { ClipboardDocumentCheckIcon, ChatBubbleLeftEllipsisIcon } from "@heroicons/react/20/solid";
import { PillIcon } from "lucide-react";

interface PrescriptionItem {
  itemId: number;
  drugName: string;
  dosage: string;
  route: string;
  frequency: string;
  duration: string;
  instructions?: string;
  substitutionAllowed: number;
}

interface ViewPrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  diagnosis: string;
  notes?: string;
  issuedAt: string;
  appointmentDate: string;
  timeSlot: string;
  items: PrescriptionItem[];
}

export const ViewPrescriptionModal = ({
  isOpen,
  onClose,
  diagnosis,
  notes,
  issuedAt,
  appointmentDate,
  timeSlot,
  items,
}: ViewPrescriptionModalProps) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
        <Dialog.Panel className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6">
          <Dialog.Title className="text-xl font-bold text-gray-800 mb-2">
            Prescription Details
          </Dialog.Title>

          <div className="text-sm text-gray-600 mb-4">
            <div>
              <strong>Issued At:</strong> {format(new Date(issuedAt), "PPpp")}
            </div>
            <div>
              <strong>Appointment:</strong> {format(new Date(appointmentDate), "PPP")} at {timeSlot}
            </div>
          </div>

          <div className="space-y-4">
            {/* Diagnosis */}
            <div className="flex items-start gap-2">
              <ClipboardDocumentCheckIcon className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-800">Diagnosis</h4>
                <p>{diagnosis}</p>
              </div>
            </div>

            {/* Notes */}
            {notes && (
              <div className="flex items-start gap-2">
                <ChatBubbleLeftEllipsisIcon className="w-5 h-5 text-purple-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-800">Clinical Notes</h4>
                  <p>{notes}</p>
                </div>
              </div>
            )}

            {/* Medications */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <PillIcon className="h-5 w-5 text-green-600" />
                Medications
              </h4>
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="border p-3 rounded-md bg-gray-50">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-800">{item.drugName}</span>
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {item.dosage}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 text-sm mt-2 gap-2">
                      <div>
                        <span className="text-gray-500">Frequency:</span> {item.frequency}
                      </div>
                      <div>
                        <span className="text-gray-500">Duration:</span> {item.duration}
                      </div>
                      <div>
                        <span className="text-gray-500">Route:</span> {item.route}
                      </div>
                    </div>
                    {item.instructions && (
                      <div className="mt-1 text-sm text-yellow-800 bg-yellow-50 border-l-4 border-yellow-300 p-2">
                        <strong>Instructions:</strong> {item.instructions}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Print
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Close
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

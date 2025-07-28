import { Dialog } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState } from "react";

import { prescriptionApi } from "../Features/api/prescriptionAPI";
import { prescriptionItemApi } from "../Features/api/prescriptionItemAPI";

type PrescriptionFormData = {
  diagnosis: string;
  notes: string;
  drugName: string;
  dosage: string;
  route: string;
  frequency: string;
  duration: string;
  instructions?: string;
  substitutionAllowed: boolean;
};

type Patient = {
  userId: number;
  firstName: string;
  lastName: string;
  contactPhone: string;
};

type ModalWritePrescriptionProps = {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  doctorId: number;
  appointmentId: number;
};

export const ModalWritePrescription = ({
  isOpen,
  onClose,
  doctorId,
  appointmentId,
  patient,
}: ModalWritePrescriptionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors, isValid, isDirty }  } = useForm<PrescriptionFormData>({
    mode: "onChange",
    defaultValues: {
      substitutionAllowed: false
    }
  });

  const [createPrescription] = prescriptionApi.useCreatePrescriptionMutation();
  const [createPrescriptionItem] = prescriptionItemApi.useCreatePrescriptionItemMutation();

  const onSubmit = async (data: PrescriptionFormData) => {
    if (!patient?.userId || !doctorId || !appointmentId) {
      toast.error("Missing required information");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        patientId: patient.userId,
        doctorId,
        appointmentId,
        diagnosis: data.diagnosis,
        notes: data.notes,
      };

      console.log("Submitting prescription:", payload);
      const prescriptionRes = await createPrescription(payload).unwrap();

      console.log("prescriptionRes:", prescriptionRes);

      const prescriptionId = prescriptionRes?.prescriptionId || prescriptionRes?.id;
      if (!prescriptionId) {
        throw new Error("Missing prescriptionId from response");
      }

      const itemPayload = {
        prescriptionId,
        drugName: data.drugName,
        dosage: data.dosage,
        route: data.route,
        frequency: data.frequency,
        duration: data.duration,
        instructions: data.instructions || "",
        substitutionAllowed: data.substitutionAllowed ? 1 : 0,
      };

      console.log("Submitting item:", itemPayload);

      await createPrescriptionItem(itemPayload).unwrap();

      toast.success("Prescription saved successfully");
      reset();
      onClose();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to save prescription");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isDirty && !isSubmitting) {
      if (window.confirm("You have unsaved changes. Are you sure you want to close?")) {
        reset();
        onClose();
      }
    } else {
      reset();
      onClose();
    }
  };

  // Common route options for autocomplete-like experience
  const commonRoutes = ["Oral", "Topical", "Intravenous", "Intramuscular", "Subcutaneous"];
  const commonFrequencies = ["Once daily", "Twice daily", "Three times daily", "Four times daily", "As needed"];

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1AB2E5] to-[#0EA5E9] px-6 py-4 text-white">
            <Dialog.Title className="text-xl font-semibold flex items-center justify-between">
              <div>
                <div className="text-lg">New Prescription</div>
                <div className="text-sm opacity-90 font-normal">
                  Patient: {patient.firstName} {patient.lastName}
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                disabled={isSubmitting}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </Dialog.Title>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Patient Information Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Diagnosis <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("diagnosis", { 
                    required: "Diagnosis is required",
                    minLength: { value: 3, message: "Diagnosis must be at least 3 characters" }
                  })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1AB2E5] focus:border-[#1AB2E5] transition-colors ${
                    errors.diagnosis ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter diagnosis..."
                />
                {errors.diagnosis && (
                  <p className="text-sm text-red-600">{errors.diagnosis.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <input
                  {...register("notes")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1AB2E5] focus:border-[#1AB2E5] transition-colors"
                  placeholder="Additional notes..."
                />
              </div>
            </div>

            {/* Medication Section */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-[#1AB2E5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                </svg>
                Medication Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Drug Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("drugName", { 
                      required: "Drug name is required",
                      minLength: { value: 2, message: "Drug name must be at least 2 characters" }
                    })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1AB2E5] focus:border-[#1AB2E5] transition-colors ${
                      errors.drugName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Amoxicillin"
                  />
                  {errors.drugName && (
                    <p className="text-sm text-red-600">{errors.drugName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Dosage <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("dosage", { 
                      required: "Dosage is required",
                      pattern: {
                        value: /^[\d\s]+(mg|g|ml|mcg|units?|tablets?|capsules?)\b/i,
                        message: "Enter valid dosage (e.g., 500mg, 2 tablets)"
                      }
                    })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1AB2E5] focus:border-[#1AB2E5] transition-colors ${
                      errors.dosage ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 500mg, 2 tablets"
                  />
                  {errors.dosage && (
                    <p className="text-sm text-red-600">{errors.dosage.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Route <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("route", { required: "Route is required" })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1AB2E5] focus:border-[#1AB2E5] transition-colors ${
                      errors.route ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select route...</option>
                    {commonRoutes.map(route => (
                      <option key={route} value={route}>{route}</option>
                    ))}
                  </select>
                  {errors.route && (
                    <p className="text-sm text-red-600">{errors.route.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Frequency <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("frequency", { required: "Frequency is required" })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1AB2E5] focus:border-[#1AB2E5] transition-colors ${
                      errors.frequency ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select frequency...</option>
                    {commonFrequencies.map(freq => (
                      <option key={freq} value={freq}>{freq}</option>
                    ))}
                  </select>
                  {errors.frequency && (
                    <p className="text-sm text-red-600">{errors.frequency.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Duration <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("duration", { 
                      required: "Duration is required",
                      pattern: {
                        value: /^\d+\s*(days?|weeks?|months?)\b/i,
                        message: "Enter valid duration (e.g., 7 days, 2 weeks)"
                      }
                    })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1AB2E5] focus:border-[#1AB2E5] transition-colors ${
                      errors.duration ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 7 days, 2 weeks"
                  />
                  {errors.duration && (
                    <p className="text-sm text-red-600">{errors.duration.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Special Instructions</label>
                  <textarea
                    {...register("instructions")}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1AB2E5] focus:border-[#1AB2E5] transition-colors resize-none"
                    placeholder="Take with food, avoid alcohol, etc."
                  />
                </div>
              </div>

              {/* Substitution Option */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("substitutionAllowed")}
                    className="mt-1 w-4 h-4 text-[#1AB2E5] bg-gray-100 border-gray-300 rounded focus:ring-[#1AB2E5] focus:ring-2"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Allow Generic Substitution</div>
                    <div className="text-xs text-gray-600">Pharmacist may substitute with generic equivalent</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="px-6 py-2 bg-[#1AB2E5] text-white rounded-lg hover:bg-[#1593c4] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Prescription
                  </>
                )}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
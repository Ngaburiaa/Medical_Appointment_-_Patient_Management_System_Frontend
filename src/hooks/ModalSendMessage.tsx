import { Dialog } from "@headlessui/react";
import { useForm } from "react-hook-form";

type Patient = {
  userId: number;
  firstName: string;
  lastName: string;
  contactPhone: string;
};

type ModalSendMessageProps = {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
};

type MessageFormData = {
  message: string;
};

export const ModalSendMessage = ({ isOpen, onClose, patient }: ModalSendMessageProps) => {
  const { register, handleSubmit, reset } = useForm<MessageFormData>();

  const onSubmit = (data: MessageFormData) => {
    console.log("Sending message to", patient.firstName, data.message);
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md bg-white rounded-xl p-6 shadow-lg">
          <Dialog.Title className="text-lg font-bold mb-4">
            Send Message to {patient.firstName} {patient.lastName}
          </Dialog.Title>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <textarea
              placeholder="Type your message..."
              {...register("message", { required: true })}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#1AB2E5] focus:border-transparent min-h-[100px]"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1AB2E5]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#1AB2E5] text-white rounded-md hover:bg-[#1593c4] focus:outline-none focus:ring-2 focus:ring-[#1AB2E5]"
              >
                Send
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

import { NavBar } from '../Components/NavBar';
import { Footer } from '../Components/Footer';
import Container from '../Components/Container';
import loginImg from "../../src/assets/undraw_medicine_hqqg.svg";

export const Contact = () => {
  return (
    <>
      <NavBar />
      <Container className="bg-gradient-to-bl from-[#E6F7FF] via-white to-[#F0F9FF]">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-[#1AB2E5]">Contact Theranos</h2>
            <p className="mt-3 text-lg text-gray-600">
              Have questions, need support, or want to book a consultation? We're here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Contact Info Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#B8E6F8]">
              <h3 className="text-2xl font-semibold text-[#1AB2E5] mb-4">Clinic Information</h3>
              <ul className="space-y-4 text-slate-700 text-sm">
                <li>
                  <strong>📍 Address:</strong> GreenLife Medical Center, 12 Wellness Avenue, Nairobi
                </li>
                <li>
                  <strong>📞 Phone:</strong> +254 712 345 678
                </li>
                <li>
                  <strong>✉️ Email:</strong> contact@greenlifemedical.co.ke
                </li>
                <li>
                  <strong>🕒 Hours:</strong> Mon - Sat: 8:00 AM – 6:00 PM
                </li>
              </ul>

              <div className="mt-8">
                <img
                  src={loginImg}
                  alt="Hospital front desk"
                  className="rounded-lg shadow-md w-full h-64 object-cover"
                />
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#B8E6F8]">
              <h3 className="text-2xl font-semibold text-[#1AB2E5] mb-4">Send Us a Message</h3>
              <form className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#1AB2E5] focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#1AB2E5] focus:outline-none"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#1AB2E5] focus:outline-none"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#1AB2E5] focus:outline-none"
                />
                <textarea
                  rows={4}
                  placeholder="Write your message here..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#1AB2E5] focus:outline-none"
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-[#1AB2E5] hover:bg-[#1489b8] text-white font-semibold py-3 rounded-lg transition-all"
                >
                  Submit Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </Container>
      <Footer />
    </>
  );
};
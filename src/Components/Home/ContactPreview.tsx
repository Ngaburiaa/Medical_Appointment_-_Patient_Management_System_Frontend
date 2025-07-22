import { Link } from "react-router-dom";

export const ContactPreview = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-teal-50 to-blue-50 px-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-teal-100 rounded-full opacity-20 -translate-x-16 -translate-y-16"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-100 rounded-full opacity-20 translate-x-16 translate-y-16"></div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-10 shadow-lg border border-white">
          <span className="inline-block px-4 py-1.5 text-sm font-medium text-teal-700 bg-teal-100 rounded-full mb-4">
            We're Here For You
          </span>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Get in Touch</h2>
          <div className="w-16 h-1 bg-teal-500 mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Questions? Appointments? Our team is ready to assist you with all your healthcare needs.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-8 mb-10">
            <div className="flex items-center justify-center space-x-3">
              <div className="p-3 bg-teal-100 rounded-full text-teal-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500">Call us at</p>
                <p className="text-lg font-medium text-teal-700">+254 700 123 456</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500">Visit us at</p>
                <p className="text-lg font-medium text-blue-700">Nairobi, Kenya</p>
              </div>
            </div>
          </div>
          
          <Link
            to="/contact"
            className="inline-flex items-center px-8 py-3.5 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-medium rounded-lg hover:from-teal-600 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Contact Us
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};
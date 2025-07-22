import heroImage from "../../assets/undraw_medicine_hqqg.svg";

export const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-[#E6F7FF] via-white to-[#F0F9FF] py-16 md:py-24 px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-[#B8E6F8] rounded-full opacity-20 -translate-x-16 -translate-y-16"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#B8E6F8] rounded-full opacity-20 translate-x-16 translate-y-16"></div>
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
        {/* Text Content */}
        <div className="order-2 lg:order-1">
          <span className="inline-block px-4 py-1.5 text-sm font-medium text-[#1AB2E5] bg-[#E6F7FF] rounded-full mb-4">
            Welcome to Theranos
          </span>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
            Compassionate <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1AB2E5] to-[#0E8FC2]">Care You Can Trust</span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 leading-relaxed">
            At <strong className="text-[#1AB2E5]">Theranos Hospital</strong>, we combine cutting-edge technology with 
            personalized attention to deliver exceptional healthcare experiences.
          </p>

          <p className="mt-4 text-base text-gray-500 leading-relaxed">
            Our team of board-certified specialists is dedicated to providing comprehensive care 
            tailored to your unique health needs.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-3.5 bg-gradient-to-r from-[#1AB2E5] to-[#0E8FC2] text-white font-medium rounded-lg hover:from-[#1489b8] hover:to-[#0C76A4] transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center">
              Book Appointment
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="px-8 py-3.5 border-2 border-[#1AB2E5] text-[#1AB2E5] font-medium rounded-lg hover:bg-[#E6F7FF] transition-colors duration-300">
              Explore Services
            </button>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-4">
            {[
              { value: "98%", label: "Patient Satisfaction" },
              { value: "300+", label: "Specialist Doctors" },
              { value: "24/7", label: "Emergency Care" }
            ].map((stat, index) => (
              <div key={index} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-2xl font-bold text-gray-800">{stat.value}</h2>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Image Section */}
        <div className="order-1 lg:order-2 relative">
          <div className="relative">
            <img
              src={heroImage}
              alt="Healthcare professional consulting patient"
              className="w-full h-auto rounded-2xl shadow-2xl object-cover transform transition-transform duration-500 hover:scale-[1.02]"
            />
            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg hidden md:block">
              <div className="flex items-center">
                <div className="p-3 bg-[#E6F7FF] rounded-full text-[#1AB2E5]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Certified by</p>
                  <p className="text-base font-bold text-gray-800">Kenya Medical Board</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
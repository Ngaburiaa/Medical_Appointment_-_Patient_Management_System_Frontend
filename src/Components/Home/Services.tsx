export const Services = () => {
  const services = [
    { 
      title: "Outpatient Care", 
      desc: "Consultations and follow-ups with licensed professionals.",
      icon: "👨‍⚕️"
    },
    { 
      title: "Laboratory", 
      desc: "Modern labs for accurate and fast diagnostics.",
      icon: "🔬"
    },
    { 
      title: "Pharmacy", 
      desc: "Well-stocked and affordable medication access.",
      icon: "💊"
    },
    { 
      title: "Emergency", 
      desc: "24/7 emergency unit with expert trauma team.",
      icon: "🚑"
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-[#F0F9FF] px-6">
      <div className="max-w-7xl mx-auto text-center">
        <div className="mb-14">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Services</h2>
          <div className="w-20 h-1 bg-[#1AB2E5] mx-auto"></div>
          <p className="text-gray-600 mt-6 max-w-2xl mx-auto text-lg">
            Comprehensive healthcare services designed with your well-being in mind.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((s, i) => (
            <div 
              key={i} 
              className="group relative bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#E6F7FF] to-[#B8E6F8] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-4xl mb-5 transition-transform duration-300 group-hover:scale-110">
                  {s.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{s.title}</h3>
                <p className="text-gray-600 leading-relaxed">{s.desc}</p>
                <div className="mt-6">
                  <button className="text-sm font-medium text-[#1AB2E5] hover:text-[#1489b8] transition-colors flex items-center justify-center mx-auto">
                    Learn more
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16">
          <button className="px-8 py-3 bg-[#1AB2E5] text-white font-medium rounded-lg hover:bg-[#1489b8] transition-colors shadow-md hover:shadow-lg">
            View All Services
          </button>
        </div>
      </div>
    </section>
  );
};
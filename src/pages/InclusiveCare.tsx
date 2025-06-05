
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const InclusiveCare = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-leaf to-leaf-dark bg-clip-text text-transparent">
              Inclusive Care
            </h1>
            <p className="text-xl text-gray-600">
              Support and resources for women and LGBTQ+ individuals
            </p>
          </div>
          
          <div className="bg-white dark:bg-card rounded-2xl shadow-lg p-6 md:p-8 space-y-8">
            <div>
              <p className="text-lg text-gray-700 leading-relaxed">
                Some states restrict access to important care and services for women and LGBTQ+ people. 
                This page exists to help you find trusted support, resources, and information to help you 
                navigate these challenges and access the care you deserve.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-6 text-leaf-dark">National Resources</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-leaf pl-4">
                  <h3 className="font-semibold text-lg">Planned Parenthood</h3>
                  <p className="text-gray-600">Comprehensive reproductive and sexual health services, education, and advocacy.</p>
                </div>
                
                <div className="border-l-4 border-leaf pl-4">
                  <h3 className="font-semibold text-lg">OutCare Health</h3>
                  <p className="text-gray-600">Directory of LGBTQ+ affirming healthcare providers and resources nationwide.</p>
                </div>
                
                <div className="border-l-4 border-leaf pl-4">
                  <h3 className="font-semibold text-lg">National Abortion Federation</h3>
                  <p className="text-gray-600">Access to abortion services, financial assistance, and help with travel logistics.</p>
                </div>
                
                <div className="border-l-4 border-leaf pl-4">
                  <h3 className="font-semibold text-lg">Trans Lifeline</h3>
                  <p className="text-gray-600">Peer crisis support hotline and microgrants for transgender people in need.</p>
                </div>
                
                <div className="border-l-4 border-leaf pl-4">
                  <h3 className="font-semibold text-lg">GLMA</h3>
                  <p className="text-gray-600">LGBTQ+ health advocacy organization working to ensure equitable healthcare for all.</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-6 text-leaf-dark">Supportive Cities</h2>
              <p className="text-gray-700 mb-4">
                These cities are known for being more supportive and inclusive, with stronger protections 
                and better access to healthcare services:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-orange-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-leaf-dark">Portland, OR</h3>
                  <p className="text-sm text-gray-600">Progressive policies and strong LGBTQ+ community support</p>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-leaf-dark">Minneapolis, MN</h3>
                  <p className="text-sm text-gray-600">Comprehensive healthcare access and inclusive laws</p>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-leaf-dark">Boston, MA</h3>
                  <p className="text-sm text-gray-600">Strong healthcare infrastructure and progressive values</p>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-leaf-dark">San Francisco, CA</h3>
                  <p className="text-sm text-gray-600">Leading LGBTQ+ rights and comprehensive care options</p>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-xl md:col-span-2">
                  <h3 className="font-semibold text-leaf-dark">Austin, TX</h3>
                  <p className="text-sm text-gray-600">Progressive city within a conservative state - research local vs. state laws carefully</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-6 text-leaf-dark">Tips for Relocating</h2>
              <div className="bg-leaf/5 p-6 rounded-xl">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-leaf mr-2">•</span>
                    <span><strong>Research local laws:</strong> City and county ordinances may differ from state laws, offering additional protections.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-leaf mr-2">•</span>
                    <span><strong>Find inclusive healthcare:</strong> Look for providers who explicitly welcome LGBTQ+ patients and support women's healthcare needs.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-leaf mr-2">•</span>
                    <span><strong>Understand state protections:</strong> Know what rights and protections exist in your potential new state versus your current location.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-leaf mr-2">•</span>
                    <span><strong>Connect with community:</strong> Reach out to local LGBTQ+ centers, women's organizations, and support groups before moving.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-leaf mr-2">•</span>
                    <span><strong>Plan for emergencies:</strong> Know where to access care and support if you need immediate assistance.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-center pt-4">
              <p className="text-gray-600 italic">
                Your safety, health, and well-being matter. You deserve access to compassionate, 
                affirming care wherever you choose to live.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default InclusiveCare;

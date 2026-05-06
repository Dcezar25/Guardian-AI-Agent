import { useState } from "react";
import { FiInfo, FiX } from "react-icons/fi";

export default function InfoBox() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      <button
        className="mx-auto mb-2 p-2 bg-gray-700 rounded flex items-center justify-center hover:bg-gray-600"
        onClick={() => setShowInfo(true)}
      >
        <FiInfo size={24} />
      </button>

      {showInfo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white p-6 rounded-lg w-96 relative">
            <button
              className="absolute top-2 right-2"
              onClick={() => setShowInfo(false)}
            >
              <FiX size={24} />
            </button>
            <h2 className="text-xl font-bold mb-4">Our Mission</h2>
            <p className="text-justify leading-relaxed">
              We aim to support and protect individuals who are facing bullying, 
              harassment, domestic violence, addictions and other forms of abuse. Our platform 
              provides guidance, safety tools, and essential resources to those in need. 
              We believe in empowering victims to regain control over their lives, 
              ensuring they have access to immediate assistance, trusted contacts, and 
              educational material to prevent further harm. Through collaboration with 
              local authorities, social workers, and community organizations, we strive 
              to create a safer environment where every individual feels heard, supported, 
              and protected. Your safety and well-being are our top priorities.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

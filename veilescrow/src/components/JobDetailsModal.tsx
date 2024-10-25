import React from 'react';

interface Job {
  address: string;
  title: string;
  description: string;
  reward: string;
  category: string;
}

interface JobDetailsModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: (job: Job) => void; // New prop for applying to a job
}

const JobDetailsModal: React.FC<JobDetailsModalProps> = ({ job, isOpen, onClose, onApply }) => {
  if (!isOpen || !job) return null;

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOutsideClick}
    >
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <span className="absolute top-8 right-8 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
          {job.category}
        </span>
        <h2 className="text-3xl font-bold text-indigo-600 mb-4">{job.title}</h2>
        <p className="text-gray-700 mb-6">{job.description}</p>
        <div className="flex justify-between items-end">
          <p className="text-2xl font-bold text-purple-600">{job.reward}</p>
          <div className="space-x-4">
            <button
              onClick={onClose}
              className="bg-gray-200 text-gray-800 py-2 px-4 rounded-full hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
            <button 
              className="bg-indigo-600 text-white py-2 px-6 rounded-full hover:bg-indigo-700 transition-colors"
              onClick={() => onApply(job)} // Call the apply function
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;

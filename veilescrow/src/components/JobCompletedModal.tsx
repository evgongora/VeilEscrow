import React from 'react';

interface Job {
  id: number;
  title: string;
  reward: string;
  status: 'posted' | 'current' | 'completed';
  date: string;
  submissionLink?: string;
}

interface JobCompletedModalProps {
  job: Job;
  onClose: () => void;
}

const JobCompletedModal: React.FC<JobCompletedModalProps> = ({ job, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
         onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full border border-gray-300 relative">
        <h2 className="text-2xl font-bold text-indigo-600 mb-4">Job Completed</h2>
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-indigo-600">{job.title}</h3>
          <p className="text-gray-600 mb-8">Completion Date: {job.date}</p>
          {job.submissionLink && (
            <p className="text-gray-600">Submission Link: <a href={job.submissionLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{job.submissionLink}</a></p>
          )}
        </div>
        <div className="absolute bottom-4 right-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Close
          </button>
        </div>
        <div className="absolute bottom-4 left-6 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
          Reward Earned: {job.reward}
        </div>
      </div>
    </div>
  );
};

export default JobCompletedModal;

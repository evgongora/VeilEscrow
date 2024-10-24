import React, { useState } from 'react';

interface Job {
  id: number;
  title: string;
  reward: string;
  status: 'posted' | 'current' | 'completed';
  date: string;
  description: string;
}

interface JobSubmissionModalProps {
  job: Job;
  onClose: () => void;
  onSubmit: (jobId: number, link: string) => void;
}

const JobSubmissionModal: React.FC<JobSubmissionModalProps> = ({ job, onClose, onSubmit }) => {
  const [link, setLink] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(job.id, link);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
         onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold text-indigo-600 mb-4">Submit Job</h2>
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-indigo-600">{job.title}</h3>
          <p className="text-gray-600">Reward: {job.reward}</p>
          <p className="text-gray-600">Date: {job.date}</p>
          <p className="text-gray-600">Description: {job.description}</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">Submission Link</label>
            <input
              type="url"
              id="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
              required
              placeholder="https://example.com/your-submission"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              Submit Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobSubmissionModal;

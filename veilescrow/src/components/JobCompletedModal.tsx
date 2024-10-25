import { claimFunds } from '@/utils/contract-functions';
import React from 'react';

interface Job {
  address: string;
  title: string;
  reward: string;
  status: 'posted' | 'current' | 'completed';
  date: string;
  submissionLink?: string;
}

interface JobCompletedModalProps {
  job: Job;
  onClose: () => void;
  account: any;
}

const JobCompletedModal: React.FC<JobCompletedModalProps> = ({ job, onClose, account}) => {

  const handleWithdraw = async () => {
    const transactionHash = await claimFunds(job.address, account);
    console.log("transaction hash: ", transactionHash);
    console.log("Funds claimed for " + job.address + " for an amount of " + job.reward);
    (job.address); // Pass the job address to the withdrawal function
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full border border-gray-300 relative">
        <h2 className="text-2xl font-bold text-indigo-600 mb-4">Job Completed</h2>
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-indigo-600">{job.title}</h3>
          <p className="text-gray-600 mb-2">Completion Date: {job.date}</p>
          {job.submissionLink && (
            <p className="text-gray-600 mb-4">
              Submission Link:{" "}
              <a
                href={job.submissionLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {job.submissionLink}
              </a>
            </p>
          )}
        </div>

        {/* Reward Earned Section */}
        <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600 mb-4">
          Reward Earned: {job.reward}
        </div>

        {/* Buttons Section */}
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleWithdraw}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            Withdraw Funds
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCompletedModal;

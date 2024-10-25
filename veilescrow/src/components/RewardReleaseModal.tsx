import { finishEscrow, pickApplication, readApplicant } from '@/utils/contract-functions';
import React from 'react';

interface Job {
  address: string;
  title: string;
  reward: string;
  status: 'posted' | 'current' | 'completed';
  date: string;
  submissionLink?: string;
  provider?: string | null;
}

interface RewardReleaseModalProps {
  job: Job;
  onClose: () => void;
  onConfirm: (address: string) => void;
  account: any;
}

const RewardReleaseModal: React.FC<RewardReleaseModalProps> = ({ job, onClose, onConfirm, account }) => {
  const handleConfirm = async () => {
    const transactionHash = await finishEscrow(job.address, account);
    console.log("transaction hash: ", transactionHash);

    await fetch('/api/escrow/finishEscrow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: job.address,
      }),
    });

    onClose();
  };

  const handlePickApplicant = async () => {
    const transactionHash = await pickApplication(job.address, account);
    console.log("transaction hash: ", transactionHash);

    const applicant = await readApplicant(job.address);

    await fetch('/api/escrow/updateProvider', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: job.address,
        applicant: String(applicant),
      }),
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full border border-gray-300">
        <h2 className="text-2xl font-bold text-indigo-600 mb-4">Release Reward</h2>
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-indigo-600">{job.title}</h3>
          <p className="text-gray-600">Reward: {job.reward}</p>
          <p className="text-gray-600">Date: {job.date}</p>
          {job.submissionLink && (
            <p className="text-gray-600">
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

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
          >
            Cancel
          </button>

          {/* Conditionally render Pick Applicant button if job.provider is null */}
          {!job.provider && (
            <button
              type="button"
              onClick={handlePickApplicant}
              className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
            >
              Pick Applicant
            </button>
          )}

          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Confirm Completion
          </button>
        </div>
      </div>
    </div>
  );
};

export default RewardReleaseModal;

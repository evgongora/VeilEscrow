import React, { useState } from 'react';
import { createEscrow, fundEscrow } from '@/utils/contract-functions';
import { toWei } from 'thirdweb';
import { approve } from "thirdweb/extensions/erc20";

interface JobCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateJob: (job: {
    address: string;
    title: string;
    description: string;
    reward: string;
    category: string;
  }) => void;
  account: any;
}

const JobCreationModal: React.FC<JobCreationModalProps> = ({ isOpen, onClose, onCreateJob, account}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reward, setReward] = useState('');
  const [category, setCategory] = useState('development');

  if (!isOpen) return null;


  const createEscrowDB = async (address: string, title: string, description: string, reward: number, category: string) => {
    const response = await fetch('/api/escrow/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ address, title, description, reward, category })
    })

    const data = await response.json();

    return data;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const rewardWei = toWei(reward);
    const address = account?.address;
    const { escrowAddress, transactionHash }  = await createEscrow(rewardWei, address, account);
  
    const transactionHashFund = await fundEscrow(escrowAddress, rewardWei, account);

    console.log("Transaction hash for funding: ", transactionHash);
    const data = await createEscrowDB(escrowAddress, title, description, Number(reward), category);
    console.log(data);
    onClose();
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.type === 'mousedown' && e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onMouseDown={handleOutsideClick}
    >
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-3xl font-bold text-indigo-600 mb-6">Create New Job</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
              rows={4}
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="reward" className="block text-sm font-medium text-gray-700 mb-1">Reward Amount (ETH)</label>
            <input
              type="number"
              id="reward"
              value={reward}
              onChange={(e) => setReward(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
              required
              step="0.01"
              min="0"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              id="category"
              value={category}
              onChange={handleCategoryChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
            >
              <option value="development">Development</option>
              <option value="design">Design</option>
              <option value="writing">Writing</option>
            </select>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-800 py-2 px-4 rounded-full hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 text-white py-2 px-6 rounded-full hover:bg-indigo-700 transition-colors"
            >
              Create Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobCreationModal;

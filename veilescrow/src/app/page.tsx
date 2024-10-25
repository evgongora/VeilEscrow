"use client";

import React, { useState, useEffect } from 'react';
import JobDetailsModal from '../components/JobDetailsModal';
import JobCreationModal from '../components/JobCreationModal';
import Link from 'next/link';
import Navbar from '../components/Navbar'; 
import { useActiveAccount } from "thirdweb/react";
import useSemaphoreIdentity from "../hooks/useSemaphoreIdentity";
import { joinEscrow } from '@/utils/contract-functions';

interface Job {
  address: string;
  title: string;
  description: string;
  reward: string;
  category: string;
}

const getAllEscrows = async () => {
  const response = await fetch('/api/escrow/getAll', {
    method: 'GET',
  });

  const data = await response.json();
  console.log(data);
  return data;
};

const Dashboard: React.FC = () => {
  const [filter, setFilter] = useState({ category: '' });
  const [jobsData, setJobsData] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
  const [currentJobs, setCurrentJobs] = useState<Job[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllEscrows();
      const jobsData: Job[] = data.map((job: any) => ({
        address: job.address,
        title: job.title,
        description: job.description,
        reward: job.reward + " ETH",
        category: job.category,
      }));
      setJobsData(jobsData);
    };

    fetchData();
  }, []);  


  const identity = useSemaphoreIdentity();

  useEffect(() => {
    const storedCommitment = localStorage.getItem("publicCommitment");
    const publicCommitment = storedCommitment ? BigInt(storedCommitment) : null;

    if (publicCommitment && !storedCommitment) {
      console.log("Semaphore Identity created:", publicCommitment);
    }
  }, [identity]);

  const account = useActiveAccount();

  const handleCategoryChange = (category: string) => {
    setFilter((prev) => ({ ...prev, category }));
    applyFilters({ ...filter, category });
  };

  const applyFilters = (filters: { category: string }) => {
    let filtered = jobsData.filter(job => 
      (!filters.category || job.category === filters.category)
    );
    setFilteredJobs(filtered);
  };

  const openJobDetails = (job: Job) => {
    setSelectedJob(job);
    setIsDetailsModalOpen(true);
  };

  const closeJobDetails = () => {
    setIsDetailsModalOpen(false);
    setSelectedJob(null);
  };

  const applyForJob = (job: Job) => {
    setCurrentJobs((prevJobs) => [...prevJobs, job]);

    console.log('Applied for job:', job.title + ' with address: ' + job.address);
    const publicCommitment = localStorage.getItem("publicCommitment");
    //@ts-expect-error
    const transactionHash = joinEscrow(job.address, publicCommitment, account);

    closeJobDetails(); 
  };

  const openJobCreationModal = () => {
    setIsCreationModalOpen(true);
  };

  const closeJobCreationModal = () => {
    setIsCreationModalOpen(false);
  };


  const createJob = (newJob: Omit<Job, 'id'>) => {
    const job: Job = {
      ...newJob,
    };
    
    // Update jobsData
    jobsData.unshift(job);
    
    // Update filteredJobs
    setFilteredJobs(prevFilteredJobs => [job, ...prevFilteredJobs]);
    
    // Close the creation modal
    closeJobCreationModal();
    
    // Optionally, you might want to re-apply filters here
    applyFilters(filter);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-6">
        <Navbar /> {/* Use the Navbar component here */}

        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4 sm:mb-0">
            <button 
              className={`py-2 px-4 rounded-full ${filter.category === '' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600'} shadow-md hover:shadow-lg transition-all`} 
              onClick={() => handleCategoryChange('')}
            >
              All
            </button>
            <button 
              className={`py-2 px-4 rounded-full ${filter.category === 'development' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600'} shadow-md hover:shadow-lg transition-all`} 
              onClick={() => handleCategoryChange('development')}
            >
              Development
            </button>
            <button 
              className={`py-2 px-4 rounded-full ${filter.category === 'design' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600'} shadow-md hover:shadow-lg transition-all`} 
              onClick={() => handleCategoryChange('design')}
            >
              Design
            </button>
            <button 
              className={`py-2 px-4 rounded-full ${filter.category === 'writing' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600'} shadow-md hover:shadow-lg transition-all`} 
              onClick={() => handleCategoryChange('writing')}
            >
              Writing
            </button>
          </div>
          <button 
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 px-6 rounded-full shadow-md hover:shadow-lg transition-all"
            onClick={openJobCreationModal}
          >
            Post Job
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map(job => (
            <div 
              key={job.address} 
              className="bg-white p-6 rounded-lg shadow-md transition-all flex flex-col h-full relative group cursor-pointer"
              onClick={() => openJobDetails(job)}
            >
              <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-indigo-500 transition-all duration-300 pointer-events-none"></div>
              <div className="flex-grow">
                <h2 className="font-semibold text-xl text-indigo-600 mb-2">{job.title}</h2>
                <p className="text-gray-600 mb-4">{job.description}</p>
              </div>
              <div className="flex justify-between items-center mt-4">
                <p className="font-bold text-purple-600">{job.reward}</p>
                <button 
                  className="bg-indigo-600 text-white py-2 px-4 rounded-full hover:bg-indigo-700 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    openJobDetails(job);
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <JobDetailsModal
        job={selectedJob}
        isOpen={isDetailsModalOpen}
        onClose={closeJobDetails}
        onApply={applyForJob}
      />

      <JobCreationModal
        isOpen={isCreationModalOpen}
        onClose={closeJobCreationModal}
        onCreateJob={createJob}
        account={account}
      />
    </div>
  );
};

export default Dashboard;

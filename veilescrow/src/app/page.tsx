"use client";

import React, { useState } from 'react';
import JobDetailsModal from '../components/JobDetailsModal';
import JobCreationModal from '../components/JobCreationModal';
import Link from 'next/link';
import Navbar from '../components/Navbar'; 

interface Job {
  id: number;
  title: string;
  description: string;
  reward: string;
  category: string;
}

const jobsData: Job[] = [
  { id: 1, title: 'Frontend Developer', description: 'Build user interfaces for web applications.', reward: '0.5 ETH', category: 'development' },
  { id: 2, title: 'Graphic Designer', description: 'Create visual concepts for branding.', reward: '0.3 ETH', category: 'design' },
  { id: 3, title: 'Backend Developer', description: 'Develop server-side logic and APIs.', reward: '0.7 ETH', category: 'development' },
  { id: 4, title: 'Content Writer', description: 'Write engaging content for websites and blogs.', reward: '0.2 ETH', category: 'writing' },
  { id: 5, title: 'UI/UX Designer', description: 'Design user-friendly interfaces and experiences.', reward: '0.4 ETH', category: 'design' },
  { id: 6, title: 'Mobile App Developer', description: 'Create mobile applications for iOS and Android.', reward: '0.6 ETH', category: 'development' },
  { id: 7, title: 'SEO Specialist', description: 'Optimize website content for search engines.', reward: '0.25 ETH', category: 'writing' },
  { id: 8, title: 'Data Analyst', description: 'Analyze data to help businesses make informed decisions.', reward: '0.55 ETH', category: 'development' },
  { id: 9, title: 'Social Media Manager', description: 'Manage social media accounts and create content.', reward: '0.35 ETH', category: 'design' },
  { id: 10, title: 'Project Manager', description: 'Oversee projects and ensure they are completed on time.', reward: '0.8 ETH', category: 'development' },
  { id: 11, title: 'Cybersecurity Expert', description: 'Protect systems and networks from cyber threats.', reward: '0.65 ETH', category: 'development' } // New job added
];

const Dashboard: React.FC = () => {
  const [filter, setFilter] = useState({ category: '' });
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(jobsData);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
  const [currentJobs, setCurrentJobs] = useState<Job[]>([]); // New state for current jobs

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
      id: jobsData.length + 1, // Simple ID generation
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
              key={job.id} 
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
      />
    </div>
  );
};

export default Dashboard;

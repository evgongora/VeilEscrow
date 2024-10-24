"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar'; 
import JobSubmissionModal from '../../components/JobSubmissionModal'; 
import RewardReleaseModal from '../../components/RewardReleaseModal'; 
import JobCompletedModal from '../../components/JobCompletedModal'; 

interface Job {
  id: number;
  title: string;
  reward: string;
  status: 'posted' | 'current' | 'completed';
  date: string;
  description: string; 
  submissionLink?: string;
}

const ProfilePage: React.FC = () => {
  const [balance, setBalance] = useState("2.52 ETH"); // Mock balance
  const [jobs, setJobs] = useState<Job[]>([
    { id: 1, title: "Frontend Developer", reward: "0.5 ETH", status: "completed", date: "2023-04-15", description: "Develop the frontend of our web application." },
    { id: 2, title: "UI/UX Designer", reward: "0.4 ETH", status: "current", date: "2023-05-01", description: "Design user interfaces and experiences." },
    { id: 3, title: "Backend Developer", reward: "0.7 ETH", status: "posted", date: "2023-05-10", description: "Build and maintain the server-side logic." },
    { id: 4, title: "Content Writer", reward: "0.2 ETH", status: "completed", date: "2023-03-20", description: "Create engaging content for our blog." },
    { id: 5, title: "Mobile App Developer", reward: "0.6 ETH", status: "current", date: "2023-05-05", description: "Develop our mobile application." },
  ]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [rewardJob, setRewardJob] = useState<Job | null>(null);
  const [completedJob, setCompletedJob] = useState<Job | null>(null); // New state for completed job

  const handleJobClick = (job: Job) => {
    if (job.status === 'current') {
      setSelectedJob(job);
    } else if (job.status === 'posted') {
      setRewardJob(job);
    } else if (job.status === 'completed') {
      setCompletedJob(job);
    }
  };

  const handleJobSubmit = (jobId: number, link: string) => {
    // Send this data to your backend here
    console.log(`Job ${jobId} submitted with link: ${link}`);
    // Update the job status locally
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, status: 'completed' as const, submissionLink: link } : job
    ));
  };

  const handleRewardRelease = (jobId: number) => {
    console.log(`Reward released for job ${jobId}`);
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, status: 'completed' as const } : job
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-6">
        <Navbar />
        
        <Link href="/" className="inline-block mb-6">
          <button className="bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700 transition">
            ← Back to JobHub
          </button>
        </Link>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-300">
          <h2 className="text-2xl font-bold text-indigo-600 mb-4">Your Balance</h2>
          <p className="text-4xl font-bold text-purple-600 bg-gradient-to-r from-purple-400 to-indigo-600 text-transparent bg-clip-text">
            {balance}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-indigo-600 mb-4">Job History</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div 
                key={job.id} 
                className="bg-white p-6 rounded-lg shadow-md transition-all flex flex-col h-full relative group cursor-pointer"
                onClick={() => handleJobClick(job)}
              >
                <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-indigo-500 transition-all duration-300 pointer-events-none"></div>
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-indigo-600 mb-2">{job.title}</h3>
                  <p className="text-gray-600 mb-2">Reward: {job.reward}</p>
                  <p className="text-gray-600 mb-2">Status: 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold
                      ${job.status === 'completed' ? 'bg-green-200 text-green-800' :
                        job.status === 'current' ? 'bg-blue-200 text-blue-800' :
                        'bg-yellow-200 text-yellow-800'}`}>
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </span>
                  </p>
                  <p className="text-gray-600">Date: {job.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedJob && (
          <JobSubmissionModal
            job={selectedJob}
            onClose={() => setSelectedJob(null)}
            onSubmit={handleJobSubmit}
          />
        )}

        {rewardJob && (
          <RewardReleaseModal
            job={rewardJob}
            onClose={() => setRewardJob(null)}
            onConfirm={handleRewardRelease}
          />
        )}

        {completedJob && (
          <JobCompletedModal
            job={completedJob}
            onClose={() => setCompletedJob(null)}
          />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

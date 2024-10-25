"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import JobSubmissionModal from '../../components/JobSubmissionModal';
import RewardReleaseModal from '../../components/RewardReleaseModal';
import JobCompletedModal from '../../components/JobCompletedModal';
import { useActiveAccount, useWalletBalance } from 'thirdweb/react';
import { client } from '../client';
import { baseSepolia } from 'thirdweb/chains';

interface Job {
  address: string;
  title: string;
  reward: string;
  status: 'posted' | 'current' | 'completed';
  date: string;
  description: string;
  submissionLink?: string;
}

const ProfilePage: React.FC = () => {
  const [balance, setBalance] = useState("0.00 ETH");
  const [filter, setFilter] = useState<'all' | 'posted' | 'current' | 'completed'>('all');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [rewardJob, setRewardJob] = useState<Job | null>(null);
  const [completedJob, setCompletedJob] = useState<Job | null>(null);

  // Helper function to format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const account = useActiveAccount();

  const { data, isLoading, isError } = useWalletBalance({
    chain: baseSepolia,
    address: account?.address,
    client,
  });

  // Update balance only when data changes
  useEffect(() => {
    if (data?.displayValue) {
      setBalance(data.displayValue + " ETH");
    }
  }, [data]);

  // Fetch jobs from the API endpoints based on commitment
  useEffect(() => {
    const fetchJobs = async () => {
      const storedCommitment = localStorage.getItem("publicCommitment");
      if (!storedCommitment) return;

      try {
        const responsePosted = await fetch(`/api/escrow/getByCommitmentOwner?commitment=${storedCommitment}`);
        const postedJobs = await responsePosted.json();

        const responseProvider = await fetch(`/api/escrow/getByCommitmentProvider?commitment=${storedCommitment}`);
        const providerJobs = await responseProvider.json();

        const currentJobs = providerJobs.filter((job: Job) => job.status === 'current');
        const completedJobs = providerJobs.filter((job: Job) => job.status === 'completed');

        setJobs([
          ...postedJobs.map((job: any) => ({
            ...job,
            reward: job.reward + " ETH",
            date: formatDate(job.xata_createdat), // Format the creation date
            status: 'posted',
          })),
          ...currentJobs.map((job: any) => ({
            ...job,
            reward: job.reward + " ETH",
            date: formatDate(job.xata_createdat),
            status: 'current',
          })),
          ...completedJobs.map((job: any) => ({
            ...job,
            reward: job.reward + " ETH",
            date: formatDate(job.xata_createdat),
            status: 'completed',
          })),
        ]);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  // Filter jobs based on the selected status
  const filteredJobs = filter === 'all' ? jobs : jobs.filter((job) => job.status === filter);

  const handleJobClick = (job: Job) => {
    if (job.status === 'current') {
      setSelectedJob(job);
    } else if (job.status === 'posted') {
      setRewardJob(job);
    } else if (job.status === 'completed') {
      setCompletedJob(job);
    }
  };

  const handleFilterChange = (status: 'all' | 'posted' | 'current' | 'completed') => {
    setFilter(status);
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

        {/* Status filter tabs */}
        <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
          {['all', 'posted', 'current', 'completed'].map((status) => (
            <button
              key={status}
              className={`py-2 px-4 rounded-full ${
                filter === status ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600'
              } shadow-md hover:shadow-lg transition-all`}
              onClick={() => handleFilterChange(status as 'all' | 'posted' | 'current' | 'completed')}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-indigo-600 mb-4">Job History</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job.address}
                className="bg-white p-6 rounded-lg shadow-md transition-all flex flex-col h-full relative group cursor-pointer"
                onClick={() => handleJobClick(job)}
              >
                <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-indigo-500 transition-all duration-300 pointer-events-none"></div>
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-indigo-600 mb-2">{job.title}</h3>
                  <p className="text-gray-600 mb-2">Reward: {job.reward}</p>
                  <p className="text-gray-600 mb-2">
                    Status:
                    <span
                      className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                        job.status === 'completed'
                          ? 'bg-green-200 text-green-800'
                          : job.status === 'current'
                          ? 'bg-blue-200 text-blue-800'
                          : 'bg-yellow-200 text-yellow-800'
                      }`}
                    >
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
            onSubmit={(jobId, link) => {
              console.log(`Job ${jobId} submitted with link: ${link}`);
              setJobs((prevJobs) =>
                prevJobs.map((job) =>
                  job.address === jobId ? { ...job, status: 'completed', submissionLink: link } : job
                )
              );
            }}
          />
        )}

        {rewardJob && (
          <RewardReleaseModal
            job={rewardJob}
            onClose={() => setRewardJob(null)}
            onConfirm={(jobId) => {
              console.log(`Reward released for job ${jobId}`);
              setJobs((prevJobs) =>
                prevJobs.map((job) =>
                  job.address === jobId ? { ...job, status: 'completed' } : job
                )
              );
            }}
            account={account}
          />
        )}

        {completedJob && (
          <JobCompletedModal job={completedJob} onClose={() => setCompletedJob(null)} />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

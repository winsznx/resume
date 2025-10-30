'use client'

import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACT_ADDRESS, RESUME_ABI } from '../contracts/Resume'
import { formatDistanceToNow } from 'date-fns'
import LoadingSpinner from './LoadingSpinner'

export default function WorkSection({ workExperiences, entryFee, refetch }) {
  const [showForm, setShowForm] = useState(false)
  const [company, setCompany] = useState('')
  const [position, setPosition] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [current, setCurrent] = useState(false)

  const { data: hash, writeContract, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const handleSubmit = async (e) => {
    e.preventDefault()

    const startTimestamp = new Date(startDate).getTime() / 1000
    const endTimestamp = current ? 0 : new Date(endDate).getTime() / 1000

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: RESUME_ABI,
      functionName: 'addWorkExperience',
      args: [company, position, description, startTimestamp, endTimestamp, current],
      value: entryFee,
    })
  }

  if (isSuccess) {
    setTimeout(() => {
      setCompany('')
      setPosition('')
      setDescription('')
      setStartDate('')
      setEndDate('')
      setCurrent(false)
      setShowForm(false)
      refetch()
    }, 2000)
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">💼</span>
          <h2 className="text-2xl font-bold text-white">Work Experience</h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
        >
          {showForm ? 'Cancel' : '+ Add Work'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 bg-gray-900 p-6 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Company *</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Position *</label>
              <input
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Start Date *</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={current}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:outline-none disabled:opacity-50"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="current"
              checked={current}
              onChange={(e) => setCurrent(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="current" className="text-gray-300">I currently work here</label>
          </div>

          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-gray-400">
              Fee: <span className="text-primary-500 font-bold">{entryFee ? `${Number(entryFee) / 1e18} ETH` : '...'}</span>
            </p>
            <button
              type="submit"
              disabled={isPending || isConfirming}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {isPending && 'Sending...'}
              {isConfirming && 'Confirming...'}
              {!isPending && !isConfirming && 'Add Work Experience'}
            </button>
          </div>

          {isSuccess && (
            <div className="bg-green-900/30 border border-green-700 text-green-400 px-4 py-3 rounded-lg">
              Work experience added successfully!
            </div>
          )}
        </form>
      )}

      {/* Display work experiences */}
      {workExperiences === undefined ? (
        <LoadingSpinner />
      ) : workExperiences.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-3">💼</div>
          <p className="text-gray-400">No work experience added yet</p>
          <p className="text-gray-500 text-sm mt-2">Click "+ Add Work" to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {[...workExperiences].reverse().map((work) => (
            <div key={work.id.toString()} className="bg-gray-900 p-6 rounded-lg border border-gray-700">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-bold text-white">{work.position}</h3>
                  <p className="text-primary-500 font-semibold">{work.company}</p>
                </div>
                {work.current && (
                  <span className="bg-green-900/30 border border-green-700 text-green-400 px-3 py-1 rounded-full text-sm">
                    Current
                  </span>
                )}
              </div>
              {work.description && (
                <p className="text-gray-300 mb-4">{work.description}</p>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>
                  {new Date(Number(work.startDate) * 1000).toLocaleDateString()} - {work.current ? 'Present' : new Date(Number(work.endDate) * 1000).toLocaleDateString()}
                </span>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(Number(work.timestamp) * 1000), { addSuffix: true })}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

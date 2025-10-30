'use client'

import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACT_ADDRESS, RESUME_ABI } from '../contracts/Resume'
import { formatDistanceToNow } from 'date-fns'

export default function EducationSection({ educations, entryFee, refetch }) {
  const [showForm, setShowForm] = useState(false)
  const [institution, setInstitution] = useState('')
  const [degree, setDegree] = useState('')
  const [field, setField] = useState('')
  const [graduationYear, setGraduationYear] = useState('')

  const { data: hash, writeContract, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const handleSubmit = async (e) => {
    e.preventDefault()

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: RESUME_ABI,
      functionName: 'addEducation',
      args: [institution, degree, field, Number(graduationYear)],
      value: entryFee,
    })
  }

  if (isSuccess) {
    setTimeout(() => {
      setInstitution('')
      setDegree('')
      setField('')
      setGraduationYear('')
      setShowForm(false)
      refetch()
    }, 2000)
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎓</span>
          <h2 className="text-2xl font-bold text-white">Education</h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
        >
          {showForm ? 'Cancel' : '+ Add Education'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 bg-gray-900 p-6 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Institution *</label>
            <input
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Degree</label>
              <input
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                placeholder="e.g., Bachelor of Science"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Field of Study</label>
              <input
                type="text"
                value={field}
                onChange={(e) => setField(e.target.value)}
                placeholder="e.g., Computer Science"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Graduation Year *</label>
            <input
              type="number"
              value={graduationYear}
              onChange={(e) => setGraduationYear(e.target.value)}
              min="1950"
              max="2050"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:outline-none"
              required
            />
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
              {!isPending && !isConfirming && 'Add Education'}
            </button>
          </div>

          {isSuccess && (
            <div className="bg-green-900/30 border border-green-700 text-green-400 px-4 py-3 rounded-lg">
              Education added successfully!
            </div>
          )}
        </form>
      )}

      {/* Display educations */}
      {!educations || educations.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p>No education added yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {[...educations].reverse().map((edu) => (
            <div key={edu.id.toString()} className="bg-gray-900 p-6 rounded-lg border border-gray-700">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-bold text-white">{edu.institution}</h3>
                  {edu.degree && (
                    <p className="text-primary-500 font-semibold">{edu.degree}</p>
                  )}
                </div>
                <span className="bg-primary-900/30 border border-primary-700 text-primary-400 px-3 py-1 rounded-full text-sm font-bold">
                  {edu.graduationYear.toString()}
                </span>
              </div>
              {edu.field && (
                <p className="text-gray-300 mb-4">{edu.field}</p>
              )}
              <div className="text-sm text-gray-400">
                Added {formatDistanceToNow(new Date(Number(edu.timestamp) * 1000), { addSuffix: true })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

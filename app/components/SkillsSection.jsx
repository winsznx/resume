'use client'

import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { CONTRACT_ADDRESS, RESUME_ABI } from '../contracts/Resume'
import { formatDistanceToNow } from 'date-fns'

export default function SkillsSection({ skills, entryFee, refetch }) {
  const [showForm, setShowForm] = useState(false)
  const [skillName, setSkillName] = useState('')
  const { address } = useAccount()

  const { data: hash, writeContract, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const handleSubmit = async (e) => {
    e.preventDefault()

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: RESUME_ABI,
      functionName: 'addSkill',
      args: [skillName],
      value: entryFee,
    })
  }

  const handleEndorse = (skillId) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: RESUME_ABI,
      functionName: 'endorseSkill',
      args: [skillId],
    })
  }

  if (isSuccess) {
    setTimeout(() => {
      setSkillName('')
      setShowForm(false)
      refetch()
    }, 2000)
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">⚡</span>
          <h2 className="text-2xl font-bold text-white">Skills</h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
        >
          {showForm ? 'Cancel' : '+ Add Skill'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 bg-gray-900 p-6 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Skill Name *</label>
            <input
              type="text"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              placeholder="e.g., Solidity, React, JavaScript"
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
              {!isPending && !isConfirming && 'Add Skill'}
            </button>
          </div>

          {isSuccess && (
            <div className="bg-green-900/30 border border-green-700 text-green-400 px-4 py-3 rounded-lg">
              Skill added successfully!
            </div>
          )}
        </form>
      )}

      {/* Display skills */}
      {!skills || skills.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p>No skills added yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...skills].reverse().map((skill) => {
            const isOwner = address && skill.owner.toLowerCase() === address.toLowerCase()

            return (
              <div key={skill.id.toString()} className="bg-gray-900 p-5 rounded-lg border border-gray-700 hover:border-primary-600 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-white">{skill.name}</h3>
                  {isOwner && (
                    <span className="bg-primary-900/30 border border-primary-700 text-primary-400 px-2 py-1 rounded text-xs">
                      You
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">👍</span>
                    <span className="text-primary-500 font-bold text-lg">{skill.endorsements.toString()}</span>
                    <span className="text-gray-400 text-sm">endorsements</span>
                  </div>

                  {!isOwner && (
                    <button
                      onClick={() => handleEndorse(skill.id)}
                      disabled={isPending || isConfirming}
                      className="bg-primary-600/20 hover:bg-primary-600/40 text-primary-400 px-3 py-1 rounded text-sm font-semibold transition-colors disabled:opacity-50"
                    >
                      Endorse
                    </button>
                  )}
                </div>

                <div className="text-xs text-gray-400 mt-3">
                  Added {formatDistanceToNow(new Date(Number(skill.timestamp) * 1000), { addSuffix: true })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

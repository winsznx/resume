'use client'

import { useState, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { CONTRACT_ADDRESS, RESUME_ABI } from '../contracts/Resume'
import { formatDistanceToNow } from 'date-fns'
import LoadingSpinner from './LoadingSpinner'
import ConfirmationModal from './ConfirmationModal'
import DeleteConfirmModal from './DeleteConfirmModal'
import type { Skill } from '../types'

interface SkillsSectionProps {
    skills: Skill[] | undefined
    entryFee: bigint | undefined
    refetch: () => void
}

export default function SkillsSection({ skills, entryFee, refetch }: SkillsSectionProps) {
    const [showForm, setShowForm] = useState(false)
    const [skillName, setSkillName] = useState('')
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deleteItemId, setDeleteItemId] = useState<bigint | null>(null)
    const [deleteItemName, setDeleteItemName] = useState('')
    const [formErrors, setFormErrors] = useState<Record<string, string>>({})
    const { address } = useAccount()

    const { data: hash, writeContract, isPending, isError, error } = useWriteContract()
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

    const {
        data: deleteHash,
        writeContract: writeDeleteContract,
        isPending: isDeletePending
    } = useWriteContract()
    const {
        isLoading: isDeleteConfirming,
        isSuccess: isDeleteSuccess
    } = useWaitForTransactionReceipt({ hash: deleteHash })

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {}

        if (!skillName.trim()) errors.skillName = 'Skill name is required'
        if (skillName.length > 50) errors.skillName = 'Skill name must be less than 50 characters'

        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSubmitClick = (e: React.FormEvent) => {
        e.preventDefault()
        if (validateForm()) {
            setShowConfirmModal(true)
        }
    }

    const handleConfirmSubmit = () => {
        writeContract({
            address: CONTRACT_ADDRESS,
            abi: RESUME_ABI,
            functionName: 'addSkill',
            args: [skillName],
            value: entryFee,
        })
        setShowConfirmModal(false)
    }

    const handleEndorse = (skillId: bigint) => {
        writeContract({
            address: CONTRACT_ADDRESS,
            abi: RESUME_ABI,
            functionName: 'endorseSkill',
            args: [skillId],
        })
    }

    const handleDelete = (id: bigint, name: string) => {
        setDeleteItemId(id)
        setDeleteItemName(name)
        setShowDeleteModal(true)
    }

    const handleConfirmDelete = () => {
        if (deleteItemId !== null) {
            writeDeleteContract({
                address: CONTRACT_ADDRESS,
                abi: RESUME_ABI,
                functionName: 'deleteSkill',
                args: [deleteItemId],
            })
        }
    }

    useEffect(() => {
        if (isSuccess) {
            setSkillName('')
            setFormErrors({})
            setShowForm(false)
            setTimeout(() => refetch(), 2000)
        }
    }, [isSuccess, refetch])

    useEffect(() => {
        if (isDeleteSuccess) {
            setShowDeleteModal(false)
            setDeleteItemId(null)
            setDeleteItemName('')
            setTimeout(() => refetch(), 2000)
        }
    }, [isDeleteSuccess, refetch])

    return (
        <>
            <div className="bg-card border border-border rounded-lg p-6 animate-slideUp">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">⚡</span>
                        <h2 className="text-2xl font-bold text-white">Skills</h2>
                    </div>
                    <button
                        onClick={() => {
                            setShowForm(!showForm)
                            setFormErrors({})
                        }}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
                    >
                        {showForm ? 'Cancel' : '+ Add Skill'}
                    </button>
                </div>

                {showForm && (
                    <form onSubmit={handleSubmitClick} className="mb-6 bg-gray-900 p-6 rounded-lg space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Skill Name *</label>
                            <input
                                type="text"
                                value={skillName}
                                onChange={(e) => setSkillName(e.target.value)}
                                placeholder="e.g., Solidity, React, JavaScript"
                                className={`w-full px-4 py-2 bg-gray-800 border ${formErrors.skillName ? 'border-red-500' : 'border-gray-700'} rounded-lg text-white focus:border-primary-500 focus:outline-none`}
                            />
                            {formErrors.skillName && <p className="text-red-400 text-sm mt-1">{formErrors.skillName}</p>}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                            <p className="text-sm text-gray-400">
                                Fee: <span className="text-primary-500 font-bold">{entryFee ? `${Number(entryFee) / 1e18} ETH` : '...'}</span>
                            </p>
                            <button
                                type="submit"
                                disabled={isPending || isConfirming}
                                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isPending && 'Preparing...'}
                                {isConfirming && 'Confirming...'}
                                {!isPending && !isConfirming && 'Add Skill'}
                            </button>
                        </div>

                        {isError && (
                            <div className="bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded-lg">
                                <p className="font-semibold">Transaction Failed</p>
                                <p className="text-sm mt-1">{error?.message || 'An error occurred'}</p>
                            </div>
                        )}

                        {isSuccess && (
                            <div className="bg-green-900/30 border border-green-700 text-green-400 px-4 py-3 rounded-lg">
                                ✅ Skill added successfully!
                            </div>
                        )}
                    </form>
                )}

                {skills === undefined ? (
                    <LoadingSpinner />
                ) : skills.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-5xl mb-3">⚡</div>
                        <p className="text-gray-400">No skills added yet</p>
                        <p className="text-gray-500 text-sm mt-2">Click "+ Add Skill" to get started</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...skills].reverse().map((skill) => {
                            const isOwner = address && skill.owner.toLowerCase() === address.toLowerCase()

                            return (
                                <div key={skill.id.toString()} className="bg-gray-900 p-5 rounded-lg border border-gray-700 hover:border-primary-600 transition-colors group">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-lg font-bold text-white flex-1">{skill.name}</h3>
                                        <div className="flex items-center gap-2">
                                            {isOwner && (
                                                <span className="bg-primary-900/30 border border-primary-700 text-primary-400 px-2 py-1 rounded text-xs">
                                                    You
                                                </span>
                                            )}
                                            {isOwner && (
                                                <button
                                                    onClick={() => handleDelete(skill.id, skill.name)}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 p-1 rounded-lg hover:bg-red-900/20"
                                                    title="Delete"
                                                >
                                                    🗑️
                                                </button>
                                            )}
                                        </div>
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

            <ConfirmationModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleConfirmSubmit}
                title="Add Skill"
                message={`You're about to add "${skillName}" to your skill list.`}
                fee={entryFee}
                isPending={isPending || isConfirming}
            />

            <DeleteConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleConfirmDelete}
                itemName={deleteItemName}
                isPending={isDeletePending || isDeleteConfirming}
            />
        </>
    )
}

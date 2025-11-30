'use client'

import { useState, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACT_ADDRESS, RESUME_ABI } from '../contracts/Resume'
import { formatDistanceToNow } from 'date-fns'
import LoadingSpinner from './LoadingSpinner'
import ConfirmationModal from './ConfirmationModal'
import DeleteConfirmModal from './DeleteConfirmModal'
import type { Education } from '../types'

interface EducationSectionProps {
    educations: Education[] | undefined
    entryFee: bigint | undefined
    refetch: () => void
}

export default function EducationSection({ educations, entryFee, refetch }: EducationSectionProps) {
    const [showForm, setShowForm] = useState(false)
    const [institution, setInstitution] = useState('')
    const [degree, setDegree] = useState('')
    const [field, setField] = useState('')
    const [graduationYear, setGraduationYear] = useState('')
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deleteItemId, setDeleteItemId] = useState<bigint | null>(null)
    const [deleteItemName, setDeleteItemName] = useState('')
    const [formErrors, setFormErrors] = useState<Record<string, string>>({})

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
        const currentYear = new Date().getFullYear()

        if (!institution.trim()) errors.institution = 'Institution is required'
        if (!graduationYear) errors.graduationYear = 'Graduation year is required'

        const year = parseInt(graduationYear)
        if (year < 1900 || year > currentYear + 10) {
            errors.graduationYear = `Year must be between 1900 and ${currentYear + 10}`
        }

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
            functionName: 'addEducation',
            args: [institution, degree, field, BigInt(graduationYear)],
            value: entryFee,
        })
        setShowConfirmModal(false)
    }

    const handleDelete = (id: bigint, institutionName: string) => {
        setDeleteItemId(id)
        setDeleteItemName(institutionName)
        setShowDeleteModal(true)
    }

    const handleConfirmDelete = () => {
        if (deleteItemId !== null) {
            writeDeleteContract({
                address: CONTRACT_ADDRESS,
                abi: RESUME_ABI,
                functionName: 'deleteEducation',
                args: [deleteItemId],
            })
        }
    }

    useEffect(() => {
        if (isSuccess) {
            setInstitution('')
            setDegree('')
            setField('')
            setGraduationYear('')
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
                        <span className="text-3xl">🎓</span>
                        <h2 className="text-2xl font-bold text-white">Education</h2>
                    </div>
                    <button
                        onClick={() => {
                            setShowForm(!showForm)
                            setFormErrors({})
                        }}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
                    >
                        {showForm ? 'Cancel' : '+ Add Education'}
                    </button>
                </div>

                {showForm && (
                    <form onSubmit={handleSubmitClick} className="mb-6 bg-gray-900 p-6 rounded-lg space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Institution *</label>
                            <input
                                type="text"
                                value={institution}
                                onChange={(e) => setInstitution(e.target.value)}
                                placeholder="e.g., Massachusetts Institute of Technology"
                                className={`w-full px-4 py-2 bg-gray-800 border ${formErrors.institution ? 'border-red-500' : 'border-gray-700'} rounded-lg text-white focus:border-primary-500 focus:outline-none`}
                            />
                            {formErrors.institution && <p className="text-red-400 text-sm mt-1">{formErrors.institution}</p>}
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
                                placeholder={new Date().getFullYear().toString()}
                                className={`w-full px-4 py-2 bg-gray-800 border ${formErrors.graduationYear ? 'border-red-500' : 'border-gray-700'} rounded-lg text-white focus:border-primary-500 focus:outline-none`}
                            />
                            {formErrors.graduationYear && <p className="text-red-400 text-sm mt-1">{formErrors.graduationYear}</p>}
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
                                {!isPending && !isConfirming && 'Add Education'}
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
                                ✅ Education added successfully!
                            </div>
                        )}
                    </form>
                )}

                {educations === undefined ? (
                    <LoadingSpinner />
                ) : educations.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-5xl mb-3">🎓</div>
                        <p className="text-gray-400">No education added yet</p>
                        <p className="text-gray-500 text-sm mt-2">Click "+ Add Education" to get started</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {[...educations].reverse().map((edu) => (
                            <div key={edu.id.toString()} className="bg-gray-900 p-6 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors group">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-white">{edu.institution}</h3>
                                        {edu.degree && (
                                            <p className="text-primary-500 font-semibold">{edu.degree}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="bg-primary-900/30 border border-primary-700 text-primary-400 px-3 py-1 rounded-full text-sm font-bold">
                                            {edu.graduationYear.toString()}
                                        </span>
                                        <button
                                            onClick={() => handleDelete(edu.id, edu.institution)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 px-3 py-1 rounded-lg hover:bg-red-900/20"
                                            title="Delete"
                                        >
                                            🗑️
                                        </button>
                                    </div>
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

            <ConfirmationModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleConfirmSubmit}
                title="Add Education"
                message={`You're about to add "${degree || 'education'}" from "${institution}" to your on-chain resume.`}
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

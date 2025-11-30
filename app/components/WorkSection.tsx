'use client'

import { useState, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACT_ADDRESS, RESUME_ABI } from '../contracts/Resume'
import { formatDistanceToNow } from 'date-fns'
import LoadingSpinner from './LoadingSpinner'
import ConfirmationModal from './ConfirmationModal'
import DeleteConfirmModal from './DeleteConfirmModal'
import type { WorkExperience } from '../types'

interface WorkSectionProps {
    workExperiences: WorkExperience[] | undefined
    entryFee: bigint | undefined
    refetch: () => void
}

export default function WorkSection({ workExperiences, entryFee, refetch }: WorkSectionProps) {
    const [showForm, setShowForm] = useState(false)
    const [company, setCompany] = useState('')
    const [position, setPosition] = useState('')
    const [description, setDescription] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [current, setCurrent] = useState(false)
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

    // Validate form
    const validateForm = (): boolean => {
        const errors: Record<string, string> = {}

        if (!company.trim()) errors.company = 'Company is required'
        if (!position.trim()) errors.position = 'Position is required'
        if (!startDate) errors.startDate = 'Start date is required'

        const start = new Date(startDate)
        const today = new Date()

        if (start > today) {
            errors.startDate = 'Start date cannot be in the future'
        }

        if (!current && endDate) {
            const end = new Date(endDate)
            if (end < start) {
                errors.endDate = 'End date must be after start date'
            }
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
        const startTimestamp = BigInt(Math.floor(new Date(startDate).getTime() / 1000))
        const endTimestamp = current ? BigInt(0) : BigInt(Math.floor(new Date(endDate).getTime() / 1000))

        writeContract({
            address: CONTRACT_ADDRESS,
            abi: RESUME_ABI,
            functionName: 'addWorkExperience',
            args: [company, position, description, startTimestamp, endTimestamp, current],
            value: entryFee,
        })
        setShowConfirmModal(false)
    }

    const handleDelete = (id: bigint, companyName: string) => {
        setDeleteItemId(id)
        setDeleteItemName(`${companyName}`)
        setShowDeleteModal(true)
    }

    const handleConfirmDelete = () => {
        if (deleteItemId !== null) {
            writeDeleteContract({
                address: CONTRACT_ADDRESS,
                abi: RESUME_ABI,
                functionName: 'deleteWorkExperience',
                args: [deleteItemId],
            })
        }
    }

    // Reset form on success
    useEffect(() => {
        if (isSuccess) {
            setCompany('')
            setPosition('')
            setDescription('')
            setStartDate('')
            setEndDate('')
            setCurrent(false)
            setFormErrors({})
            setShowForm(false)
            setTimeout(() => refetch(), 2000)
        }
    }, [isSuccess, refetch])

    // Reset delete modal on success
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
                        <span className="text-3xl">💼</span>
                        <h2 className="text-2xl font-bold text-white">Work Experience</h2>
                    </div>
                    <button
                        onClick={() => {
                            setShowForm(!showForm)
                            setFormErrors({})
                        }}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
                    >
                        {showForm ? 'Cancel' : '+ Add Work'}
                    </button>
                </div>

                {showForm && (
                    <form onSubmit={handleSubmitClick} className="mb-6 bg-gray-900 p-6 rounded-lg space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Company *</label>
                                <input
                                    type="text"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                    className={`w-full px-4 py-2 bg-gray-800 border ${formErrors.company ? 'border-red-500' : 'border-gray-700'} rounded-lg text-white focus:border-primary-500 focus:outline-none`}
                                />
                                {formErrors.company && <p className="text-red-400 text-sm mt-1">{formErrors.company}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Position *</label>
                                <input
                                    type="text"
                                    value={position}
                                    onChange={(e) => setPosition(e.target.value)}
                                    className={`w-full px-4 py-2 bg-gray-800 border ${formErrors.position ? 'border-red-500' : 'border-gray-700'} rounded-lg text-white focus:border-primary-500 focus:outline-none`}
                                />
                                {formErrors.position && <p className="text-red-400 text-sm mt-1">{formErrors.position}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:outline-none resize-none"
                                placeholder="Describe your role and achievements..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Start Date *</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className={`w-full px-4 py-2 bg-gray-800 border ${formErrors.startDate ? 'border-red-500' : 'border-gray-700'} rounded-lg text-white focus:border-primary-500 focus:outline-none`}
                                />
                                {formErrors.startDate && <p className="text-red-400 text-sm mt-1">{formErrors.startDate}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">End Date</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    disabled={current}
                                    className={`w-full px-4 py-2 bg-gray-800 border ${formErrors.endDate ? 'border-red-500' : 'border-gray-700'} rounded-lg text-white focus:border-primary-500 focus:outline-none disabled:opacity-50`}
                                />
                                {formErrors.endDate && <p className="text-red-400 text-sm mt-1">{formErrors.endDate}</p>}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="current"
                                checked={current}
                                onChange={(e) => {
                                    setCurrent(e.target.checked)
                                    if (e.target.checked) setEndDate('')
                                }}
                                className="w-4 h-4 accent-primary-600"
                            />
                            <label htmlFor="current" className="text-gray-300">I currently work here</label>
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
                                {!isPending && !isConfirming && 'Add Work Experience'}
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
                                ✅ Work experience added successfully!
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
                            <div key={work.id.toString()} className="bg-gray-900 p-6 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors group">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{work.position}</h3>
                                        <p className="text-primary-500 font-semibold">{work.company}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {work.current && (
                                            <span className="bg-green-900/30 border border-green-700 text-green-400 px-3 py-1 rounded-full text-sm">
                                                Current
                                            </span>
                                        )}
                                        <button
                                            onClick={() => handleDelete(work.id, work.company)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 px-3 py-1 rounded-lg hover:bg-red-900/20"
                                            title="Delete"
                                        >
                                            🗑️
                                        </button>
                                    </div>
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

            <ConfirmationModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleConfirmSubmit}
                title="Add Work Experience"
                message={`You're about to add "${position}" at "${company}" to your on-chain resume.`}
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

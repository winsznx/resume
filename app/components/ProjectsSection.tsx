'use client'

import { useState, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACT_ADDRESS, RESUME_ABI } from '../contracts/Resume'
import { formatDistanceToNow } from 'date-fns'
import LoadingSpinner from './LoadingSpinner'
import ConfirmationModal from './ConfirmationModal'
import DeleteConfirmModal from './DeleteConfirmModal'
import type { Project } from '../types'

interface ProjectsSectionProps {
    projects: Project[] | undefined
    entryFee: bigint | undefined
    refetch: () => void
}

export default function ProjectsSection({ projects, entryFee, refetch }: ProjectsSectionProps) {
    const [showForm, setShowForm] = useState(false)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [link, setLink] = useState('')
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

        if (!title.trim()) errors.title = 'Project title is required'
        if (title.length > 100) errors.title = 'Title must be less than 100 characters'

        if (link && !isValidUrl(link)) {
            errors.link = 'Please enter a valid URL (e.g., https://example.com)'
        }

        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    const isValidUrl = (url: string): boolean => {
        try {
            new URL(url)
            return url.startsWith('http://') || url.startsWith('https://')
        } catch {
            return false
        }
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
            functionName: 'addProject',
            args: [title, description, link],
            value: entryFee,
        })
        setShowConfirmModal(false)
    }

    const handleDelete = (id: bigint, projectTitle: string) => {
        setDeleteItemId(id)
        setDeleteItemName(projectTitle)
        setShowDeleteModal(true)
    }

    const handleConfirmDelete = () => {
        if (deleteItemId !== null) {
            writeDeleteContract({
                address: CONTRACT_ADDRESS,
                abi: RESUME_ABI,
                functionName: 'deleteProject',
                args: [deleteItemId],
            })
        }
    }

    useEffect(() => {
        if (isSuccess) {
            setTitle('')
            setDescription('')
            setLink('')
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
                        <span className="text-3xl">🚀</span>
                        <h2 className="text-2xl font-bold text-white">Projects</h2>
                    </div>
                    <button
                        onClick={() => {
                            setShowForm(!showForm)
                            setFormErrors({})
                        }}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
                    >
                        {showForm ? 'Cancel' : '+ Add Project'}
                    </button>
                </div>

                {showForm && (
                    <form onSubmit={handleSubmitClick} className="mb-6 bg-gray-900 p-6 rounded-lg space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Project Title *</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., DeFi Lending Platform"
                                className={`w-full px-4 py-2 bg-gray-800 border ${formErrors.title ? 'border-red-500' : 'border-gray-700'} rounded-lg text-white focus:border-primary-500 focus:outline-none`}
                            />
                            {formErrors.title && <p className="text-red-400 text-sm mt-1">{formErrors.title}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                placeholder="Describe your project, technologies used, and your role..."
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:outline-none resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Project Link</label>
                            <input
                                type="text"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                placeholder="https://github.com/username/project"
                                className={`w-full px-4 py-2 bg-gray-800 border ${formErrors.link ? 'border-red-500' : 'border-gray-700'} rounded-lg text-white focus:border-primary-500 focus:outline-none`}
                            />
                            {formErrors.link && <p className="text-red-400 text-sm mt-1">{formErrors.link}</p>}
                            <p className="text-xs text-gray-500 mt-1">
                                Optional - Add a link to GitHub, live demo, or project documentation
                            </p>
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
                                {!isPending && !isConfirming && 'Add Project'}
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
                                ✅ Project added successfully!
                            </div>
                        )}
                    </form>
                )}

                {projects === undefined ? (
                    <LoadingSpinner />
                ) : projects.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-5xl mb-3">🚀</div>
                        <p className="text-gray-400">No projects added yet</p>
                        <p className="text-gray-500 text-sm mt-2">Click "+ Add Project" to get started</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[...projects].reverse().map((project) => (
                            <div key={project.id.toString()} className="bg-gray-900 p-6 rounded-lg border border-gray-700 hover:border-primary-600 transition-colors group">
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-xl font-bold text-white flex-1">{project.title}</h3>
                                    <button
                                        onClick={() => handleDelete(project.id, project.title)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 px-2 py-1 rounded-lg hover:bg-red-900/20"
                                        title="Delete"
                                    >
                                        🗑️
                                    </button>
                                </div>

                                {project.description && (
                                    <p className="text-gray-300 mb-4 line-clamp-3">{project.description}</p>
                                )}

                                <div className="flex items-center justify-between">
                                    {project.link && (
                                        <a
                                            href={project.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary-500 hover:text-primary-400 text-sm font-semibold flex items-center gap-2 transition-colors"
                                        >
                                            View Project
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>
                                    )}
                                    <span className="text-xs text-gray-400">
                                        {formatDistanceToNow(new Date(Number(project.timestamp) * 1000), { addSuffix: true })}
                                    </span>
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
                title="Add Project"
                message={`You're about to add "${title}" to your project showcase.`}
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

'use client'

import { DeleteConfirmModalProps } from '../types'

export default function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    itemName,
    isPending = false
}: DeleteConfirmModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-gray-800 border border-red-900/50 rounded-xl shadow-2xl max-w-md w-full p-6 animate-scaleIn">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-red-900/30 border border-red-700 flex items-center justify-center text-2xl">
                        ⚠️
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Delete Entry</h3>
                        <p className="text-sm text-gray-400">This action cannot be undone</p>
                    </div>
                </div>

                <p className="text-gray-300 mb-6">
                    Are you sure you want to delete <span className="font-semibold text-white">"{itemName}"</span>?
                    This will permanently hide it from the blockchain (the data will still exist on-chain but won't be displayed).
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={isPending}
                        className="flex-1 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isPending}
                        className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isPending ? (
                            <>
                                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            'Delete'
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

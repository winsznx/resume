'use client'

import { ConfirmationModalProps } from '../types'

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    fee,
    isPending = false
}: ConfirmationModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl max-w-md w-full p-6 animate-scaleIn">
                <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                <p className="text-gray-300 mb-4">{message}</p>

                {fee !== undefined && (
                    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-6">
                        <p className="text-sm text-gray-400 mb-1">Transaction Fee</p>
                        <p className="text-2xl font-bold text-primary-400">
                            {(Number(fee) / 1e18).toFixed(10)} ETH
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            ≈ ${((Number(fee) / 1e18) * 2000).toFixed(4)} USD
                        </p>
                    </div>
                )}

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
                        className="flex-1 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isPending ? (
                            <>
                                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Processing...
                            </>
                        ) : (
                            'Confirm'
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

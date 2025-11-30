// Type definitions for Resume DApp

export interface WorkExperience {
    id: bigint
    owner: string
    company: string
    position: string
    description: string
    startDate: bigint
    endDate: bigint
    current: boolean
    timestamp: bigint
    exists: boolean
}

export interface Education {
    id: bigint
    owner: string
    institution: string
    degree: string
    field: string
    graduationYear: bigint
    timestamp: bigint
    exists: boolean
}

export interface Skill {
    id: bigint
    owner: string
    name: string
    endorsements: bigint
    timestamp: bigint
    exists: boolean
}

export interface Project {
    id: bigint
    owner: string
    title: string
    description: string
    link: string
    timestamp: bigint
    exists: boolean
}

export interface SectionProps<T> {
    data: T[] | undefined
    entryFee: bigint | undefined
    refetch: () => void
}

export interface ConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    message: string
    fee?: bigint
    isPending?: boolean
}

export interface DeleteConfirmModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    itemName: string
    isPending?: boolean
}

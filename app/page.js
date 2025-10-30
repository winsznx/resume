'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { CONTRACT_ADDRESS, RESUME_ABI } from './contracts/Resume'
import WorkSection from './components/WorkSection'
import EducationSection from './components/EducationSection'
import SkillsSection from './components/SkillsSection'
import ProjectsSection from './components/ProjectsSection'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const { address, isConnected } = useAccount()
  const { open } = useWeb3Modal()

  // Read contract data
  const { data: workExperiences, refetch: refetchWork } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: RESUME_ABI,
    functionName: 'getUserWorkExperiences',
    args: address ? [address] : undefined,
  })

  const { data: educations, refetch: refetchEducation } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: RESUME_ABI,
    functionName: 'getUserEducations',
    args: address ? [address] : undefined,
  })

  const { data: skills, refetch: refetchSkills } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: RESUME_ABI,
    functionName: 'getUserSkills',
    args: address ? [address] : undefined,
  })

  const { data: projects, refetch: refetchProjects } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: RESUME_ABI,
    functionName: 'getUserProjects',
    args: address ? [address] : undefined,
  })

  const { data: entryFee } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: RESUME_ABI,
    functionName: 'entryFee',
  })

  const refetchAll = () => {
    refetchWork()
    refetchEducation()
    refetchSkills()
    refetchProjects()
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <header className="mb-8 md:mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between bg-card border border-border rounded-lg p-4 md:p-6 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-1 md:mb-2">Resume DApp</h1>
              <p className="text-gray-400 text-sm md:text-base">Your Professional Profile, On-Chain Forever</p>
            </div>

            {!isConnected ? (
              <button
                onClick={() => open?.()}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors w-full md:w-auto"
              >
                Connect Wallet
              </button>
            ) : (
              <div className="flex flex-col items-start md:items-end gap-2">
                <div className="bg-green-900/30 border border-green-700 text-green-400 px-4 py-2 rounded-lg font-mono text-sm w-full md:w-auto text-center">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </div>
                <button
                  onClick={() => open?.()}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Switch Wallet
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        {!isConnected ? (
          <div className="text-center py-24">
            <div className="text-8xl mb-6">💼</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Build Your On-Chain Resume
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
              Store your professional experience, education, skills, and projects on the blockchain.
              Verifiable, permanent, and owned by you.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="text-4xl mb-3">💼</div>
                <h3 className="text-white font-bold mb-2">Work Experience</h3>
                <p className="text-gray-400 text-sm">Document your career journey</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="text-4xl mb-3">🎓</div>
                <h3 className="text-white font-bold mb-2">Education</h3>
                <p className="text-gray-400 text-sm">Store your academic achievements</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="text-4xl mb-3">⚡</div>
                <h3 className="text-white font-bold mb-2">Skills</h3>
                <p className="text-gray-400 text-sm">List and get endorsed</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="text-4xl mb-3">🚀</div>
                <h3 className="text-white font-bold mb-2">Projects</h3>
                <p className="text-gray-400 text-sm">Showcase your work</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <WorkSection
              workExperiences={workExperiences}
              entryFee={entryFee}
              refetch={refetchAll}
            />
            <EducationSection
              educations={educations}
              entryFee={entryFee}
              refetch={refetchAll}
            />
            <SkillsSection
              skills={skills}
              entryFee={entryFee}
              refetch={refetchAll}
            />
            <ProjectsSection
              projects={projects}
              entryFee={entryFee}
              refetch={refetchAll}
            />
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center py-8 border-t border-border">
          <p className="text-gray-400 text-sm mb-2">
            Built on Base • Powered by WalletConnect
          </p>
          {isConnected && CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000" && (
            <a
              href={`https://basescan.org/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-500 hover:text-primary-400 text-sm underline transition-colors"
            >
              View Contract on BaseScan →
            </a>
          )}
        </footer>
      </div>
    </div>
  )
}

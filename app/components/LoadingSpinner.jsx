export default function LoadingSpinner({ size = 'md' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className="flex justify-center items-center py-12">
      <div className={`${sizeClasses[size]} border-4 border-gray-700 border-t-primary-500 rounded-full animate-spin`}></div>
    </div>
  )
}
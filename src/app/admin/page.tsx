import KBCoverage from '@/components/admin/KBCoverage'
import MathBatch from '@/components/admin/MathBatch'
import ReviewLessons from '@/components/admin/ReviewLessons'

export default function AdminPage() {
  return (
    <div className="space-y-6 p-6 bg-black min-h-screen">
      <h1 className="text-2xl font-bold text-white">Content Admin — New Factory</h1>
      <p className="text-sm text-gray-400">Based on old app screenshots — improved with Quality + Cost Guard</p>
      <KBCoverage />
      <MathBatch />
      <ReviewLessons />
    </div>
  )
}

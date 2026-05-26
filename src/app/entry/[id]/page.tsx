import Link from 'next/link'
import { getEntryById } from '@/lib/data'
import EntryDetailClient from '@/components/EntryDetailClient'

export default async function EntryDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const entry = await getEntryById(id)

  if (!entry) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <p className="mb-4 text-lg text-[#a09478]">词条不存在</p>
        <Link href="/" className="focus-ring inline-flex min-h-11 items-center rounded-md px-4 text-[#c9a24d]/80 hover:text-[#c9a24d]">
          返回首页
        </Link>
      </div>
    )
  }

  return <EntryDetailClient initialEntry={entry} />
}

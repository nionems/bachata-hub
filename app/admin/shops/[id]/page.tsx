"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ShopPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  useEffect(() => {
    // Directly redirect to the edit page
    router.replace(`/admin/shops/${params.id}/edit`)
  }, [params.id, router])

  return null
} 
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { StateSelect } from '@/components/ui/StateSelect'

export default function SchoolForm() {
  const params = useParams()
  const id = params.id
  // ... rest of your component code
} 
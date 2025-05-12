"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"

export default function Dashboard({ params }: { params: Promise<{ id: string }> }) {
  const [user, setUser] = useState<{id: number, email: string, name?: string} | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/auth/${id}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        if (!response.ok) {
          router.push('/');
          return;
        }
        
        const userData = await response.json();
        setUser(userData);
        
      } catch (error) {
        console.error('Error fetching user data:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    )
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <div>Name: {user?.name}</div>
      <div>Email: {user?.email}</div>
    </div>
  )
}

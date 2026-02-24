"use client"

import { useEffect, useState } from "react"
import { getWallets } from "@/server/actions/wallets"
import { getCategories } from "@/server/actions/categories"

export default function TestPage() {
  const [wallets, setWallets] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        console.log("Fetching wallets...")
        const w = await getWallets("default_user")
        console.log("Wallets result:", w)
        setWallets(w)

        console.log("Fetching categories...")
        const c = await getCategories()
        console.log("Categories result:", c)
        setCategories(c)

        setError("")
      } catch (err: any) {
        console.error("Error loading data:", err)
        setError(err.message || "Unknown error")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) return <div style={{padding: 20}}>Loading...</div>

  return (
    <div style={{padding: 20, color: 'white'}}>
      <h1>Debug Test Page</h1>
      
      <div style={{marginBottom: 20}}>
        <h2>Wallets ({wallets.length})</h2>
        {wallets.length === 0 ? (
          <p>No wallets loaded!</p>
        ) : (
          <ul>
            {wallets.map(w => (
              <li key={w.id}>{w.name} - {w.type}</li>
            ))}
          </ul>
        )}
      </div>

      <div style={{marginBottom: 20}}>
        <h2>Categories ({categories.length})</h2>
        {categories.length === 0 ? (
          <p>No categories loaded!</p>
        ) : (
          <ul>
            {categories.map(c => (
              <li key={c.id}>{c.name} - {c.type}</li>
            ))}
          </ul>
        )}
      </div>

      {error && (
        <div style={{color: 'red', marginTop: 20}}>
          <h2>Error:</h2>
          <pre>{error}</pre>
        </div>
      )}
    </div>
  )
}

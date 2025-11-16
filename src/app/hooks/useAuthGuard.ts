"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { API_URL } from "@/src/config/api"

export function useAuthGuard(){
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if(!token){
      router.push("/login")
      return
    }

    fetch(`${API_URL}/api/users/me`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }
    }).then(async(res)=>{
      if(!res.ok){
        localStorage.clear()
        router.push("/login")
      }
    })
  }, [router])
}

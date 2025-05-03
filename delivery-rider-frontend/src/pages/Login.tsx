import type React from "react"

import { useState } from "react"
import { loginRider } from "../api/auth"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { Loader2 } from "lucide-react"

import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log("User email: ", email, password)
      const response = await loginRider(email, password)
      toast.success("Login successful")
      // Save user info to localStorage or context
      localStorage.setItem("rider", JSON.stringify(response.user))
      navigate("/dashboard")
    } catch (err) {
      console.error(err)
      toast.error("Invalid email or password")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md mx-auto">
        <Card className="border-none shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Rider Login</CardTitle>
            <CardDescription className="text-center text-slate-500">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="email"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <a href="#" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  className="w-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-600 text-white" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        <p className="text-center text-sm text-slate-500 mt-4">
          Don't have an account?{" "}
          <a href="#" className="font-medium text-slate-900 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}

export default Login

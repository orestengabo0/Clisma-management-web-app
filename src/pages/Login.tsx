import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { FormEvent, useEffect, useState } from 'react'
import { loginRequest } from '@/lib/api'
import { useAuthStore } from '@/lib/authStore'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()
  const { setTokens, setAuthenticating, setErrorMessage, isAuthenticating, errorMessage, loadFromStorage, token } = useAuthStore()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)

  useEffect(() => {
    loadFromStorage()
  }, [loadFromStorage])

  useEffect(() => {
    if (token) {
      navigate('/dashboard', { replace: true })
    }
  }, [token, navigate])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setAuthenticating(true)
    try {
      const result = await loginRequest({ username, password })
      const access = result.token
      const refresh = result.refreshToken ?? null
      setTokens(access, refresh, remember)
      navigate('/dashboard', { replace: true })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed'
      setErrorMessage(message)
    } finally {
      setAuthenticating(false)
    }
  }

  return (
    <div className="min-h-[100svh] grid place-items-center p-6 bg-background">
      <Card className="w-full max-w-lg"> {/* wider card */}
        <CardHeader className="p-8 pb-4 space-y-2">
          <CardTitle className="text-2xl md:text-3xl">Welcome back again!</CardTitle>
          <CardDescription className="text-base leading-relaxed">
            Please login to access Clisma Dashboard
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8 pt-4">
          <form className="space-y-8" onSubmit={onSubmit}>
            <div className="grid gap-3">
              <Label htmlFor="username" className="text-[15px] md:text-base font-medium">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Username"
                required
                className="h-12 text-base px-4 rounded-lg"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="password" className="text-[15px] md:text-base font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                required
                className="h-12 text-base px-4 rounded-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* Row: Remember me (left) and Forgot password (right) */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-3">
                  <Checkbox id="remember" className="h-5 w-5 md:h-6 md:w-6" checked={remember} onCheckedChange={(v) => setRemember(Boolean(v))} />
                  <Label htmlFor="remember" className="text-sm md:text-base font-normal">
                    Remember me
                  </Label>
                </div>

                <a
                  href="#"
                  className="text-sm md:text-base text-primary underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            {errorMessage && (
              <div className="text-red-600 text-sm" role="alert">
                {errorMessage}
              </div>
            )}

            <Button type="submit" size="lg" className="h-12 text-base w-full bg-[#113B38]" disabled={isAuthenticating}>
              {isAuthenticating ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login
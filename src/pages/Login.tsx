import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const Login = () => {
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
          <form className="space-y-8">
            <div className="grid gap-3">
              <Label htmlFor="email" className="text-[15px] md:text-base font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                className="h-12 text-base px-4 rounded-lg"
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="password" className="text-[15px] md:text-base font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                required
                className="h-12 text-base px-4 rounded-lg"
              />

              {/* Row: Remember me (left) and Forgot password (right) */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-3">
                  <Checkbox id="remember" className="h-5 w-5 md:h-6 md:w-6" />
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

            <Button type="submit" size="lg" className="h-12 text-base w-full bg-[#113B38]">
              Sign in
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login
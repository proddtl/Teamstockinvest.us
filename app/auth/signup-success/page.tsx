import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                <div className="w-8 h-8 bg-yellow-300 rounded transform rotate-45"></div>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
            <CardDescription>We sent you a confirmation link</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center">
              Please check your email and click the confirmation link to activate your account.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

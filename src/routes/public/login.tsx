import { createFileRoute } from '@tanstack/react-router'
import { PageContainer } from '#/modules/common/components/layout/pageContainer'
import { LoginForm } from '#/modules/login/components/loginForm'

export const Route = createFileRoute('/public/login')({
  component: LoginPage,
})

function LoginPage() {
  return (
    <PageContainer className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
      <LoginForm />
    </PageContainer>
  )
}

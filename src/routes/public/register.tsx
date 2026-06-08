import { createFileRoute } from '@tanstack/react-router'
import { PageContainer } from '#/modules/common/components/layout/pageContainer'
import { RegisterForm } from '#/modules/register/components/registerForm'

export const Route = createFileRoute('/public/register')({
  component: RegisterPage,
})

function RegisterPage() {
  return (
    <PageContainer className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
      <RegisterForm />
    </PageContainer>
  )
}

import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '#components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '#components/ui/card'
import { Form } from '#components/ui/form'
import { InputElement } from '#/modules/common/components/forms/inputElement'
import { signInEmailFn } from '#modules/auth/logic/functions'
import { toast } from 'sonner'
import { m } from "#/paraglide/messages";
import { loginSchema } from "../schemas";
import type { LoginValues } from "../types";

export function LoginForm() {
  const navigate = useNavigate()
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: LoginValues) {
    try {
      const result = await signInEmailFn({ data })
      if (result.user) {
        toast.success(m.auth_login_success())
        navigate({ to: '/' })
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{m.auth_login_title()}</CardTitle>
        <CardDescription>
          {m.auth_login_description()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <InputElement
              control={form.control}
              name="email"
              label={m.auth_email_label()}
              placeholder={m.auth_email_placeholder()}
            />
            <InputElement
              control={form.control}
              name="password"
              label={m.auth_password_label()}
              placeholder={m.auth_password_placeholder()}
              type="password"
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? m.auth_logging_in_button() : m.auth_login_button()}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          {m.auth_no_account()}{' '}
          <button
            onClick={() => navigate({ to: '/public/register' })}
            className="text-primary hover:underline font-medium"
          >
            {m.auth_sign_up_link()}
          </button>
        </p>
      </CardFooter>
    </Card>
  )
}

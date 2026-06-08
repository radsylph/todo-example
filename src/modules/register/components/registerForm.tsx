import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '#components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '#components/ui/card'
import { Form } from '#components/ui/form'
import { InputElement } from '#/modules/common/components/forms/inputElement'
import { signUpEmailFn } from '#modules/auth/logic/functions'
import { toast } from 'sonner'
import { m } from "#/paraglide/messages";
import { registerSchema } from "../schemas";
import type { RegisterValues } from "../types";

export function RegisterForm() {
  const navigate = useNavigate()
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: RegisterValues) {
    try {
      const result = await signUpEmailFn({ data })
      if (result.user) {
        toast.success(m.auth_register_success())
        navigate({ to: '/' })
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{m.auth_register_title()}</CardTitle>
        <CardDescription>
          {m.auth_register_description()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <InputElement
              control={form.control}
              name="name"
              label={m.auth_name_label()}
              placeholder={m.auth_name_placeholder()}
              autoComplete="name"
            />
            <InputElement
              control={form.control}
              name="email"
              label={m.auth_email_label()}
              placeholder={m.auth_email_placeholder()}
              autoComplete="email"
            />
            <InputElement
              control={form.control}
              name="password"
              label={m.auth_password_label()}
              placeholder={m.auth_password_placeholder()}
              type="password"
              autoComplete="new-password"
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? m.auth_registering_button() : m.auth_register_button()}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          {m.auth_have_account()}{' '}
          <button
            onClick={() => navigate({ to: '/public/login' })}
            className="text-primary hover:underline font-medium"
          >
            {m.auth_sign_in_link()}
          </button>
        </p>
      </CardFooter>
    </Card>
  )
}

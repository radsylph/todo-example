import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/todos/add')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/app/todos/add"!</div>
}

import { createFileRoute } from '@tanstack/react-router'
import { PageContainer } from '#components/layout/pageContainer.tsx'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <PageContainer title="Home" description="This is the home page of the app">

     test
    </PageContainer>
  )
}


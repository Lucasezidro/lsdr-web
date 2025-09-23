import { GoalForm } from "./goal-form";

interface GoalPageProps {
  params: {
    goalId: number
  }
}

export default async function GoalPage({ params }: GoalPageProps) {
  const goalId = params.goalId

  return (
    <main>
      <GoalForm goalId={goalId} />
    </main>
  )
}
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Transaction } from './transactions-card'

export const FinanceCharts = (transactions: Transaction[]) => {
  const lastFiveMonths = Array.from({ length: 5 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    return date.toLocaleDateString('pt-BR', { month: 'short' })
  }).reverse()

  const initialMonthlyData = lastFiveMonths.reduce((acc, month) => {
    acc[month] = { name: month, income: 0, expenses: 0 }
    return acc
  }, {})

  // 3. Preencha o objeto com os dados reais das transações
  const monthlyData = transactions.transactions.reduce((acc, transaction) => {
    const month = new Date(transaction.date).toLocaleDateString('pt-BR', { month: 'short' });

    if (transaction.transaction_type === 'income') {
      acc[month].income += transaction.amount / 100;
    } else {
      acc[month].expenses += transaction.amount / 100;
    }

    return acc;
  }, initialMonthlyData);
  
  const formattedData = Object.values(monthlyData)

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={formattedData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="income" fill="#8884d8" />
        <Bar dataKey="expenses" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  )
}
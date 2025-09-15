import { BadgeDollarSign, Goal, Users } from 'lucide-react'

export const homeMarketingCards = [
  {
    id: 1,
    icon: <Goal className='size-8 text-cyan-400' />,
    title: 'Gerenciamento de Metas',
    description: 'Crie e acompanhe o progresso de metas financeiras e operacionais.'
  },
  {
    id: 2,
    icon: <BadgeDollarSign className='size-8 text-cyan-400' />,
    title: 'Controle de Finanças',
    description: 'Registre entradas e saídas de forma simples e visualize o saldo em tempo real.'
  },
  {
    id: 3,
    icon: <Users className='size-8 text-cyan-400' />,
    title: 'Colaboração',
    description: 'Convide membros da sua equipe e gerencie permissões por papel.'
  },
]
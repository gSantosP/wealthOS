import type { DashboardData } from '../types'

export const MOCK_AI_INSIGHT = `\
💰 Sua taxa de poupança de 37.7% é excelente — a maioria dos consultores financeiros recomenda 20%. Você está quase dobrando essa meta, construindo patrimônio em ritmo acelerado.

⚠️ Orçamento de Entretenimento ($340 vs limite de $300): você estourou em $40, mas este é o seu único estouro no mês inteiro. Não é crise — ajuste o limite para $350 ou corte um serviço de streaming. Todas as outras categorias estão sob controle.

🎯 Meta Carro Novo em 85%: com seu fluxo de caixa atual de $2.340/mês, você atingirá 100% em aproximadamente 6 semanas. Quando fechar essa meta, redirecione os aportes para a Entrada do Apartamento (42%) — ela precisa mais atenção agora.

📈 Renda em alta: +$400 vs mês anterior representa crescimento de 6.9%. Se essa tendência continuar, você cruzará $7.000/mês no 3º trimestre. Considere aumentar sua alocação em investimentos em 5% quando isso acontecer.`

export const MOCK_DASHBOARD: DashboardData = {
  netWorth:        142850,
  netWorthChange:  10840,
  monthlyIncome:   6200,
  incomeChange:    400,
  monthlyExpenses: 3860,
  expensesChange:  -210,
  savingsRate:     37.7,
  liquidAssets:    38420,
  investments:     89200,
  realEstate:      15230,
  cashFlow:        2340,

  history: [
    { month: 'Dec', income: 5200, expenses: 4100 },
    { month: 'Jan', income: 5600, expenses: 3900 },
    { month: 'Feb', income: 5400, expenses: 4200 },
    { month: 'Mar', income: 5800, expenses: 4070 },
    { month: 'Apr', income: 5800, expenses: 4070 },
    { month: 'May', income: 6200, expenses: 3860 },
  ],

  byCategory: [
    { category: 'Housing',       amount: 1200, color: '#6366f1' },
    { category: 'Food',          amount: 680,  color: '#10b981' },
    { category: 'Transport',     amount: 420,  color: '#f59e0b' },
    { category: 'Entertainment', amount: 340,  color: '#06b6d4' },
    { category: 'Health',        amount: 120,  color: '#a78bfa' },
    { category: 'Shopping',      amount: 280,  color: '#f43f5e' },
    { category: 'Other',         amount: 820,  color: '#64748b' },
  ],

  transactions: [
    { id: '1',  name: 'Netflix',               emoji: '🎬', amount: 15.99,  type: 'debit',  category: 'Entertainment', date: 'May 13, 2026' },
    { id: '2',  name: 'Salary — Upwork',        emoji: '💼', amount: 3200,   type: 'credit', category: 'Income',        date: 'May 13, 2026' },
    { id: '3',  name: 'Pao de Acucar',          emoji: '🛒', amount: 187.40, type: 'debit',  category: 'Food',          date: 'May 12, 2026' },
    { id: '4',  name: 'Uber',                   emoji: '🚗', amount: 23.50,  type: 'debit',  category: 'Transport',     date: 'May 12, 2026' },
    { id: '5',  name: 'Electricity',            emoji: '⚡', amount: 142.00, type: 'debit',  category: 'Housing',       date: 'May 11, 2026' },
    { id: '6',  name: 'Freelance — React App',  emoji: '💻', amount: 1400,   type: 'credit', category: 'Income',        date: 'May 10, 2026' },
    { id: '7',  name: 'iFood',                  emoji: '🍔', amount: 67.90,  type: 'debit',  category: 'Food',          date: 'May 10, 2026' },
    { id: '8',  name: 'Spotify',                emoji: '🎵', amount: 9.90,   type: 'debit',  category: 'Entertainment', date: 'May 9, 2026'  },
    { id: '9',  name: 'Gym membership',         emoji: '🏋', amount: 89.90,  type: 'debit',  category: 'Health',        date: 'May 8, 2026'  },
    { id: '10', name: 'Zara',                   emoji: '👕', amount: 189.90, type: 'debit',  category: 'Shopping',      date: 'May 7, 2026'  },
    { id: '11', name: 'Internet — Vivo',         emoji: '🌐', amount: 99.90,  type: 'debit',  category: 'Housing',       date: 'May 6, 2026'  },
    { id: '12', name: 'Freelance — Dashboard',  emoji: '💻', amount: 2000,   type: 'credit', category: 'Income',        date: 'May 5, 2026'  },
    { id: '13', name: 'Farmacia',               emoji: '💊', amount: 31.00,  type: 'debit',  category: 'Health',        date: 'May 4, 2026'  },
    { id: '14', name: 'Rent',                   emoji: '🏠', amount: 1200,   type: 'debit',  category: 'Housing',       date: 'May 1, 2026'  },
    { id: '15', name: 'Shell — Gas',            emoji: '⛽', amount: 85.00,  type: 'debit',  category: 'Transport',     date: 'Apr 30, 2026' },
  ],

  budgets: [
    { id: 'b1', category: 'Food',          emoji: '🍽', limit: 750,  spent: 680 },
    { id: 'b2', category: 'Transport',     emoji: '🚗', limit: 500,  spent: 420 },
    { id: 'b3', category: 'Entertainment', emoji: '🎮', limit: 300,  spent: 340 },
    { id: 'b4', category: 'Shopping',      emoji: '🛍', limit: 600,  spent: 280 },
    { id: 'b5', category: 'Health',        emoji: '💊', limit: 400,  spent: 120 },
  ],

  goals: [
    { id: 'g1', name: 'Travel Fund',       emoji: '✈', target: 5000,  current: 3400  },
    { id: 'g2', name: 'Home Down Payment', emoji: '🏠', target: 80000, current: 33600 },
    { id: 'g3', name: 'New Car',           emoji: '🚗', target: 40000, current: 34000 },
    { id: 'g4', name: 'Emergency Fund',    emoji: '📈', target: 20000, current: 20000 },
  ],
}

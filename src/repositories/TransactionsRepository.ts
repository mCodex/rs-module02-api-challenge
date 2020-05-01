import Transaction from '../models/Transaction';

interface TransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const balance = this.transactions.reduce(
      (acc: Balance, t: Transaction) => {
        switch (t.type) {
          case 'income':
            acc.income += t.value;
            break;
          case 'outcome':
            acc.outcome += t.value;
            break;
          default:
            break;
        }

        return acc;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    return {
      ...balance,
      total: balance.income - balance.outcome,
    };
  }

  public create({ title, value, type }: TransactionDTO): Transaction {
    const balance = this.getBalance();

    if (type === 'outcome' && balance.total < value) {
      throw Error('Saldo Inválido');
    }

    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: 'PO Guide Part 1' | 'Postal Volume V' | 'POSB Rules' | 'PLI/RPLI Rules';
}

export const SAMPLE_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'What is the incentive rate granted to Branch Postmasters (BPM) for procuring a 5-Year Time Deposit (TD) account?',
    options: ['0.5% of deposit amount', '1.0% of deposit amount', '1.5% of deposit amount', '2.0% of deposit amount'],
    correctIndex: 3,
    explanation: 'As per Department of Posts rules, 5-Year Time Deposits earn the highest BPM incentive of 2.0%, whereas 1-Year earns 0.5%, and 2-Year/3-Year earn 1.0%.',
    category: 'POSB Rules'
  },
  {
    id: 2,
    question: 'What is the maximum detention period for an ordinary Post Restante article in the Post Office?',
    options: ['7 days', '15 days', '1 month (30 days)', '3 months'],
    correctIndex: 2,
    explanation: 'Under PO Guide Part I, Post Restante articles can be kept for up to 1 month (except Value Payable articles which are kept for 7 days).',
    category: 'PO Guide Part 1'
  },
  {
    id: 3,
    question: 'In Railway Mail Service (RMS), what does "HRO" stand for?',
    options: ['Head Record Office', 'Head Railway Office', 'High Record Officer', 'Head Route Office'],
    correctIndex: 0,
    explanation: 'HRO stands for Head Record Office, the stationary office of RMS situated at the headquarters of the division.',
    category: 'Postal Volume V'
  },
  {
    id: 4,
    question: 'Which PLI insurance scheme is also officially known as "Santosh"?',
    options: ['Whole Life Assurance', 'Endowment Assurance', 'Convertible Whole Life Assurance', 'Anticipated Endowment Assurance'],
    correctIndex: 1,
    explanation: 'PLI Endowment Assurance is named "Santosh", while Whole Life Assurance is "Suraksha", and Anticipated Endowment is "Sumangal".',
    category: 'PLI/RPLI Rules'
  },
  {
    id: 5,
    question: 'What is the minimum amount required to open a Sukanya Samriddhi Account (SSA)?',
    options: ['₹100', '₹250', '₹500', '₹1,000'],
    correctIndex: 1,
    explanation: 'Sukanya Samriddhi Accounts can be opened with an initial deposit of just ₹250, with a maximum annual deposit limit of ₹1.5 Lakhs.',
    category: 'POSB Rules'
  }
];

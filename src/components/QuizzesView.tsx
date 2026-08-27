import React, { useState } from 'react';
import { 
  GraduationCap, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  RotateCcw, 
  Award,
  Sparkles,
  Timer
} from 'lucide-react';
import { SAMPLE_QUIZ_QUESTIONS, QuizQuestion } from '../data/quizzesData';
import { ThemeDefinition } from '../utils/themeConfig';

interface QuizzesViewProps {
  themeObj: ThemeDefinition;
  onBackToHome: () => void;
}

export const QuizzesView: React.FC<QuizzesViewProps> = ({
  themeObj,
  onBackToHome
}) => {
  const isRetro = themeObj.id === 'retroCream';
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const activeQuestion: QuizQuestion = SAMPLE_QUIZ_QUESTIONS[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (showResult) return;
    setSelectedOption(idx);
    setShowResult(true);
    if (idx === activeQuestion.correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 < SAMPLE_QUIZ_QUESTIONS.length) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setShowResult(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToHome}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
            isRetro 
              ? 'bg-white border border-[#EAE0D0] text-[#1E1B18] hover:bg-[#FAF4E8]' 
              : 'bg-slate-900 border border-slate-800 text-white hover:bg-slate-800'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Back to PostalPro Home</span>
        </button>

        <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
          GDS to MTS / Postman / PA-SA Prep
        </span>
      </div>

      {/* Main Quiz Box */}
      <div className={`p-6 sm:p-10 rounded-3xl border shadow-2xl space-y-6 ${
        isRetro 
          ? 'bg-white border-2 border-[#EAE0D0] text-[#1E1B18]' 
          : `${themeObj.cardBg} border ${themeObj.cardBorder} text-white`
      }`}>
        {/* Header Ribbon */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              isRetro ? 'bg-[#FEECE6] text-[#F95724]' : 'bg-sky-500/20 text-sky-400'
            }`}>
              <GraduationCap className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black">
                Postal AI Exam Practice Hub
              </h1>
              <p className="text-xs text-slate-500">
                Departmental syllabus mock questions with instant explanations
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-slate-400">Score</span>
            <p className="text-lg sm:text-xl font-black font-mono text-emerald-500">
              {score} / {SAMPLE_QUIZ_QUESTIONS.length}
            </p>
          </div>
        </div>

        {!quizFinished ? (
          <div className="space-y-6">
            {/* Progress & Category */}
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400">
                {activeQuestion.category}
              </span>
              <span className="text-slate-400">
                Question {currentIdx + 1} of {SAMPLE_QUIZ_QUESTIONS.length}
              </span>
            </div>

            {/* Question Text */}
            <h2 className="text-base sm:text-xl font-bold leading-relaxed">
              {activeQuestion.question}
            </h2>

            {/* Options List */}
            <div className="space-y-3 pt-2">
              {activeQuestion.options.map((option, idx) => {
                const isChosen = selectedOption === idx;
                const isCorrect = idx === activeQuestion.correctIndex;

                let optionStyle = isRetro 
                  ? 'bg-[#FAF4E8] border-[#E0D4C0] text-[#1E1B18] hover:border-[#F95724]' 
                  : 'bg-slate-900 border-slate-800 text-white hover:border-slate-700';

                if (showResult) {
                  if (isCorrect) {
                    optionStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                  } else if (isChosen) {
                    optionStyle = 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={showResult}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center justify-between ${optionStyle}`}
                  >
                    <span>{option}</span>
                    {showResult && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 ml-2" />}
                    {showResult && isChosen && !isCorrect && <XCircle className="w-5 h-5 text-rose-500 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation Card */}
            {showResult && (
              <div className={`p-4 rounded-2xl border space-y-2 animate-in fade-in duration-200 ${
                isRetro ? 'bg-white border-[#E0D4C0]' : 'bg-slate-950 border-slate-800'
              }`}>
                <div className="flex items-center gap-1.5 text-xs font-black uppercase text-amber-500">
                  <HelpCircle className="w-4 h-4" />
                  <span>Rule & Explanation:</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  {activeQuestion.explanation}
                </p>

                <div className="pt-3 flex justify-end">
                  <button
                    onClick={handleNextQuestion}
                    className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer ${
                      isRetro ? 'bg-[#F95724] text-white hover:bg-[#E04515]' : themeObj.buttonPrimary
                    }`}
                  >
                    {currentIdx + 1 === SAMPLE_QUIZ_QUESTIONS.length ? 'Finish Quiz' : 'Next Question →'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Quiz Results Finish Card */
          <div className="text-center py-8 space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black">Practice Test Completed!</h2>
              <p className="text-sm text-slate-400">
                You scored <span className="font-bold text-amber-400">{score}</span> out of {SAMPLE_QUIZ_QUESTIONS.length} correct.
              </p>
            </div>

            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                onClick={handleRestartQuiz}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition cursor-pointer ${
                  isRetro ? 'bg-[#F95724] text-white hover:bg-[#E04515]' : themeObj.buttonPrimary
                }`}
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retry Quiz</span>
              </button>
              <button
                onClick={onBackToHome}
                className="px-6 py-3 rounded-2xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-white transition cursor-pointer"
              >
                Return to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

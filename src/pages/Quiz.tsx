
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getQuestionsByDifficulty } from '@/data/questions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Question, Difficulty } from '@/types';
import { saveQuizResult } from '@/lib/supabase';
import Header from '@/components/Header';

const Quiz = () => {
  const { difficulty } = useParams<{ difficulty: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);

  useEffect(() => {
    if (!difficulty || !['easy', 'medium', 'hard'].includes(difficulty)) {
      navigate('/student-dashboard');
      toast({
        title: 'Invalid difficulty level',
        description: 'Please select a valid quiz difficulty.',
        variant: 'destructive',
      });
      return;
    }
    
    const difficultyLevel = difficulty as Difficulty;
    const loadedQuestions = getQuestionsByDifficulty(difficultyLevel);
    setQuestions(loadedQuestions);
  }, [difficulty, navigate, toast]);

  const handleOptionSelect = (optionIndex: number) => {
    if (isAnswered) return;
    
    setSelectedOption(optionIndex);
    setCorrectAnswer(questions[currentIndex].correctAnswer);
    setIsAnswered(true);
    
    if (optionIndex === questions[currentIndex].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setCorrectAnswer(null);
    } else {
      setShowResults(true);
      
      if (user) {
        saveQuizResult({
          studentId: user.id,
          studentName: user.name,
          difficulty: difficulty as Difficulty,
          score: score + (selectedOption === questions[currentIndex].correctAnswer ? 1 : 0),
          totalQuestions: questions.length,
          date: new Date().toISOString(),
        }).then(({ error }) => {
          if (error) {
            console.error('Error saving quiz result:', error);
            toast({
              title: 'Failed to save result',
              description: 'Your quiz result could not be saved. Please try again.',
              variant: 'destructive',
            });
          } else {
            toast({
              title: 'Quiz completed!',
              description: 'Your results have been saved.',
              variant: 'default',
            });
          }
        });
      }
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setShowResults(false);
    setIsAnswered(false);
    setCorrectAnswer(null);
  };

  const handleReturnToDashboard = () => {
    navigate('/student-dashboard');
  };

  const progressPercentage = ((currentIndex + 1) / questions.length) * 100;

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getDifficultyColor = (difficultyLevel: string | undefined) => {
    switch (difficultyLevel) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-amber-100 text-amber-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center">
        {showResults ? (
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden animate-fade-in">
            <div className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold">Quiz Results</h2>
                <p className="text-gray-500 text-lg mt-1">
                  {difficulty ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1) : ''} Level
                </p>
              </div>
              
              <div className="text-center my-8">
                <div className="text-7xl font-bold text-primary mb-2">{score}</div>
                <p className="text-xl text-gray-600">out of {questions.length} questions</p>
                
                <div className="w-full bg-gray-200 rounded-full h-4 my-6">
                  <div 
                    className={`h-4 rounded-full ${
                      (score / questions.length) * 100 >= 70 ? 'bg-green-500' : 
                      (score / questions.length) * 100 >= 40 ? 'bg-amber-500' : 
                      'bg-red-500'
                    }`}
                    style={{ width: `${(score / questions.length) * 100}%` }}
                  ></div>
                </div>
                
                <p className="text-lg">
                  {(score / questions.length) * 100 >= 80 
                    ? 'Excellent work! You aced it!' 
                    : (score / questions.length) * 100 >= 60 
                    ? 'Good job! Keep practicing!' 
                    : 'Keep practicing and you\'ll improve!'}
                </p>
              </div>
              
              <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 justify-center mt-8">
                <Button onClick={handleRestartQuiz}>Try Again</Button>
                <Button variant="outline" onClick={handleReturnToDashboard}>
                  Return to Dashboard
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-2xl">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${getDifficultyColor(difficulty)}`}>
                    {difficulty ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1) : ''} Level
                  </span>
                </div>
                <span className="text-sm font-medium">
                  Question {currentIndex + 1} of {questions.length}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
            
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">
                  {questions[currentIndex].text}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {questions[currentIndex].options.map((option, index) => (
                    <div 
                      key={index}
                      className={`quiz-option ${
                        selectedOption === index ? 'selected' : ''
                      } ${
                        isAnswered && index === correctAnswer ? 'correct' : 
                        isAnswered && selectedOption === index && index !== correctAnswer ? 'incorrect' : ''
                      }`}
                      onClick={() => handleOptionSelect(index)}
                    >
                      <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <div>{option}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={handleNext} 
                  disabled={selectedOption === null}
                >
                  {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Quiz;

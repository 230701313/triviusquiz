
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getStudentResults } from '@/lib/supabase';
import { QuizResult, Difficulty } from '@/types';
import ResultCard from '@/components/ResultCard';
import Header from '@/components/Header';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await getStudentResults(user.id);
        
        if (error) throw error;
        
        const formattedResults = data.map(result => ({
          id: result.id,
          studentId: result.student_id,
          studentName: result.student_name,
          difficulty: result.difficulty as Difficulty,
          score: result.score,
          totalQuestions: result.total_questions,
          date: result.date,
        }));
        
        setResults(formattedResults);
      } catch (error) {
        console.error('Error fetching results:', error);
        toast({
          title: 'Failed to load results',
          description: 'Could not retrieve your quiz results. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [user, toast]);

  const getDifficultyData = (difficulty: Difficulty) => {
    const difficultyResults = results.filter(r => r.difficulty === difficulty);
    const totalAttempts = difficultyResults.length;
    const averageScore = totalAttempts > 0 
      ? difficultyResults.reduce((sum, r) => sum + r.score, 0) / totalAttempts 
      : 0;
    const highestScore = totalAttempts > 0 
      ? Math.max(...difficultyResults.map(r => r.score)) 
      : 0;
    
    return { totalAttempts, averageScore, highestScore };
  };
  
  const easyStats = getDifficultyData('easy');
  const mediumStats = getDifficultyData('medium');
  const hardStats = getDifficultyData('hard');
  
  const recentResults = [...results].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, 5);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}! Ready for a quiz?</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="difficulty-card difficulty-easy">
            <div className="text-green-600 font-bold text-xl mb-1">Easy Mode</div>
            <div className="text-sm text-gray-600 mb-4">Test your basic knowledge</div>
            <div className="text-center mb-4">
              <div className="text-sm font-medium text-gray-500">Highest Score</div>
              <div className="text-2xl font-bold text-green-600">
                {easyStats.highestScore}/10
              </div>
            </div>
            <Link to="/quiz/easy">
              <Button variant="default" size="sm">Start Quiz</Button>
            </Link>
          </div>
          
          <div className="difficulty-card difficulty-medium">
            <div className="text-amber-600 font-bold text-xl mb-1">Medium Mode</div>
            <div className="text-sm text-gray-600 mb-4">Challenge yourself</div>
            <div className="text-center mb-4">
              <div className="text-sm font-medium text-gray-500">Highest Score</div>
              <div className="text-2xl font-bold text-amber-600">
                {mediumStats.highestScore}/10
              </div>
            </div>
            <Link to="/quiz/medium">
              <Button variant="default" size="sm">Start Quiz</Button>
            </Link>
          </div>
          
          <div className="difficulty-card difficulty-hard">
            <div className="text-red-600 font-bold text-xl mb-1">Hard Mode</div>
            <div className="text-sm text-gray-600 mb-4">Expert level questions</div>
            <div className="text-center mb-4">
              <div className="text-sm font-medium text-gray-500">Highest Score</div>
              <div className="text-2xl font-bold text-red-600">
                {hardStats.highestScore}/10
              </div>
            </div>
            <Link to="/quiz/hard">
              <Button variant="default" size="sm">Start Quiz</Button>
            </Link>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="dashboard-stat">
            <h3 className="font-medium mb-2">Easy Mode Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Attempts</div>
                <div className="text-2xl font-bold text-green-600">{easyStats.totalAttempts}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Avg. Score</div>
                <div className="text-2xl font-bold text-green-600">
                  {easyStats.averageScore.toFixed(1)}
                </div>
              </div>
            </div>
          </div>
          
          <div className="dashboard-stat">
            <h3 className="font-medium mb-2">Medium Mode Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Attempts</div>
                <div className="text-2xl font-bold text-amber-600">{mediumStats.totalAttempts}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Avg. Score</div>
                <div className="text-2xl font-bold text-amber-600">
                  {mediumStats.averageScore.toFixed(1)}
                </div>
              </div>
            </div>
          </div>
          
          <div className="dashboard-stat">
            <h3 className="font-medium mb-2">Hard Mode Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Attempts</div>
                <div className="text-2xl font-bold text-red-600">{hardStats.totalAttempts}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Avg. Score</div>
                <div className="text-2xl font-bold text-red-600">
                  {hardStats.averageScore.toFixed(1)}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Results</h2>
          
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : recentResults.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentResults.map((result) => (
                <ResultCard key={result.id} result={result} />
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <p className="text-muted-foreground">You haven't taken any quizzes yet.</p>
              <p className="mb-4">Start with an easy quiz to see your results here!</p>
              <Link to="/quiz/easy">
                <Button>Take Your First Quiz</Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;

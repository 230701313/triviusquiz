
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getAllResults, getSampleResultsByDifficulty } from '@/lib/supabase';
import { QuizResult, Difficulty } from '@/types';
import ResultCard from '@/components/ResultCard';
import DifficultyResultsTable from '@/components/DifficultyResultsTable';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip } from 'recharts';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [easyResults, setEasyResults] = useState<QuizResult[]>([]);
  const [mediumResults, setMediumResults] = useState<QuizResult[]>([]);
  const [hardResults, setHardResults] = useState<QuizResult[]>([]);
  const [loadingDifficultyResults, setLoadingDifficultyResults] = useState(true);
  
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const { data, error } = await getAllResults();
        
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
          description: 'Could not retrieve quiz results. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchSampleResults = async () => {
      setLoadingDifficultyResults(true);
      try {
        // Fetch sample results for each difficulty
        const easyPromise = getSampleResultsByDifficulty('easy');
        const mediumPromise = getSampleResultsByDifficulty('medium');
        const hardPromise = getSampleResultsByDifficulty('hard');
        
        const [easyData, mediumData, hardData] = await Promise.all([
          easyPromise, mediumPromise, hardPromise
        ]);
        
        if (easyData.error) throw easyData.error;
        if (mediumData.error) throw mediumData.error;
        if (hardData.error) throw hardData.error;
        
        const formatResults = (data: any) => data.data?.map(result => ({
          id: result.id,
          studentId: result.student_id,
          studentName: result.student_name,
          difficulty: result.difficulty as Difficulty,
          score: result.score,
          totalQuestions: result.total_questions,
          date: result.date,
        })) || [];
        
        setEasyResults(formatResults(easyData));
        setMediumResults(formatResults(mediumData));
        setHardResults(formatResults(hardData));
      } catch (error) {
        console.error('Error fetching sample results:', error);
        toast({
          title: 'Failed to load sample results',
          description: 'Could not retrieve sample quiz results. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoadingDifficultyResults(false);
      }
    };
    
    fetchResults();
    fetchSampleResults();
  }, [toast]);

  const filteredResults = difficultyFilter === 'all' 
    ? results 
    : results.filter(r => r.difficulty === difficultyFilter);
  
  // Calculate statistics
  const totalStudents = new Set(results.map(r => r.studentId)).size;
  const totalQuizzes = results.length;
  
  const averageScoreByDifficulty = (difficulty: string) => {
    const filtered = results.filter(r => r.difficulty === difficulty);
    if (filtered.length === 0) return 0;
    return filtered.reduce((sum, r) => sum + (r.score / r.totalQuestions) * 100, 0) / filtered.length;
  };
  
  const easyAvg = averageScoreByDifficulty('easy');
  const mediumAvg = averageScoreByDifficulty('medium');
  const hardAvg = averageScoreByDifficulty('hard');
  
  // Data for charts
  const difficultyDistributionData = [
    { name: 'Easy', value: results.filter(r => r.difficulty === 'easy').length, color: '#4ade80' },
    { name: 'Medium', value: results.filter(r => r.difficulty === 'medium').length, color: '#facc15' },
    { name: 'Hard', value: results.filter(r => r.difficulty === 'hard').length, color: '#f87171' },
  ];
  
  const scoreDistributionData = [
    { name: '0-20%', value: results.filter(r => (r.score / r.totalQuestions) * 100 <= 20).length, color: '#f87171' },
    { name: '21-40%', value: results.filter(r => (r.score / r.totalQuestions) * 100 > 20 && (r.score / r.totalQuestions) * 100 <= 40).length, color: '#fb923c' },
    { name: '41-60%', value: results.filter(r => (r.score / r.totalQuestions) * 100 > 40 && (r.score / r.totalQuestions) * 100 <= 60).length, color: '#facc15' },
    { name: '61-80%', value: results.filter(r => (r.score / r.totalQuestions) * 100 > 60 && (r.score / r.totalQuestions) * 100 <= 80).length, color: '#a3e635' },
    { name: '81-100%', value: results.filter(r => (r.score / r.totalQuestions) * 100 > 80).length, color: '#4ade80' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}! Here's an overview of student progress.</p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-sm">
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="text-4xl font-bold text-primary">{totalStudents}</div>
              <div className="text-sm text-muted-foreground">Total Students</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="text-4xl font-bold text-primary">{totalQuizzes}</div>
              <div className="text-sm text-muted-foreground">Quizzes Taken</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="text-4xl font-bold text-green-500">
                {easyAvg.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Avg. Easy Score</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="text-4xl font-bold text-amber-500">
                {mediumAvg.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Avg. Medium Score</div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Quiz Difficulty Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={difficultyDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {difficultyDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Score Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={scoreDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {scoreDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="by-student" className="mb-8">
          <TabsList>
            <TabsTrigger value="by-student">Results by Student</TabsTrigger>
            <TabsTrigger value="by-difficulty">Results by Difficulty</TabsTrigger>
          </TabsList>
          
          <TabsContent value="by-student">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Student Results</h2>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="difficulty" className="mr-2">
                    Filter by:
                  </Label>
                  <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Difficulties</SelectItem>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {loading ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : filteredResults.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredResults.map((result) => (
                    <ResultCard key={result.id} result={result} showStudent={true} />
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 bg-gray-50 rounded-lg">
                  <p className="text-muted-foreground">
                    {difficultyFilter === 'all' 
                      ? "No quiz results found." 
                      : `No ${difficultyFilter} quiz results found.`}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="by-difficulty">
            <div className="space-y-8">
              <DifficultyResultsTable 
                title="Easy Difficulty Results" 
                results={easyResults} 
                isLoading={loadingDifficultyResults} 
              />
              
              <DifficultyResultsTable 
                title="Medium Difficulty Results" 
                results={mediumResults} 
                isLoading={loadingDifficultyResults} 
              />
              
              <DifficultyResultsTable 
                title="Hard Difficulty Results" 
                results={hardResults} 
                isLoading={loadingDifficultyResults} 
              />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default TeacherDashboard;

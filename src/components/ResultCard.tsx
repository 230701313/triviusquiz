
import { QuizResult } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

interface ResultCardProps {
  result: QuizResult;
  showStudent?: boolean;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy':
      return 'text-green-500';
    case 'medium':
      return 'text-amber-500';
    case 'hard':
      return 'text-red-500';
    default:
      return 'text-blue-500';
  }
};

const ResultCard: React.FC<ResultCardProps> = ({ result, showStudent = false }) => {
  const percentage = Math.round((result.score / result.totalQuestions) * 100);
  const difficultyColor = getDifficultyColor(result.difficulty);
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">
            <span className={`font-bold capitalize ${difficultyColor}`}>{result.difficulty}</span> Quiz
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            {format(new Date(result.date), 'MMM d, yyyy')}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {showStudent && (
            <div className="text-sm">
              <span className="font-medium">Student:</span> {result.studentName}
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-sm">Score:</span>
            <span className="font-bold">{result.score}/{result.totalQuestions}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${
                percentage >= 70 ? 'bg-green-500' : percentage >= 40 ? 'bg-amber-500' : 'bg-red-500'
              }`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <div className="text-right text-sm font-medium">
            {percentage}%
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultCard;

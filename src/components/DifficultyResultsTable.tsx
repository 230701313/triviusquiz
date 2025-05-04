
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { QuizResult } from "@/types";
import { format } from "date-fns";

interface DifficultyResultsTableProps {
  results: QuizResult[];
  title: string;
  isLoading: boolean;
}

const DifficultyResultsTable = ({ results, title, isLoading }: DifficultyResultsTableProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-muted-foreground">No {title} results found.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-3">{title}</h3>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead className="w-32">Score</TableHead>
              <TableHead className="w-32">Percentage</TableHead>
              <TableHead className="text-right w-32">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result) => {
              const percentage = Math.round((result.score / result.totalQuestions) * 100);
              return (
                <TableRow key={result.id}>
                  <TableCell className="font-medium">{result.studentName}</TableCell>
                  <TableCell>
                    {result.score}/{result.totalQuestions}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${
                        percentage >= 70 ? 'text-green-500' : 
                        percentage >= 40 ? 'text-amber-500' : 
                        'text-red-500'
                      }`}>
                        {percentage}%
                      </span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            percentage >= 70 ? 'bg-green-500' : 
                            percentage >= 40 ? 'bg-amber-500' : 
                            'bg-red-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {format(new Date(result.date), 'MMM d, yyyy')}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DifficultyResultsTable;

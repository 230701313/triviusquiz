
import { useAuth } from '@/context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { user, loading, isTeacher, isStudent } = useAuth();
  
  // If authenticated, redirect to appropriate dashboard
  if (user && !loading) {
    if (isTeacher) {
      return <Navigate to="/teacher-dashboard" replace />;
    } else if (isStudent) {
      return <Navigate to="/student-dashboard" replace />;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome to Trivius
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            The interactive quiz platform where teachers create and students excel
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-lg transform transition-transform hover:scale-105">
            <div className="h-40 flex items-center justify-center mb-6">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/3976/3976625.png" 
                alt="Student" 
                className="h-32 w-auto"
              />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-center">For Students</h2>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center">
                <span className="bg-green-100 text-green-800 p-1 rounded-full mr-2">✓</span>
                <span>Take quizzes at three difficulty levels</span>
              </li>
              <li className="flex items-center">
                <span className="bg-green-100 text-green-800 p-1 rounded-full mr-2">✓</span>
                <span>Track your progress over time</span>
              </li>
              <li className="flex items-center">
                <span className="bg-green-100 text-green-800 p-1 rounded-full mr-2">✓</span>
                <span>Review your quiz history and results</span>
              </li>
            </ul>
            <div className="flex justify-center">
              <Link to="/login?role=student">
                <Button size="lg">Student Login</Button>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg transform transition-transform hover:scale-105">
            <div className="h-40 flex items-center justify-center mb-6">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/3940/3940131.png" 
                alt="Teacher" 
                className="h-32 w-auto"
              />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-center">For Teachers</h2>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center">
                <span className="bg-green-100 text-green-800 p-1 rounded-full mr-2">✓</span>
                <span>Monitor student performance and progress</span>
              </li>
              <li className="flex items-center">
                <span className="bg-green-100 text-green-800 p-1 rounded-full mr-2">✓</span>
                <span>View detailed reports of quiz results</span>
              </li>
              <li className="flex items-center">
                <span className="bg-green-100 text-green-800 p-1 rounded-full mr-2">✓</span>
                <span>Identify areas where students need help</span>
              </li>
            </ul>
            <div className="flex justify-center">
              <Link to="/login?role=teacher">
                <Button size="lg">Teacher Login</Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-600 mb-4">Don't have an account?</p>
          <Link to="/register">
            <Button variant="outline" size="lg">
              Register Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;

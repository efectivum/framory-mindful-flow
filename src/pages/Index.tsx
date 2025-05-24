
import { useAuth } from '@/hooks/useAuth';
import { UserButton } from '@/components/UserButton';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold mb-4">Welcome to Framory</h1>
          <p className="text-xl text-gray-600 mb-8">Your personal growth companion</p>
          <Link to="/auth">
            <Button size="lg" className="px-8">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Framory</h1>
            <UserButton />
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Welcome back!</h2>
          <p className="text-xl text-gray-600">Ready to continue your personal growth journey?</p>
        </div>
      </main>
    </div>
  );
};

export default Index;

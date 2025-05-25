
import { useAuth } from '@/hooks/useAuth';
import { UserButton } from '@/components/UserButton';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CopyableText } from '@/components/CopyableText';

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
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="text-center max-w-md w-full">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Welcome to Framory</h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">Your personal growth companion</p>
          <Link to="/auth">
            <Button size="lg" className="px-8 w-full md:w-auto">
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
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Framory</h1>
            <UserButton />
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Welcome back!</h2>
          <p className="text-lg md:text-xl text-gray-600">Ready to continue your personal growth journey?</p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Quick Info</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Email
                </label>
                <CopyableText text={user.email || 'No email available'} />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User ID
                </label>
                <CopyableText text={user.id} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">App Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current URL
                </label>
                <CopyableText text={window.location.href} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;

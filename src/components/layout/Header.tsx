import { useNavigate } from 'react-router-dom';
import { Video, LogOut, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
// import { useAuth } from '@/hooks/useAuth';

export const Header = () => {
  const navigate = useNavigate();
  // const { user, logout, isAdmin } = useAuth();

  // const handleLogout = async () => {
  //   await logout();
  //   navigate('/');
  // };

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Media Library</h1>
          </div>
          
          <div className="flex items-center gap-3">
            {!isAdmin && (
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
              >
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            )}
            
            {isAdmin && (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/admin')}
                >
                  Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

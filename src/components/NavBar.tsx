import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, MapPin } from "lucide-react";
import LogoutButton from "./LogoutButton";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Detect token changes
  useEffect(() => {
    const checkToken = () => {
      setToken(localStorage.getItem("token"));
    };

    checkToken();
  }, []);

  // user details
  const userStr = localStorage.getItem("userDetails");
  const userDetails = userStr ? JSON.parse(userStr) : null;

  // user details

  return (
    <header className="bg-white border-b shadow-card sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary">Hujme</span>
          </Link>

          {/* Desktop Auth Buttons */}
          <div
            className={`hidden md:flex items-center space-x-reverse gap-3 space-x-4`}
          >
            {!token ? (
              <Link to="/auth">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-green-200"
                >
                  <User className={`w-4 h-4 `} />
                  Login
                </Button>
              </Link>
            ) : (
              <div className="flex items-center justify-center">
                <User className={`w-4 h-4 `} />
                <span className="font-semibold text-sm">
                  {" "}
                  {`Welcome ${userDetails.firstName} ${userDetails.lastName}...`}
                </span>
              </div>
            )}
            {
              !token ? (
            <Link to="/agent">
              <Button
                size="sm"
                className="bg-gradient-button text-primary-foreground hover:opacity-90 transition-smooth"
              >
                Become an Agent
              </Button>
            </Link>
              ):null
            }
            {token ? <LogoutButton /> : ""}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-foreground hover:text-primary transition-smooth"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <nav className="flex flex-col space-y-4">
              {/* <Link to="/packages" className="text-foreground hover:text-primary transition-smooth">{t('navigation.packages')}</Link>
              <a href="#about" className="text-foreground hover:text-primary transition-smooth">{t('navigation.about')}</a> */}
              <div className="flex flex-col space-y-2 pt-4 border-t">
                {/* <LanguageSelector /> */}
                <Link to="/auth">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-green-200"
                  >
                    <User className={`w-4 h-4 ml-2`} />
                    Login
                  </Button>
                </Link>
                <Link to="/agent/register">
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-green-800 transition-smooth"
                  >
                    Become an Agent
                  </Button>
                </Link>
                {token ? <LogoutButton /> : ""}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;

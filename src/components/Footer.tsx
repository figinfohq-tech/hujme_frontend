import { NavLink } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">

          <div>
            <NavLink
              to="/about"
              className="text-sm sm:text-base font-semibold hover:text-primary-foreground/80 transition-colors duration-200"
            >
              About Us
            </NavLink>
          </div>

          <div>
            <NavLink
              to="/privacy-policy"
              className="text-sm sm:text-base font-semibold hover:text-primary-foreground/80 transition-colors duration-200"
            >
              Privacy Policy
            </NavLink>
          </div>

          <div>
            <NavLink
              to="/terms-conditions"
              className="text-sm sm:text-base font-semibold hover:text-primary-foreground/80 transition-colors duration-200"
            >
              Terms & Conditions
            </NavLink>
          </div>

          <div>
            <NavLink
              to="/cancellation-refund"
              className="text-sm sm:text-base font-semibold hover:text-primary-foreground/80 transition-colors duration-200"
            >
              Cancellation & Refund Policy
            </NavLink>
          </div>

          <div>
            <NavLink
              to="/support"
              className="text-sm sm:text-base font-semibold hover:text-primary-foreground/80 transition-colors duration-200"
            >
              Customer Support
            </NavLink>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 flex justify-center items-center">
          <p className="text-primary-foreground/60 text-xs sm:text-sm">
            © {new Date().getFullYear()} HajjUmrah. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
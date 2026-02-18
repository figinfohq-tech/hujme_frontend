import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-secondary-foreground" />
              </div>
              <span className="text-xl font-bold">HajjUmrah</span>
            </div>
            <p className="text-primary-foreground/80 text-sm">
              Your trusted platform for finding the best Hajj & Umrah travel packages. 
              Connecting pilgrims with certified travel agents across India.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 hover:text-secondary cursor-pointer transition-smooth" />
              <Twitter className="w-5 h-5 hover:text-secondary cursor-pointer transition-smooth" />
              <Instagram className="w-5 h-5 hover:text-secondary cursor-pointer transition-smooth" />
              <Linkedin className="w-5 h-5 hover:text-secondary cursor-pointer transition-smooth" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-primary-foreground/80 hover:text-secondary transition-smooth">Search Packages</a></li>
              <li><a href="/find-agents" className="text-primary-foreground/80 hover:text-secondary transition-smooth">Find Agents</a></li>
              <li><a href="/how-it-works" className="text-primary-foreground/80 hover:text-secondary transition-smooth">How It Works</a></li>
              <li><a href="/testimonials" className="text-primary-foreground/80 hover:text-secondary transition-smooth">Testimonials</a></li>
              <li><a href="/faq" className="text-primary-foreground/80 hover:text-secondary transition-smooth">FAQ</a></li>
            </ul>
          </div>

          {/* For Agents */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">For Travel Agents</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/agent/register" className="text-primary-foreground/80 hover:text-secondary transition-smooth">Register Your Agency</a></li>
              <li><a href="/agent/dashboard" className="text-primary-foreground/80 hover:text-secondary transition-smooth">Agent Dashboard</a></li>
              <li><a href="/pricing-plans" className="text-primary-foreground/80 hover:text-secondary transition-smooth">Pricing Plans</a></li>
              <li><a href="/marketing-tools" className="text-primary-foreground/80 hover:text-secondary transition-smooth">Marketing Tools</a></li>
              <li><a href="/support" className="text-primary-foreground/80 hover:text-secondary transition-smooth">Support</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-secondary" />
                <span className="text-primary-foreground/80">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-secondary" />
                <span className="text-primary-foreground/80">info@hajjumrah.com</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-secondary mt-0.5" />
                <span className="text-primary-foreground/80">
                  123 Business Center,<br />
                  New Delhi, India 110001
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-primary-foreground/60 text-sm">
            © 2024 HajjUmrah. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-primary-foreground/60 hover:text-secondary text-sm transition-smooth">Privacy Policy</a>
            <a href="#" className="text-primary-foreground/60 hover:text-secondary text-sm transition-smooth">Terms of Service</a>
            <a href="#" className="text-primary-foreground/60 hover:text-secondary text-sm transition-smooth">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
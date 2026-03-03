import { Button } from "@/components/ui/button";
import {
  Shield,
  Database,
  Eye,
  Share2,
  Lock,
  UserCheck,
  Cookie,
  Clock,
  ExternalLink,
  RefreshCw,
  Mail,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router";

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-background text-foreground">
      {/* ---------------- Hero Section ---------------- */}
      <section className="py-12 sm:py-16 lg:py-15 px-4 sm:px-6 lg:px-8 bg-primary/5 text-center">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Back
        </Button>
        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">
            Privacy Policy
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Your privacy matters to us. This policy explains how Hujme.com
            collects, uses, and protects your personal information.
          </p>
        </div>
      </section>

      {/* ---------------- Content Section ---------------- */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Section Template */}
          {[
            {
              icon: Shield,
              title: "1. Introduction",
              content:
                "Hujme.com (operated by FIG Info LLP) values your privacy and is committed to protecting your personal data. By using our services, you agree to the collection and use of information in accordance with this policy.",
            },
            {
              icon: Database,
              title: "2. Information We Collect",
              content:
                "We collect personal data such as full name, passport details, contact information, payment details, travel information, IP address, device data, cookies, and browsing behavior to improve our services.",
            },
            {
              icon: Eye,
              title: "3. How We Use Your Information",
              content:
                "We use your data to facilitate bookings, process payments, provide support, enhance security, comply with legal requirements, and send marketing communication (with your consent).",
            },
            {
              icon: Share2,
              title: "4. Data Sharing and Disclosure",
              content:
                "We do not sell personal data. Information may be shared with airlines, hotels, visa agencies, payment processors, legal authorities, or during business transfers when necessary.",
            },
            {
              icon: Lock,
              title: "5. Data Security",
              content:
                "We implement industry-standard security measures to protect your information. However, no online transmission method is 100% secure.",
            },
            {
              icon: UserCheck,
              title: "6. Your Rights",
              content:
                "You have the right to access, correct, delete, or restrict processing of your data and withdraw marketing consent. Contact support@Hujme.com to exercise your rights.",
            },
            {
              icon: Cookie,
              title: "7. Cookies & Tracking",
              content:
                "We use cookies and similar technologies to enhance user experience. You can control cookies via browser settings.",
            },
            {
              icon: Clock,
              title: "8. Data Retention",
              content:
                "We retain personal data only as long as necessary for service fulfillment and legal compliance.",
            },
            {
              icon: ExternalLink,
              title: "9. Third-Party Links",
              content:
                "Our platform may contain links to third-party websites. We are not responsible for their privacy practices.",
            },
            {
              icon: RefreshCw,
              title: "10. Changes to Policy",
              content:
                "We may update this Privacy Policy periodically. Significant updates will be communicated via website or email.",
            },
            {
              icon: Mail,
              title: "11. Contact Us",
              content: "FIG Info LLP\nEmail: support@Hujme.com",
            },
          ].map((section, index) => {
            const Icon = section.icon;
            return (
              <div
                key={index}
                className="bg-card border rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div>
                    <h2 className="text-base sm:text-lg font-semibold text-primary mb-2">
                      {section.title}
                    </h2>

                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                      {section.content}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;

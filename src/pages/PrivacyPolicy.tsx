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
  DatabaseIcon,
} from "lucide-react";
import { useNavigate } from "react-router";

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-background text-foreground">
      {/* ---------------- Hero Section ---------------- */}
      <section className="py-6 sm:py-8 lg:py-7 px-4 sm:px-6 lg:px-8 bg-primary/5 text-center">
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
              content: (
                <>
                  <p>
                    Hujme.com (operated by FIG Info LLP) values your privacy and
                    is committed to protecting your personal data.
                  </p>
                  <p>
                    By using our services, you agree to the collection and use
                    of information in accordance with this policy.
                  </p>
                </>
              ),
            },
            {
              icon: Database,
              title: "2. Information We Collect",
              content: (
                <>
                  <p>
                    We collect different types of personal information to
                    provide and improve our services, including:
                  </p>

                  <h3 className="font-semibold mt-4 mb-2">2.1 Personal Data</h3>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>Full name</li>
                    <li>Passport details</li>
                    <li>Contact information (email, phone number, address)</li>
                    <li>Date of birth</li>
                    <li>Payment details</li>
                    <li>Emergency contact information</li>
                  </ul>

                  <h3 className="font-semibold mt-4 mb-2">
                    2.2 Travel Information
                  </h3>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>Flight details</li>
                    <li>Hotel preferences</li>
                    <li>Visa details</li>
                  </ul>

                  <h3 className="font-semibold mt-4 mb-2">
                    2.3 Technical and Usage Data
                  </h3>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>IP address</li>
                    <li>Browser type and version</li>
                    <li>Device information</li>
                    <li>Pages visited and browsing behavior</li>
                    <li>Cookies and tracking technologies</li>
                  </ul>
                </>
              ),
            },
            {
              icon: Eye,
              title: "3. How We Use Your Information",
              content: (
                <>
                  <p>
                    We use the collected data for various purposes, including:
                  </p>
                  <ul className="list-disc ml-6 mt-3 space-y-1">
                    <li>Facilitating payment transactions</li>
                    <li>Providing customer support</li>
                    <li>Personalizing user experience</li>
                    <li>Complying with legal and regulatory requirements</li>
                    <li>Preventing fraud and enhancing security</li>
                    <li>
                      Marketing and promotional communication (only with user
                      consent)
                    </li>
                  </ul>
                </>
              ),
            },
            {
              icon: Share2,
              title: "4. Data Sharing and Disclosure",
              content: (
                <>
                  <p>
                    We do not sell your personal data. However, we may share
                    your information with:
                  </p>

                  <ul className="list-disc ml-6 mt-3 space-y-2">
                    <li>
                      <strong>Service Providers:</strong> Airlines, hotels,
                      Umrah operators, and visa processing agencies.
                    </li>
                    <li>
                      <strong>Payment Processors:</strong> To facilitate secure
                      transactions.
                    </li>
                    <li>
                      <strong>Legal Authorities:</strong> When required to
                      comply with legal obligations.
                    </li>
                    <li>
                      <strong>Business Transfers:</strong> In case of a merger,
                      sale, or acquisition.
                    </li>
                  </ul>
                </>
              ),
            },
            {
              icon: DatabaseIcon,
              title: "5. Data Security",
              content:
                "We implement industry-standard security measures to protect your personal data. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.",
            },
            {
              icon: UserCheck,
              title: "6. Your Rights",
              content: (
                <>
                  <p>
                    Depending on applicable laws, you may have the following
                    rights regarding your personal data:
                  </p>

                  <ul className="list-disc ml-6 mt-3 space-y-1">
                    <li>Right to access and obtain a copy of your data</li>
                    <li>
                      Right to request correction of inaccurate information
                    </li>
                    <li>Right to request deletion of your data</li>
                    <li>
                      Right to withdraw consent for marketing communications
                    </li>
                    <li>Right to restrict or object to data processing</li>
                  </ul>

                  <p className="mt-4">
                    To exercise these rights, please contact us at
                    contact@hujme.com.
                  </p>
                </>
              ),
            },
            {
              icon: Cookie,
              title: "7. Cookies & Tracking",
              content:
                "Our platform uses cookies and similar tracking technologies to enhance user experience. Users can control cookie preferences through their browser settings.",
            },
            {
              icon: Clock,
              title: "8. Data Of Retention",
              content:
                "We retain personal data only as long as necessary to fulfill the purposes outlined in this policy unless a longer retention period is required by law.",
            },
            {
              icon: ExternalLink,
              title: "9. Third-Party Links",
              content:
                "Our platform may contain links to third-party websites. We are not responsible for their privacy practices and encourage users to review their privacy policies.",
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
              content: (
                <>
                  <p>
                    For any questions or concerns regarding this Privacy Policy,
                    please contact us at:
                  </p>

                  <p className="mt-4 font-medium">
                    FIG Info LLP <br />
                    Email: contact@hujme.com
                  </p>
                </>
              ),
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

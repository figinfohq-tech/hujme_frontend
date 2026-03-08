import {
  ArrowLeft,
  Headphones,
  Mail,
  Clock,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CustomerSupport() {
  const navigate = useNavigate();

  return (
    <div className="bg-background text-foreground">
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

        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-primary">
            Customer Support
          </h1>
          <p className="text-muted-foreground mt-2">
            We're here to assist you with your Hajj & Umrah journey
          </p>
        </div>
      </section>
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <Card className="shadow-xl border rounded-2xl">
            <CardContent className="p-6 md:p-10 space-y-10 text-sm md:text-base leading-relaxed text-muted-foreground">
              {/* About Support */}
              <Section
                icon={<Headphones className="text-primary" />}
                title="1. Support Assistance"
              >
                <p>
                  hujme.com is committed to providing reliable and timely
                  assistance to all pilgrims using our platform.
                </p>
                <p>
                  As a technology intermediary, we facilitate communication
                  between Users and certified Hajj & Umrah Service Providers.
                </p>
              </Section>

              {/* Contact Methods */}
              <Section
                icon={<MessageCircle className="text-primary" />}
                title="2. How to Contact Us"
              >
                <p>You may contact our support team through:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Email support</li>
                  <li>Platform inquiry form</li>
                  <li>Official WhatsApp or helpline (if available)</li>
                </ul>
              </Section>

              {/* Email */}
              <Section
                icon={<Mail className="text-primary" />}
                title="3. Email Support"
              >
                <p>
                  For booking assistance, payment queries, or general
                  information, please email us at:
                </p>
                <p className="font-semibold text-foreground">
                  contact@hujme.com
                </p>
                <p>
                  Kindly include your booking reference number (if available)
                  for faster assistance.
                </p>
              </Section>

              {/* Response Time */}
              <Section
                icon={<Clock className="text-primary" />}
                title="4. Response Time"
              >
                <p>Our standard response time is within 24–48 working hours.</p>
                <p>
                  During peak Hajj and Umrah seasons, response times may be
                  slightly longer.
                </p>
              </Section>

              {/* Escalation */}
              <Section
                icon={<ShieldCheck className="text-primary" />}
                title="5. Escalation & Complaints"
              >
                <p>
                  If your issue relates to travel services such as flights,
                  hotels, visas, or transportation, you must first raise the
                  concern directly with your selected Service Provider.
                </p>
                <p>
                  If the issue remains unresolved, hujme.com will assist in
                  facilitating communication between you and the Provider.
                </p>
              </Section>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

function Section({ icon, title, children }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        {icon}
        <h2 className="text-base sm:text-lg font-semibold text-primary mb-2">
          {title}
        </h2>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

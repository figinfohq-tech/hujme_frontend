import {
  ArrowLeft,
  FileText,
  Shield,
  CreditCard,
  Plane,
  AlertTriangle,
  Users,
  Scale,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TermsConditions() {
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
            Terms & Conditions
          </h1>
          <p className="text-muted-foreground mt-2">Last Updated: 01-09-2025</p>
        </div>
      </section>
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <Card className="shadow-xl border rounded-2xl">
            <CardContent className="p-6 md:p-10 space-y-10 text-sm md:text-base leading-relaxed text-muted-foreground">
              {/* 1 PREFACE */}
              <Section
                icon={<FileText className="text-primary" />}
                title="1. PREFACE"
              >
                <p>
                  hujme.com, operated by FIG Info LLP, is a trusted online
                  technology platform that connects pilgrims with verified and
                  certified Hajj & Umrah travel agents across India.
                </p>

                <p>
                  Hujme does not directly operate Hajj or Umrah tours. Instead,
                  we act as a facilitator and marketplace where licensed travel
                  agents (“Certified Travel Agents” / “Service Providers”) list
                  their Hajj & Umrah packages.
                </p>

                <p>
                  All services including flights, visas, accommodation,
                  transportation, Ziyarah, and related arrangements are
                  operated, fulfilled, and invoiced solely by the respective
                  Certified Travel Agent selected by the pilgrim.
                </p>

                <p className="font-semibold">In these Terms:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>“Platform” refers to hujme.com</li>
                  <li>
                    “User” refers to the pilgrim or person making the booking
                  </li>
                  <li>
                    “Provider” refers to the certified Hajj & Umrah travel agent
                  </li>
                </ul>

                <p>
                  By booking or making any payment through hujme.com (online or
                  offline), you confirm that you have read, understood, and
                  agreed to these Terms & Conditions.
                </p>
              </Section>

              {/* 2 Role */}
              <Section
                icon={<Shield className="text-primary" />}
                title="2. Role of Hujme.com"
              >
                <p className="font-semibold">
                  2.1 Hujme.com acts only as a technology platform to:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Help pilgrims compare Hajj & Umrah packages</li>
                  <li>
                    Connect Users with certified travel agents across India
                  </li>
                  <li>Facilitate communication and booking processes</li>
                </ul>

                <p className="font-semibold mt-4">2.2 Hujme.com does not:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Operate flights, hotels, or transportation</li>
                  <li>Issue visas directly</li>
                  <li>Control airline schedules or hotel policies</li>
                  <li>Guarantee availability of third-party services</li>
                </ul>

                <p className="mt-4">
                  2.3 All travel services are provided under the terms and
                  conditions of the respective Certified Travel Agent, airline,
                  hotel, visa authority, or service provider.
                </p>
              </Section>

              {/* 3 Pricing */}
              <Section
                icon={<CreditCard className="text-primary" />}
                title="3. Package Pricing & Transparency"
              >
                <p>
                  3.1 All package details, inclusions, exclusions, and pricing
                  are provided by the respective Certified Travel Agent.
                </p>

                <p className="font-semibold mt-4">
                  3.2 Prices may change due to:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Airline fare revisions</li>
                  <li>Foreign exchange fluctuations</li>
                  <li>Government taxes or regulatory changes</li>
                  <li>Provider-imposed surcharges</li>
                </ul>

                <p className="font-semibold mt-4">
                  3.3 Hujme strives for 100% transparency by clearly displaying:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Package inclusions</li>
                  <li>Exclusions</li>
                  <li>Visa status</li>
                  <li>Flight inclusion details</li>
                  <li>Hotel category</li>
                  <li>Cancellation policies (as provided by the Provider)</li>
                </ul>

                <p className="mt-4">
                  3.4 Users must carefully review the final booking summary
                  before making payment.
                </p>
              </Section>

              {/* 4 Booking */}
              <Section
                icon={<Users className="text-primary" />}
                title="4. Booking & Payment"
              >
                <p>
                  4.1 All bookings are subject to confirmation by the selected
                  Certified Travel Agent.
                </p>
                <p>
                  4.2 Hujme may collect payments on behalf of the Provider or
                  redirect Users to the Provider’s official payment system.
                </p>
                <p>
                  4.3 Payment terms (deposit, balance payment, deadlines) are
                  governed by the selected Provider’s policy.
                </p>
                <p>
                  4.4 Failure to complete payment within the specified timeline
                  may result in automatic cancellation as per the Provider’s
                  terms.
                </p>
              </Section>

              {/* 5 Visa */}
              <Section
                icon={<Plane className="text-primary" />}
                title="5. Visa & Travel Documentation"
              >
                <p className="font-semibold">
                  5.1 It is the User’s responsibility to:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Hold a valid passport (minimum 6 months validity)</li>
                  <li>Submit correct personal details</li>
                  <li>Provide required visa documents on time</li>
                </ul>

                <p className="mt-4">
                  5.2 Visa approvals are solely at the discretion of Saudi
                  authorities.
                </p>

                <p className="font-semibold mt-4">
                  5.3 Hujme is not responsible for:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Visa rejection</li>
                  <li>Delays in visa processing</li>
                  <li>Errors in passport details submitted by the User</li>
                </ul>

                <p className="mt-4">
                  5.4 Any loss resulting from incorrect documentation will be
                  the User’s responsibility.
                </p>
              </Section>

              {/* 6 Amendments */}
              <Section
                icon={<AlertTriangle className="text-primary" />}
                title="6. Amendments & Cancellations"
              >
                <p>
                  6.1 Any amendment or cancellation request must be submitted in
                  writing.
                </p>
                <p>
                  6.2 Amendment and cancellation charges will be applied as per
                  the selected Provider’s policy.
                </p>
                <p>
                  6.3 Airline cancellation rules (including promotional fare
                  restrictions) will apply separately.
                </p>
                <p>
                  6.4 Hujme may charge a nominal platform service fee where
                  applicable.
                </p>
              </Section>

              {/* 7 Flights */}
              <Section
                icon={<Plane className="text-primary" />}
                title="7. Flights, Hotels & Third-Party Services"
              >
                <p>
                  7.1 Flight schedules, delays, and cancellations are controlled
                  by airlines.
                </p>
                <p>
                  7.2 Hotel descriptions, ratings, and images are provided by
                  the respective Provider or hotel.
                </p>

                <p className="font-semibold mt-4">
                  7.3 Hujme is not responsible for:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Airline delays or cancellations</li>
                  <li>Hotel overbooking</li>
                  <li>Room allocation issues</li>
                  <li>Service deficiencies by third-party vendors</li>
                </ul>

                <p className="mt-4">
                  7.4 Any complaints must first be raised directly with the
                  Provider during travel.
                </p>
              </Section>

              {/* 8 Force */}
              <Section
                icon={<AlertTriangle className="text-primary" />}
                title="8. Force Majeure"
              >
                <p>
                  Hujme shall not be liable for delays, cancellations, or
                  service disruptions caused by events beyond reasonable
                  control, including:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Natural disasters</li>
                  <li>Government restrictions</li>
                  <li>Pandemics</li>
                  <li>Political instability</li>
                  <li>Airline strikes</li>
                </ul>
                <p className="mt-4">
                  Refunds, if any, will follow the policies of the respective
                  Provider.
                </p>
              </Section>

              {/* 9 Liability */}
              <Section
                icon={<Scale className="text-primary" />}
                title="9. Limitation of Liability"
              >
                <p>9.1 Hujme acts only as an intermediary platform.</p>

                <p className="font-semibold mt-4">
                  9.2 Hujme shall not be liable for:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    Service failures by travel agents or third-party providers
                  </li>
                  <li>Loss of personal belongings</li>
                  <li>Injury, illness, or accidents during travel</li>
                  <li>Visa rejection or deportation</li>
                  <li>
                    Financial losses due to incorrect information provided by
                    the User
                  </li>
                </ul>

                <p className="mt-4">
                  9.3 In any case, Hujme’s total liability shall not exceed the
                  platform service fee collected for the booking.
                </p>
              </Section>

              {/* 10 Conduct */}
              <Section
                icon={<Users className="text-primary" />}
                title="10. User Conduct"
              >
                <p className="font-semibold">Users must:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Follow Saudi Arabian laws and Umrah regulations</li>
                  <li>Maintain respectful conduct in Makkah and Madinah</li>
                  <li>Comply with group leaders and Provider instructions</li>
                </ul>

                <p className="font-semibold mt-4">
                  Hujme reserves the right to suspend or block Users who:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Provide false information</li>
                  <li>Engage in misconduct</li>
                  <li>Violate booking terms</li>
                </ul>
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

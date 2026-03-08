import { ArrowLeft, RefreshCcw, FileText, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CancellationRefundPolicy() {
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
            Cancellation & Refund Policy
          </h1>
          <p className="text-muted-foreground mt-2">Last Updated: 01-09-2025</p>
        </div>
      </section>
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <Card className="shadow-xl border rounded-2xl">
            <CardContent className="p-6 md:p-10 space-y-10 text-sm md:text-base leading-relaxed text-muted-foreground">
              {/* Section 1 */}
              <Section
                icon={<FileText className="text-primary" />}
                title="1. Introduction"
              >
                <p>
                  This Cancellation & Refund Policy applies to all bookings made
                  through hujme.com (“Platform”).
                </p>

                <p>
                  Hujme.com acts as a technology platform connecting pilgrims
                  with certified Hajj & Umrah travel agents (“Service
                  Providers”). All travel services including flights, visas,
                  hotels, and transportation are operated by the selected
                  Service Provider.
                </p>

                <p>
                  Cancellation and refund terms are primarily governed by the
                  respective Service Provider’s policy, airline rules, hotel
                  policies, and visa regulations.
                </p>
              </Section>

              {/* Important Notice */}
              <Section
                icon={<AlertTriangle className="text-primary" />}
                title="Important Notice"
              >
                <p>
                  Users are strongly advised to carefully review the
                  cancellation and refund terms of the selected Service Provider
                  before confirming any booking.
                </p>
              </Section>

              {/* Refund Processing */}
              <Section
                icon={<RefreshCcw className="text-primary" />}
                title="Refund Processing"
              >
                <p>
                  Any eligible refund will be processed strictly as per the
                  Service Provider’s policy and applicable airline or hotel
                  regulations.
                </p>

                <p>
                  Refund timelines may vary depending on the payment method,
                  airline processing time, and banking procedures.
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

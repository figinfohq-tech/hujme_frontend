import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Target,
  Heart,
  Sparkles,
  Users,
  BadgeCheck,
  ArrowLeft,
  Gem,
} from "lucide-react";
import { useNavigate } from "react-router";

const AboutUs = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-background text-foreground">
      {/* ---------------- Hero Section ---------------- */}
      <section className="py-6 sm:py-8 lg:py-7 px-4 sm:px-6 lg:px-8 text-center bg-primary/5">
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
            About Us
          </h1>
          <p className="text-sm sm:text-base text-start lg:text-lg text-muted-foreground leading-relaxed">
            Your trusted platform for finding the best Hajj & Umrah travel
            packages. Connecting pilgrims with certified travel agents across
            India.
          </p>
        </div>
      </section>

      {/* ---------------- Main Content ---------------- */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Introduction */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <p className="text-sm text-start sm:text-base text-muted-foreground leading-relaxed">
              We bring together trusted agents who showcase their packages
              through our platform, allowing pilgrims to make informed decisions
              with complete transparency. By blending technology with
              compassion, we aim to deliver a smooth, reliable, and stress-free
              Hajj and Umrah experience — from planning to completion.
            </p>
            <p className="text-sm text-start sm:text-base font-medium text-primary">
              With 100% transparency, we ensure clarity, trust, and confidence
              at every step of your journey.
            </p>
          </div>

          {/* ---------------- Mission ---------------- */}
          <div className="bg-card border rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex text-center justify-center items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-primary">
                Our Mission
              </h2>
            </div>

            <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
              To eliminate the challenges pilgrims face when selecting authentic
              travel agents by providing a platform to verify, compare multiple
              packages, and book their spiritual journey with ease and
              confidence.
            </p>
          </div>

          {/* ---------------- Values ---------------- */}
          <div>
            <div className="flex text-center my-4 justify-center items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <Gem className="w-6 h-6" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-primary">
                Our Values
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Integrity */}
              <div className="bg-card border rounded-2xl p-6 shadow-sm text-center space-y-3">
                <div className="mx-auto w-fit p-3 rounded-xl bg-primary/10 text-primary">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-base">Integrity</h3>
                <p className="text-sm text-muted-foreground">
                  We believe in transparent, honest, and ethical service.
                </p>
              </div>

              {/* Excellence */}
              <div className="bg-card border rounded-2xl p-6 shadow-sm text-center space-y-3">
                <div className="mx-auto w-fit p-3 rounded-xl bg-primary/10 text-primary">
                  <BadgeCheck className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-base">Excellence</h3>
                <p className="text-sm text-muted-foreground">
                  We strive to bring all travel agents onto one unified
                  platform, making it easier for pilgrims to compare options and
                  book confidently.
                </p>
              </div>

              {/* Compassion */}
              <div className="bg-card border rounded-2xl p-6 shadow-sm text-center space-y-3">
                <div className="mx-auto w-fit p-3 rounded-xl bg-primary/10 text-primary">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-base">Compassion</h3>
                <p className="text-sm text-muted-foreground">
                  We understand the spiritual importance of your journey and the
                  unique needs of every traveler.
                </p>
              </div>

              {/* Innovation */}
              <div className="bg-card border rounded-2xl p-6 shadow-sm text-center space-y-3">
                <div className="mx-auto w-fit p-3 rounded-xl bg-primary/10 text-primary">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-base">Innovation</h3>
                <p className="text-sm text-muted-foreground">
                  We leverage technology to simplify and enhance the pilgrimage
                  experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;

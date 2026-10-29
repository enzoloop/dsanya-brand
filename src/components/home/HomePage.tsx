import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  Check,
  ChevronDown,
  ClipboardCheck,
  FileText,
  Menu,
  MessageCircle,
  PanelsTopLeft,
  PartyPopper,
  Printer,
  ScanEye,
  Signpost,
  SlidersHorizontal,
  Sparkles,
  X,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { inquirySchema, buildInquiryMessage, type InquiryValues } from "@/lib/inquiry-schema";
import {
  benefits,
  clientSlots,
  company,
  faqs,
  logo,
  projects,
  reviewSlots,
  serviceChoices,
  services,
  steps,
} from "@/lib/site-content";

const iconMap: Record<string, LucideIcon> = {
  Printer,
  Signpost,
  PanelsTopLeft,
  ScanEye,
  SlidersHorizontal,
  ClipboardCheck,
  BadgeCheck,
  PartyPopper,
};

const navigation = [
  ["Home", "home"],
  ["About Us", "about"],
  ["Services", "services"],
  ["Our Projects", "projects"],
  ["Our Clients", "clients"],
  ["Reviews", "reviews"],
  ["Contact", "contact"],
] as const;

const heroImage = projects[0]?.image ?? logo;
const benefitImage = projects[4]?.image ?? logo;
const bannerImage = projects[2]?.image ?? logo;

const projectCategories = ["All Work", ...new Set(projects.map((project) => project.category))];

function SectionHeading({
  eyebrow,
  title,
  copy,
  center = false,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <div className={`mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary ${center ? "justify-center" : ""}`}>
        <span className="h-px w-7 bg-primary" />
        {eyebrow}
      </div>
      <h2 className="text-3xl font-bold leading-tight text-ink sm:text-4xl">{title}</h2>
      {copy ? <p className="mt-4 text-base leading-7 text-copy">{copy}</p> : null}
    </div>
  );
}

function BrandMark({ inverted = false }: { inverted?: boolean }) {
  return (
    <a href="#home" className="flex min-w-0 items-center gap-3" aria-label="Dsanya Print and Sign home">
      <img src={logo} alt="" className="h-12 w-12 shrink-0 object-contain" />
      <span className={`min-w-0 text-[15px] font-extrabold leading-[1.05] text-ink ${inverted ? "text-primary-foreground" : ""}`}>
        DSANYA
        <span className={`mt-1 block text-[9px] font-semibold uppercase tracking-[0.13em] ${inverted ? "text-primary-foreground/70" : "text-copy"}`}>
          Print &amp; Signs
        </span>
      </span>
    </a>
  );
}

function ArrowLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="group inline-flex items-center gap-2 text-sm font-bold text-primary">
      {children}
      <ArrowUpRight aria-hidden="true" size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  );
}

function EnquiryForm({ compact = false }: { compact?: boolean }) {
  const [values, setValues] = useState<InquiryValues>({
    name: "",
    companyName: "",
    phone: "",
    email: "",
    service: "",
    dimensions: "",
    details: "",
    date: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof InquiryValues, string>>>({});
  const [status, setStatus] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  function change(field: keyof InquiryValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
    setStatus("");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = inquirySchema.safeParse(values);
    if (!result.success) {
      const nextErrors: Partial<Record<keyof InquiryValues, string>> = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0] ?? "form") as keyof InquiryValues;
        if (!nextErrors[key]) nextErrors[key] = issue.message;
      }
      setErrors(nextErrors);
      setStatus("Please check the highlighted fields.");
      const firstInvalid = formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']");
      firstInvalid?.focus();
      return;
    }
    setErrors({});
    if (company.whatsappNumber.trim()) {
      const phoneNumber = company.whatsappNumber.replace(/[^0-9]/g, "");
      if (phoneNumber.length < 7 || phoneNumber.length > 15) {
        setStatus("The configured WhatsApp number appears incomplete. Please contact Dsanya directly to confirm the correct number.");
        return;
      }
      const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(buildInquiryMessage(result.data))}`;
      window.open(url, "_blank", "noopener,noreferrer");
      setStatus("Your enquiry is ready in WhatsApp. Review it there and press send to submit.");
      return;
    }
    setStatus("This enquiry has not been sent or stored. Add Dsanya’s verified WhatsApp number in the editable contact settings, or connect a real form service, before accepting submissions.");
  }

  function fieldError(name: keyof InquiryValues) {
    return errors[name] ? <span id={`${name}-error`} className="mt-1.5 block text-xs font-medium text-destructive">{errors[name]}</span> : null;
  }

  const commonField = "h-12 rounded-md border-border bg-background text-sm shadow-none";

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="space-y-4">
      {!compact && (
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-ink" htmlFor="full-name">
            Full name <span className="text-destructive">*</span>
            <Input id="full-name" autoComplete="name" name="name" required maxLength={100} value={values.name} onChange={(event) => change("name", event.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} className={`mt-2 ${commonField}`} placeholder="Your name" />
            {fieldError("name")}
          </label>
          <label className="text-sm font-semibold text-ink" htmlFor="company-name">
            Company <span className="font-normal text-copy">(optional)</span>
            <Input id="company-name" autoComplete="organization" name="companyName" maxLength={120} value={values.companyName} onChange={(event) => change("companyName", event.target.value)} aria-invalid={Boolean(errors.companyName)} aria-describedby={errors.companyName ? "companyName-error" : undefined} className={`mt-2 ${commonField}`} placeholder="Business name" />
            {fieldError("companyName")}
          </label>
          <label className="text-sm font-semibold text-ink" htmlFor="phone-number">
            Phone number <span className="text-destructive">*</span>
            <Input id="phone-number" autoComplete="tel" name="phone" type="tel" inputMode="tel" maxLength={30} required value={values.phone} onChange={(event) => change("phone", event.target.value)} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "phone-error" : undefined} className={`mt-2 ${commonField}`} placeholder="Your contact number" />
            {fieldError("phone")}
          </label>
          <label className="text-sm font-semibold text-ink" htmlFor="email-address">
            Email <span className="font-normal text-copy">(optional)</span>
            <Input id="email-address" autoComplete="email" name="email" type="email" maxLength={254} value={values.email} onChange={(event) => change("email", event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} className={`mt-2 ${commonField}`} placeholder="you@company.com" />
            {fieldError("email")}
          </label>
        </div>
      )}

      <div className={compact ? "space-y-4" : "grid gap-4 sm:grid-cols-2"}>
        <label className="text-sm font-semibold text-ink" htmlFor={compact ? "quick-service" : "full-service"}>
          Service required <span className="text-destructive">*</span>
          <span className="relative mt-2 block">
            <select id={compact ? "quick-service" : "full-service"} name="service" required value={values.service} onChange={(event) => change("service", event.target.value)} aria-invalid={Boolean(errors.service)} aria-describedby={errors.service ? "service-error" : undefined} className={`h-12 w-full appearance-none rounded-md border border-border bg-background px-3 pr-10 text-sm font-normal text-ink outline-none focus-visible:ring-2 focus-visible:ring-ring ${errors.service ? "border-destructive" : ""}`}>
              <option value="">Choose a service</option>
              {serviceChoices.map((service) => <option key={service} value={service}>{service}</option>)}
            </select>
            <ChevronDown aria-hidden="true" size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-copy" />
          </span>
          {fieldError("service")}
        </label>
        {!compact && (
          <label className="text-sm font-semibold text-ink" htmlFor="preferred-date">
            Preferred completion date <span className="font-normal text-copy">(optional)</span>
            <span className="relative mt-2 block">
              <Input id="preferred-date" name="date" type="date" value={values.date} onChange={(event) => change("date", event.target.value)} className={commonField} />
              <CalendarDays aria-hidden="true" size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-copy" />
            </span>
          </label>
        )}
        <label className="text-sm font-semibold text-ink" htmlFor={compact ? "quick-dimensions" : "full-dimensions"}>
          Quantity or dimensions <span className="text-destructive">*</span>
          <Input id={compact ? "quick-dimensions" : "full-dimensions"} name="dimensions" required maxLength={200} value={values.dimensions} onChange={(event) => change("dimensions", event.target.value)} aria-invalid={Boolean(errors.dimensions)} aria-describedby={errors.dimensions ? "dimensions-error" : undefined} className={`mt-2 ${commonField}`} placeholder="e.g. 2 signs, 120 × 60 cm" />
          {fieldError("dimensions")}
        </label>
      </div>

      <label className="block text-sm font-semibold text-ink" htmlFor={compact ? "quick-details" : "full-details"}>
        Project details <span className="text-destructive">*</span>
        <Textarea id={compact ? "quick-details" : "full-details"} name="details" required minLength={10} maxLength={2000} rows={compact ? 3 : 4} value={values.details} onChange={(event) => change("details", event.target.value)} aria-invalid={Boolean(errors.details)} aria-describedby={errors.details ? "details-error" : undefined} className="mt-2 min-h-24 resize-y rounded-md border-border bg-background text-sm shadow-none" placeholder="Tell us about your project, design, materials, or artwork." />
        {fieldError("details")}
      </label>

      {!compact && (
        <label className="block text-sm font-semibold text-ink" htmlFor="reference-file">
          Artwork or reference <span className="font-normal text-copy">(optional; attach later in WhatsApp)</span>
          <Input id="reference-file" type="file" accept="image/*,.pdf,.ai,.eps,.psd" className="mt-2 h-auto min-h-12 rounded-md border-border bg-background p-2.5 text-sm file:mr-3 file:rounded file:border-0 file:bg-secondary file:px-3 file:py-1 file:font-semibold file:text-secondary-foreground" />
        </label>
      )}

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <Button type="submit" size="lg" className="h-12 rounded-md px-6 font-semibold">
          {compact ? "Request a Quote" : "Submit Enquiry"}
          <ArrowRight aria-hidden="true" size={16} />
        </Button>
        {!compact && company.whatsappNumber ? (
          <Button type="button" variant="outline" size="lg" className="h-12 rounded-md px-6" onClick={() => formRef.current?.requestSubmit()}>
            <MessageCircle aria-hidden="true" size={16} /> Continue on WhatsApp
          </Button>
        ) : null}
      </div>

      <p role="status" aria-live="polite" className={`text-sm leading-6 ${status && (status.startsWith("Please") || status.startsWith("This") || status.startsWith("The")) ? "text-destructive" : "text-copy"}`}>
        {status || "Your details are not stored or sent from this preview."}
      </p>
    </form>
  );
}

export default function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [projectFilter, setProjectFilter] = useState("All Work");
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[number] | null>(null);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [legalView, setLegalView] = useState<"privacy" | "terms" | null>(null);
  const [quickQuoteOpen, setQuickQuoteOpen] = useState(false);
  const [newsletterNote, setNewsletterNote] = useState("");

  const filteredProjects = useMemo(
    () => projectFilter === "All Work" ? projects : projects.filter((project) => project.category === projectFilter),
    [projectFilter],
  );

  useEffect(() => {
    const sections = navigation.map(([, id]) => document.getElementById(id)).filter((section): section is HTMLElement => Boolean(section));
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.id) setActiveSection(visible.target.id);
    }, { rootMargin: "-18% 0px -68% 0px", threshold: [0, 0.1, 0.35, 0.6] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (quickQuoteOpen || selectedProject || legalView) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
    document.body.style.overflow = "";
    return undefined;
  }, [quickQuoteOpen, selectedProject, legalView]);

  const whatsappHref = company.whatsappNumber.trim()
    ? `https://wa.me/${company.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Hello Dsanya Print and Sign Nig. Ltd, I would like to discuss a project.")}`
    : undefined;

  function goTo(id: string) {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function changeReview(direction: number) {
    setReviewIndex((current) => (current + direction + reviewSlots.length) % reviewSlots.length);
  }

  const reviewClasses = (index: number) => {
    if (index === reviewIndex) return "is-active";
    if (index === (reviewIndex + 1) % reviewSlots.length) return "is-next";
    if (index === (reviewIndex + 2) % reviewSlots.length) return "is-next-next";
    return "";
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur-xl">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:flex sm:justify-between sm:px-6 lg:px-8">
          <BrandMark />
          <nav aria-label="Main navigation" className="hidden items-center gap-5 lg:flex">
            {navigation.map(([label, id]) => (
              <a key={id} href={`#${id}`} aria-current={activeSection === id ? "location" : undefined} className={`relative whitespace-nowrap py-2 text-[13px] font-medium transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:bg-primary after:transition-transform hover:text-primary hover:after:scale-x-100 ${activeSection === id ? "text-primary after:scale-x-100" : "text-copy"}`}>
                {label}
              </a>
            ))}
          </nav>
          <div className="hidden items-center gap-3 sm:flex">
            {company.phone ? <a href={`tel:${company.phone}`} aria-label="Call Dsanya" className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-primary transition-colors hover:bg-brand hover:text-brand-foreground"><MessageCircle size={17} aria-hidden="true" /></a> : null}
            <Button asChild size="sm" className="h-10 rounded-md px-5">
              <a href="#quote">Get a Quote <ArrowUpRight size={15} aria-hidden="true" /></a>
            </Button>
          </div>
          <Button type="button" variant="outline" size="icon" aria-label={mobileOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileOpen} aria-controls="mobile-navigation" onClick={() => setMobileOpen((open) => !open)} className="h-10 w-10 rounded-md sm:hidden">
            {mobileOpen ? <X size={19} /> : <Menu size={19} />}
          </Button>
        </div>
        {mobileOpen && (
          <nav id="mobile-navigation" aria-label="Mobile navigation" className="border-t border-border bg-background px-4 py-3 sm:hidden">
            {navigation.map(([label, id]) => (
              <a key={id} href={`#${id}`} aria-current={activeSection === id ? "location" : undefined} onClick={() => setMobileOpen(false)} className={`flex min-h-11 items-center justify-between border-b border-border/70 py-2 text-sm font-semibold last:border-0 ${activeSection === id ? "text-primary" : "text-ink"}`}>
                {label}{activeSection === id ? <span className="h-1.5 w-1.5 rounded-full bg-primary" /> : null}
              </a>
            ))}
            <Button asChild className="mt-3 h-11 w-full rounded-md"><a href="#quote" onClick={() => setMobileOpen(false)}>Get a Quote <ArrowUpRight size={16} /></a></Button>
          </nav>
        )}
      </header>

      <main>
        <section id="home" className="hero-wash scroll-mt-20 overflow-hidden">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-16 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12 lg:px-8 lg:pb-24 lg:pt-16">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-background/75 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.17em] text-primary sm:text-xs">
                <Sparkles size={14} aria-hidden="true" /> Printing <span className="text-primary/40">•</span> Signage <span className="text-primary/40">•</span> Branding
              </div>
              <h1 className="mt-6 max-w-xl text-4xl font-extrabold leading-[1.05] text-ink sm:text-5xl lg:text-[3.65rem]">
                Bring Your Brand <span className="text-primary">to Life.</span>
              </h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-copy sm:text-lg sm:leading-8">
                From professional printing to eye-catching signage and creative branding, Dsanya Print and Sign Nig. Ltd helps businesses make a lasting impression.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild size="lg" className="h-12 rounded-md px-6 font-semibold">
                  <a href="#quote">Get a Free Quote <ArrowRight size={16} aria-hidden="true" /></a>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 rounded-md border-border bg-background/70 px-6 font-semibold">
                  <a href="#projects">Explore Our Projects <ArrowDownRight size={16} aria-hidden="true" /></a>
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-copy">
                {["Professional Service", "Quality Finishing", "Custom Solutions"].map((item) => <span key={item} className="inline-flex items-center gap-1.5"><Check size={14} className="text-primary" />{item}</span>)}
              </div>
              <div className="mt-10 flex items-center gap-3 border-t border-border/80 pt-5">
                <img src={logo} alt="" className="h-10 w-10 object-contain" />
                <p className="text-xs leading-5 text-copy"><span className="block font-bold text-ink">Dsanya Print and Sign Nig. Ltd</span>{company.registration}</p>
                <a href="#about" className="ml-auto grid h-10 w-10 place-items-center rounded-full border border-border bg-background text-primary transition-colors hover:bg-secondary" aria-label="Discover Dsanya">
                  <ArrowDown size={17} />
                </a>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[610px] lg:ml-auto">
              <div className="absolute -right-5 top-9 hidden h-28 w-28 rounded-full border border-primary/15 sm:block" />
              <div className="relative overflow-hidden rounded-md bg-secondary shadow-[0_32px_70px_-36px_var(--color-ink)]">
                <img src={heroImage} alt="Illuminated branded signage installed on a business wall" fetchPriority="high" className="h-[420px] w-full object-cover sm:h-[510px] lg:h-[548px]" />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/55 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3 text-primary-foreground">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-foreground/75">Crafted to be seen</p>
                    <p className="mt-1 text-lg font-semibold">Signage with a presence.</p>
                  </div>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-primary-foreground/40 bg-primary-foreground/15 backdrop-blur"><ArrowUpRight size={18} /></span>
                </div>
              </div>
              <div className="absolute -bottom-5 left-4 right-4 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-md border border-border/70 bg-background px-3 py-3 card-shadow sm:left-8 sm:right-8 sm:px-5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-secondary text-primary"><BadgeCheck size={20} /></span>
                <span className="min-w-0"><strong className="block truncate text-xs text-ink sm:text-sm">Made for your business</strong><span className="mt-0.5 block truncate text-[10px] text-copy sm:text-xs">Thoughtful print, signage and brand details</span></span>
                <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">DSANYA</span>
              </div>
            </div>
          </div>
        </section>

        <section id="quote" aria-label="Quick quote request" className="relative z-10 -mt-1 bg-paper px-4 pb-12 pt-14 sm:px-6 sm:pt-16 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-md border border-border/80 bg-background p-5 card-shadow sm:p-7 lg:p-8">
            <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-start lg:gap-10">
              <div className="max-w-sm">
                <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary"><FileText size={15} /> Project enquiry</div>
                <h2 className="text-2xl font-bold text-ink sm:text-3xl">Let’s talk about your project.</h2>
                <p className="mt-3 text-sm leading-6 text-copy">Tell us what you have in mind and the details we need to prepare a quotation.</p>
                <p className="mt-4 text-xs leading-5 text-copy">Your request is not sent or stored from this preview unless a verified contact method is configured.</p>
              </div>
              <EnquiryForm compact />
            </div>
          </div>
        </section>

        <section id="about" className="scroll-mt-20 bg-paper px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Quality Craftsmanship", text: "Careful attention to detail.", icon: BadgeCheck },
              { title: "Professional Service", text: "Clear communication throughout your project.", icon: MessageCircle },
              { title: "Custom Branding", text: "Solutions tailored to your business.", icon: PanelsTopLeft },
              { title: "Reliable Delivery", text: "Timelines agreed before production.", icon: CalendarDays },
            ].map(({ title, text, icon: Icon }) => (
              <div key={title} className="grid grid-cols-[48px_minmax(0,1fr)] items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-secondary text-primary"><Icon size={21} aria-hidden="true" /></span>
                <div className="min-w-0"><h3 className="text-sm font-bold text-ink">{title}</h3><p className="mt-1 text-xs leading-5 text-copy">{text}</p></div>
              </div>
            ))}
          </div>
        </section>

        <section id="services" className="scroll-mt-20 bg-background px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <SectionHeading eyebrow="What we do" title="Everything Your Brand Needs" copy="Professional printing, signage, and branding solutions designed to help your business stand out." />
              <a href="#quote" className="mb-1 inline-flex items-center gap-2 self-start text-sm font-bold text-primary sm:self-auto">Discuss a project <ArrowUpRight size={16} /></a>
            </div>
            <div className="mt-9 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => {
                const Icon = iconMap[service.icon] ?? Printer;
                return (
                  <article key={service.name} className="group overflow-hidden rounded-md border border-border/80 bg-background transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
                    <a href="#quote" aria-label={`Request a quote for ${service.name}`} onClick={() => setQuickQuoteOpen(true)} className="relative block aspect-[1.58] overflow-hidden bg-secondary">
                      <img src={service.image} alt={`${service.name} example supplied by Dsanya`} loading="lazy" className="image-zoom h-full w-full object-cover" />
                      <span className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-md bg-background/95 text-primary shadow-sm"><Icon size={19} aria-hidden="true" /></span>
                      <span className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-background text-primary opacity-0 shadow-sm transition-opacity group-hover:opacity-100"><ArrowUpRight size={16} /></span>
                    </a>
                    <div className="p-5">
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary">0{index + 1} / Service</p>
                      <h3 className="mt-2 text-lg font-bold text-ink">{service.name}</h3>
                      <p className="mt-2 min-h-[48px] text-sm leading-6 text-copy">{service.description}</p>
                      <ArrowLink href="#quote">Learn More</ArrowLink>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="projects" className="scroll-mt-20 bg-paper px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <SectionHeading eyebrow="Selected work" title="Our Work Speaks for Itself" copy="Explore printing, signage, and branding examples supplied for the Dsanya portfolio." />
              <div className="flex max-w-full gap-2 overflow-x-auto pb-1" aria-label="Filter projects by category">
                {projectCategories.map((category) => (
                  <Button key={category} type="button" variant={projectFilter === category ? "default" : "outline"} size="sm" aria-pressed={projectFilter === category} onClick={() => setProjectFilter(category)} className="h-9 shrink-0 rounded-md px-3 text-xs">
                    {category}
                  </Button>
                ))}
              </div>
            </div>
            <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project, index) => (
                <article key={project.title} className={`group relative isolate min-h-[300px] overflow-hidden rounded-md bg-secondary ${index === 0 && projectFilter === "All Work" ? "sm:row-span-2 sm:min-h-[620px]" : ""}`}>
                  <button type="button" onClick={() => setSelectedProject(project)} aria-label={`View project: ${project.title}`} className="absolute inset-0 z-10 h-full w-full cursor-pointer text-left">
                    <img src={project.image} alt={project.alt} loading="lazy" className="image-zoom absolute inset-0 h-full w-full object-cover" />
                    <span className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/5 to-ink/0 transition-opacity group-hover:from-ink/90" />
                    <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-primary">{project.category}</span>
                    <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 text-primary-foreground sm:p-6">
                      <span className="min-w-0"><strong className="block text-lg font-bold sm:text-xl">{project.title}</strong><span className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold">View Project <ArrowUpRight size={14} /></span></span>
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-primary-foreground/40 bg-primary-foreground/10"><ArrowUpRight size={18} /></span>
                    </span>
                  </button>
                </article>
              ))}
            </div>
            <div className="mt-8 flex justify-center"><Button asChild variant="outline" size="lg" className="h-12 rounded-md px-6"><a href="#projects">View All Projects <ArrowRight size={16} /></a></Button></div>
          </div>
        </section>

        <section id="clients" className="scroll-mt-20 bg-background px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
              <SectionHeading eyebrow="Partnerships" title="Trusted by Businesses and Organisations" />
              <div className="max-w-2xl lg:pb-1"><p className="text-base leading-7 text-copy">We are committed to helping businesses communicate their brands through professional printing, signage, and branding solutions.</p><p className="mt-3 text-xs leading-5 text-copy">Client names and logos are not shown until genuine partner materials are supplied.</p></div>
            </div>
            <div className="mt-9 grid grid-cols-2 border-l border-t border-border sm:grid-cols-3 lg:grid-cols-5">
              {clientSlots.map((client) => <div key={client} className="flex min-h-24 items-center justify-center border-b border-r border-border px-3 py-5 text-center transition-colors hover:bg-paper"><span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-copy/65 sm:text-xs"><span className="grid h-7 w-7 place-items-center rounded-full bg-secondary text-primary"><PanelsTopLeft size={13} /></span>{client}</span></div>)}
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
              <p className="text-xs leading-5 text-copy">Editable logo placeholders · Replace with approved client identities</p>
              <ArrowLink href="#clients">Our Clients portfolio <ArrowUpRight size={16} /></ArrowLink>
            </div>
          </div>
        </section>

        <section id="reviews" className="scroll-mt-20 overflow-hidden bg-ice px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <SectionHeading eyebrow="Kind words" title="What Our Clients Say" copy="We look forward to sharing verified feedback from Dsanya customers." />
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <Button type="button" variant="outline" size="icon" aria-label="Previous review" onClick={() => changeReview(-1)} className="h-10 w-10 rounded-full bg-background"><ArrowLeft size={17} /></Button>
                <Button type="button" variant="outline" size="icon" aria-label="Next review" onClick={() => changeReview(1)} className="h-10 w-10 rounded-full bg-background"><ArrowRight size={17} /></Button>
              </div>
            </div>
            <div className="review-grid mt-9 grid gap-4 md:grid-cols-3">
              {reviewSlots.map(({ id }, index) => (
                <article key={id} className={`review-slide rounded-md border border-border/80 bg-background p-5 card-shadow sm:p-6 ${reviewClasses(index)}`}>
                  <div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Customer review</span><span aria-label="Rating not yet supplied" className="text-lg leading-none text-primary/35">☆☆☆☆☆</span></div>
                  <div className="mt-7 min-h-[115px]"><span className="mb-2 block text-3xl font-bold text-primary/30">“</span><p className="text-sm leading-6 text-copy">Editable review placeholder. Replace this with an approved customer comment before publishing as a testimonial.</p></div>
                  <div className="mt-5 border-t border-border pt-4"><p className="text-sm font-bold text-ink">Verified customer name not yet supplied</p><p className="mt-1 text-xs text-copy">Company and source pending confirmation</p></div>
                </article>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between gap-4">
              <div className="flex gap-2" aria-label="Choose review slide">
                {reviewSlots.map((slot, index) => <button key={slot.id} type="button" aria-label={`Show review ${index + 1}`} aria-current={reviewIndex === index ? "true" : undefined} onClick={() => setReviewIndex(index)} className={`h-2.5 rounded-full transition-all ${reviewIndex === index ? "w-7 bg-primary" : "w-2.5 bg-primary/25"}`} />)}
              </div>
              <Button asChild variant="outline" size="sm" className="h-10 rounded-md bg-background px-4"><a href="#contact">Read More Reviews <ArrowRight size={15} /></a></Button>
            </div>
          </div>
        </section>

        <section className="bg-background px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto grid max-w-7xl items-center gap-9 lg:grid-cols-2 lg:gap-14">
            <div className="order-2 lg:order-1">
              <SectionHeading eyebrow="The Dsanya difference" title="Your Vision. Our Craftsmanship." copy="We combine creative thinking, careful production, and professional finishing to help businesses present their brands with confidence." />
              <div className="mt-8 grid gap-x-6 gap-y-6 sm:grid-cols-2">
                {benefits.map(({ title, description, icon }) => {
                  const Icon = iconMap[icon] ?? BadgeCheck;
                  return <div key={title} className="grid grid-cols-[42px_minmax(0,1fr)] gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-primary"><Icon size={18} /></span><div><h3 className="text-sm font-bold text-ink">{title}</h3><p className="mt-1 text-xs leading-5 text-copy">{description}</p></div></div>;
                })}
              </div>
              <Button asChild size="lg" className="mt-8 h-12 rounded-md px-6"><a href="#contact">Discuss Your Project <ArrowRight size={16} /></a></Button>
            </div>
            <div className="relative order-1 lg:order-2">
              <div className="absolute -left-4 -top-4 h-24 w-24 rounded-md bg-secondary" />
              <img src={benefitImage} alt="Signage installation in progress at a branded commercial storefront" loading="lazy" className="relative aspect-[1.08] w-full rounded-md object-cover shadow-xl sm:aspect-[1.28]" />
              <div className="absolute -bottom-4 right-4 max-w-[230px] rounded-md border border-border bg-background px-4 py-3 card-shadow sm:right-6 sm:px-5"><p className="text-sm font-bold text-ink">Made with purpose.</p><p className="mt-1 text-xs leading-5 text-copy">A considered finish for the way your brand shows up.</p></div>
            </div>
          </div>
        </section>

        <section className="bg-paper px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <SectionHeading eyebrow="A clear process" title="From First Brief to Finished Work" copy="A straightforward conversation, a clear quotation, and a plan for the work ahead." center />
            <ol className="relative mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
              {steps.map((step, index) => <li key={step.title} className="relative flex gap-4 lg:flex-col lg:gap-5"><span className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full border border-primary/20 bg-background text-primary"><span className="text-sm font-bold">0{index + 1}</span></span><div><h3 className="text-base font-bold text-ink">{step.title}</h3><p className="mt-2 text-sm leading-6 text-copy">{step.text}</p></div>{index < steps.length - 1 ? <span aria-hidden="true" className="absolute left-6 top-12 h-[calc(100%+1rem)] w-px bg-border sm:hidden" /> : null}{index < steps.length - 1 ? <span aria-hidden="true" className="absolute left-12 top-6 hidden h-px w-[calc(100%-2rem)] bg-border lg:block" /> : null}</li>)}
            </ol>
          </div>
        </section>

        <section className="relative isolate overflow-hidden bg-ink">
          <img src={bannerImage} alt="Dimensional sign letters prepared for a commercial installation" loading="lazy" className="absolute inset-0 -z-20 h-full w-full object-cover" />
          <div className="banner-wash absolute inset-0 -z-10" />
          <div className="mx-auto grid max-w-7xl gap-7 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8 lg:py-20">
            <div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.19em] text-primary-foreground/75">Make your next impression count</p><h2 className="mt-3 text-3xl font-bold leading-tight text-primary-foreground sm:text-4xl">Ready to Make Your Brand Stand Out?</h2><p className="mt-4 max-w-xl text-sm leading-6 text-primary-foreground/80 sm:text-base">Let's turn your ideas into professional printing, signage, and branding solutions that make a lasting impression.</p></div>
            <div className="flex flex-wrap gap-3"><Button asChild size="lg" className="h-12 rounded-md bg-background px-5 text-ink shadow-sm hover:bg-primary-foreground/90"><a href="#contact">Get a Quote <ArrowRight size={16} /></a></Button>{whatsappHref ? <Button asChild size="lg" variant="outline" className="h-12 rounded-md border-primary-foreground/40 bg-primary-foreground/10 px-5 text-primary-foreground hover:bg-primary-foreground/20"><a href={whatsappHref} target="_blank" rel="noreferrer"><MessageCircle size={16} /> Chat on WhatsApp</a></Button> : <span className="inline-flex h-12 items-center gap-2 rounded-md border border-primary-foreground/40 bg-primary-foreground/10 px-4 text-xs font-medium text-primary-foreground/90"><MessageCircle size={16} /> WhatsApp contact to be confirmed</span>}</div>
          </div>
        </section>

        <section id="faq" className="scroll-mt-20 bg-background px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
            <div><SectionHeading eyebrow="Good to know" title="Frequently Asked Questions" copy="A few helpful details before you start your project." /><a href="#contact" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary">Still have a question? Contact us <ArrowRight size={15} /></a></div>
            <Accordion type="single" collapsible className="w-full border-t border-border">
              {faqs.map((faq, index) => <AccordionItem key={faq.question} value={`faq-${index}`} className="border-border"><AccordionTrigger className="gap-4 py-5 text-left text-sm font-semibold text-ink hover:no-underline sm:text-base">{faq.question}</AccordionTrigger><AccordionContent className="pb-5 text-sm leading-6 text-copy">{faq.answer}</AccordionContent></AccordionItem>)}
            </Accordion>
          </div>
        </section>

        <section id="contact" className="scroll-mt-20 bg-paper px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-9 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14">
            <div className="lg:pt-2"><SectionHeading eyebrow="Start a conversation" title="Tell Us About Your Project" copy="Share a few details and we’ll make it easier to discuss your printing, signage, or branding requirements." />
              <div className="mt-8 space-y-4 border-t border-border pt-5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink">Contact details</p>
                {company.phone ? <a href={`tel:${company.phone}`} className="block text-sm font-semibold text-primary">{company.phone}</a> : <p className="text-sm text-copy">Phone number to be confirmed</p>}
                {company.email ? <a href={`mailto:${company.email}`} className="block text-sm font-semibold text-primary">{company.email}</a> : <p className="text-sm text-copy">Email address to be confirmed</p>}
                {company.address ? <p className="text-sm leading-6 text-copy">{company.address}</p> : <p className="text-sm text-copy">Business address to be confirmed</p>}
                {whatsappHref ? <Button asChild variant="outline" className="mt-1 h-11 rounded-md"><a href={whatsappHref} target="_blank" rel="noreferrer"><MessageCircle size={16} /> Continue on WhatsApp</a></Button> : <p className="text-xs leading-5 text-copy">WhatsApp enquiry is not active until the verified business number is added.</p>}
              </div>
            </div>
            <div className="rounded-md border border-border/80 bg-background p-5 card-shadow sm:p-7 lg:p-8">
              <EnquiryForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-ink text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-12 sm:px-6 sm:pt-14 lg:px-8">
          <div className="grid gap-9 border-b border-primary-foreground/15 pb-9 sm:grid-cols-2 lg:grid-cols-[1.25fr_0.7fr_1fr_1fr] lg:gap-10">
            <div><BrandMark inverted /><p className="mt-4 max-w-xs text-sm leading-6 text-primary-foreground/70">Professional printing, signage, and branding solutions to help your business make a lasting impression.</p><p className="mt-4 text-xs font-medium text-primary-foreground/70">{company.registration}</p></div>
            <div><h2 className="text-sm font-bold">Explore</h2><ul className="mt-4 space-y-3">{navigation.map(([label, id]) => <li key={id}><a href={`#${id}`} className="text-xs text-primary-foreground/70 transition-colors hover:text-primary-foreground">{label}</a></li>)}</ul></div>
            <div><h2 className="text-sm font-bold">Services</h2><ul className="mt-4 space-y-3">{serviceChoices.slice(0, 5).map((service) => <li key={service}><a href="#services" className="text-xs text-primary-foreground/70 transition-colors hover:text-primary-foreground">{service}</a></li>)}</ul></div>
            <div>
              <h2 className="text-sm font-bold">Newsletter</h2>
              <p className="mt-3 text-xs leading-5 text-primary-foreground/70">Hear about new services and offers from Dsanya.</p>
              <form
                className="mt-3 flex gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  setNewsletterNote("Newsletter sign-up is not active yet. A mailing service must be connected before addresses are collected.");
                }}
              >
                <label className="sr-only" htmlFor="newsletter-email">Email address for the newsletter</label>
                <input
                  id="newsletter-email"
                  name="newsletterEmail"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  className="h-10 min-w-0 flex-1 rounded-md border border-primary-foreground/25 bg-primary-foreground/10 px-3 text-xs text-primary-foreground placeholder:text-primary-foreground/50 outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/50"
                />
                <Button type="submit" size="sm" className="h-10 shrink-0 rounded-md bg-background px-4 text-ink hover:bg-primary-foreground/90">Join</Button>
              </form>
              <p role="status" className="mt-2 text-[11px] leading-4 text-primary-foreground/60">{newsletterNote}</p>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-4 pt-5 sm:flex-row sm:items-center">
            <p className="text-xs text-primary-foreground/60">© {new Date().getFullYear()} {company.name}. All rights reserved.</p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <button type="button" onClick={() => setLegalView("privacy")} className="cursor-pointer text-xs text-primary-foreground/70 transition-colors hover:text-primary-foreground">Privacy Policy</button>
              <button type="button" onClick={() => setLegalView("terms")} className="cursor-pointer text-xs text-primary-foreground/70 transition-colors hover:text-primary-foreground">Terms and Conditions</button>
            </div>
          </div>
        </div>
      </footer>

      <Dialog open={Boolean(selectedProject)} onOpenChange={(open) => { if (!open) setSelectedProject(null); }}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-md border-border p-0 sm:max-w-3xl">
          {selectedProject ? <><img src={selectedProject.image} alt={selectedProject.alt} className="max-h-[65dvh] w-full bg-paper object-contain" /><div className="p-5 sm:p-7"><DialogHeader><p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">{selectedProject.category}</p><DialogTitle className="mt-2 text-xl text-ink">{selectedProject.title}</DialogTitle><DialogDescription className="mt-2 text-sm leading-6 text-copy">Image supplied for the Dsanya portfolio.</DialogDescription></DialogHeader><Button asChild className="mt-5 rounded-md"><a href="#contact" onClick={() => setSelectedProject(null)}>Discuss a similar project <ArrowRight size={16} /></a></Button></div></> : null}
        </DialogContent>
      </Dialog>

      <Dialog open={quickQuoteOpen} onOpenChange={setQuickQuoteOpen}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-md border-border sm:max-w-xl"><DialogHeader><DialogTitle className="text-ink">Request a quote</DialogTitle><DialogDescription className="text-copy">Tell us a little about the service and project you need.</DialogDescription></DialogHeader><EnquiryForm compact /></DialogContent>
      </Dialog>

      <Dialog open={Boolean(legalView)} onOpenChange={(open) => { if (!open) setLegalView(null); }}>
        <DialogContent className="rounded-md border-border sm:max-w-lg"><DialogHeader><DialogTitle className="text-ink">{legalView === "privacy" ? "Privacy Policy" : "Terms and Conditions"}</DialogTitle><DialogDescription className="pt-2 text-sm leading-6 text-copy">{legalView === "privacy" ? "A final privacy notice has not yet been supplied. This preview does not store or transmit enquiry details. When a verified contact method or submission service is enabled, the notice should be updated to describe what information is collected, where it goes, and how customers can contact the business." : "Terms and Conditions have not yet been supplied. Contact Dsanya directly to confirm quotation, artwork approval, production timing, delivery, installation, and payment terms before placing an order."}</DialogDescription></DialogHeader></DialogContent>
      </Dialog>

      {company.phone ? <a href={`tel:${company.phone}`} aria-label="Call Dsanya Print and Sign" className="fixed bottom-5 right-5 z-30 grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 sm:hidden"><MessageCircle size={20} /></a> : null}
    </div>
  );
}
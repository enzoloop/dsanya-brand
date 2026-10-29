// Real image files bundled with the project (imported and hashed by Vite),
// so they resolve on any host — not only Lovable's asset CDN.
import logo from "@/assets/dsanya/logo.webp";
import letters from "@/assets/dsanya/letters.webp";
import beta from "@/assets/dsanya/beta.webp";
import chicken from "@/assets/dsanya/chicken.webp";
import luxelapal from "@/assets/dsanya/luxelapal.webp";
import firm from "@/assets/dsanya/firm.webp";
import queen from "@/assets/dsanya/queen.webp";
import hefa from "@/assets/dsanya/hefa.webp";

export const company = {
  name: "Dsanya Print and Sign Nig. Ltd",
  registration: "RC 7134261",
  whatsappNumber: "",
  phone: "",
  email: "",
  address: "",
  socials: [] as { label: string; url: string }[],
};

export const serviceChoices = [
  "Printing Services",
  "Signage and Signboards",
  "Corporate Branding",
  "Large-Format Printing",
  "Vehicle Branding",
  "Event Branding and Promotional Materials",
] as const;

export const services = [
  { name: serviceChoices[0], description: "Business cards, flyers, brochures, letterheads, labels, stickers, and company profiles.", image: letters, icon: "Printer" },
  { name: serviceChoices[1], description: "Shopfront signs, illuminated signs, 3D lettering, directional signs, and commercial signboards.", image: beta, icon: "Signpost" },
  { name: serviceChoices[2], description: "Office branding, reception signs, wall graphics, and branded business environments.", image: luxelapal, icon: "PanelsTopLeft" },
  { name: serviceChoices[3], description: "Banners, billboards, posters, roll-up banners, and promotional displays.", image: hefa, icon: "PanelsTopLeft" },
  { name: serviceChoices[4], description: "Commercial vehicle graphics, fleet branding, and promotional vehicle designs.", image: firm, icon: "CarFront" },
  { name: serviceChoices[5], description: "Event backdrops, exhibition displays, branded merchandise, and promotional materials.", image: chicken, icon: "PartyPopper" },
];

export const projects = [
  { title: "Illuminated Brand Sign", category: "3D Signage", image: luxelapal, alt: "Illuminated Luxelapal wall sign" },
  { title: "Retail Fuel Station Sign", category: "Corporate Branding", image: beta, alt: "Beta Petroleum branded roadside sign" },
  { title: "Dimensional Lettering", category: "Commercial Printing", image: letters, alt: "Dimensional printed letters ready for installation" },
  { title: "Healthcare Facility Sign", category: "Large-Format Printing", image: hefa, alt: "Healthcare facility sign held for display" },
  { title: "Retail Storefront Sign", category: "Vehicle Branding", image: firm, alt: "Large colorful commercial storefront sign" },
  { title: "Restaurant Exterior Branding", category: "Event Displays", image: chicken, alt: "Chicken Republic restaurant exterior branding" },
];

export const clientSlots = Array.from({ length: 10 }, (_, index) => `Client Logo ${String(index + 1).padStart(2, "0")}`);

export const reviewSlots = Array.from({ length: 6 }, (_, index) => ({ id: index + 1 }));

export const benefits = [
  { title: "Attention to Detail", description: "Care in every design, production choice, and finishing touch.", icon: "ScanEye" },
  { title: "Customised Solutions", description: "Work shaped around your business, specifications, and audience.", icon: "SlidersHorizontal" },
  { title: "Professional Project Handling", description: "Clear communication from your initial enquiry through completion.", icon: "ClipboardCheck" },
  { title: "Quality-Focused Production", description: "A considered approach to materials, print quality, and presentation.", icon: "BadgeCheck" },
];

export const steps = [
  { title: "Tell Us What You Need", text: "Share your requirements, dimensions, artwork, and quantity." },
  { title: "Get a Quote", text: "Receive a quotation and proposed timeline for your project." },
  { title: "Approve Your Design", text: "Review and approve the artwork or project proof where applicable." },
  { title: "Production and Delivery", text: "Complete the agreed production and arrange collection, delivery, or installation as applicable." },
];

export const faqs = [
  { question: "What printing and signage services do you offer?", answer: "Our services include printing, signage, corporate branding, large-format printing, vehicle branding, and event promotional materials. Contact us to confirm the right option for your project." },
  { question: "Can you help with graphic design and artwork?", answer: "Please contact us with your project details to confirm the design or artwork support available for your requirements." },
  { question: "Can I request custom sizes and specifications?", answer: "Yes, share your preferred dimensions, materials, quantity, and any reference artwork so we can discuss a suitable specification." },
  { question: "How do I get a quotation?", answer: "Send your service, project details, quantity or dimensions, and preferred completion date using the enquiry form below. We will need a working contact channel to respond." },
  { question: "How long does production take?", answer: "Timing depends on the project scope and specifications. A proposed timeline can be discussed when you request a quotation." },
  { question: "Do you provide signage installation?", answer: "Please share the sign type and installation location so we can confirm whether installation is available for your project." },
  { question: "Can you arrange delivery?", answer: "Collection, delivery, and installation arrangements depend on the project. Contact us with your location to confirm options." },
  { question: "Do you accept bulk and repeat orders?", answer: "Please contact us with the products and quantities you need, and we can confirm the arrangements for your order." },
];

export { logo };
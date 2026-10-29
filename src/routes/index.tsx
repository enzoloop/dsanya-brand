import { createFileRoute } from "@tanstack/react-router";
import HomePage from "@/components/home/HomePage";

const ogDescription =
  "Professional printing, signage, fabrication, and branding services in Nigeria. Request a quote from Dsanya Print and Sign Nig. Ltd.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dsanya Print and Sign Nig. Ltd | Printing, Signage & Branding in Nigeria" },
      {
        name: "description",
        content:
          "Dsanya Print and Sign Nig. Ltd (RC 7134261) provides professional printing, signage, corporate branding, large-format printing, vehicle branding, and event promotional services across Nigeria. Request a free quote.",
      },
      { property: "og:title", content: "Dsanya Print and Sign Nig. Ltd — Bring Your Brand to Life" },
      { property: "og:description", content: ogDescription },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Dsanya Print and Sign Nig. Ltd — Bring Your Brand to Life" },
      { name: "twitter:description", content: ogDescription },
    ],
  }),
  component: HomePage,
});

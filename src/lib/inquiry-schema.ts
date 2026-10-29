import { z } from "zod";

export const inquirySchema = z.object({
  name: z.string().trim().min(2, "Enter your full name.").max(100, "Use 100 characters or fewer."),
  companyName: z.string().trim().max(120, "Use 120 characters or fewer.").optional().default(""),
  phone: z.string().trim().min(7, "Enter a contact phone number.").max(30, "Use 30 characters or fewer."),
  email: z.union([z.literal(""), z.string().trim().email("Enter a valid email address.").max(254, "Use 254 characters or fewer.")]).optional().default(""),
  service: z.string().trim().min(1, "Choose the service you need.").max(100),
  dimensions: z.string().trim().min(1, "Add a quantity or dimensions.").max(200, "Use 200 characters or fewer."),
  details: z.string().trim().min(10, "Add at least 10 characters about your project.").max(2000, "Use 2,000 characters or fewer."),
  date: z.string().max(40).optional().default(""),
});

export type InquiryValues = z.input<typeof inquirySchema>;

export function buildInquiryMessage(values: z.output<typeof inquirySchema>) {
  const lines = [
    "Hello Dsanya Print and Sign Nig. Ltd, I would like to request a quote.",
    `Name: ${values.name}`,
    values.companyName ? `Company: ${values.companyName}` : "",
    `Phone: ${values.phone}`,
    values.email ? `Email: ${values.email}` : "",
    `Service: ${values.service}`,
    `Quantity / dimensions: ${values.dimensions}`,
    `Project details: ${values.details}`,
    values.date ? `Preferred completion date: ${values.date}` : "",
  ].filter(Boolean);

  return lines.join("\n");
}
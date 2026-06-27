import type { ContactInquiryRecord } from "../db/contact-inquiries";
import { enqueueJob } from "./queue";

export async function queueContactFollowUp(inquiry: ContactInquiryRecord) {
  return enqueueJob("contact.follow-up", {
    inquiryId: inquiry.id,
    email: inquiry.email,
    subject: inquiry.subject,
    locale: inquiry.locale,
  });
}

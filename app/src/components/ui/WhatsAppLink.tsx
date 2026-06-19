"use client";

import { getWhatsAppNumber } from "@/lib/utils";

export function WhatsAppLink() {
  const whatsappNumber = getWhatsAppNumber();
  const formattedNumber = `+${whatsappNumber.slice(0, 2)} ${whatsappNumber.slice(2, 5)} ${whatsappNumber.slice(5)}`;
  
  return (
    <a
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-muted-foreground hover:text-gold transition-colors text-sm"
    >
      {formattedNumber}
    </a>
  );
}

export function PhoneLink() {
  const whatsappNumber = getWhatsAppNumber();
  const formattedNumber = `+${whatsappNumber.slice(0, 2)} ${whatsappNumber.slice(2, 5)} ${whatsappNumber.slice(5)}`;
  
  return (
    <a
      href={`tel:+${whatsappNumber}`}
      className="text-muted-foreground hover:text-gold transition-colors text-sm"
    >
      {formattedNumber}
    </a>
  );
}
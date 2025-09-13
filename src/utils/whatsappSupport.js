/**
 * WhatsApp Support Utility
 * Provides consistent WhatsApp support links throughout the application
 */

const SUPPORT_PHONE = "+2349040940080";

/**
 * Creates a WhatsApp link with a pre-filled message
 * @param {string} message - The message to pre-fill in WhatsApp
 * @returns {string} WhatsApp URL
 */
export const createWhatsAppLink = (message = "Hello, I need support with SwiftConnect") => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${SUPPORT_PHONE.replace(/\s/g, '')}?text=${encodedMessage}`;
};

/**
 * Opens WhatsApp support in a new tab
 * @param {string} message - Optional pre-filled message
 */
export const openWhatsAppSupport = (message) => {
  const whatsappUrl = createWhatsAppLink(message);
  window.open(whatsappUrl, '_blank');
};

/**
 * Gets the formatted support phone number
 * @returns {string} Formatted phone number
 */
export const getSupportPhone = () => SUPPORT_PHONE;

/**
 * Common support messages for different scenarios
 */
export const SUPPORT_MESSAGES = {
  GENERAL: "Hello, I need support with SwiftConnect",
  TRANSACTION: "Hello, I need help with a transaction on SwiftConnect",
  ACCOUNT: "Hello, I need help with my SwiftConnect account",
  TECHNICAL: "Hello, I'm experiencing technical issues with SwiftConnect",
  BILLING: "Hello, I need help with billing on SwiftConnect"
};

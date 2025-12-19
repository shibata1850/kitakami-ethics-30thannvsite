import { describe, it, expect } from 'vitest';

describe('EmailJS Configuration', () => {
  it('should have all required EmailJS environment variables', () => {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    expect(serviceId).toBeDefined();
    expect(serviceId).not.toBe('');
    expect(typeof serviceId).toBe('string');

    expect(templateId).toBeDefined();
    expect(templateId).not.toBe('');
    expect(typeof templateId).toBe('string');

    expect(publicKey).toBeDefined();
    expect(publicKey).not.toBe('');
    expect(typeof publicKey).toBe('string');
  });

  it('should have valid EmailJS service ID format', () => {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    // EmailJS service IDs typically start with 'service_'
    expect(serviceId).toMatch(/^service_/);
  });

  it('should have valid EmailJS template ID format', () => {
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    // EmailJS template IDs typically start with 'template_'
    expect(templateId).toMatch(/^template_/);
  });

  it('should have valid EmailJS public key format', () => {
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    // EmailJS public keys are alphanumeric strings
    expect(publicKey).toMatch(/^[A-Za-z0-9_-]+$/);
    // Typically around 20-30 characters
    expect(publicKey.length).toBeGreaterThan(10);
  });
});

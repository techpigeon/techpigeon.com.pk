'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Alert from '../../components/ui/Alert';
import Footer from '../../components/layout/Footer';
import { COMPANY } from '../../lib/data';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitted(true);
      setFormData({ fullName: '', email: '', message: '' });
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <title>Contact- techpigeon_PK</title>

      {/* Hero Section */}
      <section
        className="w-full py-20 px-4"
        style={{
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e8f4f8 50%, #f5f0e0 100%)',
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1
            className="text-5xl md:text-6xl font-bold mb-4"
            style={{
              fontFamily: "'Aleo', serif",
              color: '#bba442',
            }}
          >
            Contact Us
          </h1>
          <p
            className="text-lg md:text-xl"
            style={{
              fontFamily: "'Open Sans', sans-serif",
              color: '#1d1d1d',
            }}
          >
            Send us a message
          </p>
        </div>
      </section>

      {/* Two-Column Layout */}
      <section
        className="w-full py-16 px-4"
        style={{
          backgroundColor: '#0B1D3A',
          fontFamily: "'Open Sans', sans-serif",
        }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Contact Form */}
          <div
            className="rounded-2xl p-8 md:p-10"
            style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <h2
              className="text-2xl md:text-3xl font-bold mb-6"
              style={{
                fontFamily: "'Aleo', serif",
                color: '#bba442',
              }}
            >
              Get In Touch
            </h2>

            {submitted && (
              <div className="mb-6">
                <Alert variant="success">
                  Thank you for getting in touch!
                </Alert>
              </div>
            )}

            {error && (
              <div className="mb-6">
                <Alert variant="error">
                  {error}
                </Alert>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg px-4 py-3"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#ffffff',
                    fontFamily: "'Open Sans', sans-serif",
                  }}
                />
              </div>

              <div>
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg px-4 py-3"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#ffffff',
                    fontFamily: "'Open Sans', sans-serif",
                  }}
                />
              </div>

              <div>
                <textarea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#ffffff',
                    fontFamily: "'Open Sans', sans-serif",
                    focusRingColor: '#5cc4eb',
                  }}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg py-3 px-6 text-white font-semibold transition-all duration-300"
                style={{
                  backgroundColor: loading ? '#4aa8cc' : '#5cc4eb',
                  fontFamily: "'Open Sans', sans-serif",
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Submit Inquiry'
                )}
              </Button>
            </form>
          </div>

          {/* Right Column - Contact Info Cards */}
          <div className="space-y-6">
            {/* Address Card */}
            <div
              className="rounded-2xl p-6 flex items-start gap-4"
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <div
                className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'rgba(92,196,235,0.15)' }}
              >
                {/* Map Pin Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#5cc4eb"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <h3
                  className="text-lg font-bold mb-1"
                  style={{ fontFamily: "'Aleo', serif", color: '#bba442' }}
                >
                  Our Address
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.8)' }}>
                  St 49, G-7/4, Islamabad, 44000, Pakistan
                </p>
              </div>
            </div>

            {/* Phone Card */}
            <div
              className="rounded-2xl p-6 flex items-start gap-4"
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <div
                className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'rgba(92,196,235,0.15)' }}
              >
                {/* Phone Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#5cc4eb"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <div>
                <h3
                  className="text-lg font-bold mb-1"
                  style={{ fontFamily: "'Aleo', serif", color: '#bba442' }}
                >
                  Phone
                </h3>
                <a
                  href="tel:+17868226386"
                  className="transition-colors duration-200"
                  style={{ color: 'rgba(255,255,255,0.8)' }}
                  onMouseEnter={(e) => (e.target.style.color = '#5cc4eb')}
                  onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.8)')}
                >
                  +1 (786) 8226386
                </a>
              </div>
            </div>

            {/* Email Card */}
            <div
              className="rounded-2xl p-6 flex items-start gap-4"
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <div
                className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'rgba(92,196,235,0.15)' }}
              >
                {/* Email Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#5cc4eb"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3
                  className="text-lg font-bold mb-1"
                  style={{ fontFamily: "'Aleo', serif", color: '#bba442' }}
                >
                  Email
                </h3>
                <a
                  href="mailto:contact@techpigeon.org"
                  className="transition-colors duration-200"
                  style={{ color: 'rgba(255,255,255,0.8)' }}
                  onMouseEnter={(e) => (e.target.style.color = '#5cc4eb')}
                  onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.8)')}
                >
                  contact@techpigeon.org
                </a>
              </div>
            </div>

            {/* Social Links Card */}
            <div
              className="rounded-2xl p-6"
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <h3
                className="text-lg font-bold mb-4"
                style={{ fontFamily: "'Aleo', serif", color: '#bba442' }}
              >
                Follow Us
              </h3>
              <div className="flex items-center gap-4">
                {/* Facebook */}
                <a
                  href="https://facebook.com/techpigeon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300"
                  style={{
                    backgroundColor: 'rgba(92,196,235,0.15)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(92,196,235,0.35)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(92,196,235,0.15)')}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="#5cc4eb"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.378 14.192 5 15.115 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com/company/techpigeon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300"
                  style={{
                    backgroundColor: 'rgba(92,196,235,0.15)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(92,196,235,0.35)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(92,196,235,0.15)')}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="#5cc4eb"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4.98 3.5C4.98 4.881 3.87 6 2.5 6S.02 4.881.02 3.5C.02 2.12 1.13 1 2.5 1s2.48 1.12 2.48 2.5zM5 8H0v16h5V8zm7.982 0H8.014v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0V24H24V13.869c0-7.88-8.922-7.593-11.018-3.714V8z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
}

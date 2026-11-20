'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
  {
    question: 'How do the Admin and Client roles differ?',
    answer: 'Admins have complete operational control over all client profiles, user privileges, projects, tasks, and system analytics. Clients only have access to their own projects, assigned tasks, and company information via their dedicated portal.',
  },
  {
    question: 'Can clients update their own tasks?',
    answer: 'Yes! Clients can update task statuses (e.g. marking deliverables as in review or done) and view progress updates directly from their client dashboard.',
  },
  {
    question: 'How secure is our client data?',
    answer: 'ClientHub employs industry-standard Better Auth session management, server-side role validation, secure cookies, and granular database query filters to guarantee strict data segregation.',
  },
  {
    question: 'Can I upload profile pictures and attachments?',
    answer: 'Yes. Profile image uploads are handled seamlessly via Cloudinary integration with automated image optimization and CDN delivery.',
  },
  {
    question: 'Is there a dark mode?',
    answer: 'Absolutely. ClientHub is crafted with first-class light and dark mode support inspired by modern macOS design principles, respecting both system preferences and manual toggles.',
  },
  {
    question: 'Can I export analytics or reports?',
    answer: 'The admin analytics dashboard aggregates live metrics including client growth, active project stages, and task status breakdowns with interactive visualization charts.',
  },
];

export function FAQ() {
  const [openIdx, setOpenIdx] = useState(null);

  const toggle = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 md:py-32 bg-white dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#0A84FF] mb-3">
            Got Questions?
          </h2>
          <p className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </p>
          <p className="mt-4 text-base text-gray-600 dark:text-gray-400">
            Everything you need to know about getting started with ClientHub.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={faq.question}
                className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/40 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="text-base font-semibold text-gray-900 dark:text-white">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      'w-5 h-5 text-gray-400 transition-transform duration-200',
                      isOpen && 'rotate-180 text-[#0A84FF]'
                    )}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-6 pb-5 pt-1 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-800">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FAQ;

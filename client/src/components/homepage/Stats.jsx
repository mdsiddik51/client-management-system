'use client';

import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  { value: '500+', label: 'Clients Managed' },
  { value: '99.9%', label: 'Platform Uptime' },
  { value: '10x', label: 'Faster Workflows' },
  { value: '24/7', label: 'Dedicated Support' },
];

export function Stats() {
  return (
    <section className="py-16 border-y border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              className="space-y-1"
            >
              <div className="text-3xl sm:text-4xl font-extrabold text-[#0A84FF] tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Stats;

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Layers, BarChart3 } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: UserPlus,
    title: 'Add & Onboard Clients',
    description: 'Quickly create client profiles, assign account managers, record contact points, and invite them directly to their dedicated portal.',
  },
  {
    step: '02',
    icon: Layers,
    title: 'Manage Projects & Tasks',
    description: 'Set milestones, organize task boards, prioritize critical deliverables, and collaborate with transparent real-time updates.',
  },
  {
    step: '03',
    icon: BarChart3,
    title: 'Track Performance & Scale',
    description: 'Monitor health metrics, analyze task throughput, review status breakdowns, and delight clients every step of the way.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#0A84FF] mb-3">
            Workflow
          </h2>
          <p className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
            Designed for frictionless daily operations
          </p>
          <p className="mt-4 text-base text-gray-600 dark:text-gray-400">
            Get up and running in minutes with an intuitive 3-step lifecycle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.12 }}
                className="relative p-8 rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200/70 dark:border-gray-800 flex flex-col items-start"
              >
                <div className="flex items-center justify-between w-full mb-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-100/70 dark:bg-blue-900/40 text-[#0A84FF] flex items-center justify-center font-bold">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-black text-gray-300 dark:text-gray-700 tracking-wider">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;

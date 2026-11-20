'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Users2,
  Contact2,
  Kanban,
  MessageSquare,
  BarChart2,
  ShieldCheck,
} from 'lucide-react';

const features = [
  {
    icon: Users2,
    title: 'Client Management',
    description: 'Keep detailed client records, contact histories, custom fields, and status tracking in one unified directory.',
  },
  {
    icon: Contact2,
    title: 'Contact Management',
    description: 'Direct communication records, assigned admins, quick emails, phone logs, and individual client portals.',
  },
  {
    icon: Kanban,
    title: 'Projects & Tasks',
    description: 'Break projects down into actionable tasks, assign owners, track due dates, and update progress in real time.',
  },
  {
    icon: MessageSquare,
    title: 'Communication & Updates',
    description: 'Keep clients in the loop with automated notification alerts, milestone tracking, and task state updates.',
  },
  {
    icon: BarChart2,
    title: 'Analytics & Reports',
    description: 'Visualize client acquisition trends, project completion rates, and workload distributions with interactive charts.',
  },
  {
    icon: ShieldCheck,
    title: 'Team & Role Access',
    description: 'Enterprise-grade authentication with distinct Admin and Client roles, protecting sensitive data at every level.',
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 md:py-32 bg-gray-50/50 dark:bg-gray-900/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#0A84FF] mb-3">
            Core Capabilities
          </h2>
          <p className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
            Everything your team needs to deliver excellence
          </p>
          <p className="mt-4 text-base text-gray-600 dark:text-gray-400">
            A cohesive suite of tools carefully crafted with the simplicity of macOS and the power of a modern cloud platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="group p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-sm hover:shadow-apple transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#0A84FF] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Features;

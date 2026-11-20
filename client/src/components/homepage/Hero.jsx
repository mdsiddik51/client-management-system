'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, CheckCircle2, TrendingUp, Users, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background radial gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-blue-100/50 via-purple-100/30 to-transparent dark:from-blue-950/20 dark:via-purple-950/10 dark:to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/80 text-[#0A84FF] text-xs font-semibold mb-8 shadow-subtle"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Generation Client Management</span>
        </motion.div>

        {/* Big Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-[1.1] max-w-4xl mx-auto"
        >
          Manage Clients{' '}
          <span className="text-gradient">Like a Pro</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed"
        >
          The all-in-one macOS-inspired CMS engineered for modern teams. Streamline client relationships, deliver projects on schedule, and scale effortlessly.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/register">
            <Button size="lg" className="w-full sm:w-auto text-base px-8 shadow-apple hover:shadow-apple-lg">
              Get Started Free
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-base px-8">
              Live Demo Login
            </Button>
          </Link>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500 dark:text-gray-400"
        >
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Role-based access control</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Instant setup</span>
          </div>
        </motion.div>

        {/* Mock Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 sm:mt-20 relative mx-auto max-w-5xl"
        >
          <div className="relative rounded-2xl p-2 bg-gradient-to-b from-gray-200/60 to-gray-200/20 dark:from-gray-700/60 dark:to-gray-800/20 shadow-apple-dark">
            <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl">
              {/* Window Controls Header */}
              <div className="h-10 px-4 bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700/60 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400/90" />
                <div className="w-3 h-3 rounded-full bg-amber-400/90" />
                <div className="w-3 h-3 rounded-full bg-emerald-400/90" />
                <div className="ml-4 text-xs font-medium text-gray-400 dark:text-gray-500">
                  clienthub.app/admin/dashboard
                </div>
              </div>

              {/* Mock Dashboard Body */}
              <div className="p-6 sm:p-8 space-y-6 text-left">
                {/* Stat Cards Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-700/50">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 font-medium">
                      <span>Total Clients</span>
                      <Users className="w-4 h-4 text-[#0A84FF]" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mt-2">1,280</div>
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">↑ +14% this month</div>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-700/50">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 font-medium">
                      <span>Active Projects</span>
                      <TrendingUp className="w-4 h-4 text-purple-500" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mt-2">42</div>
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">↑ +8% vs last month</div>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-700/50">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 font-medium">
                      <span>Open Tasks</span>
                      <CheckCircle2 className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mt-2">184</div>
                    <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1">92% on schedule</div>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-700/50">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 font-medium">
                      <span>Satisfaction</span>
                      <Shield className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mt-2">99.4%</div>
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">Top rated</div>
                  </div>
                </div>

                {/* Mock Chart & Activity */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 p-5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-700/50 flex flex-col justify-between h-48">
                    <div className="flex justify-between items-center text-xs font-semibold text-gray-700 dark:text-gray-300">
                      <span>Client Acquisition & Activity</span>
                      <span className="text-[#0A84FF]">2026 Overview</span>
                    </div>
                    <div className="flex items-end gap-3 h-28 pt-4">
                      {[40, 65, 45, 80, 55, 90, 75, 95, 85, 100].map((val, idx) => (
                        <div key={idx} className="flex-1 bg-blue-100 dark:bg-blue-950/60 rounded-t-md h-full flex items-end overflow-hidden">
                          <div
                            className="w-full bg-[#0A84FF] rounded-t-md transition-all duration-500"
                            style={{ height: `${val}%` }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-700/50 space-y-3">
                    <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">Recent Milestones</div>
                    <div className="space-y-2 text-xs">
                      <div className="p-2 rounded bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                        <p className="font-medium text-gray-900 dark:text-gray-200">Acme Corp Project Signed</p>
                        <p className="text-[10px] text-gray-400">2 hours ago</p>
                      </div>
                      <div className="p-2 rounded bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                        <p className="font-medium text-gray-900 dark:text-gray-200">Mobile UI Design Approved</p>
                        <p className="text-[10px] text-gray-400">5 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;

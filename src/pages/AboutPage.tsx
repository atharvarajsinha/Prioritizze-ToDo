import React from 'react';
import { Target, Users, Zap, Heart } from 'lucide-react';
import { Layout } from '../components/common/Layout';

export function AboutPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <img src="/logo.svg" alt="Prioritizze" className="h-16 w-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About Prioritizze
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            We believe that everyone deserves the tools to organize their life effectively. 
            Prioritizze was built with the mission to make task management intuitive, 
            powerful, and accessible to everyone.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <Target className="h-8 w-8 text-blue-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Our Mission
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                To empower individuals and teams with intuitive task management tools 
                that transform chaos into clarity, helping them achieve their goals 
                and live more organized, productive lives.
              </p>
            </div>
            <div>
              <div className="flex items-center mb-6">
                <Zap className="h-8 w-8 text-purple-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Our Vision
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                To become the world's most trusted productivity platform, where millions 
                of users can seamlessly organize their tasks, collaborate effectively, 
                and achieve their personal and professional aspirations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Values
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                User-Centric
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Every feature we build starts with understanding our users' needs 
                and creating solutions that truly make their lives better.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <Zap className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Innovation
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We continuously explore new technologies and methodologies to provide 
                cutting-edge productivity solutions that stay ahead of the curve.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  <Heart className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Quality
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We are committed to delivering high-quality, reliable software 
                that our users can depend on for their most important tasks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Our Story
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                How Prioritizze came to life
              </p>
            </div>

            <div className="prose prose-lg max-w-none dark:prose-invert">
              <div className="bg-gray-50 dark:bg-gray-700 p-8 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  Prioritizze was born from a simple frustration: existing task management 
                  tools were either too complex for everyday use or too simple for 
                  meaningful productivity. Our founders, experienced developers and 
                  productivity enthusiasts, saw an opportunity to create something different.
                </p>
                
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  Starting as a side project in 2023, Prioritizze quickly gained traction 
                  among beta users who appreciated its perfect balance of powerful features 
                  and intuitive design. What began as a solution for personal task management 
                  evolved into a comprehensive productivity platform.
                </p>
                
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Today, Prioritizze serves thousands of users worldwide, from individual 
                  professionals to large teams, all united by the desire to get more done 
                  with less stress. We're just getting started on our mission to transform 
                  how the world approaches productivity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Join Our Community
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Be part of a growing community of productive individuals who have 
            chosen Prioritizze as their trusted productivity companion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="bg-white text-blue-600 px-8 py-3 rounded-md font-medium hover:bg-blue-50 transition-colors"
            >
              Get Started Today
            </a>
            <a
              href="/feedback"
              className="border border-white text-white px-8 py-3 rounded-md font-medium hover:bg-white/10 transition-colors"
            >
              Share Your Feedback
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
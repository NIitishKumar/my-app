/**
 * Help & Support Page
 * Main page with tab navigation for FAQ, Contact, Documentation, and Guides
 */

import { useState } from 'react';
import { FAQSection } from '../components/FAQSection';
import { ContactForm } from '../components/ContactForm';
import { DocumentationSection } from '../components/DocumentationSection';
import { GuidesSection } from '../components/GuidesSection';

type TabType = 'faq' | 'contact' | 'documentation' | 'guides';

const tabs: Array<{ id: TabType; label: string; icon: string }> = [
  { id: 'faq', label: 'FAQ', icon: 'fa-question-circle' },
  { id: 'contact', label: 'Contact', icon: 'fa-envelope' },
  { id: 'documentation', label: 'Documentation', icon: 'fa-book' },
  { id: 'guides', label: 'Guides', icon: 'fa-list-ol' },
];

export const HelpSupportPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('faq');

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Help & Support</h1>
        <p className="text-gray-600">Find answers, get help, and learn how to use the platform</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 sm:px-6 py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className={`fas ${tab.icon}`}></i>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {activeTab === 'faq' && <FAQSection />}
          {activeTab === 'contact' && <ContactForm />}
          {activeTab === 'documentation' && <DocumentationSection />}
          {activeTab === 'guides' && <GuidesSection />}
        </div>
      </div>
    </div>
  );
};


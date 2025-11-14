"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'en' | 'bn'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    // Load language from localStorage on mount
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage === 'en' || savedLanguage === 'bn') {
      setLanguageState(savedLanguage)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
  }

  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translations[language]
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k]
      } else {
        return key // Return key if translation not found
      }
    }
    
    return typeof value === 'string' ? value : key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// Translations
const translations = {
  en: {
    nav: {
      home: 'Home',
      jobs: 'Jobs',
      resources: 'Resources',
      profile: 'Profile',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      dashboard: 'Dashboard',
      mentor: 'Mentor',
      roadmap: 'Roadmap',
      skillGap: 'Skill Gap'
    },
    home: {
      title: 'Welcome to CareerBridge',
      subtitle: 'Your AI-Powered Career Development Platform',
      description: 'Discover job opportunities, learn new skills, and advance your career with personalized AI recommendations.',
      getStarted: 'Get Started',
      learnMore: 'Learn More'
    },
    jobs: {
      title: 'Explore Jobs',
      subtitle: 'Discover opportunities from all sources or focus on local Bangladeshi jobs from NGOs, government, and job boards',
      searchPlaceholder: 'Search jobs, companies, skills...',
      allJobs: 'All Jobs',
      localJobs: 'Local Jobs',
      filters: 'Filters',
      location: 'Location',
      allLocations: 'All Locations',
      remote: 'Remote',
      onsite: 'On-site',
      jobType: 'Job Type',
      allTypes: 'All Types',
      fullTime: 'Full-time',
      partTime: 'Part-time',
      contract: 'Contract',
      internship: 'Internship',
      showing: 'Showing',
      of: 'of',
      results: 'results',
      jobsPerPage: 'Jobs per page:',
      noJobs: 'No jobs found. Try a different filter or check back later.',
      posted: 'Posted:',
      details: 'Details',
      apply: 'Apply Now'
    },
    profile: {
      title: 'My Profile',
      personalInfo: 'Personal Information',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      location: 'Location',
      skills: 'Skills',
      experience: 'Experience',
      education: 'Education',
      editProfile: 'Edit Profile',
      saveChanges: 'Save Changes',
      cancel: 'Cancel'
    },
    resources: {
      title: 'Learning Resources',
      subtitle: 'Expand your knowledge with curated courses and tutorials',
      searchPlaceholder: 'Search resources...',
      allResources: 'All Resources',
      courses: 'Courses',
      tutorials: 'Tutorials',
      articles: 'Articles',
      videos: 'Videos'
    },
    dashboard: {
      title: 'Dashboard',
      welcome: 'Welcome back',
      overview: 'Overview',
      recentApplications: 'Recent Applications',
      recommendations: 'Recommended for You',
      stats: 'Your Statistics',
      applications: 'Applications',
      interviews: 'Interviews',
      offers: 'Offers'
    },
    mentor: {
      title: 'Career Mentor',
      subtitle: 'Get personalized career guidance from our AI mentor',
      askQuestion: 'Ask a question...',
      send: 'Send',
      thinking: 'Thinking...',
      suggestedQuestions: 'Suggested Questions'
    },
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      close: 'Close',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      language: 'Language'
    }
  },
  bn: {
    nav: {
      home: 'হোম',
      jobs: 'চাকরি',
      resources: 'সম্পদ',
      profile: 'প্রোফাইল',
      login: 'লগইন',
      register: 'নিবন্ধন',
      logout: 'লগআউট',
      dashboard: 'ড্যাশবোর্ড',
      mentor: 'মেন্টর',
      roadmap: 'রোডম্যাপ',
      skillGap: 'দক্ষতার ফাঁক'
    },
    home: {
      title: 'ক্যারিয়ারব্রিজে স্বাগতম',
      subtitle: 'আপনার এআই-চালিত ক্যারিয়ার উন্নয়ন প্ল্যাটফর্ম',
      description: 'ব্যক্তিগত এআই সুপারিশ সহ চাকরির সুযোগ আবিষ্কার করুন, নতুন দক্ষতা শিখুন এবং আপনার ক্যারিয়ার এগিয়ে নিন।',
      getStarted: 'শুরু করুন',
      learnMore: 'আরও জানুন'
    },
    jobs: {
      title: 'চাকরি অন্বেষণ করুন',
      subtitle: 'সব উৎস থেকে সুযোগ আবিষ্কার করুন বা এনজিও, সরকার এবং চাকরি বোর্ড থেকে স্থানীয় বাংলাদেশী চাকরিতে ফোকাস করুন',
      searchPlaceholder: 'চাকরি, কোম্পানি, দক্ষতা অনুসন্ধান করুন...',
      allJobs: 'সব চাকরি',
      localJobs: 'স্থানীয় চাকরি',
      filters: 'ফিল্টার',
      location: 'অবস্থান',
      allLocations: 'সব অবস্থান',
      remote: 'রিমোট',
      onsite: 'অন-সাইট',
      jobType: 'চাকরির ধরন',
      allTypes: 'সব ধরন',
      fullTime: 'পূর্ণ-সময়',
      partTime: 'খণ্ডকালীন',
      contract: 'চুক্তি',
      internship: 'ইন্টার্নশিপ',
      showing: 'দেখানো হচ্ছে',
      of: 'এর',
      results: 'ফলাফল',
      jobsPerPage: 'প্রতি পৃষ্ঠায় চাকরি:',
      noJobs: 'কোন চাকরি পাওয়া যায়নি। একটি ভিন্ন ফিল্টার চেষ্টা করুন বা পরে আবার চেক করুন।',
      posted: 'পোস্ট করা হয়েছে:',
      details: 'বিস্তারিত',
      apply: 'এখনই আবেদন করুন'
    },
    profile: {
      title: 'আমার প্রোফাইল',
      personalInfo: 'ব্যক্তিগত তথ্য',
      name: 'নাম',
      email: 'ইমেইল',
      phone: 'ফোন',
      location: 'অবস্থান',
      skills: 'দক্ষতা',
      experience: 'অভিজ্ঞতা',
      education: 'শিক্ষা',
      editProfile: 'প্রোফাইল সম্পাদনা',
      saveChanges: 'পরিবর্তন সংরক্ষণ',
      cancel: 'বাতিল'
    },
    resources: {
      title: 'শিক্ষা সম্পদ',
      subtitle: 'নির্বাচিত কোর্স এবং টিউটোরিয়াল দিয়ে আপনার জ্ঞান প্রসারিত করুন',
      searchPlaceholder: 'সম্পদ অনুসন্ধান করুন...',
      allResources: 'সব সম্পদ',
      courses: 'কোর্স',
      tutorials: 'টিউটোরিয়াল',
      articles: 'প্রবন্ধ',
      videos: 'ভিডিও'
    },
    dashboard: {
      title: 'ড্যাশবোর্ড',
      welcome: 'ফিরে আসার জন্য স্বাগতম',
      overview: 'সারসংক্ষেপ',
      recentApplications: 'সাম্প্রতিক আবেদন',
      recommendations: 'আপনার জন্য সুপারিশকৃত',
      stats: 'আপনার পরিসংখ্যান',
      applications: 'আবেদন',
      interviews: 'সাক্ষাৎকার',
      offers: 'অফার'
    },
    mentor: {
      title: 'ক্যারিয়ার মেন্টর',
      subtitle: 'আমাদের এআই মেন্টর থেকে ব্যক্তিগত ক্যারিয়ার নির্দেশনা পান',
      askQuestion: 'একটি প্রশ্ন জিজ্ঞাসা করুন...',
      send: 'পাঠান',
      thinking: 'চিন্তা করছে...',
      suggestedQuestions: 'প্রস্তাবিত প্রশ্ন'
    },
    common: {
      loading: 'লোড হচ্ছে...',
      error: 'ত্রুটি',
      success: 'সফল',
      close: 'বন্ধ করুন',
      save: 'সংরক্ষণ',
      delete: 'মুছুন',
      edit: 'সম্পাদনা',
      view: 'দেখুন',
      back: 'পিছনে',
      next: 'পরবর্তী',
      previous: 'পূর্ববর্তী',
      search: 'অনুসন্ধান',
      filter: 'ফিল্টার',
      sort: 'সাজান',
      language: 'ভাষা'
    }
  }
}

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
      skillGap: 'Skill Gap',
      getStarted: 'Get Started',
      demoMode: 'Demo Mode',
      previewSampleData: 'Preview with sample data',
      demo: 'Demo'
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
      cancel: 'Cancel',
      uploadCV: 'Upload CV',
      downloadCV: 'Download CV',
      analyzing: 'Analyzing your CV...',
      aiAnalysis: 'AI Analysis',
      suggestions: 'Suggestions'
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
      welcomeUser: 'Welcome back, {name}!',
      overview: 'Overview',
      careerDashboard: 'Here\'s your career dashboard overview',
      recentApplications: 'Recent Applications',
      recommendations: 'Recommended for You',
      stats: 'Your Statistics',
      applications: 'Applications',
      interviews: 'Interviews',
      offers: 'Offers',
      jobRecommendations: 'Job Recommendations',
      skillGapAnalysis: 'Skill Gap Analysis',
      careerRoadmap: 'Career Roadmap',
      education: 'Education',
      highSchool: 'High School',
      bachelors: 'Bachelors',
      masters: 'Masters',
      phd: 'PhD',
      careerTrack: 'Career Track',
      marketing: 'Marketing',
      engineering: 'Engineering',
      design: 'Design',
      datascience: 'Data Science',
      experience: 'Experience',
      entry: 'Entry Level',
      mid: 'Mid Level',
      senior: 'Senior Level',
      profileMatch: 'Profile Match',
      analyzeSkillGaps: 'Analyze Your Skill Gaps',
      analyzeSkillGapsDesc: 'Discover what skills you need to land your dream job and get personalized learning recommendations'
    },
    mentor: {
      title: 'Career Mentor',
      subtitle: 'Get personalized career guidance from our AI mentor',
      askQuestion: 'Ask a question...',
      send: 'Send',
      thinking: 'Thinking...',
      suggestedQuestions: 'Suggested Questions',
      chatWithMentor: 'Chat with Mentor',
      newChat: 'New Chat'
    },
    roadmap: {
      title: 'AI Career Roadmap',
      subtitle: 'Personalized learning path to achieve your career goals',
      generateRoadmap: 'Generate Roadmap',
      currentRole: 'Current Role',
      targetRole: 'Target Role',
      timeline: 'Timeline',
      skills: 'Skills to Learn',
      resources: 'Resources',
      milestones: 'Milestones',
      inProgress: 'In Progress',
      completed: 'Completed',
      notStarted: 'Not Started'
    },
    skillGap: {
      title: 'Skill Gap Analysis',
      subtitle: 'Identify and bridge the gap between your current and target skills',
      analyze: 'Analyze Skills',
      currentSkills: 'Current Skills',
      requiredSkills: 'Required Skills',
      missingSkills: 'Skills to Acquire',
      matchPercentage: 'Match Percentage',
      recommendations: 'Recommendations',
      startLearning: 'Start Learning'
    },
    footer: {
      aboutSection: 'About',
      aboutText: 'CareerBridge is an AI-powered platform helping professionals navigate their career journey.',
      quickLinks: 'Quick Links',
      home: 'Home',
      jobs: 'Jobs',
      resources: 'Resources',
      aboutUs: 'About Us',
      contact: 'Contact',
      contactUs: 'Contact Us',
      support: 'Support',
      faq: 'FAQ',
      helpCenter: 'Help Center',
      explore: 'Explore',
      jobOpportunities: 'Job Opportunities',
      learningResources: 'Learning Resources',
      careerPaths: 'Career Paths',
      skillAssessment: 'Skill Assessment',
      learning: 'Learning',
      programming: 'Programming',
      webDevelopment: 'Web Development',
      dataScience: 'Data Science',
      aiMachineLearning: 'AI & Machine Learning',
      resourcesSection: 'Resources',
      interviewQuestions: 'Interview Questions',
      codingChallenges: 'Coding Challenges',
      careerGuide: 'Career Guide',
      salaryInsights: 'Salary Insights',
      company: 'Company',
      legal: 'Legal',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      cookies: 'Cookie Policy',
      allRightsReserved: 'All rights reserved.',
      followUs: 'Follow Us'
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
      language: 'Language',
      submit: 'Submit',
      cancel: 'Cancel',
      confirm: 'Confirm',
      yes: 'Yes',
      no: 'No'
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
      skillGap: 'দক্ষতার ফাঁক',
      getStarted: 'শুরু করুন',
      demoMode: 'ডেমো মোড',
      previewSampleData: 'নমুনা ডেটা সহ প্রিভিউ',
      demo: 'ডেমো'
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
      cancel: 'বাতিল',
      uploadCV: 'সিভি আপলোড করুন',
      downloadCV: 'সিভি ডাউনলোড করুন',
      analyzing: 'আপনার সিভি বিশ্লেষণ করা হচ্ছে...',
      aiAnalysis: 'এআই বিশ্লেষণ',
      suggestions: 'পরামর্শ'
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
      welcomeUser: 'ফিরে আসার জন্য স্বাগতম',
      careerDashboard: 'এখানে আপনার ক্যারিয়ার ড্যাশবোর্ড সারসংক্ষেপ',
      overview: 'সারসংক্ষেপ',
      recentApplications: 'সাম্প্রতিক আবেদন',
      recommendations: 'আপনার জন্য সুপারিশকৃত',
      stats: 'আপনার পরিসংখ্যান',
      applications: 'আবেদন',
      interviews: 'সাক্ষাৎকার',
      offers: 'অফার',
      jobRecommendations: 'চাকরির সুপারিশ',
      skillGapAnalysis: 'দক্ষতার ফাঁক বিশ্লেষণ',
      careerRoadmap: 'ক্যারিয়ার রোডম্যাপ',
      education: 'শিক্ষা',
      highSchool: 'উচ্চ বিদ্যালয়',
      bachelors: 'স্নাতক',
      masters: 'স্নাতকোত্তর',
      phd: 'পিএইচডি',
      careerTrack: 'ক্যারিয়ার ট্র্যাক',
      marketing: 'মার্কেটিং',
      engineering: 'ইঞ্জিনিয়ারিং',
      design: 'ডিজাইন',
      datascience: 'ডেটা সায়েন্স',
      experience: 'অভিজ্ঞতা',
      entry: 'প্রবেশ স্তর',
      mid: 'মধ্য স্তর',
      senior: 'সিনিয়র স্তর',
      profileMatch: 'প্রোফাইল মিল',
      analyzeSkillGaps: 'আপনার দক্ষতার ফাঁক বিশ্লেষণ করুন',
      analyzeSkillGapsDesc: 'জানুন কোথায় উন্নতি করতে হবে'
    },
    mentor: {
      title: 'ক্যারিয়ার মেন্টর',
      subtitle: 'আমাদের এআই মেন্টর থেকে ব্যক্তিগত ক্যারিয়ার নির্দেশনা পান',
      askQuestion: 'একটি প্রশ্ন জিজ্ঞাসা করুন...',
      send: 'পাঠান',
      thinking: 'চিন্তা করছে...',
      suggestedQuestions: 'প্রস্তাবিত প্রশ্ন',
      chatWithMentor: 'মেন্টরের সাথে চ্যাট করুন',
      newChat: 'নতুন চ্যাট'
    },
    roadmap: {
      title: 'এআই ক্যারিয়ার রোডম্যাপ',
      subtitle: 'আপনার ক্যারিয়ার লক্ষ্য অর্জনের জন্য ব্যক্তিগতকৃত শিক্ষার পথ',
      generateRoadmap: 'রোডম্যাপ তৈরি করুন',
      currentRole: 'বর্তমান ভূমিকা',
      targetRole: 'লক্ষ্য ভূমিকা',
      timeline: 'সময়রেখা',
      skills: 'শেখার দক্ষতা',
      resources: 'সম্পদ',
      milestones: 'মাইলফলক',
      inProgress: 'চলছে',
      completed: 'সম্পন্ন',
      notStarted: 'শুরু হয়নি'
    },
    skillGap: {
      title: 'দক্ষতার ফাঁক বিশ্লেষণ',
      subtitle: 'আপনার বর্তমান এবং লক্ষ্য দক্ষতার মধ্যে ফাঁক চিহ্নিত এবং পূরণ করুন',
      analyze: 'দক্ষতা বিশ্লেষণ করুন',
      currentSkills: 'বর্তমান দক্ষতা',
      requiredSkills: 'প্রয়োজনীয় দক্ষতা',
      missingSkills: 'অর্জন করার দক্ষতা',
      matchPercentage: 'মিলের শতাংশ',
      recommendations: 'সুপারিশ',
      startLearning: 'শেখা শুরু করুন'
    },
    footer: {
      company: 'কোম্পানি',
      aboutSection: 'সম্পর্কে',
      aboutUs: 'আমাদের সম্পর্কে',
      aboutText: 'ক্যারিয়ারব্রিজ একটি এআই-চালিত প্ল্যাটফর্ম যা পেশাদারদের তাদের ক্যারিয়ার যাত্রায় সাহায্য করে।',
      team: 'আমাদের দল',
      careers: 'ক্যারিয়ার',
      blog: 'ব্লগ',
      explore: 'অন্বেষণ করুন',
      jobOpportunities: 'চাকরির সুযোগ',
      learningResources: 'শিক্ষার সম্পদ',
      careerPaths: 'ক্যারিয়ার পথ',
      skillAssessment: 'দক্ষতা মূল্যায়ন',
      learning: 'শিক্ষা',
      programming: 'প্রোগ্রামিং',
      webDevelopment: 'ওয়েব ডেভেলপমেন্ট',
      dataScience: 'ডেটা সায়েন্স',
      aiMachineLearning: 'এআই ও মেশিন লার্নিং',
      resourcesSection: 'সম্পদ',
      interviewQuestions: 'ইন্টারভিউ প্রশ্ন',
      codingChallenges: 'কোডিং চ্যালেঞ্জ',
      careerGuide: 'ক্যারিয়ার গাইড',
      salaryInsights: 'বেতন তথ্য',
      quickLinks: 'দ্রুত লিঙ্ক',
      home: 'হোম',
      jobs: 'চাকরি',
      resources: 'সম্পদ',
      contact: 'যোগাযোগ',
      support: 'সহায়তা',
      faq: 'প্রশ্ন',
      helpCenter: 'সহায়তা কেন্দ্র',
      contactUs: 'আমাদের সাথে যোগাযোগ করুন',
      legal: 'আইনি',
      privacy: 'গোপনীয়তা নীতি',
      terms: 'সেবার শর্তাবলী',
      cookies: 'কুকি নীতি',
      allRightsReserved: 'সমস্ত অধিকার সংরক্ষিত।',
      followUs: 'আমাদের অনুসরণ করুন'
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
      language: 'ভাষা',
      submit: 'জমা দিন',
      cancel: 'বাতিল',
      confirm: 'নিশ্চিত করুন',
      yes: 'হ্যাঁ',
      no: 'না'
    }
  }
}

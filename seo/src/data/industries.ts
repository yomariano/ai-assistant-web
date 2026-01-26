/**
 * VoiceFleet SEO - Industry Data
 * 17 B2B industries optimized for AI voice agent positioning
 */

import { Industry } from '../types';

export const INDUSTRIES: Record<string, Industry> = {
  // FOOD SERVICE
  "restaurants": {
    slug: "restaurants",
    name: "Restaurants",
    namePlural: "Restaurant Owners",
    description: "AI voice agents for restaurant phone ordering, reservations, and customer inquiries",
    metaDescription: "Automate restaurant phone orders with VoiceFleet AI. Handle reservations, takeout orders, and customer questions 24/7 without hiring extra staff.",
    avgCallsPerMonth: 2500,
    automationRate: 85,
    costSavingsPercent: 60,
    avgResponseTime: "< 1 second",
    primaryUseCases: [
      "Phone order taking",
      "Reservation management",
      "Menu inquiries",
      "Wait time updates"
    ],
    voiceCapabilities: [
      "Multi-language ordering",
      "Menu upselling",
      "POS integration",
      "Special request handling"
    ],
    painPoints: [
      "Missing calls during rush hours?",
      "High staff turnover affecting phone service?",
      "Order accuracy issues from phone orders?",
      "No one to answer after-hours calls?"
    ],
    relatedIndustries: ["coffee-shops", "hotels", "catering"],
    topLocations: ["dublin", "london", "new-york", "chicago", "los-angeles"],
    keywords: ["restaurant phone ordering AI", "restaurant voice assistant", "automated restaurant calls", "AI phone answering for restaurants"],
    icon: "utensils"
  },

  // HEALTHCARE
  "dental-clinics": {
    slug: "dental-clinics",
    name: "Dental Clinics",
    namePlural: "Dental Practices",
    description: "AI voice agents for dental appointment scheduling, reminders, and patient inquiries",
    metaDescription: "VoiceFleet AI handles dental appointment bookings, confirmations, and patient questions 24/7. Reduce no-shows and free your front desk.",
    avgCallsPerMonth: 1800,
    automationRate: 78,
    costSavingsPercent: 55,
    avgResponseTime: "< 1 second",
    primaryUseCases: [
      "Appointment scheduling",
      "Reminder calls",
      "Insurance verification",
      "Emergency triage"
    ],
    voiceCapabilities: [
      "Calendar integration",
      "HIPAA-compliant conversations",
      "Multi-provider scheduling",
      "Waitlist management"
    ],
    painPoints: [
      "Front desk overwhelmed with calls?",
      "High no-show rates costing revenue?",
      "Missing after-hours emergency calls?",
      "Patients confused about insurance?"
    ],
    relatedIndustries: ["medical-clinics", "spas", "fitness-centers"],
    topLocations: ["dublin", "cork", "london", "manchester", "new-york"],
    keywords: ["dental appointment AI", "dental clinic voice agent", "automated dental scheduling", "dentist phone answering"],
    icon: "tooth"
  },

  "medical-clinics": {
    slug: "medical-clinics",
    name: "Medical Clinics",
    namePlural: "Healthcare Providers",
    description: "HIPAA-compliant AI voice agents for medical appointment scheduling and patient communication",
    metaDescription: "VoiceFleet AI voice agents handle medical appointments, prescription refills, and patient triage. HIPAA-compliant and available 24/7.",
    avgCallsPerMonth: 3200,
    automationRate: 72,
    costSavingsPercent: 50,
    avgResponseTime: "< 1 second",
    primaryUseCases: [
      "Appointment scheduling",
      "Prescription refill requests",
      "Lab result notifications",
      "Symptom triage"
    ],
    voiceCapabilities: [
      "HIPAA compliance",
      "EMR integration",
      "Multi-provider booking",
      "Urgent care routing"
    ],
    painPoints: [
      "Patient call volume overwhelming staff?",
      "Staff burnout from repetitive calls?",
      "Missing after-hours urgent calls?",
      "High appointment no-show rates?"
    ],
    relatedIndustries: ["dental-clinics", "spas", "fitness-centers"],
    topLocations: ["dublin", "london", "new-york", "boston", "chicago"],
    keywords: ["medical appointment AI", "healthcare voice agent", "HIPAA voice assistant", "clinic phone automation"],
    icon: "stethoscope"
  },

  // HOME SERVICES
  "plumbers": {
    slug: "plumbers",
    name: "Plumbing Services",
    namePlural: "Plumbing Companies",
    description: "AI voice agents for plumbing service calls, emergency dispatch, and appointment booking",
    metaDescription: "Never miss an emergency plumbing call. VoiceFleet AI handles service requests, quotes, and emergency dispatch 24/7.",
    avgCallsPerMonth: 1200,
    automationRate: 82,
    costSavingsPercent: 65,
    avgResponseTime: "< 1 second",
    primaryUseCases: [
      "Emergency call intake",
      "Service scheduling",
      "Quote requests",
      "Job status updates"
    ],
    voiceCapabilities: [
      "Emergency prioritization",
      "Technician dispatch",
      "Quote generation",
      "Customer callbacks"
    ],
    painPoints: [
      "Missing emergency calls after hours?",
      "Losing leads to competitors who answer faster?",
      "Technician coordination taking too long?",
      "No staff for weekend/evening calls?"
    ],
    relatedIndustries: ["electricians", "hvac", "property-management"],
    topLocations: ["dublin", "london", "chicago", "houston", "phoenix"],
    keywords: ["plumber phone AI", "plumbing dispatch voice agent", "emergency plumber automation", "plumbing call answering"],
    icon: "wrench"
  },

  "electricians": {
    slug: "electricians",
    name: "Electrical Services",
    namePlural: "Electrical Contractors",
    description: "AI voice agents for electrical service calls, emergency dispatch, and estimates",
    metaDescription: "VoiceFleet AI handles electrical service requests, emergency dispatch, and appointment scheduling. Capture every lead 24/7.",
    avgCallsPerMonth: 1100,
    automationRate: 80,
    costSavingsPercent: 62,
    avgResponseTime: "< 1 second",
    primaryUseCases: [
      "Emergency call handling",
      "Service scheduling",
      "Estimate requests",
      "Safety inquiries"
    ],
    voiceCapabilities: [
      "Emergency routing",
      "Service type classification",
      "Technician scheduling",
      "Quote coordination"
    ],
    painPoints: [
      "Emergency calls going to voicemail?",
      "Missed leads during busy periods?",
      "Dispatch coordination delays?",
      "Weekend/evening call coverage?"
    ],
    relatedIndustries: ["plumbers", "hvac", "property-management"],
    topLocations: ["dublin", "london", "los-angeles", "dallas", "atlanta"],
    keywords: ["electrician voice AI", "electrical dispatch automation", "emergency electrician calls", "electrical contractor phone"],
    icon: "bolt"
  },

  "hvac": {
    slug: "hvac",
    name: "HVAC Services",
    namePlural: "HVAC Contractors",
    description: "AI voice agents for HVAC service calls, maintenance scheduling, and emergency heating/cooling",
    metaDescription: "VoiceFleet AI captures HVAC emergency calls, schedules maintenance, and books installations. Never miss a lead in peak season.",
    avgCallsPerMonth: 1500,
    automationRate: 83,
    costSavingsPercent: 58,
    avgResponseTime: "< 1 second",
    primaryUseCases: [
      "Emergency HVAC calls",
      "Maintenance scheduling",
      "Installation inquiries",
      "Seasonal tune-ups"
    ],
    voiceCapabilities: [
      "Seasonal demand handling",
      "Emergency prioritization",
      "Maintenance plan upsells",
      "Equipment diagnostics"
    ],
    painPoints: [
      "Seasonal call spikes overwhelming staff?",
      "Emergency after-hours calls going unanswered?",
      "Maintenance scheduling bottlenecks?",
      "Lead qualification taking too long?"
    ],
    relatedIndustries: ["plumbers", "electricians", "property-management"],
    topLocations: ["phoenix", "houston", "dallas", "chicago", "london"],
    keywords: ["HVAC phone AI", "heating cooling voice agent", "AC repair automation", "HVAC call answering"],
    icon: "thermometer"
  },

  // PROFESSIONAL SERVICES
  "law-firms": {
    slug: "law-firms",
    name: "Law Firms",
    namePlural: "Legal Practices",
    description: "AI voice agents for legal intake, appointment scheduling, and client communication",
    metaDescription: "VoiceFleet AI qualifies legal leads, schedules consultations, and handles client intake. Capture more cases without adding staff.",
    avgCallsPerMonth: 800,
    automationRate: 70,
    costSavingsPercent: 55,
    avgResponseTime: "< 1 second",
    primaryUseCases: [
      "Lead qualification",
      "Consultation scheduling",
      "Case status updates",
      "Document reminders"
    ],
    voiceCapabilities: [
      "Practice area routing",
      "Conflict checking",
      "Calendar integration",
      "Confidentiality compliance"
    ],
    painPoints: [
      "Lead qualification taking attorney time?",
      "After-hours inquiries going to voicemail?",
      "Receptionist costs too high?",
      "Case update calls overwhelming staff?"
    ],
    relatedIndustries: ["accounting-firms", "insurance-agencies", "real-estate"],
    topLocations: ["new-york", "london", "chicago", "los-angeles", "dublin"],
    keywords: ["law firm voice AI", "legal intake automation", "attorney phone answering", "lawyer call service"],
    icon: "scale"
  },

  "accounting-firms": {
    slug: "accounting-firms",
    name: "Accounting Firms",
    namePlural: "Accounting Practices",
    description: "AI voice agents for tax season calls, appointment scheduling, and client queries",
    metaDescription: "Handle tax season call volume with VoiceFleet AI. Schedule appointments, answer FAQs, and qualify leads automatically.",
    avgCallsPerMonth: 1200,
    automationRate: 75,
    costSavingsPercent: 52,
    avgResponseTime: "< 1 second",
    primaryUseCases: [
      "Appointment scheduling",
      "Tax deadline reminders",
      "Document follow-ups",
      "Service inquiries"
    ],
    voiceCapabilities: [
      "Seasonal scaling",
      "Document checklists",
      "Deadline tracking",
      "Multi-service routing"
    ],
    painPoints: [
      "Tax season call volume unmanageable?",
      "Staff overtime during busy periods?",
      "Document chasing taking too long?",
      "New client intake bottlenecks?"
    ],
    relatedIndustries: ["law-firms", "insurance-agencies", "real-estate"],
    topLocations: ["new-york", "london", "chicago", "dublin", "boston"],
    keywords: ["accounting firm AI", "tax preparer voice agent", "CPA phone automation", "accountant call service"],
    icon: "calculator"
  },

  // AUTOMOTIVE
  "car-dealerships": {
    slug: "car-dealerships",
    name: "Car Dealerships",
    namePlural: "Auto Dealers",
    description: "AI voice agents for sales inquiries, service scheduling, and test drive bookings",
    metaDescription: "VoiceFleet AI handles car sales inquiries, schedules test drives, and books service appointments. Capture every lead instantly.",
    avgCallsPerMonth: 2200,
    automationRate: 76,
    costSavingsPercent: 58,
    avgResponseTime: "< 1 second",
    primaryUseCases: [
      "Sales lead capture",
      "Test drive scheduling",
      "Service appointments",
      "Inventory inquiries"
    ],
    voiceCapabilities: [
      "CRM integration",
      "Inventory lookup",
      "Sales rep routing",
      "Lead scoring"
    ],
    painPoints: [
      "Missed sales calls costing deals?",
      "BDC staffing costs too high?",
      "After-hours leads going cold?",
      "Service scheduling bottlenecks?"
    ],
    relatedIndustries: ["auto-repair", "insurance-agencies", "car-rental"],
    topLocations: ["los-angeles", "houston", "dallas", "chicago", "dublin"],
    keywords: ["car dealership AI", "auto dealer voice agent", "dealership call automation", "car sales phone"],
    icon: "car"
  },

  "auto-repair": {
    slug: "auto-repair",
    name: "Auto Repair Shops",
    namePlural: "Auto Service Centers",
    description: "AI voice agents for repair appointments, status updates, and estimate calls",
    metaDescription: "VoiceFleet AI schedules repair appointments, provides status updates, and captures new customers for auto shops.",
    avgCallsPerMonth: 1400,
    automationRate: 80,
    costSavingsPercent: 55,
    avgResponseTime: "< 1 second",
    primaryUseCases: [
      "Appointment scheduling",
      "Repair status updates",
      "Estimate inquiries",
      "Pickup notifications"
    ],
    voiceCapabilities: [
      "Shop management integration",
      "Wait time estimates",
      "Service recommendations",
      "Customer callbacks"
    ],
    painPoints: [
      "Status calls overwhelming front desk?",
      "Front desk too busy for new customers?",
      "Appointment no-shows hurting revenue?",
      "Missing new customer leads?"
    ],
    relatedIndustries: ["car-dealerships", "insurance-agencies", "tow-services"],
    topLocations: ["los-angeles", "houston", "chicago", "phoenix", "dublin"],
    keywords: ["auto repair voice AI", "mechanic phone answering", "car repair automation", "auto shop call service"],
    icon: "wrench"
  },

  // BEAUTY & WELLNESS
  "hair-salons": {
    slug: "hair-salons",
    name: "Hair Salons",
    namePlural: "Salon Owners",
    description: "AI voice agents for salon appointment booking, confirmations, and service inquiries",
    metaDescription: "VoiceFleet AI books salon appointments, sends reminders, and answers service questions. Focus on clients, not phones.",
    avgCallsPerMonth: 1600,
    automationRate: 88,
    costSavingsPercent: 60,
    avgResponseTime: "< 1 second",
    primaryUseCases: [
      "Appointment booking",
      "Reminder calls",
      "Service inquiries",
      "Stylist requests"
    ],
    voiceCapabilities: [
      "Multi-stylist scheduling",
      "Service duration awareness",
      "Waitlist management",
      "Confirmation calls"
    ],
    painPoints: [
      "Booking calls interrupting client services?",
      "No-shows hurting revenue?",
      "After-hours booking requests missed?",
      "Staff scheduling conflicts?"
    ],
    relatedIndustries: ["spas", "fitness-centers", "dental-clinics"],
    topLocations: ["dublin", "london", "new-york", "los-angeles", "miami"],
    keywords: ["salon booking AI", "hair salon voice agent", "beauty appointment automation", "salon phone answering"],
    icon: "scissors"
  },

  "spas": {
    slug: "spas",
    name: "Day Spas",
    namePlural: "Spa Owners",
    description: "AI voice agents for spa appointment scheduling, package inquiries, and booking management",
    metaDescription: "VoiceFleet AI handles spa bookings, explains treatments, and manages your schedule. Create a premium experience from the first call.",
    avgCallsPerMonth: 1200,
    automationRate: 85,
    costSavingsPercent: 58,
    avgResponseTime: "< 1 second",
    primaryUseCases: [
      "Treatment bookings",
      "Package inquiries",
      "Gift card sales",
      "Cancellation handling"
    ],
    voiceCapabilities: [
      "Treatment recommendations",
      "Multi-service booking",
      "Therapist preferences",
      "Upselling automation"
    ],
    painPoints: [
      "Complex bookings taking too long?",
      "Treatment explanations repeating?",
      "Last-minute cancellations hurting revenue?",
      "Premium brand experience on phone?"
    ],
    relatedIndustries: ["hair-salons", "fitness-centers", "medical-clinics"],
    topLocations: ["new-york", "los-angeles", "miami", "london", "dublin"],
    keywords: ["spa booking AI", "day spa voice agent", "wellness appointment automation", "spa phone answering"],
    icon: "flower"
  },

  // REAL ESTATE & PROPERTY
  "real-estate": {
    slug: "real-estate",
    name: "Real Estate Agencies",
    namePlural: "Real Estate Agents",
    description: "AI voice agents for property inquiries, showing scheduling, and lead qualification",
    metaDescription: "VoiceFleet AI qualifies buyer leads, schedules showings, and handles property inquiries 24/7. Never miss a hot lead again.",
    avgCallsPerMonth: 1800,
    automationRate: 74,
    costSavingsPercent: 50,
    avgResponseTime: "< 1 second",
    primaryUseCases: [
      "Lead qualification",
      "Showing scheduling",
      "Property inquiries",
      "Open house RSVPs"
    ],
    voiceCapabilities: [
      "CRM integration",
      "Property matching",
      "Agent routing",
      "Buyer/seller classification"
    ],
    painPoints: [
      "Lead response time too slow?",
      "After-hours inquiries going cold?",
      "Showing coordination taking time?",
      "Lead qualification inefficient?"
    ],
    relatedIndustries: ["property-management", "law-firms", "insurance-agencies"],
    topLocations: ["dublin", "london", "new-york", "los-angeles", "miami"],
    keywords: ["real estate AI", "realtor voice agent", "property inquiry automation", "real estate phone"],
    icon: "home"
  },

  "property-management": {
    slug: "property-management",
    name: "Property Management",
    namePlural: "Property Managers",
    description: "AI voice agents for tenant calls, maintenance requests, and rental inquiries",
    metaDescription: "VoiceFleet AI handles tenant maintenance requests, rental inquiries, and emergency calls. Manage more properties with less staff.",
    avgCallsPerMonth: 2400,
    automationRate: 82,
    costSavingsPercent: 60,
    avgResponseTime: "< 1 second",
    primaryUseCases: [
      "Maintenance requests",
      "Rental inquiries",
      "Emergency dispatch",
      "Rent reminders"
    ],
    voiceCapabilities: [
      "Tenant verification",
      "Maintenance ticketing",
      "Emergency routing",
      "Vendor coordination"
    ],
    painPoints: [
      "24/7 maintenance calls unmanageable?",
      "Tenant complaints overwhelming?",
      "Vendor coordination delays?",
      "Leasing inquiries being missed?"
    ],
    relatedIndustries: ["real-estate", "plumbers", "electricians", "hvac"],
    topLocations: ["dublin", "london", "new-york", "chicago", "los-angeles"],
    keywords: ["property management AI", "tenant call automation", "landlord voice agent", "property phone"],
    icon: "building"
  },

  // HOSPITALITY
  "hotels": {
    slug: "hotels",
    name: "Hotels",
    namePlural: "Hotel Operators",
    description: "AI voice agents for reservations, guest services, and concierge requests",
    metaDescription: "VoiceFleet AI handles hotel reservations, guest inquiries, and concierge requests in multiple languages. Deliver 5-star service 24/7.",
    avgCallsPerMonth: 3500,
    automationRate: 78,
    costSavingsPercent: 55,
    avgResponseTime: "< 1 second",
    primaryUseCases: [
      "Reservation booking",
      "Guest inquiries",
      "Concierge services",
      "Check-in support"
    ],
    voiceCapabilities: [
      "Multi-language support",
      "PMS integration",
      "Upselling rooms",
      "Local recommendations"
    ],
    painPoints: [
      "Reservation call volume overwhelming?",
      "Multi-language support gaps?",
      "After-hours booking requests missed?",
      "Guest requests not handled quickly?"
    ],
    relatedIndustries: ["restaurants", "spas", "car-rental"],
    topLocations: ["dublin", "london", "new-york", "las-vegas", "miami"],
    keywords: ["hotel booking AI", "hotel voice agent", "hospitality call automation", "hotel phone"],
    icon: "bed"
  },

  // FITNESS & RECREATION
  "fitness-centers": {
    slug: "fitness-centers",
    name: "Fitness Centers",
    namePlural: "Gym Owners",
    description: "AI voice agents for membership inquiries, class bookings, and gym information",
    metaDescription: "VoiceFleet AI handles gym membership inquiries, books classes, and answers questions. Convert more leads into members.",
    avgCallsPerMonth: 1400,
    automationRate: 84,
    costSavingsPercent: 58,
    avgResponseTime: "< 1 second",
    primaryUseCases: [
      "Membership inquiries",
      "Class bookings",
      "Tour scheduling",
      "Account questions"
    ],
    voiceCapabilities: [
      "Class schedule lookups",
      "Membership tier routing",
      "Tour scheduling",
      "Billing inquiries"
    ],
    painPoints: [
      "Inquiry to tour conversion low?",
      "Class booking calls overwhelming?",
      "Front desk too busy for inquiries?",
      "Member questions taking staff time?"
    ],
    relatedIndustries: ["spas", "hair-salons", "medical-clinics"],
    topLocations: ["dublin", "london", "los-angeles", "new-york", "miami"],
    keywords: ["gym voice AI", "fitness center automation", "membership inquiry handling", "gym phone"],
    icon: "dumbbell"
  },

  // INSURANCE & FINANCE
  "insurance-agencies": {
    slug: "insurance-agencies",
    name: "Insurance Agencies",
    namePlural: "Insurance Agents",
    description: "AI voice agents for quote requests, policy questions, and claims intake",
    metaDescription: "VoiceFleet AI captures insurance leads, answers policy questions, and initiates claims. Provide 24/7 service without 24/7 staff.",
    avgCallsPerMonth: 2000,
    automationRate: 72,
    costSavingsPercent: 52,
    avgResponseTime: "< 1 second",
    primaryUseCases: [
      "Quote requests",
      "Policy questions",
      "Claims intake",
      "Payment inquiries"
    ],
    voiceCapabilities: [
      "Quote qualification",
      "Policy lookup",
      "Claims routing",
      "Carrier coordination"
    ],
    painPoints: [
      "Quote lead volume unmanageable?",
      "After-hours claims calls missed?",
      "Policy questions taking agent time?",
      "Renewal reminders falling behind?"
    ],
    relatedIndustries: ["real-estate", "accounting-firms", "law-firms"],
    topLocations: ["dublin", "london", "new-york", "chicago", "dallas"],
    keywords: ["insurance AI", "insurance voice agent", "quote automation", "insurance phone"],
    icon: "shield"
  }
};

// Get all industry slugs
export const getIndustrySlugs = (): string[] => Object.keys(INDUSTRIES);

// Get industry by slug
export const getIndustry = (slug: string): Industry | null => INDUSTRIES[slug] || null;

// Get related industries
export const getRelatedIndustries = (slug: string): Industry[] => {
  const industry = INDUSTRIES[slug];
  if (!industry) return [];
  return industry.relatedIndustries
    .map(s => INDUSTRIES[s])
    .filter(Boolean);
};

// Search industries
export const searchIndustries = (query: string): Industry[] => {
  const q = query.toLowerCase();
  return Object.values(INDUSTRIES).filter(ind =>
    ind.name.toLowerCase().includes(q) ||
    ind.namePlural.toLowerCase().includes(q) ||
    ind.keywords.some(k => k.includes(q))
  );
};

// Get industries by category
export const getIndustryCategories = (): Record<string, Industry[]> => ({
  "Food & Hospitality": [INDUSTRIES["restaurants"], INDUSTRIES["hotels"]],
  "Healthcare": [INDUSTRIES["dental-clinics"], INDUSTRIES["medical-clinics"]],
  "Home Services": [INDUSTRIES["plumbers"], INDUSTRIES["electricians"], INDUSTRIES["hvac"]],
  "Professional Services": [INDUSTRIES["law-firms"], INDUSTRIES["accounting-firms"]],
  "Automotive": [INDUSTRIES["car-dealerships"], INDUSTRIES["auto-repair"]],
  "Beauty & Wellness": [INDUSTRIES["hair-salons"], INDUSTRIES["spas"], INDUSTRIES["fitness-centers"]],
  "Real Estate": [INDUSTRIES["real-estate"], INDUSTRIES["property-management"]],
  "Insurance & Finance": [INDUSTRIES["insurance-agencies"]]
});

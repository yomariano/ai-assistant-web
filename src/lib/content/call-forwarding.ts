/**
 * Call Forwarding Instructions for Irish Telecom Providers
 *
 * This data is used in the onboarding flow to help users set up
 * call forwarding from their existing phone to their VoiceFleet number.
 */

export interface CallForwardingOption {
  type: 'all' | 'busy' | 'no_answer' | 'unreachable';
  label: string;
  activateCode: string;
  deactivateCode: string;
  description: string;
}

export interface CallForwardingProvider {
  id: string;
  name: string;
  logo?: string;
  type: 'mobile' | 'landline' | 'voip' | 'business';
  network?: string; // Parent network if MVNO
  options: CallForwardingOption[];
  notes?: string[];
  supportUrl?: string;
  supportPhone?: string;
}

export const callForwardingProviders: CallForwardingProvider[] = [
  // ============================================
  // MOBILE NETWORK OPERATORS (MNOs)
  // ============================================
  {
    id: 'eir-mobile',
    name: 'Eir Mobile',
    type: 'mobile',
    options: [
      {
        type: 'all',
        label: 'Forward All Calls',
        activateCode: '**21*{number}#',
        deactivateCode: '##21#',
        description: 'All incoming calls will be forwarded to your VoiceFleet number',
      },
      {
        type: 'busy',
        label: 'Forward When Busy',
        activateCode: '**67*{number}#',
        deactivateCode: '##67#',
        description: 'Calls will forward only when your line is busy',
      },
      {
        type: 'no_answer',
        label: 'Forward When No Answer',
        activateCode: '**61*{number}*11*20#',
        deactivateCode: '##61#',
        description: 'Calls will forward after 20 seconds if not answered',
      },
      {
        type: 'unreachable',
        label: 'Forward When Unreachable',
        activateCode: '**62*{number}#',
        deactivateCode: '##62#',
        description: 'Calls will forward when your phone is off or has no signal',
      },
    ],
    notes: [
      'Replace {number} with your VoiceFleet number including country code (e.g., +353...)',
      'Dial the code directly from your phone app',
      'You\'ll hear a confirmation tone when activated',
    ],
    supportUrl: 'https://www.eir.ie/support/mobile/',
    supportPhone: '1901',
  },
  {
    id: 'vodafone-ireland',
    name: 'Vodafone Ireland',
    type: 'mobile',
    options: [
      {
        type: 'all',
        label: 'Forward All Calls',
        activateCode: '**21*{number}#',
        deactivateCode: '##21#',
        description: 'All incoming calls will be forwarded to your VoiceFleet number',
      },
      {
        type: 'busy',
        label: 'Forward When Busy',
        activateCode: '**67*{number}#',
        deactivateCode: '##67#',
        description: 'Calls will forward only when your line is busy',
      },
      {
        type: 'no_answer',
        label: 'Forward When No Answer',
        activateCode: '**61*{number}**20#',
        deactivateCode: '##61#',
        description: 'Calls will forward after 20 seconds if not answered',
      },
      {
        type: 'unreachable',
        label: 'Forward When Unreachable',
        activateCode: '**62*{number}#',
        deactivateCode: '##62#',
        description: 'Calls will forward when your phone is off or has no signal',
      },
    ],
    notes: [
      'Replace {number} with your VoiceFleet number including country code',
      'You can also set up forwarding via the My Vodafone app',
      'Standard call forwarding rates may apply',
    ],
    supportUrl: 'https://n.vodafone.ie/support/mobile.html',
    supportPhone: '1907',
  },
  {
    id: 'three-ireland',
    name: 'Three Ireland',
    type: 'mobile',
    options: [
      {
        type: 'all',
        label: 'Forward All Calls',
        activateCode: '**21*{number}#',
        deactivateCode: '##21#',
        description: 'All incoming calls will be forwarded to your VoiceFleet number',
      },
      {
        type: 'busy',
        label: 'Forward When Busy',
        activateCode: '**67*{number}#',
        deactivateCode: '##67#',
        description: 'Calls will forward only when your line is busy',
      },
      {
        type: 'no_answer',
        label: 'Forward When No Answer',
        activateCode: '**61*{number}**20#',
        deactivateCode: '##61#',
        description: 'Calls will forward after 20 seconds if not answered',
      },
      {
        type: 'unreachable',
        label: 'Forward When Unreachable',
        activateCode: '**62*{number}#',
        deactivateCode: '##62#',
        description: 'Calls will forward when your phone is off or has no signal',
      },
    ],
    notes: [
      'Replace {number} with your VoiceFleet number including country code',
      'You can also manage forwarding in the 3Plus app',
      'Forwarding to Irish numbers is usually free within your plan',
    ],
    supportUrl: 'https://www.three.ie/support/',
    supportPhone: '1913',
  },

  // ============================================
  // MOBILE VIRTUAL NETWORK OPERATORS (MVNOs)
  // ============================================
  {
    id: 'gomo',
    name: 'GoMo',
    type: 'mobile',
    network: 'Eir',
    options: [
      {
        type: 'all',
        label: 'Forward All Calls',
        activateCode: '**21*{number}#',
        deactivateCode: '##21#',
        description: 'All incoming calls will be forwarded to your VoiceFleet number',
      },
      {
        type: 'busy',
        label: 'Forward When Busy',
        activateCode: '**67*{number}#',
        deactivateCode: '##67#',
        description: 'Calls will forward only when your line is busy',
      },
      {
        type: 'no_answer',
        label: 'Forward When No Answer',
        activateCode: '**61*{number}*11*20#',
        deactivateCode: '##61#',
        description: 'Calls will forward after 20 seconds if not answered',
      },
      {
        type: 'unreachable',
        label: 'Forward When Unreachable',
        activateCode: '**62*{number}#',
        deactivateCode: '##62#',
        description: 'Calls will forward when your phone is off or has no signal',
      },
    ],
    notes: [
      'GoMo uses the Eir network - same codes apply',
      'Replace {number} with your VoiceFleet number including country code',
      'Manage via the GoMo app or dial codes directly',
    ],
    supportUrl: 'https://gomo.ie/help',
  },
  {
    id: '48-mobile',
    name: '48',
    type: 'mobile',
    network: 'Three',
    options: [
      {
        type: 'all',
        label: 'Forward All Calls',
        activateCode: '**21*{number}#',
        deactivateCode: '##21#',
        description: 'All incoming calls will be forwarded to your VoiceFleet number',
      },
      {
        type: 'busy',
        label: 'Forward When Busy',
        activateCode: '**67*{number}#',
        deactivateCode: '##67#',
        description: 'Calls will forward only when your line is busy',
      },
      {
        type: 'no_answer',
        label: 'Forward When No Answer',
        activateCode: '**61*{number}**20#',
        deactivateCode: '##61#',
        description: 'Calls will forward after 20 seconds if not answered',
      },
      {
        type: 'unreachable',
        label: 'Forward When Unreachable',
        activateCode: '**62*{number}#',
        deactivateCode: '##62#',
        description: 'Calls will forward when your phone is off or has no signal',
      },
    ],
    notes: [
      '48 uses the Three network - same codes apply',
      'Replace {number} with your VoiceFleet number including country code',
      'No contract or hidden fees',
    ],
    supportUrl: 'https://48.ie/help',
  },
  {
    id: 'tesco-mobile',
    name: 'Tesco Mobile',
    type: 'mobile',
    network: 'Three',
    options: [
      {
        type: 'all',
        label: 'Forward All Calls',
        activateCode: '**21*{number}#',
        deactivateCode: '##21#',
        description: 'All incoming calls will be forwarded to your VoiceFleet number',
      },
      {
        type: 'busy',
        label: 'Forward When Busy',
        activateCode: '**67*{number}#',
        deactivateCode: '##67#',
        description: 'Calls will forward only when your line is busy',
      },
      {
        type: 'no_answer',
        label: 'Forward When No Answer',
        activateCode: '**61*{number}**20#',
        deactivateCode: '##61#',
        description: 'Calls will forward after 20 seconds if not answered',
      },
      {
        type: 'unreachable',
        label: 'Forward When Unreachable',
        activateCode: '**62*{number}#',
        deactivateCode: '##62#',
        description: 'Calls will forward when your phone is off or has no signal',
      },
    ],
    notes: [
      'Tesco Mobile uses the Three network - same codes apply',
      'Replace {number} with your VoiceFleet number including country code',
      'Manage forwarding via My Tesco Mobile app',
    ],
    supportUrl: 'https://www.tescomobile.ie/help/',
    supportPhone: '1749',
  },
  {
    id: 'sky-mobile',
    name: 'Sky Mobile',
    type: 'mobile',
    network: 'Vodafone',
    options: [
      {
        type: 'all',
        label: 'Forward All Calls',
        activateCode: '**21*{number}#',
        deactivateCode: '##21#',
        description: 'All incoming calls will be forwarded to your VoiceFleet number',
      },
      {
        type: 'busy',
        label: 'Forward When Busy',
        activateCode: '**67*{number}#',
        deactivateCode: '##67#',
        description: 'Calls will forward only when your line is busy',
      },
      {
        type: 'no_answer',
        label: 'Forward When No Answer',
        activateCode: '**61*{number}**20#',
        deactivateCode: '##61#',
        description: 'Calls will forward after 20 seconds if not answered',
      },
      {
        type: 'unreachable',
        label: 'Forward When Unreachable',
        activateCode: '**62*{number}#',
        deactivateCode: '##62#',
        description: 'Calls will forward when your phone is off or has no signal',
      },
    ],
    notes: [
      'Sky Mobile uses the Vodafone network in Ireland',
      'Replace {number} with your VoiceFleet number including country code',
      'Manage via the Sky app or dial codes directly',
    ],
    supportUrl: 'https://www.sky.com/ireland/help/mobile',
    supportPhone: '1800 100 123',
  },
  {
    id: 'lyca-mobile',
    name: 'Lycamobile',
    type: 'mobile',
    network: 'Three',
    options: [
      {
        type: 'all',
        label: 'Forward All Calls',
        activateCode: '**21*{number}#',
        deactivateCode: '##21#',
        description: 'All incoming calls will be forwarded to your VoiceFleet number',
      },
      {
        type: 'busy',
        label: 'Forward When Busy',
        activateCode: '**67*{number}#',
        deactivateCode: '##67#',
        description: 'Calls will forward only when your line is busy',
      },
      {
        type: 'no_answer',
        label: 'Forward When No Answer',
        activateCode: '**61*{number}**20#',
        deactivateCode: '##61#',
        description: 'Calls will forward after 20 seconds if not answered',
      },
      {
        type: 'unreachable',
        label: 'Forward When Unreachable',
        activateCode: '**62*{number}#',
        deactivateCode: '##62#',
        description: 'Calls will forward when your phone is off or has no signal',
      },
    ],
    notes: [
      'Lycamobile uses the Three network in Ireland',
      'Replace {number} with your VoiceFleet number including country code',
      'International call rates may apply for forwarding',
    ],
    supportUrl: 'https://www.lycamobile.ie/en/help/',
    supportPhone: '322',
  },
  {
    id: 'postmobile',
    name: 'An Post Mobile',
    type: 'mobile',
    network: 'Three',
    options: [
      {
        type: 'all',
        label: 'Forward All Calls',
        activateCode: '**21*{number}#',
        deactivateCode: '##21#',
        description: 'All incoming calls will be forwarded to your VoiceFleet number',
      },
      {
        type: 'busy',
        label: 'Forward When Busy',
        activateCode: '**67*{number}#',
        deactivateCode: '##67#',
        description: 'Calls will forward only when your line is busy',
      },
      {
        type: 'no_answer',
        label: 'Forward When No Answer',
        activateCode: '**61*{number}**20#',
        deactivateCode: '##61#',
        description: 'Calls will forward after 20 seconds if not answered',
      },
      {
        type: 'unreachable',
        label: 'Forward When Unreachable',
        activateCode: '**62*{number}#',
        deactivateCode: '##62#',
        description: 'Calls will forward when your phone is off or has no signal',
      },
    ],
    notes: [
      'An Post Mobile uses the Three network',
      'Replace {number} with your VoiceFleet number including country code',
      'Available in all post offices nationwide',
    ],
    supportUrl: 'https://www.anpost.com/Mobile',
  },
  {
    id: 'clear-mobile',
    name: 'Clear Mobile',
    type: 'mobile',
    network: 'Vodafone',
    options: [
      {
        type: 'all',
        label: 'Forward All Calls',
        activateCode: '**21*{number}#',
        deactivateCode: '##21#',
        description: 'All incoming calls will be forwarded to your VoiceFleet number',
      },
      {
        type: 'busy',
        label: 'Forward When Busy',
        activateCode: '**67*{number}#',
        deactivateCode: '##67#',
        description: 'Calls will forward only when your line is busy',
      },
      {
        type: 'no_answer',
        label: 'Forward When No Answer',
        activateCode: '**61*{number}**20#',
        deactivateCode: '##61#',
        description: 'Calls will forward after 20 seconds if not answered',
      },
      {
        type: 'unreachable',
        label: 'Forward When Unreachable',
        activateCode: '**62*{number}#',
        deactivateCode: '##62#',
        description: 'Calls will forward when your phone is off or has no signal',
      },
    ],
    notes: [
      'Clear Mobile uses the Vodafone network',
      'Replace {number} with your VoiceFleet number including country code',
    ],
    supportUrl: 'https://www.clearmobile.ie/help',
  },

  // ============================================
  // LANDLINE PROVIDERS
  // ============================================
  {
    id: 'eir-landline',
    name: 'Eir Landline',
    type: 'landline',
    options: [
      {
        type: 'all',
        label: 'Forward All Calls',
        activateCode: '*21*{number}#',
        deactivateCode: '#21#',
        description: 'All incoming calls will be forwarded to your VoiceFleet number',
      },
      {
        type: 'busy',
        label: 'Forward When Busy',
        activateCode: '*67*{number}#',
        deactivateCode: '#67#',
        description: 'Calls will forward only when your line is busy',
      },
      {
        type: 'no_answer',
        label: 'Forward When No Answer',
        activateCode: '*61*{number}#',
        deactivateCode: '#61#',
        description: 'Calls will forward if not answered after several rings',
      },
    ],
    notes: [
      'Landline forwarding may require activation on your account - call 1901 first',
      'Replace {number} with your VoiceFleet number including area code',
      'Monthly charges may apply for call forwarding feature',
    ],
    supportUrl: 'https://www.eir.ie/support/landline/',
    supportPhone: '1901',
  },
  {
    id: 'virgin-media-landline',
    name: 'Virgin Media Landline',
    type: 'landline',
    options: [
      {
        type: 'all',
        label: 'Forward All Calls',
        activateCode: 'Contact Support',
        deactivateCode: 'Contact Support',
        description: 'Call forwarding must be set up through customer support',
      },
    ],
    notes: [
      'Call forwarding on Virgin Media landlines requires contacting customer support',
      'Call 1908 to request call forwarding activation',
      'A monthly charge may apply for this feature',
      'Once activated, you can manage via your Virgin Media account',
    ],
    supportUrl: 'https://www.virginmedia.ie/help/',
    supportPhone: '1908',
  },
  {
    id: 'vodafone-landline',
    name: 'Vodafone Home Phone',
    type: 'landline',
    options: [
      {
        type: 'all',
        label: 'Forward All Calls',
        activateCode: '*21*{number}#',
        deactivateCode: '#21#',
        description: 'All incoming calls will be forwarded to your VoiceFleet number',
      },
      {
        type: 'no_answer',
        label: 'Forward When No Answer',
        activateCode: '*61*{number}#',
        deactivateCode: '#61#',
        description: 'Calls will forward if not answered after several rings',
      },
    ],
    notes: [
      'Vodafone home phone call forwarding uses standard landline codes',
      'Replace {number} with your VoiceFleet number including area code',
      'Feature may need to be enabled on your account first',
    ],
    supportUrl: 'https://n.vodafone.ie/support/home-broadband.html',
    supportPhone: '1907',
  },
  {
    id: 'sky-landline',
    name: 'Sky Talk',
    type: 'landline',
    options: [
      {
        type: 'all',
        label: 'Forward All Calls',
        activateCode: '*21*{number}#',
        deactivateCode: '#21#',
        description: 'All incoming calls will be forwarded to your VoiceFleet number',
      },
    ],
    notes: [
      'Sky Talk call forwarding may need activation through your Sky account',
      'Replace {number} with your VoiceFleet number',
      'Contact Sky support if codes don\'t work',
    ],
    supportUrl: 'https://www.sky.com/ireland/help/home',
    supportPhone: '1800 100 123',
  },

  // ============================================
  // BUSINESS / VoIP PROVIDERS
  // ============================================
  {
    id: 'generic-voip',
    name: 'VoIP / Cloud Phone System',
    type: 'voip',
    options: [
      {
        type: 'all',
        label: 'Forward All Calls',
        activateCode: 'See admin panel',
        deactivateCode: 'See admin panel',
        description: 'Set up forwarding through your VoIP provider\'s admin dashboard',
      },
    ],
    notes: [
      'Most VoIP systems (RingCentral, 8x8, Blueface, etc.) have a web portal for call forwarding',
      'Look for "Call Forwarding" or "Routing" in your settings',
      'You may need admin access to configure forwarding rules',
      'Some systems support simultaneous ring or hunt groups as alternatives',
    ],
  },
  {
    id: 'blueface',
    name: 'Blueface',
    type: 'voip',
    options: [
      {
        type: 'all',
        label: 'Forward All Calls',
        activateCode: 'Portal: Call Settings > Forwarding',
        deactivateCode: 'Portal: Call Settings > Disable',
        description: 'Configure through the Blueface customer portal',
      },
    ],
    notes: [
      'Log into your Blueface portal at portal.blueface.com',
      'Navigate to Call Settings > Call Forwarding',
      'Enter your VoiceFleet number as the forwarding destination',
      'You can set schedules and conditions for forwarding',
    ],
    supportUrl: 'https://www.blueface.com/support/',
    supportPhone: '01 524 2000',
  },
  {
    id: 'magnet-business',
    name: 'Magnet Business',
    type: 'business',
    options: [
      {
        type: 'all',
        label: 'Forward All Calls',
        activateCode: 'Contact your account manager',
        deactivateCode: 'Contact your account manager',
        description: 'Business call forwarding configured through account management',
      },
    ],
    notes: [
      'Magnet Business phone systems typically require support assistance to configure',
      'Contact your dedicated account manager or call support',
      'Ask about adding VoiceFleet as a hunt group destination',
    ],
    supportUrl: 'https://www.magnetnetworks.com/support',
    supportPhone: '1800 819 888',
  },
  {
    id: 'generic-pbx',
    name: 'Office PBX System',
    type: 'business',
    options: [
      {
        type: 'all',
        label: 'Forward All Calls',
        activateCode: 'Varies by system',
        deactivateCode: 'Varies by system',
        description: 'Configuration depends on your specific PBX system',
      },
    ],
    notes: [
      'Contact your IT administrator or phone system provider',
      'Common PBX systems: Avaya, Cisco, Mitel, Panasonic, Samsung',
      'You\'ll need to add VoiceFleet as an external forwarding destination',
      'Consider using "overflow" or "no answer" forwarding to maintain existing receptionist',
      'We can help configure - contact support@voicefleet.ai',
    ],
  },
];

/**
 * Get providers by type
 */
export function getProvidersByType(type: CallForwardingProvider['type']): CallForwardingProvider[] {
  return callForwardingProviders.filter(p => p.type === type);
}

/**
 * Get all mobile providers (including MVNOs)
 */
export function getMobileProviders(): CallForwardingProvider[] {
  return callForwardingProviders.filter(p => p.type === 'mobile');
}

/**
 * Get all landline providers
 */
export function getLandlineProviders(): CallForwardingProvider[] {
  return callForwardingProviders.filter(p => p.type === 'landline');
}

/**
 * Get all business/VoIP providers
 */
export function getBusinessProviders(): CallForwardingProvider[] {
  return callForwardingProviders.filter(p => p.type === 'voip' || p.type === 'business');
}

/**
 * Get provider by ID
 */
export function getProviderById(id: string): CallForwardingProvider | undefined {
  return callForwardingProviders.find(p => p.id === id);
}

/**
 * Generate the activation code with the actual phone number
 */
export function generateActivationCode(code: string, phoneNumber: string): string {
  return code.replace('{number}', phoneNumber);
}

/**
 * Provider categories for display in the UI
 */
export const providerCategories = [
  {
    id: 'mobile',
    title: 'Mobile Networks',
    description: 'Major Irish mobile operators',
    providers: ['eir-mobile', 'vodafone-ireland', 'three-ireland'],
  },
  {
    id: 'mvno',
    title: 'Budget Mobile',
    description: 'Virtual operators using major networks',
    providers: ['gomo', '48-mobile', 'tesco-mobile', 'sky-mobile', 'lyca-mobile', 'postmobile', 'clear-mobile'],
  },
  {
    id: 'landline',
    title: 'Landline / Home Phone',
    description: 'Traditional landline services',
    providers: ['eir-landline', 'virgin-media-landline', 'vodafone-landline', 'sky-landline'],
  },
  {
    id: 'business',
    title: 'Business / VoIP',
    description: 'Business phone systems and VoIP providers',
    providers: ['blueface', 'magnet-business', 'generic-voip', 'generic-pbx'],
  },
];

export default callForwardingProviders;

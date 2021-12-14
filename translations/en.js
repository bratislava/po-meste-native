export default {
  map: 'Map',
  tickets: 'Tickets',
  ticketDuplicateDescription:
    'SMS ticket not received in 10 minutes or did you accidentally deleted it? No worries, have a duplicate sent to you.',
  ticketDuplicate: 'Send duplicate / 0 €',
  smsTicketTitle: 'Sms ticket',
  smsInfo:
    'SMS lístok platí len na linkách MHD 1 až 212, N1 - N99, X1 - X99. \n Cestujúci by do vozidla MHD mal nastupovať až s prijatou SMS správou. \n Po kliknutí na tlačidlo sa automaticky odošle  sms spoplatnená podľa tarify uvedenej pri konkrétnom type sms lístka.',
  smsNotAvailable: 'This is unfortunate! Sms on this device is not available.',
  smsOK: 'OK',
  whereTo: 'Where to',
  fromPlaceholder: 'From...',
  toPlaceholder: 'To...',
  findRoute: 'Find route',
  workDays: 'Working weeks',
  weekend: 'Weekend',
  holidays: 'Holidays',
  myLocation: 'Position',
  locationChoose: 'Find place',
  confirmLocation: 'Confirm location',
  moveTheMapAndSelectTheDesiredPoint:
    'Move the map and select the desired point.',
  doYouWantToContinue: 'Do you want to continue?',
  cancel: 'Cancel',
  continue: 'Continue',
  send: 'Send',
  thankYou: 'Thank you',
  presentPrice: '€{{price}}',
  privacyPolicy: 'Privacy policy',
  screens: {
    PlannerScreen: {
      screenTitle: 'Planner',
    },
    ChooseLocationScreen: {
      screenTitle: 'Choose location',
    },
    LineTimetableScreen: {
      screenTitle: 'Timetable line %{lineNumber}',
    },
    LineTimelineScreen: {
      screenTitle: 'Timeline line %{lineNumber}',
    },
    FromToScreen: {
      screenTitle: 'Where to?',
    },
    SMSScreen: {
      screenTitle: 'SMS tickets',
      smsModal: {
        title: 'Paid service',
        bodyText:
          'SMS {{ticketName}} is a charged service. You will be charged {{price}} through your mobile carrier.',
        checkboxText: "I understand, don't ask next time.",
      },
      tickets: {
        ticket40min: {
          name: 'Ticket 40 minutes',
        },
        ticket70min: {
          name: 'Ticket 70 minutes',
        },
        ticket24hours: {
          name: 'Ticket 24 hours',
        },
      },
    },
    FeedbackScreen: {
      title: "Oops. What didn't work?",
      text: 'We are sorry that the suggested routes did not meet your expectations :(',
      textAreaPlaceholder:
        "Please describe what didn't work or give us suggestions for improvement...",
      thankYouText:
        'Thanks to your feedback, we are able to constantly improve the app and bring you more relevant routes.',
      backToSearch: 'Back to search',
    },
    SettingsScreen: {
      screenTitle: 'Settings',
      changeLanguage: 'Change language',
      aboutApplication: 'About application',
      frequentlyAskedQuestions: 'Frequently asked questions',
      langugageModal: {
        chooseLanguage: 'Choose language',
        confirm: 'Confirm',
      },
    },
    AboutScreen: {
      screenTitle: 'About application',
      version: 'Version',
      unknown: 'unknown',
      description:
        'En Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, rerum voluptate a vitae eligendi inventore officiis delectus, earum repudiandae asperiores ea, reprehenderit exercitationem corporis accusamus voluptatum ut quia explicabo itaque!',
      contact: 'Contact',
      poweredBy: 'Powered by',
      generalTermsAndConditions: 'General terms and conditions',
      inovationsBratislava: 'Inovations Bratislava',
      coFundedByTheEuropeanUnion: 'Co-funded by the European Union',
    },
    FAQScreen: {
      screenTitle: 'Frequently asked questions',
      questions: {
        question1: {
          question: 'What is app po meste?',
          answer:
            'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        },
        question2: {
          question: 'What does beta version mean?',
          answer:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        },
        question3: {
          question: 'Why are there only sms tickets?',
          answer:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        },
      },
      footerText: "Didn't find the answer to your question? Write to us at ",
    },
  },
  components: {
    feedbackAsker: {
      title: 'Your opinion is important to us!',
      text: 'How do you rate the suggested routes?',
      thankYouTitle: 'Thank you for rating!',
      thankYouText: 'Your feedback helps us improve the app :)',
    },
  },
  searching: 'Searching',
  settings: 'Settings',
  myAddresses: 'My addresses',
  myStops: 'My stops',
  history: 'History',
  choosePlaceFromMap: 'Choose from map',
  permissionLocation: 'Permission to access location was denied',
  openSettings: 'Open settings',
  cancelLocationPermission: 'Cancel',
  validationError: 'Sorry man fault is on our side - validation',
  currentPosition: 'Current position',
  stops: {
    zero: '{{count}} stops',
    one: '{{count}} stop',
    other: '{{count}} stops',
  },
  minutes: {
    zero: '{{count}} minutes',
    one: '{{count}} minute',
    other: '{{count}} minutes',
  },
  minShort: 'Transit {{count}} min',
  distanceShort: '{{count}}m',
  rekolaBikesTitle: 'Rekola bicycles',
  slovnaftbikesTitle: 'Slovnaft BAjk',
  tierTitle: 'TIER scooter',
  zseChargerTitle: 'Charging station/s',
  price: 'Price: ',
  rekolaPriceFrom: 'from {{money}}€/{{time}} min',
  rent: 'Rent {{provider}}',
  availableBikes: 'Available bikes: {{amount}}',
  freeBikeSpaces: 'Free bike spaces: {{amount}}',
  licencePlate: 'Vehicle number: {{id}}',
  batteryCharge: 'Battery: {{amount}}%',
  startZseCharger: 'Start charging',
  chargingPoints: 'Charging connectors',
  chargingPrice: 'charging price: ',
  parkingPrice: 'parking price: ',
  freeParkingTime: 'free parking: ',
  parkingSpaces: '{{amount}} parking spaces',
  providerNames: {
    rekola: 'Rekola',
    slovnaftbajk: 'Slovnaftbajk',
    tier: 'TIER',
  },
  myBike: 'My bike',
  rentedBike: 'Rented bicycles',
  myScooter: 'My scooter',
  rentedScooter: 'Rented scooter',
  openApp: 'Open application {{provider}}',
  from: 'from {{place}}',
  startingIn: 'in {{time}} min',
  beforeIn: 'before {{time}} min',
  upcomingDepartures: 'Upcoming Departures',
  timetables: 'Timetables',
  departure: 'Departure: {{time}}',
  arrival: 'Arrival: {{time}}',
  departureText: 'Departure',
  arrivalText: 'Arrival',
  today: ' (Today)',
  tomorrow: ' (Tomorrow)',
}

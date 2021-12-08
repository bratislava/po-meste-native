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
  fromToScreenTitle: 'Where to?',
  plannerTitle: 'Planner',
  feedbackTitle: 'Feedback',
  chooseLocationTitle: 'Choose location',
  lineTimelineTitle: 'Timeline line %{lineNumber}',
  timetableTitle: 'Timetable line %{lineNumber}',
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
  screens: {
    ticketsScreen: {
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
    feedbackScreen: {
      title: "Oops. What didn't work?",
      text: 'We are sorry that the suggested routes did not meet your expectations :(',
      textAreaPlaceholder:
        "Please describe what didn't work or give us suggestions for improvement...",
      thankYouText:
        'Thanks to your feedback, we are able to constantly improve the app and bring you more relevant routes.',
      backToSearch: 'Back to search',
    },
    settingsScreen: {
      screenTitle: 'Settings',
      changeLanguage: 'Change language',
      aboutApplication: 'About application',
      frequentlyAskedQuestions: 'Frequently asked questions',
      langugageModal: {
        chooseLanguage: 'Choose language',
        confirm: 'Confirm',
      },
    },
    aboutScreen: {
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
  },
  components: {
    feedbackAsker: {
      title: 'Your opinion is important to us!',
      text: 'How do you rate the suggested routes?',
      thankYouTitle: 'Thank you for rating!',
      thankYouText: 'Your feedback helps us improve the app:)',
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

export default {
  common: {
    map: 'Map',
    tickets: 'Tickets',
    weekend: 'Weekend',
    workDays: 'Working weeks',
    holidays: 'Holidays',
    cancel: 'Cancel',
    continue: 'Continue',
    send: 'Send',
    thankYou: 'Thank you',
    presentPrice: '€{{price}}',
    doYouWantToContinue: 'Do you want to continue?',
    privacyPolicy: 'Privacy policy',
    searching: 'Searching',
    settings: 'Settings',
    permissionLocation: 'Permission to access location was denied',
    cancelLocationPermission: 'Cancel',
    openSettings: 'Open settings',
    today: ' (Today)',
    tomorrow: ' (Tomorrow)',
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
    providerNames: {
      rekola: 'Rekola',
      slovnaftbajk: 'Slovnaftbajk',
      tier: 'TIER',
    },
  },
  screens: {
    MapScreen: {
      whereTo: 'Where to',
      rekolaBikesTitle: 'Rekola bicycles',
      slovnaftbikesTitle: 'Slovnaft BAjk',
      tierTitle: 'TIER scooter',
      zseChargerTitle: 'Charging station/s',
      price: 'Price: ',
      dailyTicket: 'daily ticket',
      micromobilityPriceFrom: 'from {{price}}€/{{duration}}{{unit}}',
      micromobilityWithUnlockPriceFrom:
        '{{unlockPrice}}€ + {{price}}€/{{duration}}{{unit}}',
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
      upcomingDepartures: 'Upcoming Departures',
      timetables: 'Timetables',
    },
    PlannerScreen: {
      screenTitle: 'Planner',
      minShort: 'Transit {{count}} min',
      distanceShort: '{{count}}m',
      openApp: 'Open application {{provider}}',
      start: 'Start',
      end: 'End',
    },
    ChooseLocationScreen: {
      screenTitle: 'Choose location',
      confirmLocation: 'Confirm location',
      moveTheMapAndSelectTheDesiredPoint:
        'Move the map and select the desired point.',
    },
    LineTimetableScreen: {
      screenTitle: 'Timetable line %{lineNumber}',
    },
    LineTimelineScreen: {
      screenTitle: 'Timeline line %{lineNumber}',
    },
    FromToScreen: {
      screenTitle: 'Where to?',
      fromPlaceholder: 'From...',
      toPlaceholder: 'To...',
      myBike: 'My bike',
      walk: 'Walk trip',
      transit: 'Transit',
      rentedBike: 'Rented bicycles',
      myScooter: 'My scooter',
      rentedScooter: 'Rented scooter',
      from: 'from {{place}}',
      startingIn: 'in {{time}} min',
      beforeIn: 'before {{time}} min',
      departure: 'Departure: {{time}}',
      arrival: 'Arrival: {{time}}',
      departureText: 'Departure',
      arrivalText: 'Arrival',
      currentPosition: 'Current location',
    },
    SearchFromToScreen: {
      myAddresses: 'My addresses',
      myStops: 'My stops',
      history: 'History',
      choosePlaceFromMap: 'Choose from map',
      currentPosition: 'Current position',
    },
    SMSScreen: {
      screenTitle: 'SMS tickets',
      smsInfo:
        'The SMS ticket is valid only on public transport lines 1 to 212, N1 - N99, X1 - X99. /n The passenger should board the public transport vehicle only with the received SMS message. /n After clicking on the button, an sms will be sent automatically, charged according to the tariff specified for the specific type of sms ticket.',
      ticketDuplicateDescription:
        'SMS ticket not received in 10 minutes or did you accidentally deleted it? No worries, have a duplicate sent to you.',
      ticketDuplicate: 'Send duplicate / 0 €',
      smsOK: 'OK',
      smsNotAvailable:
        'This is unfortunate! Sms on this device is not available.',
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
        'Welcome the first version of MaaS (mobility as a service) app Po meste. We are in the process of making a new open platform which is gonna connect public transport with alternative green mobility. Within a few clicks you can plan or compare your journey with all available means of transport. Bicycle, scooter, tramp or walk, choose your preferable way of transport!',
      contact: 'Contact',
      createdBy: 'Created thanks to',
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
            'Welcome the first version of MaaS (mobility as a service) app Po meste. We are in the process of making a new open platform which is gonna connect public transport with alternative green mobility. Within a few clicks you can plan or compare your journey with all available means of transport. Bicycle, scooter, tramp or walk, choose your preferable way of transport!',
        },
        question2: {
          question: 'Why are there only sms tickets?',
          answer:
            'Implementing the purchase of electronic tickets is one of the most complicated functionalities. Its deployment is not yet complete. In the meantime, we have incorporated into the application at least the possibility of purchasing SMS tickets.',
        },
      },
      footerText: "Didn't find the answer to your question? Write to us at ",
    },
  },
  components: {
    FeedbackAsker: {
      title: 'Your opinion is important to us!',
      text: 'How do you rate the suggested routes?',
      thankYouTitle: 'Thank you for rating!',
      thankYouText: 'Your feedback helps us improve the app :)',
    },
    ErrorView: {
      validationError: 'Sorry man, fault is on our side - validation',
    },
  },
}

export default {
  tabOneTitle: 'Tab One Title',
  tabTwoTitle: 'Tab Two Title',
  map: 'Map',
  tabTwo: 'TabTwo',
  ticketDuplicateDescription:
    'SMS ticket not received in 10 minutes or did you accidentally deleted it? No worries, have a duplicate sent to you.',
  ticketDuplicate: 'Send duplicate / 0 €',
  smsTicketTitle: 'Sms ticket',
  smsInfo:
    'SMS lístok platí len na linkách MHD 1 až 212, N1 - N99, X1 - X99. \n Cestujúci by do vozidla MHD mal nastupovať až s prijatou SMS správou. \n Po kliknutí na tlačidlo sa automaticky odošle  sms spoplatnená podľa tarify uvedenej pri konkrétnom type sms lístka.',
  smsNotAvailable: 'This is unfortunate! Sms on this device is not available.',
  smsOK: 'OK',
  whereTo: 'Where to',
  from: 'From...',
  to: 'To...',
  findRoute: 'Find route',
  lineTimeline: 'Timeline line %{lineNumber}',
  timetable: 'Timetable line %{lineNumber}',
  workDays: 'Working weeks',
  weekend: 'Weekend',
  holidays: 'Holidays',
  myLocation: 'Position',
  locationChoose: 'Find place',
  confirmLocation: 'Confirm location',
  doYouWantToContinue: 'Do you want to continue?',
  cancel: 'Cancel',
  continue: 'Continue',
  presentPrice: '€{{price}}',
  screens: {
    ticketsScreen: {
      SmsModal: {
        title: 'Paid service',
        bodyTexts: {
          ticket40min:
            'SMS ticket 40 minutes is a charged service. You will be charged {{price}} through your mobile carrier.',
          ticket70min:
            'SMS ticket 70 minutes is a charged service. You will be charged {{price}} through your mobile carrier.',
          ticket24hours:
            'SMS ticket 24 hours is a charged service. You will be charged {{price}} through your mobile carrier.',
        },
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
  },
  searching: 'Searching',
  settings: 'Settings',
}

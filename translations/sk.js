export default {
  tabOneTitle: 'Záložka jedna titulok',
  tabTwoTitle: 'Zalozka dva titulok',
  map: 'Mapa',
  tabTwo: 'Tab Dva',
  tickets: 'Lístky',
  ticketDuplicateDescription:
    'SMS lístok nedorazil do 10 minút alebo si ho omylom vymazal? Nevadí, nechaj si zaslať duplikát.',
  ticketDuplicate: 'Zaslať duplikát / 0 €',
  smsTicketTitle: 'Sms lístok',
  smsInfo:
    'SMS lístok platí len na linkách MHD 1 až 212, N1 - N99, X1 - X99. /n Cestujúci by do vozidla MHD mal nastupovať až s prijatou SMS správou. /n Po kliknutí na tlačidlo sa automaticky odošle  sms spoplatnená podľa tarify uvedenej pri konkrétnom type sms lístka.',
  smsNotAvailable: 'Toto je neštastné! Sms na tomto zariadení nieje dostupné.',
  smsOK: 'OK',
  whereTo: 'Kamže kam?',
  from: 'Odkial...',
  to: 'Kam...',
  findRoute: 'Nájdi trasu',
  lineTimeline: 'Časová os linky %{lineNumber}',
  timetable: 'Grafikon linky %{lineNumber}',
  workDays: 'Pracovný týždeň',
  weekend: 'Víkend',
  holidays: 'Prázdniny, sviatky',
  myLocation: 'Moja pozícia',
  locationChoose: 'Vyhľadaj miesto',
  confirmLocation: 'Potvrdiť miesto ',
  doYouWantToContinue: 'Chcete pokračovať?',
  cancel: 'Zrušiť',
  continue: 'Pokračovať',
  presentPrice: '{{price}}€',
  screens: {
    ticketsScreen: {
      SmsModal: {
        title: 'Spoplatnená služba',
        bodyTexts: {
          ticket40min:
            'SMS lístok 40 minút je spoplatnená služba. Bude vám účtovaná suma {{price}} prostredníctvom vášho operátora..',
          ticket70min:
            'SMS lístok 70 minút je spoplatnená služba. Bude vám účtovaná suma {{price}} prostredníctvom vášho operátora.',
          ticket24hours:
            'SMS lístok 24 hodín je spoplatnená služba. Bude vám účtovaná suma {{price}} prostredníctvom vášho operátora.',
        },
      },
      tickets: {
        ticket40min: {
          name: 'Lístok 40 minút',
        },
        ticket70min: {
          name: 'Lístok 70 minút',
        },
        ticket24hours: {
          name: 'Lístok 24 hodín',
        },
      },
    },
  },
  searching: 'Vyhľadávanie',
  settings: 'Nastavenia',
}

export default {
  map: 'Mapa',
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
  fromPlaceholder: 'Odkiaľ idete?',
  toPlaceholder: 'Kamže, kam?',
  findRoute: 'Nájdi trasu',
  lineTimeline: 'Časová os linky %{lineNumber}',
  timetable: 'Grafikon linky %{lineNumber}',
  workDays: 'Pracovný týždeň',
  weekend: 'Víkend',
  holidays: 'Prázdniny, sviatky',
  myLocation: 'Moja pozícia',
  locationChoose: 'Vyhľadaj miesto',
  confirmLocation: 'Potvrdiť miesto ',
  moveTheMapAndSelectTheDesiredPoint: 'Pohnite mapou a zvoľte požadovaný bod.',
  doYouWantToContinue: 'Chcete pokračovať?',
  cancel: 'Zrušiť',
  continue: 'Pokračovať',
  send: 'Odoslať',
  thankYou: 'Ďakujeme',
  presentPrice: '{{price}}€',
  screens: {
    ticketsScreen: {
      smsModal: {
        title: 'Spoplatnená služba',
        bodyText:
          'SMS {{ticketName}} je spoplatnená služba. Bude vám účtovaná suma {{price}} prostredníctvom vášho operátora.',
        checkboxText: 'Rozumiem, nabudúce sa nepýtať.',
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
    feedbackScreen: {
      title: 'Ajaj. Čo nefungovalo?',
      text: 'Mrzí nás, že navrhované trasy nesplnili vaše očakávania :(',
      textAreaPlaceholder:
        'Popíšte, prosím, čo nefungovalo alebo nám napíšte návrh na zlepšenie...',
      thankYouText:
        'Vďaka vašej odozve sme schopní appku stále vylepšovať a prinášať vám relevantnejšie trasy.',
      backToSearch: 'Späť na vyhľadávanie',
    },
  },
  components: {
    feedbackAsker: {
      title: 'Váš názor je pre nás dôležitý!',
      text: 'Ako hodnotíte navrhnuté trasy?',
      thankYouTitle: 'Ďakujeme za hodnotenie!',
      thankYouText: 'Vaša odozva nám pomáha zlepšovať appku :)',
    },
  },
  searching: 'Vyhľadávanie',
  settings: 'Nastavenia',
  myAddresses: 'Moje adresy',
  myStops: 'Moje zastávky',
  history: 'História',
  choosePlaceFromMap: 'Vybrať na mape',
  permissionLocation: 'Povolenie sprístupniť polohu bolo zamietnuté',
  openSettings: 'Otvoriť nastavenia',
  cancelLocationPermission: 'Zrušiť',
  validationError: 'Sorry kámo chyba je na našej strane - validacia',
  currentPosition: 'Aktuálna poloha',
  stops: {
    zero: '{{count}} zastávok',
    one: '{{count}} zastávka',
    few: '{{count}} zastávky',
    many: '{{count}} zastávok',
  },
  minutes: {
    zero: '{{count}} minút',
    one: '{{count}} minúta',
    few: '{{count}} minúty',
    many: '{{count}} minút',
  },
  minShort: 'Presun {{count}} min',
  distanceShort: '{{count}}m',
}

export default {
  common: {
    map: 'Mapa',
    tickets: 'Lístky',
    weekend: 'Víkend',
    workDays: 'Pracovný týždeň',
    holidays: 'Prázdniny, sviatky',
    cancel: 'Zrušiť',
    continue: 'Pokračovať',
    send: 'Odoslať',
    thankYou: 'Ďakujeme',
    presentPrice: '{{price}}€',
    doYouWantToContinue: 'Chcete pokračovať?',
    privacyPolicy: 'Ochrana osobných údajov',
    searching: 'Vyhľadávanie',
    settings: 'Nastavenia',
    permissionLocation: 'Povolenie sprístupniť polohu bolo zamietnuté',
    cancelLocationPermission: 'Zrušiť',
    openSettings: 'Otvoriť nastavenia',
    today: ' (Dnes)',
    tomorrow: ' (Zajtra)',
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
    providerNames: {
      rekola: 'Rekola',
      slovnaftbajk: 'Slovnaftbajk',
      tier: 'TIER',
    },
  },
  screens: {
    MapScreen: {
      whereTo: 'Kamže kam?',
      rekolaBikesTitle: 'Rekola bicykle',
      slovnaftbikesTitle: 'Slovnaft BAjk',
      tierTitle: 'TIER kolobežka',
      zseChargerTitle: 'Nabíjacia stanica/e',
      price: 'Cena: ',
      rekolaPriceFrom: 'od {{money}}€/{{time}} min',
      rent: 'Prenajať {{provider}}',
      availableBikes: 'Voľné bicykle: {{amount}}',
      freeBikeSpaces: 'Voľné doky: {{amount}}',
      licencePlate: 'Číslo vozidla: {{id}}',
      batteryCharge: 'Batéria: {{amount}}%',
      startZseCharger: 'Začať nabíjanie',
      chargingPoints: 'Nabíjacie konektory',
      chargingPrice: 'cena nabíjania: ',
      parkingPrice: 'cena parkovania: ',
      freeParking: 'voľné parkovanie: ',
      parkingSpaces: '{{amount}} miesta',
    },
    PlannerScreen: {
      screenTitle: 'Plánovač',
      minShort: 'Presun {{count}} min',
      distanceShort: '{{count}}m',
      openApp: 'Otvor aplikáciu {{provider}}',
      start: 'Štart',
      end: 'Koniec',
    },
    ChooseLocationScreen: {
      screenTitle: 'Výber miesta',
      confirmLocation: 'Potvrdiť miesto ',
      moveTheMapAndSelectTheDesiredPoint:
        'Pohnite mapou a zvoľte požadovaný bod.',
    },
    LineTimetableScreen: {
      screenTitle: 'Grafikon linky %{lineNumber}',
    },
    LineTimelineScreen: {
      screenTitle: 'Časová os linky %{lineNumber}',
    },
    FromToScreen: {
      screenTitle: 'Kamže, kam?',
      fromPlaceholder: 'Odkiaľ idete?',
      toPlaceholder: 'Kamže, kam?',
      myBike: 'Vlastný bicykel',
      rentedBike: 'Bicykel na prenájom',
      myScooter: 'Vlastná kolobežka',
      rentedScooter: 'Kolobežka na prenájom',
      from: 'zo zastávky {{place}}',
      startingIn: 'za {{time}} min',
      beforeIn: 'pred {{time}} min',
      upcomingDepartures: 'Prichádzajúce spoje',
      timetables: 'Grafikony',
      departure: 'Odchod: {{time}}',
      arrival: 'Príchod: {{time}}',
      departureText: 'Odchod',
      arrivalText: 'Príchod',
    },
    SearchFromToScreen: {
      myAddresses: 'Moje adresy',
      myStops: 'Moje zastávky',
      history: 'História',
      choosePlaceFromMap: 'Vybrať na mape',
      currentPosition: 'Aktuálna poloha',
    },
    SMSScreen: {
      screenTitle: 'SMS lístky',
      smsInfo:
        'SMS lístok platí len na linkách MHD 1 až 212, N1 - N99, X1 - X99. /n Cestujúci by do vozidla MHD mal nastupovať až s prijatou SMS správou. /n Po kliknutí na tlačidlo sa automaticky odošle  sms spoplatnená podľa tarify uvedenej pri konkrétnom type sms lístka.',
      ticketDuplicateDescription:
        'SMS lístok nedorazil do 10 minút alebo si ho omylom vymazal? Nevadí, nechaj si zaslať duplikát.',
      ticketDuplicate: 'Zaslať duplikát / 0 €',
      smsOK: 'OK',
      smsNotAvailable:
        'Toto je neštastné! Sms na tomto zariadení nieje dostupné.',
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
    FeedbackScreen: {
      screenTitle: 'Spätná väzba',
      title: 'Ajaj. Čo nefungovalo?',
      text: 'Mrzí nás, že navrhované trasy nesplnili vaše očakávania :(',
      textAreaPlaceholder:
        'Popíšte, prosím, čo nefungovalo alebo nám napíšte návrh na zlepšenie...',
      thankYouText:
        'Vďaka vašej odozve sme schopní appku stále vylepšovať a prinášať vám relevantnejšie trasy.',
      backToSearch: 'Späť na vyhľadávanie',
    },
    SettingsScreen: {
      screenTitle: 'Nastavenia',
      changeLanguage: 'Zmena jazyka',
      aboutApplication: 'O aplikácii',
      frequentlyAskedQuestions: 'Často kladené otázky',
      langugageModal: {
        chooseLanguage: 'Zvoľte jazyk',
        confirm: 'Potvrdiť',
      },
    },
    AboutScreen: {
      screenTitle: 'O aplikácii',
      version: 'Verzia',
      unknown: 'neznáma',
      description:
        'Pred Vami sa nachádza prvá verzia MaaS (mobilita ako služba) aplikácie Po meste.  Pre Bratislavu postupne vytvárame otvorenú platformu, ktorá prepojí MHD s alternatívnou mobilitou a ponúkne na jednom mieste zelenú mobilitu od plánovania, porovnania a jazdy na pár klikov. Po meste peši, bicyklom, kolobežkou alebo električkou ? Je to na Vás.',
      contact: 'Kontakt',
      createdBy: 'Vytvorené vďaka',
      generalTermsAndConditions: 'Všeobecné obchodné podmienky',
      inovationsBratislava: 'Inovácie mesta Bratislava',
      coFundedByTheEuropeanUnion: 'Spolufinancované Európskou úniou',
    },
    FAQScreen: {
      screenTitle: 'Často kladené otázky',
      questions: {
        question1: {
          question: 'Čo je aplikácia po meste?',
          answer:
            'Pred Vami sa nachádza prvá verzia MaaS (mobilita ako služba) aplikácie Po meste. Pre Bratislavu postupne vytvárame otvorenú platformu, ktorá prepojí MHD s alternatívnou mobilitou a ponúkne na jednom mieste zelenú mobilitu od plánovania, porovnania a jazdy na pár klikov. Po meste peši, bicyklom, kolobežkou alebo električkou ? Je to na Vás.',
        },
        question2: {
          question: 'Prečo su na výber len sms lístky?',
          answer:
            'Implementácia nákupu elektronických lístkov patrí medzi najkomplikovanejšie funkcionality. Jej nasadenie nie je v tomto momente ešte dokončené. Medzičasom sme zakomponovali do aplikácie aspoň môžnosť nákupu SMS lístkov.',
        },
      },
      footerText: 'Nenašli ste odpoveď na svoju otázku? Napíšte nám na ',
    },
  },
  components: {
    FeedbackAsker: {
      title: 'Váš názor je pre nás dôležitý!',
      text: 'Ako hodnotíte navrhnuté trasy?',
      thankYouTitle: 'Ďakujeme za hodnotenie!',
      thankYouText: 'Vaša odozva nám pomáha zlepšovať appku :)',
    },
    ErrorView: {
      validationError: 'Sorry kámo, chyba je na našej strane - validacia',
    },
  },
}

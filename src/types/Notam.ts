export interface NotamList {
    notamList: Notam[];
    startRecordCount: number;
    endRecordCount: number;
    totalNotamCount: number;
    filteredResultCount: number;
    criteriaCaption: string;
    searchDateTime: string;
    linkedLocationCaption: string;
    error: string;
    countsByType: CountByType[];
    requestID: number;
  }
  
 export interface Notam {
    facilityDesignator: string;
    notamNumber: string;
    featureName: string;
    issueDate: string;
    startDate: string;
    endDate: string;
    source: string;
    sourceType: string;
    icaoMessage: string;
    traditionalMessage: string;
    plainLanguageMessage: string;
    traditionalMessageFrom4thWord: string;
    icaoId: string;
    accountId: number;
    airportName: string;
    procedure: boolean;
    userID: number;
    transactionID: number;
    cancelledOrExpired: boolean;
    digitalTppLink: boolean;
    status: string;
    contractionsExpandedForPlainLanguage: boolean;
    keyword: string;
    snowtam: boolean;
    geometry: string;
    digitallyTransformed: boolean;
    messageDisplayed: string;
    hasHistory: boolean;
    moreThan300Chars: boolean;
    showingFullText: boolean;
    locID: number;
    defaultIcao: boolean;
    crossoverTransactionID: number;
    crossoverAccountID: string;
    mapPointer: string;
    requestID: number;
  }
  
 export interface CountByType {
    name: string;
    value: number;
  }
  
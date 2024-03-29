import {
    QUOTAS,
    METHODS,
    METHODS_FOR_KCP,
    METHODS_FOR_UPLUS,
    METHODS_FOR_INICIS,
    METHODS_FOR_MOBILIANS,
    METHOD_FOR_CARD,
    METHOD_FOR_PHONE,
    METHOD_FOR_VBANK,
  } from './constants';
  
  export function getQuotas(pg) {
    switch (pg) {
      case 'html5_inicis':
      case 'kcp': {
        return QUOTAS.concat([
          {
            value: 2,
            label: '2개월',
          },
          {
            value: 3,
            label: '3개월',
          },
          {
            value: 4,
            label: '4개월',
          },
          {
            value: 5,
            label: '5개월',
          },
          {
            value: 6,
            label: '6개월',
          },
        ]);
      }
      default:
        return QUOTAS;
    }
  }
  
  export function getMethods(pg) {
    switch(pg) {
      case 'html5_inicis': {
        return METHODS_FOR_INICIS;
      }
      case 'kcp': {
        return METHODS_FOR_KCP;
      }
      case 'kcp_billing':
      case 'kakaopay':
      case 'kakao':
      case 'paypal':
      case 'payco': 
      case 'smilepay': {
        return METHOD_FOR_CARD;
      }
      case 'uplus': {
        return METHODS_FOR_UPLUS;
      }
      case 'danal': {
        return METHOD_FOR_PHONE;
      }
      case 'mobilians': {
        return METHODS_FOR_MOBILIANS;
      }
      case 'settle': {
        return METHOD_FOR_VBANK;
      }
      default:
        return METHODS;
    }
  }
  
  export function getUserCode(pg) {
    switch(pg) {
      case 'uplus' :
        return 'imp98942114';
      case 'inicis' :
      case 'html5_inicis' :
        return 'imp98942114';
      case 'kakao':
        return 'imp98942114';
      case 'paypal':
        return 'imp98942114';
      case 'mobilians':
        return 'imp98942114';
      case 'naverco':
      case 'naverpay':
        return 'imp98942114';
      default:
        return 'imp98942114';
    }
  }
import { calculateTax, VERSION_ID } from '../calculateTax';
import { Transaction } from '../models/Transaction';

const TIME_LIMIT = 200;

function verify(actual: Transaction, expected: Transaction): void {
  calculateTax(actual);
  expect(actual.lines.length)
    .toBe(expected.lines.length);
  for (let i = 0; i < actual.lines.length; i += 1) {
    expect(actual.lines[i].calculatedTax)
      .toEqual(expected.lines[i].calculatedTax);
  }
  expect(actual.calculatedTaxSummary)
    .toEqual(expected.calculatedTaxSummary);
  expect(actual.processingInfo.versionId)
    .toBe(VERSION_ID);
  expect(actual.processingInfo.duration)
    .toBeLessThan(TIME_LIMIT);
}

it(
  `case 0
  lines == []`,
  () => {
    verify(actual00, expected00);
  }
);

it(
  `case 1
  emitter.taxRegime != 'individual'
  receiver.type == 'cityGovernment'
  line.useType not in {'resale', 'production'}`,
  () => { verify(actual01, expected01); }
);

it(
  `case 2
  emitter.taxRegime != 'individual'
  receiver.type == 'stateGovernment'`,
  () => { verify(actual02, expected02); }
);

it(
  `case 3
  emitter.taxRegime != 'individual'
  receiver.type == 'federalGovernment'`,
  () => { verify(actual03, expected03); }
);

it(
  `case 4
  emitter.taxRegime == 'individual'
  item[0].typeProduct == 'product'`,
  () => { verify(actual04, expected04); }
);

/*
case 0
  lines == []
*/
const actual00: Transaction = {
  header: {
    transactionType: 'Sale',
    location: {
      address: { cityName: 'Florianópolis', state: 'SC' }
    },
    entity: {
      address: { cityName: 'São Paulo', state: 'SP' }
    }
  },
  lines: []
};
const expected00: Transaction = {
  header: { ...actual00.header },
  lines: [],
  calculatedTaxSummary: {
    numberOfLines: 0,
    subtotal: 0,
    totalTax: 0,
    grandTotal: 0,
    taxByType: {
      iec: {
        tax: 0,
        jurisdictions: [{
          jurisdictionType: 'Country',
          jurisdictionName: 'Brasil',
          tax: 0
        }]
      },
      ist: {
        tax: 0,
        jurisdictions: [{
          jurisdictionType: 'State',
          jurisdictionName: 'SP',
          tax: 0
        }]
      },
      isc: {
        tax: 0,
        jurisdictions: [{
          jurisdictionType: 'City',
          jurisdictionName: 'Florianópolis',
          tax: 0
        }]
      }
    }
  }
};

/*
case 1
  emitter.taxRegime != 'individual'
  receiver.type == 'cityGovernment'
  line.useType not in {'resale', 'production'}
*/
const actual01: Transaction = {
  header: {
    transactionType: 'Sale',
    location: {
      taxRegime: 'realProfit',
      address: { cityName: 'Florianópolis', state: 'SC' }
    },
    entity: {
      type: 'cityGovernment',
      address: { cityName: 'São Paulo', state: 'SP' }
    }
  },
  lines: [
    {
      numberOfItems: 2,
      itemPrice: 45,
      otherCostAmount: 10,
      lineDiscount: 10,
      item: { productType: 'product' }
    }
  ]
};
const expected01: Transaction = {
  header: { ...actual01.header },
  lines: [
    {
      ...actual01.lines[0],
      calculatedTax: {
        tax: 12.88,
        CST: '34',
        taxDetails: {
          iec: {
            jurisdictionType: 'Country',
            jurisdictionName: 'Brasil',
            taxType: 'IEC',
            scenario: 'Calculation Exempt',
            calcBase: 90,
            rate: 0,
            fact: 0,
            tax: 0
          },
          ist: {
            jurisdictionType: 'State',
            jurisdictionName: 'SP',
            taxType: 'IST',
            scenario: 'Calculation Fixed',
            calcBase: 100,
            rate: 0.14,
            fact: 0.08,
            tax: 12.88
          },
          isc: {
            jurisdictionType: 'City',
            jurisdictionName: 'Florianópolis',
            taxType: 'ISC',
            scenario: 'Calculation Exempt',
            calcBase: 90,
            rate: 0,
            fact: 0,
            tax: 0
          }
        }
      }
    }
  ],
  calculatedTaxSummary: {
    numberOfLines: 1,
    subtotal: 80,
    totalTax: 12.88,
    grandTotal: 92.88,
    taxByType: {
      iec: {
        tax: 0,
        jurisdictions: [{
          jurisdictionType: 'Country',
          jurisdictionName: 'Brasil',
          tax: 0
        }]
      },
      ist: {
        tax: 12.88,
        jurisdictions: [{
          jurisdictionType: 'State',
          jurisdictionName: 'SP',
          tax: 12.88
        }]
      },
      isc: {
        tax: 0,
        jurisdictions: [{
          jurisdictionType: 'City',
          jurisdictionName: 'Florianópolis',
          tax: 0
        }]
      }
    }
  }
};

/*
case 2
  emitter.taxRegime != 'individual'
  receiver.type == 'stateGovernment'
*/
const actual02: Transaction = {
  header: {
    transactionType: 'Purchase',
    location: {
      type: 'stateGovernment',
      address: { cityName: 'São Paulo', state: 'SP' }
    },
    entity: {
      taxRegime: 'realProfit',
      address: { cityName: 'Florianópolis', state: 'SC' }
    }
  },
  lines: [
    {
      numberOfItems: 1,
      itemPrice: 150,
      lineAmount: 110,
      otherCostAmount: 10,
      lineDiscount: 20,
      item: { productType: 'product' }
    }
  ]
};
const expected02: Transaction = {
  header: { ...actual02.header },
  lines: [
    {
      ...actual02.lines[0],
      calculatedTax: {
        tax: 0,
        CST: '35',
        taxDetails: {
          iec: {
            jurisdictionType: 'Country',
            jurisdictionName: 'Brasil',
            taxType: 'IEC',
            scenario: 'Calculation Exempt',
            calcBase: 100,
            rate: 0,
            fact: 0,
            tax: 0
          },
          ist: {
            jurisdictionType: 'State',
            jurisdictionName: 'SP',
            taxType: 'IST',
            scenario: 'Calculation Exempt',
            calcBase: 100,
            rate: 0,
            fact: 0,
            tax: 0
          },
          isc: {
            jurisdictionType: 'City',
            jurisdictionName: 'Florianópolis',
            taxType: 'ISC',
            scenario: 'Calculation Exempt',
            calcBase: 100,
            rate: 0,
            fact: 0,
            tax: 0
          }
        }
      }
    }
  ],
  calculatedTaxSummary: {
    numberOfLines: 1,
    subtotal: 90,
    totalTax: 0,
    grandTotal: 90,
    taxByType: {
      iec: {
        tax: 0,
        jurisdictions: [
          {
            jurisdictionType: 'Country',
            jurisdictionName: 'Brasil',
            tax: 0
          }
        ]
      },
      ist: {
        tax: 0,
        jurisdictions: [
          {
            jurisdictionType: 'State',
            jurisdictionName: 'SP',
            tax: 0
          }
        ]
      },
      isc: {
        tax: 0,
        jurisdictions: [
          {
            jurisdictionType: 'City',
            jurisdictionName: 'Florianópolis',
            tax: 0
          }
        ]
      }
    }
  }
};

/*
case 3
  emitter.taxRegime != 'individual'
  receiver.type == 'federalGovernment'
*/
const actual03: Transaction = {
  header: {
    transactionType: 'Sale',
    location: {
      taxRegime: 'realProfit',
      address: { cityName: 'Florianópolis', state: 'SC' }
    },
    entity: {
      type: 'federalGovernment',
      address: { cityName: 'São Paulo', state: 'SP' }
    }
  },
  lines: [
    {
      numberOfItems: 1,
      itemPrice: 100,
      item: { productType: 'product' }
    }
  ]
};
const expected03: Transaction = {
  header: { ...actual03.header },
  lines: [
    {
      ...actual03.lines[0],
      calculatedTax: {
        tax: 0,
        CST: '36',
        taxDetails: {
          iec: {
            jurisdictionType: 'Country',
            jurisdictionName: 'Brasil',
            taxType: 'IEC',
            scenario: 'Calculation Exempt',
            calcBase: 100,
            rate: 0,
            fact: 0,
            tax: 0
          },
          ist: {
            jurisdictionType: 'State',
            jurisdictionName: 'SP',
            taxType: 'IST',
            scenario: 'Calculation Exempt',
            calcBase: 100,
            rate: 0,
            fact: 0,
            tax: 0
          },
          isc: {
            jurisdictionType: 'City',
            jurisdictionName: 'Florianópolis',
            taxType: 'ISC',
            scenario: 'Calculation Exempt',
            calcBase: 100,
            rate: 0,
            fact: 0,
            tax: 0
          }
        }
      }
    }
  ],
  calculatedTaxSummary: {
    numberOfLines: 1,
    subtotal: 100,
    totalTax: 0,
    grandTotal: 100,
    taxByType: {
      iec: {
        tax: 0,
        jurisdictions: [
          {
            jurisdictionType: 'Country',
            jurisdictionName: 'Brasil',
            tax: 0
          }
        ]
      },
      ist: {
        tax: 0,
        jurisdictions: [
          {
            jurisdictionType: 'State',
            jurisdictionName: 'SP',
            tax: 0
          }
        ]
      },
      isc: {
        tax: 0,
        jurisdictions: [
          {
            jurisdictionType: 'City',
            jurisdictionName: 'Florianópolis',
            tax: 0
          }
        ]
      }
    }
  }
};

/*
case 4
  emitter.taxRegime == 'individual'
  item[0].typeProduct == 'product'
*/
const actual04: Transaction = {
  header: {
    transactionType: 'Sale',
    location: {
      taxRegime: 'individual',
      address: { cityName: 'Florianópolis', state: 'SC' }
    },
    entity: {
      address: { cityName: 'São Paulo', state: 'SP' }
    }
  },
  lines: [
    {
      numberOfItems: 2,
      itemPrice: 45,
      otherCostAmount: 20,
      lineDiscount: 10,
      item: { productType: 'product' }
    }
  ]
};
const expected04: Transaction = {
  header: { ...actual04.header },
  lines: [
    {
      ...actual04.lines[0],
      calculatedTax: {
        tax: 14.16,
        CST: '99',
        taxDetails: {
          iec: {
            jurisdictionType: 'Country',
            jurisdictionName: 'Brasil',
            taxType: 'IEC',
            scenario: 'Calculation Exempt',
            calcBase: 100,
            rate: 0,
            fact: 0,
            tax: 0
          },
          ist: {
            jurisdictionType: 'State',
            jurisdictionName: 'SP',
            taxType: 'IST',
            scenario: 'Calculation Fixed',
            calcBase: 110,
            rate: 0.14,
            fact: 0.08,
            tax: 14.16
          },
          isc: {
            jurisdictionType: 'City',
            jurisdictionName: 'Florianópolis',
            taxType: 'ISC',
            scenario: 'Calculation Exempt',
            calcBase: 100,
            rate: 0,
            fact: 0,
            tax: 0
          }
        }
      }
    }
  ],
  calculatedTaxSummary: {
    numberOfLines: 1,
    subtotal: 80,
    totalTax: 14.16,
    grandTotal: 94.16,
    taxByType: {
      iec: {
        tax: 0,
        jurisdictions: [
          {
            jurisdictionType: 'Country',
            jurisdictionName: 'Brasil',
            tax: 0
          }
        ]
      },
      ist: {
        tax: 14.16,
        jurisdictions: [
          {
            jurisdictionType: 'State',
            jurisdictionName: 'SP',
            tax: 14.16
          }
        ]
      },
      isc: {
        tax: 0,
        jurisdictions: [
          {
            jurisdictionType: 'City',
            jurisdictionName: 'Florianópolis',
            tax: 0
          }
        ]
      }
    }
  }
};

import { calculateTax, VERSION_ID } from '../calculateTax';
import { Transaction } from '../models/Transaction';

const TIME_LIMIT = 200;
let actual: Transaction;
let expected: Transaction;

function verify(): void {
  calculateTax(actual);
  expect(actual.lines.length)
    .toBe(expected.lines.length);
  for (let i = 0; i < length; i += 1) {
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

describe('calculateTax', () => {
  it('should accept transaction with no lines', () => {
    actual = {
      header: {},
      lines: []
    };
    expected = {
      header: {},
      lines: [],
      calculatedTaxSummary: {
        numberOfLines: 0,
        subtotal: 0,
        totalTax: 0,
        grandTotal: 0,
        taxByType: {
          iec: {
            tax: 0,
            jurisdictions: []
          },
          ist: {
            tax: 0,
            jurisdictions: []
          },
          isc: {
            tax: 0,
            jurisdictions: []
          }
        }
      }
    };
    verify();
  });

  // case 1 spec
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
        numberOfItems: 1,
        itemPrice: 100,
        useType: 'use',
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
              scenario: 'Exempt',
              calcBase: 100,
              rate: 0,
              fact: 0,
              tax: 0
            },
            ist: {
              jurisdictionType: 'State',
              jurisdictionName: 'SP',
              taxType: 'IST',
              scenario: 'Fixed',
              calcBase: 100,
              rate: 0.14,
              fact: 0.08,
              tax: 12.88
            },
            isc: {
              jurisdictionType: 'City',
              jurisdictionName: 'Florianópolis',
              taxType: 'ISC',
              scenario: 'Exempt',
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
      totalTax: 12.88,
      grandTotal: 112.88,
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
          tax: 12.88,
          jurisdictions: [
            {
              jurisdictionType: 'State',
              jurisdictionName: 'SP',
              tax: 12.88
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
  it('should calculate tax, case 1', () => {
    actual = actual01;
    expected = expected01;
    verify();
  });
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const calculateTax_1 = require("../calculateTax");
const TIME_LIMIT = 200;
function verify(actual, expected) {
    calculateTax_1.calculateTax(actual);
    expect(actual.lines.length)
        .toBe(expected.lines.length);
    for (let i = 0; i < actual.lines.length; i += 1) {
        expect(actual.lines[i].calculatedTax)
            .toEqual(expected.lines[i].calculatedTax);
    }
    expect(actual.calculatedTaxSummary)
        .toEqual(expected.calculatedTaxSummary);
    expect(actual.processingInfo.versionId)
        .toBe(calculateTax_1.VERSION_ID);
    expect(actual.processingInfo.duration)
        .toBeLessThan(TIME_LIMIT);
}
it(`case 0
  lines == []`, () => {
    verify(actual00, expected00);
});
it(`case 1
  emitter.taxRegime != 'individual'
  receiver.type == 'cityGovernment'
  line[0].useType not in {'resale', 'production'}
  line[0].productType == 'product'`, () => { verify(actual01, expected01); });
it(`case 2
  emitter.taxRegime != 'individual'
  receiver.type == 'stateGovernment'`, () => { verify(actual02, expected02); });
it(`case 3
  emitter.taxRegime != 'individual'
  receiver.type == 'federalGovernment'`, () => { verify(actual03, expected03); });
it(`case 4
  emitter.taxRegime == 'individual'
  line[0].item.productType == 'product'
  line[0].useType not in {'use', 'consumption', 'resale', 'production'}
  item[1].item.productType == 'merchandise'
  line[1].useType not in {'use', 'consumption', 'resale', 'production'}`, () => { verify(actual04, expected04); });
const actual00 = {
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
const expected00 = {
    header: Object.assign({}, actual00.header),
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
const actual01 = {
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
const expected01 = {
    header: Object.assign({}, actual01.header),
    lines: [
        Object.assign({}, actual01.lines[0], { calculatedTax: {
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
            } })
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
const actual02 = {
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
const expected02 = {
    header: Object.assign({}, actual02.header),
    lines: [
        Object.assign({}, actual02.lines[0], { calculatedTax: {
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
            } })
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
const actual03 = {
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
const expected03 = {
    header: Object.assign({}, actual03.header),
    lines: [
        Object.assign({}, actual03.lines[0], { calculatedTax: {
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
            } })
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
const actual04 = {
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
    lines: [{
            numberOfItems: 2,
            itemPrice: 45,
            otherCostAmount: 20,
            lineDiscount: 10,
            item: { productType: 'product' }
        }, {
            numberOfItems: 2,
            itemPrice: 45,
            otherCostAmount: 20,
            lineDiscount: 10,
            item: {
                productType: 'merchandise',
                federalTax: {
                    IEC: { rate: 0.1 },
                    IST: { rate: 0.05 },
                    ISC: { rate: 0.02 }
                }
            }
        }]
};
const expected04 = {
    header: Object.assign({}, actual04.header),
    lines: [Object.assign({}, actual04.lines[0], { calculatedTax: {
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
                },
                tax: 14.16
            } }), Object.assign({}, actual04.lines[0], { calculatedTax: {
                CST: '50',
                taxDetails: {
                    iec: {
                        jurisdictionType: 'Country',
                        jurisdictionName: 'Brasil',
                        taxType: 'IEC',
                        scenario: 'Calculation Simple',
                        calcBase: 100,
                        rate: 0.1,
                        fact: 0,
                        tax: 10
                    },
                    ist: {
                        jurisdictionType: 'State',
                        jurisdictionName: 'SP',
                        taxType: 'IST',
                        scenario: 'Calculation Simple',
                        calcBase: 100,
                        rate: 0.05,
                        fact: 0,
                        tax: 5
                    },
                    isc: {
                        jurisdictionType: 'City',
                        jurisdictionName: 'Florianópolis',
                        taxType: 'ISC',
                        scenario: 'Calculation Simple',
                        calcBase: 100,
                        rate: 0.02,
                        fact: 0,
                        tax: 2
                    }
                },
                tax: 17
            } })],
    calculatedTaxSummary: {
        numberOfLines: 2,
        subtotal: 160,
        totalTax: 14.16 + 17,
        grandTotal: 160 + 14.16 + 17,
        taxByType: {
            iec: {
                tax: 10,
                jurisdictions: [{
                        jurisdictionType: 'Country',
                        jurisdictionName: 'Brasil',
                        tax: 10
                    }]
            },
            ist: {
                tax: 14.16 + 5,
                jurisdictions: [{
                        jurisdictionType: 'State',
                        jurisdictionName: 'SP',
                        tax: 14.16 + 5
                    }]
            },
            isc: {
                tax: 2,
                jurisdictions: [{
                        jurisdictionType: 'City',
                        jurisdictionName: 'Florianópolis',
                        tax: 2
                    }]
            }
        }
    }
};

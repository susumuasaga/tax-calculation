"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const calculateTax_1 = require("../calculateTax");
const TIME_LIMIT = 200;
function verify(given, expected) {
    calculateTax_1.calculateTax(given);
    expect(given.lines.length)
        .toBe(expected.lines.length);
    for (let i = 0; i < given.lines.length; i += 1) {
        expect(given.lines[i].calculatedTax)
            .toEqual(expected.lines[i].calculatedTax);
    }
    expect(given.calculatedTaxSummary)
        .toEqual(expected.calculatedTaxSummary);
    expect(given.processingInfo.versionId)
        .toBe(calculateTax_1.VERSION_ID);
    expect(given.processingInfo.duration)
        .toBeLessThan(TIME_LIMIT);
}
it(`case 0
  lines == []`, () => {
    verify(given00, expected00);
});
it(`case 1
  emitter.taxRegime != 'individual'
  receiver.type == 'cityGovernment'
  line[0].useType not in {'resale', 'production'}
  line[0].productType == 'product'`, () => { verify(given01, expected01); });
it(`case 2
  emitter.taxRegime != 'individual'
  receiver.type == 'stateGovernment'`, () => { verify(given02, expected02); });
it(`case 3
  emitter.taxRegime != 'individual'
  receiver.type == 'federalGovernment'`, () => { verify(given03, expected03); });
it(`case 4
  emitter.taxRegime == 'individual'
  receiver.suframa != undefined
  line[0].item.productType == 'product'
  line[0].useType not in {'use', 'consumption', 'resale', 'production'}
  item[1].item.productType == 'merchandise'
  line[1].useType not in {'use', 'consumption', 'resale', 'production'}`, () => { verify(given04, expected04); });
it(`case 5
  transactionDate.month == 1
  emitter.taxRegime == 'simplified'
  receiver.type not in {
    'cityGovernment',
    'stateGovernment',
    'federalGovernment'
  }
  receiver.cityCode = 1302603
  line[0].item.productType == 'product'
  line[0].useType == 'resale'
  line[1].item.productType == 'merchandise'
  line[1].useType == 'resale'`, () => { verify(given05, expected05); });
it(`case 6
  transactionDate.month == 5
  emitter.taxRegime == 'realProfit'
  receiver.type not in {
    'cityGovernment',
    'stateGovernment',
    'federalGovernment'
  }
  receiver.address.state == emitter.address.state
  line[0].item.productType == 'product'
  line[0].useType == 'production'
  line[1].item.productType == 'merchandise'
  line[1].useType == 'use'
  line[2].item.productType == 'merchandise'
  line[2].useType == 'resale'`, () => { verify(given06, expected06); });
it(`case 7
  transactionDate.month == 10
  emitter.taxRegime == 'estimatedProfit'
  receiver.type not in {
    'cityGovernment',
    'stateGovernment',
    'federalGovernment'
  }
  receiver.address.state != emitter.address.state
  line[0].item.productType == 'product'
  line[0].useType == 'consumption'
  line[1].item.productType == 'product'
  line[1].useType == 'production'
  line[2].item.productType == 'merchandise'
  line[2].useType == 'resale'`, () => { verify(given07, expected07); });
it(`case 8
  transactionDate == '2018-05-15'
  emitter.taxRegime == 'estimatedProfit'
  receiver.type not in {
    'cityGovernment',
    'stateGovernment',
    'federalGovernment'
  }
  line[0].item.productType == 'merchandise'
  line[0].useType == 'resale'`, () => { verify(given08, expected08); });
const given00 = {
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
    header: Object.assign({}, given00.header),
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
const given01 = {
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
    header: Object.assign({}, given01.header),
    lines: [
        Object.assign({}, given01.lines[0], { calculatedTax: {
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
const given02 = {
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
    header: Object.assign({}, given02.header),
    lines: [
        Object.assign({}, given02.lines[0], { calculatedTax: {
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
const given03 = {
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
    header: Object.assign({}, given03.header),
    lines: [
        Object.assign({}, given03.lines[0], { calculatedTax: {
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
const given04 = {
    header: {
        transactionType: 'Sale',
        location: {
            taxRegime: 'individual',
            address: { cityName: 'Florianópolis', state: 'SC' }
        },
        entity: {
            suframa: '12345678',
            address: { cityName: 'São Paulo', state: 'SP' }
        }
    },
    lines: [{
            numberOfItems: 1,
            itemPrice: 45,
            otherCostAmount: 10,
            lineDiscount: 5,
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
                    ISC: { rate: 0.1 }
                }
            }
        }]
};
const expected04 = {
    header: Object.assign({}, given04.header),
    lines: [Object.assign({}, given04.lines[0], { calculatedTax: {
                CST: '99',
                taxDetails: {
                    iec: {
                        jurisdictionType: 'Country',
                        jurisdictionName: 'Brasil',
                        taxType: 'IEC',
                        scenario: 'Calculation Exempt',
                        calcBase: 50,
                        rate: 0,
                        fact: 0,
                        tax: 0
                    },
                    ist: {
                        jurisdictionType: 'State',
                        jurisdictionName: 'SP',
                        taxType: 'IST',
                        scenario: 'Calculation Fixed',
                        calcBase: 55,
                        rate: 0.14,
                        fact: 0.08,
                        tax: 7.08
                    },
                    isc: {
                        jurisdictionType: 'City',
                        jurisdictionName: 'Florianópolis',
                        taxType: 'ISC',
                        scenario: 'Calculation Exempt',
                        calcBase: 50,
                        rate: 0,
                        fact: 0,
                        tax: 0
                    }
                },
                tax: 7.08
            } }), Object.assign({}, given04.lines[1], { calculatedTax: {
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
                        scenario: 'Calculation Exempt',
                        calcBase: 100,
                        rate: 0,
                        fact: 0,
                        tax: 0
                    }
                },
                tax: 15
            } })],
    calculatedTaxSummary: {
        numberOfLines: 2,
        subtotal: 40 + 80,
        totalTax: 10 + 7.08 + 5,
        grandTotal: 40 + 80 + 10 + 7.08 + 5,
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
                tax: 7.08 + 5,
                jurisdictions: [{
                        jurisdictionType: 'State',
                        jurisdictionName: 'SP',
                        tax: 7.08 + 5
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
const given05 = {
    header: {
        transactionType: 'Sale',
        transactionDate: '2018-01-15',
        location: {
            taxRegime: 'simplified',
            address: { cityName: 'Parintins', state: 'AM' }
        },
        entity: {
            address: { cityName: 'Manaus', state: 'AM', cityCode: 1302603 }
        }
    },
    lines: [{
            numberOfItems: 2,
            itemPrice: 45,
            otherCostAmount: 20,
            lineDiscount: 10,
            useType: 'resale',
            item: {
                productType: 'product',
                federalTax: {
                    IEC: { fact: 0.1 },
                    IST: { fact: 0.05 },
                    ISC: {}
                }
            }
        }, {
            numberOfItems: 2,
            itemPrice: 45,
            otherCostAmount: 20,
            lineDiscount: 10,
            useType: 'resale',
            item: {
                productType: 'merchandise',
                federalTax: {
                    IEC: { rate: 0.1 },
                    IST: { rate: 0.05, fact: 0.05 },
                    ISC: {}
                }
            }
        }]
};
const expected05 = {
    header: Object.assign({}, given05.header),
    lines: [
        Object.assign({}, given05.lines[0], { calculatedTax: {
                CST: '99',
                taxDetails: {
                    iec: {
                        jurisdictionType: 'Country',
                        jurisdictionName: 'Brasil',
                        taxType: 'IEC',
                        scenario: 'Calculation Table',
                        calcBase: 100,
                        rate: 0.045,
                        fact: 0.1,
                        tax: 4.05
                    },
                    ist: {
                        jurisdictionType: 'State',
                        jurisdictionName: 'AM',
                        taxType: 'IST',
                        scenario: 'Calculation Table',
                        calcBase: 104.05,
                        rate: 0.12,
                        fact: 0.05,
                        tax: 11.86
                    },
                    isc: {
                        jurisdictionType: 'City',
                        jurisdictionName: 'Parintins',
                        taxType: 'ISC',
                        scenario: 'Calculation Exempt',
                        calcBase: 100,
                        rate: 0,
                        fact: 0,
                        tax: 0
                    }
                },
                tax: 15.91
            } }),
        Object.assign({}, given05.lines[1], { calculatedTax: {
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
                        jurisdictionName: 'AM',
                        taxType: 'IST',
                        scenario: 'Calculation Period',
                        month: '01',
                        calcBase: 80,
                        rate: 0.05,
                        fact: 0.05,
                        tax: 3.8
                    },
                    isc: {
                        jurisdictionType: 'City',
                        jurisdictionName: 'Parintins',
                        taxType: 'ISC',
                        scenario: 'Calculation Exempt',
                        calcBase: 100,
                        rate: 0,
                        fact: 0,
                        tax: 0
                    }
                },
                tax: 13.8
            } })
    ],
    calculatedTaxSummary: {
        numberOfLines: 2,
        subtotal: 160,
        totalTax: 14.05 + 15.66,
        grandTotal: 160 + 14.05 + 15.66,
        taxByType: {
            iec: {
                tax: 14.05,
                jurisdictions: [{
                        jurisdictionType: 'Country',
                        jurisdictionName: 'Brasil',
                        tax: 14.05
                    }]
            },
            ist: {
                tax: 15.66,
                jurisdictions: [{
                        jurisdictionType: 'State',
                        jurisdictionName: 'AM',
                        tax: 15.66
                    }]
            },
            isc: {
                tax: 0,
                jurisdictions: [{
                        jurisdictionType: 'City',
                        jurisdictionName: 'Parintins',
                        tax: 0
                    }]
            }
        }
    }
};
const given06 = {
    header: {
        transactionType: 'Sale',
        transactionDate: '2018-05-15',
        location: {
            taxRegime: 'realProfit',
            address: { cityName: 'São Paulo', state: 'SP' }
        },
        entity: {
            address: { cityName: 'Jundiaí', state: 'SP' }
        }
    },
    lines: [
        {
            numberOfItems: 2,
            itemPrice: 45,
            otherCostAmount: 20,
            lineDiscount: 10,
            useType: 'production',
            item: {
                productType: 'product',
                federalTax: {
                    IEC: { fact: 0.1 },
                    IST: { rate: 0.1 },
                    ISC: {}
                }
            }
        }, {
            numberOfItems: 2,
            itemPrice: 45,
            otherCostAmount: 20,
            lineDiscount: 10,
            useType: 'use',
            item: {
                productType: 'merchandise',
                federalTax: {
                    IEC: { rate: 0.1 },
                    IST: { rate: 0.1 },
                    ISC: { rate: 0.05 }
                }
            }
        }, {
            numberOfItems: 2,
            itemPrice: 45,
            otherCostAmount: 20,
            lineDiscount: 10,
            useType: 'resale',
            item: {
                productType: 'merchandise',
                federalTax: {
                    IEC: { rate: 0.1 },
                    IST: { rate: 0.1 },
                    ISC: { rate: 0.05 }
                }
            }
        }
    ]
};
const expected06 = {
    header: Object.assign({}, given06.header),
    lines: [
        Object.assign({}, given06.lines[0], { calculatedTax: {
                CST: '50',
                taxDetails: {
                    iec: {
                        jurisdictionType: 'Country',
                        jurisdictionName: 'Brasil',
                        taxType: 'IEC',
                        scenario: 'Calculation Table',
                        calcBase: 100,
                        rate: 0.065,
                        fact: 0.1,
                        tax: 5.85
                    },
                    ist: {
                        jurisdictionType: 'State',
                        jurisdictionName: 'SP',
                        taxType: 'IST',
                        scenario: 'Calculation Simple',
                        calcBase: 100,
                        rate: 0.1,
                        fact: 0,
                        tax: 10
                    },
                    isc: {
                        jurisdictionType: 'City',
                        jurisdictionName: 'São Paulo',
                        taxType: 'ISC',
                        scenario: 'Calculation Fixed',
                        calcBase: 110,
                        rate: 0.02,
                        fact: 0.12,
                        tax: 1.94
                    }
                },
                tax: 17.79
            } }),
        Object.assign({}, given06.lines[1], { calculatedTax: {
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
                        rate: 0.1,
                        fact: 0,
                        tax: 10
                    },
                    isc: {
                        jurisdictionType: 'City',
                        jurisdictionName: 'São Paulo',
                        taxType: 'ISC',
                        scenario: 'Calculation Simple',
                        calcBase: 100,
                        rate: 0.05,
                        fact: 0,
                        tax: 5
                    }
                },
                tax: 25
            } }),
        Object.assign({}, given06.lines[2], { calculatedTax: {
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
                        scenario: 'Calculation Period',
                        month: '05',
                        calcBase: 90,
                        rate: 0.12,
                        fact: 0.4,
                        tax: 6.48
                    },
                    isc: {
                        jurisdictionType: 'City',
                        jurisdictionName: 'São Paulo',
                        taxType: 'ISC',
                        scenario: 'Calculation Simple',
                        calcBase: 100,
                        rate: 0.05,
                        fact: 0,
                        tax: 5
                    }
                },
                tax: 21.48
            } })
    ],
    calculatedTaxSummary: {
        numberOfLines: 3,
        subtotal: 240,
        totalTax: 64.27,
        grandTotal: 304.27,
        taxByType: {
            iec: {
                tax: 25.85,
                jurisdictions: [{
                        jurisdictionType: 'Country',
                        jurisdictionName: 'Brasil',
                        tax: 25.85
                    }]
            },
            ist: {
                tax: 26.48,
                jurisdictions: [{
                        jurisdictionType: 'State',
                        jurisdictionName: 'SP',
                        tax: 26.48
                    }]
            },
            isc: {
                tax: 11.94,
                jurisdictions: [{
                        jurisdictionType: 'City',
                        jurisdictionName: 'São Paulo',
                        tax: 11.94
                    }]
            }
        }
    }
};
const given07 = {
    header: {
        transactionType: 'Sale',
        transactionDate: '2018-10-15',
        location: {
            taxRegime: 'estimatedProfit',
            address: { cityName: 'Brasília', state: 'DF' }
        },
        entity: {
            address: { cityName: 'Jundiaí', state: 'SP' }
        }
    },
    lines: [
        {
            numberOfItems: 2,
            itemPrice: 45,
            otherCostAmount: 20,
            lineDiscount: 10,
            useType: 'consumption',
            item: {
                productType: 'product',
                federalTax: {
                    IEC: { fact: 0.1 },
                    IST: { fact: 0.05 },
                    ISC: {}
                }
            }
        },
        {
            numberOfItems: 2,
            itemPrice: 45,
            otherCostAmount: 20,
            lineDiscount: 10,
            useType: 'production',
            item: {
                productType: 'product',
                federalTax: {
                    IEC: { fact: 0.1 },
                    IST: { fact: 0.05 },
                    ISC: {}
                }
            }
        },
        {
            numberOfItems: 2,
            itemPrice: 45,
            otherCostAmount: 20,
            lineDiscount: 10,
            useType: 'resale',
            item: {
                productType: 'merchandise',
                federalTax: {
                    IEC: { rate: 0.1 },
                    IST: { rate: 0.05, fact: 0.1 },
                    ISC: { rate: 0.02 }
                }
            }
        }
    ]
};
const expected07 = {
    header: Object.assign({}, given06.header),
    lines: [
        Object.assign({}, given07.lines[0], { calculatedTax: {
                CST: '50',
                taxDetails: {
                    iec: {
                        jurisdictionType: 'Country',
                        jurisdictionName: 'Brasil',
                        taxType: 'IEC',
                        scenario: 'Calculation Table',
                        calcBase: 100,
                        rate: 0.0584,
                        fact: 0.1,
                        tax: 5.26
                    },
                    ist: {
                        jurisdictionType: 'State',
                        jurisdictionName: 'SP',
                        taxType: 'IST',
                        scenario: 'Calculation Fixed',
                        calcBase: 110,
                        rate: 0.14,
                        fact: 0.08,
                        tax: 14.17
                    },
                    isc: {
                        jurisdictionType: 'City',
                        jurisdictionName: 'Brasília',
                        taxType: 'ISC',
                        scenario: 'Calculation Fixed',
                        calcBase: 110,
                        rate: 0.02,
                        fact: 0.12,
                        tax: 1.94
                    }
                },
                tax: 21.37
            } }),
        Object.assign({}, given07.lines[1], { calculatedTax: {
                CST: '50',
                taxDetails: {
                    iec: {
                        jurisdictionType: 'Country',
                        jurisdictionName: 'Brasil',
                        taxType: 'IEC',
                        scenario: 'Calculation Table',
                        calcBase: 100,
                        rate: 0.0584,
                        fact: 0.1,
                        tax: 5.26
                    },
                    ist: {
                        jurisdictionType: 'State',
                        jurisdictionName: 'SP',
                        taxType: 'IST',
                        scenario: 'Calculation Table',
                        calcBase: 105.26,
                        rate: 0.08,
                        fact: 0.05,
                        tax: 8
                    },
                    isc: {
                        jurisdictionType: 'City',
                        jurisdictionName: 'Brasília',
                        taxType: 'ISC',
                        scenario: 'Calculation Fixed',
                        calcBase: 110,
                        rate: 0.02,
                        fact: 0.12,
                        tax: 1.94
                    }
                },
                tax: 15.2
            } }),
        Object.assign({}, given07.lines[1], { calculatedTax: {
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
                        scenario: 'Calculation Period',
                        month: '10',
                        calcBase: 80,
                        rate: 0.05,
                        fact: 0.1,
                        tax: 3.6
                    },
                    isc: {
                        jurisdictionType: 'City',
                        jurisdictionName: 'Brasília',
                        taxType: 'ISC',
                        scenario: 'Calculation Simple',
                        calcBase: 100,
                        rate: 0.02,
                        fact: 0,
                        tax: 2
                    }
                },
                tax: 15.6
            } })
    ],
    calculatedTaxSummary: {
        numberOfLines: 3,
        subtotal: 240,
        taxByType: {
            iec: {
                tax: 20.52,
                jurisdictions: [{
                        jurisdictionType: 'Country',
                        jurisdictionName: 'Brasil',
                        tax: 20.52
                    }]
            },
            ist: {
                tax: 25.77,
                jurisdictions: [{
                        jurisdictionType: 'State',
                        jurisdictionName: 'SP',
                        tax: 25.77
                    }]
            },
            isc: {
                tax: 5.88,
                jurisdictions: [{
                        jurisdictionType: 'City',
                        jurisdictionName: 'Brasília',
                        tax: 5.88
                    }]
            }
        },
        totalTax: 52.17,
        grandTotal: 292.17
    }
};
const given08 = {
    header: {
        transactionType: 'Sale',
        transactionDate: '2018-05-15',
        location: {
            taxRegime: 'estimatedProfit',
            address: { cityName: 'São Paulo', state: 'SP' }
        },
        entity: {
            address: { cityName: 'Jundiaí', state: 'SP' }
        }
    },
    lines: [
        {
            numberOfItems: 2,
            itemPrice: 45,
            otherCostAmount: 20,
            lineDiscount: 10,
            useType: 'resale',
            item: {
                productType: 'merchandise',
                federalTax: {
                    IEC: { rate: 0.1 },
                    IST: {},
                    ISC: { rate: 0.05 }
                }
            }
        }
    ]
};
const expected08 = {
    header: Object.assign({}, given08.header),
    lines: [
        Object.assign({}, given08.lines[0], { calculatedTax: {
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
                        scenario: 'Calculation Period',
                        month: '05',
                        calcBase: 90,
                        rate: 0.12,
                        fact: 0.4,
                        tax: 6.48
                    },
                    isc: {
                        jurisdictionType: 'City',
                        jurisdictionName: 'São Paulo',
                        taxType: 'ISC',
                        scenario: 'Calculation Simple',
                        calcBase: 100,
                        rate: 0.05,
                        fact: 0,
                        tax: 5
                    }
                },
                tax: 21.48
            } })
    ],
    calculatedTaxSummary: {
        numberOfLines: 1,
        subtotal: 80,
        totalTax: 21.48,
        grandTotal: 101.48,
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
                tax: 6.48,
                jurisdictions: [{
                        jurisdictionType: 'State',
                        jurisdictionName: 'SP',
                        tax: 6.48
                    }]
            },
            isc: {
                tax: 5,
                jurisdictions: [{
                        jurisdictionType: 'City',
                        jurisdictionName: 'São Paulo',
                        tax: 5
                    }]
            }
        }
    }
};

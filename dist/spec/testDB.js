"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companies = [
    {
        id: '75106750-1ae4-4872-9d9b-562d94ea324f',
        code: 'CLIENT_J',
        name: 'Cliente J Corp.'
    }
];
exports.locations = [
    {
        companyId: '75106750-1ae4-4872-9d9b-562d94ea324f',
        code: '27227668000122',
        email: 'client@clientj.com.br',
        federalTaxId: '27.227.668/0001-22',
        stateTaxId: '12462557',
        taxRegime: 'realProfit',
        mainActivity: 'industry',
        address: {
            street: 'Rua Felipe Schmidt',
            neighborhood: 'Centro',
            zipcode: '88010-001',
            cityCode: 4205407,
            cityName: 'Florianópolis',
            state: 'SC',
            countryCode: 1058,
            country: 'BRA',
            number: '563',
            complement: 'sala 318',
            phone: '4834566121'
        }
    }, {
        companyId: '75106750-1ae4-4872-9d9b-562d94ea324f',
        code: '27227668000203',
        federalTaxId: '27.227.668/0002-03',
        taxRegime: 'realProfit',
        address: {
            cityCode: 3550308,
            cityName: 'São Paulo',
            state: 'SP'
        }
    }, {
        companyId: '75106750-1ae4-4872-9d9b-562d94ea324f',
        code: '27227668000394',
        federalTaxId: '27.227.668/0003-94',
        taxRegime: 'realProfit',
        address: {
            cityCode: 5300108,
            cityName: 'Brasília',
            state: 'DF'
        }
    }
];
exports.items = [
    {
        companyId: '75106750-1ae4-4872-9d9b-562d94ea324f',
        code: 'VENTILADOR-DIGITAL-001',
        description: 'Ventilador Digital Valitana',
        productType: 'product',
        federalTax: {
            IEC: { rate: 0.0321, fact: 0.09 },
            IST: { rate: 0.0412, fact: 0.1 },
            ISC: { rate: 0.065, fact: 0.11 }
        }
    },
    {
        companyId: '75106750-1ae4-4872-9d9b-562d94ea324f',
        code: 'JJJ-LEGAL-032',
        description: 'JJJ Tabajara',
        productType: 'merchandise',
        federalTax: {
            IEC: { rate: 0.02, fact: 0 },
            IST: { rate: 0.1525, fact: 0.08 },
            ISC: { rate: 0.045, fact: 0.01 }
        }
    }
];
exports.transactions = [
    {
        header: {
            documentCode: '000001',
            transactionType: 'Sale',
            transactionDate: '2018-01-15',
            companyLocation: '27227668000122',
            entity: {
                federalTaxId: '46.395.000/0001-39',
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
                itemCode: 'VENTILADOR-DIGITAL-001',
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
    },
    {
        header: {
            documentCode: '000002',
            transactionType: 'Sale',
            transactionDate: '2018-02-15',
            companyLocation: '27227668000122',
            entity: {
                federalTaxId: '46.377.222/0001-29',
                type: 'stateGovernment',
                address: { cityName: 'São Paulo', state: 'SP' }
            }
        },
        lines: [
            {
                numberOfItems: 1,
                itemPrice: 150,
                lineAmount: 110,
                otherCostAmount: 10,
                lineDiscount: 20,
                itemCode: 'VENTILADOR-DIGITAL-001',
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
    },
    {
        header: {
            documentCode: '000003',
            transactionType: 'Sale',
            transactionDate: '2018-03-15',
            companyLocation: '27227668000122',
            entity: {
                federalTaxId: '26.994.558/0001-23',
                type: 'federalGovernment',
                address: { cityName: 'São Paulo', state: 'SP' }
            }
        },
        lines: [
            {
                numberOfItems: 1,
                itemPrice: 100,
                itemCode: 'VENTILADOR-DIGITAL-001',
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
    },
    {
        header: {
            documentCode: '000004',
            transactionType: 'Sale',
            transactionDate: '2018-10-15',
            companyLocation: '27227668000203',
            entity: {
                federalTaxId: '00.000.000/0001-91',
                address: { cityName: 'Brasília', state: 'DF' }
            }
        },
        lines: [
            {
                numberOfItems: 2,
                itemPrice: 45,
                otherCostAmount: 20,
                lineDiscount: 10,
                useType: 'consumption',
                itemCode: 'VENTILADOR-DIGITAL-001',
                calculatedTax: {
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
                            jurisdictionName: 'DF',
                            taxType: 'IST',
                            scenario: 'Calculation Fixed',
                            calcBase: 110,
                            rate: 0.14,
                            fact: 0.08,
                            tax: 14.17
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
                    tax: 21.37
                }
            }, {
                numberOfItems: 2,
                itemPrice: 45,
                otherCostAmount: 20,
                lineDiscount: 10,
                useType: 'production',
                itemCode: 'VENTILADOR-DIGITAL-001',
                calculatedTax: {
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
                            jurisdictionName: 'DF',
                            taxType: 'IST',
                            scenario: 'Calculation Table',
                            calcBase: 105.26,
                            rate: 0.08,
                            fact: 0.05,
                            tax: 8
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
                    tax: 15.2
                }
            }, {
                numberOfItems: 2,
                itemPrice: 45,
                otherCostAmount: 20,
                lineDiscount: 10,
                useType: 'resale',
                itemCode: 'JJJ-LEGAL-032',
                calculatedTax: {
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
                            jurisdictionName: 'DF',
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
                            jurisdictionName: 'São Paulo',
                            taxType: 'ISC',
                            scenario: 'Calculation Simple',
                            calcBase: 100,
                            rate: 0.02,
                            fact: 0,
                            tax: 2
                        }
                    },
                    tax: 15.6
                }
            }
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
                            jurisdictionName: 'DF',
                            tax: 25.77
                        }]
                },
                isc: {
                    tax: 5.88,
                    jurisdictions: [{
                            jurisdictionType: 'City',
                            jurisdictionName: 'São Paulo',
                            tax: 5.88
                        }]
                }
            },
            totalTax: 52.17,
            grandTotal: 292.17
        }
    },
    {
        header: {
            documentCode: '000005',
            transactionType: 'Sale',
            transactionDate: '2018-05-15',
            companyLocation: '27227668000203',
            entity: {
                federalTaxId: '50.948.371-0001-78',
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
                itemCode: 'VENTILADOR-DIGITAL-001',
                calculatedTax: {
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
                }
            }, {
                numberOfItems: 2,
                itemPrice: 45,
                otherCostAmount: 20,
                lineDiscount: 10,
                useType: 'use',
                itemCode: 'JJJ-LEGAL-032',
                calculatedTax: {
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
                }
            }, {
                numberOfItems: 2,
                itemPrice: 45,
                otherCostAmount: 20,
                lineDiscount: 10,
                useType: 'resale',
                itemCode: 'JJJ-LEGAL-032',
                calculatedTax: {
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
                }
            }
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
    }
];

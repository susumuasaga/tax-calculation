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

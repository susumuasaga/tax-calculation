export const companies = [
  {
    id: '75106750-1ae4-4872-9d9b-562d94ea324f',
    code: 'CLIENT_J',
    name: 'Cliente J Corp.'
  }
];

export const locations = [
    {
    companyId: '75106750-1ae4-4872-9d9b-562d94ea324f',
    code: '27227668000122', // pattern: CNPJ only number
    email: 'client@clientj.com.br',
    federalTaxId: '27.227.668/0001-22', // CNPJ
    stateTaxId: '12462557',
    taxRegime: 'realProfit',
    type: 'nonGovernment',
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

export const items = [
  {
    companyId: '75106750-1ae4-4872-9d9b-562d94ea324f',
    code: 'VENTILADOR-DIGITAL-001',
    description: 'Ventilador Digital Valitana',
    productType: 'product',
    federalTax: {
      IEC: {rate: 0.0321, fact: 0.09}, // Rate 3.21% | Fact 9%
      IST: {rate: 0.0412, fact: 0.1}, // Rate 4.12% | Fact 10%
      ISC: {rate: 0.065, fact: 0.11} // Rate 6.50% | Fact 11%
    }
  },
  {
    companyId: '75106750-1ae4-4872-9d9b-562d94ea324f',
    code: 'JJJ-LEGAL-032',
    description: 'JJJ Tabajara',
    productType: 'merchandise',
    federalTax: {
      IEC: {rate: 0.02, fact: 0}, // Rate 2.00% | Fact 0%
      IST: {rate: 0.1525, fact: 0.08}, // Rate 15.25% | Fact 8%
      ISC: {rate: 0.045, fact: 0.01} // Rate 4.50% | Fact 1%
    }
  }
];

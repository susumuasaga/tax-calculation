export const itemUdts = {
  tax_type: {
    rate: 'double',
    fact: 'double'
  },
  federal_tax: {
    iec: 'frozen<tax_type>',
    ist: 'frozen<tax_type>',
    isc: 'frozen<tax_type>'
  }
};

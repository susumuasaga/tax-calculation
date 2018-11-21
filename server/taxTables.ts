export const regions: { [state: string]: string } = {
  AC: 'N',
  AM: 'N',
  AP: 'N',
  BA: 'NE',
  CE: 'NE',
  DF: 'CO',
  ES: 'SE',
  GO: 'CO',
  MA: 'NE',
  MT: 'CO',
  MS: 'CO',
  MG: 'SE',
  PA: 'N',
  PB: 'NE',
  PR: 'S',
  PE: 'NE',
  PI: 'NE',
  RN: 'NE',
  RS: 'S',
  RJ: 'SE',
  RO: 'N',
  RR: 'N',
  SC: 'S',
  SP: 'SE',
  SE: 'NE',
  TO: 'N'
};

export const iecTable: { [region: string]: [number, number] } = {
  CO: [ 0.061, 0.0426 ],
  N: [ 0.045, 0.0393 ],
  NE: [ 0.0273, 0.0139 ],
  S: [ 0.0841, 0.0908 ],
  SE: [ 0.065, 0.0584 ]
};

export const istTable: { [origin: string]: { [destination: string]: number } } = {
  AM: {
    AC: 0.12,
    AM: 0.12,
    AP: 0.12,
    BA: 0.12,
    CE: 0.12,
    DF: 0.12,
    ES: 0.12,
    GO: 0.12,
    MA: 0.12,
    MT: 0.12,
    MS: 0.12,
    MG: 0.12,
    PA: 0.12,
    PB: 0.12,
    PR: 0.11,
    PE: 0.12,
    PI: 0.12,
    RN: 0.12,
    RS: 0.12,
    RJ: 0.12,
    RO: 0.12,
    RR: 0.12,
    SC: 0.12,
    SP: 0.12,
    SE: 0.12,
    TO: 0.12
  },
  BA: {
    AC: 0.12,
    AM: 0.12,
    AP: 0.12,
    BA: 0.12,
    CE: 0.07,
    DF: 0.12,
    ES: 0.12,
    GO: 0.12,
    MA: 0.04,
    MT: 0.12,
    MS: 0.1,
    MG: 0.12,
    PA: 0.16,
    PB: 0.12,
    PR: 0.11,
    PE: 0.12,
    PI: 0.05,
    RN: 0.12,
    RS: 0.12,
    RJ: 0.12,
    RO: 0.12,
    RR: 0.12,
    SC: 0.16,
    SP: 0.07,
    SE: 0.12,
    TO: 0.12
  },
  CE: {
    AC: 0.12,
    AM: 0.12,
    AP: 0.12,
    BA: 0.12,
    CE: 0.07,
    DF: 0.12,
    ES: 0.12,
    GO: 0.12,
    MA: 0.04,
    MT: 0.12,
    MS: 0.12,
    MG: 0.12,
    PA: 0.12,
    PB: 0.12,
    PR: 0.11,
    PE: 0.12,
    PI: 0.12,
    RN: 0.12,
    RS: 0.12,
    RJ: 0.12,
    RO: 0.12,
    RR: 0.12,
    SC: 0.12,
    SP: 0.18,
    SE: 0.12,
    TO: 0.12
  },
  ES: {
    AC: 0.12,
    AM: 0.12,
    AP: 0.12,
    BA: 0.12,
    CE: 0.06,
    DF: 0.12,
    ES: 0.12,
    GO: 0.12,
    MA: 0.12,
    MT: 0.12,
    MS: 0.12,
    MG: 0.13,
    PA: 0.12,
    PB: 0.12,
    PR: 0.11,
    PE: 0.12,
    PI: 0.12,
    RN: 0.12,
    RS: 0.12,
    RJ: 0.12,
    RO: 0.12,
    RR: 0.12,
    SC: 0.12,
    SP: 0.12,
    SE: 0.12,
    TO: 0.12
  },
  GO: {
    AC: 0.12,
    AM: 0.12,
    AP: 0.12,
    BA: 0.12,
    CE: 0.12,
    DF: 0.12,
    ES: 0.12,
    GO: 0.12,
    MA: 0.12,
    MT: 0.05,
    MS: 0.12,
    MG: 0.12,
    PA: 0.12,
    PB: 0.12,
    PR: 0.12,
    PE: 0.12,
    PI: 0.12,
    RN: 0.12,
    RS: 0.12,
    RJ: 0.12,
    RO: 0.12,
    RR: 0.12,
    SC: 0.12,
    SP: 0.12,
    SE: 0.12,
    TO: 0.12
  },
  MA: {
    AC: 0.12,
    AM: 0.12,
    AP: 0.12,
    BA: 0.12,
    CE: 0.12,
    DF: 0.12,
    ES: 0.12,
    GO: 0.12,
    MA: 0.12,
    MT: 0.12,
    MS: 0.12,
    MG: 0.12,
    PA: 0.12,
    PB: 0.12,
    PR: 0.12,
    PE: 0.12,
    PI: 0.12,
    RN: 0.12,
    RS: 0.12,
    RJ: 0.12,
    RO: 0.12,
    RR: 0.12,
    SC: 0.12,
    SP: 0.18,
    SE: 0.12,
    TO: 0.12
  },
  MT: {
    AC: 0.12,
    AM: 0.12,
    AP: 0.12,
    BA: 0.12,
    CE: 0.12,
    DF: 0.12,
    ES: 0.12,
    GO: 0.12,
    MA: 0.08,
    MT: 0.12,
    MS: 0.12,
    MG: 0.12,
    PA: 0.12,
    PB: 0.12,
    PR: 0.12,
    PE: 0.12,
    PI: 0.12,
    RN: 0.12,
    RS: 0.12,
    RJ: 0.12,
    RO: 0.12,
    RR: 0.12,
    SC: 0.16,
    SP: 0.12,
    SE: 0.12,
    TO: 0.12
  },
  MG: {
    AC: 0.12,
    AM: 0.12,
    AP: 0.12,
    BA: 0.12,
    CE: 0.12,
    DF: 0.12,
    ES: 0.12,
    GO: 0.12,
    MA: 0.12,
    MT: 0.09,
    MS: 0.12,
    MG: 0.12,
    PA: 0.12,
    PB: 0.12,
    PR: 0.12,
    PE: 0.12,
    PI: 0.12,
    RN: 0.12,
    RS: 0.12,
    RJ: 0.12,
    RO: 0.12,
    RR: 0.12,
    SC: 0.16,
    SP: 0.17,
    SE: 0.12,
    TO: 0.12
  },
  PA: {
    AC: 0.12,
    AM: 0.12,
    AP: 0.12,
    BA: 0.12,
    CE: 0.12,
    DF: 0.12,
    ES: 0.12,
    GO: 0.12,
    MA: 0.12,
    MT: 0.12,
    MS: 0.13,
    MG: 0.12,
    PA: 0.12,
    PB: 0.12,
    PR: 0.12,
    PE: 0.12,
    PI: 0.13,
    RN: 0.12,
    RS: 0.12,
    RJ: 0.13,
    RO: 0.12,
    RR: 0.12,
    SC: 0.12,
    SP: 0.12,
    SE: 0.12,
    TO: 0.12
  },
  PB: {
    AC: 0.12,
    AM: 0.12,
    AP: 0.12,
    BA: 0.12,
    CE: 0.12,
    DF: 0.12,
    ES: 0.12,
    GO: 0.12,
    MA: 0.12,
    MT: 0.12,
    MS: 0.12,
    MG: 0.12,
    PA: 0.12,
    PB: 0.12,
    PR: 0.11,
    PE: 0.12,
    PI: 0.12,
    RN: 0.12,
    RS: 0.12,
    RJ: 0.12,
    RO: 0.12,
    RR: 0.12,
    SC: 0.12,
    SP: 0.07,
    SE: 0.12,
    TO: 0.12
  },
  PR: {
    AC: 0.12,
    AM: 0.12,
    AP: 0.12,
    BA: 0.12,
    CE: 0.12,
    DF: 0.12,
    ES: 0.12,
    GO: 0.12,
    MA: 0.12,
    MT: 0.12,
    MS: 0.12,
    MG: 0.12,
    PA: 0.12,
    PB: 0.12,
    PR: 0.11,
    PE: 0.12,
    PI: 0.12,
    RN: 0.12,
    RS: 0.12,
    RJ: 0.12,
    RO: 0.12,
    RR: 0.12,
    SC: 0.16,
    SP: 0.12,
    SE: 0.12,
    TO: 0.18
  },
  PE: {
    AC: 0.12,
    AM: 0.09,
    AP: 0.12,
    BA: 0.12,
    CE: 0.1,
    DF: 0.12,
    ES: 0.12,
    GO: 0.12,
    MA: 0.12,
    MT: 0.12,
    MS: 0.12,
    MG: 0.12,
    PA: 0.12,
    PB: 0.12,
    PR: 0.11,
    PE: 0.06,
    PI: 0.12,
    RN: 0.12,
    RS: 0.12,
    RJ: 0.12,
    RO: 0.05,
    RR: 0.12,
    SC: 0.16,
    SP: 0.07,
    SE: 0.12,
    TO: 0.12
  },
  RS: {
    AC: 0.08,
    AM: 0.12,
    AP: 0.12,
    BA: 0.12,
    CE: 0.12,
    DF: 0.12,
    ES: 0.12,
    GO: 0.12,
    MA: 0.05,
    MT: 0.12,
    MS: 0.12,
    MG: 0.12,
    PA: 0.12,
    PB: 0.12,
    PR: 0.12,
    PE: 0.12,
    PI: 0.12,
    RN: 0.12,
    RS: 0.12,
    RJ: 0.13,
    RO: 0.12,
    RR: 0.07,
    SC: 0.12,
    SP: 0.18,
    SE: 0.12,
    TO: 0.12
  },
  RJ: {
    AC: 0.12,
    AM: 0.12,
    AP: 0.12,
    BA: 0.12,
    CE: 0.12,
    DF: 0.12,
    ES: 0.09,
    GO: 0.12,
    MA: 0.12,
    MT: 0.12,
    MS: 0.11,
    MG: 0.12,
    PA: 0.16,
    PB: 0.12,
    PR: 0.11,
    PE: 0.12,
    PI: 0.12,
    RN: 0.12,
    RS: 0.12,
    RJ: 0.12,
    RO: 0.12,
    RR: 0.12,
    SC: 0.16,
    SP: 0.12,
    SE: 0.12,
    TO: 0.12
  },
  SC: {
    AC: 0.09,
    AM: 0.12,
    AP: 0.09,
    BA: 0.12,
    CE: 0.11,
    DF: 0.12,
    ES: 0.12,
    GO: 0.12,
    MA: 0.12,
    MT: 0.12,
    MS: 0.12,
    MG: 0.12,
    PA: 0.12,
    PB: 0.12,
    PR: 0.12,
    PE: 0.12,
    PI: 0.12,
    RN: 0.12,
    RS: 0.05,
    RJ: 0.12,
    RO: 0.12,
    RR: 0.12,
    SC: 0.16,
    SP: 0.12,
    SE: 0.12,
    TO: 0.12
  },
  SP: {
    AC: 0.12,
    AM: 0.12,
    AP: 0.12,
    BA: 0.12,
    CE: 0.12,
    DF: 0.12,
    ES: 0.12,
    GO: 0.12,
    MA: 0.12,
    MT: 0.12,
    MS: 0.12,
    MG: 0.12,
    PA: 0.12,
    PB: 0.12,
    PR: 0.12,
    PE: 0.12,
    PI: 0.12,
    RN: 0.12,
    RS: 0.12,
    RJ: 0.12,
    RO: 0.12,
    RR: 0.12,
    SC: 0.16,
    SP: 0.12,
    SE: 0.12,
    TO: 0.12
  }
};

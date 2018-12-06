import { cityState } from "./cityState";

describe('cityState', () => {
  it('if entity is undefined, should return empty string', () => {
    expect(cityState())
      .toBe('');
  });

  it('if city is undefined, should return only state', () => {
    expect(cityState({ state: 'SP' }))
      .toBe('SP');
  });

  //The rest of cityState was tested integrated with other software modules.
});

import * as React from 'react';
import * as Adapter from 'enzyme-adapter-react-16';
import { locations } from '../../server/spec/testDB';
import { configure as enzymeConfigure, mount, ReactWrapper } from 'enzyme';
import { Locations } from './Locations';

let component: ReactWrapper;

describe('Locations component', () => {
  describe('when locations is not empty', () => {
    beforeAll(() => {
      enzymeConfigure({ adapter: new Adapter() });
    });

    beforeEach(() => {
      component = mount(
        <Locations {...{
          cache: { isFetching: false, locations },
          onClick: jest.fn()
        }} />
      );
    });

    it('should present given locations', () => {
      expect(component.find('.row').length)
        .toBe(locations.length);
    });
  });
});

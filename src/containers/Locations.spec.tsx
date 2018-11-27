import * as React from 'react';
import * as Adapter from 'enzyme-adapter-react-16';
import { locations } from '../../server/spec/testDB';
import { configure as enzymeConfigure, mount, ReactWrapper } from 'enzyme';
import { Locations } from './Locations';

let component: ReactWrapper;
let onClickMock: jest.Mock;

describe('Locations component', () => {
  describe('when locations is not empty', () => {
    beforeAll(() => {
      enzymeConfigure({ adapter: new Adapter() });
    });

    beforeEach(() => {
      onClickMock = jest.fn();
      component = mount(
        <Locations {...{
          cache: { isFetching: false, locations },
          onClick: onClickMock
        }} />
      );
    });

    it('should present given locations', () => {
      expect(component.find('.row').length)
        .toBe(locations.length);
    });

    it('should emit click on a location', () => {
      component.find('.row')
        .at(1)
        .simulate('click');
      expect(onClickMock.mock.calls.length)
        .toBe(1);
      expect(onClickMock.mock.calls[0][0])
        .toBe(1);
    });
  });
});

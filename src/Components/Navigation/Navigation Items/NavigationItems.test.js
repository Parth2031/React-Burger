// ! Testing Components using Enzyme( Part of Jest ) Package :-

import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import NavigationItems from './NavigationItems';
import NavigationItem from './Navigation Item/NavigationItem';

configure({ adapter: new Adapter() });

describe('<NavigationItems/>', () =>
{
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<NavigationItems />);
  });

  it('Should render two <NavigationItem/> elements if not Authenticated', () => {
    expect(wrapper.find(NavigationItem)).toHaveLength(2);
  });

  it('Should render two <NavigationItem/> elements if Authenticated', () =>
  {
    wrapper.setProps({ isAuthenticated: true });
    expect(wrapper.find(NavigationItem)).toHaveLength(3);
  });

  it('Should an exact Logout Button', () =>
  {
    wrapper.setProps({ isAuthenticated: true });
    expect(wrapper.contains(<NavigationItem link="/logout" >Logout</NavigationItem>)).toEqual(true);
  });
});
import {
  StackNavigator,
} from 'react-navigation';
import Home from './Home';
import MapLocation from './Location';

const AppNavigation = StackNavigator({
  Home: { screen: Home },
  Location: { screen: MapLocation },
});

export default AppNavigation;

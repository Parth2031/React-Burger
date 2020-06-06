import React from 'react';
import classes from './Toolbar.module.css';
import DrawerToggle from '../Side Drawer/Drawer Toggle/DrawerToggle';
import Logo from '../../Logo/Logo';
import NavigationItems from '../Navigation Items/NavigationItems';

const toolbar = (props) =>
{
  return (
    <header className={classes.Toolbar}>
      <DrawerToggle clicked={props.drawerToggleClicked} />
      <div className={classes.Logo}>
        <Logo />
      </div>
      <nav className={classes.DesktopOnly}>
        <NavigationItems isAuthenticated={props.isAuth}/>
      </nav>
    </header>
  );
}

export default toolbar;
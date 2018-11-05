import React from 'react';
import { NavLink } from "react-router-dom";


const Navigation: React.SFC = () => {

	return (
		<>
			<NavLink to="/">Home</NavLink>
			<NavLink to="/task1">Task 1</NavLink>
			<NavLink to="/task2">Task 2</NavLink>
		</>
		)
};

export default Navigation;
  
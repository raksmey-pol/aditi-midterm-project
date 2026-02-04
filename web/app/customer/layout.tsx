import { NavBar } from '@/components/nav-bar';
import React from 'react'

const CustomerLayout = ({children}:{children: React.ReactNode}) => {
  return (
    <div>
      <NavBar/>
      <main>{children}</main>
    </div>
  );
}

export default CustomerLayout;
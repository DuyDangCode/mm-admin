'use client';
import React, { MouseEventHandler, useState } from 'react';
import { Flex, Button } from '@mantine/core';
import {
  IconHome,
  IconCategory,
  IconShoppingCart,
  IconUserCircle,
} from '@tabler/icons-react';
import { AnyARecord } from 'dns';

// The information fields below can be changed to better suit the project
const listButtonName: string[] = ['home', 'category', 'cart', 'user']; // just a name of the icon, can be wrong, not important
const listButtonElement: JSX.Element[] = [
  <IconHome />,
  <IconCategory />,
  <IconShoppingCart />,
  <IconUserCircle />,
];
const buttonSize = '1.25rem';
// The information fields above can be changed to better suit the project

/* -- Function: Change attribute of the icon element -- begin*/
type PropsOfIcon = {
  element: JSX.Element;
  size: string;
  color: string;
};

function IconWithProps({ element, size, color }: PropsOfIcon) {
  return <>{React.cloneElement(element, { size, color })}</>;
}
/* -- Function: Change attribute of the icon element -- end*/

/* -- Component: Navigation bar button ( icon, size of icon and active status ) -- begin*/
type navBarBtnProps = {
  icon: JSX.Element;
  size: string;
  active?: boolean;
  onClick: any;
};

function NavButton({ icon, size, active, onClick }: navBarBtnProps) {
  let styleBtn = {
    color: 'var(--mantine-color-gray-6)',
    bgColor: '#fff',
  };
  if (active === true) {
    styleBtn = {
      color: 'var(--mantine-color-turquoise-6)',
      bgColor: 'var(--mantine-color-turquoise-1)',
    };
  }

  return (
    <Button
      p='0.625rem'
      variant='filled'
      color={styleBtn.bgColor}
      h={`cal(${size} + 0.625rem)`}
      onClick={onClick}
    >
      <IconWithProps element={icon} size={size} color={styleBtn.color} />
    </Button>
  );
}
/* -- Component: Navigation bar button ( icon, size of icon and active status ) -- end*/

// main component

interface Boolean {
  isActived: boolean;
}

export default function BottomNavBar() {
  const [activeBtn, setActiveBtn] = useState<boolean[]>(
    Array.from({ length: listButtonElement.length }, (_, index) =>
      index === 0 ? true : false
    )
  );

  const navigateTo = (i: any) => {
    // navigate
    setActiveBtn(
      Array.from({ length: listButtonElement.length }, (_, index) =>
        index === i ? true : false
      )
    );
  };

  return (
    <Flex
      // className='hidden-desktop z-1000'
      py='0.75rem'
      px='1.5rem'
      justify='space-between'
      bg='#fff'
      pos='fixed'
      bottom='0'
      left='0'
      right='0'
    >
      {listButtonElement.map((item, index) => (
        <NavButton
          key={index}
          icon={item}
          size={buttonSize}
          active={activeBtn.at(index)}
          onClick={() => navigateTo(index)}
        />
      ))}
    </Flex>
  );
}

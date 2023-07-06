import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import * as BsIcons from 'react-icons/bs';

export const SidebarData = [
  {
    title: 'Início',
    path: '/',
    icon: <AiIcons.AiFillHome />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

  },
  {
    title: 'Agenda',
    path: '/schedule',
    icon: <BsIcons.BsFillCalendarDateFill />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

  },
  {
    title: 'Clientes',
    path: '/customers',
    icon: <BsIcons.BsFillPersonFill />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: 'Lista de Clientes',
        path: '/customers/',
        icon: <BsIcons.BsFillPersonLinesFill />,
        cName: 'sub-nav'
      },
      {
        title: 'Cadastrar',
        path: '/customers/add',
        icon: <BsIcons.BsFillPersonPlusFill />,
        cName: 'sub-nav'
      },
      {
        title: 'Lista de Mensagens',
        path: '/customers/messages',
        icon: <BsIcons.BsFillPersonPlusFill />,
        cName: 'sub-nav'
      },
    ]
  },
  {
    title: 'Configurações',
    path: '/config',
    icon: <BsIcons.BsFillGearFill />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: 'Procedimentos',
        path: '/config/procedures',
        icon: <BsIcons.BsFillFileEarmarkTextFill />,
        cName: 'sub-nav'
      },
      {
        title: 'Pagamentos',
        path: '/config/payments',
        icon: <BsIcons.BsCreditCardFill />,
        cName: 'sub-nav'
      },
    ]
  },

];

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.css';

function SubMenu({ item }) {
    const navigate = useNavigate();

    const [subnav, setSubnav] = useState(false);
    const showSubnav = () => setSubnav(!subnav);

    return (
        <>
            <div className={styles.sidebar_link} to={item.path} onClick={item.subNav ? showSubnav : () => navigate(item.path)}>
                <div>
                    {item.icon}
                    <span>{item.title}</span>
                </div>
                <div>
                    {item.subNav && subnav
                        ? item.iconOpened
                        : item.subNav
                            ? item.iconClosed
                            : null}
                </div>
            </div>
            {subnav &&
                item.subNav.map((item, index) => {
                    return (
                        <div onClick={() => {
                            navigate(item.path);
                        }} className={styles.dropdown_link} key={index}>
                            {item.icon}
                            <span>{item.title}</span>
                        </div>
                    );
                })}
        </>
    );
};

export default SubMenu;

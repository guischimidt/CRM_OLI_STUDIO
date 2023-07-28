import React, { useState } from 'react';
import styles from './Sidebar.module.css';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { SidebarData } from './SidebarData';
import SubMenu from './SubMenu';
import { IconContext } from 'react-icons/lib';
import Logo from '../../assets/img/logo-circle.png'
import { useContext } from 'react';
import { Context } from '../../context/UserContext';

function Sidebar() {
    const { authenticated, logout } = useContext(Context);

    const [isOpen, setIsOpen] = useState(false);
    const handleTrigger = () => {
        setIsOpen(!isOpen);
        // setTimeout(() => setIsOpen(false), 3000);
    }

    return (
        <>
            <IconContext.Provider value={{}}>
                <div onClick={handleTrigger} className={styles.nav} >
                    <div className={styles.nav_icon} to='#'>
                        <FaIcons.FaBars onClick={handleTrigger} />
                    </div>
                    <div className={styles.nav_icon}>
                        <h2>Óli Studio</h2>
                    </div>


                    <div className={styles.nav_icon}>
                        <img src={Logo} alt="Óli Studio" />
                        {authenticated ? (<>

                            <li onClick={logout}>Sair</li></>) : (
                            <>
                            </>)
                        }
                    </div>


                </div>
                <div onClick={handleTrigger} className={`${isOpen ? (`${styles.open}`) : `${styles.close}`}`}  ></div>
                <div className={`${isOpen ? (`${styles.sidebar_nav}`) : `${styles.hidden}`}`} >
                    <div className={styles.sidebar_wrap}>
                        <div onClick={handleTrigger} className={styles.nav_icon} to='#'>
                            <AiIcons.AiOutlineClose />
                        </div>
                        {SidebarData.map((item, index) => {
                            return <SubMenu item={item} key={index} />;
                        })}
                    </div>
                </div>
            </IconContext.Provider>
        </>
    );
};

export default Sidebar;

import '../styles/styles.css';
import ytIcon from '../assets/youtubeicon.png';
import Icon from '@mdi/react';
import { mdiMenu, mdiMagnify, mdiVideoPlusOutline,mdiBellOutline,mdiHome,mdiThumbUpOutline,mdiPlayBoxOutline   } from '@mdi/js';
import { useNavigate } from 'react-router-dom';


function Layout({children}) {
    const navigate = useNavigate();

    return <>
        <nav className='topBar'>
            <div className='left'>
                <Icon path={mdiMenu} size={1.2} className='over' onClick={()=> {
                    document.querySelector('main aside').classList.toggle('hide');
                    document.querySelector('.mainContent').classList.toggle('full');
                    }}/>
                <div className='ytLogo' onClick={()=> {navigate('/')}}>
                    <img src={ytIcon} alt=''></img>
                    MyTube
                </div>
            </div>
            <div className='middle'>
                <div className='searchBar'>
                    <input type='text' placeholder='Search'></input>
                    <div className='search'>
                        <Icon path={mdiMagnify} size={1.2} />
                    </div>
                </div>
            </div>
            <div className='right'>
                <Icon path={mdiVideoPlusOutline} size={1.1} className='over' onClick={()=> {navigate('/upload')}}/>
                <Icon path={mdiBellOutline} size={1.1} className='over'/>
                <div className='pfp'>
                
                </div>
            </div>
        </nav>
        <main>
            <aside>
                <div className='top'>
                    <div className='aside-but selected'>
                        <Icon path={mdiHome} size={1.1}></Icon>
                        Home
                    </div>
                    <div className='line'></div>
                    <div className='aside-but'>                  
                        <Icon path={mdiThumbUpOutline} size={1.1} />
                        Liked videos
                    </div>
                    <div className='aside-but'>
                        <Icon path={mdiPlayBoxOutline} size={1.1} />
                        Your videos
                    </div>

                </div>
            </aside>
            <div className='right'>
            <div className='categories'>
            </div>
            <div className='mainContent'>
                {children}
            </div>
            </div>

        </main>
        
    </>
}

export default Layout
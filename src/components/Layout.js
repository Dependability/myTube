import '../styles/styles.css';
import ytIcon from '../assets/youtubeicon.png';
import Icon from '@mdi/react';
import { mdiMenu, mdiMagnify, mdiVideoPlusOutline,mdiBellOutline,mdiHome,mdiThumbUpOutline,mdiPlayBoxOutline   } from '@mdi/js';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import {db, storage} from '../Firebase';
import {collection, getDocs} from 'firebase/firestore';

function Layout({children, current,pfp, uid}) {
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
                <div className='pfp'>
                    <img src={pfp + '=c-k-c0x00ffffff-no-rj'} alt='' />
                </div>
            </div>
        </nav>
        <main>
            <aside>
                <div className='top'>
                    <div className={'aside-but ' + (current === 'home' ? 'selected' : '')} onClick={()=> navigate('/')}>
                        <Icon path={mdiHome} size={1.1} ></Icon>
                        Home
                    </div>
                    <div className='line'></div>
                    <div className={'aside-but ' + (current === 'liked' ? 'selected' : '')} onClick={()=> navigate('/liked')}>                  
                        <Icon path={mdiThumbUpOutline} size={1.1} />
                        Liked videos
                    </div>
                    <div className={'aside-but ' + (current === 'videos' ? 'selected' : '')} onClick={()=> navigate('/channel/' + uid)}>
                        <Icon path={mdiPlayBoxOutline} size={1.1} />
                        Your videos
                    </div>

                </div>
            </aside>
            <div className='right'>
            <div className='mainContent'>
                {children}
            </div>
            </div>

        </main>
        
    </>
}

export default Layout
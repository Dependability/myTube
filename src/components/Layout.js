import '../styles/styles.css';
import ytIcon from '../assets/youtubeicon.png';
import Icon from '@mdi/react';
import { mdiMenu, mdiMagnify, mdiVideoPlusOutline,mdiHome,mdiThumbUpOutline,mdiPlayBoxOutline, mdiAccountBoxOutline, mdiLogout, mdiAlert   } from '@mdi/js';
import { useNavigate } from 'react-router-dom';
import {auth} from '../Firebase';
import {signOut} from 'firebase/auth';
import SignUp from './SignUp';

function Layout({children, current,pfp, uid, name}) {
    const navigate = useNavigate();

    return <>
        <nav className='topBar'>
            <div className='left'>
                <Icon path={mdiMenu} size={1.2} className='over' onClick={()=> {
                    document.querySelector('main aside').classList.toggle('hide');
                    document.querySelector('.mainContent').classList.toggle('full');
                    }}/>
                <div className='ytLogo' onClick={()=> {navigate(process.env.PUBLIC_URL + '/')}}>
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
            {uid ? <div className='right'>
                <Icon path={mdiVideoPlusOutline} size={1.1} className='over' onClick={()=> {navigate(process.env.PUBLIC_URL + '/upload')}}/>
                <div className='pfp' onClick={()=> {
                    document.querySelector('.fixedAccountInfo').classList.remove('hidden');
                }}>
                    <img src={pfp + '=c-k-c0x00ffffff-no-rj'} alt='' />
                </div>
            </div> : <div className='right'>
                <SignUp />
            </div>}
        </nav>
        <main>
            <aside>
                <div className='top'>
                    <div className={'aside-but ' + (current === 'home' ? 'selected' : '')} onClick={()=> navigate(process.env.PUBLIC_URL + '/')}>
                        <Icon path={mdiHome} size={1.1} ></Icon>
                        Home
                    </div>
                    <div className='line'></div>
                    {uid ? <div className={'aside-but ' + (current === 'liked' ? 'selected' : '')} onClick={()=> navigate(process.env.PUBLIC_URL + '/liked')}>                  
                        <Icon path={mdiThumbUpOutline} size={1.1} />
                        Liked videos
                    </div> : ''}
                    
                    {uid ? <div className={'aside-but ' + (current === 'videos' ? 'selected' : '')} onClick={()=> navigate(process.env.PUBLIC_URL + '/channel/' + uid)}>
                        <Icon path={mdiPlayBoxOutline} size={1.1} />
                        Your videos
                    </div> : ''}

                </div>
            </aside>
            <div className='right'>
            <div className='mainContent'>
                {uid ? children : <div className='nouser'><Icon path={mdiAlert} color='red' /> Please sign in </div>}
            </div>
            </div>

        </main>
        <div className='fixedAccountInfo hidden' onClick={(e)=> {
            e.currentTarget.classList.add('hidden');
        }}>
            <div className='inner' onClick={(e)=> {e.stopPropagation()}}>
                <div className='header'>
                    <div className='pfp'>
                        <img src={pfp + '=c-k-c0x00ffffff-no-rj'} alt='' />
                    </div>
                    <div className='name'>{name}</div>
                </div>
                <div className='next'>
                    <div className='item' onClick={()=> {
                        document.querySelector('.fixedAccountInfo').classList.add('hidden');
                        navigate(process.env.PUBLIC_URL + '/channel/' + uid)
                    }}>
                        <Icon path={mdiAccountBoxOutline}></Icon>
                        <span>Your channel</span>
                    </div>
                    <div className='item' onClick={()=>{
                        document.querySelector('.fixedAccountInfo').classList.add('hidden');
                        signOut(auth).then(()=> {
                            navigate(process.env.PUBLIC_URL + '/');
                            
                        })
                    }}>
                        <Icon path={mdiLogout}></Icon>
                        <span>Sign out</span>
                    </div>
                </div>
            </div>
        </div>
        
    </>
}

export default Layout
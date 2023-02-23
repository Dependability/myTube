import {signInWithPopup} from 'firebase/auth';
import {auth, provider, db} from '../Firebase';
import {useNavigate} from 'react-router-dom';
import '../styles/styles.css';
import {doc, getDoc, setDoc} from 'firebase/firestore';
import Icon from '@mdi/react';
import {mdiAccountCircleOutline} from '@mdi/js'

function SignUp() {

    const navigate = useNavigate();

    function signIn() {
    
        signInWithPopup(auth, provider).then((result)=>{
            const ref = doc(db, 'users', result.user.uid)
            getDoc(ref).then((document) => {
                if (document.exists()) {
                    navigate(process.env.PUBLIC_URL + '/');
                    return
                } else {
                    const photoURL = result.user.photoURL.split('=')[0];
                    setDoc(ref, {
                        
                        displayName: result.user.displayName,
                        subscriptions: [],
                        subscribers: [],
                        photoURL: photoURL
                    })
                }
            })
            

        }, (error)=> {
            
          console.log(error.code, " ", error.message);
        })
      }
    return <div className='signInButton' onClick={signIn}>
                <Icon path={mdiAccountCircleOutline} />
                <span>Sign in</span>
            </div>
    // <div>
    //     {
    //         userStatus ? <button onClick={() => {
    //             signOut(auth).then(()=> {
    //                 setUserStatus(false);
    //                 navigate('/sign-in');

    //             })
    //         }}>Sign Out</button> : <button onClick={signIn}>Sign up</button>

    //     }
        
        
    //     <a href='/'>Go back.</a>
    // </div>
}

export default SignUp
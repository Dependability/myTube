import {signOut, signInWithPopup, GoogleAuthProvider} from 'firebase/auth';
import {auth, provider, db} from '../Firebase';
import {useNavigate} from 'react-router-dom';
import '../styles/styles.css';
import {doc, getDoc, setDoc} from 'firebase/firestore';
import { useEffect, useState } from 'react';

function SignUp({user, loading}) {

    const navigate = useNavigate();
    const [userStatus, setUserStatus] = useState(false);
    useEffect(()=> {
        if (!loading) {
            if (user) {
                setUserStatus(true);
            } else {
                setUserStatus(false);
                console.log("Not signed in")
                return
            }
        }
    }, [loading])

    function signIn() {
    
        signInWithPopup(auth, provider).then((result)=>{
            const ref = doc(db, 'users', result.user.uid)
            getDoc(ref).then((document) => {
                if (document.exists()) {
                    navigate('/');
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
    return <div>
        {
            userStatus ? <button onClick={() => {
                signOut(auth).then(()=> {
                    setUserStatus(false);
                    navigate('/sign-in');

                })
            }}>Sign Out</button> : <button onClick={signIn}>Sign up</button>

        }
        
        
        <a href='/'>Go back.</a>
    </div>
}

export default SignUp
import {signOut, signInWithPopup, GoogleAuthProvider} from 'firebase/auth';
import {auth, provider, db} from '../Firebase';
import {useNavigate} from 'react-router-dom';
import '../styles/styles.css';
import {doc, getDoc, setDoc} from 'firebase/firestore';

function SignUp({user}) {

    const navigate = useNavigate();

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
            user ? <button onClick={() => {
                signOut(auth).then(()=> {
                    navigate('/sign-in');

                })
            }}>Sign Out</button> : <button onClick={signIn}>Sign up</button>

        }
        
        
        <a href='/'>Go back.</a>
    </div>
}

export default SignUp
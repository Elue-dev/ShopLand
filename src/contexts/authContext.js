import React, { useContext, useEffect, useState } from 'react'
import { auth } from '../firebase/firebase'
import { 
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    FacebookAuthProvider,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateEmail,
    updatePassword,
    updateProfile
 } from 'firebase/auth'

const AuthContext = React.createContext()

export const useAuth = () => {
    return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState()
    const [loading, setLoading] = useState(true)
    const [userName, setUserName] = useState('')

    const signup = (email, password) =>  {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password)
    }

    const logout = () => {
        return signOut(auth)
    }

    const resetPassword = (email) => {
        return sendPasswordResetEmail(auth, email)
    }

    const googleSignIn = () => {
        const googleAuthProvider = new GoogleAuthProvider()
        return signInWithPopup(auth, googleAuthProvider)
    }

    const facebookSignIn = () => {
        const facebookAuthProvider = new FacebookAuthProvider()
        return signInWithPopup(auth, facebookAuthProvider)
    }

    const updateName = (displayName) => {
        updateProfile(auth.currentUser, {displayName: displayName})
   }

   const updateMail = (newmail) => {
        updateEmail(auth.currentUser, newmail)
    }

    const updatePass = (password) => {
        updatePassword(auth.currentUser, password)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser)
            setLoading(false)
        } )

        return () => {
            unsubscribe()
        }    
    }, [])

    const values = { user, signup, login, logout, 
        resetPassword, googleSignIn, facebookSignIn,
        updateName, updateMail, updatePass, userName, setUserName, loading
     }

    return (
        <AuthContext.Provider value={values}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
import { createContext, ReactNode, useState, useEffect } from "react";
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { api } from '../services/api';
import { isPropertyAccessChain } from "typescript";

WebBrowser.maybeCompleteAuthSession();

interface UserProps {
    name: string;
    avatarUrl: string;
}

export interface AuthContextDataProps {
    user: UserProps;
    isUserLoading: boolean;
    signIn: () => Promise<void>;
    

}

interface AuthProviderProps {
    children: ReactNode;
}

// compartilha esse contexto com a aplicação
export const AuthContext = createContext({} as AuthContextDataProps);

// AuthContextProvider vai permitir compartilhar com toda a nossa aplicação
export function AuthContextProvider({ children }: AuthProviderProps){
    
    const [user, setUser] = useState<UserProps>({} as UserProps);
    
    const [isUserLoading, setIsUserLoanding] = useState(false);

    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: process.env.CLIENT_ID,
        redirectUri: AuthSession.makeRedirectUri({useProxy: true}),
        scopes: ['profile', 'email']
    });

    //console.log();

    async function signIn(){
        try {
            setIsUserLoanding(true);
            await promptAsync();

        } catch (error){
            console.log(error);
            throw error;    
        } finally{
            setIsUserLoanding(false);
        }
        //console.log('Vamos logar!');
    }

    async function signInWithGoogle(access_token: string){
        try {
            setIsUserLoanding(true);

           const tokenResponse  = await api.post('/users', { access_token });
           api.defaults.headers.common['Authorization'] = `Bearer ${tokenResponse.data.token}`;

           const userInfoResponse = await api.get('/me');
           setUser(userInfoResponse.data.user);

        }catch (error){
            console.log(error);
            throw error;
            
        } finally {
            setIsUserLoanding(false);
        }
    }

    useEffect(() => {
        if(response?.type === 'success' && response.authentication?.accessToken){
            signInWithGoogle(response.authentication.accessToken);
        } 

    },[response]);

    return (
        <AuthContext.Provider value={{
            signIn,
            isUserLoading,
            user, //{
               //name:  'Sosthenes',
               //avatarUrl: 'https://github.com/SosthenesLima'
            //}
        }}>
            { children }

        </AuthContext.Provider>
    )
}

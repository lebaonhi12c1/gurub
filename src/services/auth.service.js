import { getFireBase } from "../config/firebase"
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

import {post} from "../helpers/api/get-data"
import {create} from "../fake_data/category"
import {
    API_LOGIN_USERNAME_PASSWORD,
    API_LOGIN_FIREBASE,
} from "../config/api"


class authService {
    static async loginWithUsernamePassword(data) {
        const result = await post(API_LOGIN_USERNAME_PASSWORD,
            data, 
            {
                authHeader: true, 
            },
            create,
            "Đăng nhập thành công",
            "login_user_pwd",
            false
        )
        return result
    }
    
    static async loginWithFirebase() {

        try {  
            getFireBase();
            const provider = new GoogleAuthProvider()
            const auth = getAuth();
            const result = await signInWithPopup(auth,provider)
            const credential = GoogleAuthProvider.credentialFromResult(result);

            const data = {
                idToken: credential.idToken
            }

            const feedback = await post(API_LOGIN_FIREBASE,
                data, 
                {
                    authHeader: true, 
                },
                create,
                "Đăng nhập thành công",
                "firebase",
            )

            return feedback
        } catch (error) {
            
            return error
        }


    }


}
export default authService;
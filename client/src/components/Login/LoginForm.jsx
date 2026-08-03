import React, {useState} from 'react';
import { useNavigate } from 'react-router';
import styles from './LoginPage.module.scss';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { signInAsync } from './loginSlice';




function LoginForm() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {t} = useTranslation();
    const [isLogged, setIsLogged] = useState()


    const handleSubmit = (e) => {
        e.preventDefault();
        const { login, password } = Object.fromEntries(new FormData(e.target));
        dispatch(signInAsync({ username: login, password })).then((res) => {
            if(res.payload.token){
                setIsLogged(true);
                navigate('/Overview')
            }else{
                setIsLogged(false);
            }
          });
    }

    return (
        <>
           <h1 className={styles['login-header']}><span>FIN</span>track<span>.IO</span></h1>

            <form className={styles['centered-form']} onSubmit={handleSubmit}>
                <div>
                    <label className={styles['form-label']} htmlFor="login">{t("Login")}</label><br />
                    <input
                    className={styles['form-input']}
                    id="login"
                    name="login"
                    placeholder={t("Enter your login")}
                    required
                    />
                </div>
                <div>
                    <label className={styles['form-label']} htmlFor="password">{t("Password")}</label><br />
                    <input
                    className={styles['form-input']}
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••••"
                    required
                    />
                </div>
                {isLogged === false && <div style={{ color: 'red' }}>Incorrect Login</div>}
                <button className={styles['form-btn']} type="submit">
                    {t("Login-btn")}
                </button>
            </form>


        </>
    );
}

export default LoginForm;
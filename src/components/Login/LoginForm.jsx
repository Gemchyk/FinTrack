import React from 'react';
import { useRef } from 'react';
import { useNavigate } from 'react-router';
import styles from './LoginPage.module.scss';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { signInAsync } from './loginSlice';




const validationSchema = Yup.object({
    login: Yup.string().required('Login is required'),
    password: Yup.string().required('Password is required'),
  });



function LoginForm({}) {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {t} = useTranslation();


    const handleSubmit = (values) => {
        dispatch(signInAsync({
            username: values.login,
            password: values.password,
          })).then((res) => {
            console.log(res);
            if(res.payload.token){
                navigate('/Overview')
            }
          });
    }

    return (
        <>
           <h1 className={styles['login-header']}><span>FIN</span>track<span>.IO</span></h1>

            <Formik
            initialValues={{ login: "", password: "" }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
            >
            {({ status }) => (
                <Form className={styles['centered-form']}>
                <div>
                    <label className={styles['form-label']} htmlFor="login">{t("Login")}</label><br />
                    <Field
                    className={styles['form-input']}
                    name="login"
                    placeholder={t("Enter your login")}
                    />
                    <ErrorMessage
                    name="login"
                    component="span"
                    style={{ color: "red", fontSize: "14px" }}
                    />
                </div>
                <div>
                    <label className={styles['form-label']} htmlFor="password">{t("Password")}</label><br />
                    <Field
                    className={styles['form-input']}
                    name="password"
                    type="password"
                    placeholder="••••••••••"
                    />
                    <ErrorMessage
                    name="password"
                    component="span"
                    style={{ color: "red", fontSize: "14px" }}
                    />
                </div>
                {status && <div style={{ color: 'red' }}>{status}</div>}
                <button className={styles['form-btn']} type="submit">
                    {t("Login-btn")}
                </button>
                </Form>
            )}
            </Formik>

            
        </>
    );
}

export default LoginForm;
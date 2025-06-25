import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import styles from './LoginPage.module.scss';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import { Link } from 'react-router';
import * as Yup from 'yup';




const validationSchema = Yup.object({
    login: Yup.string().required('Login is required'),
    password: Yup.string().required('Password is required'),
  });



function LoginPage({}) {

    const navigate = useNavigate();
    const [status, setStatus] = useState()

    const handleSubmit = (values) => {
        console.log(values);
        if(values.login == "admin" && values.password == "admin"){
            navigate('/Overview');
            setStatus(null);
        }else{
            setStatus("Wrong login or password");
        }
    }

    return (
        <>
            <h1 className={styles['login-header']}><span>FIN</span>track<span>.IO</span></h1>
            <Formik
                initialValues={{
                    login: "",
                    password: ""
                }}
                onSubmit={handleSubmit}
                validationSchema={validationSchema}
                render={erors => 
                    <Form className={styles['centered-form']} >
                        {erors.login ? <div>{erors.login}</div> : null}
                        <div>
                            <label className={styles['form-label']} htmlFor="login">Login</label><br/>
                            <Field className={styles['form-input']} name="login" placeholder="Enter your login" />
                            <ErrorMessage name="login" component="span" style={{ color: "red", fontSize: "14px" }} />
                        </div>
                        <div>
                            <label className={styles['form-label']} htmlFor="password">Password</label><br/>
                            <Field className={styles['form-input']} name="password" type="password" placeholder="••••••••••"/>
                            <ErrorMessage name="password" component="span" style={{ color: "red", fontSize: "14px" }} />
                        </div>
                        {status &&<div style={{ color: 'red' }}>{status}</div>}
                        <button className={styles['form-btn']} type='submit'>Login</button>
                    </Form>
                }
            >
            </Formik>
            <div className={styles['flex']}>
                <div className={styles['line-div']}></div>
                <div className={styles['signIn-header-background']}><h3 className={styles['signIn-header']}>or sign in with</h3></div>
            </div>
            <button type='submit' className={styles['create-account-btn']}>create an account</button>
        </>
    );
}

export default LoginPage;
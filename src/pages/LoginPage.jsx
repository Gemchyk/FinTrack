import React from 'react';
import styles from './LoginPage.module.scss';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import { Link } from 'react-router';
import * as Yup from 'yup';

function LoginPage({}) {
    return (
        <>
            <h1 className={styles['login-header']}><span>FIN</span>track<span>.IO</span></h1>
            <Formik
                initialValues={{
                    login: ""
                }}
                // onSubmit={handleSubmit}
                // validationSchema={validation}
                render={erors => 
                    <Form className={styles['centered-form']} >
                        {erors.login ? <div>{erors.login}</div> : null}
                        <div>
                            <label className={styles['form-label']} htmlFor="email">Email Adress</label><br/>
                            <Field className={styles['form-input']} name="email" placeholder="Enter your email" /><br/>
                            <ErrorMessage name="login" component="span" />
                        </div>
                        <div>
                            <label className={styles['form-label']} htmlFor="password">Password</label><br/>
                            <Field className={styles['form-input']} name="password" type="password" placeholder="••••••••••"/>
                            <ErrorMessage name="password" component="span" />
                        </div>
                        <Link to="/Overview" className={styles['form-btn']} type='submit'>Login</Link>
                    </Form>
                }
            >
            </Formik>
            <div className={styles['flex']}>
                <div className={styles['line-div']}></div>
                <div className={styles['signIn-header-background']}><h3 className={styles['signIn-header']}>or sign in with</h3></div>
            </div>
            <Link to="" className={styles['create-account-btn']}>create an account</Link>
        </>
    );
}

export default LoginPage;
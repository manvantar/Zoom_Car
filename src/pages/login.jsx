import React from 'react';
import { Grid, Paper, Avatar, TextField, Button, Typography, Snackbar } from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import '../scss/loginRegister.scss';
import User from '../services/user';
import { useHistory } from "react-router";
import employee from '../services/employee';
const user = new User();

/**
* @description Login functional component to return Login Page
* @param handlechange when the values changes in the form 
* @return Login page component
*/
const Login = ({ handleChange }) => {
    const history = useHistory();
    const [open, SetOpen] = React.useState(false);
    const avatarStyle = { backgroundColor: 'red' }

    const initialValues = {
        email: '',
        password: '',
    }

    /**
    * @description Validation Schema using YUP
    * @return Error if validation fails
    */
    const validationSchema = Yup.object().shape({
        email: Yup.string().email('please enter valid email').required("Required"),
        password: Yup.string().required("Required").min(8)
    })

    /**
    * @description Handle Onsubmit-> Intigrates the data object with backemd when Services API is called
    * @params takes input as values and props
    */
    const onSubmit = (values, props) => {
        SetOpen(true)
        if (values) {
            const credentials = {
                "emailId": values.email,
                "password": values.password
            }
            user.login(credentials)
                .then(res => {
                    if (res.data.success === true) {
                        //alert(res.data.message)
                        localStorage.setItem('token', res.data.token);
                        employee.getAllEmployees();
                        history.push('/dashboard');
                    }
                    else {
                        alert("Something went wrong")
                    }
                }).catch(error => {
                    alert("Something went wrong " + error.message)
                });
            props.resetForm()
            props.setSubmitting(false)
        }
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        SetOpen(false)
    }

    return (
        <div>
            <Grid className='formStyle'>
                <Paper className='paperStyle'>
                    <h1 align='center' className='header'>EMPLOYEE PAYROLL</h1>
                    <Grid align='center'>
                        <Avatar data-testid="avatar" style={avatarStyle}><LockOutlinedIcon /></Avatar>
                        <h2 data-testid="LOGIN">LOGIN</h2>
                    </Grid>
                    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                        {(props) => (
                            <Form data-testid="form">
                                <Field as={TextField} className='btnstyle' data-testid="email" label='Email Address' name="email"
                                    placeholder='Enter Email' variant="outlined" fullWidth required
                                    helperText={<ErrorMessage className='error' name="email" />}
                                />
                                <Field as={TextField} className='btnstyle' data-testid="password" label='Password' name="password"
                                    placeholder='Enter password' variant="outlined" type='password' fullWidth required
                                    helperText={<ErrorMessage className='error' name="password" />} />

                                <Button type='submit' data-testid="button" color='primary' variant="contained" disabled={props.isSubmitting}
                                    className='btnstyle' fullWidth>{props.isSubmitting ? "Loading" : "Login"}</Button>
                            </Form>
                        )}
                    </Formik>
                    <Typography align='center'> Do not have an account ?
                        <Link data-testid="link" to="/register" >
                            Register
                        </Link>
                    </Typography>
                </Paper>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left'
                    }}>
                    open={open}
                    autoHideDuration={1000}
                    onClose={handleClose}
                    message="I'm SnackBar"
                    action={
                        <React.Fragment>
                            <Button onClick={handleClose}>Click me </Button>
                        </React.Fragment>
                    }

                </Snackbar>
            </Grid>

        </div>
    )
}

export default Login
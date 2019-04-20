<template>
    <section>
        <h1>Login</h1>
        <div v-if="errorMessage" class="alert alert-danger" role="alert">
            {{errorMessage}}
        </div>
        <form @submit.prevent="login">
            <div class="form-group">
                <label for="username">Username</label>
                <input
                    v-model="user.username"
                    type="text"
                    class="form-control"
                    id="username"
                    aria-describedby="usernameHelp"
                    placeholder="Enter a username"
                    required>
                <p id="usernameHelp" class="form-text text-muted">
                    Username must be at longer than 2 charachters and shorter than 30.
                    Usernam can only contain alphanumeric charachters and underscores.
                </p>
            </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input
                        v-model="user.password"
                        type="password"
                        class="form-control"
                        id="password"
                        aria-describedby="passwordHelp"
                        placeholder="Password"
                        required>
                    <p id="passwordHelp" class="form-text text-muted">Password must be 10 or more charachters long.</p>
                </div>

            <button type="submit" class="btn btn-primary">
                <span v-if="loggingIn" >
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Processing...
                </span>
                <span v-if="!loggingIn">Login</span>
                </button>
        </form>
    </section>
</template>

<script>
import Joi from 'joi';

const schema = Joi.object().keys({
    username: Joi.string().regex(/(^[a-zA-Z0-9_]+$)/).min(2).max(30).required(),
    password: Joi.string().trim().min(10).required()
});

const LOGIN_URL = 'http://localhost:5000/auth/login';

export default {
    data: () => ({
        loggingIn: false,
        errorMessage: '',
        user: {
            username: '',
            password: '',
        }
    }),
    watch: {
        user: {
            handler() {
                this.errorMessage = ''
            },
            deep: true
        }
    },
    methods: {
        login() {
            
            this.errorMessage = '';
            if (this.validUser()) {
                
                const body = {
                    username: this.user.username,
                    password: this.user.password
                }
                // send data to the server
                
                this.loggingIn = true;

                fetch(LOGIN_URL, {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(response => {
                    if(response.ok) {
                        return response.json();
                    }

                    return response.json().then(error=>{
                        throw new Error(error.message);
                    });
                }).then((result) => {
                    this.loggingIn = false;
                    console.log(result);
                    localStorage.setItem('token',result.token);
                    this.$router.push('/dashboard');
                }).catch(error => {
                    this.loggingIn = false;
                    console.error(error);
                    this.errorMessage = error.message;
                });
            }
        },
        validUser() {

            const result = Joi.validate(this.user, schema);
            if(result.error === null) {
                return true
            } else {
                if (result.error.message.includes('username')) {
                    this.errorMessage = 'Invalid Username'
                }
                if (result.error.message.includes('Password')) {
                    this.errorMessage = 'Invalid Password'
                }
                return false;
            }
        },
    }
};
</script>

<style>

</style>

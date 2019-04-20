<template>
<section>
    <h1>Signup</h1>
    <div v-if="errorMessage" class="alert alert-danger" role="alert">
        {{errorMessage}}
    </div>
    <form @submit.prevent="signup">
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
        <div class="form-row">
            <div class="form-group col-md-6">
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
            <div class="form-group col-md-6">
                <label for="confirmPassword">Confirm Password</label>
                <input
                    v-model="user.confirmPassword"
                    type="password"
                    class="form-control"
                    id="confirmPassword"
                    aria-describedby="confirmPasswordHelp"
                    placeholder="Confirm Password"
                    required>
                <p id="confirmPasswordHelp" class="form-text text-muted">Password confirm your password.</p>
            </div>

        </div>
        <button type="submit" class="btn btn-primary">
            <span v-if="signingUp" >
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Processing...
            </span>
            <span v-if="!signingUp">Signup</span>
            </button>
    </form>
</section>
</template>
<script>

    import Joi from 'joi';

    const schema = Joi.object().keys({
        username: Joi.string().regex(/(^[a-zA-Z0-9_]+$)/).min(2).max(30).required(),
        password: Joi.string().trim().min(10).required(),
        confirmPassword: Joi.string().trim().min(10).required()
    });

    const SIGNUP_URL = 'http://localhost:5000/auth/signup';

    export default {
        data: () => ({
            signingUp: false,
            errorMessage: '',
            user: {
                username: '',
                password: '',
                confirmPassword: ''
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
            signup() {
                if (this.validUser()) {
                    const body = {
                        username: this.user.username,
                        password: this.user.password
                    }
                    // send data to the server

                    this.signingUp = true;

                    fetch(SIGNUP_URL, {
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
                    }).then(() => {
                        this.signingUp = false;
                        this.$router.push('/login');
                    }).catch(error => {
                        this.signingUp = false;
                        console.error(error);
                        this.errorMessage = error.message;
                    });
                }
            },
            validUser() {
                this.errorMessage = '';
                if (this.user.password !== this.user.confirmPassword) {
                    this.errorMessage = 'Passwords must match'
                    return false;
                }

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
<style></style>

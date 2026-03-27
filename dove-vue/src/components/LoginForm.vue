<script setup lang="ts">
import type { LoginFormDto } from '@/models/form-data';
import { loginUser } from '@/services/backend-auth';
import { useLoggedUser } from '@/stores/logged-user';
import { ref } from 'vue'

const user = useLoggedUser();
const loginform = ref<LoginFormDto>({
  username: '',
  password: '',
});

function doLogin() {
    loginUser(loginform.value);
}

</script>
<template>
<div class="fullpage">
    <div v-if="user.loading">Loading user...</div>
    <div v-else class="login">
        <div>
            <span>Username</span>
            <span>
                <input v-model.trim="loginform.username" type="text" placeholder="Enter your username" />
            </span>
        </div>
        <div>
            <span>Password</span>
            <span>
                <input v-model.trim="loginform.password" type="password" placeholder="Enter your password" />
            </span>
        </div>
        <div>
            <button @click="doLogin">Login</button>
        </div>
    </div>
</div>
</template>
<style scoped>

.fullpage {
  display: flex;
  justify-content: center;   /* centro orizzontale */
  align-items: center;       /* centro verticale */
  width: 100vw;
  height: 100vh;
  background-color: #f5f5f5; /* opzionale */
}

.login {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: white;
  min-width: 300px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.login span {
  display: block;
}

input {
  width: 100%;
  padding: 8px;
  margin-top: 4px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

</style>
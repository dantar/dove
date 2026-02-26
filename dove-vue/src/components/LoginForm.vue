<script setup lang="ts">
import type { LoginFormDto } from '@/models/form-data';
import { loginUser } from '@/services/backend-auth';
import { ref } from 'vue'

const formVal:LoginFormDto = {
    username: '',
    password: '',
}
const formRef = ref(formVal);

function doLogin() {
    console.log(formVal);
    loginUser(formVal);
}

</script>
<template>
    <div>
        <span>Username</span>
        <span>
            <input v-model.trim="formRef.username" type="text" placeholder="Enter your username" />
        </span>
    </div>
    <div>
        <span>Password</span>
        <span>
            <input v-model.trim="formRef.password" type="password" placeholder="Enter your password" />
        </span>
    </div>
    <div>
        <button @click="doLogin">Login</button>
    </div>
</template>

<style scoped></style>
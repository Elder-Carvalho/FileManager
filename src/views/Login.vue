<template>
  <v-container class="login-view" fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex md3>
        
        <div class="login-form mb-1">
          <v-card>
            <v-card-text>
              <h2 class="">File Manager</h2>
              <v-text-field
                label="Email"
                v-model="email" 
              />
              <v-text-field
                label="Senha"
                type="password"
                v-model="password" 
              />
              <div class="text-xs-center">
                <v-btn 
                  block
                  color="primary" 
                  :loading="btnLoading"
                  @click="login"
                >
                  entrar
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </div>

      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class LoginView extends Vue {
  email: string = 'eld.carv@gmail.com'
  password: string = '123456'
  registerName: string = ''
  registerEmail: string = ''
  registerPassword: string = ''
  registerConfirmPassowrd: string = ''
  btnLoading: boolean = false

  async login () {
    try {
      this.btnLoading = true
      let payload = {
        email: this.email,
        password: this.password
      }
      let { data } = await this.$http.post('/login', payload, false)
      this.btnLoading = false

      this.$store.dispatch('auth/login', data.data)
    } catch (e) {
      this.btnLoading = false
    }
  }
}
</script>


<style lang="scss">
.login-view {
  .login-form {
    max-width: 300px;
    margin: 0 auto;
  }
}
</style>


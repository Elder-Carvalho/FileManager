<template>
  <v-app>

     <v-navigation-drawer 
      class="main-sidebar"
      v-if="isUserLoggedIn"
      app
      v-model="drawer"
      width="250"
    >
      <v-toolbar color="transparent" dark flat>
        <v-toolbar-title class="headline text-uppercase">
          <span>FILE</span>
          <span class="font-weight-light"> MANAGER</span>
        </v-toolbar-title>
      </v-toolbar>
      <v-list>
        <v-list-group>
          <template v-slot:activator>
            <v-list-tile>
              <v-list-tile-action>
                <v-icon>add</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Novo</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
          <v-list-tile>
            <v-list-tile-action>
              <v-icon>insert_drive_file</v-icon>
            </v-list-tile-action>
            <v-list-tile-content class="menu-file">
              Arquivo
              <input ref="file" type="file" @change="submitFile">
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-action>
              <v-icon>folder</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              Pasta
            </v-list-tile-content>
          </v-list-tile>
        </v-list-group>
        <v-divider></v-divider>
        <v-list-tile to="/">
          <v-list-tile-action>
            <v-icon>cloud_upload</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            Drive
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile to="/register">
          <v-list-tile-action>
            <v-icon>person</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            Usuários
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar v-if="isUserLoggedIn" app flat>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-spacer></v-spacer>
      <v-btn flat @click="logout">
        Sair
      </v-btn>
    </v-toolbar>
    
    <v-content>
      <router-view />
    </v-content>

    <v-dialog
      v-model="fileDialog"
      max-width="400px"
    >
      <v-card>
        <v-card-text>
          
        </v-card-text>  
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="snackbar"
      top
    >
      Upload Concluído
      <v-btn
        color="primary"
        flat
        @click="snackbar = false"
      >
        fechar
      </v-btn>
    </v-snackbar>

  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'App'
})
export default class App extends Vue {
  drawer: boolean = true
  fileDialog: boolean = false
  file: File
  snackbar: boolean = false

  get isUserLoggedIn () {
    return this.$store.state.auth.isUserLoggedIn
  }
  
  logout() {
    this.$store.dispatch('auth/logout')
  }

  async submitFile () {
    let res
    this.file = this.$refs.file.files[0]
    let formData = new FormData()
    formData.append('file', this.file)
    let nameArr = this.file.name.split('.')
    let ext = nameArr[nameArr.length - 1]
    formData.append('extension', ext)
    formData.append('type', this.file.type)
    try {
      res = await this.$http.post('files', formData, true, { 'Content-Type': 'multipart/form-data' })
      this.snackbar = true
      this.$store.commit("files/UPLOAD_DONE")
    } catch (e) {
      console.log(e.message)
    }
  }
}
</script>

<style lang="scss">
.main-sidebar {
  background-image: linear-gradient(to top right, #13293D, #1976d2) !important; 

  .v-list {
    background: transparent !important;
  }

  .v-list__tile--active .v-list__tile__action:first-of-type .v-icon,
  .v-list__tile__content,
  .v-list__tile__title,
  .theme--light.v-icon {
    color: #FFF;
  }
  .v-list__tile--active {
    // background-color: darken($primary-dark, 10); 
  }
  .menu-file {
    position: relative;

    input {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
    }
  }
}
</style>


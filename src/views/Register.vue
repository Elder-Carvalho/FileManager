<template>
  <v-container class="register-view" fluid>
   <v-card>
      <v-card-text>
        <v-btn color="primary" @click="openRegisterDialog('create')">Novo</v-btn>
        <v-data-table
          :headers="headers"
          :items="users"
          item-key="id"
          :loading="tableLoading"
        >
          <template v-slot:items="props">
            <td>{{ props.item.id }}</td>
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.email }}</td>
            <td>{{ props.item.folder }}</td>
            <td>{{ getRoleDescription(props.item.role) }}</td>
            <td>
              <v-btn icon color="success" @click="openRegisterDialog('edit', props.item)">
                <v-icon>edit</v-icon>
              </v-btn>
              <v-btn icon color="error">
                <v-icon>delete</v-icon>
              </v-btn>
            </td>
          </template>
        </v-data-table>
      </v-card-text>
   </v-card>
      
    
    <v-dialog
      width="350"
      v-model="registerDialog"
    >
      <v-card>
        <v-card-text>
          <h2 class="headline">{{ registerDialogTitle }}</h2>
          <v-text-field
            label="Nome"
            v-model="name" 
          />
          <v-text-field
            label="Email"
            v-model="email" 
          />
          <v-autocomplete 
            label="Perfil"
            v-model="role"
            :items="roles"
            dense
          />
          <v-text-field
            label="Pasta"
            v-model="folder"
            :prefix="folderPrefix"
          />
          <v-container fluid grid-list-md class="px-0 py-0">
            <v-layout row wrap>
              <v-flex xs12 md6>
                <v-text-field
                  label="Senha"
                  type="password"
                  v-model="password"
                />
              </v-flex>
              <v-flex xs12 md6>
                <v-text-field
                  label="Confirmar Senha"
                  type="password"
                  v-model="confirmPassowrd" 
                />
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="closeRegisterDialog">cancelar</v-btn>
          <v-btn color="primary" flat :loading="btnLoading" @click="register">
            cadastrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="generalDialog" width="250"> 
      <v-card>
        <v-card-title primary-title>
          <h2 class="headline">{{ generalDialogTitle }}</h2>
        </v-card-title>
        <v-card-text>
          <p>{{ generalDialogText }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="generalDialog = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import User from '../models/User'
import Role from '../models/Role'

@Component
export default class RegisterView extends Vue {
  users: User[] = []
  roles: any[] = []
  user: User
  name: string = ''
  email: string = ''
  password: string = ''
  role: number = 2
  folder: string = ''
  folderPrefix: string = '/user/'
  confirmPassowrd: string = ''
  btnLoading: boolean = false
  showLoginForm: boolean = true
  registerDialog: boolean = false
  registerDialogTitle: string = "Novo Usuário"
  registerDialogAction: string = 'create' 
  generalDialogTitle: string = ''
  generalDialogText: string = ''
  generalDialog: boolean = false
  tableLoading: boolean = false
  headers: any[] = [
    { text: 'ID', value: 'id' },
    { text: 'Name', value: 'name' },
    { text: 'Email', value: 'email' },
    { text: 'Pasta', value: 'folder' },
    { text: 'Perfil', value: 'role' },
    { text: 'Ações', value: '' }
  ]

  @Watch('name')
  onNameChanged(value) {
    this.folder = value.split(' ')[0].toLowerCase() 
  }

  @Watch('role')
  onRoleChanged(value) {
    this.folderPrefix = value === 1 ? '/admin/' : '/user/'
  }

  created () {
    this.init()
  }

  async init() {
    await this.getRoles()
    await this.getUsers()
  }

  async getUsers() {
    try {
      this.tableLoading = true
      let { data } = await this.$http.get('/users')
      this.users = data.data.map(o => new User(o.id, o.name, o.email, o.role, o.folder, o.password))
      this.tableLoading = false
    } catch (e) {
      this.tableLoading = false
      this.openDialog('generalDialog', 'Erro', e.message)
    }
  }

  async getRoles() {
    try {
      let { data } = await this.$http.get('/roles')
      this.roles = data.data.map(r => {
        return { text: r.description, value: r.id}
      })   
    } catch (e) {
      this.openDialog('generalDialog', 'Erro', e.message)
    }
  }

  getRoleDescription(roleID: number) {
    return this.roles.find(r => r.value === roleID).text
  }

  openRegisterDialog(action: string, user: User) {
    this.registerDialogAction = action
    this.generalDialogTitle = action === 'create' ? 'Novo Usuário' : 'Editar Usuário'
    if (action === 'edit') {
      this.user = user
      this.name = user.name
      this.email = user.email
      this.role = user.role
      this.folder = user.folder
    }
    this.registerDialog = true
  }
  
  async register() {
    let res, msg
    try {
      this.btnLoading = true
      let payload = {
        name: this.name,
        email: this.email,
        role: this.role,
        folder: '/' + this.folder,
        password: this.password
      }
      if (this.registerDialogAction === 'create') {
        res = await this.$http.post('/users', payload, false)
        msg = 'Usuário cadastrado com sucesso'
      } else if (this.registerDialogAction === 'edit') {
        res = await this.$http.put('/users/'+ this.user.id, payload, false)
        msg = 'Usuário editado com sucesso'
      } 
      this.btnLoading = false
      this.closeRegisterDialog()
      this.openDialog('generalDialog', 'Sucesso', msg)
      this.getUsers()
    } catch (e) {
      this.btnLoading = false
      this.openDialog('generalDialog', 'Erro', res.data.data.message)
    }
  }

  closeRegisterDialog() : void {
    this.name = ''
    this.email = ''
    this.folder = ''
    this.password = ''
    this.role = 2
    this.confirmPassowrd = ''
    this.registerDialogTitle = 'Novo Usuário'
    this.registerDialogAction = 'create'
    this.registerDialog = false
  }

  openDialog (dialog: string, title: string, text: string, ) : void {
    this[dialog+'Title'] = title
    this[dialog+'Text'] = text
    this[dialog] = true
  }
}
</script>


<style lang="scss">
.register-view {
  .register-form {
   
  }
}
</style>


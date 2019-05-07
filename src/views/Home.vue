<template>
  <v-container fluid class="home-view">
    <h3 class="headline mb-4" v-if="userData">Olá, <strong class="primary--text">{{ userData.user.name.split(' ')[0] }}</strong>! O que vamos guardar hoje?</h3>
    
    <v-toolbar class="mb-4" dense color="transparent" flat>
    
      <v-overflow-btn
        :items="uploadOptions"
        label="Overflow Btn"
        target="#dropdown-example"
      ></v-overflow-btn>
  
      <v-spacer></v-spacer>
      <v-btn-toggle v-model="toggleLayout">
        <v-btn flat>
          <v-icon>grid_on</v-icon>
        </v-btn>
        <v-btn flat>
          <v-icon>view_list</v-icon>
        </v-btn>
      </v-btn-toggle>
    </v-toolbar>
    
    <!-- <img src="@/assets/images/document.png" alt=""> -->
    <div class="files-grid" v-if="toggleLayout === 0">
      <v-hover  v-for="file in files" :key="file.title">
        <v-card class="file-card mb-4" slot-scope="{ hover }" :class="`elevation-${hover ? 12 : 2}`">
          <v-img :src="getExtensionImageSrc(file)" alt="" height="150" width="100%" />
          <v-card-text>
            <h3 class="mb-2">{{ file.title }}</h3>
            <p class="mb-0">Tamanho: {{ file.getSize() }}</p>
          </v-card-text>
        </v-card>
      </v-hover>
    </div>
    <div class="files-list" v-if="toggleLayout === 1">
      <v-data-table
        :headers="headers"
        :items="files"
        item-key="id"
      >
        <template v-slot:items="props">
          <td>{{ props.item.id }}</td>
          <td>{{ props.item.title }}</td>
          <td>{{ props.item.path }}</td>
          <td>{{ props.item.extension }}</td>
          <td>{{ props.item.getSize() }}</td>
          <td>{{ props.item.type }}</td>
          <td>{{ props.item.getCreationDatetime() }}</td>
          <td>{{ props.item.getUpdateDatetime() }}</td>
        </template>
      </v-data-table>
    </div>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import File from '../models/File'
import DefaultFileImg from '@/assets/images/document.png'

@Component
export default class Home extends Vue {
  uploadOptions: string[] = ['Arquivo','Pasta']
  files: File[] = []
  toggleLayout: number = 0
  headers: any[] = [
    { text: 'ID', value: 'id' },
    { text: 'Nome', value: 'title' },
    { text: 'Caminho', value: 'path' },
    { text: 'Extensão', value: 'extension' },
    { text: 'Tamanho', value: 'size' },
    { text: 'Tipo', value: 'type' },
    { text: 'Criado em', value: 'createdAt' },
    { text: 'Atualizado em', value: 'updatedAt' }
  ]
  
  get userData() {
    return this.$store.getters['auth/getUserData']
  }

  get userRoleFolder() {
    return this.userData.user.role === 1 ? '/admin/' : '/user/'
  }

  get uploadDone() {
    return this.$store.state.files.uploadDone
  }

  @Watch('uploadDone')
  onUploadDoneChanged(value) {
    this.getFiles()
  }
  

  created() {
    this.getFiles()
  }

  async getFiles() {
    let res
    try {
      res = await this.$http.get('/files')
      this.files = res.data.data.map(f => new File(f.id, f.title, f.path, f.createdAt, f.updatedAt, f.extension, f.size, f.type))
    } catch (e) {
      console.log(res)
    }
  }

  getExtensionImageSrc(file: File) : string {
    if (file.type.indexOf('image') !== -1) {
      return this.$http.getAPIUrl() + '/static' + this.userRoleFolder  + file.path
    }
    try {
      let extImage = require(`@/assets/images/${file.extension}.png`)
      return extImage
    } catch (e) {

    }
    return DefaultFileImg
  }
  
}
</script>

<style lang="scss">
.home-view {
  .files-grid {
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;

    .file-card {
      cursor: pointer;
      width: calc(100% / 6 - 20px);
      margin-right: 20px;

      @media only screen and (max-width: 1366px) {
        width: calc(100% / 4 - 20px);
      }
      @media only screen and (max-width: 1024px) {
        width: calc(100% / 3 - 20px);
      }
      @media only screen and (max-width: 640px) {
        width: calc(100% / 2 - 20px);
      }
      @media only screen and (max-width: 480px) {
        width: 100%;
        margin-right: 0;
      }
    }
  }
}
</style>


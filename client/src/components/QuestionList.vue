<template>
  <v-layout row class="forborder">
    <v-flex md2>
      <v-list-item-content>
        <v-list-item-title>Votes</v-list-item-title>
        <v-list-item-subtitle>{{q.upVote.length - q.downVote.length}}</v-list-item-subtitle>
        <v-list-item-title>Answers</v-list-item-title>
        <v-list-item-subtitle>{{replies}}</v-list-item-subtitle>
      </v-list-item-content>
    </v-flex>
    <v-divider vertical></v-divider>
    <v-flex md6 >
      <v-list-item-title @click="showDetail(q._id)" class="clickhover">
        <h3>{{q.title}}</h3> <br>
      </v-list-item-title>
      <p class="elipsis"> {{q.content}} </p>
      <v-list-item-subtitle>by: {{q.userId.name}}</v-list-item-subtitle>
    </v-flex>

    <v-flex v-if="q.userId._id == currentUser" md1>
      <v-btn color="warning" @click="edit(q._id)">Edit</v-btn>
    </v-flex>
    <v-flex v-if="q.userId._id == currentUser" md1>
      <v-btn color="error" @click="remove(q._id)">Delete</v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'
import Swal from 'sweetalert2'
const url = 'http://34.87.27.57'

export default {
  name: 'questionlist',
  props: ['q'],
  data () {
    return {
      replies: 0
    }
  },
  methods: {
    showDetail (id) {
      this.$router.push(`/home/${id}`)
    },

    edit (id) {
      this.$store.commit('CHANGEPAGE', 'question')
      this.$store.commit('CHANGEEDITID', id)
      this.$router.push('/home/editor')
    },

    remove (id) {
      let token = localStorage.getItem('token')
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then(result => {
        if (result.value) {
          axios
            .delete(`${url}/questions/${id}`, { headers: { token } })
            .then(({ data }) => {
              this.$store.dispatch('getQuestions')
              Swal.fire('Deleted!', 'Your file has been deleted.', 'success')
            })
        }
      })
    }
  },
  computed: mapState(['answers', 'currentUser']),

  created () {
    let token = localStorage.getItem('token')
    axios.get(`${url}/answers/${this.q._id}`, { headers: { token } })
      .then(({ data }) => {
        this.replies = data.length
      })
      .catch(console.log)
  }
}
</script>

<style>
.clickhover:hover {
  color: orange;
  transition: 0.3s all;
}

.elipsis {
 overflow: hidden;
 text-overflow: ellipsis;
 display: -webkit-box;
 -webkit-box-orient: vertical;
 -webkit-line-clamp: 4; /* number of lines to show */
 line-height: 1.5;        /* fallback */
 max-height: 4*1.5;       /* fallback */
}

.forborder {
  margin-bottom: 10px;
  border-bottom: 1px solid black;
}
</style>

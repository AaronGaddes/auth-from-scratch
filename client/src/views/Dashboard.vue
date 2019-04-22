<template>
    <section>
        <h1>Dashboard</h1>
        <h2>Hi <span v-if="user">{{user.username}}</span></h2>
        <button @click="logout" class="btn btn-primary">Logout</button>
        <br>
        <br>
        <button @click="showForm = !showForm" class="btn btn-success">Toggle Form</button>        
        <form v-if="showForm" @submit.prevent="addNote()">
            <div class="form-group">
                <label for="title">Title</label>
                <input
                    type="text"
                    v-model="newNote.title"
                    class="form-control"
                    id="title"
                    aria-describedby="titleHelp"
                    placeholder="Title"
                    required>
                <p
                    id="titleHelp"
                    class="form-text text-muted">Enter a descriptive title for your note.</p>
            </div>
            <div class="form-group">
                <label for="note">Note</label>
                <textarea
                    class="form-control"
                    id="note"
                    v-model="newNote.note"
                    rows="3"
                    aria-describedby="noteHelp"
                    placeholder="Enter your note."
                    required></textarea>
                <p id="noteHelp" class="form-text text-muted">Enter your note.</p>
            </div>
            <button type="submit" class="btn btn-success">Add Note</button>
        </form>
        <section class="row mt-3">
            <div class="col-6"
                 v-for="note in notes"
                :key="note._id">
                <div class="card border-info mb-3">
                    <div class="card-header">{{note.title}}</div>
                    <div class="card-body">
                        <div class="card-text" v-html="renderMarkdown(note.note)"></div>
                    </div>
                </div>
            </div>
        </section>
    </section>
</template>

<script>
import MarkdownIt from 'markdown-it';
import MDemoji from 'markdown-it-emoji';

const md = new MarkdownIt();

md.use(MDemoji);

const API_URL = 'http://localhost:5000/';
export default {
    data: () => ({
        user: null,
        showForm: false,
        newNote: {
            title: '',
            note: ''
        },
        notes: []
    }),
    mounted() {
        fetch(API_URL, {
            headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }).then(res => res.json())
        .then(result => {
            if(result.user) {
                this.user = result.user;
                this.getNotes();
            } else {
                this.logout();
            }
        })
    },
    methods: {
        renderMarkdown(note){
            return md.render(note);
        },
        getNotes() {
            fetch(`${API_URL}api/v1/notes`,{
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }).then(res => res.json())
            .then(notes => {
                this.notes = notes;
            })
        },
        addNote() {
            fetch(`${API_URL}api/v1/notes`,{
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(this.newNote)
            }).then(res => res.json())
            .then(note => {
                this.newNote = {
                    title: '',
                    note: ''
                };
                this.showForm = false;
                this.notes.push(note);
            })
        },
        logout() {
            localStorage.removeItem('token');
            this.$router.push('/login');
        }
    }
}
</script>

<style>
.card {
    height: 90%;
}
    .card-text img {
        width: 100%;
    }
</style>

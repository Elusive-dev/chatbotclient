<template>
  <section class="pt-10 bg-gray-100 sm:pt-16 lg:pt-24">
    <div class="px-4 min-h-[60vh] mx-auto sm:px-6 lg:px-8 max-w-7xl">
      <div class="max-w-2xl mx-auto text-center">
        <h2
          class="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl lg:leading-tight"
        >
          Smart Document Chatbot
        </h2>
       
        
        <p>
          Welcome to our Smart Document Chatbot, designed to make your document
          creation process faster, easier, and more efficient than ever before.
          Whether you're drafting a business proposal, writing a research paper,
          or composing a heartfelt letter, our intelligent chatbot is here to
          assist you every step of the way.
        </p>
        <q-btn
          v-if="activeUser"
          :to="{ path: '/chatbot' }"
          class="inline-flex items-center justify-center px-6 py-4 mt-12 text-base font-semibold text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:bg-blue-700"
          role="button"
        >
          <svg
            class="w-5 h-5 mr-2 -ml-1"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          Start Using
        </q-btn>
        <div v-else class="flex mt-4 justify-center items-center gap-3">
          <q-btn @click="OpenBox('login')" color="green">Login</q-btn>
          <q-btn @click="OpenBox('register')" color="blue">Register</q-btn>
        </div>
      </div>
    </div>

    <div class="mx-auto 2xl:px-12">
      <img
        class="w-full mt-6"
        src="https://cdn.rareblocks.xyz/collection/celebration/images/team/4/group-of-people.png"
        alt=""
      />
    </div>

    <q-dialog v-model="authbox">
      <div v-if="auth == 'login'" class="bg-white w-[70%] p-4 rounded-md">
        <p class="text-center text-lg capitalize font-bold text-blue-600">
          {{ auth }}
        </p>
        <q-input label="Email" type="text" v-model="email"></q-input>
        <q-input label="Password" type="password" v-model="password"></q-input>
        <q-btn @click="Login" :disable="!isValid1" color="green" class="mt-4"
          >Login</q-btn
        >
      </div>
      <div v-if="auth == 'register'" class="bg-white w-[70%] p-4 rounded-md">
        <p class="text-center text-lg font-bold capitalize text-blue-600">
          {{ auth }}
        </p>
        <q-input label="Fullname" type="text" v-model="fullname"></q-input>
        <q-input label="Email" type="text" v-model="email"></q-input>
        <q-input label="Password" type="password" v-model="password"></q-input>
        <q-btn @click="Signup" :disable="!isValid2" color="green" class="mt-4"
          >Register</q-btn
        >
      </div>
    </q-dialog>
  </section>
</template>

<script>
let store;
let crud;
let users = [];
export default {
  data: () => ({
    authbox: false,
    email: '',
    password: '',
    fullname: '',
    auth: '',
  }),
  setup() {
    definePageMeta({
      layout: 'home',
    });
  },
  methods: {
    Signup() {
      users.push({
        fullname: this.fullname,
        email: this.email,
        password: this.password,
        id: 'Mank' + Math.floor(Math.random() * 283232323).toString(),
      });
      this.auth = 'login';
      ShowSnack('User Registerd Successfully', 'positive');
      localStorage.setItem('allusers', JSON.stringify(users));
    },
    Login() {
      let allusers = JSON.parse(localStorage.getItem('allusers')) || [];
      let userData =
        allusers.find(
          (v) =>
            v.email.toLowerCase() == this.email && v.password == this.password
        ) || {};

      if (userData.id) {
        ShowSnack('Login Successfull', 'positive');
        localStorage.setItem('userData', JSON.stringify(userData));
        store.SetActiveUser(userData.id, true);
        store.SetUserData(userData);
        this.authbox = false;
        this.$router.push({ path: '/chatbot' });
        return;
      }
      ShowSnack('Login Detials Incorrect', 'negative');
    },
    OpenBox(auth) {
      this.auth = auth;
      this.authbox = true;
    },
  },
  created() {
    store = useLoungeStore();
  },
  computed: {
    activeUser() {
      return store.activeUser;
    },
    isValid1() {
      if (this.email && this.password) {
        return true;
      }

      return false;
    },
    isValid2() {
      if (this.email && this.password && this.fullname) {
        return true;
      }

      return false;
    },
  },
  mounted() {
    let user = JSON.parse(localStorage.getItem('userData')) || {};
    users = JSON.parse(localStorage.getItem('allusers')) || [];
    console.log(user)
    if (user.id) {
      store.SetActiveUser(user.id, true);
      store.SetUserData(user);
    }
  },
};
</script>

<style></style>

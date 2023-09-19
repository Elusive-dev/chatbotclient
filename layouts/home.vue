<template>
  <div>
    <div
      class="flex justify-between px-2 py-10 items-center bg-white shadow-md"
    >
      <p class="text-2xl font-bold">ChatBot</p>

      <q-btn @click="Logout" v-if="activeUser">Logout</q-btn>
    </div>
    <slot />
  </div>
</template>

<script>
let store;
export default {
  data: () => ({}),
  setup() {
    definePageMeta({
      layout: 'home',
    });
  },
  methods: {
    Logout() {
      store.SetActiveUser('', false);
      localStorage.removeItem('userData');
      ShowSnack('Logout Successfull', 'positive');
    },
  },
  created() {
    store = useLoungeStore();
  },
  computed: {
    activeUser() {
      return store.activeUser;
    },
  },
  mounted() {
    let user = JSON.parse(localStorage.getItem('userData')) || {};
    if (user.id) {
      store.SetActiveUser(user.id, true);
      store.SetUserData(user);
    }
  },
};
</script>

<style></style>

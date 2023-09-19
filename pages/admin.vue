<template>
  <div class="flex w-full justify-center min-h-screen items-center">
    <div v-if="login" class="bg-white w-[70%] p-4 rounded-md">
      <p class="text-center text-lg capitalize font-bold text-blue-600">
        Admin Login
      </p>
      <q-input label="Email" type="text" v-model="email"></q-input>
      <q-input label="Password" type="password" v-model="password"></q-input>
      <q-btn @click="Login" :disable="!isValid1" color="green" class="mt-4"
        >Login</q-btn
      >
    </div>
    <div v-else class="flex w-full flex-col justify-start items-center text-center">
      <p class="text-2xl text-center font-bold underline">Admin Dashboard</p>

      <p class="text-left text-lg font-bold">All Users</p>

      <div>
        <div class="overflow-x-auto w-full">
          <table class="w-full divide-y-2 divide-gray-200 bg-white text-sm">
            <thead class="ltr:text-left rtl:text-right">
              <tr>
                <th
                  class="whitespace-nowrap px-4 py-2 font-medium text-gray-900"
                >
                  Name
                </th>
                <th
                  class="whitespace-nowrap px-4 py-2 font-medium text-gray-900"
                >
                  Email
                </th>
                <th
                  class="whitespace-nowrap px-4 py-2 font-medium text-gray-900"
                >
                  Action
                </th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-200">
              <tr v-for="(user, index) in users" :key="index">
                <td
                  class="whitespace-nowrap px-4 py-2 font-medium text-gray-900"
                >
                  {{ user.fullname }}
                </td>
                <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                  {{ user.email }}
                </td>
                <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                  <q-btn @click="Delete(index)" color="red">Delete User</q-btn>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    login: false,
    email: '',
    password: '',
    users: [],
  }),
  methods: {
    Login() {
      if (this.email == 'admin@email.com' && this.password == 'admin12345') {
        this.login = false;
        ShowSnack('Login Successfull', 'positive');
        this.GetUsers();
      } else {
        ShowSnack('Login inccorect', 'negative');
      }
    },
    Delete(id) {
        this.users.splice(id, 1);
      console.log(this.users)
      localStorage.setItem('allusers', JSON.stringify(this.users));
      ShowSnack('User deleted!', 'negative');
    },
    GetUsers() {
      this.users = JSON.parse(localStorage.getItem('allusers')) || [];
    },
  },
  mounted() {
    this.GetUsers();
  },

  computed: {
    isValid1() {
      if (this.email && this.password) {
        return true;
      }

      return false;
    },
  },
};
</script>

<style></style>

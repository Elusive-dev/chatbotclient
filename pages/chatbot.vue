<template>
  <div
    style="width: 100vw; height: 100vh"
    :style="darkTheme && 'backgroundColor: #2C2D2E'"
  ></div>
  <!--Theme switch-->
  <div
    style="position: fixed; top: 0px; right: 0px; margin: 20px"
    :style="darkTheme && 'color: #fff'"
    @click="darkTheme = !darkTheme"
  >
    {{ darkTheme ? 'Light' : 'Dark' }} Style
  </div>
  <div class="absolute top-1 z-10 left-1">
    <q-btn @click="FireInput" round color="secondary" icon="cloud_upload" />
    <input
      ref="fileinput"
      @change="UploadImage"
      type="file"
      id="input-120"
      aria-describedby="input-120-messages"
      accept=".pdf, .txt"
      class="opacity-0"
    />
  </div>

  <div
    class="absi rounded-md flex text-center justify-center items-center shadow-md w-[80%] px-10 py-5"
  >
    <p class="font-bold text-2xl text-blue-500">Instruction!</p>
    <p>Click The chat icon to begin...</p>
    <p>You can upload files in pdf & doc by selecting the upload Icon Button</p>
    <p>You can also copy and paste the required files needed</p>
  </div>

  <Chat
    v-if="ready"
    :onSend="handleSendEvent"
    :chat="datal"
    :bgColorHeader="darkTheme && '#1e1e1e'"
    :bgColorChat="darkTheme && '#2C2D2E'"
    :bgColorInput="darkTheme && '#1e1e1e'"
    :bgColorIcon="darkTheme && '#9B51E0'"
    :bgColorMessageChatbot="darkTheme && '#1e1e1e'"
    :bgColorMessagePerson="darkTheme && '#9B51E0'"
    :bgColorMessageTimestamp="darkTheme && '#1e1e1e'"
    :textColorInput="darkTheme && '#fff'"
    :textColorHeader="darkTheme && '#fff'"
    :textColorMessageChatbot="darkTheme && '#fff'"
    :textColorMessageTimestamp="darkTheme && '#fff'"
    ref="ch"
  />
</template>

<script>
import { Chat } from '@chat-ui/vue3';
export default {
  data: () => ({
    ready: false,
    file: null,
    datal: [
      {
        message: 'Click on the upload icon to upload files',
        type: 'chatbot',
        timestamp: '3:45 PM',
      },
    ],
    darkTheme: true,
  }),
  components: {
    Chat,
  },
  methods: {
    FireInput() {
      const input = this.$refs.fileinput;
      console.log(input);
      input.click();
    },
    UploadImage() {
      const input = this.$refs.fileinput;
      this.file = input.files[0];
      if (this.file == null) {
        ShowSnack('No File Selected!', 'negative');
        return;
      }
      console.log(this.file);
      const messagePerson = {
        message: `${this.file.name} Uploaded`,
        type: 'person',
        timestamp: this.formatAMPM(new Date()),
      };
      this.datal.push(messagePerson);
      setTimeout(async () => {
        const messageChatbot = {
          type: 'chatbot',
          timestamp: this.formatAMPM(new Date()),
          message: 'Processing File',
        };
        this.datal.push(messageChatbot);
      }, this.getRandomNumber());
    },
    handleSendEvent(input) {
      if (input == '') return;
      const messagePerson = {
        type: 'person',
        timestamp: this.formatAMPM(new Date()),
        message: input,
      };
      this.datal.push(messagePerson);

      setTimeout(async () => {
        const response = await fetch('https://www.boredapi.com/api/activity');
        const res = await response.json();
        const messageChatbot = {
          type: 'chatbot',
          timestamp: this.formatAMPM(new Date()),
          message: res.activity,
        };
        this.datal.push(messageChatbot);
      }, this.getRandomNumber());
    },

    getRandomNumber() {
      return Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000;
    },

    formatAMPM(date) {
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0' + minutes : minutes;
      var strTime = hours + ':' + minutes + ' ' + ampm;
      return strTime;
    },
  },
  mounted() {
    this.ready = true;
  },
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.absi {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
}
</style>

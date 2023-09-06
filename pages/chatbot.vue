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
    <q-btn
      v-if="!ModiData.id"
      :loading="loading"
      @click="FireInput"
      round
      color="secondary"
      icon="cloud_upload"
    />
    <q-btn v-else @click="ModiData = {}" round color="red" icon="close" />
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
    v-if="ModiData.id"
    class="absi rounded-md flex flex-col text-center gap-3 shadow-md w-[80%] px-10 py-5"
  >
    <div v-if="loading" class="flex flex-col p-4 justify-center items-center">
      <img width="100" src="@/assets/load.gif" alt="" />
      <p>Processing Document</p>
    </div>
    <div class="flex flex-col gap-3" v-else>
      <div
        class="w-full flex justify-center items-center flex-wrap px-3 bg-gray-100 cardex shadow-md rounded-md"
      >
        <p class="font-bold text-lg underline">{{ ModiData.title }}</p>
      </div>
      <div
        class="w-full flex flex-col text-center justify-center items-center flex-wrap px-3 bg-gray-100 cardex shadow-md rounded-md"
      >
        <p class="font-bold text-md underline">Summary</p>
        <p class="font-semibold text-md">{{ ModiData.document }}</p>
      </div>
      <div
        class="w-full flex flex-col text-center justify-center items-center flex-wrap px-3 bg-gray-100 cardex shadow-md rounded-md"
      >
        <p class="font-bold text-md underline">Related Articles</p>

        <div
          @click="GetUrl(i.id, i.source, index)"
          v-for="(i, index) in ModiData.lists.slice(0, 4)"
          :key="index"
          class="font-semibold cursor-pointer bg-white p-3 rounded shadow-md mb-3 text-md"
        >
          <p>{{ i.title }}</p>
          <q-btn @click="MyLinks(index)" size="8px">View Links</q-btn>
          <div class="flex flex-wrap justify-center items-center gap-3">
            <a class="underline text-xs text-blue" v-for="(i, n) in linkBox.find((v)=> v.id == index)?.links || [] " :key="n" :href="i.url">Link{{n}}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    v-else
    class="absi rounded-md flex flex-col text-center justify-center items-center shadow-md w-[80%] px-10 py-5"
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
// import fetch from 'node-fetch';\
import axios from 'axios';
import { Chat } from '@chat-ui/vue3';
export default {
  data: () => ({
    ready: false,
    file: null,
    loading: false,
    linkBox: [],
    ModiData: {
      title: '',
      document: '',
      lists: [],
      id: '',
    },
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
      input.click();
    },
    async UploadImage() {
      try {
        this.ModiData.id = Math.floor(Math.random() * 1000).toString();
        this.loading = true;
        const input = this.$refs.fileinput;
        this.file = input.files[0];
        if (this.file == null) {
          ShowSnack('No File Selected!', 'negative');
          return;
        }
        let mm = await this.Push(this.file);
        const rep = await this.ChatGpt(mm.trim());
        let redata = JSON.parse(rep);
        let title = redata.title || 'No title';
        let url = encodeURI(
          `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${title}`
        );
        const response = await axios(url);
        console.log(response);
        this.ModiData.title = title;
        this.ModiData.document = redata.document;
        this.ModiData.lists = response.data.resultList.result;
        console.log(url);
        let cdata = {
          message: redata.document || 'Not An Article',
          type: 'chatbot',
          timestamp: '3:45 PM',
        };
        this.datal.push(cdata);
        this.loading = false;
      } catch (err) {
        this.loading = false;
        console.log(err);
      }
    },
    async ChatGpt(msg) {
      try {
        const runtimeConfig = useRuntimeConfig();
        let messages = [];
        let message = {
          role: 'user',
          content: `Hello chatgpt  can you sumarize this article and highlight important points  "${msg}" in json format, i want the title seperated from the sumarized document eg {title: '', document: ''}`,
        };
        messages.push(message);
        let body = {
          model: 'gpt-3.5-turbo-16k-0613',
          messages: messages,
          temperature: 0.7,
        };
        var configs = {
          method: 'post',
          maxBodyLength: Infinity,
          url: 'https://api.openai.com/v1/chat/completions',
          headers: {
            Authorization: `Bearer ${runtimeConfig.public.GPT_KEY}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          data: JSON.stringify(body),
        };
        const response = await axios(configs);
        let chres = response?.data?.choices[0]?.message.content;
        return chres;
      } catch (err) {
        console.log(err);
      }
    },
    async Push(file) {
      try {
        const form = new FormData();
        form.append('pdfFile', file);
        const res = await fetch('https://pdfparse.onrender.com/extract-text', {
          method: 'POST',
          body: form,
        });
        const data = await res.text();
        const trimedtext = await data.trim();
        return trimedtext;
      } catch (error) {
        console.log(error);
      }
    },
    async dataURItoBlob(file) {
      return new Blob(await file.arrayBuffer());
    },
    async handleSendEvent(input) {
      this.loading = true;
      if (input == '') return;
      const messagePerson = {
        type: 'person',
        timestamp: this.formatAMPM(new Date()),
        message: input,
      };
      this.ModiData.id = Math.floor(Math.random() * 1000).toString();
      this.datal.push(messagePerson);
      let adata = {
        message: 'Processing....',
        type: 'chatbot',
        timestamp: this.formatAMPM(new Date()),
      };
      this.datal.push(adata);
      const rep = await this.ChatGpt(input.trim());
      let redata = JSON.parse(rep);
      let title = redata.title || 'No title';
      let url = encodeURI(
        `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${title}`
      );
      const response = await axios(url);
      this.ModiData.title = title;
      this.ModiData.document = redata.document;
      this.ModiData.lists = response.data.resultList.result;
      let cdata = {
        message: redata.document || 'Not An Article',
        type: 'chatbot',
        timestamp: this.formatAMPM(new Date()),
      };
      this.datal.push(cdata);
      this.loading = false;
    },

    getRandomNumber() {
      return Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000;
    },
    MyLinks(id) {
      let temp = this.linkBox.find((v) => v.id == id) || {};
      if (temp.id) {
        return temp;
      }
      return { id: '', links: [] };
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
    async GetUrl(id, source, index) {
      try {
        let url = encodeURI(
          `https://www.ebi.ac.uk/europepmc/webservices/rest/article/${source}/${id}?resultType=core&format=json`
        );
        const response = await axios(url);
        console.log(response.data);
        let links = response?.data?.result?.fullTextUrlList?.fullTextUrl || [];
        this.linkBox.push({ id: index, links: links });
      } catch (err) {
        console.log(err);
      }
    },
  },
  mounted() {
    this.ready = true;
  },
  computed: {},
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
  max-height: 80vh;
  overflow: hidden;
  overflow-y: scroll;
}
</style>

<template>
  <Loader v-if="isLoading" />
  <div v-else>
    <div class="container">
      <div class="row clearfix">
        <div class="col-lg-12">
          <div class="card chat-app">
            <div id="plist" class="people-list">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"
                    ><i class="fa fa-search"></i
                  ></span>
                </div>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Search..."
                />
              </div>
              <ul class="list-unstyled chat-list mt-2 mb-0">
                <li class="clearfix active">
                  <div class="about">
                    <div mb-3>
                      <input
                        v-model="newFriendPhoneNumber"
                        class="form-control"
                        placeholder="Телефон"
                      />
                      <button
                        type="button"
                        class="btn btn-primary"
                        @click="addFriend(newFriendPhoneNumber)"
                      >
                        Добавить
                      </button>
                    </div>
                  </div>
                </li>
                <li
                  v-for="phone in phones"
                  :key="phone"
                  class="clearfix active"
                >
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3fZ_ebLrIR7-37WMGcyj_RO-0TTcZGtUKtg&usqp=CAU"
                    alt="avatar"
                  />
                  <div class="about">
                    <a class="name" @click.prevent="retrieveConv(phone)">{{
                      phone
                    }}</a>
                    <!--                  <div ></div>-->
                    <!--                  <div class="status">-->
                    <!--                    <i class="fa fa-circle online"></i>-->
                    <!--                    online-->
                    <!--                  </div>-->
                  </div>
                </li>
              </ul>
            </div>
            <div class="chat" v-if="wsConnection">
              <div class="chat-header clearfix">
                <div class="row">
                  <div class="col-lg-6">
                    <a
                      href="javascript:void(0);"
                      data-toggle="modal"
                      data-target="#view_info"
                    >
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3fZ_ebLrIR7-37WMGcyj_RO-0TTcZGtUKtg&usqp=CAU"
                        alt="avatar"
                      />
                    </a>
                    <div class="chat-about">
                      <h6 class="m-b-0">{{ activeFriendPhoneNumber }}</h6>
                      <small>Last seen: 2 hours ago</small>
                    </div>
                  </div>
                  <!--                  <div class="col-lg-6 hidden-sm text-right">-->
                  <!--                    <a-->
                  <!--                      href="javascript:void(0);"-->
                  <!--                      class="btn btn-outline-secondary"-->
                  <!--                      ><i class="fa fa-camera"></i-->
                  <!--                    ></a>-->
                  <!--                    <a-->
                  <!--                      href="javascript:void(0);"-->
                  <!--                      class="btn btn-outline-primary"-->
                  <!--                      ><i class="fa fa-image"></i-->
                  <!--                    ></a>-->
                  <!--                    <a href="javascript:void(0);" class="btn btn-outline-info"-->
                  <!--                      ><i class="fa fa-cogs"></i-->
                  <!--                    ></a>-->
                  <!--                    <a-->
                  <!--                      href="javascript:void(0);"-->
                  <!--                      class="btn btn-outline-warning"-->
                  <!--                      ><i class="fa fa-question"></i-->
                  <!--                    ></a>-->
                  <!--                  </div>-->
                </div>
              </div>
              <div class="chat-history">
                <ul class="m-b-0">
                  <!--                <li class="clearfix">-->
                  <!--                  <div class="message-data text-right">-->
                  <!--                    <span class="message-data-time">123</span>-->
                  <!--                  </div>-->
                  <!--                  <div class="message my-message float-right">345</div>-->
                  <!--                </li>-->
                  <li
                    v-for="message in messagesFromWS"
                    :key="message"
                    class="clearfix"
                  >
                    <div class="message-data">
                      <span class="message-data-time">{{
                        message.date_created
                      }}</span>
                    </div>
                    <div
                      class="message"
                      :class="[
                        phoneNumber === message.user.phone
                          ? 'my-message float-right'
                          : 'other-message',
                      ]"
                    >
                      {{ message.text }}
                    </div>
                  </li>
                </ul>
              </div>
              <div class="chat-message clearfix">
                <div class="input-group mb-0">
                  <div class="input-group-prepend">
                    <span class="input-group-text" @click.prevent="sendMessage"
                      ><i class="fa fa-send"></i
                    ></span>
                  </div>
                  <input
                    v-model="newMessage"
                    type="text"
                    class="form-control"
                    placeholder="Enter text here..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Loader from './Loader'

export default {
  name: 'MainWindow',
  components: { Loader },
  data() {
    return {
      activeFriendPhoneNumber: '',
      isLoading: false,
      error: {},
      phones: [],
      avatar: null,
      username: '',
      conv: {},
      messagesFromWS: [],
      wsConnection: false,
      newMessage: '',
      newFriendPhoneNumber: '',
    }
  },
  computed: {
    isAuthor() {
      return this.phoneNumber === this.messagesFromWS.messages.user.phone
    },
    token() {
      return this.$store.getters.getToken
    },
    phoneNumber() {
      return this.$store.getters.getPhone
    },
  },
  created() {
    this.isLoading = true
    this.loadFriends()
    this.isLoading = false
  },
  methods: {
    tokenHandler() {
      const handler = {
        get(target, property) {
          return target[property]
        },
      }
      if (typeof this.token === 'object') {
        const proxy = new Proxy(this.token, handler)
        return proxy.token
      } else {
        return this.token
      }
    },
    async loadFriends() {
      let my_token = this.tokenHandler()
      const friendList = await axios({
        method: 'post',
        url: `${this.$store.getters.getServerUrl}friends/me`,
        headers: {
          Authorization: `Bearer ${my_token}`,
        },
      })
        .then((r) => r.data)
        .catch(() => this.$router.push('/login'))
      friendList.forEach((friend) => this.phones.push(friend.friend.phone))
    },
    async retrieveConv(phone) {
      this.activeFriendPhoneNumber = phone
      if (!this.wsConnection) {
        this.wsConnection = new WebSocket(
          `ws://localhost:8000/ws/${phone}/${this.token}`
        )
      }
      this.wsConnection.onmessage = async (e) => {
        const myData = await e.data
        this.messagesFromWS = JSON.parse(myData)
      }
      await new Promise((r) => setTimeout(r, 100))
      this.readyForMessageReceiving()
    },
    readyForMessageReceiving() {
      this.wsConnection.onmessage = async (e) => {
        const myData = await e.data
        this.messagesFromWS.push(JSON.parse(myData))
      }
    },
    sendMessage() {
      this.wsConnection.send(this.newMessage)
      this.newMessage = ''
    },
    logout() {
      this.$store.dispatch('logout').then(() => {
        this.$router.push('/login')
      })
    },
    async addFriend(phoneNumber) {
      let my_token = this.tokenHandler()
      await axios({
        method: 'post',
        url: `${this.$store.getters.getServerUrl}friends/add`,
        headers: {
          Authorization: `Bearer ${my_token}`,
        },
        data: {
          phone: phoneNumber,
        },
      })
        .then(() => this.loadFriends())
        .catch((r) => console.log(r.response.data))
      this.newFriendPhoneNumber = ''
      this.$forceUpdate
    },
  },
}
</script>

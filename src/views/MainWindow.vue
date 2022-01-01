<template>
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
              <input type="text" class="form-control" placeholder="Search..." />
            </div>
            <ul class="list-unstyled chat-list mt-2 mb-0">
              <li v-for="phone in phones" :key="phone" class="clearfix active">
                <img
                  src="https://bootdey.com/img/Content/avatar/avatar2.png"
                  alt="avatar"
                />
                <div class="about">
                  <a class="name" @click.prevent="retrieveConv">{{ phone }}</a>
                  <!--                  <div ></div>-->
                  <!--                  <div class="status">-->
                  <!--                    <i class="fa fa-circle online"></i>-->
                  <!--                    online-->
                  <!--                  </div>-->
                </div>
              </li>
            </ul>
          </div>
          <div class="chat">
            <div class="chat-header clearfix">
              <div class="row">
                <div class="col-lg-6">
                  <a
                    href="javascript:void(0);"
                    data-toggle="modal"
                    data-target="#view_info"
                  >
                    <img
                      src="https://bootdey.com/img/Content/avatar/avatar2.png"
                      alt="avatar"
                    />
                  </a>
                  <div class="chat-about">
                    <h6 class="m-b-0">Aiden Chavez</h6>
                    <small>Last seen: 2 hours ago</small>
                  </div>
                </div>
                <div class="col-lg-6 hidden-sm text-right">
                  <a
                    href="javascript:void(0);"
                    class="btn btn-outline-secondary"
                    ><i class="fa fa-camera"></i
                  ></a>
                  <a href="javascript:void(0);" class="btn btn-outline-primary"
                    ><i class="fa fa-image"></i
                  ></a>
                  <a href="javascript:void(0);" class="btn btn-outline-info"
                    ><i class="fa fa-cogs"></i
                  ></a>
                  <a href="javascript:void(0);" class="btn btn-outline-warning"
                    ><i class="fa fa-question"></i
                  ></a>
                </div>
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
</template>

<script>
import axios from 'axios'

export default {
  name: 'MainWindow',
  data() {
    return {
      token: '',
      phones: [],
      avatar: null,
      username: '',
      conv: {},
      phoneNumber: '',
      messagesFromWS: [],
      wsConnection: false,
      newMessage: '',
    }
  },
  computed: {
    isAuthor() {
      return this.phoneNumber === this.messagesFromWS.messages.user.phone
    },
  },
  mounted() {
    this.token = this.$store.getters.getToken
    console.log(this.$store.getters.getToken, 'store')
    console.log(this.token, 'component')
    this.phoneNumber = this.$store.getters.getPhone
    // console.log(this.phoneNumber)
    // new Promise((r) => setTimeout(r, 5000))
    setTimeout(this.loadFriends, 5000)
    this.$forceUpdate
  },

  methods: {
    async loadFriends() {
      const friendList = await axios({
        method: 'post',
        url: `${this.$store.getters.getServerUrl}friends/me`,
        headers: { Authorization: `Bearer ${this.$store.getters.getToken}` },
      }).then((r) => r.data)
      friendList.forEach((friend) => this.phones.push(friend.friend.phone))
    },
    async retrieveConv() {
      if (!this.wsConnection) {
        this.wsConnection = new WebSocket(
          `ws://localhost:8000/ws/5/${this.token}`
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
  },
}
</script>
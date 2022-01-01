import axios from 'axios'

const SMS_API_KEY = 'AA05D356-7AC2-B476-850A-E7856E54BAA7'

function getRandomCode() {
  return Math.floor(Math.random() * 1000000)
}

async function sendVerificationCode(phone) {
  let randomCode = getRandomCode()
  await axios
    .get(
      `https://sms.ru/sms/send?api_id=${SMS_API_KEY}&to=${phone}&msg=${randomCode}&test=1&json=1`
    )
    .then((response) => response.data)
    .catch((reject) => console.log(reject))
  return randomCode
}

export default sendVerificationCode

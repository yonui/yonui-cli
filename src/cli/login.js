const fetch = require('node-fetch')
const FormData = require('form-data')
const inquirer = require('inquirer')
const chalk = require('chalk')
const { LOGIN_URL } = require('../utils/globalConfig')

const login = async () => {
  // 输入友互通账号密码
  const ans = await inquirer.prompt([
    {
      type: 'input',
      name: 'username',
      message: 'username:',
      validate: function (val) {
        if (checkPhone(val) || checkEmail(val)) { // 校验位数
          return true
        }
        return 'Please input the correct mobile number or email'
      }
    },
    {
      type: 'password',
      name: 'password',
      message: 'password:'
    }
  ])
  await setUserInfo(ans)
}

function checkPhone (str) {
  const reg = /^1[3456789]\d{9}$/
  if (reg.test(str)) {
    return true
  } else {
    return false
  }
}

function checkEmail (str) {
  const reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
  if (reg.test(str)) {
    return true
  } else {
    return false
  }
}

const setUserInfo = async (ans) => {
  const form = new FormData()
  form.append('username', ans.username)
  form.append('password', ans.password)
  fetch(LOGIN_URL, {
    method: 'post',
    body: form
  })
    .then(async function (response) {
      const res = await response.json()
      if (res.status === 200) {
        console.log(chalk.green(`${res.data}`))
      }
    }).catch(function (error) {
      console.error(error.message)
    })
}

module.exports = login

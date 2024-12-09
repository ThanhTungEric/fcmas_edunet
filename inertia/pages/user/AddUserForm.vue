<template>
    <div class="add-user-form">
      <h3>Add New User</h3>
      <form @submit.prevent="submitForm">
        <div>
          <label for="fullName">Full Name:</label>
          <input type="text" v-model="fullName" required />
        </div>
        <div>
          <label for="email">Email:</label>
          <input type="email" v-model="email" required />
        </div>
        <button type="submit">Add User</button>
        <button type="button" @click="$emit('close')">Cancel</button>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  const fullName = ref('');
  const email = ref('');
  
  // Hàm để xử lý việc gửi form
  const submitForm = () => {
    console.log('New User:', { fullName: fullName.value, email: email.value });
    // Logic để thêm người dùng mới vào cơ sở dữ liệu có thể được thực hiện ở đây.
    // Sau khi thêm người dùng thành công, bạn có thể reset form và đóng form.
    fullName.value = '';
    email.value = '';
    // Có thể emit sự kiện để thông báo cho component cha về việc thêm người dùng.
  };
  </script>
  
  <style lang="scss">
  .add-user-form {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    margin: 20px 0;
  
    h3 {
      margin-bottom: 20px;
    }
  
    form {
      display: flex;
      flex-direction: column;
  
      div {
        margin-bottom: 15px;
      }
  
      label {
        margin-bottom: 5px;
      }
  
      input {
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
      }
  
      button {
        background-color: #4CAF50;
        color: white;
        border: none;
        padding: 10px;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s;
  
        &:hover {
          background-color: #45a049;
        }
      }
    }
  }
  </style>
  
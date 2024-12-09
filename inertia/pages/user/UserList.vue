<!-- UserList.vue -->
<template>
    <div class="user-list">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.fullName }}</td>
            <td>{{ user.email }}</td>
            <td>
              <button class="edit-button" @click="editUser(user.id)">Edit</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps } from 'vue';
  
  // Nhận props từ component cha
  const props = defineProps<{
    users: Array<{ id: number; fullName: string; email: string }>,
    editUser: (userId: number) => void // Hàm để chỉnh sửa người dùng
  }>();
  </script>
  
  <style lang="scss">
  .user-list {
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
  
      th, td {
        border: 1px solid #ddd;
        padding: 12px;
        text-align: left;
        font-size: 1rem;
      }
  
      th {
        background-color: #4CAF50;
        color: white;
      }
  
      tr:nth-child(even) {
        background-color: #f9f9f9;
      }
  
      tr:hover {
        background-color: #f1f1f1;
      }
    }
  
    .edit-button {
      background-color: #008CBA; /* Màu nền xanh */
      color: white; /* Màu chữ trắng */
      border: none; /* Không viền */
      padding: 10px 15px; /* Khoảng cách bên trong */
      text-align: center; /* Căn giữa chữ */
      text-decoration: none; /* Không gạch chân */
      display: inline-block; /* Để nút có thể được căn chỉnh */
      font-size: 1rem; /* Kích thước chữ */
      border-radius: 5px; /* Bo góc */
      cursor: pointer; /* Con trỏ chuột khi di chuột qua nút */
      transition: background-color 0.3s; /* Hiệu ứng chuyển màu khi hover */
    }
  
    .edit-button:hover {
      background-color: #005f73; /* Màu nền khi hover */
    }
  }
  </style>
  
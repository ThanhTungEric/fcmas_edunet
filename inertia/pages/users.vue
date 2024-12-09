<template>
  <div class="users-dashboard">
    <button class="add-button" @click="showAddUserForm = true">Add User</button>
    <!-- Sử dụng component UserList -->
    <UserList :users="users" :editUser="editUser" />

    <!-- Form thêm người dùng -->
    <AddUserForm v-if="showAddUserForm" @close="showAddUserForm = false" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import UserList from './user/UserList.vue'; // Import component danh sách người dùng
import AddUserForm from './user/AddUserForm.vue'; // Import component form

// Nhận props từ controller
const props = defineProps<{
  users: Array<{ id: number; fullName: string; email: string }>
}>();

const showAddUserForm = ref(false); // State để hiển thị form thêm người dùng

console.log('Received users:', props.users);

// Hàm để xử lý hành động chỉnh sửa người dùng
const editUser = (userId: number) => {
  console.log(`Edit user with ID: ${userId}`);
};
</script>

<style lang="scss">
.users-dashboard {
  .add-button {
    background-color: #4CAF50; /* Màu nền xanh */
    color: white; /* Màu chữ trắng */
    border: none; /* Không viền */
    padding: 10px 15px; /* Khoảng cách bên trong */
    margin-bottom: 10px; /* Khoảng cách dưới nút */
    cursor: pointer; /* Con trỏ chuột khi di chuột qua nút */
    border-radius: 5px; /* Bo góc */
    transition: background-color 0.3s; /* Hiệu ứng chuyển màu khi hover */
  }

  .add-button:hover {
    background-color: #45a049; /* Màu nền khi hover */
  }
}
</style>

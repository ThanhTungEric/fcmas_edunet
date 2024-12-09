<template>
    <div class="settings-dashboard">
      <!--Header-->
      <div class="settings-header">
        <h3>Settings</h3>
        <p>Manage your application settings here.</p>
      </div>
  
      <!--Body-->
      <div class="settings-body">
        <div class="columns is-multiline">
          <!--Card for General Settings-->
          <div class="column is-6">
            <div class="settings-card">
              <h4 class="dark-inverted">General Settings</h4>
              <p>Manage general application settings like name, description, etc.</p>
            </div>
          </div>
  
          <!--Card for User Settings-->
          <div class="column is-6">
            <div class="settings-card">
              <h4 class="dark-inverted">User Settings</h4>
              <p>Adjust your profile settings, privacy options, and more.</p>
            </div>
          </div>
  
          <!--Card for Notification Settings-->
          <div class="column is-6">
            <div class="settings-card">
              <h4 class="dark-inverted">Notification Settings</h4>
              <p>Manage your notification preferences and alerts.</p>
            </div>
          </div>
  
          <!--Card for Security Settings-->
          <div class="column is-6">
            <div class="settings-card">
              <h4 class="dark-inverted">Security Settings</h4>
              <p>Update your password and manage security options.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  // Không cần import gì cả vì không có dữ liệu hoặc hành động
  </script>
  
  <style lang="scss">
  @import '/@src/scss/abstracts/all';
  
  .settings-dashboard {
    .settings-header {
      text-align: center;
      margin-bottom: 30px;
  
      h3 {
        font-family: var(--font-alt);
        font-weight: 600;
        font-size: 1.5rem;
        color: var(--dark-text);
      }
  
      p {
        color: var(--grey-text);
        font-size: 1rem;
      }
    }
  
    .settings-body {
      .settings-card {
        @include vuero-s-card;
        padding: 20px;
        border-radius: var(--radius-large);
        margin-bottom: 20px;
  
        h4 {
          font-family: var(--font-alt);
          font-weight: 600;
          font-size: 1.2rem;
          color: var(--dark-text);
          margin-bottom: 12px;
        }
  
        p {
          color: var(--grey-text);
          margin-bottom: 20px;
        }
      }
    }
  }
  
  @media only screen and (max-width: 767px) {
    .settings-dashboard {
      .settings-header {
        h3 {
          font-size: 1.3rem;
        }
      }
  
      .settings-card {
        h4 {
          font-size: 1.1rem;
        }
      }
    }
  }
  </style>
  
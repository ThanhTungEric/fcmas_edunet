<template>
  <VDropdown
    icon="lucide:more-vertical"
    class="end-action"
    spaced
    right
  >
    <template #content>
      <a
        role="menuitem"
        href="#"
        class="dropdown-item is-media"
      >
        <div class="icon">
          <i
            aria-hidden="true"
            class="lnil lnil-whiteboard-alt-2"
          />
        </div>
        <div class="meta">
          <span>Reports</span>
          <span>View detailed reports</span>
        </div>
      </a>

      <a
        role="menuitem"
        href="#"
        class="dropdown-item is-media"
      >
        <div class="icon">
          <i
            aria-hidden="true"
            class="lnil lnil-pencil"
          />
        </div>
        <div class="meta">
          <span>Edit</span>
          <span>Edit this profile</span>
        </div>
      </a>

      <hr class="dropdown-divider">

      <a
        role="menuitem"
        href="#"
        class="dropdown-item is-media"
      >
        <div class="icon">
          <i
            aria-hidden="true"
            class="lnil lnil-bubble"
          />
        </div>
        <div class="meta">
          <span>Message</span>
          <span>Send a direct message</span>
        </div>
      </a>

      <a
        role="menuitem"
        href="#"
        class="dropdown-item is-media"
      >
        <div class="icon">
          <i
            aria-hidden="true"
            class="lnil lnil-gift-alt-1"
          />
        </div>
        <div class="meta">
          <span>Gift</span>
          <span>send a gift</span>
        </div>
      </a>

      <hr class="dropdown-divider">

      <a
        role="menuitem"
        href="#"
        class="dropdown-item is-media"
      >
        <div class="icon">
          <i
            aria-hidden="true"
            class="lnil lnil-cog"
          />
        </div>
        <div class="meta">
          <span>Settings</span>
          <span>Configure settings</span>
        </div>
      </a>
    </template>
  </VDropdown>
</template>

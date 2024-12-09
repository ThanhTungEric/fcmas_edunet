<script setup lang="ts">
import NProgress from 'nprogress'
import { useForm } from '@inertiajs/vue3'
import { error } from 'console';


defineProps({ errors: Object, message: Object })
const isLoading = ref(false)
// const router = useRouter()
const route = useRoute()
const token = useUserToken()
const form = useForm({
  email: null,
  password: null,
  remember: false,
  errors: {
    result: {
      message: null
    }
  }
})

const handleLogin = async () => {
  // NProgress.start()
  form.post('/auth', {
    preserveScroll: true,
    onStart: visit => {
      isLoading.value = true
      // NProgress.start()
    },
    onFinish: visit => {
      NProgress.done()
      isLoading.value = false
    },
    onError: (errors) => {
      console.log(errors)
    }
  })

  // token.value = 'logged-in'

  // if (typeof route?.query?.redirect === 'string') {
  //   router.push(route.query.redirect)
  // }
  // else {
  //   router.push('/dashboard')
  // }
}

useHead({
  title: 'Login',
})

function submit() {
  // NProgress.start()
  form.post('/auth', {
    preserveScroll: true,
    onStart: visit => {
      // NProgress.start()
    },
    onFinish: visit => {
      NProgress.done()
    },
    onError: (errors) => {
      console.log(errors)
    }
  })
}
</script>

<template>
  <AuthLayout>
    <div class="auth-wrapper-inner is-single">
      <LandingGrids class="is-contrasted" />
      <div class="auth-nav">
        <div class="left" />
        <div class="center">
          <RouterLink
            to="/"
            class="header-item"
          >
            <!-- Your logo -->
          </RouterLink>
        </div>
        <div class="right">
          <VDarkmodeToggle />
        </div>
      </div>

      <div class="single-form-wrap is-relative">
        <div class="inner-wrap">
          <div class="auth-head">
            <h2>Welcome to FCMAS.</h2>
            <p>Please sign in to your account</p>
            <RouterLink to="/auth/signup">
              I do not have an account yet
            </RouterLink>
          </div>

          <div class="form-card">
            <VMessage color="warning" v-if="form.errors.result?.message">
              {{ form.errors.result.message }}
            </VMessage>
            <form
              role="form"
              @submit.prevent="handleLogin"
            >
              <div class="login-form">
                <VField>
                  <VControl icon="lucide:user">
                    <VInput
                      type="text"
                      placeholder="Username"
                      autocomplete="username"
                      v-model="form.email"
                    />
                  </VControl>
                  <div class="text-danger fw-light fst-italic" v-if="form.errors.email">{{ form.errors.email[0] }}</div>
                </VField>
                <VField>
                  <VControl icon="lucide:lock">
                    <VInput
                      type="password"
                      placeholder="Password"
                      autocomplete="current-password"
                      v-model="form.password"
                    />
                  </VControl>
                  <div class="text-danger fw-light fst-italic" v-if="form.errors.password">{{ form.errors.password[0] }}</div>
                </VField>

                <!-- Switch -->
                <VField>
                  <VControl class="setting-item">
                    <VCheckbox
                      label="Remember me"
                      color="primary"
                      paddingless
                    />
                  </VControl>
                </VField>

                <!-- Submit -->
                <div class="login">
                  <VButton
                    :loading="isLoading"
                    type="submit"
                    color="primary"
                    bold
                    fullwidth
                    raised
                  >
                    Sign In
                  </VButton>
                </div>
              </div>
            </form>
          </div>

          <div class="forgot-link has-text-centered">
            <a>Forgot Password?</a>
          </div>
        </div>
      </div>
    </div>
  </AuthLayout>
</template>

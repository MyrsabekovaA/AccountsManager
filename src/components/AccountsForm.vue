<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAccountStore} from "../store/accountsStore.ts";
import type { Account } from '../store/accountsStore.ts'

const store = useAccountStore()
const accounts = ref<Account[]>([])
const errors = ref<Record<string, Partial<Record<keyof Account, boolean>>>>({})
const visiblePasswords = ref<Record<string, boolean>>({})

onMounted(() => {
  store.loadAccounts()
  accounts.value = store.accounts
})

function validateAndSave(account: Account) {
  const error: Partial<Record<keyof Account, boolean>> = {}

  if (!account.login) error.login = true
  if (!account.type) error.type = true
  if (account.type === 'Локальная' && !account.password) error.password = true

  errors.value[account.id] = error

  if (Object.keys(error).length === 0) {
    store.updateAccount({
      ...account,
      labels: account.label?.split(';')
          .map(label => ({ text: label.trim() }))
          .filter(l => l.text)
    })
  }
}

function addAccount() {
  const id = crypto.randomUUID()
  const newAccount: Account = {
    id,
    label: '',
    labels: [],
    type: '',
    login: '',
    password: ''
  }
  accounts.value.push(newAccount)
  errors.value[id] = {}
}

function deleteAccount(id: string) {
  accounts.value = accounts.value.filter(a => a.id !== id)
  store.deleteAccount(id)
  delete errors.value[id]
}
</script>

<template>
  <div class="p-4 space-y-6 max-w-5xl mx-auto">
    <div class="flex justify-between items-center">
      <h1 class="font-bold text-lg">Учетные записи</h1>
      <button
          class="bg-white hover:bg-blue-400 hover:text-white text-black border rounded-xl font-semibold py-2 px-4"
          @click="addAccount"
      >
        +
      </button>
    </div>

    <div class="flex bg-sky-100 rounded-xl items-center gap-2">
      <img src="../assets/faq.png" alt="faq" class="w-8"/>
      <p>Для указания нескольких меток для одной пары логин/пароль используйе разделитель ;</p>
    </div>

    <div v-if="accounts.length" class="grid grid-cols-[2fr_1fr_2fr_2fr_auto] gap-4 pb-2 mb-2 text-zinc-400 text-sm">
      <span>Метки</span>
      <span>Тип записи</span>
      <span>Логин</span>
      <span>Пароль</span>
      <span></span>
    </div>

    <div
        v-for="account in accounts"
        :key="account.id"
        class="grid grid-cols-[2fr_1fr_2fr_2fr_auto] gap-4 items-center mb-4"
    >
      <div>
        <input
            v-model="account.label"
            @blur="validateAndSave(account)"
            maxlength="50"
            class="w-full p-2 border rounded border-blue-300 text-sm"
            :class="{ 'border-red-500': errors[account.id]?.label }"
            placeholder="Значение"
        />
      </div>

      <div>
        <select
            v-model="account.type"
            @change="validateAndSave(account)"
            class="w-full p-2 border rounded  border-blue-300 text-sm"
            :class="{ 'border-red-500': errors[account.id]?.type }"
        >
          <option disabled value="">Выберите тип</option>
          <option value="LDAP">LDAP</option>
          <option value="Локальная">Локальная</option>
        </select>
      </div>

      <div :class="account.type !== 'Локальная' ? 'col-span-2' : ''">
        <input
            v-model="account.login"
            @blur="validateAndSave(account)"
            maxlength="100"
            class="w-full p-2 border rounded border-blue-300 text-sm"
            :class="{ 'border-red-500': errors[account.id]?.login }"
            placeholder="Значение"
        />
      </div>

      <div v-if="account.type === 'Локальная'" class="relative">
        <input
            :type="visiblePasswords[account.id] ? 'text' : 'password'"
            v-model="account.password"
            @blur="validateAndSave(account)"
            maxlength="100"
            class="w-full p-2 border rounded border-blue-300 text-sm pr-10"
            :class="{ 'border-red-500': errors[account.id]?.password }"
        />
        <button
            type="button"
            class="absolute right-2 top-1/2 transform -translate-y-1/2"
            @click="visiblePasswords[account.id] = !visiblePasswords[account.id]"
        >
          <img
              :src="visiblePasswords[account.id] ? '../src/assets/hide.png' : '../src/assets/show.png'"
              alt="visibility"
              class="w-5 h-5"
          />
        </button>
      </div>

      <div>
        <button
            class=""
            @click="deleteAccount(account.id)"
        >
          <img src="../assets/delete.png" alt="delete"/>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
input:focus,
select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px #3b82f6;
}
</style>
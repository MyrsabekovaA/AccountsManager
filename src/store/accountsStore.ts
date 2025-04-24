import { defineStore } from 'pinia'

export interface Account {
    id: string
    label: string
    labels: { text: string }[]
    type: string
    login: string
    password?: string
}

export const useAccountStore = defineStore('account', {
    state: () => ({
        accounts: [] as Account[]
    }),
    actions: {
        loadAccounts() {
            const saved = localStorage.getItem('accounts')
            if (saved) this.accounts = JSON.parse(saved)
        },
        saveAccounts() {
            localStorage.setItem('accounts', JSON.stringify(this.accounts))
        },
        addAccount(account: Account) {
            this.accounts.push(account)
            this.saveAccounts()
        },
        updateAccount(updated: Account) {
            const i = this.accounts.findIndex(a => a.id === updated.id)
            if (i !== -1) {
                this.accounts[i] = updated
                this.saveAccounts()
            }
        },
        deleteAccount(id: string) {
            this.accounts = this.accounts.filter(a => a.id !== id)
            this.saveAccounts()
        }
    }
})
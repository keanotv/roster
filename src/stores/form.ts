import { submitAnswer } from '@/utils/form'
import { useGlobalToast } from '@/utils/toast'
import { defineStore } from 'pinia'

export const useFormStore = defineStore({
  id: 'form',
  persist: true,
  state: () => ({
    isSubmitting: false,
    gameForm: {
      vg: '',
      answerPt1: '',
      answerPt2: ''
    }
  }),
  actions: {
    async submitGameAnswer() {
      // this.isSubmitting = true
      // const globalToast = useGlobalToast()
      // if (this.gameForm.vg.length < 3) {
      //   globalToast.info('Let us know your Batch & VG!')
      //   this.isSubmitting = false
      //   return
      // } else if (this.gameForm.answerPt1.length < 10) {
      //   globalToast.info('Add more details for Q1!')
      //   this.isSubmitting = false
      //   return
      // } else if (this.gameForm.answerPt2.length < 10) {
      //   globalToast.info('Add more details for Q2!')
      //   this.isSubmitting = false
      //   return
      // }
      // const submission: AnswerInsert = {
      //   vg: this.gameForm.vg,
      //   answer: this.gameForm.answerPt1.concat("|").concat(this.gameForm.answerPt2)
      // }
      // await submitAnswer(submission)
      // this.isSubmitting = false
    }
  }
})

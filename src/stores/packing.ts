import { defineStore } from 'pinia'

type PackingData = {
  title: string
  checked: boolean
  info: string
}

export class PackingDataImpl {
  data: PackingData[]
  constructor() {
    this.data = [
      {
        title: 'Passport',
        checked: false,
        info: '‣ Check for minimum 6-month validity i.e. Date of expiry AFTER 15 Dec 2024.\n‣ Obtain Visa if required.'
      },
      {
        title: 'Bible',
        checked: false,
        info: ''
      },
      {
        title: 'Notebook & stationeries',
        checked: false,
        info: ''
      },
      {
        title: 'Clothes',
        checked: false,
        info: '‣ No revealing attire such as spaghetti straps, tube tops/dresses, crop tops or translucent clothing, and short shorts/skirts (dress appropriate for floor sitting).\n‣ No Christian/Israel-related attire, including items such as bags, badges, etc.'
      },
      {
        title: 'Personal toiletries',
        checked: false,
        info: ''
      },
      {
        title: 'Malaysian Ringgit',
        checked: false,
        info: '‣ Bring sufficient for lunch at Rest Stop on 11/15 June, and Sunway Shopping Center on 14 June.'
      },
      {
        title: 'Water bottle (≥500ml)',
        checked: false,
        info: ''
      },
      {
        title: 'Jacket',
        checked: false,
        info: ''
      },
      {
        title: 'Data plan (optional)',
        checked: false,
        info: ''
      },
      {
        title: 'Spare masks',
        checked: false,
        info: ''
      },
      {
        title: 'Personal medication',
        checked: false,
        info: ''
      },
    ]
  }
}

export const usePackingStore = defineStore({
  id: 'packing',
  persist: true,
  state: () => ({
    items: new PackingDataImpl(),
    addedFinal: false
  }),
  actions: {
    checkItem(item: string) {
      this.items.data = this.items.data.map(packingItem => {
        if (packingItem.title === item) {
          packingItem.checked = !packingItem.checked
        }
        return packingItem
      })
      if (!this.addedFinal && this.items.data.every(item => item.checked)) {
        this.items.data.push({
          title: 'A hearing heart to receive 🤲🏼',
          checked: false,
          info: ''
        })
        this.addedFinal = true
      }
    }
  }
})

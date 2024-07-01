import { supabase, sendError, type CountdownUpdate, type AnswerRow } from "./supabase"
import { useGlobalToast } from "./toast"

export const fetchGameAnswers = async () => {
  const globalToast = useGlobalToast()
  const { data, error } = await supabase.from('answers').select()
  if (error) {
    sendError(error)
    globalToast.error('Error fetching game answers')
  } else {
    const response: AnswerRow[] = data
    return response
  }
  return []
}

export type CountdownData = {
  id: number
  end: string
  started: boolean
  video: boolean
  reveal: boolean
}

export const getCountdownData = async () => {
  const { data, error } = await supabase.from('countdown').select().limit(1).single()
  if (error) {
    sendError(error)
  } else if (data) {
    return {
      id: data.id,
      end: data.end,
      started: data.started,
      video: data.video,
      reveal: data.reveal
    } as CountdownData
  }
  return {
    id: 0,
    end: "00:00",
    started: false,
    video: false,
    reveal: false
  }
}

export const getReveal = async () => {
  const { data, error } = await supabase.from('countdown').select('reveal').limit(1).single()
  if (error) {
    sendError(error)
  } else if (data) {
    return data.reveal
  }
  return false
}

export const getStartTimeAndDurationArrayString = async () => {
  const { data, error } = await supabase.from('countdown').select().limit(1).single()
  if (error) {
    sendError(error)
  } else if (data) {
    return {
      id: data.id,
      time: data.time,
      durations: data.durations
    }
  }
  return {
    id: 0,
    time: "14:20",
    durations: "[5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]"
  }
}

export const updateTimingsData = async (countdownData: { id: number; time: string; durations: string }) => {
  const { error } = await supabase.from('countdown').update(countdownData as CountdownUpdate).eq('id', countdownData.id)
  const globalToast = useGlobalToast()
  if (error) {
    sendError(error)
    return false
  } else {
    globalToast.success('Game settings has been updated!')
    return true
  }
}

export const updateCountdownData = async (countdownData: CountdownData) => {
  const { error } = await supabase.from('countdown').update(countdownData as CountdownUpdate).eq('id', countdownData.id)
  const globalToast = useGlobalToast()
  if (error) {
    sendError(error)
    return false
  } else {
    globalToast.success('Game settings has been updated!')
    return true
  }
}

export const caseFiles: Map<number, CaseFileStatic> = new Map([
  [1, {
    index: 1,
    name: "Medical Officer",
    fileNo: "#14775794",
    idNo: "93-SM4-10XD",
    prisonerCode: "SM467210XD",
    gender: "Male",
    dob: "13/02/1996",
    height: "181cm",
    weight: "62kg",
    breakdown1: `-Medical Officer in-charge of all medical things`,
    breakdown2: `-Suspected of <span style="color: var(--color-transparent); background-color: var(--color-text);">XXXXXXXXXXXXXXXX</span>`,
    breakdown3: `-Has close relations with <span style="color: var(--color-transparent); background-color: var(--color-text);">XXXXXXXXXXXXXX</span>`,
    mugshotUrl: "https://mcymgcjwhmctuzcoecvx.supabase.co/storage/v1/object/public/images/mo-mugshot.jpg",
    thumbprintUrl: "https://mcymgcjwhmctuzcoecvx.supabase.co/storage/v1/object/public/images/mo-thumb.png",
    signature: "M. Officer"
  }],
  [2, {
    index: 2,
    name: "Prisoner Chemist",
    fileNo: "#14775795",
    idNo: "93-SM4-11XD",
    prisonerCode: "SM467211XD",
    gender: "Female",
    dob: "30/11/1998",
    height: "163cm",
    weight: "53kg",
    breakdown1: `-Arrested for <span style="color: var(--color-transparent); background-color: var(--color-text);">XXXXXXXXXXXXXXXXXXXXXXX</span>`,
    breakdown2: `-Has previously <span style="color: var(--color-transparent); background-color: var(--color-text);">XXXXXXXXXXXXX</span> manager`,
    breakdown3: `-Tends to be flustered by anything donut related`,
    mugshotUrl: "https://mcymgcjwhmctuzcoecvx.supabase.co/storage/v1/object/public/images/chemist-mugshot.jpg",
    thumbprintUrl: "https://mcymgcjwhmctuzcoecvx.supabase.co/storage/v1/object/public/images/chemist-thumb.png",
    signature: "Chemist"
  }],
  [3, {
    index: 3,
    name: "Prisoner Old Man",
    fileNo: "#14775796",
    idNo: "93-SM4-12XD",
    prisonerCode: "SM467212XD",
    gender: "Male",
    dob: "05/01/1986",
    height: "174cm",
    weight: "67kg",
    breakdown1: `-Has really high <span style="color: var(--color-transparent); background-color: var(--color-text);">XXXXXXXXXXXXXXXXXXXXX</span>`,
    breakdown2: `-Waiting to be reunited with his <span style="color: var(--color-transparent); background-color: var(--color-text);">XXXXXXXXXXXX</span>`,
    breakdown3: `-Willing to cooperate during investigation`,
    mugshotUrl: "https://mcymgcjwhmctuzcoecvx.supabase.co/storage/v1/object/public/images/oldman-mugshot.jpg",
    thumbprintUrl: "https://mcymgcjwhmctuzcoecvx.supabase.co/storage/v1/object/public/images/oldman-thumb.png",
    signature: "Oldman"
  }],
  [4, {
    index: 4,
    name: "Officer D",
    fileNo: "#14775797",
    idNo: "93-SM4-13XD",
    prisonerCode: "SM467213XD",
    gender: "Male",
    dob: "11/09/1992",
    height: "170cm",
    weight: "72kg",
    breakdown1: `-Top of the cohort`,
    breakdown2: `-Was away for <span style="color: var(--color-transparent); background-color: var(--color-text);">XXXXXXXXXXXXXXXXXXXXXXXXX</span>`,
    breakdown3: `-Left the <span style="color: var(--color-transparent); background-color: var(--color-text);">XXXXXX</span> unattended`,
    mugshotUrl: "https://mcymgcjwhmctuzcoecvx.supabase.co/storage/v1/object/public/images/officer-d-mugshot.jpg",
    thumbprintUrl: "https://mcymgcjwhmctuzcoecvx.supabase.co/storage/v1/object/public/images/officer-d-thumb.png",
    signature: "Officer D"
  }],
  [5, {
    index: 5,
    name: "Officer T",
    fileNo: "#14775798",
    idNo: "93-SM4-14XD",
    prisonerCode: "SM467214XD",
    gender: "Male",
    dob: "22/08/1995",
    height: "177cm",
    weight: "64kg",
    breakdown1: `-Shares the same office as <span style="color: var(--color-transparent); background-color: var(--color-text);">XXXXXXXXXXXXXXXXXX</span>`,
    breakdown2: `-Doesn't have a good relationship with <span style="color: var(--color-transparent); background-color: var(--color-text);">XXXXXXX</span>`,
    breakdown3: `-Was found interviewing <span style="color: var(--color-transparent); background-color: var(--color-text);">XXXXXXXXXXXXXXXXXXXXXX</span>`,
    mugshotUrl: "https://mcymgcjwhmctuzcoecvx.supabase.co/storage/v1/object/public/images/officer-t-mugshot.jpg",
    thumbprintUrl: "https://mcymgcjwhmctuzcoecvx.supabase.co/storage/v1/object/public/images/officer-t-thumb.png",
    signature: "Officer T"
  }],
  [6, {
    index: 6,
    name: "Chef",
    fileNo: "#14775793",
    idNo: "93-SW4-9XD",
    prisonerCode: "SM46729XD",
    gender: "Male",
    dob: "23/07/1998",
    height: "172cm",
    weight: "65kg",
    breakdown1: `-Suspected of <span style="color: var(--color-transparent); background-color: var(--color-text);">XXXXXXXXXXXXXXXXXXXXXXX</span>`,
    breakdown2: `-Unable to taste <span style="color: var(--color-transparent); background-color: var(--color-text);">XXXXXXXXXXXXXXX</span>`,
    breakdown3: `-Obsessed with making the perfect donut`,
    mugshotUrl: "https://mcymgcjwhmctuzcoecvx.supabase.co/storage/v1/object/public/images/chef-mugshot.jpg",
    thumbprintUrl: "https://mcymgcjwhmctuzcoecvx.supabase.co/storage/v1/object/public/images/chef-thumb.png",
    signature: "Chef"
  }]
])

type CaseFileStatic = {
  index: number
  name: string
  fileNo: string
  idNo: string
  prisonerCode: string
  gender: string
  dob: string
  height: string
  weight: string
  breakdown1: string
  breakdown2: string
  breakdown3: string
  thumbprintUrl: string
  mugshotUrl: string
  signature: string
}
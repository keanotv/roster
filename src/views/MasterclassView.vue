<script setup lang="ts">
import WelcomeItem from '@/components/WelcomeItem.vue'
import MasterclassItem from '@/components/masterclass/MasterclassItem.vue'

const masterclasses = [
  {
    title: '🎯 Personal Leadership + Life After Graduation',
    stream: 'Stream 1',
    speakers: 'Dn David & Dn Joe',
    description: `<p>We often hear "advice" on financial planning, time management, and personal growth from so many different people, but what does the Word of God says about how we can live and thrive in this life? <b>Get ready to glean practical truths and dive into His word, the source of true wisdom to guide us on how to live an abundant life.</b></p>`,
    location: 'tbc'
  },
  {
    title: '🕊️ Grace Expressions (Healing, Evangelism, Gifts of the Spirit, Serving etc.)',
    stream: 'Stream 2',
    speakers: 'Pastor Alvin',
    description: `<p>Have you ever wondered how grace can be expressed most effectively? In this masterclass, <b>be expectant to learn how we can tap into the awesome power of God's grace and the Holy Spirit in us to heal, evangelise, and emerge victorious in every aspect of our lives!</b></p>`,
    location: 'tbc'
  },
  {
    title: '🙌🏼 Discover Your Calling in His Presence',
    stream: 'Stream 3',
    speakers: 'Pastor Darren',
    description: `<p>This masterclass seeks to debunk the notion that you need to be gifted in music in order to be a worshipper. <b>The truth is every believer is called to be a worshipper!</b> Discover how the transformational power of intimate times of worship in the Lord's presence can remove every fear and also bring about an impartation of gifts, visions, and purpose that are dormant in your life.</p>`,
    location: 'tbc'
  },
  {
    title: '🧬 Science & God',
    stream: 'Stream 4',
    speakers: 'Pastor Daniel',
    description: `<p><b>Where does God fit in a world of science? Or rather, where and how does science fit in our understanding of God?</b> In a world so hungry for the truth, come and see the miracle of creation through the eyes of our Lord, and learn how science and faith have been unfairly pitted against each other, <b>when science is just another tool in God's disposal to show us His salvation!</b></p>`,
    location: 'tbc'
  },
]
</script>

<template>
  <main>
    <div class="m-8 mb-0">
      <WelcomeItem>
        <template #icon>
          <line-md:coffee-half-empty-twotone-loop class="w-10 h-10" />
        </template>
        <template #heading>V Masterclasses</template>
        Camp masterclass sessions are where biblical principles are shared in practical ways.
        So come expectant, come hungry (spiritually), and come early to get the best seats in the house!
      </WelcomeItem>
    </div>
    <div class="m-8 mt-4 mb-16">
      <template v-for="masterclass, index in masterclasses" v-bind:key="index">
        <MasterclassItem :title="masterclass.title" :stream="masterclass.stream" :speakers="masterclass.speakers"
          :description="masterclass.description" :location="masterclass.location" :index="index" />
      </template>
    </div>
  </main>
</template>
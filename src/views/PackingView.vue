<script setup lang="ts">
import WelcomeItem from '@/components/WelcomeItem.vue'
import { usePackingStore } from '@/stores/packing'
import ToolTipItem from '@/components/common/TooltipItem.vue'
import { useGlobalToast } from '@/utils/toast';

const globalToast = useGlobalToast()

const packingStore = usePackingStore()
const copyToClipboard = () => {
  let text = 'Camp packing list:\n'
  packingStore.items.data.forEach(item => {
    text = text.concat(item.title).concat(item.checked ? ' ✅' : ' ❌').concat('\n')
  })
  navigator.clipboard.writeText(text)
  globalToast.success('Copied to clipboard!')
}
</script>

<template>
  <main>
    <div class="m-8">
      <WelcomeItem>
        <template #icon>
          <line-md:check-list-3-twotone class="w-10 h-10" />
        </template>

        <template #heading>Camp Packing List</template>
        We want to make sure you pack for success! Copy the list over to your notes where you can add more
        items, or share it with a friend who might forget to pack something.
      </WelcomeItem>
      <div class="mt-4">
        <template v-for="{ title, checked, info } in packingStore.items.data" :key="title">
          <div class="checkbox-container">
            <input @change="packingStore.checkItem(title)" :id="title" class="m-2 my-4" type="checkbox"
              :checked="checked" />
            <label :for="title" class="mr-2" :class="{ strike: checked }">{{ title }}</label>
            <template v-if="info.length">
              <ToolTipItem>
                <template #text> {{ info }}
                </template>
              </ToolTipItem>
            </template>
          </div>
        </template>
      </div>
      <p class="text-sm my-2">Copy to clipboard:</p>
      <button @click.prevent="copyToClipboard()"
        class="items-center justify-center p-1.5 rounded-lg border-solid border">
        <line-md:clipboard-arrow class="w-8 h-8" />
      </button>
    </div>
  </main>
</template>

<style scoped>
@supports (-webkit-appearance: none) or (-moz-appearance: none) {
  .checkbox-container input[type=checkbox] {
    --active: #fe4727;
    --active-inner: #fff;
    --focus: 2px rgba(254, 39, 39, 0.3);
    --border: #BBC1E1;
    --border-hover: #fe2727;
    --background: #fff;
    --disabled: #F6F8FF;
    --disabled-inner: #E1E6F9;
    -webkit-appearance: none;
    -moz-appearance: none;
    height: 21px;
    outline: none;
    display: inline-block;
    vertical-align: top;
    position: relative;
    margin-top: -1px;
    cursor: pointer;
    border: 1px solid var(--bc, var(--border));
    background: var(--b, var(--background));
    transition: background 0.3s, border-color 0.3s, box-shadow 0.2s;
  }

  .checkbox-container input[type=checkbox]:after {
    content: "";
    display: block;
    left: 0;
    top: 0;
    position: absolute;
    transition: transform var(--d-t, 0.3s) var(--d-t-e, ease), opacity var(--d-o, 0.2s);
  }

  .checkbox-container input[type=checkbox]:checked {
    --b: var(--active);
    --bc: var(--active);
    --d-o: .3s;
    --d-t: .6s;
    --d-t-e: cubic-bezier(.2, .85, .32, 1.2);
  }

  .checkbox-container input[type=checkbox]:disabled {
    --b: var(--disabled);
    cursor: not-allowed;
    opacity: 0.9;
  }

  .checkbox-container input[type=checkbox]:disabled:checked {
    --b: var(--disabled-inner);
    --bc: var(--border);
  }

  .checkbox-container input[type=checkbox]:disabled+label {
    cursor: not-allowed;
  }

  .checkbox-container input[type=checkbox]:hover:not(:checked):not(:disabled) {
    --bc: var(--border-hover);
  }

  .checkbox-container input[type=checkbox]:focus {
    box-shadow: 0 0 0 var(--focus);
  }

  .checkbox-container input[type=checkbox]:not(.switch) {
    width: 21px;
  }

  .checkbox-container input[type=checkbox]:not(.switch):after {
    opacity: var(--o, 0);
  }

  .checkbox-container input[type=checkbox]:not(.switch):checked {
    --o: 1;
  }

  .checkbox-container input[type=checkbox]+label {
    display: inline-block;
    vertical-align: middle;
    cursor: pointer;
    margin-left: 4px;
  }

  .checkbox-container input[type=checkbox]:not(.switch) {
    border-radius: 7px;
  }

  .checkbox-container input[type=checkbox]:not(.switch):after {
    width: 5px;
    height: 9px;
    border: 2px solid var(--active-inner);
    border-top: 0;
    border-left: 0;
    left: 7px;
    top: 4px;
    transform: rotate(var(--r, 20deg));
  }

  .checkbox-container input[type=checkbox]:not(.switch):checked {
    --r: 43deg;
  }
}

.checkbox-container * {
  box-sizing: inherit;
}

.checkbox-container *:before,
.checkbox-container *:after {
  box-sizing: inherit;
}

@keyframes strike {
  0% {
    width: 0;
  }

  100% {
    width: 100%;
  }
}

.strike {
  position: relative;
}

.strike::after {
  content: ' ';
  position: absolute;
  top: 45%;
  left: 0;
  width: 100%;
  height: 1px;
  background: var(--color-text);
  animation-name: strike;
  animation-duration: 0.2s;
  animation-timing-function: linear;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}
</style>
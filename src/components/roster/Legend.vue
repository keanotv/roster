<script setup lang="ts"></script>

<template>
  <BCard class="text-sm">
    <template #header>
      <b>Legend</b>
    </template>
    <div class="grid grid-cols-2">
      <div>
        <div>
          <div class="font-bold inline-block w-6 text-center mb-1">P</div>
          Praise (or P&W)
        </div>
        <div>
          <div class="font-bold inline-block w-6 text-center mb-1">W</div>
          Worship
        </div>
        <div>
          <div class="font-bold inline-block w-6 text-center mb-1">I</div>
          Item
        </div>
        <div>
          <div class="font-bold inline-block w-6 text-center mb-1">S</div>
          Sermon
        </div>
        <div>
          <div class="font-bold inline-block w-6 text-center mb-1">M</div>
          Ministering
        </div>
        <div>
          <div class="font-bold inline-block w-6 text-center mb-1">C</div>
          Closing
        </div>
      </div>
      <div>
        <BListGroup>
          <BListGroupItem class="py-0.5 px-1.5" variant="danger"
            >You! Or whoever you selected</BListGroupItem
          ></BListGroup
        >
        <BListGroup class="my-1"
          ><BListGroupItem class="py-0.5 px-1.5" variant="warning"
            >Assigned to 2 or more roles</BListGroupItem
          ></BListGroup
        >
        <BListGroup
          ><BListGroupItem class="py-0.5 px-1.5" variant="primary"
            >Assigned to 1 role (or empty)</BListGroupItem
          ></BListGroup
        >
      </div>
    </div>
  </BCard>
</template>

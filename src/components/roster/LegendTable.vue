<script setup lang="ts"></script>

<template>
  <BCard class="text-sm">
    <template #header>
      <b>Legend</b>
    </template>
    <div class="grid grid-cols-3">
      <div class="col-span-2">
        <div>
          <div class="font-bold inline-block w-6 text-center mb-1">P</div>
          Praise & Worship
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
          Post-sermon/Closing
        </div>
      </div>
      <div>
        <BListGroup>
          <BListGroupItem class="py-0.5 text-center" variant="primary"
            >1 role
          </BListGroupItem>
        </BListGroup>
        <BListGroup class="my-1">
          <BListGroupItem class="py-0.5 text-center" variant="danger"
            >≥2 roles
          </BListGroupItem>
        </BListGroup>
      </div>
    </div>
  </BCard>
</template>

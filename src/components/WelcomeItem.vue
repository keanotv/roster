<template>
  <div class="item">
    <i>
      <slot name="icon"></slot>
    </i>
    <div class="details text-sm">
      <h3 class="text-lg">
        <slot name="heading"></slot>
      </h3>
      <p class="text-justify">
        <slot></slot>
      </p>
    </div>
  </div>
</template>

<style scoped>
.item {
  margin-top: 2rem;
  display: flex;
}

.details {
  flex: 1;
  margin-left: 0.5rem;
}

i {
  display: flex;
  place-items: center;
  place-content: center;
  width: 32px;
  height: 32px;
  color: var(--color-text);
}

h3 {
  font-weight: 500;
  color: var(--color-heading);
}

@media (min-width: 1024px) {
  .item {
    margin-top: 0;
    padding: 0.4rem 0 1rem calc(var(--section-gap) / 2);
  }

  i {
    top: calc(50% - 30px);
    left: 10px;
    position: absolute;
    width: 50px;
    height: 50px;
  }
}
</style>

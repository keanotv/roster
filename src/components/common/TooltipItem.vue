<template>
  <div tabindex="0" class="tooltip cursor-pointer">
    <line-md:question-circle class="icon w-4 h-4 mb-1" />
    <span class="tooltip-text prompt ml-7 p-2 rounded-md">
      <slot name="text"></slot>
    </span>
  </div>
</template>

<style>
/* Tooltip container */
.tooltip {
  position: relative;
  display: inline-block;
}

/* Tooltip text */
.tooltip .tooltip-text {
  visibility: hidden;
  text-align: left;
  width: 50vw;
  padding: 0.5rem;
  border-width: 1px;
  border-color: var(--color-border);
  background-color: var(--color-background-soft);
  position: absolute;
  left: -5rem;
  top: 0.35rem;
  z-index: 1;
  white-space: pre-line
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:focus .tooltip-text {
  visibility: visible;
}

@media (min-width: 500px) {
  .tooltip .tooltip-text {
    max-width: 350px;
    position: absolute;
    left: -50px;
    z-index: 1;
  }
}
</style>

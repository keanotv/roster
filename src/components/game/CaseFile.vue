<template>
  <div class="flex justify-center">
    <div class="m-6 max-w-[480px]">
      <div class="top-section">
        <div>
          <img class="w-[70px]"
            src="https://mcymgcjwhmctuzcoecvx.supabase.co/storage/v1/object/public/images/badge.png" />
        </div>
        <div class="ml-1">
          <h1>POLICE ACADEMY</h1>
          <h3>Federal Bureau of Police</h3>
          <h3>Agency: 3115757</h3>
        </div>
      </div>
      <div class="flex justify-center">
        <table class="my-3 italic default-table">
          <tr>
            <td class="pl-2 pr-4">CASE FILE NO.</td>
            <td class="pl-4 min-w-[130px]">
              <slot name="file-no"></slot>
            </td>
            <td rowspan="3" class="w-[10px] bg-[var(--color-text)]"></td>
          </tr>
          <tr>
            <td class="pl-2 pr-4">ID NO.</td>
            <td class="pl-4">
              <slot name="id-no"></slot>
            </td>
          </tr>
          <tr>
            <td class="pl-2 pr-4">PRISONER CODE</td>
            <td class="pl-4">
              <slot name="prisoner-code"></slot>
            </td>
          </tr>
        </table>
      </div>
      <div class="description-section my-2">
        <div>
          <slot name="mugshot"></slot>
          <img class="img-restricted z-50"
            src="https://mcymgcjwhmctuzcoecvx.supabase.co/storage/v1/object/public/images/restricted.png" />
        </div>
        <div>
          <h2 class="bold underline">DESCRIPTION</h2>
          <table class="my-2 italic default-table">
            <tr>
              <td class="pl-2 pr-4">NAME</td>
              <td class="pl-2 pr-2 min-w-[130px]">
                <slot name="name"></slot>
              </td>
            </tr>
            <tr>
              <td class="pl-2 pr-4">GENDER</td>
              <td class="pl-2 pr-2">
                <slot name="gender"></slot>
              </td>
            </tr>
            <tr>
              <td class="pl-2 pr-4">D.O.B.</td>
              <td class="pl-2 pr-2">
                <slot name="dob"></slot>
              </td>
            </tr>
            <tr>
              <td class="pl-2 pr-4">HEIGHT</td>
              <td class="pl-2 pr-2">
                <slot name="height"></slot>
              </td>
            </tr>
            <tr>
              <td class="pl-2 pr-4">WEIGHT</td>
              <td class="pl-2 pr-2">
                <slot name="weight"></slot>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <h2 class="bold underline mt-3 mb-1">BREAKDOWN</h2>
      <table class="my-2 breakdown-table italic">
        <tr class="border-bottom">
          <td>
            <slot name="breakdown-1"></slot>
          </td>
        </tr>
        <tr class="border-bottom">
          <td>
            <slot name="breakdown-2"></slot>
          </td>
        </tr>
        <tr class="border-bottom">
          <td>
            <slot name="breakdown-3"></slot>
          </td>
        </tr>
      </table>
      <div class="mt-5 mb-4 bottom-section">
        <div>
          <table class="default-table">
            <tr>
              <td>
                <p class="font-bold italic text-xs px-3 py-1">THUMBPRINT</p>
              </td>
            </tr>
            <tr>
              <td class="h-[110px]">
                <slot name="thumbprint"></slot>
              </td>
            </tr>
          </table>
        </div>
        <div class="flex items-end">
          <table class="w-[110px] text-center">
            <tr class="border-bottom">
              <td class="signature text-sm font-bold">
                <slot name="signature"></slot>
              </td>
            </tr>
            <tr>
              <td class="font-bold">SIGNATURE</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=WindSong:wght@500&display=swap');

.signature {
  font-family: 'WindSong';
}

.top-section {
  display: grid;
  grid-template-columns: 1fr 5fr;
}

.bottom-section {
  display: grid;
  grid-template-columns: 3fr 2fr;
}

.img-restricted {
  filter: none;
  position: absolute;
  left: 20px;
  bottom: -8px;
  width: 120px;
  transform: rotate(-15deg);
}

.description-section {
  display: grid;
  grid-template-columns: 130px 5fr;
}

h1 {
  font-weight: bold;
  font-size: 1.75rem;
}

h2 {
  font-weight: bold;
  font-size: large;
}

h3 {
  font-size: small;
}

.default-table td {
  border: 1px solid var(--color-text);
  padding-top: 0.15rem;
  font-weight: bold;
}

table {
  font-size: x-small;
}

.breakdown-table {
  width: 85vw;
  display: block;
  max-width: -moz-fit-content;
  max-width: fit-content;
  margin: 0 0;
  overflow-x: auto;
  white-space: nowrap;
}

.breakdown-table td {
  width: 85vw;
  padding-top: 0.5rem;
  overflow: hidden;
}

.border-bottom {
  border-bottom: 1px solid var(--color-text);
  border-collapse: collapse;
}

img {
  filter: sepia(100%) saturate(35%) brightness(100%) hue-rotate(5deg);
}
</style>
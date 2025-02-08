<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 dark:from-gray-800 dark:to-gray-900 transition-colors duration-200">
    <!-- Navigation/Header -->
    <nav class="flex items-center justify-end p-4">
      <button 
        aria-label="Color Mode" 
        class="inline-block text-sm px-4 py-2 leading-none border rounded transition-colors duration-200"
        :class="[
          colorMode.value === 'dark' 
            ? 'text-white border-white bg-gray-800 hover:bg-gray-700' 
            : 'text-gray-800 border-gray-800 bg-white hover:bg-gray-100'
        ]"
        @click="changeColor"
      >
        <ClientOnly>
          <Icon
            v-if="colorMode.value === 'dark'"
            name="heroicons-outline:moon"
            class="text-xl"
            :class="{'text-white': colorMode.value === 'dark'}"
          />
          <Icon
            v-else
            name="heroicons-outline:sun"
            class="text-xl"
            :class="{'text-gray-800': colorMode.value === 'light'}"
          />
        </ClientOnly>
      </button>
    </nav>

    <!-- Main Content -->
    <div class="flex items-center justify-center p-6">
      <div class="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-colors duration-200">
        <div class="p-8 space-y-6">
          <!-- Header -->
          <div class="text-center">
            <h1 class="text-3xl font-bold text-gray-800 dark:text-white transition-colors duration-200">
              Vaste Lasten Berekenen
            </h1>
            <p class="text-gray-600 dark:text-gray-300 transition-colors duration-200">
              Bereken eenvoudig uw maandelijkse vaste lasten en beschikbaar inkomen
            </p>
          </div>

          <!-- Income Section -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div v-for="(income, key) in incomes" :key="key" class="space-y-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
                {{ incomeLabels[key] }}
              </label>
              <div class="relative">
                <span class="absolute left-3 top-2 text-gray-500 dark:text-gray-400">€</span>
                <input 
                  v-model="incomes[key]" 
                  type="number" 
                  class="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 
                         dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 
                         transition-colors duration-200" 
                  placeholder="0.00"
                >
              </div>
            </div>
          </div>

          <!-- Fixed Charges Section -->
          <div>
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-semibold text-gray-800 dark:text-white transition-colors duration-200">
                Vaste Lasten
              </h2>
              <button 
                @click="addNewCharge" 
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg 
                       hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 
                       transition-colors duration-200"
              >
                + Nieuwe Uitgave
              </button>
            </div>
            <div class="border rounded-lg max-h-60 overflow-y-auto bg-gray-50 dark:bg-gray-700 
                      p-4 space-y-3 transition-colors duration-200">
              <div 
                v-for="charge in fixedCharges" 
                :key="charge.id" 
                class="flex items-center space-x-4 bg-white dark:bg-gray-800 p-3 
                       rounded-lg shadow-sm transition-colors duration-200"
              >
                <input 
                  v-model="charge.name" 
                  class="flex-1 px-3 py-2 border rounded-lg focus:ring-blue-500 
                         focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 
                         dark:text-white transition-colors duration-200" 
                  placeholder="Uitgave naam"
                >
                <div class="relative w-36">
                  <span class="absolute left-3 top-2 text-gray-500 dark:text-gray-400">€</span>
                  <input 
                    v-model="charge.amount" 
                    type="number" 
                    class="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-blue-500 
                           focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 
                           dark:text-white transition-colors duration-200" 
                    placeholder="0.00"
                  >
                </div>
                <button 
                  @click="removeCharge(charge.id)" 
                  class="p-2 text-red-500 hover:text-red-700 dark:text-red-400 
                         dark:hover:text-red-300 transition-colors duration-200"
                >
                  ✖
                </button>
              </div>
            </div>
          </div>

          <!-- Results Section -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center bg-gray-50 
                    dark:bg-gray-700 p-6 rounded-lg transition-colors duration-200">
            <div>
              <div class="text-sm text-gray-500 dark:text-gray-400">Totaal Inkomen</div>
              <div class="text-2xl font-bold text-green-600 dark:text-green-400">
                €{{ formatNumber(totals.income) }}
              </div>
            </div>
            <div>
              <div class="text-sm text-gray-500 dark:text-gray-400">Totaal Vaste Lasten</div>
              <div class="text-2xl font-bold text-red-600 dark:text-red-400">
                €{{ formatNumber(totals.expenses) }}
              </div>
            </div>
            <div>
              <div class="text-sm text-gray-500 dark:text-gray-400">Resterend</div>
              <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                €{{ formatNumber(totals.remaining) }}
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-4">
            <button 
              @click="calculate" 
              class="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 
                     dark:hover:bg-blue-600 text-white px-6 py-3 rounded-lg 
                     font-medium transition-colors duration-200"
            >
              Berekenen
            </button>
            <button 
              @click="resetCalculator" 
              class="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 
                     dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 
                     px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Wissen
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode();
const changeColor = () => (colorMode.preference = colorMode.value === 'light' ? 'dark' : 'light');

const incomes = ref({ amjad: 0, duaa: 0, other: 0 });
const incomeLabels = { amjad: 'Amjad Inkomen', duaa: 'Duaa Inkomen', other: 'Andere Inkomsten' };
const fixedCharges = ref([
  { id: 1, name: "Hypotheek", amount: 1344.78 },
  { id: 2, name: "VVE", amount: 197 },
  { id: 3, name: "Rechtsbijstand verzekering", amount: 17.37 },
  { id: 4, name: "Woon verzekering", amount: 10 },
  { id: 5, name: "Overlijdrisico verzekering", amount: 32.37 },
  { id: 6, name: "Auto verzekering", amount: 44 },
  { id: 7, name: "Auto parkeren", amount: 10 },
  { id: 8, name: "Amjad Zorgverzekering", amount: 165.90 },
  { id: 9, name: "Duaa Zorgverzekering", amount: 200 },
  { id: 10, name: "Auto Belasting", amount: 93 },
  { id: 11, name: "Elektra", amount: 221 },
  { id: 12, name: "Water", amount: 32 },
  { id: 13, name: "Internet", amount: 35 },
  { id: 14, name: "ABN Bijdrage", amount: 4 },
  { id: 15, name: "ANWB Bijdrage", amount: 12.5 },
  { id: 16, name: "Amjad Telefoon", amount: 17.5 },
  { id: 17, name: "Duaa Telefoon", amount: 25 },
  { id: 18, name: "Kinderopvang bijdrage", amount: 50 },
  { id: 19, name: "Boodschappen", amount: 700 },
  { id: 20, name: "Amjad prive", amount: 250 },
  { id: 21, name: "Duaa prive", amount: 250 },
  { id: 22, name: "Geld Overmaken Familie", amount: 400 }
]);

const totals = reactive({ income: 0, expenses: 0, remaining: 0 });

const addNewCharge = () => {
  fixedCharges.value.push({ id: Date.now(), name: "Nieuwe Uitgave", amount: 0 });
};

const removeCharge = (id) => {
  fixedCharges.value = fixedCharges.value.filter(charge => charge.id !== id);
  calculate();
};

const calculate = () => {
  totals.income = Object.values(incomes.value).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
  totals.expenses = fixedCharges.value.reduce((sum, charge) => sum + (parseFloat(charge.amount) || 0), 0);
  totals.remaining = totals.income - totals.expenses;
};

const resetCalculator = () => {
  incomes.value = { amjad: 0, duaa: 0, other: 0 };
  fixedCharges.value = [
    { id: 1, name: "Hypotheek", amount: 1344.78 },
    { id: 2, name: "VVE", amount: 197 },
    { id: 3, name: "Rechtsbijstand verzekering", amount: 17.37 },
    { id: 4, name: "Woon verzekering", amount: 10 },
    { id: 5, name: "Overlijdrisico verzekering", amount: 32.37 },
    { id: 6, name: "Auto verzekering", amount: 44 },
    { id: 7, name: "Auto parkeren", amount: 10 },
    { id: 8, name: "Amjad Zorgverzekering", amount: 165.90 },
    { id: 9, name: "Duaa Zorgverzekering", amount: 200 },
    { id: 10, name: "Auto Belasting", amount: 93 },
    { id: 11, name: "Elektra", amount: 221 },
    { id: 12, name: "Water", amount: 32 },
    { id: 13, name: "Internet", amount: 35 },
    { id: 14, name: "ABN Bijdrage", amount: 4 },
    { id: 15, name: "ANWB Bijdrage", amount: 12.5 },
    { id: 16, name: "Amjad Telefoon", amount: 17.5 },
    { id: 17, name: "Duaa Telefoon", amount: 25 },
    { id: 18, name: "Kinderopvang bijdrage", amount: 50 },
    { id: 19, name: "Boodschappen", amount: 700 },
    { id: 20, name: "Amjad prive", amount: 250 },
    { id: 21, name: "Duaa prive", amount: 250 },
    { id: 22, name: "Geld Overmaken Familie", amount: 400 }
  ];
  calculate();
};


const formatNumber = (number) => {
  return number.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

watch([incomes, fixedCharges], calculate, { deep: true });

onMounted(calculate);
</script>

<style>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

/* Smooth transitions for dark mode */
* {
  transition-property: color, background-color, border-color;
  transition-duration: 200ms;
  transition-timing-function: ease-in-out;
}
</style>
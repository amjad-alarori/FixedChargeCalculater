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

            <div class="border rounded-lg max-h-80 overflow-y-auto bg-gray-50 dark:bg-gray-700 p-4 space-y-4">
              <div 
                v-for="charge in fixedCharges" 
                :key="charge.id" 
                class="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm transition-colors duration-200"
              >
                <!-- Charge Name Input -->
                <div class="flex-1">
                  <input 
                    v-model="charge.name" 
                    class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-200" 
                    placeholder="Uitgave naam"
                  />
                </div>

                <!-- Charge Amount Input -->
                <div class="relative w-full sm:w-36 mt-2 sm:mt-0">
                  <span class="absolute left-3 top-2 text-gray-500 dark:text-gray-400">€</span>
                  <input 
                    v-model="charge.amount" 
                    type="number" 
                    class="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-200" 
                    placeholder="0.00"
                  />
                </div>

                <!-- Remove Button -->
                <button 
                  @click="removeCharge(charge.id)" 
                  class="mt-2 sm:mt-0 p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
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
import { watch } from 'vue';

const colorMode = useColorMode();
const changeColor = () => (colorMode.preference = colorMode.value === 'light' ? 'dark' : 'light');

// Default values for incomes and charges
const defaultIncomes = { amjad: 0, duaa: 0, other: 0 };
const defaultCharges = [
  { id: 1, name: "Hypotheek", amount: 1344.78 },
  { id: 2, name: "VVE", amount: 207 },
  { id: 3, name: "Rechtsbijstand verzekering", amount: 18.91 },
  { id: 4, name: "Woon verzekering", amount: 10 },
  { id: 5, name: "Overlijdrisico verzekering", amount: 32.37 },
  { id: 6, name: "Auto verzekering Polo", amount: 91 },
  { id: 7, name: "Auto verzekering Golf", amount: 101 },
  { id: 8, name: "Auto Belasting Polo", amount: 93 },
  { id: 9, name: "Auto Belasting Golf", amount: 25 },
  { id: 10, name: "Aansprakelijkheid verzekering", amount: 7.5 },
  { id: 11, name: "Auto parkeren", amount: 10 },
  { id: 12, name: "Amjad Zorgverzekering", amount: 165.90 },
  { id: 13, name: "Duaa Zorgverzekering", amount: 200 },
  { id: 14, name: "Elektra", amount: 221 },
  { id: 15, name: "Water", amount: 32 },
  { id: 16, name: "Internet", amount: 42 },
  { id: 17, name: "ABN Bijdrage", amount: 4 },
  { id: 18, name: "ANWB Bijdrage", amount: 12.5 },
  { id: 19, name: "Amjad Telefoon", amount: 17.5 },
  { id: 20, name: "Duaa Telefoon", amount: 25 },
  { id: 21, name: "Kinderopvang bijdrage", amount: 50 },
  { id: 22, name: "Boodschappen", amount: 800 },
  { id: 23, name: "Amjad prive", amount: 250 },
  { id: 24, name: "Duaa prive", amount: 250 },
  { id: 25, name: "Geld Overmaken Familie", amount: 400 }
];

// Reactive references
const incomes = ref({ ...defaultIncomes });
const incomeLabels = { 
  amjad: 'Amjad Inkomen', 
  duaa: 'Duaa Inkomen', 
  other: 'Andere Inkomsten' 
};
const fixedCharges = ref([...defaultCharges]);

// Reactive totals object
const totals = reactive({
  income: 0,
  expenses: 0,
  remaining: 0
});

// Watch for changes and recalculate automatically
watch([incomes, fixedCharges], () => {
  calculate();
}, { deep: true });

// Add new charge with unique ID
const addNewCharge = () => {
  const newId = Math.max(...fixedCharges.value.map(charge => charge.id), 0) + 1;
  fixedCharges.value.push({
    id: newId,
    name: "Nieuwe Uitgave",
    amount: 0
  });
};

// Remove charge by ID
const removeCharge = (id: number) => {
  fixedCharges.value = fixedCharges.value.filter(charge => charge.id !== id);
};

// Safe number parsing
const safeParseFloat = (value: any): number => {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
};

// Calculate totals with safe number handling
const calculate = () => {
  // Calculate total income
  totals.income = Object.values(incomes.value).reduce((sum, value) => {
    return sum + safeParseFloat(value);
  }, 0);
  
  // Calculate total expenses
  totals.expenses = fixedCharges.value.reduce((sum, charge) => {
    return sum + safeParseFloat(charge.amount);
  }, 0);
  
  // Calculate remaining amount
  totals.remaining = totals.income - totals.expenses;
};

// Reset calculator to default values
const resetCalculator = () => {
  incomes.value = { ...defaultIncomes };
  fixedCharges.value = [...defaultCharges];
  calculate(); // Recalculate totals after reset
};

// Format number for display
const formatNumber = (num: number): string => {
  return num.toFixed(2).replace('.', ',');
};
</script>


<style scoped>
/* Dark and Light Mode Transitions */
* {
  transition-property: color, background-color, border-color;
  transition-duration: 200ms;
  transition-timing-function: ease-in-out;
}

/* Responsive Adjustments for Small Devices */
@media (max-width: 640px) {
  .sm\:w-36 {
    width: 100% !important;
  }

  .sm\:flex-row {
    flex-direction: column !important;
    align-items: stretch !important;
  }

  .sm\:mt-0 {
    margin-top: 8px !important;
  }
}
</style>

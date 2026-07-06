<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-200">

    <!-- Sticky Header -->
    <header class="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl backdrop-saturate-150 border-b border-gray-200/60 dark:border-gray-800 transition-colors duration-200">
      <div class="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm shadow-blue-500/25">
            <span class="text-white font-bold text-sm">€</span>
          </div>
          <div class="leading-tight">
            <div class="text-[15px] font-bold text-gray-900 dark:text-white">Vaste Lasten</div>
            <div class="text-[11px] text-gray-400 dark:text-gray-500 -mt-0.5">Calculator</div>
          </div>
        </div>
        <button
          @click="changeColor"
          class="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-90 transition-all"
          aria-label="Thema wisselen"
        >
          <ClientOnly>
            <Icon v-if="colorMode.value === 'dark'" name="heroicons-outline:moon" class="text-lg text-gray-400" />
            <Icon v-else name="heroicons-outline:sun" class="text-lg text-gray-600" />
          </ClientOnly>
        </button>
      </div>
    </header>

    <!-- Sticky Summary Bar -->
    <div class="sticky top-14 z-40 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl backdrop-saturate-150 border-b border-gray-200/60 dark:border-gray-800 transition-colors duration-200">
      <div class="max-w-2xl mx-auto px-4 py-2.5">
        <div class="grid grid-cols-3">
          <div class="text-center py-1">
            <div class="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Inkomen</div>
            <div class="text-[15px] font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
              €{{ formatNumber(totals.income) }}
            </div>
          </div>
          <div class="text-center py-1 border-x border-gray-200/60 dark:border-gray-700/60">
            <div class="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Lasten</div>
            <div class="text-[15px] font-bold text-rose-600 dark:text-rose-400 tabular-nums">
              €{{ formatNumber(totals.expenses) }}
            </div>
          </div>
          <div class="text-center py-1">
            <div class="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Over</div>
            <div
              class="text-[15px] font-bold tabular-nums"
              :class="totals.remaining >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-rose-600 dark:text-rose-400'"
            >
              €{{ formatNumber(totals.remaining) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- iOS Install Banner -->
    <ClientOnly>
      <Transition name="slide-up">
        <div
          v-if="showInstallBanner"
          class="fixed bottom-0 left-0 right-0 z-50 safe-bottom"
        >
          <div class="max-w-2xl mx-auto px-4 pb-4">
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/60 dark:border-gray-700 p-4 flex items-start gap-3">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0">
                <span class="text-white font-bold text-sm">€</span>
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-[14px] font-semibold text-gray-900 dark:text-white">Installeer als app</div>
                <div class="text-[12px] text-gray-500 dark:text-gray-400 mt-0.5">
                  Tik op
                  <Icon name="heroicons-outline:arrow-up-on-square" class="inline text-blue-500 text-[14px] -mt-0.5" />
                  en dan <strong>"Zet op beginscherm"</strong>
                </div>
              </div>
              <button
                @click="dismissInstallBanner"
                class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 shrink-0"
                aria-label="Sluiten"
              >
                <Icon name="heroicons-outline:x-mark" class="text-[16px]" />
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </ClientOnly>

    <!-- Main Content -->
    <main class="max-w-2xl mx-auto px-4 pt-5 pb-10 space-y-6">

      <!-- Income Section -->
      <section>
        <h2 class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-1">
          Inkomen
        </h2>
        <div class="bg-white dark:bg-gray-800/80 rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-100 dark:divide-gray-700/50 transition-colors duration-200">
          <div v-for="(_, key) in incomes" :key="key" class="flex items-center justify-between px-4 h-[52px]">
            <label class="text-[14px] text-gray-700 dark:text-gray-300 select-none">
              {{ incomeLabels[key] }}
            </label>
            <div class="relative">
              <span class="absolute left-0 top-1/2 -translate-y-1/2 text-sm text-gray-400 dark:text-gray-500 pointer-events-none">€</span>
              <input
                v-model="incomes[key]"
                type="number"
                inputmode="decimal"
                step="0.01"
                class="w-28 pl-5 pr-0 py-1.5 text-right text-sm bg-transparent border-0 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 focus:ring-0 focus:outline-none tabular-nums"
                placeholder="0,00"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Fixed Charges Section -->
      <section>
        <div class="flex items-center justify-between mb-2 px-1">
          <h2 class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Vaste Lasten
            <span class="text-gray-300 dark:text-gray-600 font-normal ml-1">({{ fixedCharges.length }})</span>
          </h2>
          <button
            @click="addNewCharge"
            class="text-[13px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 active:scale-95 transition-transform"
          >
            + Toevoegen
          </button>
        </div>
        <div class="bg-white dark:bg-gray-800/80 rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-100 dark:divide-gray-700/50 transition-colors duration-200">
          <div
            v-for="charge in fixedCharges"
            :key="charge.id"
            class="flex items-start sm:items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3"
          >
            <div class="flex-1 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 min-w-0">
              <input
                v-model="charge.name"
                class="charge-name-input"
                placeholder="Uitgave naam"
              />
              <div class="relative sm:w-32 flex-shrink-0">
                <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 dark:text-gray-500 pointer-events-none">€</span>
                <input
                  v-model="charge.amount"
                  type="number"
                  inputmode="decimal"
                  step="0.01"
                  class="charge-amount-input"
                  placeholder="0,00"
                />
              </div>
            </div>
            <button
              @click="removeCharge(charge.id)"
              class="delete-btn"
              aria-label="Verwijderen"
            >
              <Icon name="heroicons-outline:x-mark" class="text-[16px]" />
            </button>
          </div>
        </div>
      </section>

      <!-- Reset Button -->
      <button
        @click="resetCalculator"
        class="w-full py-3.5 text-[14px] font-medium text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800/80 rounded-2xl shadow-sm hover:text-rose-500 dark:hover:text-rose-400 active:scale-[0.98] transition-all"
      >
        Alles Wissen
      </button>

    </main>
  </div>
</template>

<script setup lang="ts">
import { watch, onMounted } from 'vue';

const colorMode = useColorMode();

// iOS PWA install banner
const showInstallBanner = ref(false);

onMounted(() => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isStandalone = ('standalone' in window.navigator) && (window.navigator as any).standalone;
  const dismissed = localStorage.getItem('pwa-banner-dismissed');
  if (isIOS && !isStandalone && !dismissed) {
    showInstallBanner.value = true;
  }
});

const dismissInstallBanner = () => {
  showInstallBanner.value = false;
  localStorage.setItem('pwa-banner-dismissed', 'true');
};
const changeColor = () => (colorMode.preference = colorMode.value === 'light' ? 'dark' : 'light');

// Default values
const defaultIncomes = { amjad: 0, duaa: 0, other: 0 };
const defaultCharges = [
  { id: 1, name: "Hypotheek", amount: 1330.43 },
  { id: 2, name: "VVE", amount: 220.19 },
  { id: 3, name: "Rechtsbijstand verzekering", amount: 21.71 },
  { id: 4, name: "Woon verzekering", amount: 9.53 },
  { id: 5, name: "Overlijdrisico verzekering", amount: 32.37 },
  { id: 6, name: "Auto verzekering Audi", amount: 122.51 },
  { id: 7, name: "Auto verzekering Golf", amount: 220 },
  { id: 8, name: "Auto Belasting Audi", amount: 57 },
  { id: 9, name: "Auto Belasting Golf", amount: 60 },
  { id: 10, name: "Aansprakelijkheid verzekering", amount: 7.06 },
  { id: 11, name: "Auto parkeren", amount: 10 },
  { id: 12, name: "Amjad Zorgverzekering", amount: 160.85 },
  { id: 13, name: "Duaa Zorgverzekering", amount: 235 },
  { id: 14, name: "Elektra", amount: 221 },
  { id: 15, name: "Water", amount: 32 },
  { id: 16, name: "Internet", amount: 43.90 },
  { id: 17, name: "ABN Bijdrage", amount: 4.30 },
  { id: 18, name: "ANWB Bijdrage", amount: 12.95 },
  { id: 19, name: "Amjad Telefoon", amount: 87 },
  { id: 20, name: "Duaa Telefoon", amount: 67 },
  { id: 21, name: "Kinderopvang bijdrage", amount: 50 },
  { id: 22, name: "Boodschappen", amount: 800 },
  { id: 23, name: "Amjad prive", amount: 250 },
  { id: 24, name: "Duaa prive", amount: 250 },
  { id: 25, name: "Geld Overmaken Familie", amount: 400 }
];

// Reactive references
const incomes = ref({ ...defaultIncomes });
const incomeLabels: Record<string, string> = {
  amjad: 'Amjad Inkomen',
  duaa: 'Duaa Inkomen',
  other: 'Andere Inkomsten'
};
const fixedCharges = ref(defaultCharges.map(c => ({ ...c })));

// Reactive totals
const totals = reactive({
  income: 0,
  expenses: 0,
  remaining: 0
});

// Watch for changes and recalculate automatically
watch([incomes, fixedCharges], () => {
  calculate();
}, { deep: true });

// Add new charge
const addNewCharge = () => {
  const newId = Math.max(...fixedCharges.value.map(c => c.id), 0) + 1;
  fixedCharges.value.push({ id: newId, name: "Nieuwe Uitgave", amount: 0 });
};

// Remove charge
const removeCharge = (id: number) => {
  fixedCharges.value = fixedCharges.value.filter(c => c.id !== id);
};

// Safe number parsing
const safeParseFloat = (value: any): number => {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
};

// Calculate totals
const calculate = () => {
  totals.income = Object.values(incomes.value).reduce((sum, val) => sum + safeParseFloat(val), 0);
  totals.expenses = fixedCharges.value.reduce((sum, c) => sum + safeParseFloat(c.amount), 0);
  totals.remaining = totals.income - totals.expenses;
};

// Reset calculator
const resetCalculator = () => {
  incomes.value = { ...defaultIncomes };
  fixedCharges.value = defaultCharges.map(c => ({ ...c }));
  calculate();
};

// Format number for display
const formatNumber = (num: number): string => {
  return num.toFixed(2).replace('.', ',');
};
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.35s ease, opacity 0.35s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
.safe-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>

<template>
  <div class="bg-gray-100 p-4">
    <div class="max-w-md mx-auto bg-white rounded p-6 shadow-md">
      <h1 class="text-2xl font-semibold mb-4">Vaste Lasten Berekenen</h1>
      <div>
        <label class="block mb-2">Uw Inkomen:</label>
        <input type="number" v-model="yourIncome" class="w-full p-2 mb-4 border rounded">
      </div>
      <div>
        <label class="block mb-2">Vrouw Inkomen:</label>
        <input type="number" v-model="wifeIncome" class="w-full p-2 mb-4 border rounded">
      </div>
      <div>
        <label class="block mb-2">Studiefinanciering</label>
        <input type="number" v-model="studyloan" class="w-full p-2 mb-4 border rounded">
      </div>
      <div>
        <label class="block mb-2">Andere Inkomsten:</label>
        <input type="number" v-model="otherIncome" class="w-full p-2 mb-4 border rounded">
      </div>
      <div>
        <label class="block mb-2">Vaste Lasten:</label>
        <div id="fixedChargesContainer">
          <label v-for="(charge, index) in defaultFixedCharges" :key="index" :for="'fixedCharge' + index">
            {{ charge.name }}:
            <input type="number" v-model="fixedCharges[index]" class="w-full p-2 mb-2 border rounded">
          </label>
        </div>
        <button @click="addFixedCharge" class="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Nieuwe Uitgave toevoegen</button>
        <div id="totalFixedCharges">Total Vaste Lasten: €{{ totalFixedCharges.toFixed(2) }}</div>
      </div>
      <button @click="calculate" class="mt-4 mr-2 bg-green-500 text-white px-6 py-3 rounded">Berekenen</button>
      <button @click="clear" class="mt-4 bg-red-500 text-white px-6 py-3 rounded">Wissen</button>

      <div id="result" class="mt-4" v-html="result"></div>

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      yourIncome: 0,
      wifeIncome: 0,
      studyloan: 0,
      otherIncome: 0,
      defaultFixedCharges: [
        {
                    name: "Hypotheek",
                    amount: 1344.78
                },
                {
                    name: "VVE",
                    amount: 197
                },
                {
                    name: "Rechtsbijstand verzekering",
                    amount: 17.37
                },
                {
                    name: "Woon verzekering",
                    amount: 16.99
                },
                {
                    name: "Overlijdrisico verzekering",
                    amount: 32.37
                },
                {
                    name: "Auto verzekering",
                    amount: 44
                },
                {
                    name: "Amjad Zorgverzekering",
                    amount: 165.90
                },
                {
                    name: "Duaa Zorgverzekering",
                    amount: 200
                },
                {
                    name: "Auto Belasting",
                    amount: 63
                },
                {
                    name: "Elektra",
                    amount: 221
                },
                {
                    name: "Water",
                    amount: 32
                },
                {
                    name: "Internet",
                    amount: 18.5
                },
                {
                    name: "ABN Bijdrage",
                    amount: 3.25
                },
                {
                    name: "ANWB Bijdrage",
                    amount: 9.50
                },
                {
                    name: "Amjad Telefoon",
                    amount: 17.5
                },
                {
                    name: "Duaa Telefoon",
                    amount: 25
                },
                {
                    name: "Kinderopvang bijdrage",
                    amount: 50
                },
                {
                    name: "Boodschappen",
                    amount: 650
                },
                {
                    name: "Amjad prive",
                    amount: 250
                },
                {
                    name: "Duaa prive",
                    amount: 250
                },
                {
                    name: "Geld Overmaken Familie",
                    amount: 400
                },
      ],
      fixedCharges: [],
      totalFixedCharges: 0,
      result: ""
    };
  },
  methods: {
    addFixedCharge() {
  this.defaultFixedCharges.push({ name: "Nieuwe Uitgave", amount: 0 });
    },
  calculate() {
  this.totalFixedCharges = this.fixedCharges.reduce((total, charge) => total + parseFloat(charge || 0), 0);
  const totalIncome = parseFloat(this.yourIncome || 0) + parseFloat(this.wifeIncome || 0) + parseFloat(this.studyloan || 0) + parseFloat(this.otherIncome || 0);
  const remainingIncome = totalIncome - this.totalFixedCharges;
  this.result = `
    Totaal Inkomen: €${totalIncome.toFixed(2)} <br>
    Total Vaste Lasten: €${this.totalFixedCharges.toFixed(2)} <br>
    Restrerend: €${remainingIncome.toFixed(2)}
  `;
},
    clear() {
  this.yourIncome = 0;
  this.wifeIncome = 0;
  this.studyloan = 0;
  this.otherIncome = 0;
  this.fixedCharges = [];
  // Resetting fixedCharges to default amounts
  this.defaultFixedCharges.forEach(charge => {
    this.fixedCharges.push(charge.amount);
  });
  // Recalculate the total fixed charges
  this.totalFixedCharges = this.fixedCharges.reduce((total, charge) => total + parseFloat(charge || 0), 0);
  this.result = ""; // Clear result
    }
  },
  mounted() {
    this.defaultFixedCharges.forEach(charge => {
      this.fixedCharges.push(charge.amount);
    });
    this.calculate();
  }
};
</script>

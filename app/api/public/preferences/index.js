// Simple JSON data array for default preferences (as key/value pairs)
export default [
  // Foods to avoid (allergies/dislikes)
  { key: 'avoid', value: ['peanuts', 'shellfish', 'cilantro'] },
  // Example dishes the user likes
  { key: 'positiveExamples', value: ['hamburgare', 'råbiff', 'cevice'] },
  // Example dishes the user dislikes
  { key: 'negativeExamples', value: ['surströmming', 'lever', 'blodpudding'] }
];

// Example per-user preferences map
export const byUser = {
  'user-1': {
    avoid: ['lactose', 'peanuts'],
    positiveExamples: ['ramen', 'hamburgare'],
    negativeExamples: ['blodpudding', 'lever']
  },
  'user-2': {
    avoid: ['gluten', 'cilantro'],
    positiveExamples: ['sallad', 'cevice'],
    negativeExamples: ['kåldolmar']
  }
};


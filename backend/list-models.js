require('dotenv').config({ path: '.env' });

const apiKey = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

fetch(url)
  .then(res => res.json())
  .then(data => {
    console.log('Available Gemini Models:');
    data.models?.forEach(model => {
      if (model.supportedGenerationMethods?.includes('generateContent')) {
        console.log(`  - ${model.name.replace('models/', '')}`);
      }
    });
  })
  .catch(err => console.error('Error:', err));

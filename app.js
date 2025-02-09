const express = require('express');
const nunjucks = require('nunjucks');
const minifyHTML = require("express-minify-html-2");
const minify = require("express-minify");
const compression = require("compression");
const FormData = require('form-data');
const fs = require('fs'); // If you need to add files in FormData
const path = require('path');
const plans = require('./data/plans');
const fetch = require('node-fetch');

const app = express();
app.disable("x-powered-by");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(compression());

app.use(
  minifyHTML({
    override: true,
    exception_url: false,
    htmlMinifier: {
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeEmptyAttributes: true,
      minifyJS: true,
    },
  })
);

app.use(
  minify({
    cache: false,
    uglifyJsModule: null,
    errorHandler: null,
    jsMatch: /js/,
    cssMatch: /css/,
  })
);

// Middleware to enforce trailing slash


nunjucks.configure('src/views', {
    autoescape: true,
    express: app
});

app.set('view engine', 'html');

// Endpoint to create an order
app.post('/generate-token', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.render('generate-token', { error: 'Email is required' });
  }

  try {
    // Prepare the FormData
    const formData = new FormData();
    formData.append('email', email);

    // Fetch API request
    const response = await fetch('https://verification.devicetest.org/public/generateClickToken', {
      method: 'PUT',
      headers: formData.getHeaders(),
      body: formData
    });

    // Check if response is OK (200-299)
    

    // Parse JSON response
    const data = await response.json();
    const token = data.manualToken;
    if (!response.ok) {
      console.log(data)
      throw new Error(`${data.message}`);
    }
    return res.redirect(`/generate-token?token=${token}`);

  } catch (error) {
    console.error('Error generating token:', error.message);

    let errorMessage = error.message || 'Failed to generate token';

    // If the error came from a failed HTTP response
    // if (error.message.includes('Error:')) {
    //   errorMessage = error.message;
    // }
    // if (error.response) {
    //   errorMessage = error.message || `Error: ${error.response.status}`;
    //   console.log(errorMessage)
    // }

    return res.redirect(`/mt-tokens?error=${encodeURIComponent(errorMessage)}`);
  }
});



app.get('/', (req, res) => {
  try {
    const platform = require(path.join(__dirname, 'data', 'platforms.json'));
    const testimonials = require(path.join(__dirname, 'data', 'testomonials.json'));

    res.render('index.html', {
      testimonials,
      platform
    });
  } catch (error) {
    console.error('Error loading data files:', error);
    res.status(500).send('Error loading data');
  }
});

app.get('*', (req, res) => {
    res.render('error.html');
});

const PORT = process.env.PORT || 3000; // Fixed `process.env.port` to `process.env.PORT`

app.listen(PORT, '0.0.0.0', () => {
  console.log(`App is running on port ${PORT}`);
});

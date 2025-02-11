const express = require('express');
const nunjucks = require('nunjucks');
const minifyHTML = require("express-minify-html-2");
const minify = require("express-minify");
const compression = require("compression");
const FormData = require('form-data');
const fs = require('fs'); // If you need to add files in FormData
const path = require('path');
const plans = require('./data/plans');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
app.disable("x-powered-by");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(compression());
app.use(cookieParser());
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


// Middleware to check authentication
function isAuthenticated(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect("/login");
  }
  
  // Use the token to fetch user data (or check if it's cached)
  fetchUserData(token)
    .then(userData => {
      // Store user info in res.locals to be accessible in views
      res.locals.user = user;
      console.log(user)
      res.locals.isAuthenticated = true;
      next();
    })
    .catch(err => {
      console.error("Failed to fetch user data:", err);
      return res.redirect("/login");
    });
}


app.use((req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1] || null;
  if (token) {
      try {
          const decoded = JSON.parse(atob(token.split(".")[1]));
          res.locals.user = decoded;
      } catch (error) {
          res.locals.user = null;
      }
  }
  next();
});

app.post('/generate-token', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.render('mt-token', { error: 'Email is required' });
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

    return res.redirect(`/mt-token?error=${encodeURIComponent(errorMessage)}`);
  }
});
app.post("/auth/signin", async (req, res) => {
  try {
      const { email, password } = req.body;

      const response = await fetch("https://verification.devicetest.org/auth/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.statusCode === 200) {
          res.json({
              token: data.token,
              email: email,
              role: data.role,
              picture: data.ourUsers?.picture || "",
              user_id: data.ourUsers?.id || "",
          });
      } else {
          res.status(401).json({ message: "Invalid credentials" });
      }
  } catch (error) {
      res.status(500).json({ message: "Server error" });
  }
});

app.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.clearCookie("refreshToken");
    res.clearCookie("email");
    res.clearCookie("user_id");
    res.clearCookie("user");
    res.redirect("/login");
});
app.get('/forgot-password', (req, res) => {
  res.render('forgot-password.html', {
      api_url: process.env.API_URL 
  });
});
app.get('/', (req, res) => {
  try {
    const platform = require(path.join(__dirname, 'data', 'platforms.json'));
    const testimonials = require(path.join(__dirname, 'data', 'testomonials.json'));

    res.render('index.html', {
      testimonials,
      platform,
      
    });
  } catch (error) {
    console.error('Error loading data files:', error);
    res.status(500).send('Error loading data');
  }
});
app.get('/download/windows', (req, res) => {
  res.render('windows-download.html');
})
app.get('/download/mac', (req, res) => {
  res.render('mac-download.html');
})
app.get('/download/android', (req, res) => {
  res.render('android-download.html');
})
app.get('/download/ios', (req, res) => {
  res.render('ios-download.html');
})
app.get('/download/chrome', (req, res) => {
  res.render('chrome-download.html');
})
app.get('/download/edge', (req, res) => {
  res.render('edge-download.html');
})
app.get('/download/firefox', (req, res) => {
  res.render('firefox-download.html');
})
app.get('/download/brave', (req, res) => {
  res.render('brave-download.html');
})
app.get('/download/opera', (req, res) => {
  res.render('opera-download.html');
})
app.get('/pricing', (req, res) => {
  res.render('pricing.html', { plans });
});
app.get('/login', (req, res) => {
  res.render('login.html');
});
app.get('/sign-up', (req, res) => {
  res.render('sign-up.html',{
    api_url: process.env.API_URL
  });
});
app.get('/generate-token', (req, res) => {
  res.render('generate-token.html');
});
app.get('/mt-token', (req, res) => {
  const userData = req.cookies.user ? JSON.parse(req.cookies.user) : null;
  const userEmail = userData ? userData.email : '';
  
  res.render('mt-token.html', {
    user: res.locals.user,
    userEmail: userEmail,
    token: req.query.token || '',
    error: req.query.error || ''
  });
});
app.get('*', (req, res) => {
  res.render('error.html');
});

const PORT = process.env.PORT || 3000; // Fixed `process.env.port` to `process.env.PORT`

app.listen(PORT, '0.0.0.0', () => {
  console.log(`App is running on port ${PORT}`);
});

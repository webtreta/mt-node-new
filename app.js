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
  next();
}

app.use((req, res, next) => {
  res.locals.isAuthenticated = !!req.cookies.token; // Converts to true if token exists
  res.locals.base64Image = req.user ? req.user.picture : null;
  next();
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const response = await fetch("https://verification.devicetest.org/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (data.statusCode === 200) {
      res.cookie("token", data.token, {
        httpOnly: true, // Secure against XSS attacks
        secure: true,   // Only send over HTTPS
        sameSite: "Strict",
      });
      res.cookie("user_id", data.ourUsers.id, {
        httpOnly: true, // Secure against XSS attacks
        secure: true,   // Only send over HTTPS
        sameSite: "Strict",
      });
      res.cookie("email", data.ourUsers.email, {
        httpOnly: true, // Secure against XSS attacks
        secure: true,   // Only send over HTTPS
        sameSite: "Strict",
      });
      res.cookie("user", JSON.stringify(data.ourUsers), {
        httpOnly: true, // Secure against XSS attacks
        secure: true,   // Only send over HTTPS
        sameSite: "Strict",
      });
      return res.redirect("/");
    } else {
      if (data.error === "Invalid CredentialsBad credentials") {
        return res.render("login", { error: "Invalid Credentials" });
      } else if (data.message === "Invalid CredentialsNo value present") {
        return res.render("login", { error: "User Not Found" });
      } else {
        return res.render("login", { error: data.message });
      }
    }
  } catch (error) {
    return res.render("login", { error: "Something went wrong" });
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
  res.render('sign-up.html');
});
app.get('/generate-token', (req, res) => {
  res.render('generate-token.html');
});
app.get('*', (req, res) => {
  res.render('error.html');
});

const PORT = process.env.PORT || 3000; // Fixed `process.env.port` to `process.env.PORT`

app.listen(PORT, '0.0.0.0', () => {
  console.log(`App is running on port ${PORT}`);
});

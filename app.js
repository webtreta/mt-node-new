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
              firstname: data.ourUsers.firstname,
              lastname: data.ourUsers.lastname,
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
app.post("/changePassword", async (req, res) => {
  try {
      const { userId, oldPassword, newPassword, confirmPassword } = req.body;
      console.log(req.body)
      // Make sure passwords match
      if (newPassword !== confirmPassword) {
          return res.status(400).json({ message: "New password and confirm password do not match!" });
      }

      // Make the API request to change the password
      const response = await fetch("https://verification.devicetest.org/public/changePassword", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, oldPassword, newPassword, confirmPassword })
      });

      const data = await response.json();

      // Check the response from the external service
      if (data.msg === 'Password Update Succesfully') {
          return res.status(200).json({ message: 'Password Changed Successfully!' });
      } else {
          console.log(data.msg);
          return res.status(400).json({ message: data.msg });
      }
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error", error });
  }
});
app.post("/updateProfile", async (req, res) => {
  try {
      const { userId, picture, token } = req.body;
      // console.log(picture);

      // Check for required fields
      if (!userId || !picture || !token) {
          return res.status(400).json({ message: "Missing required fields" });
      }

      // Make the API request to change the profile
      const response = await fetch("https://verification.devicetest.org/adminuser/updateProfile", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ userId, picture })
      });

      const data = await response.json();
      console.log(data);

      // Check the response from the external service
      if (data.msg === 'Profile Update Succesfully') {  // Adjusted success message
          return res.status(200).json({ message: 'Profile Update Succesfully!' });
      } else {
          console.log(data.msg);
          return res.status(400).json({ message: data.msg });
      }
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error", error });
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
app.get('/dashboard', (req, res) => {
  res.render('dashboard/index.html', {
      // api_url: process.env.API_URL 
  });
});
app.get('/dashboard/statistics', (req, res) => {
  res.render('dashboard/statistics.html', {
      // api_url: process.env.API_URL 
  });
});
app.get('/dashboard/account-settings', (req, res) => {
  res.render('dashboard/account-setting.html', {
      // api_url: process.env.API_URL 
  });
});
app.get('/dashboard/billing', (req, res) => {
  res.render('dashboard/billing.html', {
      // api_url: process.env.API_URL 
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
  res.render('download/windows-download.html');
})
app.get('/download/mac', (req, res) => {
  res.render('download/mac-download.html');
})
app.get('/download/android', (req, res) => {
  res.render('download/android-download.html');
})
app.get('/download/ios', (req, res) => {
  res.render('download/ios-download.html');
})
app.get('/download/chrome', (req, res) => {
  res.render('download/chrome-download.html');
})
app.get('/download/edge', (req, res) => {
  res.render('download/edge-download.html');
})
app.get('/download/firefox', (req, res) => {
  res.render('download/firefox-download.html');
})
app.get('/download/brave', (req, res) => {
  res.render('download/brave-download.html');
})
app.get('/download/opera', (req, res) => {
  res.render('download/opera-download.html');
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
app.get('/about-us', (req, res) => {
  res.render('policy-pages/about-us.html');
});
app.get('/cookie-policy', (req, res) => {
  res.render('policy-pages/cookie-policy.html');
});
app.get('/dmca-policy', (req, res) => {
  res.render('policy-pages/dmca-policy.html');
});
app.get('/eu-policy', (req, res) => {
  res.render('policy-pages/eu-policy.html');
});
app.get('/gdpr-policy', (req, res) => {
  res.render('policy-pages/gdpr-policy.html');
});
app.get('/privacy-policy', (req, res) => {
  res.render('policy-pages/privacy-policy.html');
});
app.get('/terms', (req, res) => {
  res.render('policy-pages/terms.html');
});
app.get('/legal-notice', (req, res) => {
  res.render('policy-pages/legal-notice.html');
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
app.get('/tools/keyboard-tester', (req, res) => {
  res.render('tools/keyboard-tester.html', {
      // api_url: process.env.API_URL 
  });
});
app.get('/tools/reaction-time-test', (req, res) => {
  res.render('tools/reaction-time-test.html', {
      // api_url: process.env.API_URL 
  });
});
app.get('/tools/text-to-speech', (req, res) => {
  res.render('tools/text-to-speech.html', {
      // api_url: process.env.API_URL 
  });
});
app.get('/tools/speech-to-text', (req, res) => {
  res.render('tools/speech-to-text.html', {
      // api_url: process.env.API_URL 
  });
});
app.get('/tools/typing-test', (req, res) => {
  res.render('tools/typing-test.html', {
      // api_url: process.env.API_URL 
  });
});
app.get('*', (req, res) => {
  res.render('error.html');
});



const PORT = process.env.PORT || 3000; // Fixed `process.env.port` to `process.env.PORT`

app.listen(PORT, '0.0.0.0', () => {
  console.log(`App is running on port ${PORT}`);
});

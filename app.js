const express = require("express");
const https = require("https");
const axios = require("axios");
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/signup.html");
});

app.get("/success", (req, res) => {
  res.sendFile(__dirname + "/public/success.html");
});

app.get("/failure", (req, res) => {
  res.sendFile(__dirname + "/public/failure.html");
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.post("/", (req, res) => {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);
  const url = "https://us8.api.mailchimp.com/3.0/lists/da468a2df1";
  const options = {
    method: "POST",
    auth: "nikki1: 49f6e87d98547bebc3b61ad1518d05e4-us8",
  };

  const request = https.request(url, options, function (response) {
    response.on("data", function (data) {
      if (response.statusCode === 200) {
        res.redirect("/success");
      } else {
        res.redirect("/failure");
      }

      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

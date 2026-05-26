// app.js
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;
mongoose.connect("mongodb://localhost:27017/Revival", { useNewUrlParser: true, useUnifiedTopology: true })
const con = mongoose.connection
const registrationSchema = new mongoose.Schema({
  username:String,
  email: String,
  age:String,
  number:String,
  password: String,
  // Add more fields as needed
});

// Create a mongoose model using the schema
const registrations = mongoose.model('registrations', registrationSchema);




// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));
// Serve login.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/login.html'));
});

// SIGNUP PAGE 
app.post('/signup', (req, res) => {
    const { name,email,uage,phone,upass,repass} = req.body;
    if(upass!=repass && repass!='')
    {
     const errorMessage = 'Passwords does not match!';
     return res.status(400).send(`
         <script>
             alert("${errorMessage}");
             window.location.href = "/"; // Redirect to the same page
         </script>
     `);
    }
    else{
     var data = {
        "username":name,
        "email": email,
        "age":uage,
        "number":phone,
        "password": upass,
     }
 con.collection('registrations').insertOne(data,function(err, collection){
         if (err) throw err;
         const errorMessage = 'Registration Done Successfully!';
         return res.status(400).send(`
             <script>
                 alert("${errorMessage}");
                 window.location.href = "/"; // Redirect to the same page
             </script>
         `);
         console.log("Record inserted Successfully");
              
     });
    }
 });

 //login page
 app.post('/login', async (req, res) => {
    const { name, password } = req.body;
    
    try {
        const registration = await registrations.findOne({
            "username":name
        });
         if(!registration)
            {
              const errorMessage = 'user  Not found ';
            return res.status(400).send(`
            <script>
                alert("${errorMessage}");
                window.location.href = "/"; // Redirect to the same page
            </script>
        `);
            }
        else{
          
          const em =registration.username;
          const pass=registration.password;
          
          if(em==name && pass==password){
            res.redirect("/index");
          }
          else{
            const errorMessage = 'Invalid password';
            return res.status(400).send(`
            <script>
                alert("${errorMessage}");
                window.location.href = "/"; // Redirect to the same page
            </script>
        `);
          }
        }
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });
    app.get('/home',(req,res)=>{
        res.sendFile(path.join(__dirname, '/public/index.html'));
    });






// Start the server
app.listen(port, () => {
  console.log("Server is running on port 3000}");
});
const express = require('express')
const app = express()
const path = require('path')

app.set('port', 3000)


//middlewares
app.use(express.static(path.join(__dirname,'public')))

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

//routes
app.get('/', (req, res)=>{
    res.send('')
})

//api de traduccion de textos

app.post('/get_translation', (req, res)=>{
    var translate = require('node-google-translate-skidz');
translate({
    text: req.body.txt[0],
    source: req.body.language1,
    target: req.body.language2
  }, function(result) {
        res.send(result.translation)
  });
  
})

//correr aplicacion
app.listen(app.get('port'), ()=>{
    console.log(`Aplicacion corriendo en el puerto ${app.get('port')}`);
})

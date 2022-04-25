const express = require('express')
const app = express()
const path = require('path')

app.set('port', 3000)

//middlewares
app.use(express.static(path.join(__dirname,'public')))
//routes
app.get('/', (req, res)=>{
    res.send('')
})

//api de traduccion de textos
app.get('/get_translation', (req, res)=>{
    var translate = require('node-google-translate-skidz');
translate({
    text: req.query.txt,
    source: req.query.language1,
    target: req.query.language2
  }, function(result) {
        //console.log(result);
        res.send(result.translation)
  });
  
})

//api para descargar json
app.get('/dowload_translation', (req, res)=>{
        res.setHeader('Content-disposition', 'attachment; filename='+req.query.lang+'.json');
        res.setHeader('Content-type', 'text/plain');
        res.charset = 'UTF-8';
        res.write(req.query.content);
        res.end();
})

//correr aplicacion
app.listen(app.get('port'), ()=>{
    console.log(`Aplicacion corriendo en el puerto ${app.get('port')}`);
})

//creamos variable global donde se almacenara la traduccion del texto del json
var jsonTextTraduced = '';
var jsonText;
var language1 = 'es';
var language2 = 'en'
async function ajaxTranslate(text) {
    var toReturn;
    await fetch('http://localhost:3000/get_translation?language1=' + language1 + '&language2=' + language2 + '&txt=' + text, {
        method: 'GET'
    })
        .then(function (response) {
            if (response.ok) {
                return response.text()
            } else {
                throw "Error en la llamada Ajax";
            }

        })
        .then(function (texto) {
            toReturn = texto;
        })
        .catch(function (err) {
            console.log(err);
        });
    return toReturn;
}
function changeLang(languageType) {
    //significa que se cambia el lenguage de origen
    if (languageType == 1) {
        language1 = document.getElementById('lang1').value;
    }
    //significa que cambia el leguaje de traduccion 
    if (languageType == 2) {
        language2 = document.getElementById('lang2').value;
    }

}

function go2() {
    //mostramos el boton de siguiente paso 
    var buttonUpload = document.getElementById('buttonUpload');
    buttonUpload.style.display = 'block';
    //pasar a siguiente paso
    var slide2 = document.getElementById('slide_2');
    slide2.click();
}
async function go3() {
    //traducimos el json
    var coverDisplay = document.getElementById('cover');
    coverDisplay.style.display = "block";
    jsonTextTraduced = await recursiveJson(jsonText);
    console.log(jsonTextTraduced);
    coverDisplay.style.display = "none";

    //pasar a siguiente paso
    var slide3 = document.getElementById('slide_3');
    slide3.click();
}

async function dowload() {
    window.open("http://localhost:3000/dowload_translation?content=" + jsonTextTraduced + "&lang=" + language2, "Descargar archivo")
}
async function loadFile(file) {
    if (file.type == 'application/json') {
        let text = await file.text();
        jsonText = JSON.parse(text);
    } else {
        await excelFileToJSON(file);
    }
    console.log(jsonText);
    go2();

}

async function recursiveJson(textJSON) {
    var arrayTraduced = "{";
    //el siguiente ciclo funciona para obtener los nombres de las keys del json
    for (var i in textJSON) {
        //verificamos que no sea un json anidado, si lo es manda a llamar esta misma funcion pero ahora con el json anidado como variable
        if (typeof textJSON[i] === 'string' || textJSON[i] instanceof String) {
            var traduced = await ajaxTranslate([textJSON[i]]);
            arrayTraduced += '"' + i + '":"' + traduced + '",';
        } else {
            try {
                arrayTraduced += '"' + i + '":' + await recursiveJson(textJSON[i]) + ',';
            } catch (error) {
                arrayTraduced += '"' + i + '":"' + textJSON[i] + '",';
            }
        }
    }

    // eliminamos la ultima coma
    arrayTraduced = arrayTraduced.substring(0, arrayTraduced.length - 1);
    arrayTraduced += '}';
    return arrayTraduced;
}




async function excelFileToJSON(file) {
    try {
        var reader =  new FileReader();
        var result;
         reader.readAsBinaryString(file);
        reader.onload =  function (e) {

            var data = e.target.result;
            var workbook = XLSX.read(data, {
                type: 'binary'
            });
            workbook.SheetNames.forEach(function (sheetName) {
                var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                //construiremos el string del formato json que necesitamos
                var jsonTextExcel = '{';
                for (let index = 0; index < roa.length; index++) {
                    const element = roa[index];
                    jsonTextExcel += '"' + element.key + '" : "' + element.value + '"';
                    if (index < roa.length - 1) jsonTextExcel += ',';
                }
                jsonTextExcel += '}';
                jsonTextExcel = JSON.parse(jsonTextExcel);
                jsonText = jsonTextExcel;
                console.log(jsonText);
            });
        }
        return result;
    } catch (e) {
        return {};
        console.error(e);
    }
}




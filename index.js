require('dotenv').config();
const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main= async () => {

    const busquedas= new Busquedas();
    let option;

    do {
        option= await inquirerMenu()
        
        switch (option) {
            case 1:
                //Mostrar mensaje
                const termino= await leerInput('Ciudad: ')

                //Buscar el lugar
                const lugares= await busquedas.ciudad(termino);

                //Seleccionar lugar
                const id= await listarLugares(lugares);
                if(id ==='0') continue;
                const lugarSelect= lugares.find(lugar => lugar.id === id);   
                
                //Guardar en DB
                busquedas.agregarHistorial(lugarSelect.nombre);

                //Clima
                const clima= await busquedas.climaLugar(lugarSelect.lat, lugarSelect.lng);

                //Mostrar resultados
                console.clear();
                console.log('\n Información de la ciudad \n'.green);
                console.log('Ciudad: ', lugarSelect.nombre.red);
                console.log('Latitud: ', lugarSelect.lat);
                console.log('Longitud: ', lugarSelect.lng);
                console.log('Temperatura: ', clima.temp);
                console.log('Minima: ', clima.min);
                console.log('Maxima: ', clima.max);
                console.log('Descripción: ', clima.des.red);
                
            break;

            case 2:
                busquedas.historialCapitalizado.forEach((lugar, i) => {
                    const idx= `${i + 1}.`.green;
                    console.log(`${idx} ${lugar}`);
                });
            
            break;

            default:
                break;
        }

        if(option !== 0) await pausa();
        
    } while (option != 0);
    
}

main();
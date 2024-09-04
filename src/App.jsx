import React, { useState, useEffect } from 'react';
import * as signalR from "@microsoft/signalr";

function SumComponent() {
  const [sum, setSum] = useState(0);
  const [connection, setConnection] = useState(null);
  const [contador,setContador] = useState(0)
  useEffect(() => {
    // Crear la conexión
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7187/Suma")  
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    // Iniciar la conexión
    newConnection.start()
      .then(() => {
        console.log('Conexión establecida');
        // Iniciar la suma
        newConnection.invoke("CheckTimerElapsed");
      })
      .catch(err => console.error('Error al conectar:', err));

    // Limpiar al desmontar
    return () => {
      if (newConnection) {
        newConnection.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (connection) {
      // Escuchar el evento ReceiveSum
      connection.on("ReceiveSum", (estado) => {
        setSum(estado);
      });
    }
  }, [connection]);
  useEffect(() => {
    if(connection){
      connection.on("EnviarContador", (conta) =>{
        setContador(conta)
      })
    }
  })

  return (
    <div>
      {/* <h2>Suma actual: {sum ? `CONECTADO` : `No conectado`}</h2> */}
      {/* <img src={sum ? "public/img/botonVerde.png" : "public/img/botonGris.png"}></img> */}
      <h1>Esto: {contador}</h1>
    </div>
  );
}

export default SumComponent;
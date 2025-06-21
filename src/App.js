import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Contenitore from './controlli/contenitore';
import DetailsPage from './pagine/dettaglio';
import Temp1 from './controlli/temp1';
import Termo1 from './controlli/termometro';
import Termo2 from './controlli/termometro2';
import RotationIndicator from './controlli/rotazione';
import Interruttore from './controlli/switch';

import { AlarmProvider } from './contesto/contestoAllarme';


import c1 from './immagini/C1-272x218-cornice.png';
import c2 from './immagini/C2-832x103.png';
import c3 from './immagini/C3-94x548.png';
import c4 from './immagini/C4-80x548.png';
import c5 from './immagini/C5-1080x106.png';
import c6 from './immagini/C6-508x240.png';
import c7 from './immagini/C7-95x356.png';
import c8 from './immagini/C8-670x151.png';

const App = () => {


  const containersData = [
    {
      id: 'c1',
      backgroundImage: c1,
      style: { top: '55%',
               left: '75%',
                width: '18vw',    // prova con viewport width invece di %
                height: '37vh',   // prova con viewport height
               position: 'absolute',
               backgroundSize: 'cover',         // <--- IMPORTANTE
               backgroundPosition: 'center',    // Centra l'immagine
               backgroundRepeat: 'no-repeat',   // Evita ripetizioni
           //    backgroundColor: 'rgba(0, 255, 0, 0.3)',  // <-- solo per debug
       },
      controls: [{ type: Temp1, props: { width: 120, height: 120, value: 75, soglia: 70 } }],
    },
    {
      id: 'c2',
      backgroundImage: c2,
      style: { top: '68%', left: '25%', width: '55%', height: '20%', position: 'absolute',
        backgroundSize: 'cover',         // <--- IMPORTANTE
        backgroundPosition: 'center',    // Centra l'immagine
        backgroundRepeat: 'no-repeat',
       },
      controls: [{ type: Temp1, props: { width: 200, height: 200, value: 65, soglia: 70 } }],
    },
    {
      id: 'c3',
      backgroundImage: c3,
      style: { top: '5%', left: '39%', width: '6%', height: '68%', position: 'absolute',
        backgroundSize: 'cover',         // <--- IMPORTANTE
        backgroundPosition: 'center',    // Centra l'immagine
        backgroundRepeat: 'no-repeat',

       },
      controls: [{ type: Temp1, props: { width: 200, height: 200, value: 70, soglia: 70 } }],
    },
    {
      id: 'c4',
      backgroundImage: c4,
      style: { top: '20%', left: '28%', width: '10%', height: '60%', position: 'absolute',
        backgroundSize: 'cover',         // <--- IMPORTANTE
        backgroundPosition: 'center',    // Centra l'immagine
        backgroundRepeat: 'no-repeat',
       },
      controls: [
        { type: Termo1, props: { width: 200, height: 200, value: 70, soglia: 70 } },
        { type: Termo2, props: { width: 200, height: 200, temperature: 70, soglia: 70 } },
      ],
    },
    {
      id: 'c5',
      backgroundImage: c5,
      style: { top: '12%', left: '4%', width: '65%', height: '10%', position: 'absolute',
        backgroundSize: 'cover',         // <--- IMPORTANTE
        backgroundPosition: 'center',    // Centra l'immagine
        backgroundRepeat: 'no-repeat',
       },
      controls: [
        { type: RotationIndicator, props: { direction: 'dx', soglia: 90 } },
        { type: Termo2, props: { width: 200, height: 200, temperature: 70, soglia: 70 } },
      ],
    },
    {
      id: 'c6',
      backgroundImage: c6,
      style: { top: '50%', left: '4%', width: '35%', height: '40%', position: 'absolute',
        backgroundSize: 'cover',         // <--- IMPORTANTE
        backgroundPosition: 'center',    // Centra l'immagine
        backgroundRepeat: 'no-repeat',
       },
      controls: [
        { type: Termo1, props: { width: 200, height: 200, value: 70, soglia: 70 } },
        { type: Termo2, props: { width: 200, height: 200, temperature: 70, soglia: 70 } },
      ],
    },
    {
      id: 'c7',
      backgroundImage: c7,
      style: { top: '55%', left: '7%', width: '7%', height: '55%', position: 'absolute',
        backgroundSize: 'cover',         // <--- IMPORTANTE
        backgroundPosition: 'center',    // Centra l'immagine
        backgroundRepeat: 'no-repeat',
       },
      controls: [
        { type: Termo1, props: { width: 200, height: 200, value: 70, soglia: 70 } },
        { type: Termo2, props: { width: 200, height: 200, temperature: 70, soglia: 70 } },
      ],
    },
    {
      id: 'c8',
      backgroundImage: c8,
      style: { top: '97%', left: '4%', width: '38%', height: '20%', position: 'absolute',
        backgroundSize: 'cover',         // <--- IMPORTANTE
        backgroundPosition: 'center',    // Centra l'immagine
        backgroundRepeat: 'no-repeat',
       },
      controls: [
        { type: Termo1, props: { width: 200, height: 200, value: 70, soglia: 70 } },
        { type: Termo2, props: { width: 200, height: 200, temperature: 70, soglia: 70 } },
      ],
    },
  ];
  
  const [containers, setContainers] = useState(containersData);

  // Impostiamo il WebSocket per ricevere i dati
 //===========================================================================
  // 14/4/25  versione modificata con mappa controlli da aggiornare
  useEffect(() => {
    const socket = new WebSocket('ws://192.168.1.210:5000');
  // N.B: Modificare questo IP ogni volta che si cambia ambiente di esecuzione
  //==============================================================================
  
    socket.onopen = () => {
      console.log('WebSocket connesso');
    };
  
    socket.onmessage = (event) => {
      let message = event.data;
  
      if (message instanceof Blob) {
        message.text().then((text) => {
          text = text.trim();
  
          if (text.includes(';')) {
            const [temp1, temp2, , direction, state] = text.split(';');
  
            const temp1Value = parseInt(temp1);
            const temp2Value = parseInt(temp2);
  
            console.log("WebSocket temp1:", temp1Value);
            console.log("WebSocket temp2:", temp2Value);
  
            const containersToUpdate = new Set(['c1', 'c4', 'c5', 'c8', 'c10']);
  
            setContainers(prevContainers =>
              prevContainers.map(container => {
                if (!containersToUpdate.has(container.id)) return container;
  
                const updatedControls = container.controls.map(ctrl => {
                  if (ctrl.type === Termo1) {
                    return {
                      ...ctrl,
                      props: { ...ctrl.props, value: temp1Value }
                    };
                  }
                  if (ctrl.type === Termo2) {
                    return {
                      ...ctrl,
                      props: { ...ctrl.props, temperature: temp2Value }
                    };
                  }
                  if (ctrl.type === RotationIndicator) {
                    return {
                      ...ctrl,
                      props: { ...ctrl.props, direction }
                    };
                  }
                  if (ctrl.type === Interruttore) {
                    return {
                      ...ctrl,
                      props: { ...ctrl.props, initialState: state }
                    };
                  }
                  return ctrl;
                });
  
                return {
                  ...container,
                  controls: updatedControls
                };
              })
            );
          }
        }).catch(error => {
          console.error('Errore nel leggere il Blob:', error);
        });
      }
    };
  
    socket.onclose = () => {
      console.log('WebSocket chiuso');
    };
  
    return () => {
      socket.close();
    };
  }, []);
  

  // fine  versione modificata con mappa controlli da aggiornare 
  const handleAlert = (id) => {
    console.log(`Contenitore ${id} in allarme`);
  };

  return (
    <div className="App">
      <h1 className="App-title">Asite demo TMB</h1>
      <AlarmProvider>
        <Router>
          <Routes>
            <Route path="/" element={
              <div className="container-grid">
                {containers.map(container => (
                  <Contenitore
                    key={container.id}
                    id={container.id}
                    backgroundImage={container.backgroundImage}
                    controls={container.controls}
                    onAlert={handleAlert}
                    style={container.style}
                    visible={container.visible} 
                  />
                ))}
              </div>
            } />
            <Route path="/details/:id" element={<DetailsPage containers={containers} />} />
          </Routes>
        </Router>
      </AlarmProvider>
    </div>
  );
}

export default App;

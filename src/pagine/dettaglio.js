
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAlarm } from '../contesto/contestoAllarme';
import './dettaglio.css';

const DetailsPage = ({ containers }) => {
  const { id } = useParams();
  const container = containers.find(container => container.id === id);
  const { alarms, setAlarm } = useAlarm();

  useEffect(() => {
    if (container) {
      let isInAlarm = false;
      container.controls.forEach(control => {
        if (control.props.value > control.props.soglia) {
          isInAlarm = true;
        }
      });
      // Aggiorna lo stato dell'allarme solo se è cambiato
      if (alarms[id] !== isInAlarm) {
        setAlarm(id, isInAlarm);
      }
    }
  }, [container, id, alarms, setAlarm]);

  if (!container) {
    return <div>Contenitore non trovato</div>;
  }

  return (
    <div className="details-page">
      <h5>Dettagli Contenitore {id}</h5>
      <div className="controls-grid">
        {container.controls.map((ControlComponent, index) => (
          <ControlComponent.type
            key={index}
            {...ControlComponent.props}
            setAlarm={(isInAlarm) => setAlarm(container.id, isInAlarm)}
          />
        ))}
      </div>
    </div>
  );
};

export default DetailsPage;


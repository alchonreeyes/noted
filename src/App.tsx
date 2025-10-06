import { useState, useEffect, useRef } from 'react'

import './App.css'

function App() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const timerRef = useRef<number | undefined>();

  useEffect(() => {
    if (running) {
      timerRef.current = window.setInterval(() => {
        setTime(prevTime => prevTime + 10);
      }, 10);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [running]);

  const handleStartStop = () => {
    setRunning(!running);
  };

  const handleLap = () => {
    if (running) {
      setLaps(prevLaps => [...prevLaps, time]);
    }
  };

  const handleReset = () => {
    setRunning(false);
    setTime(0);
    setLaps([]);
  };

  const formatTime = (timeMs: number) => {
    const minutes = Math.floor(timeMs / 60000);
    const seconds = Math.floor((timeMs % 60000) / 1000);
    const milliseconds = Math.floor((timeMs % 1000) / 10);

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`stopwatch-container ${running ? 'running' : ''}`}>
  <div className="total-time">Total – 3hr 15min</div>

  <div className="timer-display">
    <div className="time">{formatTime(time).slice(0, 5)}<br />HOURS</div>
  </div>

  <div className="controls">
    <button className="control-btn">←</button>
    <button className="control-btn start-stop-btn" onClick={handleStartStop}>
      {running ? 'STOP' : 'START'}
    </button>
    <button className="control-btn">⚙️</button>
  </div>
</div>
  )
}

export default App

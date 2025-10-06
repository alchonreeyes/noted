import { useState, useEffect, useRef } from 'react'

function App() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);

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

  const handleReset = () => {
    setRunning(false);
    setTime(0);
  };

  const formatTime = (timeMs: number) => {
    const milliseconds = Math.floor((timeMs / 10) % 100);
    const seconds = Math.floor((timeMs / 1000) % 60);
    const minutes = Math.floor((timeMs / (1000 * 60)) % 60);
    const hours = Math.floor((timeMs / (1000 * 60 * 60)) % 24);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage based on seconds (resets every minute)
  const progressPercentage = (time / 60000) * 100;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>DAILY UI</h1>
        <p style={styles.subtitle}>Total — 3hr 15min</p>
      </div>

      <div style={styles.timerSection}>
        <svg style={styles.progressRing} viewBox="0 0 200 200">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r="85"
            fill="none"
            stroke="#f0f0f0"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r="85"
            fill="none"
            stroke="#ff8a65"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 85}`}
            strokeDashoffset={`${2 * Math.PI * 85 * (1 - (progressPercentage % 100) / 100)}`}
            transform="rotate(-90 100 100)"
            style={{ transition: 'stroke-dashoffset 0.1s linear' }}
          />
          {/* Tick marks */}
          {[...Array(60)].map((_, i) => {
            const angle = (i * 6) - 90;
            const isLarge = i % 5 === 0;
            const outerRadius = 85;
            const innerRadius = isLarge ? 78 : 81;
            const x1 = 100 + outerRadius * Math.cos((angle * Math.PI) / 180);
            const y1 = 100 + outerRadius * Math.sin((angle * Math.PI) / 180);
            const x2 = 100 + innerRadius * Math.cos((angle * Math.PI) / 180);
            const y2 = 100 + innerRadius * Math.sin((angle * Math.PI) / 180);
            
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#e0e0e0"
                strokeWidth={isLarge ? "2" : "1"}
              />
            );
          })}
        </svg>

        <div style={styles.timeDisplay}>
          <p style={styles.todayLabel}>TODAY</p>
          <p style={styles.timeText}>{formatTime(time)}</p>
          <p style={styles.hoursLabel}>HOURS</p>
        </div>
      </div>

      <div style={styles.controls}>
        <button 
          style={styles.navButton}
          onClick={handleReset}
          disabled={time === 0}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        
        <button 
          style={{
            ...styles.startButton,
            ...(running ? styles.stopButton : {})
          }}
          onClick={handleStartStop}
        >
          {running ? 'STOP' : 'START'}
        </button>
        
        <button style={styles.navButton}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v6m0 6v6M1 12h6m6 0h6"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: '100vh',
    backgroundColor: '#fafafa',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    padding: '40px 20px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '60px',
  },
  title: {
    fontSize: '18px',
    fontWeight: '700',
    letterSpacing: '2px',
    color: '#333',
    margin: '0 0 12px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#bbb',
    margin: 0,
    fontWeight: '400',
  },
  timerSection: {
    position: 'relative',
    width: '320px',
    height: '320px',
    marginBottom: '50px',
  },
  progressRing: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  timeDisplay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
  },
  todayLabel: {
    fontSize: '12px',
    color: '#ff8a65',
    fontWeight: '600',
    letterSpacing: '1.5px',
    margin: '0 0 8px 0',
  },
  timeText: {
    fontSize: '48px',
    fontWeight: '300',
    color: '#333',
    margin: '0',
    lineHeight: '1',
    fontVariantNumeric: 'tabular-nums',
  },
  hoursLabel: {
    fontSize: '12px',
    color: '#bbb',
    fontWeight: '400',
    letterSpacing: '1px',
    margin: '8px 0 0 0',
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '320px',
    maxWidth: '100%',
  },
  navButton: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#ccc',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  startButton: {
    padding: '16px 40px',
    borderRadius: '30px',
    border: 'none',
    backgroundColor: '#333',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    letterSpacing: '1.5px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  stopButton: {
    backgroundColor: '#ff5252',
  },
};

export default App;
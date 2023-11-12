import styles from './panel.module.css';
import {sendMessage, pollMessage, listDevices, sendKill, listenForKill} from './controlPanelFuncs';
function Panel() {
  return (
    <>
      <div className={styles.generalOpsBox}>
        <h1 className='fs-secondary-heading font-monospace font-bold'>
          General Operations
        </h1>
        <div style={{display: 'flex'}}>
          <div className={styles.generalOpsActionBox}
                onClick={sendMessage}>
            <h1
              className='fs-secondary-heading font-monospace font-bold'
              style={{
                whiteSpace: 'normal',
                justifyContent: 'center',
                textAlign: 'center',
                paddingTop: '5px',
              }}
            >
              Send Message
            </h1>
          </div>
          <div className={styles.generalOpsActionBox}
                onClick={pollMessage}>
            <h1
              className='fs-secondary-heading font-monospace font-bold'
              style={{
                whiteSpace: 'normal',
                justifyContent: 'center',
                textAlign: 'center',
                paddingTop: '5px',
              }}
            >
              Poll Messages
            </h1>
          </div>
          <div className={styles.generalOpsActionBox}
                onClick={listDevices}>
            <h1
              className='fs-secondary-heading font-monospace font-bold'
              style={{
                whiteSpace: 'normal',
                justifyContent: 'center',
                textAlign: 'center',
                paddingTop: '5px',
              }}
            >
              List Devices
            </h1>
          </div>
        </div>
      </div>
      <div className={styles.killOpsBox}>
        <h1 className='fs-secondary-heading font-monospace font-bold'>
          Kill Operations
        </h1>
        <div style={{display: 'flex'}}>
          <div className={styles.killOpsActionBox}
                onClick={sendKill}>
            <h1
              className='fs-secondary-heading font-monospace font-bold'
              style={{
                whiteSpace: 'normal',
                justifyContent: 'center',
                textAlign: 'center',
                paddingTop: '5px',
              }}
            >
              Send Kill
            </h1>
          </div>
          <div className={styles.killOpsActionBox}
                onClick={listenForKill}>
            <h1
              className='fs-secondary-heading font-monospace font-bold'
              style={{
                whiteSpace: 'normal',
                justifyContent: 'center',
                textAlign: 'center',
                paddingTop: '5px',
              }}
            >
              Listen For Kill
            </h1>
          </div>
        </div>
      </div>
    </>
  );
}

export default Panel;


import styles from './device.module.css';

interface DeviceProps {
  color: string;
  name: string;
  textColor?: string;
}

function Device(props: DeviceProps) {
  return (
    <div className={styles.device}>
      <div
        className={styles.colorBlock}
        style={{ backgroundColor: props.color }}
      ></div>
      <span style={{ color: props.textColor ? props.textColor : 'inherit' }}>
        {props.name}
      </span>
    </div>
  );
}

export default Device;

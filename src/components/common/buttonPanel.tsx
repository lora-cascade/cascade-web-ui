import styles from './buttonPanel.module.css';

interface ButtonPanelProps {
  title: string;
  buttons: string[];
  onClick: (button: string) => void;
  buttonColor: string;
}

function ButtonPanel(props: ButtonPanelProps) {
  return (
    <div className={styles.panel}>
      <h2 className={'fs-secondary-heading font-monospace font-bold'}>
        {props.title}
      </h2>

      <div className={styles.buttons}>
        {props.buttons.map((button, index) => (
          <div
            key={index}
            className={
              styles.button + ' fs-tertiary-heading font-sans font-bold'
            }
            style={{ backgroundColor: props.buttonColor }}
            onClick={() => props.onClick(button)}
          >
            {button}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ButtonPanel;

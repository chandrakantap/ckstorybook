import React, { MouseEventHandler } from "react";
import { LABELS } from "./labels";
import styles from "./TextAnnotator.module.css";

interface LabelSelectorProps {
  left?: number;
  top?: number;
  closeModal: () => void;
  onSelectLabel: (labelName: string) => void;
}

function LabelSelector(props: LabelSelectorProps) {
  const { left, top, closeModal, onSelectLabel } = props;
  const selectLabel: MouseEventHandler<HTMLLIElement> = (e) => {
    e.stopPropagation();
    onSelectLabel(e.currentTarget.dataset["labelName"] as string);
  };
  return (
    <div className={styles.modal} onClick={closeModal}>
      <div className={styles.modalMain} style={{ left, top }}>
        <ul>
          {LABELS.map((label) => (
            <li
              key={label.name}
              className={styles.menuItem}
              style={{ color: `${label.color}` }}
              data-label-name={label.name}
              data-label-color={label.color}
              onClick={selectLabel}
            >
              {label.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default LabelSelector;

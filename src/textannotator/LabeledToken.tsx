import * as React from "react";
import { Token } from "./TextAnnotator.types";
import styles from "./TextAnnotator.module.css";

interface LabeledTokenProps {
  token: Token;
  onRemoveLabel: (token: Token) => void;
}
function LabeledToken({ token, onRemoveLabel }: LabeledTokenProps) {
  const onClickRemove = () => {
    onRemoveLabel(token);
  };
  return (
    <div className={styles.labeledToken}>
      <p className={styles.labeledTokenText}>{token.text}</p>
      <p className={styles.labeledTokenLabelName}>{token?.labelName}</p>
      <span className={styles.removeLabelIcon} onClick={onClickRemove}>
        X
      </span>
    </div>
  );
}

export default LabeledToken;

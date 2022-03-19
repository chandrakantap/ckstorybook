import * as React from "react";
import { Token } from "./TextAnnotator.types";
import { LABELS } from "./labels";
import styles from "./TextAnnotator.module.css";

interface LabeledTokenProps {
  token: Token;
  onRemoveLabel: (token: Token) => void;
}

const LABEL_COLOR: { [key: string]: string } = LABELS.reduce(
  (acc, label) => ({ ...acc, [label.name]: label.color }),
  {}
);

function LabeledToken({ token, onRemoveLabel }: LabeledTokenProps) {
  const onClickRemove = () => {
    onRemoveLabel(token);
  };
  if (!token.labelName) {
    return null;
  }
  return (
    <div
      className={styles.labeledToken}
      style={{ borderColor: LABEL_COLOR[token.labelName] }}
    >
      <p>{token.text}</p>
      <p
        className={styles.labeledTokenLabelName}
        style={{ backgroundColor: LABEL_COLOR[token.labelName] }}
      >
        {token?.labelName}
      </p>
      <span
        className={styles.removeLabelIcon}
        style={{ borderColor: LABEL_COLOR[token.labelName] }}
        onClick={onClickRemove}
      >
        X
      </span>
    </div>
  );
}

export default LabeledToken;

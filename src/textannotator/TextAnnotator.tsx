import * as React from "react";
import { plainText } from "./dummyText";
import LabeledToken from "./LabeledToken";
import { Token } from "./TextAnnotator.types";
import styles from "./TextAnnotator.module.css";

function TextAnnotator(props: any) {
  const [tokens, setTokens] = React.useState<Token[]>([
    {
      tokenId: `T${Date.now()}`,
      text: plainText,
      offset: 0,
    },
  ]);
  const selectionIsEmpty = (selection: Selection) => {
    if (selection?.focusNode) {
      const position = selection?.anchorNode?.compareDocumentPosition(
        selection.focusNode
      );
      return position === 0 && selection.focusOffset === selection.anchorOffset;
    }
  };
  const onMouseUpCapture = () => {
    const selection = window.getSelection() as Selection;
    if (selectionIsEmpty(selection)) {
      return;
    }
    const selectedTokenId = selection?.anchorNode?.parentElement?.id;
    const currentToken = tokens.find((t) => t.tokenId === selectedTokenId);
    if (currentToken) {
      const startPosition = selection.anchorOffset;
      const endPosition = selection.focusOffset;
      const [selectionStart, selectionEnd] =
        startPosition < endPosition
          ? [startPosition, endPosition]
          : [endPosition, startPosition];

      const subtokens: Token[] = [
        {
          text: currentToken.text.slice(0, selectionStart),
          tokenId: `TA${Date.now()}`,
          offset: currentToken.offset,
        },
        {
          text: currentToken.text.slice(selectionStart, selectionEnd),
          tokenId: `TB${Date.now()}`,
          offset: currentToken.offset + selectionStart,
          labelName: "ORG",
        },
        {
          text: currentToken.text.slice(selectionEnd),
          tokenId: `TC${Date.now()}`,
          offset: currentToken.offset + selectionEnd,
        },
      ];
      setTokens(
        tokens
          .map((t) => (t.tokenId === currentToken.tokenId ? subtokens : t))
          .flat()
      );
      window.getSelection()?.empty();
    }
  };
  const onRemoveLabel = (tokenToRemove: Token) => {
    const tokenIndexToRemove = tokens.findIndex(
      (t) => t.tokenId === tokenToRemove.tokenId
    );
    const updatedTokens = [...tokens];
    const previousToken =
      tokenIndexToRemove > 0 ? updatedTokens[tokenIndexToRemove - 1] : null;
    const nextToken =
      tokenIndexToRemove < updatedTokens.length - 1
        ? updatedTokens[tokenIndexToRemove + 1]
        : null;
    const currentToken = {
      tokenId: tokenToRemove.tokenId,
      text: tokenToRemove.text,
      offset: tokenToRemove.offset,
    };

    if (previousToken && !previousToken.labelName) {
      currentToken.text = previousToken.text + currentToken.text;
      currentToken.offset = previousToken.offset;
      updatedTokens[tokenIndexToRemove - 1].tokenId = "REMOVE_TOKEN";
    }
    if (nextToken && !nextToken.labelName) {
      currentToken.text = currentToken.text + nextToken.text;
      updatedTokens[tokenIndexToRemove + 1].tokenId = "REMOVE_TOKEN";
    }
    updatedTokens[tokenIndexToRemove] = currentToken;
    setTokens(updatedTokens.filter((t) => t.tokenId !== "REMOVE_TOKEN"));
  };
  return (
    <div className={styles.container}>
      {tokens.map((token) =>
        token.labelName ? (
          <LabeledToken
            token={token}
            key={token.tokenId}
            onRemoveLabel={onRemoveLabel}
          />
        ) : (
          <span
            id={token.tokenId}
            key={token.tokenId}
            onMouseUp={onMouseUpCapture}
          >
            {token.text}
          </span>
        )
      )}
    </div>
  );
}

export default TextAnnotator;

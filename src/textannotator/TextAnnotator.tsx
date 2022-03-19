import * as React from "react";
import { plainText } from "./dummyText";
import LabeledToken from "./LabeledToken";
import { Token, AnnotationResult } from "./TextAnnotator.types";
import LabelSelector from "./LabelSelector";
import styles from "./TextAnnotator.module.css";
import { useState } from "@storybook/addons";

interface LabelSelectionModalState {
  isOpen: boolean;
  left?: number;
  top?: number;
  selectionStart?: number;
  selectionEnd?: number;
  selectedTokenId?: string;
}

function TextAnnotator(props: any) {
  const [value, setValue] = React.useState<AnnotationResult[]>([]);
  const [tokens, setTokens] = React.useState<Token[]>([
    {
      tokenId: `T${Date.now()}`,
      text: plainText,
      offset: 0,
    },
  ]);

  const [labelSelectionModal, setLabelSelectionModal] =
    React.useState<LabelSelectionModalState>({
      isOpen: false,
    });

  const [selectionChangeDebounce, setSelectionChangeDebounce] =
    React.useState<any>();

  React.useEffect(() => {
    document.onselectionchange = function (e) {
      if (selectionChangeDebounce) {
        clearTimeout(selectionChangeDebounce);
      }
      setSelectionChangeDebounce(setTimeout(onMouseUpCapture, 700));
    };
    return () => {
      document.onselectionchange = null;
    };
  });

  const selectionIsEmpty = (selection: Selection) => {
    if (selection?.focusNode) {
      const position = selection?.anchorNode?.compareDocumentPosition(
        selection.focusNode
      );
      return position === 0 && selection.focusOffset === selection.anchorOffset;
    }
    return true;
  };

  const addLabel = (labelName: string) => {
    const { selectedTokenId, selectionStart, selectionEnd } =
      labelSelectionModal;
    const currentToken = tokens.find((t) => t.tokenId === selectedTokenId);
    if (currentToken && selectionStart !== undefined && selectionEnd) {
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
          labelName,
        },
        {
          text: currentToken.text.slice(selectionEnd),
          tokenId: `TC${Date.now()}`,
          offset: currentToken.offset + selectionEnd,
        },
      ];
      closeModal();
      setValue([
        ...value,
        {
          tokenId: subtokens[1].tokenId,
          labelName,
          startPosition: subtokens[1].offset,
          endPosition: subtokens[1].offset + subtokens[1].text.length,
          text: subtokens[1].text,
        },
      ]);
      setTokens(
        tokens
          .map((t) => (t.tokenId === currentToken.tokenId ? subtokens : t))
          .flat()
      );
      window.getSelection()?.empty();
    }
  };
  const onMouseUpCapture = () => {
    const selection = window.getSelection() as Selection;
    if (
      selection.type !== "Range" ||
      selectionIsEmpty(selection) ||
      selection?.anchorNode?.parentElement?.className !== "validToken"
    ) {
      return;
    }
    const selectedTokenId = selection?.anchorNode?.parentElement?.id;
    const currentToken = tokens.find((t) => t.tokenId === selectedTokenId);
    if (!currentToken || currentToken?.labelName) {
      return;
    }
    const startPosition = selection.anchorOffset;
    const endPosition = selection.focusOffset;
    const [selectionStart, selectionEnd] =
      startPosition < endPosition
        ? [startPosition, endPosition]
        : [endPosition, startPosition];
    const range = selection.getRangeAt(0).cloneRange();
    const rects = range.getClientRects();
    if (rects.length > 0) {
      const leftPos = Math.round(rects[0].left + rects[0].width / 2);
      const topPos = Math.round(rects[0].top + rects[0].height / 2);
      setLabelSelectionModal({
        isOpen: true,
        left: leftPos,
        top: topPos,
        selectionStart,
        selectionEnd,
        selectedTokenId,
      });
    }
  };
  const closeModal = () => {
    setLabelSelectionModal({
      isOpen: false,
    });
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
    setValue(value.filter((v) => v.tokenId !== tokenToRemove.tokenId));
  };
  return (
    <div className={styles.container}>
      {labelSelectionModal.isOpen ? (
        <LabelSelector
          left={labelSelectionModal?.left}
          top={labelSelectionModal?.top}
          closeModal={closeModal}
          onSelectLabel={addLabel}
        />
      ) : null}
      <div className={styles.workArea}>
        {tokens.map((token) =>
          token.labelName ? (
            <LabeledToken
              token={token}
              key={token.tokenId}
              onRemoveLabel={onRemoveLabel}
            />
          ) : (
            <span id={token.tokenId} key={token.tokenId} className="validToken">
              {token.text}
            </span>
          )
        )}
      </div>
      <div className={styles.result}>{JSON.stringify(value, null, 2)}</div>
    </div>
  );
}

export default TextAnnotator;

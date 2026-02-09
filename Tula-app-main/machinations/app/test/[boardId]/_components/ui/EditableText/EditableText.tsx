import { useState, useRef, useEffect, memo } from "react";

import styles from "./EditableText.module.scss";

const EditableText = ({
  initialValue,
  onBlur,
}: {
  initialValue: string;
  onBlur: (value: string) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);

    if (value.trim() !== initialValue) {
      onBlur(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setIsEditing(false);

      if (value.trim() !== initialValue) {
        onBlur(value);
      }
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setValue(initialValue);
      setIsEditing(false);
    }
  };

  return (
    <div className={styles.editableContainer}>
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={styles.editableInput}
        />
      ) : (
        <div className={styles.editableText} onClick={handleClick}>
          {value}
        </div>
      )}
    </div>
  );
};

export default memo(EditableText);

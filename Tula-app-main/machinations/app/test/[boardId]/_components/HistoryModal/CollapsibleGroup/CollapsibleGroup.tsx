// components/CollapsibleGroup.tsx
import { useState } from "react";

import styles from "./CollapsibleGroup.module.scss";

type TCollapsibleGroupProps = {
  title: string;
  children: React.ReactNode;
};

export const CollapsibleGroup = ({
  title,
  children,
}: TCollapsibleGroupProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={styles.group}>
      <div className={styles.groupHeader} onClick={() => setIsOpen(!isOpen)}>
        <span>{title}</span>
        <span className={styles.toggleIcon}>{isOpen ? "▼" : "▶"}</span>
      </div>
      {isOpen && <div className={styles.groupContent}>{children}</div>}
    </div>
  );
};

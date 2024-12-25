"use client";

import { useState } from "react";

interface IToolTipProps {
  children: React.ReactNode;
  className?: string;
  content?: any;
}

const ToolTip: React.FunctionComponent<IToolTipProps> = ({
  children,
  className = "",
  content = "",
}) => {
  const [showToolTip, setShowToolTip] = useState(false);
  return (
    <span
      className="relative"
      onMouseEnter={() => setShowToolTip(true)}
      onMouseLeave={() => setShowToolTip(false)}
    >
      {children}
      {showToolTip && (
        <div
          className={`absolute left-0 z-10 w-64 max-w-sm rounded bg-neutral-800 p-2 text-sm text-neutral-50 shadow-lg dark:bg-neutral-300 dark:text-neutral-700${className}`}
        >
          {content}
        </div>
      )}
    </span>
  );
};

export default ToolTip;

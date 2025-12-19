import React from "react";

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

/**
 * 汎用セクションコンポーネント
 * fieldsetでグループ化し、legendでタイトルを表示
 */
export const Section: React.FC<SectionProps> = ({ title, children }) => (
  <fieldset style={{ marginTop: 8, padding: 8, width: "max-content" }}>
    <legend>{title}</legend>
    {children}
  </fieldset>
);

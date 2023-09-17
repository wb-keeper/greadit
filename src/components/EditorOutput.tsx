import { FC } from "react";
import dynamic from "next/dynamic";

const Output = dynamic(
  async () => (await import("editorjs-react-renderer")).default,
  { ssr: false }
);
interface EditorOutputProps {}

const EditorOutput: FC<EditorOutputProps> = () => {
  return <div className=""></div>;
};

export default EditorOutput;

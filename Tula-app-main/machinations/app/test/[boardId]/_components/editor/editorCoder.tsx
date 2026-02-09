"use client";

import { parseCodeToTemplate } from "@/app/services/parserCode";
import MonacoEditor from "@monaco-editor/react";
import { useState } from "react";
import styles from "./editor.module.scss";
import { useRenameModal } from "@/app/store/use-rename-modal";
import { ITemplate, generateSheme } from "@/app/services/generateSheme";
import { useGenerate } from "@/app/store/useBoardInfo";
import { useChangeEdgeType } from "@/app/store/use-custom-edge";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import useStore from "@/app/store/store";
import { parserToJson } from "@/app/services/parserToJson";

const EditorComponent = () => {
  const [code, setCode] = useState("");
  const { setIsVisisble } = useRenameModal();
  const { setDescription, description } = useGenerate();
  const { setTime, setGames, setIterations, iterations, games, time } =
    useAnimateScheme();
  const { generateNode, generateEdge, getNodesJson, getEdgesJson } = useStore();
  const { onChangeEdgesType, currentEdgesType } = useChangeEdgeType();

  const handleCodeChange = (newCode: any) => {
    setCode(newCode);
  };

  const handleBuildScheme = () => {
    const template: ITemplate | null = parseCodeToTemplate(code);
    generateSheme(
      template,
      setDescription,
      onChangeEdgesType,
      setGames,
      setIterations,
      setTime,
      generateNode,
      generateEdge
    );
  };

  const handleBuildJson = () => {
    const res = parserToJson(
      description,
      currentEdgesType,
      iterations,
      games,
      time,
      getNodesJson,
      getEdgesJson
    );
    setCode(res);
  };

  return (
    <div className="flex flex-col h-full">
      <MonacoEditor
        width={450}
        height="100%"
        defaultLanguage="json"
        theme="vs-dark"
        value={code}
        options={{ selectOnLineNumbers: true }}
        onChange={handleCodeChange}
      />
      <div className={styles.editor_btn}>
        <button
          onClick={() => {
            handleBuildScheme();
          }}
          className={styles.generate}
        >
          Generate
        </button>
        <button onClick={() => setCode("")} className={styles.reset}>
          Reset
        </button>
        <button onClick={handleBuildJson} className={styles.reset}>
          Build
        </button>
      </div>
    </div>
  );
};

export default EditorComponent;

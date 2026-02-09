import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect, useState } from "react";

interface CustomInputProps {
  label: string;
  initialValue: number;
}

const CustomInput = ({ label, initialValue }: CustomInputProps) => {
  const { setIterations, setTime, setGames } = useAnimateScheme();
  const [value, setValue] = useState<number>(initialValue);

  useEffect(() => {
    if (label === "Iterations") {
      setIterations(value);
    }
    if (label === "Time(s)") {
      setTime(value);
    }
    if (label === "Games") {
      setGames(value);
    }
  }, [value]);

  return (
    <div className="flex flex-col mx-1">
      <input
        className="w-12 text-sm text-center px-1 border border-black rounded"
        value={value}
        onChange={(e: any) => setValue(e.target.value)}
      />
      <label className="text-xs mt-1 text-center">{label}</label>
    </div>
  );
};

export default memo(CustomInput);

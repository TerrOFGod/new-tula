import { useCallback, useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";

type SaveHandlerOptions = {
  debounceDelay?: number;
  withAutoSaveOnUnmount?: boolean;
};

export const useSaveHandlerOnHotkeyKeydown = (
  saveFn: () => Promise<void>,
  options?: SaveHandlerOptions
) => {
  const { debounceDelay = 500, withAutoSaveOnUnmount = true } = options || {};

  const [isSaving, setIsSaving] = useState(false);
  const isMounted = useRef(true);

  // Дебаунс для частых изменений
  const debouncedAutoSave = useDebouncedCallback(
    async () => {
      if (isMounted.current) {
        await executeSave();
      }
    },
    debounceDelay,
    { leading: true, trailing: false }
  );

  const executeSave = useCallback(async () => {
    await saveFn();
  }, [saveFn]);

  // Обработчик сочетаний клавиш
  const handleKeyDown = useCallback(
    async (event: KeyboardEvent) => {
      const isKeyCombination =
        (event.ctrlKey || event.metaKey) && event.key === "s";

      if (isKeyCombination) {
        event.preventDefault();
        await executeSave();
      }
    },
    [executeSave]
  );

  // Подписка на события
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  // Автосохранение при размонтировании
  useEffect(() => {
    return () => {
      isMounted.current = false;

      if (withAutoSaveOnUnmount) {
        debouncedAutoSave.flush();
      }
    };
  }, []);

//   useEffect(() => {
//     const handleBeforeUnload = (e: BeforeUnloadEvent) => {
//       //   if (hasUnsavedChanges) {
//       e.preventDefault();
//       e.returnValue = "Есть несохраненные данные";
//       debouncedAutoSave.flush();
//       //   }
//     };

//     window.addEventListener("beforeunload", handleBeforeUnload);
//     return () => window.removeEventListener("beforeunload", handleBeforeUnload);
//   }, []);
};

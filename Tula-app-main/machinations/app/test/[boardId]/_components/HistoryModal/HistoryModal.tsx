"use client";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Panel } from "reactflow";
import { AArrowDown, AArrowUp, CalendarDays } from "lucide-react";
import { useConvex, useQuery } from "convex/react";
import { toast } from "sonner";
import { DiffEditor } from "@monaco-editor/react";
import { Switch } from "radix-ui";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import useStore from "@/app/store/store";
import { BoardStateData } from "@/app/types/history";
import { Input } from "@/components/ui/input";
import infoBoardStyles from "../BoardInfoModal/BoardInfoModal.module.scss";

import { CollapsibleGroup } from "./CollapsibleGroup";
import { HistoryItem } from "./HistoryItem";
import "./datepicker.css";
import styles from "./HistoryModal.module.scss";

interface IHistoryModalProps {
  boardId: string;
  onSaveRestoredVersion: (
    isRestore?: boolean,
    restoredVersionTime?: number,
    restoredVersionMessage?: string
  ) => void;
  onClose: () => void;
}

type BoardHistoryVersion = Doc<"boardsHistory">;
type GroupedHistory = Record<string, BoardHistoryVersion[]>;

type THistoryFiltersType = {
  search: string;
  dateRange: { start: Date | null; end: Date | null };
  groupByDate: boolean;
  groupByBase: boolean;
  sort: "asc" | "desc";
};

const DEFAULT_FILTERS: THistoryFiltersType = {
  search: "",
  dateRange: { start: null, end: null },
  groupByDate: true,
  groupByBase: false,
  sort: "asc",
};

export const HistoryModal: FC<IHistoryModalProps> = ({
  boardId,
  onSaveRestoredVersion,
  onClose,
}) => {
  const convex = useConvex();
  // const history = useQuery(api.boardsHistory.getBoardHistory, {
  //   boardId: boardId as Id<"boards">,
  // });

  const { currentVersion } = useStore();
  const [selectedVersionId, setSelectedVersionId] = useState<string>();
  const [currentVersionData, setCurrentVersionData] =
    useState<BoardStateData>();
  const [selectedVersionData, setSelectedVersionData] =
    useState<BoardStateData>();
  const [filters, setFilters] = useState<THistoryFiltersType>(DEFAULT_FILTERS);
  // const [compareMode, setCompareMode] = useState(false);

  const history = useQuery(api.boardsHistory.getBoardHistory, {
    boardId: boardId as Id<"boards">,
    searchQuery: filters.search,
    startDate: filters.dateRange.start?.getTime(),
    endDate: filters.dateRange.end?.getTime(),
    groupByBase: filters.groupByBase,
  });

  const getCurrentVersionData = useCallback(async () => {
    const boardVersion = await convex
      .query(api.boardsHistory.getVersionByNumber, {
        boardId: boardId as Id<"boards">,
        version: currentVersion,
      })
      .catch((error) => {
        console.error("Ошибка при получении id версии по номеру:", error);
      });

    try {
      const restoredVersion = await convex.query(
        api.boardsHistory.restoreVersion,
        {
          versionId: boardVersion?._id as Id<"boardsHistory">,
        }
      );

      setCurrentVersionData(restoredVersion);
    } catch (error) {
      toast.error("Ошибка при восстановлении версии в истории");
    }
  }, [boardId, convex, currentVersion]);

  useEffect(() => {
    getCurrentVersionData();
  }, [getCurrentVersionData]);

  const handleShowDiff = useCallback(
    async (versionId: Id<"boardsHistory">) => {
      try {
        const restoredVersion = await convex.query(
          api.boardsHistory.restoreVersion,
          {
            versionId: versionId,
          }
        );

        setSelectedVersionData(restoredVersion);
      } catch (error) {
        toast.error("Ошибка при восстановлении версии в истории");
      }
    },
    [convex]
  );

  const onItemClick = useCallback(
    async (versionId: Id<"boardsHistory">) => {
      setSelectedVersionId(
        selectedVersionId === versionId ? undefined : versionId
      );
      await handleShowDiff(versionId);
    },
    [handleShowDiff, selectedVersionId]
  );

  const isDateInRange = useCallback((date: Date) => {
    const currentDate = new Date();

    return date < currentDate;
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedVersionId) {
        setSelectedVersionId(undefined);
        setSelectedVersionData(undefined);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedVersionId]);

  const groupedHistory = useMemo(() => {
    if (filters.groupByBase && history?.grouped) {
      return Object.entries(history.grouped)
        .sort(([a], [b]) =>
          filters.sort === "asc" ? Number(a) - Number(b) : Number(b) - Number(a)
        )
        .map(([baseVersion, versions]) => (
          <CollapsibleGroup
            key={baseVersion}
            title={`Base Version: ${baseVersion}`}
          >
            {versions
              .sort((a, b) =>
                filters.sort === "asc"
                  ? a.version - b.version
                  : b.version - a.version
              )
              .map((version) => (
                <HistoryItem
                  key={version._id}
                  boardId={boardId}
                  version={version}
                  isSelected={selectedVersionId === version._id}
                  onClick={onItemClick}
                  onSaveRestoredVersion={onSaveRestoredVersion}
                />
              ))}
          </CollapsibleGroup>
        ));
    }

    const groupedByDateHistory = history?.results.reduce((acc, version) => {
      const date = new Date(version._creationTime).toLocaleDateString();

      if (!acc[date]) {
        acc[date] = [];
      }

      acc[date].push(version);

      return acc;
    }, {} as GroupedHistory);

    return Object.entries(groupedByDateHistory || {})
      .sort(([a], [b]) => {
        const [dayA, monthA, yearA] = a.split(".").map(Number);
        const dateA = new Date(yearA, monthA - 1, dayA).getTime();

        if (isNaN(dateA)) {
          throw new Error("Invalid date");
        }

        const [dayB, monthB, yearB] = b.split(".").map(Number);
        const dateB = new Date(yearB, monthB - 1, dayB).getTime();

        // 3. Проверка корректности даты
        if (isNaN(dateB)) {
          throw new Error("Invalid date");
        }

        return filters.sort === "asc" ? dateA - dateB : dateB - dateA;
      })
      .map(([date, versions]) => (
        <CollapsibleGroup key={date} title={date}>
          {versions
            .sort((a, b) =>
              filters.sort === "asc"
                ? a._creationTime - b._creationTime
                : b._creationTime - a._creationTime
            )
            .map((version) => (
              <HistoryItem
                key={version._id}
                boardId={boardId}
                version={version}
                isSelected={selectedVersionId === version._id}
                onClick={onItemClick}
                onSaveRestoredVersion={onSaveRestoredVersion}
              />
            ))}
        </CollapsibleGroup>
      ));
  }, [
    filters.groupByBase,
    filters.sort,
    history?.grouped,
    history?.results,
    boardId,
    selectedVersionId,
    onItemClick,
    onSaveRestoredVersion,
  ]);

  return (
    <>
      <div className={styles.historySidebar}>
        <div className={styles.header}>
          <h4 className={styles.title}>Version history</h4>
          <button className={infoBoardStyles.closeButton} onClick={onClose}>
            &#x2716;
          </button>
        </div>
        <div className={styles.filters}>
          <Input
            className={styles.searchInput}
            placeholder="Search by message... 🔎"
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
            maxLength={50}
          />
          <div className={styles.datePickerLabel}>Filter by date:</div>
          <DatePicker
            wrapperClassName={styles.datePickerInput}
            selected={filters.dateRange.start}
            startDate={filters.dateRange.start}
            endDate={filters.dateRange.end}
            onChange={(update) =>
              setFilters((prev) => ({
                ...prev,
                dateRange: { start: update[0], end: update[1] },
              }))
            }
            filterDate={isDateInRange}
            placeholderText="dd/mm/yyyy - dd/mm/yyyy"
            icon={<CalendarDays />}
            showIcon
            selectsRange
            isClearable
          />
          <div className={styles.switchWrapper}>
            <label className={styles.switchLabel} htmlFor="grouped-mode">
              Group by Base Snapshot
            </label>
            <Switch.Root
              className={styles.switch}
              id="grouped-mode"
              checked={filters.groupByBase}
              onCheckedChange={(checked: boolean) => {
                setFilters((prev) => ({
                  ...prev,
                  groupByBase: checked,
                  groupByDate: !checked,
                }));
              }}
            >
              <Switch.Thumb className={styles.switchThumb} />
            </Switch.Root>
            <div
              className={styles.sortType}
              onClick={() => {
                setFilters((prev) => ({
                  ...prev,
                  sort: prev.sort === "asc" ? "desc" : "asc",
                }));
              }}
            >
              {filters.sort === "asc" ? <AArrowDown /> : <AArrowUp />}
            </div>
          </div>
        </div>
        <div className={styles.content}>
          {!history && (
            <div className={styles.spinnerWrapper}>
              <div className={styles.spinner} />
            </div>
          )}
          <div className={styles.revisionsList}>{groupedHistory}</div>
        </div>
      </div>
      {selectedVersionId && (
        <Panel position="top-left" className="vesrsions-diff_panel">
          <DiffEditor
            height="600px"
            original={JSON.stringify(currentVersionData, null, 2)}
            modified={JSON.stringify(selectedVersionData, null, 2)}
            language="json"
            className={styles.diffEditor}
          />
        </Panel>
      )}
    </>
  );
};

export default HistoryModal;

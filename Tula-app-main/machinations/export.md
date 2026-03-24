# Project Structure

```
.next/
app/
  (dashboard)/
    _components/
      board-card/
        footer.tsx
        index.tsx
      sidebar/
        button.tsx
        index.tsx
        item.tsx
        list.tsx
      board-list.tsx
      empty-board.tsx
      empty-org.tsx
      invite-button.tsx
      navbar.tsx
      new-board-button.tsx
      org-sidebar.tsx
      search-input.tsx
    layout.tsx
    page.tsx
  api/
    liveblocks-auth/
      route.ts
  board/
    [boardId]/
      _components/
        _layer-components.tsx/
          connector/
            connector.tsx
          edge.tsx
          ellipse.tsx
          note.tsx
          path.tsx
          rectangle.tsx
          text.tsx
          triangle.tsx
        canvas.tsx
        color-picker.tsx
        cursor.tsx
        cursors-presence.tsx
        info.tsx
        layer-preview.tsx
        participants.tsx
        selection-box.tsx
        selection-tools.tsx
        tool-button.tsx
        toolbar.tsx
        user-avatar.tsx
      page.tsx
  hooks/
    use-api-mutation.ts
    use-delete-layers.ts
    use-disable-scroll-bounce.ts
    use-selection-bounds.ts
    useInitializeBoard.ts
    useRestoreVersionHandler.tsx
    useSaveHandlerOnKeydown.ts
    useVersionsHistory.ts
  services/
    generateSheme.ts
    parserCode.ts
    parserToJson.ts
  store/
    store.ts
    use-animate-scheme.tsx
    use-custom-edge.tsx
    use-node-details.ts
    use-rename-modal.tsx
    useBoardInfo.tsx
  test/
    [boardId]/
      _components/
        _structs/
          edgeComponents/
            conditional-edge.tsx
            custom-edge.tsx
            modifier-edge.tsx
            probabilistic-edge.tsx
            trigger-edge.tsx
          nodeComponents/
            specNodes/
              entityNode.tsx
              eventNode.tsx
              operatorNode.tsx
              ruleNode.tsx
              stateNode.tsx
            tulaNodes/
              consumerNode.tsx
              converterNode.tsx
              delayNode.tsx
              endNode.tsx
              gateNode.tsx
              poolNode.tsx
              randomNode.tsx
              sourceNode.tsx
              triggerNode.tsx
            emptyNode.tsx
            nodeStyle.css
            styled-node.tsx
          custom-node.tsx
        BoardInfoModal/
          BoardInfoModal.module.scss
          BoardInfoModal.tsx
          BoardTitle.tsx
        editor/
          editor.module.scss
          editorCoder.tsx
        HistoryModal/
          CollapsibleGroup/
            CollapsibleGroup.module.scss
            CollapsibleGroup.tsx
            index.ts
          HistoryItem/
            HistoryItem.module.scss
            HistoryItem.tsx
            index.ts
          datepicker.css
          HistoryModal.module.scss
          HistoryModal.tsx
          index.ts
        metrics/
          chart.tsx
          chartCard.tsx
          circleChart.tsx
          metrics.tsx
          metricsData.tsx
        panels/
          bottom-panel.tsx
          EdgeTypePanel.tsx
          toolbar.tsx
        sidebar/
          sidebar-board.tsx
        ui/
          EditableText/
            EditableText.module.scss
            EditableText.tsx
            index.ts
          CustomInput.tsx
          DownloadBtn.tsx
          index.ts
          ToolButton.tsx
        context-menu.tsx
        cursor.tsx
        flow.tsx
        games.tsx
        iterations.tsx
      layout.tsx
      page.tsx
      rahmankulova.md
      style-test.css
  types/
    canvas.ts
    history.ts
    structs.ts
  favicon.ico
  globals.css
  layout.tsx
components/
  modals/
    rename-modal.tsx
  ui/
    alert-dialog.tsx
    avatar.tsx
    button.tsx
    card.tsx
    dialog.tsx
    dropdown-menu.tsx
    input.tsx
    label.tsx
    scroll-area.tsx
    select.tsx
    separator.tsx
    sonner.tsx
    tabs.tsx
    textarea.tsx
    tooltip.tsx
  actions.tsx
  confirm-modal.tsx
  hint.tsx
  loading.tsx
  NodeDetailsPanel.tsx
  room.tsx
convex/
  _generated/
    api.d.ts
    api.js
    dataModel.d.ts
    server.d.ts
    server.js
  validators/
    boardData.ts
  auth.config.ts
  board.ts
  boards.ts
  boardsHistory.ts
  README.md
  schema.ts
providers/
  convex-client-provider.tsx
  modal-provider.tsx
public/
  placeholders/
utils/
  adapters.ts
  canvas.ts
  jsonDiff.ts
  math.ts
.export-ignore
.gitignore
export.md
liveblocks.config.ts
middleware.ts
next.config.mjs
postcss.config.js
rahmankulova.md
README.md
tailwind.config.ts
```


## app\(dashboard)\_components\board-card\footer.tsx

```tsx
import { Star } from "lucide-react";

import { cn } from "@/utils/canvas";

interface FooterProps {
  title: string;
  authorLabel: string;
  createdAtLabel: string;
  isFavorite: boolean;
  onClick: () => void;
  disabled: boolean;
}

export const Footer = ({
  title,
  authorLabel,
  createdAtLabel,
  isFavorite,
  onClick,
  disabled,
}: FooterProps) => {
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();
    event.preventDefault();

    onClick();
  };

  return (
    <div className="relative bg-white p-2">
      <p className="text-[13px] truncate ">{title}</p>
      <p className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] text-muted-foreground truncate">
        {authorLabel}, {createdAtLabel}
      </p>
      <button
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          "opacity-0 group-hover:opacity-100 transition absolute top-3 right-3 text-muted-foreground hover:text-blue-600",
          disabled && "cursor-not-allowed opacity-75"
        )}
      >
        <Star
          className={cn("h-4 w-4", isFavorite && "fill-blue-600 text-blue-600")}
        />
      </button>
    </div>
  );
};
```


## app\(dashboard)\_components\board-card\index.tsx

```tsx
"use client";

import { formatDistanceToNow } from "date-fns";

import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";
import { MoreHorizontal } from "lucide-react";
import { Footer } from "./footer";
import { Actions } from "@/components/actions";
import { useApiMutation } from "@/app/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";

export interface BoardCardProps {
  id: string;
  title: string;
  authorName: string;
  authorId: string;
  createdAt: number;
  imageUrl: string;
  orgId: string;
  isFavorite: boolean;
}

export const BoardCard = ({
  id,
  title,
  authorId,
  authorName,
  createdAt,
  imageUrl,
  orgId,
  isFavorite,
}: BoardCardProps) => {
  const { userId } = useAuth();

  const authorLabel = userId === authorId ? "You" : authorName;
  const createdAtLabel = formatDistanceToNow(createdAt, {
    addSuffix: true,
  });

  const { mutate: onFavorite, pending: pendingFavorite } = useApiMutation(
    api.board.favorite
  );
  const { mutate: onUnfavorite, pending: pendingUnfavorite } = useApiMutation(
    api.board.unfavorite
  );

  const toggleFavorite = () => {
    if (isFavorite) {
      onUnfavorite({ id }).catch(() => toast.error("Failed to unfavorite"));
    } else {
      onFavorite({ id, orgId }).catch(() => toast.error("Failed to favorite"));
    }
  };

  return (
    <Link href={`/test/${id}`}>
      <div className="group aspect-[100/130] border rounded-lg flex flex-col justify-between overflow-hidden">
        <div className="relative flex-1 bg-amber-50">
          <Image src={imageUrl} alt={title} fill className="object-fit" />
          <Actions id={id} title={title} side="right">
            <button className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-2 outline-none">
              <MoreHorizontal className="text-white opacity-75 hover:opacity-100 transition-opacity" />
            </button>
          </Actions>
        </div>
        <Footer
          isFavorite={isFavorite}
          title={title}
          authorLabel={authorLabel}
          createdAtLabel={createdAtLabel}
          onClick={toggleFavorite}
          disabled={pendingFavorite || pendingUnfavorite}
        />
      </div>
    </Link>
  );
};
```


## app\(dashboard)\_components\sidebar\button.tsx

```tsx
"use client";
import { Hint } from "@/components/hint";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CreateOrganization } from "@clerk/nextjs";
import { Plus } from "lucide-react";

export const Button = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="aspect-square">
          <Hint
            label="Create organization"
            side="right"
            align="start"
            sideOffset={18}
          >
            <button
              className="bg-white/25 h-full w-full rounded-md
           flex items-center justify-center opacity-60 hover:opacity-100 transition"
            >
              <Plus className="text-white" />
            </button>
          </Hint>
        </div>
      </DialogTrigger>
      <DialogContent className="p-0 bg-transparent border-none max-w-[480px]">
        <CreateOrganization />
      </DialogContent>
    </Dialog>
  );
};
```


## app\(dashboard)\_components\sidebar\index.tsx

```tsx
import { Button } from "./button";
import { List } from "./list";

export const Sidebar = () => {
  return (
    <aside className="fixed z-[1] left-0 bg-blue-950 h-full w-[70px] flex p-3 flex-col gap-y-4 text-white">
      <List />
      <Button />
    </aside>
  );
};
```


## app\(dashboard)\_components\sidebar\item.tsx

```tsx
"use client";

import Image from "next/image";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { cn } from "@/utils/canvas";
import { Hint } from "@/components/hint";

interface ItemProps {
  id: string;
  name: string;
  imageUrl: string;
}

export const Item = ({ id, name, imageUrl }: ItemProps) => {
  const { organization } = useOrganization();
  const { setActive } = useOrganizationList();

  const isActive = organization?.id === id;

  const onClick = () => {
    if (!setActive) return;

    setActive({ organization: id });
  };

  return (
    <div className="aspect-square relative">
      <Hint label={name} side="right" align="start" sideOffset={18}>
        <Image
          fill
          alt={name}
          src={imageUrl}
          onClick={onClick}
          className={cn(
            "rounded-md cursor-pointer opacity-75 hover:opacity-100 transition",
            isActive && "opacity-100"
          )}
        />
      </Hint>
    </div>
  );
};
```


## app\(dashboard)\_components\sidebar\list.tsx

```tsx
"use client";

import { useOrganizationList } from "@clerk/nextjs";
import { Item } from "./item";

export const List = () => {
  const { userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  if (!userMemberships.data?.length) return null;

  return (
    <ul className="space-y-4">
      {userMemberships.data?.map((member) => (
        <Item
          key={member.organization.id}
          id={member.organization.id}
          name={member.organization.name}
          imageUrl={member.organization.imageUrl}
        />
      ))}
    </ul>
  );
};
```


## app\(dashboard)\_components\board-list.tsx

```tsx
"use client";

import { EmptyBoard } from "./empty-board";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BoardCard } from "./board-card";
import { NewBoardButton } from "./new-board-button";

interface BoardListProps {
  orgId: string;
  query: {
    search?: string;
    favorites?: string;
  };
}

export const BoardList = ({ orgId, query }: BoardListProps) => {
  const data = useQuery(api.boards.get, {
    orgId,
    ...query,
  });

  if (data === undefined) {
    return <div>Loading...</div>;
  }

  if (!data?.length && query.search) {
    return <div>Try searching for something else</div>;
  }

  if (!data?.length && query.favorites) {
    return <div>No favorites</div>;
  }

  if (!data?.length) {
    return <EmptyBoard />;
  }

  return (
    <div>
      <h2 className="text-3xl">
        {query.favorites ? "Favorite boards" : "Team boards"}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
        <NewBoardButton orgId={orgId} />
        {data?.map((board: any) => (
          <BoardCard
            key={board._id}
            id={board._id}
            title={board.title}
            imageUrl={board.imageUrl}
            authorId={board.authorId}
            authorName={board.authorName}
            createdAt={board._creationTime}
            orgId={board.orgId}
            isFavorite={board.isFavorite}
          />
        ))}
      </div>
    </div>
  );
};
```


## app\(dashboard)\_components\empty-board.tsx

```tsx
"use client";

import { useRouter } from "next/navigation";
import { useOrganization } from "@clerk/nextjs";

import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";

import { useApiMutation } from "@/app/hooks/use-api-mutation";
import { toast } from "sonner";

export const EmptyBoard = () => {
  const router = useRouter();
  const { organization } = useOrganization();
  const { mutate, pending } = useApiMutation(api.board.create);

  const onClick = () => {
    if (!organization) return;

    mutate({
      orgId: organization.id,
      title: "Untitled",
    })
      .then((orgId) => {
        toast.success("Board created");
        router.push(`/test/${orgId}`);
      })
      .catch(() => toast.error("Failed to create"));
  };

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="text-xl font-semibold">Empty now</div>
      <h2 className="text-2xl font-semibold mt-6">Create your first board!</h2>
      <p className="text-muted-foreground text-sm mt-2">
        Start by creating a board for your organization
      </p>
      <div className="mt-6">
        <Button disabled={pending} onClick={onClick} size="lg">
          Create board
        </Button>
      </div>
    </div>
  );
};
```


## app\(dashboard)\_components\empty-org.tsx

```tsx
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreateOrganization } from "@clerk/nextjs";

export const EmptyOrganization = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Image src="/cover.png" alt="Empty" height={200} width={200} />
      <h2 className="text-2xl font-semibold mt-6">Welcome to Board</h2>
      <p className="text-muted-foreground text-sm mt-2">
        Create an organization to get started
      </p>
      <div className="mt-6">
        <Dialog>
          <DialogTrigger asChild>
            <Button size="lg">Create organization</Button>
          </DialogTrigger>
          <DialogContent className="p-0 bg-transparent border-none max-w-[480px]">
            <CreateOrganization />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
```


## app\(dashboard)\_components\invite-button.tsx

```tsx
"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { OrganizationProfile } from "@clerk/nextjs";
import { Plus } from "lucide-react";

export const InviteButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Invite members
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 bg-transparent border-none max-w-[880px]">
        <OrganizationProfile />
      </DialogContent>
    </Dialog>
  );
};
```


## app\(dashboard)\_components\navbar.tsx

```tsx
"use client";

import {
  OrganizationSwitcher,
  UserButton,
  useOrganization,
} from "@clerk/nextjs";
import { SearchInput } from "./search-input";
import { InviteButton } from "./invite-button";

export const Navbar = () => {
  const { organization } = useOrganization();

  return (
    <div className="flex items-center gap-x-4 p-5 bg-white">
      <div className="hidden lg:flex lg:flex-1">
        <SearchInput />
      </div>
      <div className="block lg:hidden flex-1">
        <OrganizationSwitcher
          hidePersonal
          appearance={{
            elements: {
              rootBox: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                maxWidth: "376px",
              },
              organizationSwitcherTrigger: {
                padding: "6px",
                width: "100%",
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                justifyContent: "space-between",
                backgroundColor: "white",
              },
            },
          }}
        />
      </div>
      {organization && <InviteButton />}
      <UserButton />
    </div>
  );
};
```


## app\(dashboard)\_components\new-board-button.tsx

```tsx
"use client";

import { toast } from "sonner";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { cn } from "@/utils/canvas";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/app/hooks/use-api-mutation";

interface NewBoardButtonProps {
  orgId: string;
  disabled?: boolean;
}

export const NewBoardButton = ({ orgId, disabled }: NewBoardButtonProps) => {
  const router = useRouter();
  const { mutate, pending } = useApiMutation(api.board.create);

  const onClick = () => {
    mutate({
      orgId,
      title: "Untitled",
    })
      .then((id) => {
        toast.success("Board created");
        router.push(`/test/${id}`);
      })
      .catch(() => toast.error("Failed to create board"));
  };

  return (
    <button
      disabled={pending || disabled}
      onClick={onClick}
      className={cn(
        "col-span-1 aspect-[100/130] bg-blue-600 rounded-lg hover:bg-blue-800 flex flex-col items-center justify-center py-6",
        (pending || disabled) &&
          "opacity-75 hover:bg-blue-600 cursor-not-allowed"
      )}
    >
      <div />
      <Plus className="h-12 w-12 text-white stroke-1" />
      <p className="text-sm text-white font-light">Create new board</p>
    </button>
  );
};
```


## app\(dashboard)\_components\org-sidebar.tsx

```tsx
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils/canvas";
import { OrganizationSwitcher } from "@clerk/nextjs";
import { LayoutDashboard, Star } from "lucide-react";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export const OrgSidebar = () => {
  const searchParams = useSearchParams();
  const favorites = searchParams.get("favorites");

  return (
    <div className="hidden lg:flex flex-col space-y-6 w-[206px] pl-5 pt-5">
      <Link href="/">
        <div className="flex items-center gap-x-2">
          <span className={cn("font-semibold text-2xl", font.className)}>
            Dashboard
          </span>
        </div>
      </Link>
      <OrganizationSwitcher
        hidePersonal
        appearance={{
          elements: {
            rootBox: {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            },
            organizationSwitcherTrigger: {
              padding: "6px",
              width: "100%",
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
              justifyContent: "space-between",
              backgroundColor: "white",
            },
          },
        }}
      />
      <div className="space-y-1 w-full">
        <Button
          variant={favorites ? "ghost" : "secondary"}
          asChild
          size="lg"
          className="font-normal justify-start px-2 w-full"
        >
          <Link href="/">
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Team boards
          </Link>
        </Button>
        <Button
          variant={favorites ? "secondary" : "ghost"}
          asChild
          size="lg"
          className="font-normal justify-start px-2 w-full"
        >
          <Link
            href={{
              pathname: "/",
              query: { favorites: true },
            }}
          >
            <Star className="h-4 w-4 mr-2" />
            Favorite boards
          </Link>
        </Button>
      </div>
    </div>
  );
};
```


## app\(dashboard)\_components\search-input.tsx

```tsx
"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, ChangeEvent } from "react";

import qs from "query-string";
import { useDebounce } from "usehooks-ts";

export const SearchInput = () => {
  const router = useRouter();
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value, 500); //MAYBE its not work? need reaserching

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: "/",
        query: {
          search: debouncedValue,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );
    router.push(url);
  }, [debouncedValue, router]);

  return (
    <div className="w-full relative">
      <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        className="w-full max-w-[516px] pl-9"
        placeholder="Search boards"
        onChange={handleChange}
        value={value}
      />
    </div>
  );
};
```


## app\(dashboard)\layout.tsx

```tsx
import { Navbar } from "./_components/navbar";
import { OrgSidebar } from "./_components/org-sidebar";
import { Sidebar } from "./_components/sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <main className="h-full">
      <Sidebar />
      <div className="pl-[60px] h-full">
        <div className="flex gap-x-3 h-full">
          <OrgSidebar />
          <div className="h-full flex-1">
            <Navbar />
            {children}
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardLayout;
```


## app\(dashboard)\page.tsx

```tsx
"use client";

import { BoardList } from "./_components/board-list";
import { EmptyOrganization } from "./_components/empty-org";
import { useOrganization } from "@clerk/nextjs";

interface DashboardPageProps {
  searchParams: {
    search?: string;
    favorites?: string;
  };
}

const DashboardPage = ({ searchParams }: DashboardPageProps) => {
  const { organization } = useOrganization();

  return (
    <div className="flex-1 h-[calc(100%-80px)] p-6">
      {!organization ? (
        <EmptyOrganization />
      ) : (
        <BoardList orgId={organization.id} query={searchParams} />
      )}
    </div>
  );
};

export default DashboardPage;
```


## app\api\liveblocks-auth\route.ts

```ts
import { auth, currentUser } from "@clerk/nextjs";
import { Liveblocks } from "@liveblocks/node";
import { ConvexHttpClient } from "convex/browser";

import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const liveblocks = new Liveblocks({
  secret: process.env.NEXT_PUBLIC_LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(request: Request) {
  const authorization = await auth();
  const user = await currentUser();

  if (!authorization || !user) {
    return new Response("Unauthorized", { status: 403 });
  }

  const { room } = await request.json();
  const board = await convex.query(api.board.get, { id: room });

  if (board?.orgId !== authorization.orgId) {
    return new Response("Unauthorized", { status: 403 });
  }

  const userInfo = {
    name: user.firstName || "Teammeate",
    picture: user.imageUrl,
  };

  const session = liveblocks.prepareSession(user.id, { userInfo });

  if (room) {
    session.allow(room, session.FULL_ACCESS);
  }

  const { status, body } = await session.authorize();
  return new Response(body, { status });
}
```


## app\board\[boardId]\_components\_layer-components.tsx\connector\connector.tsx

```tsx
"use client";
import { ArrowLayer } from "@/app/types/canvas";
import { colorToCss } from "@/utils/canvas";

interface RectangleProps {
  id: string;
  layer: ArrowLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

const Connector = ({
  id,
  layer,
  onPointerDown,
  selectionColor,
}: RectangleProps) => {
  const { x, y, width, height, fill } = layer;
  return (
    <svg>
      <line
        className="drop-shadow-md"
        onPointerDown={(e) => onPointerDown(e, id)}
        x1={x}
        y1={y + height / 2}
        x2={x + width}
        y2={y + height / 2}
        strokeWidth={2}
        stroke={selectionColor || "#000"}
      />
      {/* <rect
        className="drop-shadow-md"
        onPointerDown={(e) => onPointerDown(e, id)}
        style={{
          transform: `translate(${x}px, ${y}px)`,
        }}
        x={0}
        y={height / 2}
        width={width - 3}
        height={2}
        strokeWidth={2}
        fill={fill ? colorToCss(fill) : "#000"}
        stroke={selectionColor || "#000"}
      /> */}
      <polygon
        className="drop-shadow-md"
        onPointerDown={(e) => onPointerDown(e, id)}
        points={`${x + width - 10},${y + height / 2 - 5} ${x + width - 10},${
          y + height / 2 + 5
        } ${x + width + 2},${y + height / 2}`}
        strokeWidth={1}
        fill={fill ? colorToCss(fill) : "#000"}
        stroke={selectionColor || "#000"}
      />
    </svg>
  );
};

export default Connector;
```


## app\board\[boardId]\_components\_layer-components.tsx\edge.tsx

```tsx
import { EllipseLayer } from "@/app/types/canvas";
import { colorToCss } from "@/utils/canvas";
import { CSSProperties } from "react";

interface EdgeProps {
  id: string;
  layer: EllipseLayer;
  sourceId: string,
  targetId: string,
  inputValue: string,
  animated?: () => void,
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
  style?: CSSProperties;
  deletable?: boolean;
  selected?: boolean;
}

export const Edge = ({
  id,
  layer,
  onPointerDown,
  selectionColor,
}: EdgeProps) => {
  return (
    <ellipse
      className="drop-shadow-md"
      onPointerDown={(e) => onPointerDown(e, id)}
      style={{
        transform: `translate(
          ${layer.x}px,
          ${layer.y}px
        )`,
      }}
      cx={layer.width / 2}
      cy={layer.height / 2}
      rx={layer.width / 2}
      ry={layer.height / 2}
      fill={layer.fill ? colorToCss(layer.fill) : "#000"}
      stroke={selectionColor || "transparent"}
      strokeWidth="1"
    />
  );
};
```


## app\board\[boardId]\_components\_layer-components.tsx\ellipse.tsx

```tsx
import { EllipseLayer } from "@/app/types/canvas";
import { colorToCss } from "@/utils/canvas";

interface EllipseProps {
  id: string;
  layer: EllipseLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

export const Ellipse = ({
  id,
  layer,
  onPointerDown,
  selectionColor,
}: EllipseProps) => {
  return (
    <ellipse
      className="drop-shadow-md"
      onPointerDown={(e) => onPointerDown(e, id)}
      style={{
        transform: `translate(
          ${layer.x}px,
          ${layer.y}px
        )`,
      }}
      cx={layer.width / 2}
      cy={layer.height / 2}
      rx={layer.width / 2}
      ry={layer.height / 2}
      fill={layer.fill ? colorToCss(layer.fill) : "#000"}
      stroke={selectionColor || "transparent"}
      strokeWidth="1"
    />
  );
};
```


## app\board\[boardId]\_components\_layer-components.tsx\note.tsx

```tsx
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { colorToCss } from "@/utils/canvas";
import { useMutation } from "@/liveblocks.config";
import { Color, NoteLayer } from "@/app/types/canvas";

const getContrastingTextColor = (color: Color) => {
  const luminance = 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;
  return luminance > 182 ? "black" : "white";
};

const calculateFontSize = (width: number, height: number) => {
  const maxFontSize = 96;
  const scaleFactor = 0.15;
  const fontSizeBasedOnHeight = height * scaleFactor;
  const fontSizeBasedOnWidth = width * scaleFactor;

  return Math.min(fontSizeBasedOnHeight, fontSizeBasedOnWidth, maxFontSize);
};

interface NoteProps {
  id: string;
  layer: NoteLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

export const Note = ({
  layer,
  onPointerDown,
  id,
  selectionColor,
}: NoteProps) => {
  const { x, y, width, height, fill, value } = layer;

  const updateValue = useMutation(({ storage }, newValue: string) => {
    const liveLayers = storage.get("layers");

    liveLayers.get(id)?.set("value", newValue);
  }, []);

  const handleContentChange = (e: ContentEditableEvent) => {
    updateValue(e.target.value);
  };

  return (
    <foreignObject
      x={x}
      y={y}
      width={width}
      height={height}
      onPointerDown={(e) => onPointerDown(e, id)}
      style={{
        outline: selectionColor ? `1px solid ${selectionColor}` : "none",
        backgroundColor: fill ? colorToCss(fill) : "#000",
      }}
      className="shadow-md drop-shadow-xl"
    >
      <ContentEditable
        html={value || "Text"}
        onChange={handleContentChange}
        className="h-full w-full flex items-center justify-center text-center outline-none"
        style={{
          fontSize: calculateFontSize(width, height),
          color: fill ? getContrastingTextColor(fill) : "#000",
        }}
      />
    </foreignObject>
  );
};
```


## app\board\[boardId]\_components\_layer-components.tsx\path.tsx

```tsx
import getStroke from "perfect-freehand";

import { getSvgPathFromStroke } from "@/utils/canvas";

interface PathProps {
  x: number;
  y: number;
  points: number[][];
  fill: string;
  onPointerDown?: (e: React.PointerEvent) => void;
  stroke?: string;
}

export const Path = ({
  x,
  y,
  points,
  fill,
  onPointerDown,
  stroke,
}: PathProps) => {
  return (
    <path
      className="drop-shadow-md"
      onPointerDown={onPointerDown}
      d={getSvgPathFromStroke(
        getStroke(points, {
          size: 16,
          thinning: 0.5,
          smoothing: 0.5,
          streamline: 0.5,
        })
      )}
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
      x={0}
      y={0}
      fill={fill}
      stroke={stroke}
      strokeWidth={1}
    />
  );
};
```


## app\board\[boardId]\_components\_layer-components.tsx\rectangle.tsx

```tsx
import { RectangleLayer } from "@/app/types/canvas";
import { colorToCss } from "@/utils/canvas";

interface RectangleProps {
  id: string;
  layer: RectangleLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

export const Rectangle = ({
  id,
  layer,
  onPointerDown,
  selectionColor,
}: RectangleProps) => {
  const { x, y, width, height, fill } = layer;

  return (
    // <rect
    //   className="drop-shadow-md"
    //   onPointerDown={(e) => onPointerDown(e, id)}
    //   style={{
    //     transform: `translate(${x}px, ${y}px)`,
    //   }}
    //   x={0}
    //   y={0}
    //   width={width}
    //   height={height}
    //   strokeWidth={1}
    //   fill={fill ? colorToCss(fill) : "#000"}
    //   stroke={selectionColor || "#000"}
    // />
    <svg>
      <rect
        className="drop-shadow-md"
        onPointerDown={(e) => onPointerDown(e, id)}
        style={{
          transform: `translate(${x}px, ${y}px)`,
        }}
        x={0}
        y={0}
        width={width}
        height={height}
        strokeWidth={1}
        fill={fill ? colorToCss(fill) : "#000"}
        stroke={selectionColor || "#000"}
      />
      {/* <text
        x={x + width / 2} // x-координата центра текста
        y={y + height / 2} // y-координата центра текста
        dominantBaseline="middle" // Выравнивание текста по вертикали
        textAnchor="middle" // Выравнивание текста по горизонтали
        fill="#fff" // Цвет текста
        fontSize="16" // Размер шрифта
      >
        Ваш текст
      </text> */}
    </svg>
  );
};
```


## app\board\[boardId]\_components\_layer-components.tsx\text.tsx

```tsx
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";

import { colorToCss } from "@/utils/canvas";
import { useMutation } from "@/liveblocks.config";
import { TextLayer } from "@/app/types/canvas";

const calculateFontSize = (width: number, height: number) => {
  const maxFontSize = 96;
  const scaleFactor = 0.5;
  const fontSizeBasedOnHeight = height * scaleFactor;
  const fontSizeBasedOnWidth = width * scaleFactor;

  return Math.min(fontSizeBasedOnHeight, fontSizeBasedOnWidth, maxFontSize);
};

interface TextProps {
  id: string;
  layer: TextLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

export const TextComponent = ({ layer,onPointerDown,id,selectionColor }: TextProps) => {
  const { x, y, width, height, fill, value } = layer;

  const updateValue = useMutation(({ storage }, newValue: string) => {
    const liveLayers = storage.get("layers");

    liveLayers.get(id)?.set("value", newValue);
  }, []);

  const handleContentChange = (e: ContentEditableEvent) => {
    updateValue(e.target.value);
  };

  return (
    <foreignObject
      x={x}
      y={y}
      width={width}
      height={height}
      onPointerDown={(e) => onPointerDown(e, id)}
      style={{
        outline: selectionColor ? `1px solid ${selectionColor}` : "none",
      }}
    >
      <ContentEditable
        html={value || "Text"}
        onChange={handleContentChange}
        className="h-full w-full flex items-center justify-center text-center drop-shadow-md outline-none"
        style={{
          fontSize: calculateFontSize(width, height),
          color: fill ? colorToCss(fill) : "#000",
        }}
      />
    </foreignObject>
  );
};
```


## app\board\[boardId]\_components\_layer-components.tsx\triangle.tsx

```tsx
import { RectangleLayer } from "@/app/types/canvas";
import { colorToCss } from "@/utils/canvas";

interface TriangleProps {
  id: string;
  layer: RectangleLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

export const Triangle = ({
  id,
  layer,
  onPointerDown,
  selectionColor,
}: TriangleProps) => {
  const { x, y, width, height, fill } = layer;

  return (
    <>
      <svg>
        <polygon
          className="drop-shadow-md"
          onPointerDown={(e) => onPointerDown(e, id)}
          points={`${x},${y + height} ${x + width},${y + height} ${
            x + width / 2
          },${y}`}
          // points={`${x},${y} ${x + width},${y} ${x + width / 2},${y + height}`}
          strokeWidth={1}
          fill={fill ? colorToCss(fill) : "#000"}
          stroke={selectionColor || "#000"}
        />
        {/* Добавление текста внутри треугольника  */}
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          фывыфвфыв
        </text>
        <text
          x={x + width / 2}
          y={y + height + 15}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          еще текст
        </text>
      </svg>
    </>
  );
};
```


## app\board\[boardId]\_components\canvas.tsx

```tsx
"use client";
import { nanoid } from "nanoid";
import {
  Camera,
  CanvasMode,
  CanvasState,
  Color,
  LayerType,
  Point,
  Side,
  XYWH,
} from "@/app/types/canvas";
import {
  useHistory,
  useCanUndo,
  useCanRedo,
  useMutation,
  useStorage,
  useOthersMapped,
  useSelf,
} from "@/liveblocks.config";
import { Info } from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CursorsPresence } from "./cursors-presence";
import {
  colorToCss,
  connectionIdToColor,
  findIntersectingLayersWithRectangle,
  penPointsToPathLayer,
  pointerEventToCanvasPoint,
  resizeBounds,
} from "@/utils/canvas";
import { LiveObject } from "@liveblocks/client";
import { LayerPreview } from "./layer-preview";
import { SelectionBox } from "./selection-box";
import { SelectionTools } from "./selection-tools";
import { Path } from "./_layer-components.tsx/path";
import { useDisableScrollBounce } from "@/app/hooks/use-disable-scroll-bounce";
import { useDeleteLayers } from "@/app/hooks/use-delete-layers";

const MAX_LAYERS = 100;

interface CanvasProps {
  boardId: string;
}

export const Canvas = ({ boardId }: CanvasProps) => {
  const layerIds = useStorage((root) => root.layerIds);
  const pencilDraft = useSelf((me) => me.presence.pencilDraft);
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });
  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });
  const [lastUsedColor, setLastUsedColor] = useState<Color>({
    r: 0,
    g: 0,
    b: 0,
  });
  
  useDisableScrollBounce(); //- это что и для чего?
  const history = useHistory();

  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  //все вытаскивается из room provider
  const insertLayer = useMutation(
    (
      { storage, setMyPresence },
      layerType:
        | LayerType.Ellipse
        | LayerType.Rectangle
        | LayerType.Text
        | LayerType.Note
        | LayerType.Arrow,
      position: Point
    ) => {
      const liveLayers = storage.get("layers");
      if (liveLayers.size >= MAX_LAYERS) {
        return;
      }

      const liveLayerIds = storage.get("layerIds");
      const layerId = nanoid();
      const layer = new LiveObject({
        type: layerType,
        x: position.x,
        y: position.y,
        height: 70,
        width: 70,
        fill: lastUsedColor,
      });

      liveLayerIds.push(layerId);
      liveLayers.set(layerId, layer);

      setMyPresence({ selection: [layerId] }, { addToHistory: true });
      setCanvasState({ mode: CanvasMode.None });
    },
    [lastUsedColor]
  );
  // для рисования карандашем
  const continueDrawing = useMutation(
    ({ self, setMyPresence }, point: Point, e: React.PointerEvent) => {
      const { pencilDraft } = self.presence;

      if (
        canvasState.mode !== CanvasMode.Pencil ||
        e.buttons !== 1 ||
        pencilDraft == null
      ) {
        return;
      }

      setMyPresence({
        cursor: point,
        pencilDraft:
          pencilDraft.length === 1 &&
          pencilDraft[0][0] === point.x &&
          pencilDraft[0][1] === point.y
            ? pencilDraft
            : [...pencilDraft, [point.x, point.y, e.pressure]],
      });
    },
    [canvasState.mode]
  );
  const startDrawing = useMutation(
    ({ setMyPresence }, point: Point, pressure: number) => {
      setMyPresence({
        pencilDraft: [[point.x, point.y, pressure]],
        penColor: lastUsedColor,
      });
    },
    [lastUsedColor]
  );
  const insertPath = useMutation(
    ({ storage, self, setMyPresence }) => {
      const liveLayers = storage.get("layers");
      const { pencilDraft } = self.presence;

      if (
        pencilDraft == null ||
        pencilDraft.length < 2 ||
        liveLayers.size >= MAX_LAYERS
      ) {
        setMyPresence({ pencilDraft: null });
        return;
      }

      const id = nanoid();
      liveLayers.set(
        id,
        new LiveObject(penPointsToPathLayer(pencilDraft, lastUsedColor))
      );

      const liveLayerIds = storage.get("layerIds");
      liveLayerIds.push(id);

      setMyPresence({ pencilDraft: null });
      setCanvasState({ mode: CanvasMode.Pencil });
    },
    [lastUsedColor]
  );

  const unselectLayers = useMutation(({ self, setMyPresence }) => {
    if (self.presence.selection.length > 0) {
      setMyPresence({ selection: [] }, { addToHistory: true });
    }
  }, []);

  const onPointerUp = useMutation(
    ({}, e) => {
      const point = pointerEventToCanvasPoint(e, camera);

      if (
        canvasState.mode === CanvasMode.None ||
        canvasState.mode === CanvasMode.Pressing
      ) {
        unselectLayers();
        setCanvasState({
          mode: CanvasMode.None,
        });
      } else if (canvasState.mode === CanvasMode.Pencil) {
        insertPath();
      } else if (canvasState.mode === CanvasMode.Inserting) {
        insertLayer(canvasState.layerType, point);
      } else {
        setCanvasState({
          mode: CanvasMode.None,
        });
      }

      history.resume();
    },
    [
      setCanvasState,
      camera,
      canvasState,
      history,
      insertLayer,
      unselectLayers,
      insertPath,
    ]
  );

  const onWheel = useCallback((e: React.WheelEvent) => {
    setCamera((camera) => ({
      x: camera.x - e.deltaX,
      y: camera.y - e.deltaY,
    }));
  }, []);

  const resizeSelectedLayer = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Resizing) {
        return;
      }

      const bounds = resizeBounds(
        canvasState.initialBounds,
        canvasState.corner,
        point
      );

      const liveLayers = storage.get("layers");
      const layer = liveLayers.get(self.presence.selection[0]);

      if (layer) {
        layer.update(bounds);
      }
    },
    [camera, canvasState]
  );

  const startMultiSelection = useCallback((current: Point, origin: Point) => {
    if (Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) > 5) {
      setCanvasState({
        mode: CanvasMode.SelectionNet,
        origin,
        current,
      });
    }
  }, []);

  // перемещение объекта
  const translateSelectedLayers = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Translating) {
        return;
      }
      const offset = {
        x: point.x - canvasState.current.x,
        y: point.y - canvasState.current.y,
      };

      const liveLayers = storage.get("layers");

      for (const id of self.presence.selection) {
        const layer = liveLayers.get(id);

        if (layer) {
          layer.update({
            x: layer.get("x") + offset.x,
            y: layer.get("y") + offset.y,
          });
        }
      }

      setCanvasState({ mode: CanvasMode.Translating, current: point });
    },
    [canvasState]
  );
  const updateSelectionNet = useMutation(
    ({ storage, setMyPresence }, current: Point, origin: Point) => {
      const layers = storage.get("layers").toImmutable();
      setCanvasState({
        mode: CanvasMode.SelectionNet,
        origin,
        current,
      });

      const ids = findIntersectingLayersWithRectangle(
        layerIds,
        layers,
        origin,
        current
      );

      setMyPresence({ selection: ids });
    },
    [layerIds]
  );

  const onPointerMove = useMutation(
    ({ setMyPresence }, e: React.PointerEvent) => {
      e.preventDefault();

      const current = pointerEventToCanvasPoint(e, camera);
      if (canvasState.mode === CanvasMode.Pressing) {
        startMultiSelection(current, canvasState.origin);
        //выделение нескольких объектов
      } else if (canvasState.mode === CanvasMode.SelectionNet) {
        updateSelectionNet(current, canvasState.origin);
      }
      //перетаскивание объекта по канвасу
      else if (canvasState.mode === CanvasMode.Translating) {
        translateSelectedLayers(current);
      }
      //если меняем размер объекта
      else if (canvasState.mode === CanvasMode.Resizing) {
        resizeSelectedLayer(current);
      } else if (canvasState.mode === CanvasMode.Pencil) {
        continueDrawing(current, e);
      }

      setMyPresence({ cursor: current });
    },
    [
      canvasState,
      continueDrawing,
      camera,
      canvasState,
      resizeSelectedLayer,
      translateSelectedLayers,
      startMultiSelection,
      updateSelectionNet,
    ]
  );
  //выход за рамки канваса
  const onPointerLeave = useMutation(({ setMyPresence }) => {
    setMyPresence({ cursor: null });
  }, []);

  const selections = useOthersMapped((other) => other.presence.selection);
  //изменение цвета по цвету пользователя
  const layerIdsToColorSelection = useMemo(() => {
    const layerIdsToColorSelection: Record<string, string> = {};

    for (const user of selections) {
      const [connectionId, selection] = user;

      for (const layerId of selection) {
        layerIdsToColorSelection[layerId] = connectionIdToColor(connectionId);
      }
    }

    return layerIdsToColorSelection;
  }, [selections]);

  //нажимать и выделять объект рамкой другим юзером
  const onLayerPointerDown = useMutation(
    ({ self, setMyPresence }, e: React.PointerEvent, layerId: string) => {
      if (
        canvasState.mode === CanvasMode.Pencil ||
        canvasState.mode === CanvasMode.Inserting
      ) {
        return;
      }

      history.pause();
      e.stopPropagation();

      const point = pointerEventToCanvasPoint(e, camera);

      if (!self.presence.selection.includes(layerId)) {
        setMyPresence({ selection: [layerId] }, { addToHistory: true });
      }
      setCanvasState({ mode: CanvasMode.Translating, current: point });
    },
    [setCanvasState, camera, history, canvasState.mode]
  );

  const onResizeHandlePointerDown = useCallback(
    (corner: Side, initialBounds: XYWH) => {
      history.pause();
      setCanvasState({
        mode: CanvasMode.Resizing,
        initialBounds,
        corner,
      });
    },
    [history]
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const point = pointerEventToCanvasPoint(e, camera);

      if (canvasState.mode === CanvasMode.Inserting) {
        return;
      }
      if (canvasState.mode === CanvasMode.Pencil) {
        startDrawing(point, e.pressure);
        return;
      }

      setCanvasState({ origin: point, mode: CanvasMode.Pressing });
    },
    [camera, canvasState.mode, setCanvasState]
  );

  const deleteLayers = useDeleteLayers();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case "Delete":
          deleteLayers();
          break;
        case "z": {
          if (e.ctrlKey || e.metaKey) {
            if (e.shiftKey) {
              history.redo();
            } else {
              history.undo();
            }
            break;
          }
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [deleteLayers, history]);

  return (
    <main className="h-full w-full relative bg-neutral-100 touch-none">
      <Info boardId={boardId} />
      <Participants />
      <Toolbar
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        canRedo={canRedo}
        canUndo={canUndo}
        undo={history.undo}
        redo={history.redo}
      />
      <SelectionTools camera={camera} setLastUsedColor={setLastUsedColor} />
      <svg
        className="h-[100vh] w-[100vw]"
        onWheel={onWheel}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerUp={onPointerUp}
        onPointerDown={onPointerDown}
      >
        <g
          style={{
            transform: `translate(${camera.x}px, ${camera.y}px)`,
          }}
        >
          {layerIds.map((layerId) => (
            <LayerPreview
              key={layerId}
              id={layerId}
              onLayerPointerDown={onLayerPointerDown}
              selectionColor={layerIdsToColorSelection[layerId]}
            />
          ))}
          <SelectionBox onResizeHandlePointerDown={onResizeHandlePointerDown} />
          {/* добавление синего прямоугольника для выделения объектов которых мы хотим выделить */}
          {canvasState.mode === CanvasMode.SelectionNet &&
            canvasState.current != null && (
              <rect
                className="fill-blue-500/5 stroke-blue-500 stroke-1"
                x={Math.min(canvasState.origin.x, canvasState.current.x)}
                y={Math.min(canvasState.origin.y, canvasState.current.y)}
                width={Math.abs(canvasState.origin.x - canvasState.current.x)}
                height={Math.abs(canvasState.origin.y - canvasState.current.y)}
              />
            )}
          <CursorsPresence />
          {/* чтобы отображалось в вмомент рисования а не после завершения */}
          {pencilDraft != null && pencilDraft.length > 0 && (
            <Path
              points={pencilDraft}
              fill={colorToCss(lastUsedColor)}
              x={0}
              y={0}
            />
          )}
        </g>
      </svg>
    </main>
  );
};
```


## app\board\[boardId]\_components\color-picker.tsx

```tsx
"use client";

import { Color } from "@/app/types/canvas";
import { colorToCss } from "@/utils/canvas";

interface ColorPickerProps {
  onChange: (color: Color) => void;
}

export const ColorPicker = ({ onChange }: ColorPickerProps) => {
  return (
    <div className="flex flex-wrap gap-2 items-center max-w-[164px] pr-2 mr-2 border-r border-neutral-200">
      <ColorButton color={{ r: 243, g: 82, b: 35 }} onClick={onChange} />
      <ColorButton color={{ r: 255, g: 249, b: 177 }} onClick={onChange} />
      <ColorButton color={{ r: 68, g: 202, b: 99 }} onClick={onChange} />
      <ColorButton color={{ r: 39, g: 142, b: 237 }} onClick={onChange} />
      <ColorButton color={{ r: 155, g: 105, b: 245 }} onClick={onChange} />
      <ColorButton color={{ r: 252, g: 142, b: 42 }} onClick={onChange} />
      <ColorButton color={{ r: 0, g: 0, b: 0 }} onClick={onChange} />
      <ColorButton color={{ r: 255, g: 255, b: 255 }} onClick={onChange} />
    </div>
  );
};

interface ColorButtonProps {
  onClick: (color: Color) => void;
  color: Color;
}

const ColorButton = ({ onClick, color }: ColorButtonProps) => {
  return (
    <button
      className="w-8 h-8 items-center flex justify-center hover:opacity-75 transition"
      onClick={() => onClick(color)}
    >
      <div
        className="h-8 w-8 rounded-md border border-neutral-300"
        style={{ background: colorToCss(color) }}
      />
    </button>
  );
};
```


## app\board\[boardId]\_components\cursor.tsx

```tsx
"use client";

import { memo } from "react";
import { MousePointer2 } from "lucide-react";

import { useOther } from "@/liveblocks.config";
import { connectionIdToColor } from "@/utils/canvas";

interface CursorProps {
  connectionId: number;
};

export const Cursor = memo(({
  connectionId,
}: CursorProps) => {
  const info = useOther(connectionId, (user) => user?.info);
  const cursor = useOther(connectionId, (user) => user.presence.cursor)

  const name = info?.name || "Teammate";

  if (!cursor) {
    return null;
  }

  const { x, y } = cursor;

  return (
    <foreignObject
      style={{
        transform: `translateX(${x}px) translateY(${y}px)`
      }}
      height={50}
      width={name.length * 10 + 24}
      className="relative drop-shadow-md"
    >
      <MousePointer2
        className="h-5 w-5"
        style={{
          fill: connectionIdToColor(connectionId),
          color: connectionIdToColor(connectionId),
        }}
      />
      <div
        className="absolute left-5 px-1.5 py-0.5 rounded-md text-xs text-white font-semibold"
        style={{ backgroundColor: connectionIdToColor(connectionId) }}
      >
        {name}
      </div>
    </foreignObject>
  )
});

Cursor.displayName = "Cursor";
```


## app\board\[boardId]\_components\cursors-presence.tsx

```tsx
"use client";

import { memo } from "react";
import { shallow } from "@liveblocks/client";

import { 
  useOthersConnectionIds, 
  useOthersMapped
} from "@/liveblocks.config";
import { colorToCss } from "@/utils/canvas";

import { Cursor } from "./cursor";
import { Path } from "./_layer-components.tsx/path";

const Cursors = () => {
  const ids = useOthersConnectionIds();

  return (
    <>
      {ids.map((connectionId) => (
        <Cursor
          key={connectionId}
          connectionId={connectionId}
        />
      ))}
    </>
  );
};

const Drafts = () => {
  const others = useOthersMapped((other) => ({
    pencilDraft: other.presence.pencilDraft,
    penColor: other.presence.penColor,
  }), shallow);

  return (
    <>
      {others.map(([key, other]) => {
        if (other.pencilDraft) {
          return (
            <Path
              key={key}
              x={0}
              y={0}
              points={other.pencilDraft}
              fill={other.penColor ? colorToCss (other.penColor) : "#000"}
            />
          );
        }

        return null;
      })}
    </>
  )
}

export const CursorsPresence = memo(() => {
  return (
    <>
      <Cursors />
    </>
  );
});

CursorsPresence.displayName = "CursorsPresence";
```


## app\board\[boardId]\_components\info.tsx

```tsx
"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { Poppins } from "next/font/google";

import { cn } from "@/utils/canvas";
import { Hint } from "@/components/hint";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";
import { useRenameModal } from "@/app/store/use-rename-modal";

interface InfoProps {
  boardId: string;
}

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

const TabSeparator = () => {
  return <div className="text-neutral-300 px-1.5">|</div>;
};

export const Info = ({ boardId }: InfoProps) => {
  const { onOpen } = useRenameModal();

  const data = useQuery(api.board.get, {
    id: boardId as Id<"boards">,
  });

  if (!data) return <div>No info</div>

  return (
    <div className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md">
      <Hint label="Go to boards" side="bottom" sideOffset={10}>
        <Button asChild variant="ghost" className="px-2">
          <Link href="/">
            <span
              className={cn(
                "font-semibold text-xl ml-2 text-black",
                font.className
              )}
            >
              Dashboard
            </span>
          </Link>
        </Button>
      </Hint>
      <TabSeparator />
      <Hint label="Edit title" side="bottom" sideOffset={10}>
        <Button
          variant="ghost"
          className="text-base font-normal px-2"
          onClick={() => onOpen(data._id, data.title)}
        >
          {data.title}
        </Button>
      </Hint>
    </div>
  );
};
```


## app\board\[boardId]\_components\layer-preview.tsx

```tsx
"use client";

import { memo } from "react";

import { colorToCss } from "@/utils/canvas";
import { useStorage } from "@/liveblocks.config";
import { LayerType } from "@/app/types/canvas";
import { Path } from "./_layer-components.tsx/path";
import { Rectangle } from "./_layer-components.tsx/rectangle";
import { Ellipse } from "./_layer-components.tsx/ellipse";
import { TextComponent } from "./_layer-components.tsx/text";
import { Note } from "./_layer-components.tsx/note";
import { Triangle } from "./_layer-components.tsx/triangle";
import Connector from "./_layer-components.tsx/connector/connector";

interface LayerPreviewProps {
  id: string;
  onLayerPointerDown: (e: React.PointerEvent, layerId: string) => void;
  selectionColor?: string;
}

//отображение объектов на канвасе
export const LayerPreview = memo(
  ({ id, onLayerPointerDown, selectionColor }: LayerPreviewProps) => {
    const layer = useStorage((root) => root.layers.get(id));

    if (!layer) {
      return null;
    }

    switch (layer.type) {
      case LayerType.Path:
        return (
          <Path
            key={id}
            points={layer.points}
            onPointerDown={(e) => onLayerPointerDown(e, id)}
            x={layer.x}
            y={layer.y}
            fill={layer.fill ? colorToCss(layer.fill) : "#000"}
            stroke={selectionColor}
          />
        );
      case LayerType.Note:
        return (
          <Note
            id={id}
            layer={layer}
            onPointerDown={onLayerPointerDown}
            selectionColor={selectionColor}
          />
        );
      case LayerType.Text:
        return (
          <TextComponent
            id={id}
            layer={layer}
            onPointerDown={onLayerPointerDown}
            selectionColor={selectionColor}
          />
        );
      case LayerType.Ellipse:
        return (
          <Ellipse
            id={id}
            layer={layer}
            onPointerDown={onLayerPointerDown}
            selectionColor={selectionColor}
          />
        );
      case LayerType.Rectangle:
        return (
          <Triangle
            id={id}
            layer={layer}
            onPointerDown={onLayerPointerDown}
            selectionColor={selectionColor}
          />
        );
        case LayerType.Arrow:
          return (
            <Connector
              id={id}
              layer={layer}
              onPointerDown={onLayerPointerDown}
              selectionColor={selectionColor}
            />
          );
      default:
        console.warn("Unknown layer type");
        return null;
    }
  }
);

LayerPreview.displayName = "LayerPreview";
```


## app\board\[boardId]\_components\participants.tsx

```tsx
"use client";

import { useOthers, useSelf } from "@/liveblocks.config";

import { UserAvatar } from "./user-avatar";
import { connectionIdToColor } from "@/utils/canvas";

const MAX_SHOWN_USERS = 2;

export const Participants = () => {
  const users = useOthers();
  const currentUser = useSelf();
  const hasMoreUsers = users.length > MAX_SHOWN_USERS;

  return (
    <div className="w-auto bg-white rounded-md p-3 flex items-center shadow-md">
      <div className="flex gap-x-2">
        {currentUser && (
          <UserAvatar
            borderColor={connectionIdToColor(currentUser.connectionId)}
            src={currentUser.info?.picture}
            name={`${currentUser.info?.name} (You)`}
            fallback={currentUser.info?.name?.[0]}
          />
        )}

        {users.slice(0, MAX_SHOWN_USERS).map(({ connectionId, info }) => {
          return (
            <UserAvatar
              borderColor={connectionIdToColor(connectionId)}
              key={connectionId}
              src={info?.picture}
              name={info?.name}
              fallback={info?.name?.[0] || "T"}
            />
          );
        })}

        {hasMoreUsers && (
          <UserAvatar
            name={`${users.length - MAX_SHOWN_USERS} more`}
            fallback={`+${users.length - MAX_SHOWN_USERS}`}
          />
        )}
      </div>
    </div>
  );
};
```


## app\board\[boardId]\_components\selection-box.tsx

```tsx
"use client";

import { memo } from "react";

import { useSelf, useStorage } from "@/liveblocks.config";
import { LayerType, Side, XYWH } from "@/app/types/canvas";
import { useSelectionBounds } from "@/app/hooks/use-selection-bounds";

//чтобы я могла выделять нужный объект по контуру с точками для изменения размера
interface SelectionBoxProps {
  onResizeHandlePointerDown: (corner: Side, initialBounds: XYWH) => void;
}

const HANDLE_WIDTH = 8;

export const SelectionBox = memo(
  ({ onResizeHandlePointerDown }: SelectionBoxProps) => {
    const soleLayerId = useSelf((me) =>
      me.presence.selection.length === 1 ? me.presence.selection[0] : null
    );

    const isShowingHandles = useStorage(
      (root) =>
        soleLayerId && root.layers.get(soleLayerId)?.type !== LayerType.Path
    );

    const bounds = useSelectionBounds();

    if (!bounds) {
      return null;
    }

    return (
      <>
        <rect
          className="fill-transparent stroke-blue-500 stroke-1 pointer-events-none"
          style={{
            transform: `translate(${bounds.x}px, ${bounds.y}px)`,
          }}
          x={0}
          y={0}
          width={bounds.width}
          height={bounds.height}
        />
        {/* если растянуть объект по размеру(выделяет по контуру и меняет курсок ) */}
        {isShowingHandles && (
          <>
            <rect
              className="fill-white stroke-1 stroke-blue-500"
              x={0}
              y={0}
              style={{
                cursor: "nwse-resize",
                width: `${HANDLE_WIDTH}px`,
                height: `${HANDLE_WIDTH}px`,
                transform: `
                translate(
                  ${bounds.x - HANDLE_WIDTH / 2}px,
                  ${bounds.y - HANDLE_WIDTH / 2}px
                )
              `,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onResizeHandlePointerDown(Side.Top + Side.Left, bounds);
              }}
            />
            <rect
              className="fill-white stroke-1 stroke-blue-500"
              x={0}
              y={0}
              style={{
                cursor: "ns-resize",
                width: `${HANDLE_WIDTH}px`,
                height: `${HANDLE_WIDTH}px`,
                transform: `
                translate(
                  ${bounds.x + bounds.width / 2 - HANDLE_WIDTH / 2}px, 
                  ${bounds.y - HANDLE_WIDTH / 2}px
                )
              `,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onResizeHandlePointerDown(Side.Top, bounds);
              }}
            />
            <rect
              className="fill-white stroke-1 stroke-blue-500"
              x={0}
              y={0}
              style={{
                cursor: "nesw-resize",
                width: `${HANDLE_WIDTH}px`,
                height: `${HANDLE_WIDTH}px`,
                transform: `
                translate(
                  ${bounds.x - HANDLE_WIDTH / 2 + bounds.width}px,
                  ${bounds.y - HANDLE_WIDTH / 2}px
                )`,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onResizeHandlePointerDown(Side.Top + Side.Right, bounds);
              }}
            />
            <rect
              className="fill-white stroke-1 stroke-blue-500"
              x={0}
              y={0}
              style={{
                cursor: "ew-resize",
                width: `${HANDLE_WIDTH}px`,
                height: `${HANDLE_WIDTH}px`,
                transform: `
                translate(
                  ${bounds.x - HANDLE_WIDTH / 2 + bounds.width}px, 
                  ${bounds.y + bounds.height / 2 - HANDLE_WIDTH / 2}px
                )`,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onResizeHandlePointerDown(Side.Right, bounds);
              }}
            />
            <rect
              className="fill-white stroke-1 stroke-blue-500"
              x={0}
              y={0}
              style={{
                cursor: "nwse-resize",
                width: `${HANDLE_WIDTH}px`,
                height: `${HANDLE_WIDTH}px`,
                transform: `
                translate(
                  ${bounds.x - HANDLE_WIDTH / 2 + bounds.width}px, 
                  ${bounds.y - HANDLE_WIDTH / 2 + bounds.height}px
                )`,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onResizeHandlePointerDown(Side.Bottom + Side.Right, bounds);
              }}
            />
            <rect
              className="fill-white stroke-1 stroke-blue-500"
              x={0}
              y={0}
              style={{
                cursor: "ns-resize",
                width: `${HANDLE_WIDTH}px`,
                height: `${HANDLE_WIDTH}px`,
                transform: `
                translate(
                  ${bounds.x + bounds.width / 2 - HANDLE_WIDTH / 2}px,
                  ${bounds.y - HANDLE_WIDTH / 2 + bounds.height}px
                )`,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onResizeHandlePointerDown(Side.Bottom, bounds);
              }}
            />
            <rect
              className="fill-white stroke-1 stroke-blue-500"
              x={0}
              y={0}
              style={{
                cursor: "nesw-resize",
                width: `${HANDLE_WIDTH}px`,
                height: `${HANDLE_WIDTH}px`,
                transform: `
                translate(
                  ${bounds.x - HANDLE_WIDTH / 2}px,
                  ${bounds.y - HANDLE_WIDTH / 2 + bounds.height}px
                )`,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onResizeHandlePointerDown(Side.Bottom + Side.Left, bounds);
              }}
            />
            <rect
              className="fill-white stroke-1 stroke-blue-500"
              x={0}
              y={0}
              style={{
                cursor: "ew-resize",
                width: `${HANDLE_WIDTH}px`,
                height: `${HANDLE_WIDTH}px`,
                transform: `
                translate(
                  ${bounds.x - HANDLE_WIDTH / 2}px,
                  ${bounds.y - HANDLE_WIDTH / 2 + bounds.height / 2}px
                )`,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onResizeHandlePointerDown(Side.Left, bounds);
              }}
            />
          </>
        )}
      </>
    );
  }
);

SelectionBox.displayName = "SelectionBox";
```


## app\board\[boardId]\_components\selection-tools.tsx

```tsx
"use client";

import { memo } from "react";
import { BringToFront, SendToBack, Trash2 } from "lucide-react";

import { Hint } from "@/components/hint";

import { Button } from "@/components/ui/button";
import { useMutation, useSelf } from "@/liveblocks.config";
import { Camera, Color } from "@/app/types/canvas";
import { useSelectionBounds } from "@/app/hooks/use-selection-bounds";
import { useDeleteLayers } from "@/app/hooks/use-delete-layers";
import { ColorPicker } from "./color-picker";


interface SelectionToolsProps {
  camera: Camera;
  setLastUsedColor: (color: Color) => void;
}

export const SelectionTools = memo(
  ({ camera, setLastUsedColor }: SelectionToolsProps) => {
    const selection = useSelf((me) => me.presence.selection);

    const moveToFront = useMutation(
      ({ storage }) => {
        const liveLayerIds = storage.get("layerIds");
        const indices: number[] = [];

        const arr = liveLayerIds.toImmutable();

        for (let i = 0; i < arr.length; i++) {
          if (selection.includes(arr[i])) {
            indices.push(i);
          }
        }

        for (let i = indices.length - 1; i >= 0; i--) {
          liveLayerIds.move(
            indices[i],
            arr.length - 1 - (indices.length - 1 - i)
          );
        }
      },
      [selection]
    );

    const moveToBack = useMutation(
      ({ storage }) => {
        const liveLayerIds = storage.get("layerIds");
        const indices: number[] = [];

        const arr = liveLayerIds.toImmutable();

        for (let i = 0; i < arr.length; i++) {
          if (selection.includes(arr[i])) {
            indices.push(i);
          }
        }

        for (let i = 0; i < indices.length; i++) {
          liveLayerIds.move(indices[i], i);
        }
      },
      [selection]
    );

    //изменяет цвет объекта по выбору цвета из ColorPicker
    const setFill = useMutation(
      ({ storage }, fill: Color) => {
        const liveLayers = storage.get("layers");
        setLastUsedColor(fill);

        selection.forEach((id) => {
          liveLayers.get(id)?.set("fill", fill);
        });
      },
      [selection, setLastUsedColor]
    );

    const deleteLayers = useDeleteLayers();

    const selectionBounds = useSelectionBounds();

    if (!selectionBounds) {
      return null;
    }

    const x = selectionBounds.width / 2 + selectionBounds.x + camera.x;
    const y = selectionBounds.y + camera.y;

    return (
      <div
        className="absolute p-3 rounded-xl bg-white shadow-sm border flex select-none"
        style={{
          transform: `translate(
          calc(${x}px - 50%),
          calc(${y - 16}px - 100%)
        )`,
        }}
      >
        <ColorPicker onChange={setFill} />
        <div className="flex flex-col gap-y-0.5">
          <Hint label="Bring to front">
            <Button onClick={moveToFront} variant="ghost" size="icon">
              <BringToFront />
            </Button>
          </Hint>
          <Hint label="Send to back" side="bottom">
            <Button onClick={moveToBack} variant="ghost" size="icon">
              <SendToBack />
            </Button>
          </Hint>
        </div>
        <div className="flex items-center pl-2 ml-2 border-l border-neutral-200">
          <Hint label="Delete">
            <Button variant="ghost" size="icon" onClick={deleteLayers}>
              <Trash2 />
            </Button>
          </Hint>
        </div>
      </div>
    );
  }
);

SelectionTools.displayName = "SelectionTools";
```


## app\board\[boardId]\_components\tool-button.tsx

```tsx
"use client";

import { LucideIcon } from "lucide-react";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";

interface ToolButtonProps {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  isActive?: boolean;
  isDisabled?: boolean;
}

export const ToolButton = ({
  label,
  icon: Icon,
  onClick,
  isActive,
  isDisabled,
}: ToolButtonProps) => {
  return (
    <Hint label={label} side="right" sideOffset={14}>
      <Button
        disabled={isDisabled}
        onClick={onClick}
        size="icon"
        variant={isActive ? "outline" : "default"}
      >
        <Icon />
      </Button>
    </Hint>
  );
};
```


## app\board\[boardId]\_components\toolbar.tsx

```tsx
import { 
  Circle, 
  MousePointer2, 
  Pencil, 
  Redo2, 
  Square, 
  StickyNote, 
  Type,
  Undo2
} from "lucide-react";
import { MoveUpRight } from 'lucide-react';

import { ToolButton } from "./tool-button";
import { CanvasMode, CanvasState, LayerType } from "@/app/types/canvas";

interface ToolbarProps {
  canvasState: CanvasState;
  setCanvasState: (newState: CanvasState) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
};

export const Toolbar = ({
  canvasState,
  setCanvasState,
  undo,
  redo,
  canUndo,
  canRedo,
}: ToolbarProps) => {
  return (
    <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4">
      <div className="bg-white rounded-md p-1.5 flex gap-y-1 flex-col items-center shadow-md">
        <ToolButton
          label="Select"
          icon={MousePointer2}
          onClick={() => setCanvasState({ 
            mode: CanvasMode.None
          })}
          isActive={
            canvasState.mode === CanvasMode.None ||
            canvasState.mode === CanvasMode.Translating ||
            canvasState.mode === CanvasMode.SelectionNet ||
            canvasState.mode === CanvasMode.Pressing ||
            canvasState.mode === CanvasMode.Resizing
          }
        />
        <ToolButton
          label="Text"
          icon={Type}
          onClick={() => setCanvasState({
            mode: CanvasMode.Inserting,
            layerType: LayerType.Text,
          })}
          isActive={
            canvasState.mode === CanvasMode.Inserting &&
            canvasState.layerType === LayerType.Text
          }
        />
        <ToolButton
          label="Sticky note"
          icon={StickyNote}
          onClick={() => setCanvasState({
            mode: CanvasMode.Inserting,
            layerType: LayerType.Note,
          })}
          isActive={
            canvasState.mode === CanvasMode.Inserting &&
            canvasState.layerType === LayerType.Note
          }
        />
        <ToolButton
          label="Rectangle"
          icon={Square}
          onClick={() => setCanvasState({
            mode: CanvasMode.Inserting,
            layerType: LayerType.Rectangle,
          })}
          isActive={
            canvasState.mode === CanvasMode.Inserting &&
            canvasState.layerType === LayerType.Rectangle
          }
        />
         <ToolButton
          label="Arrow"
          icon={MoveUpRight}
          onClick={() => setCanvasState({
            mode: CanvasMode.Inserting,
            layerType: LayerType.Arrow,
          })}
          isActive={
            canvasState.mode === CanvasMode.Inserting &&
            canvasState.layerType === LayerType.Arrow
          }
        />
        <ToolButton
          label="Ellipse"
          icon={Circle}
          onClick={() => setCanvasState({
            mode: CanvasMode.Inserting,
            layerType: LayerType.Ellipse,
          })}
          isActive={
            canvasState.mode === CanvasMode.Inserting &&
            canvasState.layerType === LayerType.Ellipse
          }
        />
        <ToolButton
          label="Pen"
          icon={Pencil}
          onClick={() => setCanvasState({
            mode: CanvasMode.Pencil,
          })}
          isActive={
            canvasState.mode === CanvasMode.Pencil
          }
        />
      </div>
      {/* undo redo */}
      <div className="bg-white rounded-md p-1.5 flex flex-col items-center shadow-md">
        <ToolButton
          label="Undo"
          icon={Undo2}
          onClick={undo}
          isDisabled={!canUndo}
        />
        <ToolButton
          label="Redo"
          icon={Redo2}
          onClick={redo}
          isDisabled={!canRedo}
        />
      </div>
    </div>
  );
};
```


## app\board\[boardId]\_components\user-avatar.tsx

```tsx
import { Hint } from "@/components/hint";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  src?: string;
  name?: string;
  fallback?: string;
  borderColor?: string;
}

export const UserAvatar = ({
  src,
  name,
  fallback,
  borderColor,
}: UserAvatarProps) => {
  return (
    <Hint label={name || "Teammate"} side="bottom" sideOffset={18}>
      <Avatar className="h-8 w-8 border-2" style={{ borderColor }}>
        <AvatarImage src={src} />
        <AvatarFallback className="text-xs font-semibold">
          {fallback}
        </AvatarFallback>
      </Avatar>
    </Hint>
  );
};
```


## app\board\[boardId]\page.tsx

```tsx
import { Room } from "@/components/room";
import { Canvas } from "./_components/canvas";
import { Loading } from "@/components/loading";

interface BoardIdPageProps {
  params: {
    boardId: string;
  };
}

const BoardIdPage = ({ params }: BoardIdPageProps) => {
  return (
    <Room roomId={params.boardId} fallback={<Loading />}>
      <Canvas boardId={params.boardId} />
    </Room>
  );
};

export default BoardIdPage;
```


## app\hooks\use-api-mutation.ts

```ts
import { useState } from "react";
import { useMutation } from "convex/react";

export const useApiMutation = (mutationFunction: any) => {
    const [pending, setPending] = useState(false);
    const apiMutation = useMutation(mutationFunction);

    const mutate = (payload: any) => {
        setPending(true);
        return apiMutation(payload)
            .finally(() => setPending(false))
            .then((result) => {
                return result;
            })
            .catch((error) => {
                throw error;
            });
    };

    return {
        mutate,
        pending,
    };
};
```


## app\hooks\use-delete-layers.ts

```ts
import { useSelf, useMutation } from "@/liveblocks.config";

export const useDeleteLayers = () => {
    const selection = useSelf((me) => me.presence.selection);

    return useMutation((
        { storage, setMyPresence }
    ) => {
        const liveLayers = storage.get("layers");
        const liveLayerIds = storage.get("layerIds");

        for (const id of selection) {
            liveLayers.delete(id);

            const index = liveLayerIds.indexOf(id);

            if (index !== -1) {
                liveLayerIds.delete(index);
            }
        }

        setMyPresence({ selection: [] }, { addToHistory: true });
    }, [selection]);
};
```


## app\hooks\use-disable-scroll-bounce.ts

```ts
import { useEffect } from "react";

export const useDisableScrollBounce = () => {
    useEffect(() => {
        document.body.classList.add("overflow-hidden", "overscroll-none");
        return () => {
            document.body.classList.remove("overflow-hidden", "overscroll-none");
        };
    }, []);
};
```


## app\hooks\use-selection-bounds.ts

```ts
import { shallow } from "@liveblocks/react";

import { useStorage, useSelf } from "@/liveblocks.config";
import { Layer, XYWH } from "../types/canvas";

const boundingBox = (layers: Layer[]): XYWH | null => {
    const first = layers[0];

    if (!first) {
        return null;
    }

    let left = first.x;
    let right = first.x + first.width;
    let top = first.y;
    let bottom = first.y + first.height;

    for (let i = 1; i < layers.length; i++) {
        const { x, y, width, height } = layers[i];

        if (left > x) {
            left = x;
        }

        if (right < x + width) {
            right = x + width;
        }

        if (top > y) {
            top = y;
        }

        if (bottom < y + height) {
            bottom = y + height;
        }
    }

    return {
        x: left,
        y: top,
        width: right - left,
        height: bottom - top,
    };
};

export const useSelectionBounds = () => {
    const selection = useSelf((me) => me.presence.selection);

    return useStorage((root) => {
        const selectedLayers = selection
            .map((layerId) => root.layers.get(layerId)!)
            .filter(Boolean);

        return boundingBox(selectedLayers);
    }, shallow);
};
```


## app\hooks\useInitializeBoard.ts

```ts
import { useEffect } from "react";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toReactFlowNode, toReactFlowEdge } from "@/utils/adapters";

import useStore from "../store/store";
import { useChangeEdgeType } from "../store/use-custom-edge";
import { EdgesTypes } from "../types/structs";

export const useInitializeBoard = (boardId: Id<"boards">) => {
  const boardState = useQuery(api.board.loadBoardState, { boardId });
  const { initialize } = useStore();
  const { onChangeEdgesType } = useChangeEdgeType();

  useEffect(() => {
    if (boardState && !useStore.getState().isInitialized) {
      const nodes = boardState.nodes.map(toReactFlowNode);
      const edges = boardState.edges.map(toReactFlowEdge);

      initialize({
        nodes,
        edges,
        title: boardState.title,
        description: boardState?.description || "",
        edgesType: (boardState?.edgesType as EdgesTypes) || EdgesTypes.DEFAULT,
        version: boardState.version,
        createdAt: boardState._creationTime,
      });
      onChangeEdgesType(
        (boardState?.edgesType as EdgesTypes) || EdgesTypes.DEFAULT
      );
    }
  }, [boardState]);
};
```


## app\hooks\useRestoreVersionHandler.tsx

```tsx
import { useCallback } from "react";
import { useConvex } from "convex/react";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import useStore from "../store/store";

type TUseRestoreVersionHandlerProps = {
  boardId: Id<"boards">;
  onSaveRestoredVersion: (
    isRestore?: boolean,
    restoredVersionTime?: number,
    restoredVersionMessage?: string
  ) => void;
};

export const useRestoreVersionHandler = ({
  boardId,
  onSaveRestoredVersion,
}: TUseRestoreVersionHandlerProps) => {
  const convex = useConvex();
  const { onRestoreVersion } = useStore();

  const handleRestore = useCallback(
    async (versionId: number) => {
      const boardVersion = await convex
        .query(api.boardsHistory.getVersionByNumber, {
          boardId: boardId,
          version: versionId,
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

        await onRestoreVersion(restoredVersion);
        await onSaveRestoredVersion(
          true,
          boardVersion?._creationTime,
          boardVersion?.message
        );
      } catch (error) {
        toast.error("Ошибка при восстановлении версии в истории");
      }
    },
    [boardId]
  );

  return { handleRestore };
};
```


## app\hooks\useSaveHandlerOnKeydown.ts

```ts
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
```


## app\hooks\useVersionsHistory.ts

```ts
import { useCallback, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useMutation } from "convex/react";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import useStore from "@/app/store/store";

import { filterPatches, generatePatches } from "@/utils/jsonDiff";
import { toConvexEdge, toConvexNode } from "@/utils/adapters";
import { BoardSavingStatus } from "../types/history";

export const useVersionsHistory = (boardId: string) => {
  const {
    liveblocks: { isStorageLoading },
    nodes,
    edges,
    previousState,
    setPreviousState,
    savingStatus,
    setSavingStatus,
  } = useStore();
  const createVersion = useMutation(api.boardsHistory.createVersion);

  const patchCounterRef = useRef(0);
  const retryCountRef = useRef(0);

  // Ручное сохранение снапшота
  const manualSave = useCallback(
    async (
      isRestore?: boolean,
      restoredVersionTime?: number,
      restoredVersionMessage?: string
    ) => {
      if (isStorageLoading) {
        toast.error("Дождитесь загрузки хранилища");
        return;
      }

      if (savingStatus === BoardSavingStatus.SAVING) {
        return;
      }

      try {
        setSavingStatus(BoardSavingStatus.SAVING);

        const { version, createdAt } = await createVersion({
          boardId: boardId as Id<"boards">,
          type: "snapshot",
          data: {
            nodes: nodes.map(toConvexNode),
            edges: edges.map(toConvexEdge),
          },
          message:
            isRestore && restoredVersionMessage
              ? `${restoredVersionMessage} (Востанновленная)`
              : undefined,
          restoreByTime:
            isRestore && restoredVersionTime ? restoredVersionTime : undefined,
        });

        setPreviousState({
          nodes,
          edges,
          version,
          createdAt,
        });

        patchCounterRef.current = 0;
      } catch (error) {
        console.error("Ошибка сохранения версии:", error);
        toast.error("Ошибка при сохранении версии");
      } finally {
        setSavingStatus(BoardSavingStatus.IDLE);
      }
    },
    [
      boardId,
      createVersion,
      edges,
      isStorageLoading,
      nodes,
      savingStatus,
      setPreviousState,
      setSavingStatus,
    ]
  );

  // Автосохранение с дебаунсом в 1 минуту
  const savePatch = async () => {
    try {
      if (!previousState) return;

      const patches = filterPatches(
        generatePatches(
          { nodes: previousState.nodes, edges: previousState.edges },
          { nodes, edges }
        )
      );

      if (patches.length === 0) return;

      setSavingStatus(BoardSavingStatus.SAVING);

      const { version, createdAt } = await createVersion({
        boardId: boardId as Id<"boards">,
        type: "patch",
        data: {
          patches,
          base: previousState.version,
        },
      });

      patchCounterRef.current++;
      retryCountRef.current = 0;

      setPreviousState({
        nodes,
        edges,
        version,
        createdAt,
      });

      // Создаем снапшот каждые 25 патчей или раз в 15 минут
      if (patchCounterRef.current >= 25) {
        await manualSave();
      }
    } catch (error) {
      if (retryCountRef.current < 3) {
        retryCountRef.current++;
        setTimeout(savePatch, 5000 * retryCountRef.current);
        return;
      }
      console.error("Ошибка сохранения патча:", error);
      toast.error("Ошибка при автосохранении версии");
    } finally {
      setSavingStatus(BoardSavingStatus.IDLE);
    }
  };

  // Автосохранение каждые 60 секунд
  const autoSave = useDebouncedCallback(savePatch, 60000, {
    leading: false,
    trailing: true,
    maxWait: 60000, // Максимальное время ожидания
  });

  return { autoSave, manualSave };
};
```


## app\services\generateSheme.ts

```ts
import { useGenerate } from "../store/useBoardInfo";
import { EdgesTypes } from "../types/structs";

export interface ITemplate {
  description: string;
  edgeType: EdgesTypes;
  iterationCounts: number;
  timeStep: number;
  gamesCount: number;
  elements: any;
}
export const generateSheme = (
  template: ITemplate | null,
  setDescription: (text: string) => void,
  onChangeEdgesType: (type: EdgesTypes) => void,
  setGames: (count: number) => void,
  setIterations: (count: number) => void,
  setTime: (count: number) => void,
  generateNode: any,
  generateEdge: (
    id: number,
    source: number,
    target: number,
    value: number
  ) => void
) => {
  let type: EdgesTypes | null = EdgesTypes.DEFAULT;

  if (template) {
    if (template.edgeType === EdgesTypes.DEFAULT) type = EdgesTypes.DEFAULT;
    if (template.edgeType === EdgesTypes.SMOOTH_STEP)
      type = EdgesTypes.SMOOTH_STEP;
    if (template.edgeType === EdgesTypes.BEZIER) type = EdgesTypes.BEZIER;

    setDescription(template.description);
    onChangeEdgesType(type);
    setGames(template.gamesCount);
    setIterations(template.iterationCounts);
    setTime(template.timeStep);

    template.elements.map((el: any) => {
      el.element_type === "node"
        ? generateNode(
            el.id,
            el.struct,
            el.label,
            el.position.data.x,
            el.position.data.y
          )
        : "close";
    });

    template.elements.map((el: any) => {
      el.element_type === "edge"
        ? generateEdge(el.id, el.source_id, el.target_id, el.value)
        : "close";
    });
  }
  return "no correct data";
};
```


## app\services\parserCode.ts

```ts
const parseCodeToTemplate = (code: string) => {
  try {
    const parsedData = JSON.parse(code);

    const description = parsedData.description || "";
    const edgeType = parsedData.edge_type || "";
    const iterationCounts = parsedData.iteration_counts || 0;
    const timeStep = parsedData.time_step || 0;
    const gamesCount = parsedData.games_count || 0;
    const elements = parsedData.elements || [];

    return {
      description,
      edgeType,
      iterationCounts,
      timeStep,
      gamesCount,
      elements,
    };
  } catch (error) {
    console.error("Error parsing code:", error);
    return null;
  }
};

export { parseCodeToTemplate };
```


## app\services\parserToJson.ts

```ts
export const parserToJson = (
  description: string,
  currentType: string,
  iterations: number,
  games: number,
  time: number,
  getNodesJson: any,
  getEdgesJson: any
): string => {
  const nodesJson = getNodesJson().join(",\n    ");
  const edgesJson = getEdgesJson().join(",\n    ");

  return `{
  "description": "${description}",
  "edge_type": "${currentType.toLowerCase()}",
  "iteration_counts": ${iterations},
  "time_step": ${time},
  "games_count": ${games},
  "elements": [
    ${nodesJson},
    ${edgesJson}
    ]
}`;
};
```


## app\store\store.ts

```ts
import { createWithEqualityFn } from "zustand/traditional";
import {
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Connection,
} from "reactflow";
import { liveblocks } from "@liveblocks/zustand";
import type { WithLiveblocks } from "@liveblocks/zustand";
import { nanoid } from "nanoid/non-secure";

import { EdgesTypes, Graph, StructType } from "../types/structs";
import { markerEnd } from "@/utils/canvas";
import { client } from "@/liveblocks.config";
import {
  BoardState,
  BoardSavingStatus,
  PreviousState,
  BoardStateData,
} from "../types/history";

export type RFState = {
  graph: Graph;
  title: string;
  description: string | undefined;
  edgesType: string | undefined;
  currentVersion: number;
  updatedTime: number | null;
  savingStatus: BoardSavingStatus;
  edgeType: 'custom' | 'probabilistic' | 'conditional' | 'trigger' | 'modifier';
  nodes: Node[];
  edges: Edge[];
  previousState: PreviousState | null;
  isInitialized: boolean;
  initialize: (state: BoardState) => void;
  setPreviousState: (state: PreviousState) => void;
  onRestoreVersion: (stateData: BoardStateData) => void;
  onDeleteVersion: (stateData: BoardStateData) => void;
  setSavingStatus: (savingStatus: BoardSavingStatus) => void;
  addNode: (struct: StructType) => void;
  deleteNode: (id: string) => void;
  onNodesChange: OnNodesChange;
  setNodeName: (id: string, name: string) => void;
  setNodeLabel: (id: string, count: number) => void;
  updateNodeData: (nodeId: string, newData: any) => void;
  onEdgesChange: OnEdgesChange;
  getEdgeTargetNode: (id: string) => void;
  setEdgeType: (type: 'custom' | 'probabilistic' | 'conditional' | 'trigger' | 'modifier') => void;
  setEdgeData: (id: string, data: number) => void;
  setEdgeAnimated: (isPlay: boolean) => void;
  onConnect: (connection: any) => void;
  getEdgeValues: (id: string) => {
    sourceStruct: any;
    sourceValue: any;
    targetValue: any;
  };
  generateNode: (
    id: number,
    struct: string,
    label: string,
    x: number,
    y: number
  ) => void;
  generateEdge: (
    id: number,
    source: number,
    target: number,
    value: number
  ) => void;
  getNodesJson: () => any;
  getEdgesJson: () => any;
  deleteAll: () => any;
};

const graph: Graph = {
  id: 1,
  countComponents: 1,
  owner: "mc_Valera",
  created: "01.01.2002",
  modified: "01.01.2002",
  title: "Graph",
  description: "",
};

const useStore = createWithEqualityFn<WithLiveblocks<RFState>>()(
  liveblocks(
    (set, get) => ({
      graph: graph,
      savingStatus: BoardSavingStatus.IDLE,
      updatedTime: null,
      currentVersion: 0,
      previousState: null,
      nodes: [],
      edges: [],
      title: "",
      description: "",
      edgesType: "Default",
      isInitialized: false,
      initialize: (state: BoardState) => {
        set({
          nodes: state.nodes,
          edges: state.edges,
          previousState: state,
          currentVersion: state.version,
          title: state.title,
          description: state.description,
          edgesType: state.edgesType,
          isInitialized: true,
        });
      },
      setPreviousState: (state: PreviousState) => {
        set({
          previousState: state,
          currentVersion: state.version,
          updatedTime: state.createdAt,
        });
      },
      onRestoreVersion: (stateData: BoardStateData) => {
        set({
          nodes: stateData.nodes,
          edges: stateData.edges,
        });
      },
      onDeleteVersion: (stateData: BoardStateData) => {
        set({
          nodes: stateData.nodes,
          edges: stateData.edges,
        });
      },
      setSavingStatus: (status: BoardSavingStatus) => {
        set({
          savingStatus: status,
        });
      },
      onNodesChange: (changes: NodeChange[]) => {
        set({
          nodes: applyNodeChanges(changes, get().nodes),
        });
      },
      onEdgesChange: (changes: EdgeChange[]) => {
        set({
          edges: applyEdgeChanges(changes, get().edges),
        });
      },
      edgeType: 'custom' as 'custom' | 'probabilistic' | 'conditional' | 'trigger' | 'modifier',
      setEdgeType: (type) => set({ edgeType: type }),
      onConnect: (connection: Connection) => {
        const edgeType = get().edgeType;
        const baseEdge = {
          ...connection,
          id: "id" + new Date(),
          type: edgeType,
          animated: false,
          markerEnd: markerEnd,
        };
        let newEdge;

        switch (edgeType) {
          case 'probabilistic':
            newEdge = { ...baseEdge, data: { probability: 0.5 } };
            break;
          case 'conditional':
            newEdge = { ...baseEdge, data: { condition: '' } };
            break;
          case 'trigger':
            newEdge = { ...baseEdge, data: { eventName: '' } };
            break;
          case 'modifier':
            newEdge = { ...baseEdge, data: { expression: '' } };
            break;
          default: // custom
            newEdge = { ...baseEdge, data: 1 };
        }

        set({
          edges: addEdge(newEdge, get().edges),
        });
      },
      setEdgeData: (id: string, data: number) => {
        const edges = useStore.getState().edges;
        const edgeIndex = edges.findIndex((edge) => edge.id === id);

        if (edgeIndex !== -1) {
          const updatedEdge = {
            ...edges[edgeIndex],
            data: data,
          };
          const updatedEdges = [...edges];
          updatedEdges[edgeIndex] = updatedEdge;
          set({
            edges: updatedEdges,
          });
        }
      },
      deleteNode: (id: string) => {
        set((state) => ({
          nodes: state.nodes.filter((node) => node.id !== id),
          edges: state.edges.filter(
            (edge) => edge.source !== id && edge.target !== id
          ),
        }));
      },
      updateNodeData: (nodeId: string, newData: any) => {
        set((state) => ({
          nodes: state.nodes.map(node => 
            node.id === nodeId ? { ...node, data: newData } : node
          ),
        }));
      },
      setEdgeAnimated: (isPlay: boolean) => {
        if (isPlay) {
          const edges = useStore.getState().edges.map((edge) => ({
            ...edge,
            animated: true,
            style: { stroke: "red" },
          }));
          set({
            edges: edges,
          });
        } else {
          const edges = useStore.getState().edges.map((edge) => ({
            ...edge,
            animated: false,
            style: { stroke: "black" },
          }));
          set({
            edges: edges,
          });
        }
      },
      getEdgeTargetNode: (id: string) => {
        const edges: Edge[] = useStore.getState().edges;
        const edge = edges.find((edge: Edge) => edge.id === id);
        return edge?.target;
      },
      getEdgeValues: (id: string) => {
        const edges: Edge[] = useStore.getState().edges;
        const edge = edges.find((edge: Edge) => edge.id === id);
        const nodes: Node[] = useStore.getState().nodes;

        const sourceNode = nodes.find((node) => node.id === edge?.source);
        const targetNode = nodes.find((node) => node.id === edge?.target);

        return {
          sourceStruct: sourceNode?.data.struct,
          sourceValue: sourceNode?.data.label || "0",
          targetValue: targetNode?.data.label || "0",
        };
      },
      setNodeLabel: (id: string, count: number) => {
        const nodes = useStore.getState().nodes;
        const nodeIndex = nodes.findIndex((node) => node.id === id);

        if (nodeIndex !== -1) {
          const updatedNodes = [...nodes];
          updatedNodes[nodeIndex] = {
            ...updatedNodes[nodeIndex],
            data: {
              ...updatedNodes[nodeIndex].data,
              label: count,
            },
          };

          set({
            nodes: updatedNodes,
          });
        }
      },
      setNodeName: (id: string, name: string) => {
        const nodes = useStore.getState().nodes;
        const nodeIndex = nodes.findIndex((node) => node.id === id);

        if (nodeIndex !== -1) {
          const updatedNodes = [...nodes];
          updatedNodes[nodeIndex] = {
            ...updatedNodes[nodeIndex],
            data: {
              ...updatedNodes[nodeIndex].data,
              name: name,
            },
          };

          set({
            nodes: updatedNodes,
          });
        }
      },

      addNode: (struct: StructType) => {
        let newNode;

        const baseNode = {
          id: nanoid(),
          position: {
            x: (Math.random() * window.innerWidth) / 2,
            y: (Math.random() * window.innerHeight) / 2,
          },
        };

        switch (struct) {
          case StructType.Source:
            newNode = {
              ...baseNode,
              type: 'sourceNode',
              data: { label: '0', struct: StructType.Source, name: '', generationRate: 1, triggerEvent: '' },
            };
            break;
          case StructType.Pool:
            newNode = {
              ...baseNode,
              type: 'poolNode',
              data: { label: '0', struct: StructType.Pool, name: '', resourceType: '', min: 0, max: 100, initialValue: 0 },
            };
            break;
          case StructType.Converter:
            newNode = {
              ...baseNode,
              type: 'converterNode',
              data: { label: '0', struct: StructType.Converter, name: '', conversionIn: 1, conversionOut: 1, converterProbEffects: [] },
            };
            break;
          case StructType.Gate:
            newNode = {
              ...baseNode,
              type: 'gateNode',
              data: { label: '0', struct: StructType.Gate, name: '', gateType: 'probabilistic' },
            };
            break;
          case StructType.Delay:
            newNode = {
              ...baseNode,
              type: 'delayNode',
              data: { label: '0', struct: StructType.Delay, name: '', delaySteps: 1 },
            };
            break;
          case StructType.End:
            newNode = {
              ...baseNode,
              type: 'endNode',
              data: { label: '0', struct: StructType.End, name: '', endType: 'win' },
            };
            break;
          case StructType.Trigger:
            newNode = {
              ...baseNode,
              type: 'triggerNode',
              data: { label: '0', struct: StructType.Trigger, name: '', triggerEvent: '' },
            };
            break;
          case StructType.Empty:
            newNode = {
              ...baseNode,
              type: 'emptyNode',
              data: { label: '•', struct: StructType.Empty, name: '' },
            };
            break;
          case StructType.Entity:
            newNode = {
              ...baseNode,
              type: 'entityNode',
              data: { label: '0', struct: StructType.Entity, name: '', states: [], events: [] },
            };
            break;
          case StructType.State:
            newNode = {
              ...baseNode,
              type: 'stateNode',
              data: { label: '0', struct: StructType.State, name: '', valueType: 'int', range: [0, 100] },
            };
            break;
          case StructType.Event:
            newNode = {
              ...baseNode,
              type: 'eventNode',
              data: { label: '0', struct: StructType.Event, name: '', requires: '', effect: '', probability: 0.5 },
            };
            break;
          case StructType.Rule:
            newNode = {
              ...baseNode,
              type: 'ruleNode',
              data: { label: '0', struct: StructType.Rule, name: '', when: '', effect: '' },
            };
            break;
          case StructType.Operator:
            newNode = {
              ...baseNode,
              type: 'operatorNode',
              data: { label: '0', struct: StructType.Operator, operator: 'X' },
            };
            break;
          default:
            newNode = {
              ...baseNode,
              type: struct.toLowerCase() + "Node",
              data: { label: "0", struct: struct, name: "" },
            };
        }

        set({
          nodes: [...get().nodes, newNode],
        });
      },
      generateNode: (
        id: number,
        structString: string,
        label: string,
        x: number,
        y: number
      ) => {
        let struct = structString[0].toUpperCase() + structString.slice(1);
        let newNode;
        structString === "source"
          ? (newNode = {
              id: id.toString(),
              type: struct.toLowerCase() + "Node",
              data: { label: "0", struct: struct, name: label },
              position: {
                x: x ? x : (Math.random() * window.innerWidth) / 2 / 2,
                y: y ? y : (Math.random() * window.innerHeight) / 2 / 2,
              },
            })
          : structString === "end"
            ? (newNode = {
                id: id.toString(),
                type: struct.toLowerCase() + "Node",
                data: { label: "0", struct: struct, name: label },
                position: {
                  x: x
                    ? x
                    : (Math.random() * window.innerWidth) / 2 +
                      window.innerWidth / 2,
                  y: y
                    ? y
                    : (Math.random() * window.innerHeight) / 2 +
                      window.innerHeight / 2,
                },
              })
            : (newNode = {
                id: id.toString(),
                type: struct.toLowerCase() + "Node",
                data: { label: "0", struct: struct, name: label },
                position: {
                  x: x ? x : (Math.random() * window.innerWidth) / 2,
                  y: y ? y : (Math.random() * window.innerHeight) / 2,
                },
              });

        set({
          nodes: [...get().nodes, newNode],
        });
      },
      generateEdge(id: number, source: number, target: number, value: number) {
        const newEdge = {
          id: id.toString(),
          source: source.toString(),
          target: target.toString(),
          key: "id" + new Date(),
          type: "custom",
          animated: false,
          markerEnd: markerEnd,
          data: value,
        };
        set((state) => ({
          edges: [...get().edges, newEdge],
        }));
      },
      getNodesJson: () => {
        const arr = get().nodes.map((el) => {
          return `    {
          "id": "${el.id}",
          "element_type": "node",
          "type": "${el.type}",
          "struct": "${el.data.struct.toLowerCase()}",
          "label": "${el.data.name ? el.data.name.toLowerCase() : "null"}",
          "position": {
            "data": {
              "x": ${el.position.x},
              "y": ${el.position.y}
            }
          }
        }`;
        });
        return arr;
      },
      getEdgesJson: () => {
        const arr = get().edges.map((el) => {
          return `    {
          "id": "${el.id}",
          "element_type": "edge",
          "source_id": "${el.source}",
          "target_id": "${el.target}",
          "data": "${el?.data}"
        }`;
        });
        return arr;
      },
      deleteAll: () => {
        set((state) => ({
          edges: [],
          nodes: [],
        }));
      },
    }),
    {
      // Add Liveblocks client
      client,
      // presenceMapping: { cursor: true, selection: true },
      // Define the store properties that should be shared in real-time
      storageMapping: {
        nodes: true,
        edges: true,
      },
    }
  )
);

export default useStore;
```


## app\store\use-animate-scheme.tsx

```tsx
import { create } from "zustand";
import useStore from "./store";

interface IAnimateScheme {
  iterations: number;
  games: number;
  iterationsCount: number;
  gamesCount: number;
  isPlay: boolean;
  isReset: boolean;
  intervalId: any;
  time: number;
  resetNodes: () => void;
  setTime: (count: number) => void;
  setIterations: (count: number) => void;
  setGames: (count: number) => void;
  onPlay: () => void;
  onStop: () => void;
  onReset: () => void;
}

export const useAnimateScheme = create<IAnimateScheme>((set) => ({
  iterations: 1,
  time: 1,
  games: 1,
  isPlay: false,
  isReset: false,
  iterationsCount: 0,
  gamesCount: 0,
  intervalId: null,
  setTime: (count: number) => {
    set({ time: count });
  },
  setIterations: (count: number) => {
    set({
      iterations: count,
    });
  },
  setGames: (count: number) => {
    set({
      games: count,
    });
  },
  resetNodes: () => {
    const nodes = useStore.getState().nodes;
    const updatedNodes = nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        label: "0",
      },
    }));

    useStore.setState({
      nodes: updatedNodes,
    });
  },
  onPlay: () => {
    set((state) => {
      if (!state.isPlay && state.iterationsCount < state.iterations) {
        const newIntervalId = setInterval(() => {
          set((state) => {
            const newCount = state.iterationsCount + 1;

            if (state.iterationsCount === +state.iterations) {
              if (state.gamesCount + 1 === +state.games) {
                clearInterval(state.intervalId);
                return {
                  ...state,
                  isPlay: false,
                  intervalId: null,
                  isReset: true,
                };
              } else {
                return {
                  ...state,
                  iterationsCount: 0,
                  gamesCount: state.gamesCount + 1,
                };
              }
            }
            return { ...state, iterationsCount: newCount };
          });
        }, state.time * 1000);

        return {
          ...state,
          isPlay: true,
          intervalId: newIntervalId,
          isReset: false,
        };
      }
      return state;
    });
  },
  onStop: () => {
    set((state) => {
      if (state.intervalId) {
        clearInterval(state.intervalId);
        return { isPlay: false, intervalId: null };
      }
      return state;
    });
  },
  onReset: () =>
    set((state) => {
      clearInterval(state.intervalId);
      state.resetNodes();
      return {
        isPlay: false,
        intervalId: null,
        iterationsCount: 0,
        gamesCount: 0,
        isReset: true,
      };
    }),
}));
```


## app\store\use-custom-edge.tsx

```tsx
import { create } from "zustand";
import { EdgesTypes } from "@/app/types/structs";

interface ICustomEdge {
  error: string | null;
  currentEdgesType: string | EdgesTypes;
  onChangeEdgesType: (type: EdgesTypes) => void;
  setError: (error: string | null) => void;
  analytics: boolean;
  setAnalytics: (isShow: boolean) => void;
}

export const useChangeEdgeType = create<ICustomEdge>((set) => ({
  error: null,
  analytics: false,
  setAnalytics: (isShow: boolean) =>
    set({
      analytics: isShow,
    }),
  currentEdgesType: "Default",
  setError: (error: string | null) =>
    set({
      error: error,
    }),
  onChangeEdgesType: (type: EdgesTypes) =>
    set({
      currentEdgesType: type,
    }),
}));
```


## app\store\use-node-details.ts

```ts
import { create } from 'zustand';

interface NodeDetailsStore {
  isOpen: boolean;
  nodeId: string | null;
  nodeType: string | null;
  openDetails: (nodeId: string, nodeType: string) => void;
  closeDetails: () => void;
}

export const useNodeDetails = create<NodeDetailsStore>((set) => ({
  isOpen: false,
  nodeId: null,
  nodeType: null,
  openDetails: (nodeId, nodeType) => set({ isOpen: true, nodeId, nodeType }),
  closeDetails: () => set({ isOpen: false, nodeId: null, nodeType: null }),
}));
```


## app\store\use-rename-modal.tsx

```tsx
import { create } from "zustand";

const defaultValues = { id: "", title: "" };

interface IRenameModal {
  isVisibleEditor: boolean;
  isVisibleBoard: boolean;
  isVisibleHistory: boolean;
  isOpen: boolean;
  initialValues: typeof defaultValues;
  setIsVisisble: () => void;
  setIsVisisbleBoard: () => void;
  setIsVisisbleHistory: () => void;
  onOpen: (id: string, title: string) => void;
  onClose: () => void;
}

export const useRenameModal = create<IRenameModal>((set) => ({
  isVisibleEditor: false,
  isVisibleBoard: false,
  isVisibleHistory: false,
  isOpen: false,
  setIsVisisble: () => {
    set((state) => ({
      isVisibleEditor: !state.isVisibleEditor,
    }));
  },
  setIsVisisbleBoard: () => {
    set((state) => ({
      isVisibleBoard: !state.isVisibleBoard,
    }));
  },
  setIsVisisbleHistory: () => {
    set((state) => ({
      isVisibleHistory: !state.isVisibleHistory,
    }));
  },
  onOpen: (id, title) =>
    set({
      isOpen: true,
      initialValues: { id, title },
    }),
  onClose: () =>
    set({
      isOpen: false,
      initialValues: defaultValues,
    }),
  initialValues: defaultValues,
}));
```


## app\store\useBoardInfo.tsx

```tsx
import { create } from "zustand";

interface IGenerateStore {
  description: string;
  setDescription: (text: string) => void;
}

export const useGenerate = create<IGenerateStore>((set) => ({
  description: "Тестовая доска для показа",
  setDescription: (text) => {
    set({
      description: text,
    });
  },
}));
```


## app\test\[boardId]\_components\_structs\edgeComponents\conditional-edge.tsx

```tsx
import { useChangeEdgeType } from "@/app/store/use-custom-edge";
import path from "path";
import React, { useState } from "react";
import { EdgeProps, getBezierPath, EdgeLabelRenderer, getStraightPath, BaseEdge, BezierEdge, StepEdge } from "reactflow";

export default function ConditionalEdge(props: EdgeProps) {
  const {
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data = {},
    style,
    id,
  } = props;
  const [condition, setCondition] = useState(data.condition || "");

  const {
    error,
    setError,
    currentEdgesType: currentType,
  } = useChangeEdgeType();

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const [basePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCondition(e.target.value);
    // обновить данные ребра
  };

  return (
    <>
      {currentType === "SmoothStep" && <StepEdge {...props}  style={{ ...style, stroke: '#4A90E2', strokeWidth: 2, strokeDasharray: '5,5' }}/>}
      {currentType === "Default" && <BaseEdge path={basePath} {...props} style={{ ...style, stroke: '#4A90E2', strokeWidth: 2, strokeDasharray: '5,5' }}/>}
      {currentType == "Bezier" && <BezierEdge {...props} style={{ ...style, stroke: '#4A90E2', strokeWidth: 2, strokeDasharray: '5,5' }}/>}
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            background: '#fff',
            padding: '2px 4px',
            borderRadius: '4px',
            border: '1px solid #4A90E2',
            fontSize: 12,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <input
            type="text"
            placeholder="condition"
            value={condition}
            onChange={handleChange}
            style={{ width: '80px', border: "none", outline: "none"  }}
          />
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
```


## app\test\[boardId]\_components\_structs\edgeComponents\custom-edge.tsx

```tsx
import { useChangeEdgeType } from "@/app/store/use-custom-edge";
import useStore from "@/app/store/store";
import React, { useEffect, useState } from "react";

import {
  BaseEdge,
  BezierEdge,
  EdgeLabelRenderer,
  EdgeProps,
  StepEdge,
  getBezierPath,
  getStraightPath,
} from "reactflow";

export default function CustomEdge(props: EdgeProps) {
  const {
    error,
    setError,
    currentEdgesType: currentType,
  } = useChangeEdgeType();
  const [localError, setLocalError] = useState<string | null>(null);

  const { setEdgeData } = useStore();
  const {
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    id,
    data: initalValue,
  } = props;

  const [inputValue, setInputValue] = useState<number>(initalValue ?? 1);
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const [basePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const onChange = (event: any) => {
    const newValue = event.target.value;

    if (typeof +newValue !== "number" || isNaN(+newValue)) {
      setLocalError("Must be a numeric");
      setError("error");
      setInputValue(newValue);
    } else {
      setLocalError(null);
      setError(null);
      setInputValue(newValue);
      setEdgeData(id, +newValue);
    }
  };

  useEffect(() => {
    if (typeof +inputValue !== "number" || isNaN(+inputValue)) {
      setLocalError("Must be a numeric");
      setError("error");
    } else {
      setLocalError(null);
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initalValue]);

  return (
    <>
      {currentType === "SmoothStep" && <StepEdge {...props} />}
      {currentType === "Default" && <BaseEdge path={basePath} {...props} />}
      {currentType == "Bezier" && <BezierEdge {...props} />}
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: "all",
          }}
          className="nodrag nopan"
        >
          <input
            className={
              localError
                ? "border-2 border-red-500 w-16 h-7 text-center rounded-sm"
                : "w-16 h-7 text-center rounded-sm"
            }
            value={inputValue}
            onChange={onChange}
          />
          {localError && (
            <p className="text-center text-2 font-bold text-red-500">
              {localError}
            </p>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
```


## app\test\[boardId]\_components\_structs\edgeComponents\modifier-edge.tsx

```tsx
// app/test/[boardId]/_components/_structs/modifier-edge.tsx
import { useChangeEdgeType } from "@/app/store/use-custom-edge";
import React, { useState } from "react";
import { EdgeProps, getBezierPath, EdgeLabelRenderer, BaseEdge, getStraightPath, BezierEdge, StepEdge } from "reactflow";

export default function ModifierEdge(props: EdgeProps) {
    const {
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
        data = {},
        id,
        style,
    } = props;

    const {
        error,
        setError,
        currentEdgesType: currentType,
    } = useChangeEdgeType();

    const [expression, setExpression] = useState(data.expression || "");

    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const [basePath] = getStraightPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setExpression(e.target.value);
    };

    return (
        <>
            {currentType === "SmoothStep" && <StepEdge {...props}  style={{ ...style, stroke: '#a855f7', strokeWidth: 2, strokeDasharray: '5,5' }}/>}
            {currentType === "Default" && <BaseEdge path={basePath} {...props}  style={{ ...style, stroke: '#a855f7', strokeWidth: 2, strokeDasharray: '5,5' }}/>}
            {currentType == "Bezier" && <BezierEdge {...props}  style={{ ...style, stroke: '#a855f7', strokeWidth: 2, strokeDasharray: '5,5' }}/>}

            <EdgeLabelRenderer>
                <div
                    style={{
                        position: "absolute",
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        background: "#fff",
                        padding: "2px 4px",
                        borderRadius: "4px",
                        border: "1px solid #a855f7",
                        fontSize: 12,
                        pointerEvents: "all",
                    }}
                    className="nodrag nopan"
                >
                    <input
                        type="text"
                        placeholder="expression"
                        value={expression}
                        onChange={handleChange}
                        style={{ width: "100px", border: "none", outline: "none" }}
                    />
                </div>
            </EdgeLabelRenderer>
        </>
    );
}
```


## app\test\[boardId]\_components\_structs\edgeComponents\probabilistic-edge.tsx

```tsx
import { useChangeEdgeType } from "@/app/store/use-custom-edge";
import React, { useState } from "react";
import { EdgeProps, getBezierPath, EdgeLabelRenderer, getStraightPath, BaseEdge, BezierEdge, StepEdge } from "reactflow";

export default function ProbabilisticEdge(props: EdgeProps) {
  const {
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data = {},
    style,
    id,
  } = props;

  const {
    error,
    setError,
    currentEdgesType: currentType,
  } = useChangeEdgeType();

  const [probability, setProbability] = useState(data.probability || 0.5);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const [basePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setProbability(val);
    // Здесь можно вызвать функцию обновления данных ребра (например, через стор)
    // onEdgeDataChange? id, { probability: val }
  };

  return (
    <>
      {currentType === "SmoothStep" && <StepEdge {...props}  style={{ ...style, stroke: '#ff6b6b', strokeWidth: 2, strokeDasharray: '5,5' }}/>}
      {currentType === "Default" && <BaseEdge path={basePath} {...props}  style={{ ...style, stroke: '#ff6b6b', strokeWidth: 2, strokeDasharray: '5,5' }}/>}
      {currentType == "Bezier" && <BezierEdge {...props}  style={{ ...style, stroke: '#ff6b6b', strokeWidth: 2, strokeDasharray: '5,5' }}/>}

      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            background: '#fff',
            padding: '2px 4px',
            borderRadius: '4px',
            border: '1px solid #ff6b6b',
            fontSize: 12,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <input
            type="number"
            min="0"
            max="1"
            step="0.1"
            value={probability}
            onChange={handleChange}
            style={{ width: '50px', border: "none", outline: "none" }}
          />
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
```


## app\test\[boardId]\_components\_structs\edgeComponents\trigger-edge.tsx

```tsx
// app/test/[boardId]/_components/_structs/trigger-edge.tsx
import { useChangeEdgeType } from "@/app/store/use-custom-edge";
import React, { useState } from "react";
import { EdgeProps, getBezierPath, EdgeLabelRenderer, BaseEdge, getStraightPath, BezierEdge, StepEdge } from "reactflow";

export default function TriggerEdge(props: EdgeProps) {
    const {
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
        data = {},
        id,
        style,
    } = props;

    const {
        error,
        setError,
        currentEdgesType: currentType,
    } = useChangeEdgeType();

    const [eventName, setEventName] = useState(data.eventName || "");

    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const [basePath] = getStraightPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEventName(e.target.value);
        // Здесь можно обновить данные ребра через стор, но пока оставим
    };

    return (
        <>
            {currentType === "SmoothStep" && <StepEdge {...props}  style={{ ...style, stroke: '#f97316', strokeWidth: 2, strokeDasharray: '5,5' }}/>}
            {currentType === "Default" && <BaseEdge path={basePath} {...props}  style={{ ...style, stroke: '#f97316', strokeWidth: 2, strokeDasharray: '5,5' }}/>}
            {currentType == "Bezier" && <BezierEdge {...props}  style={{ ...style, stroke: '#f97316', strokeWidth: 2, strokeDasharray: '5,5' }}/>}

            <EdgeLabelRenderer>
                <div
                    style={{
                        position: "absolute",
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        background: "#fff",
                        padding: "2px 4px",
                        borderRadius: "4px",
                        border: "1px solid #f97316",
                        fontSize: 12,
                        pointerEvents: "all",
                    }}
                    className="nodrag nopan"
                >
                    <input
                        type="text"
                        placeholder="event"
                        value={eventName}
                        onChange={handleChange}
                        style={{ width: "80px", border: "none", outline: "none" }}
                    />
                </div>
            </EdgeLabelRenderer>
        </>
    );
}
```


## app\test\[boardId]\_components\_structs\nodeComponents\specNodes\entityNode.tsx

```tsx
"use client";
import { memo, useState } from "react";
import { Handle, Position, NodeResizer } from "reactflow";
import { useNodeDetails } from "@/app/store/use-node-details";
import { StructType } from "@/app/types/structs";

interface EntityNodeProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
    states?: string[];
    events?: string[];
  };
  selected: boolean;
  id: string;
}

const EntityNode = memo(({ data, selected, id }: EntityNodeProps) => {
  const { name, label, states, events } = data;
  const [isHovered, setIsHovered] = useState(false);
  const { openDetails } = useNodeDetails();

  return (
    <div
      onDoubleClick={() => openDetails(id, 'entity')}
      onClick={() => setIsHovered(!isHovered)}
    >
      <NodeResizer color="#4A90E2" isVisible={selected} minWidth={120} minHeight={80} />
      <Handle type="target" position={Position.Top} />
      <div className="entity-node" style={{
        border: '2px solid #4A90E2',
        borderRadius: '8px',
        padding: '10px',
        background: '#f0f8ff'
      }}>
        <div style={{ fontWeight: 'bold' }}>{name || label}</div>
        {isHovered && (
          <div style={{ fontSize: '0.8rem', color: '#666' }}>
            {states?.length || 0} states, {events?.length || 0} events
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

EntityNode.displayName = "EntityNode";
export default EntityNode;
```


## app\test\[boardId]\_components\_structs\nodeComponents\specNodes\eventNode.tsx

```tsx
"use client";
import { memo } from "react";
import { Handle, Position, NodeResizer } from "reactflow";
import { StructType } from "@/app/types/structs";
import { useNodeDetails } from "@/app/store/use-node-details";

interface EventNodeProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
    requires?: string;
    effect?: string;
    probability?: number;
  };
  selected: boolean;
  id: string;
}

const EventNode = memo(({ data, selected, id }: EventNodeProps) => {
  const { name, label, requires, effect, probability } = data;
    const { openDetails } = useNodeDetails();
  return (
    <div onDoubleClick={() => openDetails(id, 'event')}>
      <NodeResizer color="#4A90E2" isVisible={selected} minWidth={100} minHeight={60} />
      <Handle type="target" position={Position.Top} />
      <div style={{
        border: '2px solid #4A90E2',
        borderRadius: '8px',
        padding: '8px',
        background: '#ffe4e1'
      }}>
        <div>{name || label}</div>
        {probability !== undefined && <div>P={probability}</div>}
        {requires && <div style={{ fontSize: '0.7rem' }}>Requires: {requires}</div>}
        {effect && <div style={{ fontSize: '0.7rem' }}>Effect: {effect}</div>}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

EventNode.displayName = "EventNode";
export default EventNode;
```


## app\test\[boardId]\_components\_structs\nodeComponents\specNodes\operatorNode.tsx

```tsx
"use client";
import { memo } from "react";
import { Handle, Position, NodeResizer } from "reactflow";
import { StructType } from "@/app/types/structs";
import { useNodeDetails } from "@/app/store/use-node-details";

const operatorSymbols = {
  X: '◯',
  F: '◇',
  G: '□',
  U: 'U',
};

interface OperatorNodeProps {
  data: {
    label: string;
    struct: StructType;
    operator?: 'X' | 'F' | 'G' | 'U';
  };
  selected: boolean;
  id: string;
}

const OperatorNode = memo(({ data, selected, id }: OperatorNodeProps) => {
  const { operator = 'X' } = data;
  const { openDetails } = useNodeDetails();
  return (
    <div onDoubleClick={() => openDetails(id, 'operator')}>
      <NodeResizer color="#4A90E2" isVisible={selected} minWidth={40} minHeight={40} />
      <Handle type="target" position={Position.Left} />
      <div style={{
        border: '2px solid #4A90E2',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fff'
      }}>
        {operatorSymbols[operator]}
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
});

OperatorNode.displayName = "OperatorNode";
export default OperatorNode;
```


## app\test\[boardId]\_components\_structs\nodeComponents\specNodes\ruleNode.tsx

```tsx
"use client";
import { memo } from "react";
import { Handle, Position, NodeResizer } from "reactflow";
import { StructType } from "@/app/types/structs";
import { useNodeDetails } from "@/app/store/use-node-details";

interface RuleNodeProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
    when?: string;
    effect?: string;
  };
  selected: boolean;
  id: string;
}

const RuleNode = memo(({ data, selected, id }: RuleNodeProps) => {
  const { name, label, when, effect } = data;
  const { openDetails } = useNodeDetails();
  return (
    <div onDoubleClick={() => openDetails(id, 'rule')}>
      <NodeResizer color="#4A90E2" isVisible={selected} minWidth={100} minHeight={60} />
      <Handle type="target" position={Position.Left} />
      <div style={{
        border: '2px solid #4A90E2',
        borderRadius: '8px',
        padding: '8px',
        background: '#e6ffe6'
      }}>
        <div>{name || label}</div>
        {when && <div style={{ fontSize: '0.7rem' }}>When: {when}</div>}
        {effect && <div style={{ fontSize: '0.7rem' }}>Effect: {effect}</div>}
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
});

RuleNode.displayName = "RuleNode";
export default RuleNode;
```


## app\test\[boardId]\_components\_structs\nodeComponents\specNodes\stateNode.tsx

```tsx
"use client";
import { memo } from "react";
import { Handle, Position, NodeResizer } from "reactflow";
import { StructType } from "@/app/types/structs";
import { useNodeDetails } from "@/app/store/use-node-details";

interface StateNodeProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
    valueType?: 'int' | 'enum' | 'list';
    range?: [number, number];
    enumValues?: string[];
  };
  selected: boolean;
  id: string;
}

const StateNode = memo(({ data, selected, id }: StateNodeProps) => {
  const { name, label, valueType, range, enumValues } = data;
    const { openDetails } = useNodeDetails();
  return (
    <div onDoubleClick={() => openDetails(id, 'state')}>
      <NodeResizer color="#4A90E2" isVisible={selected} minWidth={80} minHeight={50} />
      <Handle type="target" position={Position.Left} />
      <div style={{
        border: '2px solid #4A90E2',
        borderRadius: '4px',
        padding: '5px',
        background: '#fff'
      }}>
        <div>{name || label}</div>
        {valueType === 'int' && range && <div>{range[0]}-{range[1]}</div>}
        {valueType === 'enum' && enumValues && <div>{enumValues.join(', ')}</div>}
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
});

StateNode.displayName = "StateNode";
export default StateNode;
```


## app\test\[boardId]\_components\_structs\nodeComponents\tulaNodes\consumerNode.tsx

```tsx
"use client";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect } from "react";
import {
  Edge,
  Node,
  NodeResizer,
  useEdges,
  useNodeId,
  useNodes,
} from "reactflow";
import useStore from "@/app/store/store";
import { StructType } from "@/app/types/structs";
import { StyledNode } from "../styled-node";
import { useNodeDetails } from "@/app/store/use-node-details";

interface DataProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
  };
  selected: boolean;
  id: string;
}

const ConsumerNode = ({
  id,
  data: { label, struct, name, },
  selected,
}: DataProps) => {
  const { isPlay, onStop, onReset, time } = useAnimateScheme();
  const { setNodeLabel, getEdgeValues } = useStore();
  const { openDetails } = useNodeDetails();
  const nodeId = useNodeId();
  const edges = useEdges<any>();
  const nodes = useNodes<any>();

  useEffect(() => {
    let intervalId = null;
    if (nodeId === null) return;
    if (!isPlay) {
      setNodeLabel(nodeId, 0);
    } else {
      setNodeLabel(nodeId, 1);
      let sourceEdge: Edge<Number> = edges.find(
        (edge) => edge?.target === nodeId
      )!;
      // тут в sourceEdge.data хранится значение количество ресурсов
      let targetEdge: Edge<Number> = edges.find(
        (edge) => edge?.source === nodeId
      )!;

      // тут в targetEdge.data хранится значение количества млсекунд * 1000 - то что задержка

      let targetNodeId: Node<any> = nodes.find(
        (node) => node.id === targetEdge?.target
      )!;
      let initialData = +sourceEdge?.data! || 0;

      intervalId = setInterval(() => {
        // Увеличиваем значение sourceEdge.data каждую секунду на 1
        initialData += +sourceEdge?.data!;

        // Обновляем метку узла с новым значением sourceEdge.data
        setNodeLabel(targetNodeId?.id, +initialData);
      }, time * 1000); // Интервал в миллисекундах (1000 миллисекунд = 1 секунда)
    }
    return () => clearInterval(intervalId!);
  }, [isPlay, onStop, onReset]);

  return (
    <>
      <div onDoubleClick={() => openDetails(id, 'consumer')}>
        <NodeResizer
          color="blue"
          isVisible={selected}
          minWidth={45}
          minHeight={45}
        />
        <StyledNode struct={struct} label={label} name={name} />
      </div>
    </>
  );
};

export default memo(ConsumerNode);
```


## app\test\[boardId]\_components\_structs\nodeComponents\tulaNodes\converterNode.tsx

```tsx
"use client";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect } from "react";
import { Edge, NodeResizer, useEdges, useNodeId, useNodes } from "reactflow";
import useStore from "@/app/store/store";
import { StructType } from "@/app/types/structs";
import { StyledNode } from "../styled-node";
import { useNodeDetails } from "@/app/store/use-node-details";

interface DataProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
    conversionIn?: number;
    conversionOut?: number;
    converterProbEffects?: any[];
  };
  selected: boolean;
  id: string;
}

const ConverterNode = ({ id, data, selected, }: DataProps) => {
  const { struct, label, name, conversionIn, conversionOut, converterProbEffects } = data;
  const hasProb = converterProbEffects && converterProbEffects.length > 0;
  const ratio = `${conversionIn}->${conversionOut}`;
  const probRatio = hasProb ? `p=${converterProbEffects[0].probability}:${converterProbEffects[0].conversionIn}->${converterProbEffects[0].conversionOut}` : '';
  const info = hasProb ? probRatio : ratio;

  const { isPlay, onStop, onReset, time } = useAnimateScheme();
  const { setNodeLabel, getEdgeValues } = useStore();
  const { openDetails } = useNodeDetails();
  const nodeId = useNodeId();
  const edges = useEdges<any>();
  const nodes = useNodes<any>();

  useEffect(() => {
    let intervalId = null;
    if (isPlay) {


      let newEdges: Edge[] = edges.filter((edge) => edge.target === nodeId)
      let nodeIds: string[] = newEdges.map((edge) => edge.source);

      if (nodeIds.length > 0) {
        nodeIds.forEach(nodeId => {
            let foundNode = nodes.find(node => node.id === nodeId);
            let edge = edges.find(edge => edge.source === foundNode?.id)
            if (foundNode) {
                if (+foundNode.data?.label > edge?.data) {
                    setNodeLabel(foundNode.id, foundNode.data?.label - edge?.data);
                }
            }
        });
    }

      const sumOfData = newEdges.reduce((accumulator, currentEdge) => {
        return accumulator + (+currentEdge.data || 0); 
      }, 0);
      intervalId = setInterval(() => {


        setNodeLabel(nodeId!, (parseInt(label) + sumOfData));
      }, time * 1000);
    }

    return () => clearInterval(intervalId!);

  }, [isPlay, onStop, onReset, label]);

  return (
    <>
      <div onDoubleClick={() => openDetails(id, 'converter')}>
        <NodeResizer color="blue" isVisible={selected} minWidth={45} minHeight={45} />
        <StyledNode struct={struct} label={label} name={name} info={info} />
      </div>
    </>
  );
};

export default memo(ConverterNode);
```


## app\test\[boardId]\_components\_structs\nodeComponents\tulaNodes\delayNode.tsx

```tsx
"use client";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect } from "react";
import {
  Edge,
  Node,
  NodeResizer,
  useEdges,
  useNodeId,
  useNodes,
} from "reactflow";
import useStore from "@/app/store/store";
import { StructType } from "@/app/types/structs";
import { StyledNode } from "../styled-node";
import { useNodeDetails } from "@/app/store/use-node-details";

interface DataProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
    delaySteps?: number;
  };
  selected: boolean;
  id: string;
}

const DelayNode = ({ id, data, selected }: DataProps) => {
  const { struct, label, name, delaySteps } = data;
  const info = delaySteps ? `δ=${delaySteps}` : '';

  const { isPlay, onStop, onReset, time } = useAnimateScheme();
  const { setNodeLabel, getEdgeValues } = useStore();
  const { openDetails } = useNodeDetails();
  const nodeId = useNodeId();
  const edges = useEdges<any>();
  const nodes = useNodes<any>();

  useEffect(() => {
    let intervalId = null;
    if (!isPlay) {
      setNodeLabel(nodeId!, 0);
    } else {
      setNodeLabel(nodeId!, 1);
      let sourceEdge: Edge<any> = edges.find((edge) => edge?.target === nodeId)!;
      // тут в sourceEdge.data хранится значение количество ресурсов
      let targetEdge: Edge<any> = edges.find((edge) => edge?.source === nodeId)!;

      // тут в targetEdge.data хранится значение количества млсекунд * 1000 - то что задержка

      let targetNodeId: Node<any> = nodes.find(
        (node) => node.id === targetEdge?.target
      )!;
      let initialData = +sourceEdge?.data || 0;

      intervalId = setInterval(() => {
        // Увеличиваем значение sourceEdge.data каждую секунду на 1
        initialData += +sourceEdge?.data;

        // Обновляем метку узла с новым значением sourceEdge.data
        setNodeLabel(targetNodeId?.id, +initialData);
      }, time * 1000); // Интервал в миллисекундах (1000 миллисекунд = 1 секунда)
    }
    return () => clearInterval(intervalId!);
  }, [isPlay, onStop, onReset]);

  return (
    <>
      <div onDoubleClick={() => openDetails(id, 'delay')}>
        <NodeResizer
          color="blue"
          isVisible={selected}
          minWidth={45}
          minHeight={45}
        />
        <StyledNode struct={struct} label={label} name={name} info={info} />
      </div>
    </>
  );
};

export default memo(DelayNode);
```


## app\test\[boardId]\_components\_structs\nodeComponents\tulaNodes\endNode.tsx

```tsx
"use client";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect } from "react";
import {
  Edge,
  Node,
  NodeResizer,
  useEdges,
  useNodeId,
  useNodes,
} from "reactflow";
import useStore from "@/app/store/store";
import { StructType } from "@/app/types/structs";
import { StyledNode } from "../styled-node";
import { useNodeDetails } from "@/app/store/use-node-details";

interface DataProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
    endType?: string;
  };
  selected: boolean;
  id: string;
}

const EndNode = ({ id, data, selected }: DataProps) => {
  const { struct, label, name, endType } = data;
  const info = endType ? `end:${endType}` : '';

  const { isPlay, onStop, onReset, time } = useAnimateScheme();
  const { setNodeLabel, getEdgeValues } = useStore();
  const { openDetails } = useNodeDetails();
  const nodeId = useNodeId();
  const edges = useEdges<any>();
  const nodes = useNodes<any>();

  useEffect(() => {
    let intervalId = null;
    if (!isPlay) {
      setNodeLabel(nodeId!, 0);
    } else {
      setNodeLabel(nodeId!, 1);
      let sourceEdge: Edge<any> = edges.find((edge) => edge?.target === nodeId)!;
      // тут в sourceEdge.data хранится значение количество ресурсов
      let targetEdge: Edge<any> = edges.find((edge) => edge?.source === nodeId)!;

      // тут в targetEdge.data хранится значение количества млсекунд * 1000 - то что задержка

      let targetNodeId: Node<any> = nodes.find(
        (node) => node.id === targetEdge?.target
      )!;
      let initialData = +sourceEdge?.data || 0;

      intervalId = setInterval(() => {
        // Увеличиваем значение sourceEdge.data каждую секунду на 1
        initialData += +sourceEdge?.data;

        // Обновляем метку узла с новым значением sourceEdge.data
        setNodeLabel(targetNodeId?.id, +initialData);
      }, time * 1000); // Интервал в миллисекундах (1000 миллисекунд = 1 секунда)
    }
    return () => clearInterval(intervalId!);
  }, [isPlay, onStop, onReset]);

  return (
    <>
      <div onDoubleClick={() => openDetails(id, 'end')}>
        <NodeResizer
          color="blue"
          isVisible={selected}
          minWidth={45}
          minHeight={45}
        />
        <StyledNode struct={struct} label={label} name={name} info={info} />
      </div>
    </>
  );
};

export default memo(EndNode);
```


## app\test\[boardId]\_components\_structs\nodeComponents\tulaNodes\gateNode.tsx

```tsx
"use client";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect } from "react";
import {
  Edge,
  Node,
  NodeResizer,
  useEdges,
  useNodeId,
  useNodes,
} from "reactflow";
import useStore from "@/app/store/store";
import { StructType } from "@/app/types/structs";
import { StyledNode } from "../styled-node";
import { useNodeDetails } from "@/app/store/use-node-details";

interface DataProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
    gateType?: string;
    condition?: string;
  };
  selected: boolean;
  id: string;
}

const GateNode = ({ id, data, selected }: DataProps) => {
  const { struct, label, name, gateType, condition } = data;
  const gateT = gateType ? gateType : '';
  const info = (gateT === 'conditional' && condition) ? `${gateT} \n ${condition}` : gateT;

  const { isPlay, onStop, onReset, time } = useAnimateScheme();
  const { setNodeLabel, getEdgeValues } = useStore();
  const { openDetails } = useNodeDetails();
  const nodeId = useNodeId();
  const edges = useEdges<any>();
  const nodes = useNodes<any>();

  useEffect(() => {
    let intervalId = null;
    if (!isPlay) {
      setNodeLabel(nodeId!, 0);
    } else {
      setNodeLabel(nodeId!, 1);

      let sourceEdge: Edge<any> = edges.find(
        (edge) => edge?.target === nodeId
      )!;
      // тут в sourceEdge.data хранится значение количество ресурсов
      let targetEdge: Edge<any> = edges.find(
        (edge) => edge?.source === nodeId
      )!;

      // тут в targetEdge.data хранится значение количества млсекунд * 1000 - то что задержка
      let targetNodeId: Node<any> = nodes.find(
        (node) => node.id === targetEdge?.target
      )!;
      let initialData = +sourceEdge?.data || 0;

      intervalId = setInterval(() => {
        // Увеличиваем значение sourceEdge.data каждую секунду на 1
        initialData += +sourceEdge?.data;

        // Обновляем метку узла с новым значением sourceEdge.data
        setNodeLabel(targetNodeId?.id, +initialData);
      }, time * 1000); // Интервал в миллисекундах (1000 миллисекунд = 1 секунда)
    }
    return () => clearInterval(intervalId!);
  }, [isPlay, onStop, onReset]);

  return (
    <>
      <div onDoubleClick={() => openDetails(id, 'gate')}>
        <NodeResizer
          color="blue"
          isVisible={selected}
          minWidth={45}
          minHeight={45}
        />
        <StyledNode struct={struct} label={label} name={name} info={info} />
      </div>
    </>
  );
};

export default memo(GateNode);
```


## app\test\[boardId]\_components\_structs\nodeComponents\tulaNodes\poolNode.tsx

```tsx
"use client";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect } from "react";
import {
  Edge,
  Node,
  NodeResizer,
  useEdges,
  useNodeId,
  useNodes,
} from "reactflow";
import useStore from "@/app/store/store";
import { StructType } from "@/app/types/structs";
import { StyledNode } from "../styled-node";
import { useNodeDetails } from "@/app/store/use-node-details";

interface DataProps {
  id: string;
  data: {
    label: string;
    struct: StructType;
    name?: string | undefined;
    resourceType?: string;
    min?: number;
    max?: number;
  };
  selected: boolean;
}

const PoolNode = ({ data, selected, id, }: DataProps) => {
  const { struct, label, name, resourceType, min, max } = data;
  const info = resourceType ? `${resourceType}: ${label} [${min},${max}]` : `${label} [${min},${max}]`;

  const { isPlay, onStop, onReset, time, gamesCount, resetNodes } =
    useAnimateScheme();

  const { openDetails } = useNodeDetails();
  const { setNodeLabel, getEdgeValues } = useStore();
  const nodeId = useNodeId();
  const edges = useEdges<any>();
  const nodes = useNodes<any>();

  useEffect(() => {
    let intervalId = null;
    if (isPlay) {
      let newEdges = edges.filter((edge) => edge.target === nodeId);
      const sumOfData = newEdges.reduce((accumulator, currentEdge) => {
        return accumulator + (+currentEdge.data || 0);
      }, 0);
      intervalId = setInterval(() => {
        setNodeLabel(nodeId!, parseInt(label) + sumOfData);
      }, time * 1000);
    }
    return () => clearInterval(intervalId!);
  }, [isPlay, onStop, onReset, label, gamesCount]);

  return (
    <>
      <div onDoubleClick={() => openDetails(id, 'pool')}>
        <NodeResizer
          color="blue"
          isVisible={selected}
          minWidth={45}
          minHeight={45}
        />

        <StyledNode struct={struct} label={label} name={name} info={info} />
      </div>

    </>
  );
};

export default memo(PoolNode);
```


## app\test\[boardId]\_components\_structs\nodeComponents\tulaNodes\randomNode.tsx

```tsx
"use client";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect } from "react";
import {
  Edge,
  Node,
  NodeResizer,
  useEdges,
  useNodeId,
  useNodes,
} from "reactflow";
import useStore from "@/app/store/store";
import { StructType } from "@/app/types/structs";
import { StyledNode } from "../styled-node";

interface DataProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
  };
  selected: boolean;
}

const RandomNode = ({ data: { label, struct, name }, selected }: DataProps) => {
  const { isPlay, onStop, onReset, time } = useAnimateScheme();
  const { setNodeLabel, getEdgeValues } = useStore();
  const nodeId = useNodeId();
  const edges = useEdges<any>();
  const nodes = useNodes<any>();



  useEffect(() => {
    let intervalId = null;
    if (isPlay) {
      const initialValue = label || null
      let newEdges: Edge[] = edges.filter((edge) => edge.source === nodeId)
      let nodeIds: string[] = newEdges.map(edge => edge.target)      //идишники нод
      
    //   intervalId = setInterval(() => {

    //     setNodeLabel(nodeId, (parseInt(label) + sumOfData).toString());
    //   }, time * 1000);

    
    }
    return () => clearInterval(intervalId!);
  }, [isPlay, onStop, onReset, label]);

  return (
    <>
      <NodeResizer
        color="blue"
        isVisible={selected}
        minWidth={45}
        minHeight={45}
      />
      <StyledNode struct={struct} label={label} name={name} />
    </>
  );
};

export default memo(RandomNode);
```


## app\test\[boardId]\_components\_structs\nodeComponents\tulaNodes\sourceNode.tsx

```tsx
"use client";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect } from "react";
import { Edge, NodeResizer, useEdges, useNodeId, useNodes } from "reactflow";
import useStore from "@/app/store/store";
import { StructType } from "@/app/types/structs";
import { StyledNode } from "../styled-node";
import { useNodeDetails } from "@/app/store/use-node-details";

interface DataProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
    
    //general
    generationRate?: number;
    distributionType?: any;

    //normal
    mean?: number;
    stddev?: number;

    //exponential
    rate?: number;

    //deterministic
    triggerEvent?: string;
    
    //temporal
    interval?: number;
    startTurn?: number;
  };
  selected: boolean;
  id: string;
}

const SourceNode = ({ id, data, selected }: DataProps) => {
  const { 
    struct, 
    label, 
    name, 
    //general
    generationRate, 
    distributionType,
    //normal
    mean,
    stddev,
    //exponential
    rate,
    //deterministic
    triggerEvent, 
    //temporal
    startTurn,
    interval } = data;
  let inf = "";
  switch (distributionType){
    case "deterministic":
      inf = triggerEvent ? `trigger: ${triggerEvent}` : '';
      break;
    case "normal":
      inf = generationRate ? `gen: ${generationRate}/sec` : '';
      break;
    case "exponential":
      inf = generationRate ? `gen: ${generationRate} per ${rate} sec(s)` : '';
      break;
    case "temporal":
      let startOn = startTurn ? `starts on turn: ${startTurn} \n` : '';
      inf = generationRate ? `${startOn}gen: ${generationRate} per ${interval} turn(s)` : '';
      break;
  }
  const info = inf;

  const { isPlay, onStop, onReset, time } = useAnimateScheme();
  const { setNodeLabel, getEdgeValues } = useStore();
  const { openDetails } = useNodeDetails();
  const nodeId = useNodeId();
  const edges = useEdges();
  const nodes = useNodes();

  useEffect(() => {
    let intervalIds: NodeJS.Timeout[] = [];

    if (isPlay && nodeId) {
      let targetEdges: Edge[] = edges.filter((edge) => edge?.source === nodeId);
      targetEdges.forEach((edge) => {
        const targetNode = nodes.find((node) => node.id === edge.target);
        if (!targetNode) return;

        let initialData = 0;

        const intervalId = setInterval(() => {
          initialData += +edge.data;
          setNodeLabel(targetNode?.id!, +initialData);
        }, time * 1000);

        intervalIds.push(intervalId);
      });
    }
    return () => {
      intervalIds.forEach((intervalId) => clearInterval(intervalId));
    };
  }, [isPlay, onStop, onReset, edges, nodeId, nodes, time, setNodeLabel]);

  return (
    <>
      <div onDoubleClick={() => openDetails(id, 'source')}>
        <NodeResizer
          color="blue"
          isVisible={selected}
          minWidth={45}
          minHeight={45}
        />
        <StyledNode struct={struct} label={label} name={name} info={info} />
      </div>
    </>
  );
};

export default memo(SourceNode);
```


## app\test\[boardId]\_components\_structs\nodeComponents\tulaNodes\triggerNode.tsx

```tsx
"use client";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect } from "react";
import {
  Edge,
  Node,
  NodeResizer,
  useEdges,
  useNodeId,
  useNodes,
} from "reactflow";
import useStore from "@/app/store/store";
import { StructType } from "@/app/types/structs";
import { StyledNode } from "../styled-node";
import { useNodeDetails } from "@/app/store/use-node-details";

interface DataProps {
  id: string;
  data: {
    label: string;
    struct: StructType;
    name?: string | undefined;
    triggerEvent?: string;
  };
  selected: boolean;
}

const TriggerNode = ({ data, selected, id, }: DataProps) => {
  const { struct, label, name, triggerEvent } = data;
  const info = triggerEvent ? `event:${triggerEvent}` : '';

  const { isPlay, onStop, onReset, time, gamesCount, resetNodes } =
    useAnimateScheme();

  const { openDetails } = useNodeDetails();
  const { setNodeLabel, getEdgeValues } = useStore();
  const nodeId = useNodeId();
  const edges = useEdges<any>();
  const nodes = useNodes<any>();

  useEffect(() => {
    let intervalId = null;
    if (isPlay) {
      let newEdges = edges.filter((edge) => edge.target === nodeId);
      const sumOfData = newEdges.reduce((accumulator, currentEdge) => {
        return accumulator + (+currentEdge.data || 0);
      }, 0);
      intervalId = setInterval(() => {
        setNodeLabel(nodeId!, parseInt(label) + sumOfData);
      }, time * 1000);
    }
    return () => clearInterval(intervalId!);
  }, [isPlay, onStop, onReset, label, gamesCount]);

  return (
    <>
      <div onDoubleClick={() => openDetails(id, 'trigger')}>
        <NodeResizer
          color="blue"
          isVisible={selected}
          minWidth={45}
          minHeight={45}
        />

        <StyledNode struct={struct} label={label} name={name} info={info} />
      </div>

    </>
  );
};

export default memo(TriggerNode);
```


## app\test\[boardId]\_components\_structs\nodeComponents\emptyNode.tsx

```tsx
// app/test/[boardId]/_components/_structs/nodeComponents/emptyNode.tsx
"use client";
import { memo } from 'react';
import { Handle, Position, NodeResizer } from 'reactflow';

interface EmptyNodeProps {
  data: {
    label?: string;
  };
  selected: boolean;
}

const EmptyNode = memo(({ data, selected }: EmptyNodeProps) => {
  return (
    <>
      <NodeResizer
        color="#4A90E2"
        isVisible={selected}
        minWidth={10}
        minHeight={10}
      />
      {/* Левый хендл – для входящих рёбер */}
      <Handle type="target" position={Position.Left} id="left" />
      {/* Правый хендл – для исходящих рёбер */}
      <Handle type="source" position={Position.Right} id="right" />

      {/* Минимальная визуальная точка */}
      <div
        style={{
          width: 8,
          height: 8,
          backgroundColor: '#888',
          borderRadius: '50%',
          opacity: 0.5,
          cursor: 'grab',
        }}
        title="Пустая точка для управления рёбрами"
      />
    </>
  );
});

EmptyNode.displayName = 'EmptyNode';
export default EmptyNode;
```


## app\test\[boardId]\_components\_structs\nodeComponents\nodeStyle.css

```css
/* Common node styles */
.triggerNode,
.delayNode,
.consumerNode,
.converterNode,
.endNode,
.gateNode,
.poolNode,
.sourceNode,
.randomNode {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;   /* stack children vertically */
    background: white;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    padding: 4px;
    box-sizing: border-box;
}

/* Enforce square/circle shape */
.consumerNode,
.converterNode,
.gateNode,
.poolNode,
.sourceNode,
.randomNode,
.triggerNode {
  aspect-ratio: 1 / 1;   /* circle nodes – also have border-radius 50% */
  border-radius: 50%;
}

.delayNode,
.endNode {
  aspect-ratio: 1 / 1;   /* square nodes – border-radius 5px */
  border-radius: 5px;
}

/* Specific border colors */
.delayNode { border: 2px solid red; }
.consumerNode { border: 2px solid blue; }
.converterNode { border: 2px solid blue; }
.endNode { border: 2px solid black; }
.gateNode { border: 2px solid blue; }
.poolNode { border: 2px solid blue; }
.sourceNode { border: 2px solid greenyellow; }
.randomNode { border: 2px solid red; }
.triggerNode { border: 2px solid #f97316; } /* orange for trigger */

.node-icon-label {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
}

.node-info {
    font-size: 9px;
    line-height: 1.2;
    color: #333;
    max-width: 100%;
    word-break: break-word;
    text-align: center;
    margin-top: 2px;
    white-space: pre-line;
}
```


## app\test\[boardId]\_components\_structs\nodeComponents\styled-node.tsx

```tsx
"use client";
import {
  ArrowLeftRight,
  Recycle,
  Dices,
  Hourglass,
  Play,
  CheckCheck,
  LucideIcon,
  Minus,
  Webhook
} from "lucide-react";
import "./nodeStyle.css";
import { StructType } from "@/app/types/structs";
import { Handle, Position, useNodeId } from "reactflow";
import { useState } from "react";
import useStore from "@/app/store/store";

interface ITestNodeProps {
  struct: StructType;
  label: string;
  name?: string;
  info?: string;
}

type StructStyles = {
  [key in StructType]: string;
};

interface StructIcons {
  [key: string]: LucideIcon;
}

const styleNode: StructStyles = {
  Consumer: "consumerNode",
  Converter: "converterNode",
  Delay: "delayNode",
  End: "endNode",
  Gate: "gateNode",
  Pool: "poolNode",
  Random: "randomNode",
  Source: "sourceNode",
  Entity: "entityNode",
  State: "stateNode",
  Event: "eventNode",
  Rule: "ruleNode",
  Operator: "operatorNode",
  Trigger: "triggerNode"
};

const styleNodeIcon: any = {
  Source: <Play />,
  Converter: <Recycle />,
  Consumer: <Minus />,
  Delay: <Hourglass />,
  Gate: <ArrowLeftRight />,
  Random: <Dices />,
  End: <CheckCheck />,
  Trigger: <Webhook />,
};

export const StyledNode = ({ struct, label, name, info }: ITestNodeProps) => {
  const { setNodeName } = useStore();
  const nodeId = useNodeId();

  const [value, setValue] = useState(name);
  const onChange = (event: any) => {
    setValue(event.target.value);
    setNodeName(nodeId!, event.target.value);
  };

  return (
    <div>
      {struct !== StructType.Source && (
        <Handle type={"target"} position={Position.Left} />
      )}
      <div className={styleNode[struct]}>
        <div className="node-icon-label">{struct in styleNodeIcon ? styleNodeIcon[struct] : label}</div>
        {info && ( <div className="node-info"> {info} </div> )}
        {/* {label} */}
      </div>
      {struct !== StructType.End && (
        <Handle type="source" position={Position.Right} />
      )}
      <div className="h-full w-full flex justify-center">
        <input
          className="bg-transparent w-[50px] border-none text-xs font-bold text-center"
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};
```


## app\test\[boardId]\_components\_structs\custom-node.tsx

```tsx
"use client";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect } from "react";
import { NodeResizer, useEdges, useNodeId } from "reactflow";
import useStore from "@/app/store/store";
import { StyledNode } from "./nodeComponents/styled-node";
import { StructType } from "@/app/types/structs";

interface DataProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
  };
  selected: boolean;
}

const CustomNode = ({ data: { label, struct, name }, selected }: DataProps) => {
  const { isPlay, time, onReset, isReset } = useAnimateScheme();
  const { setNodeLabel, getEdgeValues } = useStore();
  const nodeId = useNodeId();
  const edges = useEdges<any>();

  useEffect(() => {
    let newEdges = edges.filter((edge) => edge.target === nodeId);

    let { sourceStruct, sourceValue, targetValue } = getEdgeValues(
      newEdges[0]?.id
    );
  
    const sumOfData = newEdges.reduce((accumulator, currentEdge) => {
      return accumulator + (+currentEdge.data! || 0);
    }, 0);

    let intervalId: any;
    const intervalCallback = () => {
      setNodeLabel(nodeId!, parseInt(label) + sumOfData);
    };

    if (isPlay) {
      intervalId = setInterval(intervalCallback, time * 1000);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [label, nodeId, isPlay, onReset, setNodeLabel, edges]);

  return (
    <>
      <NodeResizer
        color="blue"
        isVisible={selected}
        minWidth={45}
        minHeight={45}
      />
      <StyledNode struct={struct} label={label} name={name} />
    </>
  );
};

export default memo(CustomNode);
```


## app\test\[boardId]\_components\BoardInfoModal\BoardInfoModal.module.scss

```scss
.board {
  background: white;
  height: 800px;
  width: 300px;
  z-index: 1000;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.board h1 {
  font-size: 16px !important;
  padding-bottom: 10px;
}

.hint_btn {
  background: transparent;
  font-size: 20px !important;
  font-weight: 700;
  color: black;
  padding: 0;
}

.content {
  width: 100%;
  height: 100%;
  position: relative;
}
.content__items {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.date_info {
  position: absolute;
  bottom: 1rem;
  > h2 {
    padding-bottom: 0.5rem;
  }
}

.description {
  display: flex;
  flex-direction: column;
  > textarea {
    height: 270px;
    padding: 1rem 0.5rem;
    background: rgb(233, 238, 252);
    border-radius: 10px;
    border: 1px dashed white;
    margin-bottom: 15px;
  }
}
.saveButton {
  padding: 5px 10px;
  background-color: #000000; /* Красный цвет */
  color: #fff; /* Белый цвет текста */
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.closeButton {
  top: 0;
  right: 0;
  padding: 5px 10px;
  background-color: #000000; /* Красный цвет */
  color: #fff; /* Белый цвет текста */
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.closeButton:hover {
  background-color: #cc0000; /* Темно-красный цвет при наведении */
}
```


## app\test\[boardId]\_components\BoardInfoModal\BoardInfoModal.tsx

```tsx
"use client";

import { useCallback, useState } from "react";
import { useQuery } from "convex/react";

import { useRenameModal } from "@/app/store/use-rename-modal";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useApiMutation } from "@/app/hooks/use-api-mutation";
import { useChangeEdgeType } from "@/app/store/use-custom-edge";
import useStore from "@/app/store/store";
import { Participants } from "@/app/board/[boardId]/_components/participants";
import { EdgeTypePanel } from "../panels/EdgeTypePanel";
import { BoardTitle } from "./BoardTitle";

import styles from "./BoardInfoModal.module.scss";

interface IBoardInfoModalProps {
  boardId: string;
  handleSaveVersion: () => void;
}

const BoardInfoModal = ({
  boardId,
  handleSaveVersion,
}: IBoardInfoModalProps) => {
  // const [description, setDescription] = useState("Тестовая доска для показа");
  const boardData = useQuery(api.board.get, {
    id: boardId as Id<"boards">,
  });
  const { title, description, edgesType } = useStore.getState();

  const { mutate: updateMetaInfo, pending: updateMetaInfoPending } =
    useApiMutation(api.board.updateMetaInfo);

  const { currentEdgesType } = useChangeEdgeType();
  // const [boardTitle, setBoardTitle] = useState(boardData?.title);
  const [boardDescription, setBoardDescription] = useState(description || "");

  const { setIsVisisbleBoard } = useRenameModal();

  const handleDescriptionChange = (event: any) => {
    setBoardDescription(event.target.value);
  };

  const handleSave = useCallback(async () => {
    useStore.setState({
      // title: boardData?.title,
      description: boardDescription,
      edgesType: currentEdgesType,
    });

    await updateMetaInfo({
      id: boardData?._id,
      title: boardData?.title,
      description: boardDescription,
      edgesType: currentEdgesType,
    })
      .then(() => {
        handleSaveVersion();
      })
      .catch((e) => {
        console.log(e);
      });
  }, [
    boardData?._id,
    boardData?.title,
    boardDescription,
    currentEdgesType,
    handleSaveVersion,
    updateMetaInfo,
  ]);

  return (
    <div className={styles.board}>
      <div className={styles.content}>
        <div className={styles.content__items}>
          <div className={styles.header}>
            <BoardTitle boardId={boardId} />
            <button className={styles.closeButton} onClick={setIsVisisbleBoard}>
              &#x2716;
            </button>
          </div>

          <div>
            <h1>
              <strong>Owner:</strong> {boardData?.authorName}
            </h1>
            <h1>
              <strong>Participants:</strong>
            </h1>
            <Participants />
          </div>
          <div className={styles.description}>
            <h1>
              <strong>Description:</strong>
            </h1>
            <textarea
              value={boardDescription}
              onChange={handleDescriptionChange}
              className={styles.description}
            />
            <button
              className={styles.saveButton}
              onClick={handleSave}
              disabled={updateMetaInfoPending}
            >
              Save
            </button>
          </div>
          <div>
            <h1>
              <strong>Connection type:</strong>
            </h1>
            <EdgeTypePanel />
          </div>

          <div className={styles.date_info}>
            <h2>
              <strong>Created: </strong>27.10.2024{" "}
            </h2>
            <h2>
              <strong>Updated: </strong>27.10.2024{" "}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardInfoModal;
```


## app\test\[boardId]\_components\BoardInfoModal\BoardTitle.tsx

```tsx
"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { Poppins } from "next/font/google";

import { cn } from "@/utils/canvas";
import { Hint } from "@/components/hint";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";
import { useRenameModal } from "@/app/store/use-rename-modal";
import styles from "./BoardInfoModal.module.scss";

interface InfoProps {
  boardId: string;
}

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

const TabSeparator = () => {
  return <div className="text-neutral-300 px-1.5">|</div>;
};

export const BoardTitle = ({ boardId }: InfoProps) => {
  const { onOpen } = useRenameModal();

  const data = useQuery(api.board.get, {
    id: boardId as Id<"boards">,
  });

  // if (!data) return <div>No info</div>;

  return (
    <div>
      <Hint label="Edit title" side="bottom" sideOffset={10}>
        <Button
          className={styles.hint_btn}
          onClick={() => onOpen(data?._id as string, data?.title || "")}
        >
          <h2>{data?.title}</h2>
        </Button>
      </Hint>
    </div>
  );
};
```


## app\test\[boardId]\_components\editor\editor.module.scss

```scss
.editor_btn {
  background: rgb(24, 24, 24);
  width: 450px;
  display: flex;
  color: white;
  justify-content: space-between;
}
.generate {
  margin: 20px;
  width: 100%;
}
.reset {
  margin: 20px;
  width: 100%;
}
```


## app\test\[boardId]\_components\editor\editorCoder.tsx

```tsx
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
```


## app\test\[boardId]\_components\HistoryModal\CollapsibleGroup\CollapsibleGroup.module.scss

```scss
.group {
  margin-bottom: 1rem;

  &Header {
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;

    color: #5f6368;
    font-size: 14px;
    padding: 8px 0;
    border-bottom: 1px solid #e0e0e0;
    margin-bottom: 12px;

    &:hover {
      background: #f1f3f5;
    }
  }

  &Content {
    padding: 0.5rem;
  }
}

.toggleIcon {
}
```


## app\test\[boardId]\_components\HistoryModal\CollapsibleGroup\CollapsibleGroup.tsx

```tsx
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
```


## app\test\[boardId]\_components\HistoryModal\CollapsibleGroup\index.ts

```ts
export { CollapsibleGroup } from "./CollapsibleGroup";
```


## app\test\[boardId]\_components\HistoryModal\HistoryItem\HistoryItem.module.scss

```scss
.versionItem {
  position: relative;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: background 0.1s;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 8px;
  border: 1px solid #e0e0e0;

  &:hover {
    background: #f8f9fa;
  }

  &.selected {
    border-color: #1971c2;
    background-color: #f8f9fa;
  }

  &Header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 4px;
  }

  &Meta {
    display: flex;
    gap: 0.5rem;
    color: #868e96;
    font-size: 0.875rem;

    &Time {
      font-size: 14px;
      color: #202124;
    }
  }

  &Content {
    display: flex;
    flex-direction: column;

    &Message {
      font-size: 14px;
      color: #5f6368;
      margin-top: 8px;
      font-style: italic;
      padding-left: 6px;
    }

    &Colabarator {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #5f6368;
      padding-left: 8px;
    }
  }

  &Actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 16px;
  }
}

.swatch {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #26a69a;
}
```


## app\test\[boardId]\_components\HistoryModal\HistoryItem\HistoryItem.tsx

```tsx
import { FC, useCallback, useState } from "react";
import { useConvex, useMutation } from "convex/react";
import { toast } from "sonner";

import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/app/hooks/use-api-mutation";
import { Button } from "@/components/ui/button";
import { useRestoreVersionHandler } from "@/app/hooks/useRestoreVersionHandler";
import { EditableText } from "../../ui";
import styles from "./HistoryItem.module.scss";
import useStore from "@/app/store/store";

type THistoryItemProps = {
  boardId: string;
  version: Doc<"boardsHistory">;
  isSelected: boolean;
  onClick: (versionId: Id<"boardsHistory">) => void;
  onSaveRestoredVersion: (
    isRestore?: boolean,
    restoredVersionTime?: number,
    restoredVersionMessage?: string
  ) => void;
};

export const HistoryItem: FC<THistoryItemProps> = ({
  boardId,
  version,
  isSelected: isCurrent,
  onClick,
  onSaveRestoredVersion,
}) => {
  const convex = useConvex();
  const { onDeleteVersion, setPreviousState } = useStore();

  const { mutate: updateVersionMessage, pending: isVersionMessageUpdating } =
    useApiMutation(api.boardsHistory.updateVersionMessage);
  const { handleRestore } = useRestoreVersionHandler({
    boardId: boardId as Id<"boards">,
    onSaveRestoredVersion,
  });
  const deleteVersion = useMutation(api.boardsHistory.deleteVersion);

  const [isHovered, setIsHovered] = useState(false);

  const handleUpdateHistoryItemMessage = useCallback(
    async (versionId: Id<"boardsHistory">, message: string) => {
      await updateVersionMessage({ id: versionId, message })
        .then(() => {
          toast.success(`Версия успешно переименована`);
        })
        .catch(() => toast.error("Ошибка при переименовании версии"));
    },
    []
  );

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (isCurrent) {
        onClick(version._id);
      }

      await deleteVersion({ versionId: version._id });

      const reinitState = await convex.query(api.board.loadBoardState, {
        boardId: boardId as Id<"boards">,
      });

      await onDeleteVersion(reinitState);
      await setPreviousState({
        nodes: reinitState.nodes,
        edges: reinitState.edges,
        version: reinitState.version,
        createdAt: reinitState._creationTime,
      });

      toast.success("Version deleted");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div
      className={`${styles.versionItem} ${isCurrent ? styles.selected : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(version._id)}
    >
      <div className={styles.versionItemMeta}>
        <span className="version-type">
          {version.type === "snapshot" ? "Snapshot" : "Patch"}
        </span>
        <span className={styles.versionItemMetaTime}>
          {new Date(version._creationTime).toLocaleDateString()}
        </span>
      </div>

      <div className={styles.versionItemContent}>
        <div className={styles.versionItemHeader}>
          <EditableText
            initialValue={
              version.message ||
              new Date(version._creationTime).toLocaleTimeString()
            }
            onBlur={(message: string) => {
              handleUpdateHistoryItemMessage(version._id, message);
            }}
          />
        </div>
        <div className={styles.versionItemContentColabarator}>
          <div className={styles.swatch} />
          <span>{version.authorName || version.authorId}</span>
        </div>
        {version.restoreByTime && (
          <div
            className={styles.versionItemContentMessage}
          >{`Востановлена версия от ${new Date(version.restoreByTime).toLocaleTimeString()}`}</div>
        )}
      </div>

      {isHovered && (
        <div className={styles.versionItemActions}>
          {isCurrent && (
            <Button
              variant="default"
              size="sm"
              onClick={() => handleRestore(version.version)}
            >
              Восстановить
            </Button>
          )}
          {version.version !== 0 && (
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              Удалить
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
```


## app\test\[boardId]\_components\HistoryModal\HistoryItem\index.ts

```ts
export { HistoryItem } from "./HistoryItem";
```


## app\test\[boardId]\_components\HistoryModal\datepicker.css

```css

```


## app\test\[boardId]\_components\HistoryModal\HistoryModal.module.scss

```scss
.historySidebar {
  background: white;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  height: 100vh;
  width: 432px;
  z-index: 1000;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.content {
  width: 100%;
  height: 100%;
  position: relative;
  overflow-y: auto;
  padding-right: 16px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.title {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
}

.revisionsList {
  flex: 1;
  overflow-y: auto;
}

.switch {
  width: 42px;
  height: 25px;
  background-color: #4e4c4cb3;
  border-radius: 9999px;
  position: relative;
  box-shadow: 0 2px 10px #00000080;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  &:focus {
    // box-shadow: 0 0 0 2px black;
  }

  &[data-state="checked"] {
    background-color: rgb(61, 175, 72);
  }

  &Wrapper {
    display: flex;
    align-items: center;
    margin: 16px 0px;
  }

  &Thumb {
    display: block;
    width: 21px;
    height: 21px;
    background-color: white;
    border-radius: 9999px;
    box-shadow: 0 2px 2px #00000080;
    transition: transform 100ms;
    transform: translateX(2px);
    will-change: transform;
    &[data-state="checked"] {
      transform: translateX(19px);
    }
  }

  &Label {
    padding-right: 16px;
    font-size: 16px;
    line-height: 1;
    user-select: none;
  }
}

.searchInput {
  margin-bottom: 16px;
  border-color: hsl(218deg 34.85% 74.85%);
  outline: none;

  &:focus-visible {
    box-shadow: none;
    border-color: #3498db;
  }
}

.datePickerLabel {
  font-size: 16px;
  line-height: 1;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  padding-bottom: 8px;
}

.datePickerInput {
  & input {
    border: 1px solid hsl(218deg 34.85% 74.85%);
    border-radius: calc(0.5rem - 2px);
    padding: 0.5rem 0.75rem;
    padding-left: 32px;
    font-size: 0.875rem;
    line-height: 1.25rem;

    &:focus-visible {
      border-color: #3498db;
      outline: none;
    }
  }

  & button {
    font-size: 13px;
  }

  & svg {
    padding-top: 10px !important;
  }
}

.dateGroup {
  color: #5f6368;
  font-size: 14px;
  padding: 8px 0;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 12px;
}

.tile {
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 8px;
  border: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  cursor: pointer;

  &.selected {
    border-color: #1a73e8;
    background-color: #f8f9fa;
  }
}

.tileHeader {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
}

.time {
  font-size: 14px;
  color: #202124;
}

.restoreButton {
  margin-left: auto;
  background: none;
  border: none;
  color: #1a73e8;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  margin-top: 4px;
  align-self: flex-end;

  &:hover {
    background: #e8f0fe;
  }
}

.collaborator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #5f6368;
  padding-left: 8px;
}

.swatch {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #26a69a;
}

.message {
  font-size: 14px;
  color: #5f6368;
  margin-top: 8px;
  font-style: italic;
  padding-left: 6px;
}

.sortType {
  cursor: pointer;
  margin-left: auto;
}

.spinnerWrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding-block: 16px;
}

// SCSS
.spinner {
  $size: 50px;
  $color: #3498db;
  $thickness: 4px;
  $animation-duration: 1s;

  display: inline-block;
  margin-left: auto;
  margin-right: auto;
  align-self: center;
  width: $size;
  height: $size;
  border: $thickness solid rgba($color, 0.2);
  border-radius: 50%;
  border-top-color: $color;
  animation: spin $animation-duration ease-in-out infinite;
  -webkit-animation: spin $animation-duration ease-in-out infinite;
  position: relative;

  // Вариант с дополнительными градиентами
  &::after {
    content: "";
    position: absolute;
    top: -$thickness;
    left: -$thickness;
    right: -$thickness;
    bottom: -$thickness;
    border-radius: 50%;
    border: $thickness solid transparent;
    border-top-color: rgba($color, 0.5);
    animation: spin ($animation-duration * 1.5) ease-in-out infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
      -webkit-transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
      -webkit-transform: rotate(360deg);
    }
  }

  // Модификаторы размеров
  &--small {
    width: $size * 0.5;
    height: $size * 0.5;
    border-width: $thickness * 0.5;
  }

  &--large {
    width: $size * 2;
    height: $size * 2;
    border-width: $thickness * 1.5;
  }

  // Цветовые варианты
  &--primary {
    border-top-color: $color;
    &::after {
      border-top-color: rgba($color, 0.5);
    }
  }

  &--secondary {
    border-top-color: #2ecc71;
    &::after {
      border-top-color: rgba(#2ecc71, 0.5);
    }
  }

  &--white {
    border-top-color: white;
    &::after {
      border-top-color: rgba(white, 0.5);
    }
  }
}

/* Chrome, Edge and Safari */
.content::-webkit-scrollbar {
  height: 7px;
  width: 7px;
}

.content::-webkit-scrollbar-track {
  background-color: #c7e0e4ff;
  border-radius: 5px;
  border: 0px solid #ffffffff;
}

.content::-webkit-scrollbar-track:hover {
  background-color: #acc6caff;
}

.content::-webkit-scrollbar-track:active {
  background-color: #acc6caff;
}

.content::-webkit-scrollbar-thumb {
  background-color: #6b8484ff;
  border-radius: 10px;
  border: 0px solid #ffffffff;
}

.content::-webkit-scrollbar-thumb:hover {
  background-color: #3a4545ff;
}

.content::-webkit-scrollbar-thumb:active {
  background-color: #3a4545ff;
}
```


## app\test\[boardId]\_components\HistoryModal\HistoryModal.tsx

```tsx
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
```


## app\test\[boardId]\_components\HistoryModal\index.ts

```ts
export { HistoryModal } from "./HistoryModal";
```


## app\test\[boardId]\_components\metrics\chart.tsx

```tsx
"use client";
import { AreaChart, Area, XAxis, YAxis, Tooltip, Legend, Line } from "recharts";

export const Chart = ({ data, title }: any) => {
  return (
    <div>
      <h2 className="pt-2 pb-4 text-center">{title}</h2>
      <AreaChart
        width={350}
        height={220}
        data={data[0]}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="iteration" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area
          type="monotone"
          dataKey="iterations"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#colorUv)"
        />
        <Area
          type="monotone"
          dataKey="iterations1"
          stroke="red"
          fillOpacity={1}
          fill="url(#colorXv)"
        />
        <Area
          type="monotone"
          dataKey="iterations"
          stroke="purple"
          fillOpacity={1}
          fill="url(#colorUv)"
        />
        <Area
          type="monotone"
          dataKey="iterations"
          stroke="pink"
          fillOpacity={1}
          fill="url(#colorXv)"
        />
        <Area
          type="monotone"
          dataKey="iterations"
          stroke="blue"
          fillOpacity={1}
          fill="url(#colorXv)"
        />
      </AreaChart>
    </div>
  );
};
```


## app\test\[boardId]\_components\metrics\chartCard.tsx

```tsx
"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { MetricsData } from "./metricsData";
import { CircleChart } from "./circleChart";

export const ChartCard = ({ data, gameCount, stroke, dataKey, percent}: any) => {
  return (
    <div>
      <h2 className="pt-2 pb-2 text-center">
        <strong>Game {gameCount}</strong>
      </h2>
      <small className="ml-10"><strong>Value</strong></small>
      <LineChart width={400} height={230} data={data} className="mt-4">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey={dataKey} stroke={stroke} />
      </LineChart>
      <small className="w-full flex justify-center items-center text-center m-0">
       <strong>Iterations</strong>
      </small>
      <MetricsData average={100} median={50} min={1} max={100} />
      <CircleChart value={percent} />
    </div>
  );
};
```


## app\test\[boardId]\_components\metrics\circleChart.tsx

```tsx
import React, { FC } from "react";
import { PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ["#82ca9d", "#8884d8"];

export const CircleChart: FC<{ value: number }> = ({ value }) => {
  const data = [
    { name: "Total amount of resources in the node", value: value },
    { name: "Remaining amount of resources", value: 100 - value },
  ];
  return (
    <div className="mb-3 mx-5">
      <h2 className="pt-1 pb-2 text-center">
        <strong>Resource allocation</strong>
      </h2>
      <PieChart width={400} height={300}>
        <Pie dataKey="value" data={data} fill="#8884d8" label>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </div>
  );
};
```


## app\test\[boardId]\_components\metrics\metrics.tsx

```tsx
"use client";

import { Panel } from "reactflow";
import { useChangeEdgeType } from "@/app/store/use-custom-edge";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import "./../../style-test.css";
import { MetricsData } from "./metricsData";
import { CircleChart } from "./circleChart";
import { ChartCard } from "./chartCard";

const data = [
  {
    name: 0,
    game1: 0,
    game2: 0,
    game3: 0,
    game4: 0,
    game5: 0,
  },
  {
    name: 1,
    game1: 10,
    game2: 5,
    game3: 5,
    game4: 2,
    game5: 10,
  },
  {
    name: 2,
    game1: 20,
    game2: 10,
    game3: 10,
    game4: 4,
    game5: 20,
  },
  {
    name: 3,
    game1: 30,
    game2: 15,
    game3: 15,
    game4: 9,
    game5: 20,
  },
  {
    name: 4,
    game1: 40,
    game2: 15,
    game3: 20,
    game4: 11,
    game5: 30,
  },
  {
    name: 5,
    game1: 50,
    game2: 15,
    game3: 25,
    game4: 13,
    game5: 40,
  },
  {
    name: 6,
    game1: 70,
    game2: 20,
    game3: 30,
    game4: 18,
    game5: 50,
  },
  {
    name: 7,
    game1: 90,
    game2: 25,
    game3: 25,
    game4: 28,
    game5: 60,
  },
  {
    name: 8,
    game1: 110,
    game2: 27,
    game3: 30,
    game4: 38,
    game5: 70,
  },
  {
    name: 9,
    game1: 130,
    game2: 37,
    game3: 25,
    game4: 48,
    game5: 80,
  },
  {
    name: 10,
    game1: 150,
    game2: 47,
    game3: 30,
    game4: 58,
    game5: 90,
  },
];

export const Metrics = () => {
  const { analytics, setAnalytics } = useChangeEdgeType();
  return (
    <Panel position="top-right" className="analytics_panel">
      <button
        className="bg-black rounded py-1 px-2 text-white absolute top-2 left-2"
        onClick={() => setAnalytics(false)} > &#x2716;
      </button>
      <h1 className="pt-2 text-center text-lg">
        <strong>Node statistics (wood)</strong>
      </h1>

      <h2 className="pt-1 pb-4 text-center">
        <strong>All games</strong>
      </h2>
      <small className="ml-10">
        <strong>Value</strong>
      </small>
      <LineChart width={400} height={230} data={data} className="mt-2">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        {/* <Legend /> */}
        <Line type="monotone" dataKey="game1" stroke="#82ca9d" />
        <Line type="monotone" dataKey="game2" stroke="#8884d8" />
        <Line type="monotone" dataKey="game3" stroke="pink" />
        <Line type="monotone" dataKey="game4" stroke="blue" />
        <Line type="monotone" dataKey="game5" stroke="purple" />
      </LineChart>
      <small className="w-full flex justify-center items-center text-center m-0">
        <strong>Iterations</strong>
      </small>
      <MetricsData
        average={100}
        median={50}
        min={1}
        max={100}
        std={37}
        range={1}
      />
      <ChartCard data={data} gameCount={1} stroke="#82ca9d" dataKey="game1" percent={14}/>
      <ChartCard data={data} gameCount={2} stroke="#8884d8" dataKey="game2" percent={64}/>
      <ChartCard data={data} gameCount={3} stroke="pink" dataKey="game3" percent={92}/>
      <ChartCard data={data} gameCount={4} stroke="blue" dataKey="game4" percent={45}/>
      <ChartCard data={data} gameCount={5} stroke="purple" dataKey="game5" percent={80}/>
    </Panel>
  );
};
```


## app\test\[boardId]\_components\metrics\metricsData.tsx

```tsx
"use client";

import { FC } from "react";
import "./../../style-test.css";

interface MetricsDta {
  average: number;
  median: number;
  min: number;
  max: number;
  std?: number;
  range?: number;
}

export const MetricsData: FC<MetricsDta> = ({
  average,
  median,
  max,
  min,
  std,
  range,
}) => {
  return (
    <div className="values_analytics">
      <div className="analytics__title">
        <h2>
          <strong>Metrics</strong>
        </h2>
        <h2>
          <strong>Value</strong>
        </h2>
      </div>
      <hr />
      <div className="analytics__title">
        <h2>Average value (AVR)</h2>
        <h2>{average}</h2>
      </div>
      <div className="analytics__title">
        <h2>Median (MEDIAN)</h2>
        <h2>{median}</h2>
      </div>
      <div className="analytics__title">
        <h2>Minimum value (MIN)</h2>
        <h2>{min}</h2>
      </div>
      <div className="analytics__title">
        <h2>Maximum value (MAX)</h2>
        <h2>{max}</h2>
      </div>
      {std && (
        <div className="analytics__title">
          <h2>Standard Deviation (STD)</h2>
          <h2>{std}</h2>
        </div>
      )}
      {range && (
        <div className="analytics__title">
          <h2>Range (RANGE)</h2>
          <h2>{range}</h2>
        </div>
      )}
      <hr/>
    </div>
  );
};
```


## app\test\[boardId]\_components\panels\bottom-panel.tsx

```tsx
import { Panel, useEdges, useNodes } from "reactflow";
import { ToolButton } from "../ui/ToolButton";
import { Play, RotateCcw, Pause } from "lucide-react";
import CustomInput from "../ui/CustomInput";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import useStore from "@/app/store/store";
import { useEffect } from "react";
import { Iterations } from "../iterations";
import { useChangeEdgeType } from "@/app/store/use-custom-edge";
import { Games } from "../games";

export const BottomPanel = () => {
  const { isPlay, onPlay, onStop, onReset, time, iterations, games } = useAnimateScheme();
  const { setEdgeAnimated } = useStore();
  useEffect(() => {
    setEdgeAnimated(isPlay);
  }, [isPlay]);

  const edges = useEdges();
  const nodes = useNodes();
  const { error, setError } = useChangeEdgeType();

  return (
    <Panel position="bottom-center">
      <div className="bg-white rounded-md flex gap-x-2 items-center shadow-md py-2 px-2">
        <div className="mr-2 flex gap-x-2 items-center">
          <CustomInput label="Iterations" initialValue={iterations} />
          <CustomInput label="Time(s)" initialValue={time} />
          <CustomInput label="Games" initialValue={games} />
        </div>
        <ToolButton
          label="Play"
          isDisabled={error ? true : isPlay}
          onClick={onPlay}
          isActive={false}
          icon={Play}
          background="blue"
        />
        <ToolButton
          label="Pause"
          isDisabled={!isPlay}
          onClick={onStop}
          isActive={false}
          icon={Pause}
          background="red"
        />
        <ToolButton
          label="Reset"
          onClick={onReset}
          isActive={false}
          icon={RotateCcw}
          background="red"
        />
        <Iterations />
        <Games />
        <div className="text-xs text-center px-1">
          <label>Total count</label>
          <div>{edges.length + nodes.length}</div>
        </div>
      </div>
    </Panel>
  );
};
```


## app\test\[boardId]\_components\panels\EdgeTypePanel.tsx

```tsx
import React from "react";

import { useChangeEdgeType } from "@/app/store/use-custom-edge";
import { EdgesTypes } from "@/app/types/structs";
import useStore from "@/app/store/store";

export const EdgeTypePanel = () => {
  const { onChangeEdgesType } = useChangeEdgeType();
  const { edgesType: currentEdgesTypeValue } = useStore.getState();

  const handleChangeEdgesType = (type: EdgesTypes) => {
    onChangeEdgesType(type);
    useStore.setState({
      edgesType: type,
    });
  };

  return (
    <div className="flex gap-x-2 items-center">
      <button
        className={`bg-blue-100 rounded-md p-2 ${
          currentEdgesTypeValue === EdgesTypes.DEFAULT
            ? "bg-blue-500 text-white"
            : ""
        }`}
        onClick={() => handleChangeEdgesType(EdgesTypes.DEFAULT)}
      >
        Default
      </button>
      <button
        className={`bg-blue-100 rounded-md p-2 ${
          currentEdgesTypeValue === EdgesTypes.SMOOTH_STEP
            ? "bg-blue-500 text-white"
            : ""
        }`}
        onClick={() => handleChangeEdgesType(EdgesTypes.SMOOTH_STEP)}
      >
        SmoothStep
      </button>
      <button
        className={`bg-blue-100 rounded-md mr-16 p-2 ${
          currentEdgesTypeValue === EdgesTypes.BEZIER
            ? "bg-blue-500 text-white"
            : ""
        }`}
        onClick={() => handleChangeEdgesType(EdgesTypes.BEZIER)}
      >
        Bezier
      </button>
    </div>
  );
};
```


## app\test\[boardId]\_components\panels\toolbar.tsx

```tsx
import { StructType } from "@/app/types/structs";
import { ToolButton } from "../ui/ToolButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeftRight,
  Recycle,
  Play,
  Dices,
  Hourglass,
  Webhook,
  CheckCheck,
  Undo,
  Redo,
  BadgePlus,
  BadgeMinus,
  Eraser,
  Box, Layers, Zap, Scale, Sigma, Link2, Percent, GitMerge,
  ChevronDown,
  ChevronRight,
  CircleDot
} from "lucide-react";
import useStore, { RFState } from "@/app/store/store";
import { shallow } from "zustand/shallow";
import { useState } from "react";

interface ToolbarProps {
  canvasState: CanvasState;
  onClick: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  addNode: state.addNode,
});

export const Toolbar = () => {
  const { addNode } = useStore(selector, shallow);
  const { deleteAll } = useStore();
  const { edgeType, setEdgeType } = useStore();

  const [isTulaOpen, setIsTulaOpen] = useState(true);
  const [isSpecOpen, setIsSpecOpen] = useState(true);

  return (
    <div className="absolute top-40 left-2 flex flex-col gap-y-4">
      {/* Раздел TULA */}
      <div className="bg-white rounded-md p-1.5 flex gap-y-1 flex-col items-center shadow-md">
        <button
          onClick={() => setIsTulaOpen(!isTulaOpen)}
          className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <span>TULA</span>
          {isTulaOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        {isTulaOpen && (
          <div className="p-3 pt-0 grid grid-cols-3 gap-1 animate-in slide-in-from-top-1 duration-200">
            <ToolButton label="Source" onClick={() => addNode(StructType.Source)} isActive={false} icon={Play} />
            <ToolButton label="Pool" onClick={() => addNode(StructType.Pool)} isActive={false} icon={BadgePlus} />
            <ToolButton label="Consumer" onClick={() => addNode(StructType.Consumer)} isActive={false} icon={BadgeMinus} />
            <ToolButton label="Converter" onClick={() => addNode(StructType.Converter)} isActive={true} icon={Recycle} />
            <ToolButton label="Gate" onClick={() => addNode(StructType.Gate)} isActive={false} icon={ArrowLeftRight} />
            <ToolButton label="Random" onClick={() => addNode(StructType.Random)} isActive={false} icon={Dices} />
            <ToolButton label="Delay" onClick={() => addNode(StructType.Delay)} isActive={false} icon={Hourglass} />
            <ToolButton label="Trigger" onClick={() => addNode(StructType.Trigger)} isActive={false} icon={Webhook} />
            <ToolButton label="End" onClick={() => addNode(StructType.End)} isActive={false} icon={CheckCheck} />
          </div>
        )}
      </div>

      {/* Раздел SPEC */}
      <div className="bg-white rounded-md shadow-md overflow-hidden transition-all duration-200">
        <button
          onClick={() => setIsSpecOpen(!isSpecOpen)}
          className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <span>SPEC</span>
          {isSpecOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        {isSpecOpen && (
          <div className="p-3 pt-0 grid grid-cols-3 gap-1 animate-in slide-in-from-top-1 duration-200">
            <ToolButton label="Entity" onClick={() => addNode(StructType.Entity)} icon={Box} />
            <ToolButton label="State" onClick={() => addNode(StructType.State)} icon={Layers} />
            <ToolButton label="Event" onClick={() => addNode(StructType.Event)} icon={Zap} />
            <ToolButton label="Rule" onClick={() => addNode(StructType.Rule)} icon={Scale} />
            <ToolButton label="Operator" onClick={() => addNode(StructType.Operator)} icon={Sigma} />
          </div>
        )}
      </div>

      {/* Раздел GENERAL (всегда открыт) */}
      <div className="bg-white rounded-md p-3 shadow-md">
        <div className="text-xs font-semibold text-gray-500 mb-2 tracking-wider text-center">
          GENERAL
        </div>
        <ToolButton
          label="Empty (waypoint)"
          onClick={() => addNode(StructType.Empty)}
          isActive={false}
          icon={CircleDot}
        />

        <label>Edge type:</label>
        <Select value={edgeType} onValueChange={(value: any) => setEdgeType(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Edge type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="custom">Resource</SelectItem>
            <SelectItem value="probabilistic">Probabilistic</SelectItem>
            <SelectItem value="conditional">Conditional</SelectItem>
            <SelectItem value="trigger">Trigger</SelectItem>
            <SelectItem value="modifier">Modifier</SelectItem>
          </SelectContent>
        </Select>

        <div className="grid grid-cols-3 gap-1 mt-1">
          <ToolButton label="Undo" onClick={() => {}} isActive={false} icon={Undo} />
          <ToolButton label="Redo" onClick={() => {}} isActive={false} icon={Redo} />
          <ToolButton label="Eraser" onClick={deleteAll} isActive={false} icon={Eraser} />
        </div>
      </div>
    </div>
  );
};
```


## app\test\[boardId]\_components\sidebar\sidebar-board.tsx

```tsx
import Link from "next/link";
import React from "react";
import { BoardTitle } from "../BoardInfoModal/BoardTitle";

interface TestIdPageProps {
  params: {
    boardId: string;
  };
}
const BoardSidebar = ({ params }: TestIdPageProps) => {
  return (
    <aside
      id="sidebar"
      className="bg-black text-white w-[150px] pt-10 pl-5 absolute inset-y-0 left-0 
                transform md:relative md:translate-x-0 md:flex
                 md:flex-col gap-y-6"
      data-dev-hint="sidebar">
         <BoardTitle boardId={params.boardId} />
          <Link href="/editor">
            <span>Editor</span>
          </Link>
          {/* <Link href="/lineage">
            <span>Lineage</span>
          </Link>
          <Link href="/tests">
            <span>Tests</span>
          </Link>
          <Link href="/tables">
            <span>Tables</span>
          </Link>
          <Link href="/macros">
            <span>Macros</span>
          </Link> */}
    </aside>
  );
};

export default BoardSidebar;
```


## app\test\[boardId]\_components\ui\EditableText\EditableText.module.scss

```scss
.editableContainer {
  cursor: pointer;
}

.editableText {
  padding: 4px 8px;
  border: 1px solid transparent;
  border-radius: 4px;

  &:hover {
    border-color: #ccc;
    background: #f5f5f5;
  }
}

.editableInput {
  padding: 4px 8px;
  border: 1px solid #007bff;
  border-radius: 4px;
  outline: none;
  background: white;

  &:hover {
    border-color: #0056b3;
  }
}
```


## app\test\[boardId]\_components\ui\EditableText\EditableText.tsx

```tsx
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
```


## app\test\[boardId]\_components\ui\EditableText\index.ts

```ts
import EditableText from "./EditableText";

export { EditableText };
```


## app\test\[boardId]\_components\ui\CustomInput.tsx

```tsx
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
```


## app\test\[boardId]\_components\ui\DownloadBtn.tsx

```tsx
import {
  getTransformForBounds,
  useReactFlow,
  getRectOfNodes,
} from "reactflow";
import { ToolButton } from "./ToolButton";
import { Download } from "lucide-react";

import { toPng } from "html-to-image";

function downloadImage(dataUrl: any) {
  const a = document.createElement("a");
  a.setAttribute("download", "scheme.png");
  a.setAttribute("href", dataUrl);
  a.click();
}

const imageWidth = 1024;
const imageHeight = 768;

export const DownloadBtn = () => {
  const { getNodes } = useReactFlow();
  const onDownload = () => {
    const nodesBounds = getRectOfNodes(getNodes());
    const transform = getTransformForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.5,
      2
    );
    //@ts-ignore
    toPng(document.querySelector(".react-flow__viewport"), {
      backgroundColor: "white",
      width: imageWidth,
      height: imageHeight,
      style: {
        width: imageWidth,
        height: imageHeight,
        transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
      },
    }).then(downloadImage);
  };
  return (
    <div>
      <ToolButton
        label="Download PNG"
        onClick={onDownload}
        isActive={false}
        icon={Download}
      />
    </div>
  );
};
```


## app\test\[boardId]\_components\ui\index.ts

```ts
import CustomInput from "./CustomInput";
import { EditableText } from "./EditableText";
import { ToolButton } from "./ToolButton";
import { DownloadBtn } from "./DownloadBtn";

export { CustomInput, EditableText, ToolButton, DownloadBtn };
```


## app\test\[boardId]\_components\ui\ToolButton.tsx

```tsx
"use client";

import { LucideIcon } from "lucide-react";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/canvas";

interface ToolButtonProps {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  isActive?: boolean;
  isDisabled?: boolean;
  background?: string
}

export const ToolButton = ({
  label,
  icon: Icon,
  onClick,
  isActive,
  isDisabled,
  background = "black"
}: ToolButtonProps) => {
  return (
    <Hint label={label}>
      <Button
        disabled={isDisabled}
        onClick={onClick}
        size="icon"
        className={cn(
          "m-1 transition-colors",
          isActive
            ? "bg-blue-500 hover:bg-blue-600 text-white"
            : `bg-${background}`
        )}
        style={{ background: !isActive ? background : undefined }}
      >
        <Icon />
      </Button>
    </Hint>
  );
};
```


## app\test\[boardId]\_components\context-menu.tsx

```tsx
import React, { useCallback } from "react";
import { Node, useReactFlow } from "reactflow";
import "./../style-test.css"
import { useChangeEdgeType } from "@/app/store/use-custom-edge";

interface ContextMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  top?: any | boolean; // Выбор между числом и строкой для стилей
  left?: any | boolean;
  right?: any | boolean; // Необязательные свойства
  bottom?: any | boolean;
}

export default function ContextMenu({
  id,
  top,
  left,
  right,
  bottom,
  ...props
}: ContextMenuProps): React.JSX.Element {
  const { getNode, setNodes, addNodes, setEdges } = useReactFlow();
  const {setAnalytics} = useChangeEdgeType()
  const duplicateNode = useCallback(() => {
    const node: any = getNode(id);
    const position = {
      x: node.position.x + 50,
      y: node.position.y + 50,
    };

    addNodes({
      ...node,
      selected: false,
      dragging: false,
      id: `${node.id}-copy`,
      position,
    });
  }, [id, getNode, addNodes]);

  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id));
  }, [id, setNodes, setEdges]);


  return (
    <div
      style={{ top, left, right, bottom }}
      className="context-menu"
      {...props}
    >
      <button onClick={duplicateNode}>Copy</button>
      <button onClick={deleteNode}>Delete</button>
      <button onClick={() => setAnalytics(true)}>Analytics</button>
    </div>
  );
}
```


## app\test\[boardId]\_components\cursor.tsx

```tsx
"use client";

import { useOther } from "@/liveblocks.config";
import { MousePointer2 } from "lucide-react";
import { memo } from "react";

interface CursorProps {
  connectionId: number;
}

export const Cursor = memo(({ connectionId }: CursorProps) => {
  const info = useOther(connectionId, (user) => user?.info);
  const cursor = useOther(connectionId, (user) => user.presence.cursor);

  if (!cursor) {
    return null;
  }
  const { x, y } = cursor;
  const name = info?.name || "No name";

  return (
    <foreignObject
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        transform: `translateX(${x}px) translateY(${y}px)`,
      }}
      width={name.length * 10 + 24}
      height="50"
      viewBox="0 0 24 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <MousePointer2
        className="h-5 w-5"
        style={{
          fill: "red",
          color: "red",
        }}
      />
      <div
        className="absolute left-5 px-1.5 py-0.5 rounded-md text-xs text-white font-semibold"
        style={{ backgroundColor: "red" }}
      >
        {name}
      </div>
    </foreignObject>
  );
});

Cursor.displayName = "Cursor";
```


## app\test\[boardId]\_components\flow.tsx

```tsx
"use client";
import "reactflow/dist/style.css";
import ReactFlow, { Controls, Background, Panel } from "reactflow";
// import { shallow } from "zustand/shallow";
import { useMyPresence, useOthers } from "@/liveblocks.config";
import { Cursor } from "./cursor";
import { Toolbar } from "./panels/toolbar";
import { BottomPanel } from "./panels/bottom-panel";
import { DownloadBtn } from "./ui/DownloadBtn";
import useStore, { RFState } from "@/app/store/store";
import { edgeTypes, nodeTypes } from "@/app/types/structs";
import { useCallback, useEffect, useRef, useState } from "react";
import ContextMenu from "./context-menu";
import { useChangeEdgeType } from "@/app/store/use-custom-edge";
import { Metrics } from "./metrics/metrics";
import EditorComponent from "./editor/editorCoder";
import "./../style-test.css";
import { useRenameModal } from "@/app/store/use-rename-modal";
import BoardInfoModal from "./BoardInfoModal/BoardInfoModal";
import { ToolButton } from "./ui/ToolButton";
import { FileJson2, LayoutDashboard, HistoryIcon } from "lucide-react";
import { Loading } from "@/components/loading";
import { useVersionsHistory } from "@/app/hooks/useVersionsHistory";
import { Id } from "@/convex/_generated/dataModel";
import { useSaveHandlerOnHotkeyKeydown } from "@/app/hooks/useSaveHandlerOnKeydown";
import { HistoryModal } from "./HistoryModal";
import { useInitializeBoard } from "@/app/hooks/useInitializeBoard";
import { NodeDetailsPanel } from "@/components/NodeDetailsPanel";

// const selector = (state: RFState) => ({
//   nodes: state.nodes,
//   edges: state.edges,
//   deleteNode: state.deleteNode,
//   onNodesChange: state.onNodesChange,
//   onEdgesChange: state.onEdgesChange,
//   onConnect: state.onConnect,
//   addNode: state.addNode,
// });
interface FlowProps {
  boardId: string;
}

interface IContextMenu {
  id: string;
  top: number;
  left: number;
  right: number | boolean;
  bottom: number | boolean;
}

const Flow = ({ boardId }: FlowProps) => {
  useInitializeBoard(boardId as Id<"boards">);

  const {
    liveblocks: { isStorageLoading },
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    deleteNode,
  } = useStore();
  const { autoSave, manualSave } = useVersionsHistory(boardId);
  useSaveHandlerOnHotkeyKeydown(manualSave);

  const [{ cursor }, updateMyPresence] = useMyPresence();
  const others = useOthers();
  const { isVisibleEditor, setIsVisisble, isVisibleBoard, setIsVisisbleBoard } =
    useRenameModal();
  const [isVisibleHistory, setIsVisisbleHistory] = useState(false);
  const { analytics, setAnalytics } = useChangeEdgeType();
  const [menu, setMenu] = useState<IContextMenu | null>(null);
  const ref = useRef(null);

  const onNodeContextMenu = useCallback(
    (event: any, node: any) => {
      event.preventDefault();
      //@ts-ignore
      const pane = ref.current?.getBoundingClientRect();
      let menu = {
        id: node.id,
        top: event.clientY < pane.height - 200 && event.clientY,
        left: event.clientX < pane.width + 200 && event.clientX,
        right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
        bottom:
          event.clientY >= pane.height - 200 && pane.height - event.clientY,
      };
      setMenu(menu);
    },
    [setMenu]
  );

  const onPaneClick = useCallback(() => {
    setMenu(null);
  }, [setMenu]);

  useEffect(() => {
    if (isStorageLoading) return;

    autoSave();
  }, [nodes, edges, autoSave, isStorageLoading]);

  if (isStorageLoading) {
    <Loading />;
  }

  return (
    <main
      className="h-full w-full relative bg-neutral-100 touch-none"
      onPointerMove={(event) => {
        updateMyPresence({
          cursor: {
            x: Math.round(event.clientX),
            y: Math.round(event.clientY),
          },
        });
      }}
      onPointerLeave={() =>
        updateMyPresence({
          cursor: null,
        })
      }
    >
      {!isVisibleEditor && (
        <div className="z-10 w-full relative">
          <Toolbar />
        </div>
      )}

      {others.map(({ connectionId, presence }) => {
        if (presence.cursor === null) {
          return null;
        }
        return <Cursor key={connectionId} connectionId={connectionId} />;
      })}

      <ReactFlow
        ref={ref}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneClick={onPaneClick}
        onNodeContextMenu={onNodeContextMenu}
      >
        {menu && <ContextMenu onClick={onPaneClick} {...menu} />}
        <Controls position="bottom-right" />

        {isVisibleEditor && (
          <Panel position="top-left" className="position_panel">
            <EditorComponent />
          </Panel>
        )}

        <Panel position="top-center">
          <div className="bg-white rounded-md p-1.5 flex gap-x-2 items-center shadow-md">
            <ToolButton
              label="Editor"
              onClick={setIsVisisble}
              isActive={false}
              icon={FileJson2}
            />
            <DownloadBtn />
            <ToolButton
              label="Board"
              onClick={() => {
                if (isVisibleHistory) {
                  setIsVisisbleHistory(!isVisibleHistory);
                }

                setIsVisisbleBoard();
              }}
              isActive={false}
              icon={LayoutDashboard}
            />
            <ToolButton
              label="History"
              onClick={() => {
                if (isVisibleBoard) {
                  setIsVisisbleBoard();
                }

                setIsVisisbleHistory(!isVisibleHistory);
              }}
              isActive={false}
              icon={HistoryIcon}
            />
          </div>
        </Panel>

        {!analytics && !isVisibleBoard && isVisibleHistory && (
          <Panel position="top-right" className="info_panel">
            <HistoryModal
              boardId={boardId}
              onSaveRestoredVersion={manualSave}
              onClose={() => setIsVisisbleHistory(false)}
            />
          </Panel>
        )}

        {!analytics && !isVisibleHistory && isVisibleBoard && (
          <Panel position="top-right" className="info_panel">
            <BoardInfoModal boardId={boardId} handleSaveVersion={manualSave} />
          </Panel>
        )}
        <Background color="blue" gap={16} className="bg-blue-100" />
        {analytics && <Metrics />}
        <BottomPanel />
        <NodeDetailsPanel />
      </ReactFlow>
    </main>
  );
};

export default Flow;
```


## app\test\[boardId]\_components\games.tsx

```tsx
"use client";

import { useAnimateScheme } from "@/app/store/use-animate-scheme";

export const Games = () => {
  const {  games, gamesCount } = useAnimateScheme();

  return (
    <div className="text-xs text-center px-2">
      <label>Games</label>
      <div className="flex gap-x-3 items-center">
        <div>{gamesCount}</div>
        <div>/</div>
        <div>{games}</div>
      </div>
    </div>
  );
};
```


## app\test\[boardId]\_components\iterations.tsx

```tsx
"use client";

import { useAnimateScheme } from "@/app/store/use-animate-scheme";

export const Iterations = () => {
  const { iterationsCount, iterations } = useAnimateScheme();

  return (
    <div className="text-xs text-center px-2">
      <label>Iterations</label>
      <div className="flex gap-x-3 items-center">
        <div>{iterationsCount}</div>
        <div>/</div>
        <div>{iterations}</div>
      </div>
    </div>
  );
};
```


## app\test\[boardId]\layout.tsx

```tsx
import { BoardTitle } from "./_components/BoardInfoModal/BoardTitle";
import BoardSidebar from "./_components/sidebar/sidebar-board";

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: {
    boardId: string;
  };
}

const DashboardLayout = ({ children, params }: DashboardLayoutProps) => {
  return (
    // <main className="relative min-h-screen md:flex overflow-hidden">
    //   <BoardSidebar params={params}/>
    //   <main
    //     id="content"
    //     className="flex-1 bg-gray-100 max-h-screen overflow-y-auto"
    //   >
        <div className="max-w-full mx-auto h-full">
                   {/* <InfoBoard boardId={params.boardId} /> */}
          <div className="h-full">{children}</div>
        </div>
    //    </main>
    //  </main>
  );
};

export default DashboardLayout;
```


## app\test\[boardId]\page.tsx

```tsx
import Flow from "./_components/Flow";
import { Room } from "@/components/room";
import { Loading } from "@/components/loading";

interface TestIdPageProps {
  params: {
    boardId: string;
  };
}

const TestIdPage = ({ params }: TestIdPageProps) => {
  return (
    <Room roomId={params.boardId} fallback={<Loading />}>
      <Flow boardId={params.boardId} />
    </Room>
  );
};

export default TestIdPage;
```


## app\test\[boardId]\rahmankulova.md

```md
# Project Structure

```
_components/
  _structs/
    nodeComponents/
      consumerNode.tsx
      converterNode.tsx
      delayNode.tsx
      endNode.tsx
      gateNode.tsx
      nodeStyle.css
      poolNode.tsx
      randomNode.tsx
      sourceNode.tsx
      styled-node.tsx
    custom-edge.tsx
    custom-node.tsx
  BoardInfoModal/
    BoardInfoModal.module.scss
    BoardInfoModal.tsx
    BoardTitle.tsx
  editor/
    editor.module.scss
    editorCoder.tsx
  HistoryModal/
    CollapsibleGroup/
      CollapsibleGroup.module.scss
      CollapsibleGroup.tsx
      index.ts
    HistoryItem/
      HistoryItem.module.scss
      HistoryItem.tsx
      index.ts
    datepicker.css
    HistoryModal.module.scss
    HistoryModal.tsx
    index.ts
  metrics/
    chart.tsx
    chartCard.tsx
    circleChart.tsx
    metrics.tsx
    metricsData.tsx
  panels/
    bottom-panel.tsx
    EdgeTypePanel.tsx
    toolbar.tsx
  sidebar/
    sidebar-board.tsx
  ui/
    EditableText/
      EditableText.module.scss
      EditableText.tsx
      index.ts
    CustomInput.tsx
    DownloadBtn.tsx
    index.ts
    ToolButton.tsx
  context-menu.tsx
  cursor.tsx
  flow.tsx
  games.tsx
  iterations.tsx
layout.tsx
page.tsx
style-test.css
```


## _components\_structs\nodeComponents\consumerNode.tsx

```tsx
"use client";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect } from "react";
import {
  Edge,
  Node,
  NodeResizer,
  useEdges,
  useNodeId,
  useNodes,
} from "reactflow";
import useStore from "@/app/store/store";
import { StructType } from "@/app/types/structs";
import { StyledNode } from "./styled-node";

interface DataProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
  };
  selected: boolean;
}

const ConsumerNode = ({
  data: { label, struct, name },
  selected,
}: DataProps) => {
  const { isPlay, onStop, onReset, time } = useAnimateScheme();
  const { setNodeLabel, getEdgeValues } = useStore();
  const nodeId = useNodeId();
  const edges = useEdges<any>();
  const nodes = useNodes<any>();

  useEffect(() => {
    let intervalId = null;
    if (nodeId === null) return;
    if (!isPlay) {
      setNodeLabel(nodeId, 0);
    } else {
      setNodeLabel(nodeId, 1);
      let sourceEdge: Edge<Number> = edges.find(
        (edge) => edge?.target === nodeId
      )!;
      // тут в sourceEdge.data хранится значение количество ресурсов
      let targetEdge: Edge<Number> = edges.find(
        (edge) => edge?.source === nodeId
      )!;

      // тут в targetEdge.data хранится значение количества млсекунд * 1000 - то что задержка

      let targetNodeId: Node<any> = nodes.find(
        (node) => node.id === targetEdge?.target
      )!;
      let initialData = +sourceEdge?.data! || 0;

      intervalId = setInterval(() => {
        // Увеличиваем значение sourceEdge.data каждую секунду на 1
        initialData += +sourceEdge?.data!;

        // Обновляем метку узла с новым значением sourceEdge.data
        setNodeLabel(targetNodeId?.id, +initialData);
      }, time * 1000); // Интервал в миллисекундах (1000 миллисекунд = 1 секунда)
    }
    return () => clearInterval(intervalId!);
  }, [isPlay, onStop, onReset]);

  return (
    <>
      <NodeResizer
        color="blue"
        isVisible={selected}
        minWidth={45}
        minHeight={45}
      />
      <StyledNode struct={struct} label={label} name={name} />
    </>
  );
};

export default memo(ConsumerNode);
```


## _components\_structs\nodeComponents\converterNode.tsx

```tsx
"use client";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect } from "react";
import { Edge, NodeResizer, useEdges, useNodeId, useNodes } from "reactflow";
import useStore from "@/app/store/store";
import { StructType } from "@/app/types/structs";
import { StyledNode } from "./styled-node";

interface DataProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
  };
  selected: boolean;
}

const ConverterNode = ({
  data: { label, struct, name },
  selected,
}: DataProps) => {
  const { isPlay, onStop, onReset, time } = useAnimateScheme();
  const { setNodeLabel, getEdgeValues } = useStore();
  const nodeId = useNodeId();
  const edges = useEdges<any>();
  const nodes = useNodes<any>();

  useEffect(() => {
    let intervalId = null;
    if (isPlay) {


      let newEdges: Edge[] = edges.filter((edge) => edge.target === nodeId)
      let nodeIds: string[] = newEdges.map((edge) => edge.source);

      if (nodeIds.length > 0) {
        nodeIds.forEach(nodeId => {
            let foundNode = nodes.find(node => node.id === nodeId);
            let edge = edges.find(edge => edge.source === foundNode?.id)
            if (foundNode) {
                if (+foundNode.data?.label > edge?.data) {
                    setNodeLabel(foundNode.id, foundNode.data?.label - edge?.data);
                }
            }
        });
    }

      const sumOfData = newEdges.reduce((accumulator, currentEdge) => {
        return accumulator + (+currentEdge.data || 0); 
      }, 0);
      intervalId = setInterval(() => {


        setNodeLabel(nodeId!, (parseInt(label) + sumOfData));
      }, time * 1000);
    }

    return () => clearInterval(intervalId!);

  }, [isPlay, onStop, onReset, label]);

  return (
    <>
      <NodeResizer
        color="blue"
        isVisible={selected}
        minWidth={45}
        minHeight={45}
      />
      <StyledNode struct={struct} label={label} name={name} />
    </>
  );
};

export default memo(ConverterNode);
```


## _components\_structs\nodeComponents\delayNode.tsx

```tsx
"use client";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect } from "react";
import {
  Edge,
  Node,
  NodeResizer,
  useEdges,
  useNodeId,
  useNodes,
} from "reactflow";
import useStore from "@/app/store/store";
import { StructType } from "@/app/types/structs";
import { StyledNode } from "./styled-node";

interface DataProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
  };
  selected: boolean;
}

const DelayNode = ({ data: { label, struct, name }, selected }: DataProps) => {
  const { isPlay, onStop, onReset, time } = useAnimateScheme();
  const { setNodeLabel, getEdgeValues } = useStore();
  const nodeId = useNodeId();
  const edges = useEdges<any>();
  const nodes = useNodes<any>();

  useEffect(() => {
    let intervalId = null;
    if (!isPlay) {
      setNodeLabel(nodeId!, 0);
    } else {
      setNodeLabel(nodeId!, 1);
      let sourceEdge: Edge<any> = edges.find((edge) => edge?.target === nodeId)!;
      // тут в sourceEdge.data хранится значение количество ресурсов
      let targetEdge: Edge<any> = edges.find((edge) => edge?.source === nodeId)!;

      // тут в targetEdge.data хранится значение количества млсекунд * 1000 - то что задержка

      let targetNodeId: Node<any> = nodes.find(
        (node) => node.id === targetEdge?.target
      )!;
      let initialData = +sourceEdge?.data || 0;

      intervalId = setInterval(() => {
        // Увеличиваем значение sourceEdge.data каждую секунду на 1
        initialData += +sourceEdge?.data;

        // Обновляем метку узла с новым значением sourceEdge.data
        setNodeLabel(targetNodeId?.id, +initialData);
      }, time * 1000); // Интервал в миллисекундах (1000 миллисекунд = 1 секунда)
    }
    return () => clearInterval(intervalId!);
  }, [isPlay, onStop, onReset]);

  return (
    <>
      <NodeResizer
        color="blue"
        isVisible={selected}
        minWidth={45}
        minHeight={45}
      />
      <StyledNode struct={struct} label={label} name={name} />
    </>
  );
};

export default memo(DelayNode);
```


## _components\_structs\nodeComponents\endNode.tsx

```tsx
"use client";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect } from "react";
import {
  Edge,
  Node,
  NodeResizer,
  useEdges,
  useNodeId,
  useNodes,
} from "reactflow";
import useStore from "@/app/store/store";
import { StructType } from "@/app/types/structs";
import { StyledNode } from "./styled-node";

interface DataProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
  };
  selected: boolean;
}

const EndNode = ({ data: { label, struct, name }, selected }: DataProps) => {
  const { isPlay, onStop, onReset, time } = useAnimateScheme();
  const { setNodeLabel, getEdgeValues } = useStore();
  const nodeId = useNodeId();
  const edges = useEdges<any>();
  const nodes = useNodes<any>();

  useEffect(() => {
    let intervalId = null;
    if (!isPlay) {
      setNodeLabel(nodeId!, 0);
    } else {
      setNodeLabel(nodeId!, 1);
      let sourceEdge: Edge<any> = edges.find((edge) => edge?.target === nodeId)!;
      // тут в sourceEdge.data хранится значение количество ресурсов
      let targetEdge: Edge<any> = edges.find((edge) => edge?.source === nodeId)!;

      // тут в targetEdge.data хранится значение количества млсекунд * 1000 - то что задержка

      let targetNodeId: Node<any> = nodes.find(
        (node) => node.id === targetEdge?.target
      )!;
      let initialData = +sourceEdge?.data || 0;

      intervalId = setInterval(() => {
        // Увеличиваем значение sourceEdge.data каждую секунду на 1
        initialData += +sourceEdge?.data;

        // Обновляем метку узла с новым значением sourceEdge.data
        setNodeLabel(targetNodeId?.id, +initialData);
      }, time * 1000); // Интервал в миллисекундах (1000 миллисекунд = 1 секунда)
    }
    return () => clearInterval(intervalId!);
  }, [isPlay, onStop, onReset]);

  return (
    <>
      <NodeResizer
        color="blue"
        isVisible={selected}
        minWidth={45}
        minHeight={45}
      />
      <StyledNode struct={struct} label={label} name={name} />
    </>
  );
};

export default memo(EndNode);
```


## _components\_structs\nodeComponents\gateNode.tsx

```tsx
"use client";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect } from "react";
import {
  Edge,
  Node,
  NodeResizer,
  useEdges,
  useNodeId,
  useNodes,
} from "reactflow";
import useStore from "@/app/store/store";
import { StructType } from "@/app/types/structs";
import { StyledNode } from "./styled-node";

interface DataProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
  };
  selected: boolean;
}

const GateNode = ({ data: { label, struct, name }, selected }: DataProps) => {
  const { isPlay, onStop, onReset, time } = useAnimateScheme();
  const { setNodeLabel, getEdgeValues } = useStore();
  const nodeId = useNodeId();
  const edges = useEdges<any>();
  const nodes = useNodes<any>();

  useEffect(() => {
    let intervalId = null;
    if (!isPlay) {
      setNodeLabel(nodeId!, 0);
    } else {
      setNodeLabel(nodeId!, 1);

      let sourceEdge: Edge<any> = edges.find(
        (edge) => edge?.target === nodeId
      )!;
      // тут в sourceEdge.data хранится значение количество ресурсов
      let targetEdge: Edge<any> = edges.find(
        (edge) => edge?.source === nodeId
      )!;

      // тут в targetEdge.data хранится значение количества млсекунд * 1000 - то что задержка
      let targetNodeId: Node<any> = nodes.find(
        (node) => node.id === targetEdge?.target
      )!;
      let initialData = +sourceEdge?.data || 0;

      intervalId = setInterval(() => {
        // Увеличиваем значение sourceEdge.data каждую секунду на 1
        initialData += +sourceEdge?.data;

        // Обновляем метку узла с новым значением sourceEdge.data
        setNodeLabel(targetNodeId?.id, +initialData);
      }, time * 1000); // Интервал в миллисекундах (1000 миллисекунд = 1 секунда)
    }
    return () => clearInterval(intervalId!);
  }, [isPlay, onStop, onReset]);

  return (
    <>
      <NodeResizer
        color="blue"
        isVisible={selected}
        minWidth={45}
        minHeight={45}
      />
      <StyledNode struct={struct} label={label} name={name} />
    </>
  );
};

export default memo(GateNode);
```


## _components\_structs\nodeComponents\nodeStyle.css

```css
.delayNode{
    border: 2px solid red;
    position: relative;
    height: 50px;
    width: 50px;
    overflow: hidden;
    border-radius: 5px;
    display: flex;
    background: white;
    justify-content: center;
    align-items: center;
    font-weight: bold;
}

.consumerNode{
    border: 2px solid blue;
    position: relative;
    height: 50px;
    width: 50px;
    overflow: hidden;
    border-radius: 100%;
    display: flex;
    background: white;
    justify-content: center;
    align-items: center;
    font-weight: bold;
}

.converterNode{
    border: 2px solid blue;
    position: relative;
    height: 50px;
    width: 50px;
    overflow: hidden;
    border-radius: 100%;
    display: flex;
    background: white;
    justify-content: center;
    align-items: center;
    font-weight: bold;
}

.endNode{
    border: 2px solid black;
    position: relative;
    height: 50px;
    width: 50px;
    overflow: hidden;
    border-radius: 5px;
    display: flex;
    background: white;
    justify-content: center;
    align-items: center;
    font-weight: bold;
}

.gateNode{
    border: 2px solid blue;
    position: relative;
    height: 50px;
    width: 50px;
    overflow: hidden;
    border-radius: 100%;
    display: flex;
    background: white;
    justify-content: center;
    align-items: center;
    font-weight: bold;
}

.poolNode{
    border: 2px solid blue;
    position: relative;
    height: 50px;
    width: 50px;
    overflow: hidden;
    border-radius: 100%;
    display: flex;
    background: white;
    justify-content: center;
    align-items: center;
    font-weight: bold;
}

.sourceNode{
    border: 2px solid greenyellow;
    position: relative;
    height: 50px;
    width: 50px;
    overflow: hidden;
    border-radius: 100%;
    display: flex;
    background: white;
    justify-content: center;
    align-items: center;
    font-weight: bold;
}

.randomNode{
    border: 2px solid red;
    position: relative;
    height: 50px;
    width: 50px;
    overflow: hidden;
    border-radius: 5px;
    display: flex;
    background: white;
    justify-content: center;
    align-items: center;
    font-weight: bold;
}
```


## _components\_structs\nodeComponents\poolNode.tsx

```tsx
"use client";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect } from "react";
import {
  Edge,
  Node,
  NodeResizer,
  useEdges,
  useNodeId,
  useNodes,
} from "reactflow";
import useStore from "@/app/store/store";
import { StructType } from "@/app/types/structs";
import { StyledNode } from "./styled-node";

interface DataProps {
  id: string;
  data: {
    label: string;
    struct: StructType;
    name?: string | undefined;
  };
  selected: boolean;
}

const PoolNode = ({
  data: { label, struct, name },
  selected,
  id,
}: DataProps) => {
  const { isPlay, onStop, onReset, time, gamesCount, resetNodes } =
    useAnimateScheme();

  const { setNodeLabel, getEdgeValues } = useStore();
  const nodeId = useNodeId();
  const edges = useEdges<any>();
  const nodes = useNodes<any>();

  useEffect(() => {
    let intervalId = null;
    if (isPlay) {
      let newEdges = edges.filter((edge) => edge.target === nodeId);
      const sumOfData = newEdges.reduce((accumulator, currentEdge) => {
        return accumulator + (+currentEdge.data || 0);
      }, 0);
      intervalId = setInterval(() => {
        setNodeLabel(nodeId!, parseInt(label) + sumOfData);
      }, time * 1000);
    }
    return () => clearInterval(intervalId!);
  }, [isPlay, onStop, onReset, label, gamesCount]);

  return (
    <>
      <NodeResizer
        color="blue"
        isVisible={selected}
        minWidth={45}
        minHeight={45}
      />

      <StyledNode struct={struct} label={label} name={name} />
    </>
  );
};

export default memo(PoolNode);
```


## _components\_structs\nodeComponents\randomNode.tsx

```tsx
"use client";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect } from "react";
import {
  Edge,
  Node,
  NodeResizer,
  useEdges,
  useNodeId,
  useNodes,
} from "reactflow";
import useStore from "@/app/store/store";
import { StructType } from "@/app/types/structs";
import { StyledNode } from "./styled-node";

interface DataProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
  };
  selected: boolean;
}

const RandomNode = ({ data: { label, struct, name }, selected }: DataProps) => {
  const { isPlay, onStop, onReset, time } = useAnimateScheme();
  const { setNodeLabel, getEdgeValues } = useStore();
  const nodeId = useNodeId();
  const edges = useEdges<any>();
  const nodes = useNodes<any>();



  useEffect(() => {
    let intervalId = null;
    if (isPlay) {
      const initialValue = label || null
      let newEdges: Edge[] = edges.filter((edge) => edge.source === nodeId)
      let nodeIds: string[] = newEdges.map(edge => edge.target)      //идишники нод
      
    //   intervalId = setInterval(() => {

    //     setNodeLabel(nodeId, (parseInt(label) + sumOfData).toString());
    //   }, time * 1000);

    
    }
    return () => clearInterval(intervalId!);
  }, [isPlay, onStop, onReset, label]);

  return (
    <>
      <NodeResizer
        color="blue"
        isVisible={selected}
        minWidth={45}
        minHeight={45}
      />
      <StyledNode struct={struct} label={label} name={name} />
    </>
  );
};

export default memo(RandomNode);
```


## _components\_structs\nodeComponents\sourceNode.tsx

```tsx
"use client";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect } from "react";
import { Edge, NodeResizer, useEdges, useNodeId, useNodes } from "reactflow";
import useStore from "@/app/store/store";
import { StructType } from "@/app/types/structs";
import { StyledNode } from "./styled-node";

interface DataProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
  };
  selected: boolean;
}

const SourceNode = ({ data: { label, struct, name }, selected }: DataProps) => {
  const { isPlay, onStop, onReset, time } = useAnimateScheme();
  const { setNodeLabel, getEdgeValues } = useStore();
  const nodeId = useNodeId();
  const edges = useEdges();
  const nodes = useNodes();

  useEffect(() => {
    let intervalIds: NodeJS.Timeout[] = [];

    if (isPlay && nodeId) {
      let targetEdges: Edge[] = edges.filter((edge) => edge?.source === nodeId);
      targetEdges.forEach((edge) => {
        const targetNode = nodes.find((node) => node.id === edge.target);
        if (!targetNode) return;

        let initialData = 0;

        const intervalId = setInterval(() => {
          initialData += +edge.data;
          setNodeLabel(targetNode?.id!, +initialData);
        }, time * 1000);

        intervalIds.push(intervalId);
      });
    }
    return () => {
      intervalIds.forEach((intervalId) => clearInterval(intervalId));
    };
  }, [isPlay, onStop, onReset, edges, nodeId, nodes, time, setNodeLabel]);

  return (
    <>
      <NodeResizer
        color="blue"
        isVisible={selected}
        minWidth={45}
        minHeight={45}
      />
      <StyledNode struct={struct} label={label} name={name} />
    </>
  );
};

export default memo(SourceNode);
```


## _components\_structs\nodeComponents\styled-node.tsx

```tsx
"use client";
import {
  ArrowLeftRight,
  Recycle,
  Dices,
  Hourglass,
  Play,
  CheckCheck,
  LucideIcon,
  Minus,
} from "lucide-react";
import "./nodeStyle.css";
import { StructType } from "@/app/types/structs";
import { Handle, Position, useNodeId } from "reactflow";
import { useState } from "react";
import useStore from "@/app/store/store";

interface ITestNodeProps {
  struct: StructType;
  label: string;
  name?: string;
}

type StructStyles = {
  [key in StructType]: string;
};

interface StructIcons {
  [key: string]: LucideIcon;
}

const styleNode: StructStyles = {
  Consumer: "consumerNode",
  Converter: "converterNode",
  Delay: "delayNode",
  End: "endNode",
  Gate: "gateNode",
  Pool: "poolNode",
  Random: "randomNode",
  Source: "sourceNode",
};

const styleNodeIcon: any = {
  Source: <Play />,
  Converter: <Recycle />,
  Consumer: <Minus />,
  Delay: <Hourglass />,
  Gate: <ArrowLeftRight />,
  Random: <Dices />,
  End: <CheckCheck />,
};

export const StyledNode = ({ struct, label, name }: ITestNodeProps) => {
  const { setNodeName } = useStore();
  const nodeId = useNodeId();

  const [value, setValue] = useState(name);
  const onChange = (event: any) => {
    setValue(event.target.value);
    setNodeName(nodeId!, event.target.value);
  };

  return (
    <div>
      {struct !== StructType.Source && (
        <Handle type={"target"} position={Position.Left} />
      )}
      <div className={styleNode[struct]}>
        {struct in styleNodeIcon ? styleNodeIcon[struct] : label}
        {/* {label} */}
      </div>
      {struct !== StructType.End && (
        <Handle type="source" position={Position.Right} />
      )}
      <div className="h-full w-full flex justify-center">
        <input
          className="bg-transparent w-[50px] border-none text-xs font-bold text-center"
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};
```


## _components\_structs\custom-edge.tsx

```tsx
import { useChangeEdgeType } from "@/app/store/use-custom-edge";
import useStore from "@/app/store/store";
import React, { useEffect, useState } from "react";

import {
  BaseEdge,
  BezierEdge,
  EdgeLabelRenderer,
  EdgeProps,
  StepEdge,
  getBezierPath,
  getStraightPath,
} from "reactflow";

export default function CustomEdge(props: EdgeProps) {
  const {
    error,
    setError,
    currentEdgesType: currentType,
  } = useChangeEdgeType();
  const [localError, setLocalError] = useState<string | null>(null);

  const { setEdgeData } = useStore();
  const {
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    id,
    data: initalValue,
  } = props;

  const [inputValue, setInputValue] = useState<number>(initalValue ?? 1);
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const [basePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const onChange = (event: any) => {
    const newValue = event.target.value;

    if (typeof +newValue !== "number" || isNaN(+newValue)) {
      setLocalError("Must be a numeric");
      setError("error");
      setInputValue(newValue);
    } else {
      setLocalError(null);
      setError(null);
      setInputValue(newValue);
      setEdgeData(id, +newValue);
    }
  };

  useEffect(() => {
    if (typeof +inputValue !== "number" || isNaN(+inputValue)) {
      setLocalError("Must be a numeric");
      setError("error");
    } else {
      setLocalError(null);
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initalValue]);

  return (
    <>
      {currentType === "SmoothStep" && <StepEdge {...props} />}
      {currentType === "Default" && <BaseEdge path={basePath} {...props} />}
      {currentType == "Bezier" && <BezierEdge {...props} />}
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: "all",
          }}
          className="nodrag nopan"
        >
          <input
            className={
              localError
                ? "border-2 border-red-500 w-16 h-7 text-center rounded-sm"
                : "w-16 h-7 text-center rounded-sm"
            }
            value={inputValue}
            onChange={onChange}
          />
          {localError && (
            <p className="text-center text-2 font-bold text-red-500">
              {localError}
            </p>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
```


## _components\_structs\custom-node.tsx

```tsx
"use client";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect } from "react";
import { NodeResizer, useEdges, useNodeId } from "reactflow";
import useStore from "@/app/store/store";
import { StyledNode } from "./nodeComponents/styled-node";
import { StructType } from "@/app/types/structs";

interface DataProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
  };
  selected: boolean;
}

const CustomNode = ({ data: { label, struct, name }, selected }: DataProps) => {
  const { isPlay, time, onReset, isReset } = useAnimateScheme();
  const { setNodeLabel, getEdgeValues } = useStore();
  const nodeId = useNodeId();
  const edges = useEdges<any>();

  useEffect(() => {
    let newEdges = edges.filter((edge) => edge.target === nodeId);

    let { sourceStruct, sourceValue, targetValue } = getEdgeValues(
      newEdges[0]?.id
    );
  
    const sumOfData = newEdges.reduce((accumulator, currentEdge) => {
      return accumulator + (+currentEdge.data! || 0);
    }, 0);

    let intervalId: any;
    const intervalCallback = () => {
      setNodeLabel(nodeId!, parseInt(label) + sumOfData);
    };

    if (isPlay) {
      intervalId = setInterval(intervalCallback, time * 1000);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [label, nodeId, isPlay, onReset, setNodeLabel, edges]);

  return (
    <>
      <NodeResizer
        color="blue"
        isVisible={selected}
        minWidth={45}
        minHeight={45}
      />
      <StyledNode struct={struct} label={label} name={name} />
    </>
  );
};

export default memo(CustomNode);
```


## _components\BoardInfoModal\BoardInfoModal.module.scss

```scss
.board {
  background: white;
  height: 800px;
  width: 300px;
  z-index: 1000;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.board h1 {
  font-size: 16px !important;
  padding-bottom: 10px;
}

.hint_btn {
  background: transparent;
  font-size: 20px !important;
  font-weight: 700;
  color: black;
  padding: 0;
}

.content {
  width: 100%;
  height: 100%;
  position: relative;
}
.content__items {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.date_info {
  position: absolute;
  bottom: 1rem;
  > h2 {
    padding-bottom: 0.5rem;
  }
}

.description {
  display: flex;
  flex-direction: column;
  > textarea {
    height: 270px;
    padding: 1rem 0.5rem;
    background: rgb(233, 238, 252);
    border-radius: 10px;
    border: 1px dashed white;
    margin-bottom: 15px;
  }
}
.saveButton {
  padding: 5px 10px;
  background-color: #000000; /* Красный цвет */
  color: #fff; /* Белый цвет текста */
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.closeButton {
  top: 0;
  right: 0;
  padding: 5px 10px;
  background-color: #000000; /* Красный цвет */
  color: #fff; /* Белый цвет текста */
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.closeButton:hover {
  background-color: #cc0000; /* Темно-красный цвет при наведении */
}
```


## _components\BoardInfoModal\BoardInfoModal.tsx

```tsx
"use client";

import { useCallback, useState } from "react";
import { useQuery } from "convex/react";

import { useRenameModal } from "@/app/store/use-rename-modal";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useApiMutation } from "@/app/hooks/use-api-mutation";
import { useChangeEdgeType } from "@/app/store/use-custom-edge";
import useStore from "@/app/store/store";
import { Participants } from "@/app/board/[boardId]/_components/participants";
import { EdgeTypePanel } from "../panels/EdgeTypePanel";
import { BoardTitle } from "./BoardTitle";

import styles from "./BoardInfoModal.module.scss";

interface IBoardInfoModalProps {
  boardId: string;
  handleSaveVersion: () => void;
}

const BoardInfoModal = ({
  boardId,
  handleSaveVersion,
}: IBoardInfoModalProps) => {
  // const [description, setDescription] = useState("Тестовая доска для показа");
  const boardData = useQuery(api.board.get, {
    id: boardId as Id<"boards">,
  });
  const { title, description, edgesType } = useStore.getState();

  const { mutate: updateMetaInfo, pending: updateMetaInfoPending } =
    useApiMutation(api.board.updateMetaInfo);

  const { currentEdgesType } = useChangeEdgeType();
  // const [boardTitle, setBoardTitle] = useState(boardData?.title);
  const [boardDescription, setBoardDescription] = useState(description || "");

  const { setIsVisisbleBoard } = useRenameModal();

  const handleDescriptionChange = (event: any) => {
    setBoardDescription(event.target.value);
  };

  const handleSave = useCallback(async () => {
    useStore.setState({
      // title: boardData?.title,
      description: boardDescription,
      edgesType: currentEdgesType,
    });

    await updateMetaInfo({
      id: boardData?._id,
      title: boardData?.title,
      description: boardDescription,
      edgesType: currentEdgesType,
    })
      .then(() => {
        handleSaveVersion();
      })
      .catch((e) => {
        console.log(e);
      });
  }, [
    boardData?._id,
    boardData?.title,
    boardDescription,
    currentEdgesType,
    handleSaveVersion,
    updateMetaInfo,
  ]);

  return (
    <div className={styles.board}>
      <div className={styles.content}>
        <div className={styles.content__items}>
          <div className={styles.header}>
            <BoardTitle boardId={boardId} />
            <button className={styles.closeButton} onClick={setIsVisisbleBoard}>
              &#x2716;
            </button>
          </div>

          <div>
            <h1>
              <strong>Owner:</strong> {boardData?.authorName}
            </h1>
            <h1>
              <strong>Participants:</strong>
            </h1>
            <Participants />
          </div>
          <div className={styles.description}>
            <h1>
              <strong>Description:</strong>
            </h1>
            <textarea
              value={boardDescription}
              onChange={handleDescriptionChange}
              className={styles.description}
            />
            <button
              className={styles.saveButton}
              onClick={handleSave}
              disabled={updateMetaInfoPending}
            >
              Save
            </button>
          </div>
          <div>
            <h1>
              <strong>Connection type:</strong>
            </h1>
            <EdgeTypePanel />
          </div>

          <div className={styles.date_info}>
            <h2>
              <strong>Created: </strong>27.10.2024{" "}
            </h2>
            <h2>
              <strong>Updated: </strong>27.10.2024{" "}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardInfoModal;
```


## _components\BoardInfoModal\BoardTitle.tsx

```tsx
"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { Poppins } from "next/font/google";

import { cn } from "@/utils/canvas";
import { Hint } from "@/components/hint";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";
import { useRenameModal } from "@/app/store/use-rename-modal";
import styles from "./BoardInfoModal.module.scss";

interface InfoProps {
  boardId: string;
}

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

const TabSeparator = () => {
  return <div className="text-neutral-300 px-1.5">|</div>;
};

export const BoardTitle = ({ boardId }: InfoProps) => {
  const { onOpen } = useRenameModal();

  const data = useQuery(api.board.get, {
    id: boardId as Id<"boards">,
  });

  // if (!data) return <div>No info</div>;

  return (
    <div>
      <Hint label="Edit title" side="bottom" sideOffset={10}>
        <Button
          className={styles.hint_btn}
          onClick={() => onOpen(data?._id as string, data?.title || "")}
        >
          <h2>{data?.title}</h2>
        </Button>
      </Hint>
    </div>
  );
};
```


## _components\editor\editor.module.scss

```scss
.editor_btn {
  background: rgb(24, 24, 24);
  width: 450px;
  display: flex;
  color: white;
  justify-content: space-between;
}
.generate {
  margin: 20px;
  width: 100%;
}
.reset {
  margin: 20px;
  width: 100%;
}
```


## _components\editor\editorCoder.tsx

```tsx
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
```


## _components\HistoryModal\CollapsibleGroup\CollapsibleGroup.module.scss

```scss
.group {
  margin-bottom: 1rem;

  &Header {
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;

    color: #5f6368;
    font-size: 14px;
    padding: 8px 0;
    border-bottom: 1px solid #e0e0e0;
    margin-bottom: 12px;

    &:hover {
      background: #f1f3f5;
    }
  }

  &Content {
    padding: 0.5rem;
  }
}

.toggleIcon {
}
```


## _components\HistoryModal\CollapsibleGroup\CollapsibleGroup.tsx

```tsx
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
```


## _components\HistoryModal\CollapsibleGroup\index.ts

```ts
export { CollapsibleGroup } from "./CollapsibleGroup";
```


## _components\HistoryModal\HistoryItem\HistoryItem.module.scss

```scss
.versionItem {
  position: relative;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: background 0.1s;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 8px;
  border: 1px solid #e0e0e0;

  &:hover {
    background: #f8f9fa;
  }

  &.selected {
    border-color: #1971c2;
    background-color: #f8f9fa;
  }

  &Header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 4px;
  }

  &Meta {
    display: flex;
    gap: 0.5rem;
    color: #868e96;
    font-size: 0.875rem;

    &Time {
      font-size: 14px;
      color: #202124;
    }
  }

  &Content {
    display: flex;
    flex-direction: column;

    &Message {
      font-size: 14px;
      color: #5f6368;
      margin-top: 8px;
      font-style: italic;
      padding-left: 6px;
    }

    &Colabarator {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #5f6368;
      padding-left: 8px;
    }
  }

  &Actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 16px;
  }
}

.swatch {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #26a69a;
}
```


## _components\HistoryModal\HistoryItem\HistoryItem.tsx

```tsx
import { FC, useCallback, useState } from "react";
import { useConvex, useMutation } from "convex/react";
import { toast } from "sonner";

import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/app/hooks/use-api-mutation";
import { Button } from "@/components/ui/button";
import { useRestoreVersionHandler } from "@/app/hooks/useRestoreVersionHandler";
import { EditableText } from "../../ui";
import styles from "./HistoryItem.module.scss";
import useStore from "@/app/store/store";

type THistoryItemProps = {
  boardId: string;
  version: Doc<"boardsHistory">;
  isSelected: boolean;
  onClick: (versionId: Id<"boardsHistory">) => void;
  onSaveRestoredVersion: (
    isRestore?: boolean,
    restoredVersionTime?: number,
    restoredVersionMessage?: string
  ) => void;
};

export const HistoryItem: FC<THistoryItemProps> = ({
  boardId,
  version,
  isSelected: isCurrent,
  onClick,
  onSaveRestoredVersion,
}) => {
  const convex = useConvex();
  const { onDeleteVersion, setPreviousState } = useStore();

  const { mutate: updateVersionMessage, pending: isVersionMessageUpdating } =
    useApiMutation(api.boardsHistory.updateVersionMessage);
  const { handleRestore } = useRestoreVersionHandler({
    boardId: boardId as Id<"boards">,
    onSaveRestoredVersion,
  });
  const deleteVersion = useMutation(api.boardsHistory.deleteVersion);

  const [isHovered, setIsHovered] = useState(false);

  const handleUpdateHistoryItemMessage = useCallback(
    async (versionId: Id<"boardsHistory">, message: string) => {
      await updateVersionMessage({ id: versionId, message })
        .then(() => {
          toast.success(`Версия успешно переименована`);
        })
        .catch(() => toast.error("Ошибка при переименовании версии"));
    },
    []
  );

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (isCurrent) {
        onClick(version._id);
      }

      await deleteVersion({ versionId: version._id });

      const reinitState = await convex.query(api.board.loadBoardState, {
        boardId: boardId as Id<"boards">,
      });

      await onDeleteVersion(reinitState);
      await setPreviousState({
        nodes: reinitState.nodes,
        edges: reinitState.edges,
        version: reinitState.version,
        createdAt: reinitState._creationTime,
      });

      toast.success("Version deleted");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div
      className={`${styles.versionItem} ${isCurrent ? styles.selected : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(version._id)}
    >
      <div className={styles.versionItemMeta}>
        <span className="version-type">
          {version.type === "snapshot" ? "Snapshot" : "Patch"}
        </span>
        <span className={styles.versionItemMetaTime}>
          {new Date(version._creationTime).toLocaleDateString()}
        </span>
      </div>

      <div className={styles.versionItemContent}>
        <div className={styles.versionItemHeader}>
          <EditableText
            initialValue={
              version.message ||
              new Date(version._creationTime).toLocaleTimeString()
            }
            onBlur={(message: string) => {
              handleUpdateHistoryItemMessage(version._id, message);
            }}
          />
        </div>
        <div className={styles.versionItemContentColabarator}>
          <div className={styles.swatch} />
          <span>{version.authorName || version.authorId}</span>
        </div>
        {version.restoreByTime && (
          <div
            className={styles.versionItemContentMessage}
          >{`Востановлена версия от ${new Date(version.restoreByTime).toLocaleTimeString()}`}</div>
        )}
      </div>

      {isHovered && (
        <div className={styles.versionItemActions}>
          {isCurrent && (
            <Button
              variant="default"
              size="sm"
              onClick={() => handleRestore(version.version)}
            >
              Восстановить
            </Button>
          )}
          {version.version !== 0 && (
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              Удалить
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
```


## _components\HistoryModal\HistoryItem\index.ts

```ts
export { HistoryItem } from "./HistoryItem";
```


## _components\HistoryModal\datepicker.css

```css

```


## _components\HistoryModal\HistoryModal.module.scss

```scss
.historySidebar {
  background: white;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  height: 100vh;
  width: 432px;
  z-index: 1000;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.content {
  width: 100%;
  height: 100%;
  position: relative;
  overflow-y: auto;
  padding-right: 16px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.title {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
}

.revisionsList {
  flex: 1;
  overflow-y: auto;
}

.switch {
  width: 42px;
  height: 25px;
  background-color: #4e4c4cb3;
  border-radius: 9999px;
  position: relative;
  box-shadow: 0 2px 10px #00000080;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  &:focus {
    // box-shadow: 0 0 0 2px black;
  }

  &[data-state="checked"] {
    background-color: rgb(61, 175, 72);
  }

  &Wrapper {
    display: flex;
    align-items: center;
    margin: 16px 0px;
  }

  &Thumb {
    display: block;
    width: 21px;
    height: 21px;
    background-color: white;
    border-radius: 9999px;
    box-shadow: 0 2px 2px #00000080;
    transition: transform 100ms;
    transform: translateX(2px);
    will-change: transform;
    &[data-state="checked"] {
      transform: translateX(19px);
    }
  }

  &Label {
    padding-right: 16px;
    font-size: 16px;
    line-height: 1;
    user-select: none;
  }
}

.searchInput {
  margin-bottom: 16px;
  border-color: hsl(218deg 34.85% 74.85%);
  outline: none;

  &:focus-visible {
    box-shadow: none;
    border-color: #3498db;
  }
}

.datePickerLabel {
  font-size: 16px;
  line-height: 1;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  padding-bottom: 8px;
}

.datePickerInput {
  & input {
    border: 1px solid hsl(218deg 34.85% 74.85%);
    border-radius: calc(0.5rem - 2px);
    padding: 0.5rem 0.75rem;
    padding-left: 32px;
    font-size: 0.875rem;
    line-height: 1.25rem;

    &:focus-visible {
      border-color: #3498db;
      outline: none;
    }
  }

  & button {
    font-size: 13px;
  }

  & svg {
    padding-top: 10px !important;
  }
}

.dateGroup {
  color: #5f6368;
  font-size: 14px;
  padding: 8px 0;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 12px;
}

.tile {
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 8px;
  border: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  cursor: pointer;

  &.selected {
    border-color: #1a73e8;
    background-color: #f8f9fa;
  }
}

.tileHeader {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
}

.time {
  font-size: 14px;
  color: #202124;
}

.restoreButton {
  margin-left: auto;
  background: none;
  border: none;
  color: #1a73e8;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  margin-top: 4px;
  align-self: flex-end;

  &:hover {
    background: #e8f0fe;
  }
}

.collaborator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #5f6368;
  padding-left: 8px;
}

.swatch {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #26a69a;
}

.message {
  font-size: 14px;
  color: #5f6368;
  margin-top: 8px;
  font-style: italic;
  padding-left: 6px;
}

.sortType {
  cursor: pointer;
  margin-left: auto;
}

.spinnerWrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding-block: 16px;
}

// SCSS
.spinner {
  $size: 50px;
  $color: #3498db;
  $thickness: 4px;
  $animation-duration: 1s;

  display: inline-block;
  margin-left: auto;
  margin-right: auto;
  align-self: center;
  width: $size;
  height: $size;
  border: $thickness solid rgba($color, 0.2);
  border-radius: 50%;
  border-top-color: $color;
  animation: spin $animation-duration ease-in-out infinite;
  -webkit-animation: spin $animation-duration ease-in-out infinite;
  position: relative;

  // Вариант с дополнительными градиентами
  &::after {
    content: "";
    position: absolute;
    top: -$thickness;
    left: -$thickness;
    right: -$thickness;
    bottom: -$thickness;
    border-radius: 50%;
    border: $thickness solid transparent;
    border-top-color: rgba($color, 0.5);
    animation: spin ($animation-duration * 1.5) ease-in-out infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
      -webkit-transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
      -webkit-transform: rotate(360deg);
    }
  }

  // Модификаторы размеров
  &--small {
    width: $size * 0.5;
    height: $size * 0.5;
    border-width: $thickness * 0.5;
  }

  &--large {
    width: $size * 2;
    height: $size * 2;
    border-width: $thickness * 1.5;
  }

  // Цветовые варианты
  &--primary {
    border-top-color: $color;
    &::after {
      border-top-color: rgba($color, 0.5);
    }
  }

  &--secondary {
    border-top-color: #2ecc71;
    &::after {
      border-top-color: rgba(#2ecc71, 0.5);
    }
  }

  &--white {
    border-top-color: white;
    &::after {
      border-top-color: rgba(white, 0.5);
    }
  }
}

/* Chrome, Edge and Safari */
.content::-webkit-scrollbar {
  height: 7px;
  width: 7px;
}

.content::-webkit-scrollbar-track {
  background-color: #c7e0e4ff;
  border-radius: 5px;
  border: 0px solid #ffffffff;
}

.content::-webkit-scrollbar-track:hover {
  background-color: #acc6caff;
}

.content::-webkit-scrollbar-track:active {
  background-color: #acc6caff;
}

.content::-webkit-scrollbar-thumb {
  background-color: #6b8484ff;
  border-radius: 10px;
  border: 0px solid #ffffffff;
}

.content::-webkit-scrollbar-thumb:hover {
  background-color: #3a4545ff;
}

.content::-webkit-scrollbar-thumb:active {
  background-color: #3a4545ff;
}
```


## _components\HistoryModal\HistoryModal.tsx

```tsx
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
```


## _components\HistoryModal\index.ts

```ts
export { HistoryModal } from "./HistoryModal";
```


## _components\metrics\chart.tsx

```tsx
"use client";
import { AreaChart, Area, XAxis, YAxis, Tooltip, Legend, Line } from "recharts";

export const Chart = ({ data, title }: any) => {
  return (
    <div>
      <h2 className="pt-2 pb-4 text-center">{title}</h2>
      <AreaChart
        width={350}
        height={220}
        data={data[0]}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="iteration" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area
          type="monotone"
          dataKey="iterations"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#colorUv)"
        />
        <Area
          type="monotone"
          dataKey="iterations1"
          stroke="red"
          fillOpacity={1}
          fill="url(#colorXv)"
        />
        <Area
          type="monotone"
          dataKey="iterations"
          stroke="purple"
          fillOpacity={1}
          fill="url(#colorUv)"
        />
        <Area
          type="monotone"
          dataKey="iterations"
          stroke="pink"
          fillOpacity={1}
          fill="url(#colorXv)"
        />
        <Area
          type="monotone"
          dataKey="iterations"
          stroke="blue"
          fillOpacity={1}
          fill="url(#colorXv)"
        />
      </AreaChart>
    </div>
  );
};
```


## _components\metrics\chartCard.tsx

```tsx
"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { MetricsData } from "./metricsData";
import { CircleChart } from "./circleChart";

export const ChartCard = ({ data, gameCount, stroke, dataKey, percent}: any) => {
  return (
    <div>
      <h2 className="pt-2 pb-2 text-center">
        <strong>Game {gameCount}</strong>
      </h2>
      <small className="ml-10"><strong>Value</strong></small>
      <LineChart width={400} height={230} data={data} className="mt-4">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey={dataKey} stroke={stroke} />
      </LineChart>
      <small className="w-full flex justify-center items-center text-center m-0">
       <strong>Iterations</strong>
      </small>
      <MetricsData average={100} median={50} min={1} max={100} />
      <CircleChart value={percent} />
    </div>
  );
};
```


## _components\metrics\circleChart.tsx

```tsx
import React, { FC } from "react";
import { PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ["#82ca9d", "#8884d8"];

export const CircleChart: FC<{ value: number }> = ({ value }) => {
  const data = [
    { name: "Total amount of resources in the node", value: value },
    { name: "Remaining amount of resources", value: 100 - value },
  ];
  return (
    <div className="mb-3 mx-5">
      <h2 className="pt-1 pb-2 text-center">
        <strong>Resource allocation</strong>
      </h2>
      <PieChart width={400} height={300}>
        <Pie dataKey="value" data={data} fill="#8884d8" label>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </div>
  );
};
```


## _components\metrics\metrics.tsx

```tsx
"use client";

import { Panel } from "reactflow";
import { useChangeEdgeType } from "@/app/store/use-custom-edge";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import "./../../style-test.css";
import { MetricsData } from "./metricsData";
import { CircleChart } from "./circleChart";
import { ChartCard } from "./chartCard";

const data = [
  {
    name: 0,
    game1: 0,
    game2: 0,
    game3: 0,
    game4: 0,
    game5: 0,
  },
  {
    name: 1,
    game1: 10,
    game2: 5,
    game3: 5,
    game4: 2,
    game5: 10,
  },
  {
    name: 2,
    game1: 20,
    game2: 10,
    game3: 10,
    game4: 4,
    game5: 20,
  },
  {
    name: 3,
    game1: 30,
    game2: 15,
    game3: 15,
    game4: 9,
    game5: 20,
  },
  {
    name: 4,
    game1: 40,
    game2: 15,
    game3: 20,
    game4: 11,
    game5: 30,
  },
  {
    name: 5,
    game1: 50,
    game2: 15,
    game3: 25,
    game4: 13,
    game5: 40,
  },
  {
    name: 6,
    game1: 70,
    game2: 20,
    game3: 30,
    game4: 18,
    game5: 50,
  },
  {
    name: 7,
    game1: 90,
    game2: 25,
    game3: 25,
    game4: 28,
    game5: 60,
  },
  {
    name: 8,
    game1: 110,
    game2: 27,
    game3: 30,
    game4: 38,
    game5: 70,
  },
  {
    name: 9,
    game1: 130,
    game2: 37,
    game3: 25,
    game4: 48,
    game5: 80,
  },
  {
    name: 10,
    game1: 150,
    game2: 47,
    game3: 30,
    game4: 58,
    game5: 90,
  },
];

export const Metrics = () => {
  const { analytics, setAnalytics } = useChangeEdgeType();
  return (
    <Panel position="top-right" className="analytics_panel">
      <button
        className="bg-black rounded py-1 px-2 text-white absolute top-2 left-2"
        onClick={() => setAnalytics(false)} > &#x2716;
      </button>
      <h1 className="pt-2 text-center text-lg">
        <strong>Node statistics (wood)</strong>
      </h1>

      <h2 className="pt-1 pb-4 text-center">
        <strong>All games</strong>
      </h2>
      <small className="ml-10">
        <strong>Value</strong>
      </small>
      <LineChart width={400} height={230} data={data} className="mt-2">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        {/* <Legend /> */}
        <Line type="monotone" dataKey="game1" stroke="#82ca9d" />
        <Line type="monotone" dataKey="game2" stroke="#8884d8" />
        <Line type="monotone" dataKey="game3" stroke="pink" />
        <Line type="monotone" dataKey="game4" stroke="blue" />
        <Line type="monotone" dataKey="game5" stroke="purple" />
      </LineChart>
      <small className="w-full flex justify-center items-center text-center m-0">
        <strong>Iterations</strong>
      </small>
      <MetricsData
        average={100}
        median={50}
        min={1}
        max={100}
        std={37}
        range={1}
      />
      <ChartCard data={data} gameCount={1} stroke="#82ca9d" dataKey="game1" percent={14}/>
      <ChartCard data={data} gameCount={2} stroke="#8884d8" dataKey="game2" percent={64}/>
      <ChartCard data={data} gameCount={3} stroke="pink" dataKey="game3" percent={92}/>
      <ChartCard data={data} gameCount={4} stroke="blue" dataKey="game4" percent={45}/>
      <ChartCard data={data} gameCount={5} stroke="purple" dataKey="game5" percent={80}/>
    </Panel>
  );
};
```


## _components\metrics\metricsData.tsx

```tsx
"use client";

import { FC } from "react";
import "./../../style-test.css";

interface MetricsDta {
  average: number;
  median: number;
  min: number;
  max: number;
  std?: number;
  range?: number;
}

export const MetricsData: FC<MetricsDta> = ({
  average,
  median,
  max,
  min,
  std,
  range,
}) => {
  return (
    <div className="values_analytics">
      <div className="analytics__title">
        <h2>
          <strong>Metrics</strong>
        </h2>
        <h2>
          <strong>Value</strong>
        </h2>
      </div>
      <hr />
      <div className="analytics__title">
        <h2>Average value (AVR)</h2>
        <h2>{average}</h2>
      </div>
      <div className="analytics__title">
        <h2>Median (MEDIAN)</h2>
        <h2>{median}</h2>
      </div>
      <div className="analytics__title">
        <h2>Minimum value (MIN)</h2>
        <h2>{min}</h2>
      </div>
      <div className="analytics__title">
        <h2>Maximum value (MAX)</h2>
        <h2>{max}</h2>
      </div>
      {std && (
        <div className="analytics__title">
          <h2>Standard Deviation (STD)</h2>
          <h2>{std}</h2>
        </div>
      )}
      {range && (
        <div className="analytics__title">
          <h2>Range (RANGE)</h2>
          <h2>{range}</h2>
        </div>
      )}
      <hr/>
    </div>
  );
};
```


## _components\panels\bottom-panel.tsx

```tsx
import { Panel, useEdges, useNodes } from "reactflow";
import { ToolButton } from "../ui/ToolButton";
import { Play, RotateCcw, Pause } from "lucide-react";
import CustomInput from "../ui/CustomInput";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import useStore from "@/app/store/store";
import { useEffect } from "react";
import { Iterations } from "../iterations";
import { useChangeEdgeType } from "@/app/store/use-custom-edge";
import { Games } from "../games";

export const BottomPanel = () => {
  const { isPlay, onPlay, onStop, onReset, time, iterations, games } = useAnimateScheme();
  const { setEdgeAnimated } = useStore();
  useEffect(() => {
    setEdgeAnimated(isPlay);
  }, [isPlay]);

  const edges = useEdges();
  const nodes = useNodes();
  const { error, setError } = useChangeEdgeType();

  return (
    <Panel position="bottom-center">
      <div className="bg-white rounded-md flex gap-x-2 items-center shadow-md py-2 px-2">
        <div className="mr-2 flex gap-x-2 items-center">
          <CustomInput label="Iterations" initialValue={iterations} />
          <CustomInput label="Time(s)" initialValue={time} />
          <CustomInput label="Games" initialValue={games} />
        </div>
        <ToolButton
          label="Play"
          isDisabled={error ? true : isPlay}
          onClick={onPlay}
          isActive={false}
          icon={Play}
          background="blue"
        />
        <ToolButton
          label="Pause"
          isDisabled={!isPlay}
          onClick={onStop}
          isActive={false}
          icon={Pause}
          background="red"
        />
        <ToolButton
          label="Reset"
          onClick={onReset}
          isActive={false}
          icon={RotateCcw}
          background="red"
        />
        <Iterations />
        <Games />
        <div className="text-xs text-center px-1">
          <label>Total count</label>
          <div>{edges.length + nodes.length}</div>
        </div>
      </div>
    </Panel>
  );
};
```


## _components\panels\EdgeTypePanel.tsx

```tsx
import React from "react";

import { useChangeEdgeType } from "@/app/store/use-custom-edge";
import { EdgesTypes } from "@/app/types/structs";
import useStore from "@/app/store/store";

export const EdgeTypePanel = () => {
  const { onChangeEdgesType } = useChangeEdgeType();
  const { edgesType: currentEdgesTypeValue } = useStore.getState();

  const handleChangeEdgesType = (type: EdgesTypes) => {
    onChangeEdgesType(type);
    useStore.setState({
      edgesType: type,
    });
  };

  return (
    <div className="flex gap-x-2 items-center">
      <button
        className={`bg-blue-100 rounded-md p-2 ${
          currentEdgesTypeValue === EdgesTypes.DEFAULT
            ? "bg-blue-500 text-white"
            : ""
        }`}
        onClick={() => handleChangeEdgesType(EdgesTypes.DEFAULT)}
      >
        Default
      </button>
      <button
        className={`bg-blue-100 rounded-md p-2 ${
          currentEdgesTypeValue === EdgesTypes.SMOOTH_STEP
            ? "bg-blue-500 text-white"
            : ""
        }`}
        onClick={() => handleChangeEdgesType(EdgesTypes.SMOOTH_STEP)}
      >
        SmoothStep
      </button>
      <button
        className={`bg-blue-100 rounded-md mr-16 p-2 ${
          currentEdgesTypeValue === EdgesTypes.BEZIER
            ? "bg-blue-500 text-white"
            : ""
        }`}
        onClick={() => handleChangeEdgesType(EdgesTypes.BEZIER)}
      >
        Bezier
      </button>
    </div>
  );
};
```


## _components\panels\toolbar.tsx

```tsx
import { StructType } from "@/app/types/structs";
import { ToolButton } from "../ui/ToolButton";
import {
  ArrowLeftRight,
  Recycle,
  Play,
  Dices,
  Hourglass,
  CheckCheck,
  Undo,
  Redo,
  BadgePlus,
  BadgeMinus,
  Eraser,
} from "lucide-react";
import useStore, { RFState } from "@/app/store/store";
import { shallow } from "zustand/shallow";

interface ToolbarProps {
  canvasState: CanvasState;
  onClick: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  addNode: state.addNode,
});

export const Toolbar = () => {
  const { addNode } = useStore(selector, shallow);
  const { deleteAll } = useStore();

  return (
    <div className="absolute top-40 left-2 flex flex-col gap-y-4">
      <div className="bg-white rounded-md p-1.5 flex gap-y-1 flex-col items-center shadow-md">
        <ToolButton
          label="Source"
          onClick={() => addNode(StructType.Source)}
          isActive={false}
          icon={Play}
        />
        <ToolButton
          label="Pool"
          onClick={() => addNode(StructType.Pool)}
          isActive={false}
          icon={BadgePlus}
        />
        <ToolButton
          label="Consumer"
          onClick={() => addNode(StructType.Consumer)}
          isActive={false}
          icon={BadgeMinus}
        />
        <ToolButton
          label="Converter"
          onClick={() => addNode(StructType.Converter)}
          isActive={true}
          icon={Recycle}
        />
        <ToolButton
          label="Gate"
          onClick={() => addNode(StructType.Gate)}
          isActive={false}
          icon={ArrowLeftRight}
        />
        <ToolButton
          label="Random"
          onClick={() => addNode(StructType.Random)}
          isActive={false}
          icon={Dices}
        />
        <ToolButton
          label="Delay"
          onClick={() => addNode(StructType.Delay)}
          isActive={false}
          icon={Hourglass}
        />
        <ToolButton
          label="End"
          onClick={() => addNode(StructType.End)}
          isActive={false}
          icon={CheckCheck}
        />
      </div>
      {/* undo redo */}
      <div className="bg-white rounded-md p-1.5 flex flex-col items-center shadow-md">
        <ToolButton
          label="Undo"
          onClick={() => {}}
          isActive={false}
          icon={Undo}
        />
        <ToolButton
          label="Redo"
          onClick={() => {}}
          isActive={false}
          icon={Redo}
        />
        <ToolButton
          label="Eraser"
          onClick={deleteAll}
          isActive={false}
          icon={Eraser}
        />
      </div>
    </div>
  );
};
```


## _components\sidebar\sidebar-board.tsx

```tsx
import Link from "next/link";
import React from "react";
import { BoardTitle } from "../BoardInfoModal/BoardTitle";

interface TestIdPageProps {
  params: {
    boardId: string;
  };
}
const BoardSidebar = ({ params }: TestIdPageProps) => {
  return (
    <aside
      id="sidebar"
      className="bg-black text-white w-[150px] pt-10 pl-5 absolute inset-y-0 left-0 
                transform md:relative md:translate-x-0 md:flex
                 md:flex-col gap-y-6"
      data-dev-hint="sidebar">
         <BoardTitle boardId={params.boardId} />
          <Link href="/editor">
            <span>Editor</span>
          </Link>
          {/* <Link href="/lineage">
            <span>Lineage</span>
          </Link>
          <Link href="/tests">
            <span>Tests</span>
          </Link>
          <Link href="/tables">
            <span>Tables</span>
          </Link>
          <Link href="/macros">
            <span>Macros</span>
          </Link> */}
    </aside>
  );
};

export default BoardSidebar;
```


## _components\ui\EditableText\EditableText.module.scss

```scss
.editableContainer {
  cursor: pointer;
}

.editableText {
  padding: 4px 8px;
  border: 1px solid transparent;
  border-radius: 4px;

  &:hover {
    border-color: #ccc;
    background: #f5f5f5;
  }
}

.editableInput {
  padding: 4px 8px;
  border: 1px solid #007bff;
  border-radius: 4px;
  outline: none;
  background: white;

  &:hover {
    border-color: #0056b3;
  }
}
```


## _components\ui\EditableText\EditableText.tsx

```tsx
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
```


## _components\ui\EditableText\index.ts

```ts
import EditableText from "./EditableText";

export { EditableText };
```


## _components\ui\CustomInput.tsx

```tsx
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
```


## _components\ui\DownloadBtn.tsx

```tsx
import {
  getTransformForBounds,
  useReactFlow,
  getRectOfNodes,
} from "reactflow";
import { ToolButton } from "./ToolButton";
import { Download } from "lucide-react";

import { toPng } from "html-to-image";

function downloadImage(dataUrl: any) {
  const a = document.createElement("a");
  a.setAttribute("download", "scheme.png");
  a.setAttribute("href", dataUrl);
  a.click();
}

const imageWidth = 1024;
const imageHeight = 768;

export const DownloadBtn = () => {
  const { getNodes } = useReactFlow();
  const onDownload = () => {
    const nodesBounds = getRectOfNodes(getNodes());
    const transform = getTransformForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.5,
      2
    );
    //@ts-ignore
    toPng(document.querySelector(".react-flow__viewport"), {
      backgroundColor: "white",
      width: imageWidth,
      height: imageHeight,
      style: {
        width: imageWidth,
        height: imageHeight,
        transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
      },
    }).then(downloadImage);
  };
  return (
    <div>
      <ToolButton
        label="Download PNG"
        onClick={onDownload}
        isActive={false}
        icon={Download}
      />
    </div>
  );
};
```


## _components\ui\index.ts

```ts
import CustomInput from "./CustomInput";
import { EditableText } from "./EditableText";
import { ToolButton } from "./ToolButton";
import { DownloadBtn } from "./DownloadBtn";

export { CustomInput, EditableText, ToolButton, DownloadBtn };
```


## _components\ui\ToolButton.tsx

```tsx
"use client";

import { LucideIcon } from "lucide-react";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";

interface ToolButtonProps {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  isActive?: boolean;
  isDisabled?: boolean;
  background?: string
}

export const ToolButton = ({
  label,
  icon: Icon,
  onClick,
  isActive,
  isDisabled,
  background = "black"
}: ToolButtonProps) => {
  return (
    <Hint label={label}>
      <Button
        disabled={isDisabled}
        onClick={onClick}
        size="icon"
        style={{ margin: "1px", background: background }}
      >
        <Icon />
      </Button>
    </Hint>
  );
};
```


## _components\context-menu.tsx

```tsx
import React, { useCallback } from "react";
import { Node, useReactFlow } from "reactflow";
import "./../style-test.css"
import { useChangeEdgeType } from "@/app/store/use-custom-edge";

interface ContextMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  top?: any | boolean; // Выбор между числом и строкой для стилей
  left?: any | boolean;
  right?: any | boolean; // Необязательные свойства
  bottom?: any | boolean;
}

export default function ContextMenu({
  id,
  top,
  left,
  right,
  bottom,
  ...props
}: ContextMenuProps): React.JSX.Element {
  const { getNode, setNodes, addNodes, setEdges } = useReactFlow();
  const {setAnalytics} = useChangeEdgeType()
  const duplicateNode = useCallback(() => {
    const node: any = getNode(id);
    const position = {
      x: node.position.x + 50,
      y: node.position.y + 50,
    };

    addNodes({
      ...node,
      selected: false,
      dragging: false,
      id: `${node.id}-copy`,
      position,
    });
  }, [id, getNode, addNodes]);

  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id));
  }, [id, setNodes, setEdges]);


  return (
    <div
      style={{ top, left, right, bottom }}
      className="context-menu"
      {...props}
    >
      <button onClick={duplicateNode}>Copy</button>
      <button onClick={deleteNode}>Delete</button>
      <button onClick={() => setAnalytics(true)}>Analytics</button>
    </div>
  );
}
```


## _components\cursor.tsx

```tsx
"use client";

import { useOther } from "@/liveblocks.config";
import { MousePointer2 } from "lucide-react";
import { memo } from "react";

interface CursorProps {
  connectionId: number;
}

export const Cursor = memo(({ connectionId }: CursorProps) => {
  const info = useOther(connectionId, (user) => user?.info);
  const cursor = useOther(connectionId, (user) => user.presence.cursor);

  if (!cursor) {
    return null;
  }
  const { x, y } = cursor;
  const name = info?.name || "No name";

  return (
    <foreignObject
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        transform: `translateX(${x}px) translateY(${y}px)`,
      }}
      width={name.length * 10 + 24}
      height="50"
      viewBox="0 0 24 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <MousePointer2
        className="h-5 w-5"
        style={{
          fill: "red",
          color: "red",
        }}
      />
      <div
        className="absolute left-5 px-1.5 py-0.5 rounded-md text-xs text-white font-semibold"
        style={{ backgroundColor: "red" }}
      >
        {name}
      </div>
    </foreignObject>
  );
});

Cursor.displayName = "Cursor";
```


## _components\flow.tsx

```tsx
"use client";
import "reactflow/dist/style.css";
import ReactFlow, { Controls, Background, Panel } from "reactflow";
// import { shallow } from "zustand/shallow";
import { useMyPresence, useOthers } from "@/liveblocks.config";
import { Cursor } from "./cursor";
import { Toolbar } from "./panels/toolbar";
import { BottomPanel } from "./panels/bottom-panel";
import { DownloadBtn } from "./ui/DownloadBtn";
import useStore, { RFState } from "@/app/store/store";
import { edgeTypes, nodeTypes } from "@/app/types/structs";
import { useCallback, useEffect, useRef, useState } from "react";
import ContextMenu from "./context-menu";
import { useChangeEdgeType } from "@/app/store/use-custom-edge";
import { Metrics } from "./metrics/metrics";
import EditorComponent from "./editor/editorCoder";
import "./../style-test.css";
import { useRenameModal } from "@/app/store/use-rename-modal";
import BoardInfoModal from "./BoardInfoModal/BoardInfoModal";
import { ToolButton } from "./ui/ToolButton";
import { FileJson2, LayoutDashboard, HistoryIcon } from "lucide-react";
import { Loading } from "@/components/loading";
import { useVersionsHistory } from "@/app/hooks/useVersionsHistory";
import { Id } from "@/convex/_generated/dataModel";
import { useSaveHandlerOnHotkeyKeydown } from "@/app/hooks/useSaveHandlerOnKeydown";
import { HistoryModal } from "./HistoryModal";
import { useInitializeBoard } from "@/app/hooks/useInitializeBoard";

// const selector = (state: RFState) => ({
//   nodes: state.nodes,
//   edges: state.edges,
//   deleteNode: state.deleteNode,
//   onNodesChange: state.onNodesChange,
//   onEdgesChange: state.onEdgesChange,
//   onConnect: state.onConnect,
//   addNode: state.addNode,
// });
interface FlowProps {
  boardId: string;
}

interface IContextMenu {
  id: string;
  top: number;
  left: number;
  right: number | boolean;
  bottom: number | boolean;
}

const Flow = ({ boardId }: FlowProps) => {
  useInitializeBoard(boardId as Id<"boards">);

  const {
    liveblocks: { isStorageLoading },
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    deleteNode,
  } = useStore();
  const { autoSave, manualSave } = useVersionsHistory(boardId);
  useSaveHandlerOnHotkeyKeydown(manualSave);

  const [{ cursor }, updateMyPresence] = useMyPresence();
  const others = useOthers();
  const { isVisibleEditor, setIsVisisble, isVisibleBoard, setIsVisisbleBoard } =
    useRenameModal();
  const [isVisibleHistory, setIsVisisbleHistory] = useState(false);
  const { analytics, setAnalytics } = useChangeEdgeType();
  const [menu, setMenu] = useState<IContextMenu | null>(null);
  const ref = useRef(null);

  const onNodeContextMenu = useCallback(
    (event: any, node: any) => {
      event.preventDefault();
      //@ts-ignore
      const pane = ref.current?.getBoundingClientRect();
      let menu = {
        id: node.id,
        top: event.clientY < pane.height - 200 && event.clientY,
        left: event.clientX < pane.width + 200 && event.clientX,
        right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
        bottom:
          event.clientY >= pane.height - 200 && pane.height - event.clientY,
      };
      setMenu(menu);
    },
    [setMenu]
  );

  const onPaneClick = useCallback(() => {
    setMenu(null);
  }, [setMenu]);

  useEffect(() => {
    if (isStorageLoading) return;

    autoSave();
  }, [nodes, edges, autoSave, isStorageLoading]);

  if (isStorageLoading) {
    <Loading />;
  }

  return (
    <main
      className="h-full w-full relative bg-neutral-100 touch-none"
      onPointerMove={(event) => {
        updateMyPresence({
          cursor: {
            x: Math.round(event.clientX),
            y: Math.round(event.clientY),
          },
        });
      }}
      onPointerLeave={() =>
        updateMyPresence({
          cursor: null,
        })
      }
    >
      {!isVisibleEditor && (
        <div className="z-10 w-full relative">
          <Toolbar />
        </div>
      )}

      {others.map(({ connectionId, presence }) => {
        if (presence.cursor === null) {
          return null;
        }
        return <Cursor key={connectionId} connectionId={connectionId} />;
      })}

      <ReactFlow
        ref={ref}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneClick={onPaneClick}
        onNodeContextMenu={onNodeContextMenu}
      >
        {menu && <ContextMenu onClick={onPaneClick} {...menu} />}
        <Controls position="bottom-right" />

        {isVisibleEditor && (
          <Panel position="top-left" className="position_panel">
            <EditorComponent />
          </Panel>
        )}

        <Panel position="top-center">
          <div className="bg-white rounded-md p-1.5 flex gap-x-2 items-center shadow-md">
            <ToolButton
              label="Editor"
              onClick={setIsVisisble}
              isActive={false}
              icon={FileJson2}
            />
            <DownloadBtn />
            <ToolButton
              label="Board"
              onClick={() => {
                if (isVisibleHistory) {
                  setIsVisisbleHistory(!isVisibleHistory);
                }

                setIsVisisbleBoard();
              }}
              isActive={false}
              icon={LayoutDashboard}
            />
            <ToolButton
              label="History"
              onClick={() => {
                if (isVisibleBoard) {
                  setIsVisisbleBoard();
                }

                setIsVisisbleHistory(!isVisibleHistory);
              }}
              isActive={false}
              icon={HistoryIcon}
            />
          </div>
        </Panel>

        {!analytics && !isVisibleBoard && isVisibleHistory && (
          <Panel position="top-right" className="info_panel">
            <HistoryModal
              boardId={boardId}
              onSaveRestoredVersion={manualSave}
              onClose={() => setIsVisisbleHistory(false)}
            />
          </Panel>
        )}

        {!analytics && !isVisibleHistory && isVisibleBoard && (
          <Panel position="top-right" className="info_panel">
            <BoardInfoModal boardId={boardId} handleSaveVersion={manualSave} />
          </Panel>
        )}
        <Background color="blue" gap={16} className="bg-blue-100" />
        {analytics && <Metrics />}
        <BottomPanel />
      </ReactFlow>
    </main>
  );
};

export default Flow;
```


## _components\games.tsx

```tsx
"use client";

import { useAnimateScheme } from "@/app/store/use-animate-scheme";

export const Games = () => {
  const {  games, gamesCount } = useAnimateScheme();

  return (
    <div className="text-xs text-center px-2">
      <label>Games</label>
      <div className="flex gap-x-3 items-center">
        <div>{gamesCount}</div>
        <div>/</div>
        <div>{games}</div>
      </div>
    </div>
  );
};
```


## _components\iterations.tsx

```tsx
"use client";

import { useAnimateScheme } from "@/app/store/use-animate-scheme";

export const Iterations = () => {
  const { iterationsCount, iterations } = useAnimateScheme();

  return (
    <div className="text-xs text-center px-2">
      <label>Iterations</label>
      <div className="flex gap-x-3 items-center">
        <div>{iterationsCount}</div>
        <div>/</div>
        <div>{iterations}</div>
      </div>
    </div>
  );
};
```


## layout.tsx

```tsx
import { BoardTitle } from "./_components/BoardInfoModal/BoardTitle";
import BoardSidebar from "./_components/sidebar/sidebar-board";

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: {
    boardId: string;
  };
}

const DashboardLayout = ({ children, params }: DashboardLayoutProps) => {
  return (
    // <main className="relative min-h-screen md:flex overflow-hidden">
    //   <BoardSidebar params={params}/>
    //   <main
    //     id="content"
    //     className="flex-1 bg-gray-100 max-h-screen overflow-y-auto"
    //   >
        <div className="max-w-full mx-auto h-full">
                   {/* <InfoBoard boardId={params.boardId} /> */}
          <div className="h-full">{children}</div>
        </div>
    //    </main>
    //  </main>
  );
};

export default DashboardLayout;
```


## page.tsx

```tsx
import Flow from "./_components/Flow";
import { Room } from "@/components/room";
import { Loading } from "@/components/loading";

interface TestIdPageProps {
  params: {
    boardId: string;
  };
}

const TestIdPage = ({ params }: TestIdPageProps) => {
  return (
    <Room roomId={params.boardId} fallback={<Loading />}>
      <Flow boardId={params.boardId} />
    </Room>
  );
};

export default TestIdPage;
```


## style-test.css

```css
.context-menu {
  background: white;
  border-style: solid;
  box-shadow: 10px 19px 20px rgba(0, 0, 0, 10%);
  position: absolute;
  font-size: 0.8rem;
  font-weight: bold;
  border-radius: 8px;
  z-index: 10;
}

.context-menu button {
  border: none;
  display: block;
  padding: 0.5em;
  text-align: left;
  width: 100%;
}

.context-menu button:hover {
  background: rgb(234, 248, 252);
  border-radius: 8px;
}

.position_panel {
  margin-top: 0 !important;
  margin-left: 0 !important;
  height: 785px !important;
  z-index: 100 !important;
}
.info_panel {
  margin-top: 0 !important;
  margin-right: 0 !important;
}
.analytics_panel {
  background: white;
  margin-top: 0 !important;
  margin-right: 0 !important;
  z-index: 10000 !important;
  width: 450px;
  height: 785px;
  overflow-y: auto !important;
  padding-top: 10px;
}
.values_analytics {
  margin: 2px 50px 20px;
}
.analytics__title {
  display: flex;
  justify-content: space-between;
}
.vesrsions-diff_panel {
  margin-top: 0 !important;
  margin-left: 0 !important;
  width: 850px !important;
  z-index: 100 !important;
  position: fixed;
  padding-left: 100px;
}
```
```


## app\test\[boardId]\style-test.css

```css
.context-menu {
  background: white;
  border-style: solid;
  box-shadow: 10px 19px 20px rgba(0, 0, 0, 10%);
  position: absolute;
  font-size: 0.8rem;
  font-weight: bold;
  border-radius: 8px;
  z-index: 10;
}

.context-menu button {
  border: none;
  display: block;
  padding: 0.5em;
  text-align: left;
  width: 100%;
}

.context-menu button:hover {
  background: rgb(234, 248, 252);
  border-radius: 8px;
}

.position_panel {
  margin-top: 0 !important;
  margin-left: 0 !important;
  height: 785px !important;
  z-index: 100 !important;
}
.info_panel {
  margin-top: 0 !important;
  margin-right: 0 !important;
}
.analytics_panel {
  background: white;
  margin-top: 0 !important;
  margin-right: 0 !important;
  z-index: 10000 !important;
  width: 450px;
  height: 785px;
  overflow-y: auto !important;
  padding-top: 10px;
}
.values_analytics {
  margin: 2px 50px 20px;
}
.analytics__title {
  display: flex;
  justify-content: space-between;
}
.vesrsions-diff_panel {
  margin-top: 0 !important;
  margin-left: 0 !important;
  width: 850px !important;
  z-index: 100 !important;
  position: fixed;
  padding-left: 100px;
}
```


## app\types\canvas.ts

```ts
export type Color = {
    r: number;
    g: number;
    b: number;
};

export type Camera = {
    x: number;
    y: number;
};
//canvas tools
export enum LayerType {
    Rectangle,
    Ellipse,
    Path,
    Text,
    Note,
    Source,
    Arrow
};

export type RectangleLayer = {
    type: LayerType.Rectangle;
    x: number;
    y: number;
    height: number;
    width: number;
    fill: Color;
    value?: string;
};

export type EllipseLayer = {
    type: LayerType.Ellipse;
    x: number;
    y: number;
    height: number;
    width: number;
    fill: Color;
    value?: string;
};

export type PathLayer = {
    type: LayerType.Path;
    x: number;
    y: number;
    height: number;
    width: number;
    fill: Color;
    points: number[][];
    value?: string;
};

export type ArrowLayer = {
    type: LayerType.Arrow;
    x: number;
    y: number;
    height: number;
    width: number;
    fill: Color;
    value?: string;
};

export type TextLayer = {
    type: LayerType.Text;
    x: number;
    y: number;
    height: number;
    width: number;
    fill: Color;
    value?: string;
};

export type NoteLayer = {
    type: LayerType.Note;
    x: number;
    y: number;
    height: number;
    width: number;
    fill: Color;
    value?: string;
};

export type SourceStruct = {
    type: LayerType.Source;
    x: number;
    y: number;
    height: number;
    width: number;
    fill: Color;
    value?: string;
};

export type Point = {
    x: number;
    y: number;
};

export type XYWH = {
    x: number;
    y: number;
    width: number;
    height: number;
};

export enum Side {
    Top = 1,
    Bottom = 2,
    Left = 4,
    Right = 8,
};

export type CanvasState =
    | {
        mode: CanvasMode.None;
    }
    | {
        mode: CanvasMode.SelectionNet,
        origin: Point;
        current?: Point;
    }
    | {
        mode: CanvasMode.Translating,
        current: Point;
    }
    | {
        mode: CanvasMode.Inserting,
        layerType: LayerType.Ellipse | LayerType.Rectangle | LayerType.Text | LayerType.Note | LayerType.Arrow;
    }
    | {
        mode: CanvasMode.Pencil,
    }
    | {
        mode: CanvasMode.Pressing,
        origin: Point;
    }
    | {
        mode: CanvasMode.Resizing,
        initialBounds: XYWH;
        corner: Side;
    };

export enum CanvasMode {
    None,
    Pressing,
    SelectionNet,
    Translating,
    Inserting,
    Resizing,
    Pencil,
};

export type Layer = RectangleLayer | EllipseLayer | PathLayer | TextLayer | NoteLayer | SourceStruct | ArrowLayer
```


## app\types\history.ts

```ts
import { Node, Edge } from "reactflow";

export type BoardState = {
  title: string;
  description: string;
  edgesType: string;
  nodes: Node[];
  edges: Edge[];
  version: number;
  createdAt: number;
};

export type PreviousState = Omit<
  BoardState,
  "title" | "description" | "edgesType"
>;

export type BoardStateData = Omit<PreviousState, "version" | "createdAt">;

export enum BoardSavingStatus {
  IDLE = "idle",
  SAVING = "saving",
  ERROR = "error",
}
```


## app\types\structs.ts

```ts
import { Node } from "reactflow";
import CustomEdge from "../test/[boardId]/_components/_structs/edgeComponents/custom-edge";
import CustomNode from "./../test/[boardId]/_components/_structs/custom-node";
import SourceNode from "../test/[boardId]/_components/_structs/nodeComponents/tulaNodes/sourceNode";
import PoolNode from "../test/[boardId]/_components/_structs/nodeComponents/tulaNodes/poolNode";
import ConsumerNode from "../test/[boardId]/_components/_structs/nodeComponents/tulaNodes/consumerNode";
import ConverterNode from "../test/[boardId]/_components/_structs/nodeComponents/tulaNodes/converterNode";
import GateNode from "../test/[boardId]/_components/_structs/nodeComponents/tulaNodes/gateNode";
import RandomNode from "../test/[boardId]/_components/_structs/nodeComponents/tulaNodes/randomNode";
import DelayNode from "../test/[boardId]/_components/_structs/nodeComponents/tulaNodes/delayNode";
import TriggerNode from "../test/[boardId]/_components/_structs/nodeComponents/tulaNodes/triggerNode";
import EndNode from "../test/[boardId]/_components/_structs/nodeComponents/tulaNodes/endNode";
import consumerNode from "../test/[boardId]/_components/_structs/nodeComponents/tulaNodes/consumerNode";
import EntityNode from "../test/[boardId]/_components/_structs/nodeComponents/specNodes/entityNode";
import EventNode from "../test/[boardId]/_components/_structs/nodeComponents/specNodes/eventNode";
import OperatorNode from "../test/[boardId]/_components/_structs/nodeComponents/specNodes/operatorNode";
import RuleNode from "../test/[boardId]/_components/_structs/nodeComponents/specNodes/ruleNode";
import StateNode from "../test/[boardId]/_components/_structs/nodeComponents/specNodes/stateNode";
import ConditionalEdge from "../test/[boardId]/_components/_structs/edgeComponents/conditional-edge";
import ProbabilisticEdge from "../test/[boardId]/_components/_structs/edgeComponents/probabilistic-edge";
import TriggerEdge from "../test/[boardId]/_components/_structs/edgeComponents/trigger-edge";
import ModifierEdge from "../test/[boardId]/_components/_structs/edgeComponents/modifier-edge";
import EmptyNode from '../test/[boardId]/_components/_structs/nodeComponents/emptyNode';

enum StructType {
  Source = "Source",
  Pool = "Pool",
  Consumer = "Consumer",
  Converter = "Converter",
  Gate = "Gate",
  Random = "Random",
  Delay = "Delay",
  Trigger = "Trigger",
  End = "End",
  Empty = "Empty", 
    // Новые типы
  Entity = "Entity",
  State = "State",
  Event = "Event",
  Rule = "Rule",
  Operator = "Operator",
  
}
export { StructType };

export enum EdgesTypes {
  DEFAULT = "Default",
  SMOOTH_STEP = "SmoothStep",
  BEZIER = "Bezier",
}

export type SourceStruct = {
  id: number | string;
  type: StructType.Source;
  value?: string;
};

export type PoolStruct = {
  id: number | string;
  type: StructType.Pool;
  value?: string;
};

export type ConsumerStruct = {
  id: number | string;
  type: StructType.Consumer;
  value?: string;
};

export type ConverterStruct = {
  id: number | string;
  type: StructType.Converter;
  value?: string;
};

export type GateStruct = {
  id: number | string;
  type: StructType.Gate;
  value?: string;
};

export type RandomStruct = {
  id: number | string;
  type: StructType.Random;
  value?: string;
};

export type DelayStruct = {
  id: number | string;
  type: StructType.Delay;
  value?: string;
};

export type TriggerStruct = {
  id: number | string;
  type: StructType.End;
  value?: string;
};

export type EndStruct = {
  id: number | string;
  type: StructType.End;
  value?: string;
};

export type Structs =
  | SourceStruct
  | PoolStruct
  | ConsumerStruct
  | ConverterStruct
  | GateStruct
  | RandomStruct
  | DelayStruct
  | TriggerStruct
  | EndStruct;

export const nodeTypes = {
  textUpdater: CustomNode,
  sourceNode: SourceNode,
  poolNode: PoolNode,
  consumerNode: ConsumerNode,
  converterNode: ConverterNode,
  gateNode: GateNode,
  randomNode: RandomNode,
  delayNode: DelayNode,
  triggerNode: TriggerNode,
  endNode: EndNode,
  emptyNode: EmptyNode,   // <-- новый тип
  entityNode: EntityNode,
  stateNode: StateNode,
  eventNode: EventNode,
  ruleNode: RuleNode,
  operatorNode: OperatorNode,
};
export const edgeTypes = {
  custom: CustomEdge,
  probabilistic: ProbabilisticEdge,
  conditional: ConditionalEdge,
  trigger: TriggerEdge,
  modifier: ModifierEdge,
};

export interface Graph {
  id: number;
  countComponents: number;
  owner: string;
  created: string;
  modified: string;
  title: string;
  description: string;
}

export interface CustomNode extends Node {
  sourceStruct: SourceStruct;
  name: string;
  value: string;
}
```


## app\favicon.ico

```ico
         (  F          (  n  00     (-  �         �  �F  (                                                           $   ]   �   �   ]   $                                       �   �   �   �   �   �   �   �                           8   �   �   �   �   �   �   �   �   �   �   8                  �   �   �   �   �   �   �   �   �   �   �   �              �   �   �   �   �   �   �   �   �   �   �   �   �   �       #   �   �   �OOO�������������������������ggg�   �   �   �   #   Y   �   �   ��������������������������555�   �   �   �   Y   �   �   �   �   �kkk���������������������   �   �   �   �   �   �   �   �   �   �			������������������   �   �   �   �   �   Y   �   �   �   �   �JJJ���������kkk�   �   �   �   �   �   Y   #   �   �   �   �   ����������			�   �   �   �   �   �   #       �   �   �   �   �   �111�DDD�   �   �   �   �   �   �              �   �   �   �   �   �   �   �   �   �   �   �                  8   �   �   �   �   �   �   �   �   �   �   8                           �   �   �   �   �   �   �   �                                       $   ]   �   �   ]   $                                                                                                                                                                                                                                                                                    (       @                                                                               ,   U   �   �   �   �   U   ,                                                                                      *   �   �   �   �   �   �   �   �   �   �   �   �   *                                                                      �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �                                                          Q   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   Q                                               r   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   r                                       r   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   r                               O   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   O                          �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �                      �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �               (   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   '           �   �   �   �   �   �   �888���������������������������������������������������������___�   �   �   �   �   �   �   �          �   �   �   �   �   �   ����������������������������������������������������������SSS�   �   �   �   �   �   �   �      +   �   �   �   �   �   �   �   �hhh�����������������������������������������������������   �   �   �   �   �   �   �   �   +   T   �   �   �   �   �   �   �   ��������������������������������������������������,,,�   �   �   �   �   �   �   �   �   T   �   �   �   �   �   �   �   �   �   �GGG���������������������������������������������   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   ������������������������������������������   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �+++���������������������������������jjj�   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   ����������������������������������   �   �   �   �   �   �   �   �   �   �   �   T   �   �   �   �   �   �   �   �   �   �   ��������������������������III�   �   �   �   �   �   �   �   �   �   �   �   T   +   �   �   �   �   �   �   �   �   �   �   �   �hhh����������������������   �   �   �   �   �   �   �   �   �   �   �   +      �   �   �   �   �   �   �   �   �   �   �   ������������������,,,�   �   �   �   �   �   �   �   �   �   �   �   �          �   �   �   �   �   �   �   �   �   �   �   �   �GGG�������������   �   �   �   �   �   �   �   �   �   �   �   �   �           '   �   �   �   �   �   �   �   �   �   �   �   �   ����������   �   �   �   �   �   �   �   �   �   �   �   �   (               �   �   �   �   �   �   �   �   �   �   �   �   �333�___�   �   �   �   �   �   �   �   �   �   �   �   �   �                      �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �                          O   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   O                               r   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   r                                       r   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   r                                               Q   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   Q                                                          �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �                                                                      *   �   �   �   �   �   �   �   �   �   �   �   �   *                                                                                      ,   U   �   �   �   �   U   ,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               (   0   `           -                                                                                             	   (   L   j   �   �   �   �   j   K   (   	                                                                                                                                          V   �   �   �   �   �   �   �   �   �   �   �   �   �   �   U                                                                                                                      %   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   &                                                                                                      �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �                                                                                          Q   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   R                                                                              �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �                                                                     �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �                                                             �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �                                                     �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �                                              �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �                                       P   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   O                                  �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �                              �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �                       #   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   #                   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �                  �   �   �   �   �   �   �   �   �   �$$$�hhh�eee�eee�eee�eee�eee�eee�eee�eee�eee�eee�eee�eee�eee�eee�eee�eee�eee�eee�eee�eee�eee�PPP��   �   �   �   �   �   �   �   �   �              U   �   �   �   �   �   �   �   �   �   ������������������������������������������������������������������������������������������sss�   �   �   �   �   �   �   �   �   �   �   U           �   �   �   �   �   �   �   �   �   �   �   �eee��������������������������������������������������������������������������������������   �   �   �   �   �   �   �   �   �   �   �       	   �   �   �   �   �   �   �   �   �   �   �   ����������������������������������������������������������������������������������HHH�   �   �   �   �   �   �   �   �   �   �   �   �   	   (   �   �   �   �   �   �   �   �   �   �   �   �   �EEE�����������������������������������������������������������������������������   �   �   �   �   �   �   �   �   �   �   �   �   �   (   K   �   �   �   �   �   �   �   �   �   �   �   �   �   �������������������������������������������������������������������������,,,�   �   �   �   �   �   �   �   �   �   �   �   �   �   L   j   �   �   �   �   �   �   �   �   �   �   �   �   �   �)))���������������������������������������������������������������������   �   �   �   �   �   �   �   �   �   �   �   �   �   �   j   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   ������������������������������������������������������������������   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   ����������������������������������������������������������iii�   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �eee������������������������������������������������������   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   ��������������������������������������������������HHH�   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   j   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �EEE���������������������������������������������   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   j   L   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �����������������������������������������,,,�   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   K   (   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �)))�������������������������������������   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   (   	   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   ����������������������������������   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   	       �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   ��������������������������iii�   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �           U   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �eee����������������������   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   U              �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   ������������������HHH�   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �                  �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �EEE�������������   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �                   #   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   ���������,,,�   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   #                       �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �222�}}}�   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �                              �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �                                  O   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   P                                       �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �                                              �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �                                                     �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �                                                             �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �                                                                     �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �                                                                              R   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   Q                                                                                          �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �                                                                                                      &   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   %                                                                                                                      U   �   �   �   �   �   �   �   �   �   �   �   �   �   �   V                                                                                                                                          	   (   K   j   �   �   �   �   j   L   (   	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        �PNG

   IHDR         \r�f   sRGB ���   8eXIfMM *    �i            �       �           D"8s  IDATx�]	�ՙn�]<QVA���h$	�N��13*�q��d�č�I���D�L2��(�(Ԙ2�ę�G	��q_@屈���xț�Џ��{o�������U�{}�O��;������9�d���(Dg��8	��N �]��@�hx�?v �N�3�=`;�6�.�&��u��  ��6�P��н��@�àR� P�iZq�^DN���wp����X�hИHg@��
:��|�5` p"@�'�ɲ�s{�p�*�2����� d ү���|(0�
0 ��>K�
�xX�6 IJ� �C|?$KEN�}ϓ|������h $	2 ��|/� . Nz �#���W�e�
�5������ܶ���;�y �� �g�s�h^  I�� DL(�;�8��Hjg�cH|x�1��R"�a���Ӂ� G��@��9`/`%0�H�@j�~,���K
�,t).��I���D�T�O�)~��V�u$b 誛�U%�7������ _�$b 8A������J�3` 510wQ�?��vr���:�2�K�@ ��v*{%#��A�Z�咁^(��=�g \��W�����!:��,`�6��643�:@�c.Fٟ����u?�<��'������_܏vp: �8Q��
I�Ł�p{3���kHȢ�G�����c�Ѽ<�62&�
��2uC�����敭��T�3�
�����;���d�/~m��.��X�@{�w.��d]G�� {lK��Eb���(P�RuM�T�C�����d��])��_Lm�=��=@b���K��GUk�^�U�������)1����g�T���m`9�\����Q��@����Ⱆ6�:ڞ�^�w�����E�D�� �	�5����F�,��
�X"�d�m�<�nB~��@����t�t�x���;�f�>����I8����8��C1۪$B���e���+��jl��EZ��& ��S:�:�6�m����\G1��`���!�nl�l�Ɗ�^�Q`��@Oc�S��@e�ͷ���qb�p���S��@up���F�D@�Г������2@#����L3 �A��$H2� _h��FH#rq(��O�D�򤬈���runGOWa�b� &�SgD�3�ED�to�*Ǥ����9k��~)���,$� x�R�1�v�K ��9�D䍁U(�w�&LE��ꩻ�S)��3�Y8x8 $.i�(��K�ŀY����a�]����4��ǀ	c����@3�f����4� Ƣ���/*b��� ���$!I�~��7�B*-1`	o � �	�$��ǡD�����L������ �J"���OQ��)��2@#�x4�"$e ���I�8��Oi��8�"� �G��8[x�t<�.��7&�m&؎R�^��tq� ؕ�.���Y�-2� �d� ��*_��&d|j\�W�b ��G����*g�� ��釁�F4�"I�؃�/ b1q�N����Y�D��p���9���p�}w\� �Ԥ���1 j`��O���xK=��H�� �A��1�#�
D:U8j���t���$b b�A||�U�Q��26%��)1 ��_�ꢳ!~D��� ��+b >A��:]�E$��50��GDhR�t����ݻwR�)��P� ��n$� 3���@bS�Nu�,Y�j�ʲ��:����;�����@�`�|�-[)�'OV��Ն�sFxڮ��ۥ�n}͛7�����~��ƺ�:���Q��J_��UKj8�q0x���;v4 ̞=[�hW=�	��	�&�!e5�8hѢE��w�]�����6���_�iW}�SZ�?	�/`�;vl�}��2 <�h�" ����A�܁�X,�m۶�+V�(��<�w���#F�^���;���aH�c ���)S�*�{a���p��c89(�^����4�&E��oÆ��W�/��u�=�^���*?{k^�_E�����z���g�� UI-���{WU*
�:p�9.tڷo(/ݺus>��3�'�^�Rg���ڞG��I_D�������~~� ��{���?N0�7�S��.ƍ׸�~?}/y]nA;�أ���2 ]�FOB2C?�_I����[�:�:�=#�OzK�-� ��ϣ�%����?j��I���P�ۯ��{N�-hU��t�:������� ,���G�K�-hU���c�hP7 ����@�n?�\�-�k�.���2�:�� �`��F��=�-�V�_�G��܂V� ��}�0 WI����F��ʭ���sM�rZ�8pJ�Q�*@OK8���
rZ��ݖa, ��w� �S�W^y����.��5�at7��ݏ���Tv#�~7n��A"�����+��W��pM��/�hK8����g��F/^������M{e ��R�|�)q��7�t��?8'���K��P~���瞰�\��r��>�ǷUk �eP��|�^x����
�/V/��v���������*�p�v�� ����ʟ]J��}��k8(������ĉ�ѣGǗ�O�mڴq,X�o���e.�^ �Qx���p�t����4^_�N�{�����y�2 �s����� �-عsg�s���i�v��Z8
!~PJ?�c�������|�] �ܽ{��z�긓R��1pn���z�����tlp�9�f�r�v�jT殿�z�4*O�L�~����ԕ3��4�~~�r�;�m�xY�+���������3 r�;�m�x�4���:7]ՁqL�4)U��!r�1��u�6���$��7����8�w��̙3Ǹ|5�>?�\z��O���͆� ��,�E����3�����2���[����2Wu:E�����^p.H1cJ�t�]}��B�u��SOu�����Ic�O�����%�  �AZ������k����D?�5 �@Q�����3�w�+��"��T��S��Uޥ�13��?��5 M'݋��>p��Z�j�~fj�׈�סԐ�n�����>� ��i5D�[bf ��~a�'�`Xc��� -�1�k����āI�������k��Q�ů|�k�M��(92�@�t�����݂X-�Lדa��N4��qܞ'$f0@�@V�nA�ܘY�L9:�|/^s� ��	��)0`�j��T\w�uZ-����¨\�	@�:��c�t���{�-��Rb��1%� �I,Y%T���~��r�1����C��,�$��*ˀ���f<��0z����h�F���� ����|���8Z-�CR����Tg� �HRf��glY����s��-��p��'+����m�_ؒg������C�{ �	����Ȫ�ϏΙ3g�-�GR|׹7`G��񥡘�0�U��_ٵZЏ�د�D�)���\>����ʗ������z N���@��~~��-��P��{rs���@�<����|.]�Ը|��m|g����_��y�W�KD1�b�M���%�s\����r�1��n�\�ƒ�"-� �`.4��~%3��I}[0A��$��= -�>BH"G�ۏ�^r��<�EBG�i �%���9�@^�~~@�����1����@� t�-[����{%@C�$�mAg���Κ5kʆх����/双O��l��ӿ��B�@.X���u�p�O��6��x�9MPn�`߷o_���^n�`t�
��(�����\r��s�A�y���ۂ�T��@h
�E0l�0��;�tڵӘkƸN����Y�jU��
S#�|^㽺- |��p�N�.���ޥ`�^{�zL�6��4 �ě�b��e�]&"�d�sΜ9Uޥ�U0�!��*nP�*`���o֨v����i8G�����hh��m������ɓ�s�=�{J�U0�Ղ���wZ������������8bEz���,Y�D��![C�>}��7:k׮�no��f� >jvR?#b��X�(��F�AT�F��i��[�{��zv��>��C���a+�[0B2�D��=��G~�(
�ĺ������LO�\s�܂>"8|�`[)
&Lp8�'��������4 oGe�#�ۏ�lْ_\�D̀܂�2Z�l��i�9��t�ȑ9f ޢ�-����=���Y�y��n?uQ�}Xͬ�sA�i >=��1�=R��+� +�܂��.2 ��K������CƢۃ20h� �˫%53�5@�MA�%���̣������j[��9�;�� _(�����0��~r���\�{�m�P����x#TT9��n?����N#��ץ&�}� ��)
�T�VL�!���j���`�p �8@Rr�UAV�A����=��-����pLH�`@n�*Ȋ1�܂U���?}w ]�H2@�ߴi��V���[�˯%�������5 �8�)Э
T`��|rZbZ-�.�!da+@� ���ߞ�Z�gf�[0p���� �� I��gr�$��o%P�_rCy�V�|߽����"m�Y���-�[ l��k xA� ��ۯ9]�[pҤI�Ȩ�pP���k ��Feِ���gHE�d�nAm"Z�$��5}���z�8����2r�X�|� ��Sܻw��r�J�s�J�~�T�f�z{ �ͫ ��x�j?j��Q�E�n� �js���|G�xз�<dXt(��Q�E�.�p�47 ��)���;��ys�_�V�D���-XTi����?� �~�薜����� �`Q�=V�?���^�
������.]�|X�
�m�B~��?���J� �D�������~�h r�����ER���A݀�B���~w�q�Ӿ}���<�ŕ[й5�d��-�`�5 ?�Kq�~l4��0@��)����/I��(����؋���n��9���Y�4�!�Cو2ח*w9���GKݐ�s�&�r�e��s��?�6�8J� |(�uwO䴁d�&K)�nA��?R���n@7,��8�=���r�e����n�M�69k��M7�����J��R�]�e�n��9���Z���� /?នo>��󕾤�rzr�� ��`���V{���u��4448�V��ra��p� ��QRZ�<{�dK.F9��#~T���s.����N%*� ���Ýu�8G&����/W:*x%�{�}@� ��l���Nc#�AI�������i����*?�د�0}�g���C"Āpۯ������4薒ҏ(b�8�_Q�Y� ���r7'���`��� �j �6�� *��3�W�g��"��l��1�:�Sg}%� �	��P?����1`�����Y� ��"��D�0b@�� �����9������[t��F1���p`k�\U�`��R��A#W81 e`)R�ZM��� ��[u��F0�	rq.����� #^�=C"Ā9P'�R~f�� �
pn�zdC"�e���?�\K����@&$b }jz�3۵� x/{��1 Ra�#�|��ƟUK�= &�^��TM�n�2�9�5)?s���{O'�D��D���o [kM�oK0�x�� �Td�_@]b r� �G�����; ����D��D���1�gaR�`��'`0�  �>\��/���f��������ŀ����!fn�Z�|b����U�.t���ट���r�9�+��������	�b rnE�Dk�= ��8�����!b R�Cl�P�E�`�܌�K�'~�@���}*�!`�@��6 L��;��	$b@D��?#��g�F�
��V��1�v��;�Es��Q����=ɮ�4���b@T��n��!��3q�0^�V�� c ��1�ܶ��[����M�=8I����1@�څ@Cu��`N�o�� WJĀ� W����e��I�� n��N�mீ��ܴ�_d��(�4`E܅I� ���"̵�1 *3�+\�E� �\M���)g	r���
���8�>��p�?vI� �0�ǀ~�!b������$'�%"I����R��i�1 �0��? S~&�� �r�����{ n�_�����L�?��T�e��Ǝ�7�C"r��OQ~"qI� ��O 8�?$b �܋r�#@�_�v�J̙��/��3�'d�/����W[����o'N��l��-2� ���@j�O~��0���2` H�@�؄��+����pOB� �uO��(l�S�ԕ���9����~�c�:x/�Xd�.���Ɣ�d ��V�y@F $H2� ����+M*�i��l8O@F $H2� ���2�4& r�PO��֢����7N�YS ����Y�1`��;�JS3n� g[�'��@W@"la`32�n?'�HB2p
�hām�mu �����j@F@��V����Z!��xI���H�y�ѱ)��>��Z!6 ���a�`�����dDV$9f���	pM�6�I�!LG:\LdrwPy�~�P�%��L3��7�TK��Am�mo|�6��	3��-�h J3��?�67 �yr���"����g��4. $�1���_�[*��&���S/�dq�������C��h �3��>�6Ŷ%������\�#�RZq��=lK|ŔX��X�WS�e j5 /����$���:��v@������8���d��1(�z2~F�)���3��͋���l��C�������#����=�.\Lt? %� N$9b�%�:���2��u	 �1|-�	ld�����t $b��@?���@� �F�c��ρ^�D�d�[9�ࠐz�����:
H�@ ��P2v )~���@����z5��|����R�ֵ���|`#�W39؂��<�"-�0��\<�d��u�oGLz 1��Gp����e�倯d� .�jH�@j�F�3��@ c{s<��J&	�@�����b���w��  �� ��n���v��< �����,M;��*p>p!0hH��{=�����x�]I�� DLh����<'��h8�@V �#��J���f� I�� �Hn����W�}�N�t[u�$�������� �@� 2 	�]&)�� #�3���,	=%�T���k�&�  I�����I��ӳ� �[8	�	�L�]�]t�T�g���6�-@b2 U�OV��: A?��} .i�|	�xC���rv�w; ��#�>�i 8_b82 �WP����� �� {'n���8�z;�Ƥy��s� ��@���P��o|�S�ih $3��@߹j��    IEND�B`�
```


## app\globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
 
html,
body,
:root {
  height: 100%;
}

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;

    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
 
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
 
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
 
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
 
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
 
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
 
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
 
    --radius: 0.5rem;
  }
 
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
 
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
 
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
 
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
 
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
 
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
 
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
 
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
 
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}
 
@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```


## app\layout.tsx

```tsx
import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ConvexClientProvider } from "@/providers/convex-client-provider";
import { Toaster } from "@/components/ui/sonner";
import { ModalProvider } from "@/providers/modal-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Game balancing tool",
  description: "Online game balancing tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConvexClientProvider>
          <Toaster />
          <ModalProvider />
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
```


## components\modals\rename-modal.tsx

```tsx
"use client";

import { FormEventHandler, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogClose,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useRenameModal } from "@/app/store/use-rename-modal";
import { useApiMutation } from "@/app/hooks/use-api-mutation";

export const RenameModal = () => {
  const { mutate, pending } = useApiMutation(api.board.updateTitle);
  const { isOpen, onClose, initialValues } = useRenameModal();
  const [title, setTitle] = useState(initialValues.title);

  useEffect(() => {
    setTitle(initialValues.title);
  }, [initialValues.title]);

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    mutate({
      id: initialValues.id,
      title,
    })
      .then(() => {
        toast.success("Board renamed");
        onClose();
      })
      .catch(() => toast.error("Failed to rename board"));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit board title</DialogTitle>
        </DialogHeader>
        <DialogDescription>Enter a new title for this board</DialogDescription>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            disabled={pending}
            required
            maxLength={60}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Board title"
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button disabled={pending} type="submit">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
```


## components\ui\alert-dialog.tsx

```tsx
"use client"

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

import { cn } from "@/utils/canvas"
import { buttonVariants } from "@/components/ui/button"

const AlertDialog = AlertDialogPrimitive.Root

const AlertDialogTrigger = AlertDialogPrimitive.Trigger

const AlertDialogPortal = AlertDialogPrimitive.Portal

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    />
  </AlertDialogPortal>
))
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants(), className)}
    {...props}
  />
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className
    )}
    {...props}
  />
))
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
```


## components\ui\avatar.tsx

```tsx
"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/utils/canvas"

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
```


## components\ui\button.tsx

```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/utils/canvas"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```


## components\ui\card.tsx

```tsx
import * as React from "react";
import { cn } from "@/utils/canvas";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
```


## components\ui\dialog.tsx

```tsx
"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/utils/canvas"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
```


## components\ui\dropdown-menu.tsx

```tsx
"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/utils/canvas"

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}
```


## components\ui\input.tsx

```tsx
import * as React from "react"

import { cn } from "@/utils/canvas"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
```


## components\ui\label.tsx

```tsx
"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/canvas";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
```


## components\ui\scroll-area.tsx

```tsx
"use client";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cn } from "@/utils/canvas";

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
```


## components\ui\select.tsx

```tsx
"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/utils/canvas";

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
```


## components\ui\separator.tsx

```tsx
"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cn } from "@/utils/canvas";

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
```


## components\ui\sonner.tsx

```tsx
"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
```


## components\ui\tabs.tsx

```tsx
"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/utils/canvas";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
```


## components\ui\textarea.tsx

```tsx
import * as React from "react";
import { cn } from "@/utils/canvas";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
```


## components\ui\tooltip.tsx

```tsx
"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/utils/canvas"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
```


## components\actions.tsx

```tsx
"use client";

import { toast } from "sonner";
import { Link2, Pencil, Trash2 } from "lucide-react";
import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useApiMutation } from "@/app/hooks/use-api-mutation";
import { useRenameModal } from "@/app/store/use-rename-modal";
import { ConfirmModal } from "./confirm-modal";

interface ActionsProps {
  children: React.ReactNode;
  side?: DropdownMenuContentProps["side"];
  sideOffset?: DropdownMenuContentProps["sideOffset"];
  id: string;
  title: string;
}

export const Actions = ({
  children,
  side,
  sideOffset,
  id,
  title,
}: ActionsProps) => {
  const { onOpen } = useRenameModal();
  const { mutate, pending } = useApiMutation(api.board.remove);

  const onCopyLink = () => {
    navigator.clipboard
      .writeText(`${window.location.origin}/test/${id}`)
      .then(() => toast.success("Link copied"))
      .catch(() => toast.error("Failed to copy link"));
  };

  const onDelete = () => {
    mutate({ id })
      .then(() => toast.success("Board deleted"))
      .catch(() => toast.error("Failed to delete board"));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        onClick={(e) => e.stopPropagation()}
        side={side}
        sideOffset={sideOffset}
        className="w-60"
      >
        <DropdownMenuItem onClick={onCopyLink} className="p-3 cursor-pointer">
          <Link2 className="h-4 w-4 mr-2" />
          Copy board link
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onOpen(id, title)}
          className="p-3 cursor-pointer"
        >
          <Pencil className="h-4 w-4 mr-2" />
          Rename
        </DropdownMenuItem>
        <ConfirmModal
          header="Delete board?"
          description="This will delete the board and all of its contents."
          disabled={pending}
          onConfirm={onDelete}
        >
          <Button
            variant="ghost"
            className="p-3 cursor-pointer text-sm w-full justify-start font-normal"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button> 
        </ConfirmModal>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
```


## components\confirm-modal.tsx

```tsx
"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ConfirmModalProps {
  children: React.ReactNode;
  onConfirm: () => void;
  disabled?: boolean;
  header: string;
  description?: string;
}

export const ConfirmModal = ({
  children,
  onConfirm,
  disabled,
  header,
  description,
}: ConfirmModalProps) => {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{header}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={disabled} onClick={handleConfirm}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
```


## components\hint.tsx

```tsx
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface HintProps {
  label: string;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
}

export const Hint = ({
  label,
  children,
  side,
  align,
  sideOffset,
  alignOffset,
}: HintProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          className="text-white bg-black border-black"
          side={side}
          align={align}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
        >
          <p className="font-semibold capitalize">{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
```


## components\loading.tsx

```tsx
import Image from "next/image";

export const Loading = () => {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <Image
        src="/spin.svg"
        alt="loading"
        width={120}
        height={120}
        className="animate-pulse duration-700"
      />
    </div>
  );
};
```


## components\NodeDetailsPanel.tsx

```tsx
// components/NodeDetailsPanel.tsx
"use client";

import { nanoid } from 'nanoid';
import { useEffect, useState } from "react";
import { useNodeDetails } from "@/app/store/use-node-details";
import useStore from "@/app/store/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Trash2, GripVertical } from "lucide-react";
import { cn } from "@/utils/canvas";

// Типы для вероятностных эффектов
interface ProbabilisticEffect {
  id: string;
  effect: string;
  probability: number;
}

interface ConverterProbEffect {
  id: string;
  conversionIn: number;
  conversionOut: number;
  probability: number;
}

export const NodeDetailsPanel = () => {
  const [convEffects, setConvEffects] = useState<ConverterProbEffect[]>([]);

  const { isOpen, nodeId, nodeType, closeDetails } = useNodeDetails();
  const { nodes, updateNodeData } = useStore();
  const [nodeData, setNodeData] = useState<any>(null);
  const [probEffects, setProbEffects] = useState<ProbabilisticEffect[]>([]);

  useEffect(() => {
    if (nodeId) {
      const node = nodes.find((n) => n.id === nodeId);
      const data = node?.data || {};
      // Для entity инициализируем states и events, если их нет
      if (node?.type === "entity") {
        if (!data.states) data.states = [];
        if (!data.events) data.events = [];
      }
      setNodeData(node?.data || null);
      // Инициализируем вероятностные эффекты из данных узла
      if (node?.data?.probabilisticEffects) {
        setProbEffects(node.data.probabilisticEffects);
      } else {
        setProbEffects([]);
      }

      // Для Converter
      if (node?.data?.converterProbEffects) {
        setConvEffects(node.data.converterProbEffects);
      } else {
        setConvEffects([]);
      }
    }
  }, [nodeId, nodes]);

  if (!isOpen || !nodeId || !nodeData) return null;

  const handleChange = (key: string, value: any) => {
    const updated = { ...nodeData, [key]: value };
    setNodeData(updated);
    updateNodeData(nodeId, updated);
  };

  // ========== Массивы (states, events) ==========
  const handleArrayAdd = (field: string) => {
    const current = nodeData[field] || [];
    handleChange(field, [...current, ""]);
  };

  const handleArrayRemove = (field: string, index: number) => {
    const current = nodeData[field] || [];
    handleChange(
      field,
      current.filter((_: any, i: number) => i !== index)
    );
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    const current = nodeData[field] || [];
    const newArray = [...current];
    newArray[index] = value;
    handleChange(field, newArray);
  };

  // ========== Вероятностные эффекты ==========
  const handleProbEffectChange = (id: string, field: keyof ProbabilisticEffect, value: any) => {
    const newEffects = probEffects.map((eff) =>
      eff.id === id ? { ...eff, [field]: value } : eff
    );
    setProbEffects(newEffects);
    handleChange("probabilisticEffects", newEffects);
  };

  const addProbEffect = () => {
    const newEffect: ProbabilisticEffect = {
      id: crypto.randomUUID(),
      effect: "",
      probability: 0.5,
    };
    const newEffects = [...probEffects, newEffect];
    setProbEffects(newEffects);
    handleChange("probabilisticEffects", newEffects);
  };

  const removeProbEffect = (id: string) => {
    const newEffects = probEffects.filter((eff) => eff.id !== id);
    setProbEffects(newEffects);
    handleChange("probabilisticEffects", newEffects);
  };

  // ========== Converter эффекты ==========

  const handleConvEffectChange = (id: string, field: keyof ConverterProbEffect, value: any) => {
  const newEffects = convEffects.map((eff) =>
    eff.id === id ? { ...eff, [field]: value } : eff
  );
  setConvEffects(newEffects);
  handleChange("converterProbEffects", newEffects);
  };

  const addConvEffect = () => {
    const newEffect: ConverterProbEffect = {
      id: nanoid(),
      conversionIn: 1,
      conversionOut: 1,
      probability: 0.5,
    };
    const newEffects = [...convEffects, newEffect];
    setConvEffects(newEffects);
    handleChange("converterProbEffects", newEffects);
  };

  const removeConvEffect = (id: string) => {
    const newEffects = convEffects.filter((eff) => eff.id !== id);
    setConvEffects(newEffects);
    handleChange("converterProbEffects", newEffects);
  };

  // ========== Перечисления (enum) ==========
  const handleEnumAdd = () => {
    const current = nodeData.enumValues || [];
    handleChange("enumValues", [...current, ""]);
  };

  const handleEnumRemove = (index: number) => {
    const current = nodeData.enumValues || [];
    handleChange(
      "enumValues",
      current.filter((_: any, i: number) => i !== index)
    );
  };

  const handleEnumChange = (index: number, value: string) => {
    const current = nodeData.enumValues || [];
    const newArray = [...current];
    newArray[index] = value;
    handleChange("enumValues", newArray);
  };

    // Новые функции для работы с состояниями (states) как с объектами
  const handleStateAdd = () => {
    const current = nodeData.states || [];
    const newState = {
      id: crypto.randomUUID(),
      name: "",
      type: "int",
      range: [0, 100],
      enumValues: [],
      listType: "",
    };
    handleChange("states", [...current, newState]);
  };

  const handleStateRemove = (id: string) => {
    const current = nodeData.states || [];
    handleChange("states", current.filter((s: any) => s.id !== id));
  };

  const handleStateChange = (id: string, field: string, value: any) => {
    const current = nodeData.states || [];
    const updated = current.map((s: any) =>
      s.id === id ? { ...s, [field]: value } : s
    );
    handleChange("states", updated);
  };

  // Функции для работы с событиями (events) внутри entity
  const handleEventAdd = () => {
    const current = nodeData.events || [];
    const newEvent = {
      id: crypto.randomUUID(),
      name: "",
      requires: "",
      effect: "",
      probabilisticEffects: [],
    };
    handleChange("events", [...current, newEvent]);
  };

  const handleEventRemove = (id: string) => {
    const current = nodeData.events || [];
    handleChange("events", current.filter((e: any) => e.id !== id));
  };

  const handleEventChange = (id: string, field: string, value: any) => {
    const current = nodeData.events || [];
    const updated = current.map((e: any) =>
      e.id === id ? { ...e, [field]: value } : e
    );
    handleChange("events", updated);
  };

  // Функции для вероятностных эффектов внутри события (аналогично отдельному event)
  const handleEventProbEffectChange = (eventId: string, effectId: string, field: string, value: any) => {
    const current = nodeData.events || [];
    const updatedEvents = current.map((e: any) => {
      if (e.id !== eventId) return e;
      const newEffects = (e.probabilisticEffects || []).map((eff: any) =>
        eff.id === effectId ? { ...eff, [field]: value } : eff
      );
      return { ...e, probabilisticEffects: newEffects };
    });
    handleChange("events", updatedEvents);
  };

  const addEventProbEffect = (eventId: string) => {
    const current = nodeData.events || [];
    const updatedEvents = current.map((e: any) => {
      if (e.id !== eventId) return e;
      const newEffect = {
        id: crypto.randomUUID(),
        effect: "",
        probability: 0.5,
      };
      return { ...e, probabilisticEffects: [...(e.probabilisticEffects || []), newEffect] };
    });
    handleChange("events", updatedEvents);
  };

  const removeEventProbEffect = (eventId: string, effectId: string) => {
    const current = nodeData.events || [];
    const updatedEvents = current.map((e: any) => {
      if (e.id !== eventId) return e;
      return { ...e, probabilisticEffects: (e.probabilisticEffects || []).filter((eff: any) => eff.id !== effectId) };
    });
    handleChange("events", updatedEvents);
  };


  // ========== Рендер полей по типу ==========

  const renderEntityFields = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="entity-name">Name</Label>
        <Input
          id="entity-name"
          value={nodeData.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </div>

    {/* States */}
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Label className="text-base font-semibold">States</Label>
        <Button variant="outline" size="sm" onClick={handleStateAdd}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add State
        </Button>
      </div>
      {(nodeData.states || []).map((state: any) => (
        <Card
          key={`${state.id}-${state.type}`} // <-- ключ включает тип, чтобы React пересоздавал карточку при смене типа
          className="relative"
        >
          <CardHeader className="p-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm">
              {state.name || "New State"}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleStateRemove(state.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-3 pt-0 space-y-3">
            <div className="space-y-1">
              <Label className="text-xs">State Name</Label>
              <Input
                value={state.name}
                onChange={(e) =>
                  handleStateChange(state.id, "name", e.target.value)
                }
                placeholder="e.g., Health"
                className="text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Type</Label>
              <Select
                value={state.type}
                onValueChange={(v) =>
                  handleStateChange(state.id, "type", v)
                }
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="int">Integer</SelectItem>
                  <SelectItem value="enum">Enumeration</SelectItem>
                  <SelectItem value="list">List</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {state.type === "int" && (
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Min</Label>
                  <Input
                    type="number"
                    value={state.range?.[0] ?? 0}
                    onChange={(e) =>
                      handleStateChange(state.id, "range", [
                        parseInt(e.target.value) || 0,
                        state.range?.[1] ?? 100,
                      ])
                    }
                    className="h-8"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Max</Label>
                  <Input
                    type="number"
                    value={state.range?.[1] ?? 100}
                    onChange={(e) =>
                      handleStateChange(state.id, "range", [
                        state.range?.[0] ?? 0,
                        parseInt(e.target.value) || 100,
                      ])
                    }
                    className="h-8"
                  />
                </div>
              </div>
            )}
            {state.type === "enum" && (
              <div className="space-y-2">
                <Label className="text-xs">Enum Values</Label>
                {(state.enumValues || []).map((val: string, idx: number) => (
                  <div
                    key={`${state.id}-enum-${idx}`} // уникальный ключ
                    className="flex items-center gap-2"
                  >
                    <Input
                      value={val}
                      onChange={(e) => {
                        const newVals = [...(state.enumValues || [])];
                        newVals[idx] = e.target.value;
                        handleStateChange(state.id, "enumValues", newVals);
                      }}
                      placeholder={`Value ${idx + 1}`}
                      className="text-sm flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newVals = [...(state.enumValues || [])];
                        newVals.splice(idx, 1);
                        handleStateChange(state.id, "enumValues", newVals);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newVals = [...(state.enumValues || []), ""];
                    handleStateChange(state.id, "enumValues", newVals);
                  }}
                  className="w-full"
                >
                  <PlusCircle className="h-3 w-3 mr-1" />
                  Add Value
                </Button>
              </div>
            )}
            {state.type === "list" && (
              <div className="space-y-1">
                <Label className="text-xs">List Type (Entity name)</Label>
                <Input
                  value={state.listType || ""}
                  onChange={(e) =>
                    handleStateChange(state.id, "listType", e.target.value)
                  }
                  placeholder="e.g., Card"
                  className="text-sm"
                />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>

      {/* Events */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label className="text-base font-semibold">Events</Label>
          <Button variant="outline" size="sm" onClick={handleEventAdd}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>
        {(nodeData.events || []).map((event: any) => (
          <Card key={event.id} className="relative">
            <CardHeader className="p-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm">
                {event.name || "New Event"}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEventRemove(event.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-3 pt-0 space-y-3">
              <div className="space-y-1">
                <Label className="text-xs">Event Name</Label>
                <Input
                  value={event.name}
                  onChange={(e) =>
                    handleEventChange(event.id, "name", e.target.value)
                  }
                  placeholder="e.g., Attack"
                  className="text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Requires (condition)</Label>
                <Textarea
                  value={event.requires || ""}
                  onChange={(e) =>
                    handleEventChange(event.id, "requires", e.target.value)
                  }
                  placeholder="e.g., Player.Mana >= 1"
                  className="font-mono text-xs"
                  rows={2}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Default Effect</Label>
                <Textarea
                  value={event.effect || ""}
                  onChange={(e) =>
                    handleEventChange(event.id, "effect", e.target.value)
                  }
                  placeholder="e.g., Target.Health -= Self.Attack"
                  className="font-mono text-xs"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-xs">Probabilistic Effects</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addEventProbEffect(event.id)}
                  >
                    <PlusCircle className="h-3 w-3 mr-1" />
                    Add Effect
                  </Button>
                </div>
                {(event.probabilisticEffects || []).map((eff: any, idx: number) => (
                  <div key={eff.id} className="border rounded-md p-2 space-y-2 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium">Effect #{idx + 1}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeEventProbEffect(event.id, eff.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Effect</Label>
                      <Textarea
                        value={eff.effect}
                        onChange={(e) =>
                          handleEventProbEffectChange(
                            event.id,
                            eff.id,
                            "effect",
                            e.target.value
                          )
                        }
                        placeholder="e.g., Self.Health -= Target.Attack"
                        className="font-mono text-xs"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Probability (0-1)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="1"
                        step="0.1"
                        value={eff.probability}
                        onChange={(e) =>
                          handleEventProbEffectChange(
                            event.id,
                            eff.id,
                            "probability",
                            parseFloat(e.target.value)
                          )
                        }
                        className="h-8"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderStateFields = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={nodeData.name || ""} onChange={(e) => handleChange("name", e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="valueType">Value Type</Label>
        <Select value={nodeData.valueType} onValueChange={(v) => handleChange("valueType", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="int">Integer</SelectItem>
            <SelectItem value="enum">Enumeration</SelectItem>
            <SelectItem value="list">List</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {nodeData.valueType === "int" && (
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="min">Min</Label>
            <Input
              id="min"
              type="number"
              value={nodeData.range?.[0] || 0}
              onChange={(e) => handleChange("range", [parseInt(e.target.value), nodeData.range?.[1]])}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="max">Max</Label>
            <Input
              id="max"
              type="number"
              value={nodeData.range?.[1] || 100}
              onChange={(e) => handleChange("range", [nodeData.range?.[0], parseInt(e.target.value)])}
            />
          </div>
        </div>
      )}

      {nodeData.valueType === "enum" && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label>Enum Values</Label>
            <Button variant="outline" size="sm" onClick={handleEnumAdd}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Value
            </Button>
          </div>
          {(nodeData.enumValues || []).map((value: string, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
              <Input
                value={value}
                onChange={(e) => handleEnumChange(index, e.target.value)}
                placeholder={`Value ${index + 1}`}
                className="flex-1"
              />
              <Button variant="ghost" size="icon" onClick={() => handleEnumRemove(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderEventFields = () => (
    <Tabs defaultValue="main" className="w-full">
      <TabsList className="grid grid-cols-3">
        <TabsTrigger value="main">Main</TabsTrigger>
        <TabsTrigger value="probabilistic">Probabilities</TabsTrigger>
        <TabsTrigger value="advanced">Advanced</TabsTrigger>
      </TabsList>

      <TabsContent value="main" className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={nodeData.name || ""} onChange={(e) => handleChange("name", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="requires">Requires (condition)</Label>
          <Textarea
            id="requires"
            value={nodeData.requires || ""}
            onChange={(e) => handleChange("requires", e.target.value)}
            placeholder="e.g., Player.Mana >= 1"
            className="font-mono text-sm"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="effect">Default Effect</Label>
          <Textarea
            id="effect"
            value={nodeData.effect || ""}
            onChange={(e) => handleChange("effect", e.target.value)}
            placeholder="e.g., Target.Health -= Self.Attack"
            className="font-mono text-sm"
          />
        </div>
      </TabsContent>

      <TabsContent value="probabilistic" className="space-y-4 mt-4">
        <div className="flex justify-between items-center">
          <Label>Probabilistic Effects</Label>
          <Button variant="outline" size="sm" onClick={addProbEffect}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Effect
          </Button>
        </div>
        {probEffects.map((eff, index) => (
          <Card key={eff.id} className="relative">
            <CardHeader className="p-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Effect #{index + 1}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => removeProbEffect(eff.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-3 pt-0 space-y-2">
              <div className="space-y-1">
                <Label className="text-xs">Effect</Label>
                <Textarea
                  value={eff.effect}
                  onChange={(e) => handleProbEffectChange(eff.id, "effect", e.target.value)}
                  placeholder="e.g., Self.Health -= Target.Attack"
                  className="font-mono text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Probability (0-1)</Label>
                <Input
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={eff.probability}
                  onChange={(e) => handleProbEffectChange(eff.id, "probability", parseFloat(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </TabsContent>

      <TabsContent value="advanced" className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="cooldown">Cooldown (turns)</Label>
          <Input
            id="cooldown"
            type="number"
            min="0"
            value={nodeData.cooldown || 0}
            onChange={(e) => handleChange("cooldown", parseInt(e.target.value))}
          />
        </div>
        {/* Можно добавить другие поля */}
      </TabsContent>
    </Tabs>
  );

  const renderRuleFields = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={nodeData.name || ""} onChange={(e) => handleChange("name", e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="when">When (condition)</Label>
        <Textarea
          id="when"
          value={nodeData.when || ""}
          onChange={(e) => handleChange("when", e.target.value)}
          placeholder="e.g., Attacker.Element = Fire and Target.Element = Air"
          className="font-mono text-sm"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="effect">Effect</Label>
        <Textarea
          id="effect"
          value={nodeData.effect || ""}
          onChange={(e) => handleChange("effect", e.target.value)}
          placeholder="e.g., Attacker.Attack *= 1.5"
          className="font-mono text-sm"
        />
      </div>
    </div>
  );

  const renderOperatorFields = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="operator">Operator</Label>
        <Select value={nodeData.operator || "X"} onValueChange={(v) => handleChange("operator", v)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="X">X (Next)</SelectItem>
            <SelectItem value="F">F (Future)</SelectItem>
            <SelectItem value="G">G (Globally)</SelectItem>
            <SelectItem value="U">U (Until)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* При необходимости добавить поля для аргументов */}
    </div>
  );

const renderSourceFields = () => (
  <Tabs defaultValue="main" className="w-full">
    <TabsList className="grid grid-cols-2">
      <TabsTrigger value="main">Main</TabsTrigger>
      <TabsTrigger value="distribution">Distribution</TabsTrigger>
    </TabsList>
    <TabsContent value="main" className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={nodeData.name || ""} onChange={(e) => handleChange("name", e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="generationRate">Generation Rate</Label>
        <Input id="generationRate" type="number" value={nodeData.generationRate ?? 1} onChange={(e) => handleChange("generationRate", parseInt(e.target.value))} />
      </div>
    </TabsContent>
    <TabsContent value="distribution" className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="distributionType">Distribution Type</Label>
        <Select value={nodeData.distributionType || "deterministic"} onValueChange={(v) => handleChange("distributionType", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="deterministic">Deterministic</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="exponential">Exponential</SelectItem>
            <SelectItem value="temporal">Temporal</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {nodeData.distributionType === "deterministic" && (
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="triggerEvent">Trigger</Label>
            <Textarea id="triggerEvent" value={nodeData.triggerEvent || ""} onChange={(e) => handleChange("triggerEvent", e.target.value)} />
          </div>
        </div>
      )}
      {nodeData.distributionType === "normal" && (
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="mean">Mean</Label>
            <Input id="mean" type="number" value={nodeData.mean ?? 0} onChange={(e) => handleChange("mean", parseFloat(e.target.value))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stddev">Std Dev</Label>
            <Input id="stddev" type="number" value={nodeData.stddev ?? 1} onChange={(e) => handleChange("stddev", parseFloat(e.target.value))} />
          </div>
        </div>
      )}
      {nodeData.distributionType === "exponential" && (
        <div className="space-y-2">
          <Label htmlFor="rate">Rate</Label>
          <Input id="rate" type="number" value={nodeData.rate ?? 1} onChange={(e) => handleChange("rate", parseFloat(e.target.value))} />
        </div>
      )}
      {nodeData.distributionType === "temporal" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="startTurn">Start Turn</Label>
            <Input id="startTurn" type="number" value={nodeData.startTurn ?? 1} onChange={(e) => handleChange("startTurn", parseInt(e.target.value))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="interval">Interval (turns)</Label>
            <Input id="interval" type="number" value={nodeData.interval ?? 1} onChange={(e) => handleChange("interval", parseInt(e.target.value))} />
          </div>
        </>
      )}
    </TabsContent>
  </Tabs>
);

const renderPoolFields = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Label htmlFor="name">Name</Label>
      <Input id="name" value={nodeData.name || ""} onChange={(e) => handleChange("name", e.target.value)} />
    </div>
    <div className="space-y-2">
      <Label htmlFor="resourceType">Resource Type</Label>
      <Input id="resourceType" value={nodeData.resourceType || ""} onChange={(e) => handleChange("resourceType", e.target.value)} />
    </div>
    <div className="grid grid-cols-2 gap-2">
      <div className="space-y-2">
        <Label htmlFor="min">Min</Label>
        <Input id="min" type="number" value={nodeData.min ?? 0} onChange={(e) => handleChange("min", parseInt(e.target.value))} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="max">Max</Label>
        <Input id="max" type="number" value={nodeData.max ?? 100} onChange={(e) => handleChange("max", parseInt(e.target.value))} />
      </div>
    </div>
    <div className="space-y-2">
      <Label htmlFor="initialValue">Initial Value</Label>
      <Input id="initialValue" type="number" value={nodeData.initialValue ?? 0} onChange={(e) => handleChange("initialValue", parseInt(e.target.value))} />
    </div>
  </div>
);

const renderConsumerFields = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Label htmlFor="name">Name</Label>
      <Input id="name" value={nodeData.name || ""} onChange={(e) => handleChange("name", e.target.value)} />
    </div>
    <div className="space-y-2">
      <Label htmlFor="consumptionAmount">Consumption Amount</Label>
      <Input id="consumptionAmount" type="number" value={nodeData.consumptionAmount ?? 1} onChange={(e) => handleChange("consumptionAmount", parseInt(e.target.value))} />
      <p className="text-xs text-gray-500">Amount consumed per activation. If not specified, uses edge value.</p>
    </div>
  </div>
);

const renderConverterFields = () => (
  <Tabs defaultValue="main" className="w-full">
    <TabsList className="grid grid-cols-2">
      <TabsTrigger value="main">Main</TabsTrigger>
      <TabsTrigger value="probabilistic">Probabilities</TabsTrigger>
    </TabsList>
    <TabsContent value="main" className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={nodeData.name || ""} onChange={(e) => handleChange("name", e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="conversionRatio">Default Ratio (in:out)</Label>
        <div className="flex gap-2">
          <Input type="number" value={nodeData.conversionIn ?? 1} onChange={(e) => handleChange("conversionIn", parseInt(e.target.value))} className="w-20" />
          <span>:</span>
          <Input type="number" value={nodeData.conversionOut ?? 1} onChange={(e) => handleChange("conversionOut", parseInt(e.target.value))} className="w-20" />
        </div>
      </div>
    </TabsContent>
    <TabsContent value="probabilistic" className="space-y-4 mt-4">
      <div className="flex justify-between items-center">
        <Label>Probabilistic Effects</Label>
        <Button variant="outline" size="sm" onClick={addConvEffect}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Effect
        </Button>
      </div>
      {convEffects.map((eff, index) => (
        <Card key={eff.id} className="relative">
          <CardHeader className="p-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Effect #{index + 1}</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => removeConvEffect(eff.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-3 pt-0 space-y-2">
            <div className="space-y-1">
              <Label className="text-xs">Conversion (in:out)</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={eff.conversionIn}
                  onChange={(e) => handleConvEffectChange(eff.id, "conversionIn", parseInt(e.target.value))}
                  className="w-20"
                />
                <span>:</span>
                <Input
                  type="number"
                  value={eff.conversionOut}
                  onChange={(e) => handleConvEffectChange(eff.id, "conversionOut", parseInt(e.target.value))}
                  className="w-20"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Probability (0-1)</Label>
              <Input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={eff.probability}
                onChange={(e) => handleConvEffectChange(eff.id, "probability", parseFloat(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </TabsContent>
  </Tabs>
);

const renderGateFields = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Label htmlFor="name">Name</Label>
      <Input id="name" value={nodeData.name || ""} onChange={(e) => handleChange("name", e.target.value)} />
    </div>
    <div className="space-y-2">
      <Label htmlFor="gateType">Routing Type</Label>
      <Select value={nodeData.gateType || "probabilistic"} onValueChange={(v) => handleChange("gateType", v)}>
        <SelectTrigger>
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="probabilistic">Probabilistic</SelectItem>
          <SelectItem value="conditional">Conditional</SelectItem>
        </SelectContent>
      </Select>
      {nodeData.gateType === "conditional" && (
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="condition">Condition</Label>
            <Textarea id="condition" value={nodeData.condition || ""} onChange={(e) => handleChange("condition", e.target.value)} />
          </div>
        </div>
      )}
    </div>
  </div>
);

const renderDelayFields = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Label htmlFor="name">Name</Label>
      <Input id="name" value={nodeData.name || ""} onChange={(e) => handleChange("name", e.target.value)} />
    </div>
    <div className="space-y-2">
      <Label htmlFor="delaySteps">Delay Steps</Label>
      <Input id="delaySteps" type="number" min="0" value={nodeData.delaySteps ?? 1} onChange={(e) => handleChange("delaySteps", parseInt(e.target.value))} />
    </div>
  </div>
);

const renderEndFields = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Label htmlFor="name">Name</Label>
      <Input id="name" value={nodeData.name || ""} onChange={(e) => handleChange("name", e.target.value)} />
    </div>
    <div className="space-y-2">
      <Label htmlFor="endType">End Condition Type</Label>
      <Select value={nodeData.endType || "win"} onValueChange={(v) => handleChange("endType", v)}>
        <SelectTrigger>
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="win">Win</SelectItem>
          <SelectItem value="lose">Lose</SelectItem>
          <SelectItem value="draw">Draw</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
);

const renderTriggerFields = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Label htmlFor="name">Name</Label>
      <Input id="name" value={nodeData.name || ""} onChange={(e) => handleChange("name", e.target.value)} />
    </div>
    <div className="space-y-2">
      <Label htmlFor="triggerEvent">Trigger Event</Label>
      <Input id="triggerEvent" value={nodeData.triggerEvent || ""} onChange={(e) => handleChange("triggerEvent", e.target.value)} />
      <p className="text-xs text-gray-500">Name of the event that triggers this node.</p>
    </div>
  </div>
);

  return (
    <div className="absolute top-20 right-4 w-96 bg-white rounded-lg shadow-xl p-4 z-50 border max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg capitalize">{nodeType} Properties</h3>
        <button onClick={closeDetails} className="text-gray-500 hover:text-gray-700">
          ✖
        </button>
      </div>
      <ScrollArea className="h-[calc(80vh-8rem)] pr-4">
        <div className="space-y-6">
          {nodeType === "entity" && renderEntityFields()}
          {nodeType === "state" && renderStateFields()}
          {nodeType === "event" && renderEventFields()}
          {nodeType === "rule" && renderRuleFields()}
          {nodeType === "operator" && renderOperatorFields()}

          {nodeType === "source" && renderSourceFields()}
          {nodeType === "pool" && renderPoolFields()}
          {nodeType === "consumer" && renderConsumerFields()}
          {nodeType === "converter" && renderConverterFields()}
          {nodeType === "gate" && renderGateFields()}
          {nodeType === "delay" && renderDelayFields()}
          {nodeType === "end" && renderEndFields()}
          {nodeType === "trigger" && renderTriggerFields()}

          <Separator />

          {/* Блок аналитики (можно оставить) */}
          <div>
            <h4 className="font-semibold mb-2">Analytics</h4>
            <div className="bg-gray-50 p-2 rounded text-sm text-gray-600">
              Simulation data will appear here.
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
```


## components\room.tsx

```tsx
"use client";

import { ClientSideSuspense } from "@liveblocks/react";
import { LiveMap, LiveList, LiveObject } from "@liveblocks/client";

import { RoomProvider } from "@/liveblocks.config";
import { Layer } from "@/app/types/canvas";
import useStore from "@/app/store/store";
import { useEffect } from "react";

interface RoomProps {
  children: React.ReactNode;
  roomId: string;
  fallback: NonNullable<React.ReactNode> | null;
}

export const Room = ({ children, roomId, fallback }: RoomProps) => {
  const {
    liveblocks: { enterRoom, leaveRoom },
  } = useStore();

  useEffect(() => {
    enterRoom(roomId);
    return () => leaveRoom();
  }, [enterRoom, leaveRoom, roomId]);

  return (
    <RoomProvider
      id={roomId}
      initialPresence={{
        cursor: null,
        selection: [],
        // для рисования карандашем
        pencilDraft: null,
        penColor: null,
      }}
      initialStorage={{
        layers: new LiveMap<string, LiveObject<Layer>>(),
        layerIds: new LiveList([]),
      }}
    >
      <ClientSideSuspense fallback={fallback}>
        {() => children}
      </ClientSideSuspense>
    </RoomProvider>
  );
};
```


## convex\_generated\api.d.ts

```ts
/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as board from "../board.js";
import type * as boards from "../boards.js";
import type * as boardsHistory from "../boardsHistory.js";
import type * as validators_boardData from "../validators/boardData.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  board: typeof board;
  boards: typeof boards;
  boardsHistory: typeof boardsHistory;
  "validators/boardData": typeof validators_boardData;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
```


## convex\_generated\api.js

```js
/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import { anyApi } from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export const api = anyApi;
export const internal = anyApi;
```


## convex\_generated\dataModel.d.ts

```ts
/* eslint-disable */
/**
 * Generated data model types.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  DataModelFromSchemaDefinition,
  DocumentByName,
  TableNamesInDataModel,
  SystemTableNames,
} from "convex/server";
import type { GenericId } from "convex/values";
import schema from "../schema.js";

/**
 * The names of all of your Convex tables.
 */
export type TableNames = TableNamesInDataModel<DataModel>;

/**
 * The type of a document stored in Convex.
 *
 * @typeParam TableName - A string literal type of the table name (like "users").
 */
export type Doc<TableName extends TableNames> = DocumentByName<
  DataModel,
  TableName
>;

/**
 * An identifier for a document in Convex.
 *
 * Convex documents are uniquely identified by their `Id`, which is accessible
 * on the `_id` field. To learn more, see [Document IDs](https://docs.convex.dev/using/document-ids).
 *
 * Documents can be loaded using `db.get(id)` in query and mutation functions.
 *
 * IDs are just strings at runtime, but this type can be used to distinguish them from other
 * strings when type checking.
 *
 * @typeParam TableName - A string literal type of the table name (like "users").
 */
export type Id<TableName extends TableNames | SystemTableNames> =
  GenericId<TableName>;

/**
 * A type describing your Convex data model.
 *
 * This type includes information about what tables you have, the type of
 * documents stored in those tables, and the indexes defined on them.
 *
 * This type is used to parameterize methods like `queryGeneric` and
 * `mutationGeneric` to make them type-safe.
 */
export type DataModel = DataModelFromSchemaDefinition<typeof schema>;
```


## convex\_generated\server.d.ts

```ts
/* eslint-disable */
/**
 * Generated utilities for implementing server-side Convex query and mutation functions.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import {
  ActionBuilder,
  HttpActionBuilder,
  MutationBuilder,
  QueryBuilder,
  GenericActionCtx,
  GenericMutationCtx,
  GenericQueryCtx,
  GenericDatabaseReader,
  GenericDatabaseWriter,
} from "convex/server";
import type { DataModel } from "./dataModel.js";

/**
 * Define a query in this Convex app's public API.
 *
 * This function will be allowed to read your Convex database and will be accessible from the client.
 *
 * @param func - The query function. It receives a {@link QueryCtx} as its first argument.
 * @returns The wrapped query. Include this as an `export` to name it and make it accessible.
 */
export declare const query: QueryBuilder<DataModel, "public">;

/**
 * Define a query that is only accessible from other Convex functions (but not from the client).
 *
 * This function will be allowed to read from your Convex database. It will not be accessible from the client.
 *
 * @param func - The query function. It receives a {@link QueryCtx} as its first argument.
 * @returns The wrapped query. Include this as an `export` to name it and make it accessible.
 */
export declare const internalQuery: QueryBuilder<DataModel, "internal">;

/**
 * Define a mutation in this Convex app's public API.
 *
 * This function will be allowed to modify your Convex database and will be accessible from the client.
 *
 * @param func - The mutation function. It receives a {@link MutationCtx} as its first argument.
 * @returns The wrapped mutation. Include this as an `export` to name it and make it accessible.
 */
export declare const mutation: MutationBuilder<DataModel, "public">;

/**
 * Define a mutation that is only accessible from other Convex functions (but not from the client).
 *
 * This function will be allowed to modify your Convex database. It will not be accessible from the client.
 *
 * @param func - The mutation function. It receives a {@link MutationCtx} as its first argument.
 * @returns The wrapped mutation. Include this as an `export` to name it and make it accessible.
 */
export declare const internalMutation: MutationBuilder<DataModel, "internal">;

/**
 * Define an action in this Convex app's public API.
 *
 * An action is a function which can execute any JavaScript code, including non-deterministic
 * code and code with side-effects, like calling third-party services.
 * They can be run in Convex's JavaScript environment or in Node.js using the "use node" directive.
 * They can interact with the database indirectly by calling queries and mutations using the {@link ActionCtx}.
 *
 * @param func - The action. It receives an {@link ActionCtx} as its first argument.
 * @returns The wrapped action. Include this as an `export` to name it and make it accessible.
 */
export declare const action: ActionBuilder<DataModel, "public">;

/**
 * Define an action that is only accessible from other Convex functions (but not from the client).
 *
 * @param func - The function. It receives an {@link ActionCtx} as its first argument.
 * @returns The wrapped function. Include this as an `export` to name it and make it accessible.
 */
export declare const internalAction: ActionBuilder<DataModel, "internal">;

/**
 * Define an HTTP action.
 *
 * This function will be used to respond to HTTP requests received by a Convex
 * deployment if the requests matches the path and method where this action
 * is routed. Be sure to route your action in `convex/http.js`.
 *
 * @param func - The function. It receives an {@link ActionCtx} as its first argument.
 * @returns The wrapped function. Import this function from `convex/http.js` and route it to hook it up.
 */
export declare const httpAction: HttpActionBuilder;

/**
 * A set of services for use within Convex query functions.
 *
 * The query context is passed as the first argument to any Convex query
 * function run on the server.
 *
 * This differs from the {@link MutationCtx} because all of the services are
 * read-only.
 */
export type QueryCtx = GenericQueryCtx<DataModel>;

/**
 * A set of services for use within Convex mutation functions.
 *
 * The mutation context is passed as the first argument to any Convex mutation
 * function run on the server.
 */
export type MutationCtx = GenericMutationCtx<DataModel>;

/**
 * A set of services for use within Convex action functions.
 *
 * The action context is passed as the first argument to any Convex action
 * function run on the server.
 */
export type ActionCtx = GenericActionCtx<DataModel>;

/**
 * An interface to read from the database within Convex query functions.
 *
 * The two entry points are {@link DatabaseReader.get}, which fetches a single
 * document by its {@link Id}, or {@link DatabaseReader.query}, which starts
 * building a query.
 */
export type DatabaseReader = GenericDatabaseReader<DataModel>;

/**
 * An interface to read from and write to the database within Convex mutation
 * functions.
 *
 * Convex guarantees that all writes within a single mutation are
 * executed atomically, so you never have to worry about partial writes leaving
 * your data in an inconsistent state. See [the Convex Guide](https://docs.convex.dev/understanding/convex-fundamentals/functions#atomicity-and-optimistic-concurrency-control)
 * for the guarantees Convex provides your functions.
 */
export type DatabaseWriter = GenericDatabaseWriter<DataModel>;
```


## convex\_generated\server.js

```js
/* eslint-disable */
/**
 * Generated utilities for implementing server-side Convex query and mutation functions.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import {
  actionGeneric,
  httpActionGeneric,
  queryGeneric,
  mutationGeneric,
  internalActionGeneric,
  internalMutationGeneric,
  internalQueryGeneric,
} from "convex/server";

/**
 * Define a query in this Convex app's public API.
 *
 * This function will be allowed to read your Convex database and will be accessible from the client.
 *
 * @param func - The query function. It receives a {@link QueryCtx} as its first argument.
 * @returns The wrapped query. Include this as an `export` to name it and make it accessible.
 */
export const query = queryGeneric;

/**
 * Define a query that is only accessible from other Convex functions (but not from the client).
 *
 * This function will be allowed to read from your Convex database. It will not be accessible from the client.
 *
 * @param func - The query function. It receives a {@link QueryCtx} as its first argument.
 * @returns The wrapped query. Include this as an `export` to name it and make it accessible.
 */
export const internalQuery = internalQueryGeneric;

/**
 * Define a mutation in this Convex app's public API.
 *
 * This function will be allowed to modify your Convex database and will be accessible from the client.
 *
 * @param func - The mutation function. It receives a {@link MutationCtx} as its first argument.
 * @returns The wrapped mutation. Include this as an `export` to name it and make it accessible.
 */
export const mutation = mutationGeneric;

/**
 * Define a mutation that is only accessible from other Convex functions (but not from the client).
 *
 * This function will be allowed to modify your Convex database. It will not be accessible from the client.
 *
 * @param func - The mutation function. It receives a {@link MutationCtx} as its first argument.
 * @returns The wrapped mutation. Include this as an `export` to name it and make it accessible.
 */
export const internalMutation = internalMutationGeneric;

/**
 * Define an action in this Convex app's public API.
 *
 * An action is a function which can execute any JavaScript code, including non-deterministic
 * code and code with side-effects, like calling third-party services.
 * They can be run in Convex's JavaScript environment or in Node.js using the "use node" directive.
 * They can interact with the database indirectly by calling queries and mutations using the {@link ActionCtx}.
 *
 * @param func - The action. It receives an {@link ActionCtx} as its first argument.
 * @returns The wrapped action. Include this as an `export` to name it and make it accessible.
 */
export const action = actionGeneric;

/**
 * Define an action that is only accessible from other Convex functions (but not from the client).
 *
 * @param func - The function. It receives an {@link ActionCtx} as its first argument.
 * @returns The wrapped function. Include this as an `export` to name it and make it accessible.
 */
export const internalAction = internalActionGeneric;

/**
 * Define a Convex HTTP action.
 *
 * @param func - The function. It receives an {@link ActionCtx} as its first argument, and a `Request` object
 * as its second.
 * @returns The wrapped endpoint function. Route a URL path to this function in `convex/http.js`.
 */
export const httpAction = httpActionGeneric;
```


## convex\validators\boardData.ts

```ts
import { Infer, v } from "convex/values";
import { MarkerType } from "reactflow";

export const boardEdgesTypeValue = v.union(
  v.literal("Default"),
  v.literal("SmoothStep"),
  v.literal("Bezier")
);

const boardHistoryTypeValue = v.union(
  v.literal("snapshot"),
  v.literal("patch")
);

const positionConvexValue = v.object({
  x: v.number(),
  y: v.number(),
});

const nodeDataConvexValue = v.object({
  label: v.union(v.string(), v.number()),
  struct: v.string(),
  name: v.string(),
});

const nodeConvexValue = v.object({
  id: v.string(),
  type: v.string(),
  width: v.number(),
  height: v.number(),
  selected: v.boolean(),
  dragging: v.boolean(),
  positionAbsolute: positionConvexValue,
  position: positionConvexValue,
  data: nodeDataConvexValue,
});

const edgeMarkerEndConvexValue = v.object({
  type: v.union(v.literal(MarkerType.Arrow), v.literal(MarkerType.ArrowClosed)),
  width: v.number(),
  height: v.number(),
  color: v.string(),
});

const edgeConvexValue = v.object({
  source: v.string(),
  target: v.string(),
  id: v.string(),
  type: v.string(),
  animated: v.boolean(),
  data: v.union(v.number(), v.float64(), v.string()),
  selected: v.boolean(),
  markerEnd: v.optional(v.union(v.string(), edgeMarkerEndConvexValue)),
});

const boardDataSnapshotConvexValue = v.object({
  nodes: v.array(nodeConvexValue),
  edges: v.array(edgeConvexValue),
  // layerIds: v.array(v.string()),
  // layers: layersConvexRecord,
});

// const layersFillConvexValue = v.object({
//   r: v.number(),
//   g: v.number(),
//   b: v.number(),
// });

// const layersConvexValue = v.object({
//   type: v.number(),
//   x: v.number(),
//   y: v.number(),
//   height: v.number(),
//   width: v.number(),
//   fill: layersFillConvexValue,
// });

// const layersConvexRecord = v.record(v.string(), layersConvexValue);

const patchesOperationUnionValue = v.union(
  v.literal("add"),
  v.literal("remove"),
  v.literal("replace")
);

const patchConvexValue = v.object({
  op: v.union(v.literal("add"), v.literal("remove"), v.literal("replace")),
  path: v.string(),
  value: v.optional(v.any()),
  oldValue: v.optional(v.any()),
});

const boardDataPatchConvexValue = v.object({
  patches: v.array(patchConvexValue),
  base: v.number(), // Базовый снэпшот
});

const boardHistoryDataValue = v.union(
  boardDataSnapshotConvexValue,
  boardDataPatchConvexValue
);

export {
  boardHistoryTypeValue,
  boardHistoryDataValue,
  boardDataSnapshotConvexValue,
  boardDataPatchConvexValue,
};

export type TBoardEdgesType = Infer<typeof boardEdgesTypeValue>;
export type TBoardHistoryRecordType = Infer<typeof boardHistoryTypeValue>;
export type TBoardHistoryRecordData = Infer<typeof boardHistoryDataValue>;

// Типы для данных доски
export type TPositionValue = Infer<typeof positionConvexValue>;
export type TNodeDataValue = Infer<typeof nodeDataConvexValue>;
export type TNodeValue = Infer<typeof nodeConvexValue>;
export type TEdgeMarkerEndValue = Infer<typeof edgeMarkerEndConvexValue>;
export type TEdgeValue = Infer<typeof edgeConvexValue>;
// export type TLayersFillValue = Infer<typeof layersFillConvexValue>;
// export type TLayerValueValue = Infer<typeof layersConvexValue>;
// export type TLayersValue = Infer<typeof layersConvexRecord>;

// Типы для операций патчей
export type TPatchOperationValue = Infer<typeof patchesOperationUnionValue>;
export type TPatchValue = Infer<typeof patchConvexValue>;

// Типы для данных записи в истории
export type TBoardSnapshotDataValue = Infer<
  typeof boardDataSnapshotConvexValue
>;
export type TBoardPatchDataValue = Infer<typeof boardDataPatchConvexValue>;
```


## convex\auth.config.ts

```ts
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationID: "convex",
    },
  ],
};
```


## convex\board.ts

```ts
import { v } from "convex/values";

import { api } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import {
  boardEdgesTypeValue,
  TBoardPatchDataValue,
  TBoardSnapshotDataValue,
} from "./validators/boardData";
import { applyPatches } from "../utils/jsonDiff";

export const create = mutation({
  args: {
    orgId: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const boardId = await ctx.db.insert("boards", {
      orgId: args.orgId,
      authorId: identity.subject,
      authorName: identity.name!,
      imageUrl: "/placeholders/example.png",
      title: args.title,
      description: "",
      edgesType: "Default",
      currentVersion: 0,
      //head: "" as Id<"boardsHistory">,
    });

    // Создаем начальный снапшот
    const snapshotId = await ctx.db.insert("boardsHistory", {
      boardId: boardId,
      version: 0,
      type: "snapshot",
      data: { nodes: [], edges: [] },
      authorId: identity.subject,
      authorName: identity.name!,
    });

    // Обновляем head доски
    await ctx.db.patch(boardId, { head: snapshotId });

    return boardId;
  },
});

export const updateHead = mutation({
  args: {
    boardId: v.id("boards"),
    newHead: v.id("boardsHistory"),
    newVersion: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.boardId, {
      currentVersion: args.newVersion,
      head: args.newHead,
    });
  },
});

export const updateTitle = mutation({
  args: { id: v.id("boards"), title: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const title = args.title.trim();

    if (!title) {
      throw new Error("Title is required");
    }

    if (title.length > 60) {
      throw new Error("Title cannot be longer than 60 characters");
    }

    const board = await ctx.db.patch(args.id, {
      title: args.title,
    });

    return board;
  },
});

export const updateMetaInfo = mutation({
  args: {
    id: v.id("boards"),
    title: v.string(),
    description: v.string(),
    edgesType: boardEdgesTypeValue,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const title = args.title.trim();

    if (title.length > 60) {
      throw new Error("Title cannot be longer than 60 characters");
    }

    const board = await ctx.db.patch(args.id, {
      title: args.title,
      description: args.description.trim(),
      edgesType: args.edgesType,
      updatedTime: Date.now(),
    });

    return board;
  },
});

export const remove = mutation({
  args: { id: v.id("boards") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const userId = identity.subject;

    const historyRecords = await ctx.db
      .query("boardsHistory")
      .withIndex("by_board", (q) => q.eq("boardId", args.id))
      .collect();

    await Promise.all(
      historyRecords.map((record) => ctx.db.delete(record._id))
    );

    const existingFavorite = await ctx.db
      .query("userFavorites")
      .withIndex("by_user_board", (q) =>
        q.eq("userId", userId).eq("boardId", args.id)
      )
      .unique();

    if (existingFavorite) {
      await ctx.db.delete(existingFavorite._id);
    }

    await ctx.db.delete(args.id);

    return { success: true };
  },
});

export const favorite = mutation({
  args: { id: v.id("boards"), orgId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const board = await ctx.db.get(args.id);

    if (!board) {
      throw new Error("Board not found");
    }

    const userId = identity.subject;

    const existingFavorite = await ctx.db
      .query("userFavorites")
      .withIndex("by_user_board", (q) =>
        q.eq("userId", userId).eq("boardId", board._id)
      )
      .unique();

    if (existingFavorite) {
      throw new Error("Board already favorited");
    }

    await ctx.db.insert("userFavorites", {
      userId,
      boardId: board._id,
      orgId: args.orgId,
    });

    return board;
  },
});

export const unfavorite = mutation({
  args: { id: v.id("boards") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const board = await ctx.db.get(args.id);

    if (!board) {
      throw new Error("Board not found");
    }

    const userId = identity.subject;

    const existingFavorite = await ctx.db
      .query("userFavorites")
      .withIndex("by_user_board", (q) =>
        q.eq("userId", userId).eq("boardId", board._id)
      )
      .unique();

    if (!existingFavorite) {
      throw new Error("Favorite board not found");
    }

    await ctx.db.delete(existingFavorite._id);

    return board;
  },
});

export const get = query({
  args: { id: v.id("boards") },
  handler: async (ctx, args) => {
    try {
      const board = await ctx.db.get(args.id);
      return board;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
});

export const loadBoardState = query({
  args: { boardId: v.id("boards") },
  handler: async (ctx, args) => {
    const board = await ctx.db.get(args.boardId);
    if (!board) throw new Error("Board not found");

    // Получаем последнюю версию из истории
    const headVersion = await ctx.db
      .query("boardsHistory")
      .withIndex("by_board_version", (q) =>
        q.eq("boardId", args.boardId).eq("version", board.currentVersion)
      )
      .unique();

    if (!headVersion) throw new Error("Head version not found");

    // Восстанавливаем состояние через цепочку версий
    let state: TBoardSnapshotDataValue;

    if (headVersion.type === "snapshot") {
      state = headVersion.data as TBoardSnapshotDataValue;
    } else {
      const baseVersion = await ctx.db
        .query("boardsHistory")
        .withIndex("by_board_version", (q) =>
          q
            .eq("boardId", args.boardId)
            .eq("version", (headVersion.data as TBoardPatchDataValue).base)
        )
        .unique();

      if (!baseVersion) throw new Error("Base version not found");

      const baseState = await ctx.runQuery(api.boardsHistory.restoreVersion, {
        versionId: baseVersion._id,
      });

      state = applyPatches(
        baseState,
        (headVersion.data as TBoardPatchDataValue).patches
      );
    }

    return {
      nodes: state.nodes,
      edges: state.edges,
      version: headVersion.version,
      title: board.title,
      description: board.description,
      edgesType: board.edgesType,
      _creationTime: headVersion._creationTime,
    };
  },
});
```


## convex\boards.ts

```ts
import { v } from "convex/values";
import { getAllOrThrow } from "convex-helpers/server/relationships";

import { query } from "./_generated/server";

export const get = query({
  args: {
    orgId: v.string(),
    search: v.optional(v.string()),
    favorites: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    if (args.favorites) {
      const favoritedBoards = await ctx.db
        .query("userFavorites")
        .withIndex("by_user_org", (q) =>
          q.eq("userId", identity.subject).eq("orgId", args.orgId)
        )
        .order("desc")
        .collect();

      const ids = favoritedBoards.map((b) => b.boardId);

      const boards = await getAllOrThrow(ctx.db, ids);

      return boards.map((board: any) => ({
        ...board,
        isFavorite: true,
      }));
    }

    const title = args.search as string;
    let boards = [];

    if (title) {
      boards = await ctx.db
        .query("boards")
        .withSearchIndex("search_title", (q) =>
          q.search("title", title).eq("orgId", args.orgId)
        )
        .collect();
    } else {
      boards = await ctx.db
        .query("boards")
        .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
        .order("desc")
        .collect();
    }

    const boardsWithFavoriteRelation = boards.map((board) => {
      return ctx.db
        .query("userFavorites")
        .withIndex("by_user_board", (q) =>
          q.eq("userId", identity.subject).eq("boardId", board._id)
        )
        .unique()
        .then((favorite) => {
          return {
            ...board,
            isFavorite: !!favorite,
          };
        });
    });

    const boardsWithFavoriteBoolean = Promise.all(boardsWithFavoriteRelation);

    return boardsWithFavoriteBoolean;
  },
});
```


## convex\boardsHistory.ts

```ts
import { Infer, v } from "convex/values";

import { applyPatches } from "../utils/jsonDiff";
import { BoardStateData } from "../app/types/history";

import { mutation, query } from "./_generated/server";
import {
  boardDataPatchConvexValue,
  boardDataSnapshotConvexValue,
  boardHistoryTypeValue,
  TBoardPatchDataValue,
} from "./validators/boardData";
import { Doc, Id } from "./_generated/dataModel";

export const createVersion = mutation({
  args: {
    boardId: v.id("boards"),
    type: boardHistoryTypeValue,
    data: v.union(boardDataSnapshotConvexValue, boardDataPatchConvexValue),
    message: v.optional(v.string()),
    restoreByTime: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Получаем текущую версию
    const board = await ctx.db.get(args.boardId);
    if (!board) throw new Error("Board not found");

    // Валидация для патчей
    if (args.type === "patch") {
      const baseExists = await ctx.db
        .query("boardsHistory")
        .withIndex("by_board_version", (q) =>
          q
            .eq("boardId", args.boardId)
            .eq("version", (args.data as TBoardPatchDataValue).base)
        )
        .unique();
      if (!baseExists) throw new Error("Base version not found");
    }

    const versionId = await ctx.db.insert("boardsHistory", {
      boardId: args.boardId,
      version: board.currentVersion + 1,
      type: args.type,
      data: args.data,
      authorId: identity.subject,
      authorName: identity.name!,
      message: args.message,
      restoreByTime: args.restoreByTime,
    });

    // Получаем полную запись с _creationTime
    const newVersion = await ctx.db.get(versionId);

    if (!newVersion) throw new Error("Failed to create version");

    // Обновляем головную версию доски
    await ctx.db.patch(args.boardId, {
      currentVersion: newVersion?.version,
      head: versionId,
      updatedTime: newVersion?._creationTime,
    });

    return {
      id: versionId,
      version: newVersion.version,
      createdAt: newVersion._creationTime,
    };
  },
});

// Вынесенная обработка результатов
const processResults = (
  results: Doc<"boardsHistory">[],
  groupByBase?: boolean
) => {
  if (groupByBase) {
    const grouped: Record<number, Doc<"boardsHistory">[]> = {};

    let currentBase = 0;

    for (const record of results) {
      if (record.type === "snapshot") {
        currentBase =
          currentBase === record.version ? currentBase : record.version;
        grouped[currentBase] = grouped[currentBase] || [];
        grouped[currentBase].push(record);
      } else {
        grouped[currentBase] = grouped[currentBase] || [];
        grouped[currentBase].push(record);
      }
    }

    return { grouped, results };
  }

  return { grouped: undefined, results };
};

export const getBoardHistory = query({
  args: {
    boardId: v.id("boards"),
    searchQuery: v.optional(v.string()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    groupByBase: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Отдельная обработка поисковых запросов
    if (args.searchQuery) {
      let searchResults = await ctx.db
        .query("boardsHistory")
        .withSearchIndex("search_message", (q) =>
          q.search("message", args.searchQuery!).eq("boardId", args.boardId)
        );

      if (args.startDate || args.endDate) {
        searchResults = await searchResults.filter((q) =>
          q.and(
            args.startDate
              ? q.gte(q.field("_creationTime"), args.startDate)
              : q.and(),
            args.endDate
              ? q.lte(q.field("_creationTime"), args.endDate)
              : q.and()
          )
        );
      }

      // Ручная сортировка результатов поиска
      let sortedResults = await searchResults.collect();

      sortedResults = sortedResults.sort(
        (a, b) => b._creationTime - a._creationTime
      );

      return processResults(sortedResults, args?.groupByBase);
    }

    // Базовый запрос с сортировкой по версии
    let query = ctx.db
      .query("boardsHistory")
      .withIndex("by_board", (q) => q.eq("boardId", args.boardId))
      .order("asc");

    // Фильтрация по дате
    if (args.startDate || args.endDate) {
      query = query.filter((q) =>
        q.and(
          args.startDate
            ? q.gte(q.field("_creationTime"), args.startDate)
            : q.and(),
          args.endDate ? q.lte(q.field("_creationTime"), args.endDate) : q.and()
        )
      );
    }

    const results = await query.collect();

    return processResults(results, args?.groupByBase);
  },
});

export const getVersion = query({
  args: { versionId: v.id("boardsHistory") },
  handler: async (ctx, args) => {
    return ctx.db.get(args.versionId);
  },
});

export const getVersionByNumber = query({
  args: { boardId: v.id("boards"), version: v.number() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("boardsHistory")
      .withIndex("by_board_version", (q) =>
        q.eq("boardId", args.boardId).eq("version", args.version)
      )
      .unique();
  },
});

export const compareVersions = query({
  args: {
    versionId1: v.id("boardsHistory"),
    versionId2: v.id("boardsHistory"),
  },
  handler: async (ctx, args) => {
    const v1 = await ctx.db.get(args.versionId1);
    const v2 = await ctx.db.get(args.versionId2);
    return { v1, v2 };
  },
});

// Восстановление версии
export const restoreVersion = query({
  args: { versionId: v.id("boardsHistory") },
  handler: async (ctx, args) => {
    // Получаем начальную версию
    const initialVersion = await ctx.db.get(args.versionId);

    if (!initialVersion) {
      throw new Error("Version not found");
    }

    const versionChain = [];
    let currentVersion: typeof initialVersion | null = initialVersion;

    while (currentVersion) {
      versionChain.unshift(currentVersion);

      if (currentVersion.type === "snapshot") {
        break;
      }

      const patchData = currentVersion.data as TBoardPatchDataValue;

      const nextVersion = await ctx.db
        .query("boardsHistory")
        .withIndex(
          "by_board_version",
          (q) =>
            q
              .eq("boardId", currentVersion!.boardId) // Явное утверждение non-null
              .eq("version", patchData.base) // Используем номер базовой версии
        )
        .unique();

      currentVersion = nextVersion;
    }

    return versionChain.reduce((acc, version) => {
      if (version.type === "snapshot") return version.data;

      const patchData = version.data as Infer<typeof boardDataPatchConvexValue>;

      return applyPatches(acc, patchData.patches);
    }, {} as BoardStateData);
  },
});

export const searchByMessage = query({
  args: { boardId: v.id("boards"), query: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("boardsHistory")
      .withSearchIndex("search_message", (q) =>
        q.search("message", args.query).eq("boardId", args.boardId)
      )
      .collect();
  },
});

// Удаление старых версий
export const pruneHistory = mutation({
  args: { boardId: v.id("boards"), keepLast: v.number() },
  handler: async (ctx, args) => {
    const history = await ctx.db
      .query("boardsHistory")
      .withIndex("by_board", (q) => q.eq("boardId", args.boardId))
      .order("desc")
      .collect();

    const toDelete = history.slice(args.keepLast);

    await Promise.all(toDelete.map((version) => ctx.db.delete(version._id)));

    return { deleted: toDelete.length };
  },
});

// Получение базового снапшота для патча
export const getBaseSnapshot = query({
  args: { boardId: v.id("boards"), version: v.number() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("boardsHistory")
      .withIndex("by_board_version", (q) =>
        q.eq("boardId", args.boardId).eq("version", args.version)
      )
      .unique();
  },
});

export const updateVersionMessage = mutation({
  args: { id: v.id("boardsHistory"), message: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const message = args.message.trim();

    if (!message) {
      throw new Error("Message is required");
    }

    if (message.length > 60) {
      throw new Error("Message cannot be longer than 60 characters");
    }

    const board = await ctx.db.patch(args.id, {
      message,
    });

    return board;
  },
});

export const deleteVersion = mutation({
  args: { versionId: v.id("boardsHistory") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const targetVersion = await ctx.db.get(args.versionId);
    if (!targetVersion) throw new Error("Version not found");

    // Для снэпшотов: каскадное удаление всех зависимых патчей
    if (targetVersion.type === "snapshot") {
      const chainToDelete: Doc<"boardsHistory">[] = [];
      let currentVersion: typeof targetVersion | null = targetVersion;

      // 2. Находим все зависимые патчи до следующего снэпшота
      while (currentVersion) {
        const nextVersion = await ctx.db
          .query("boardsHistory")
          .withIndex("by_base", (q) =>
            q
              .eq("boardId", targetVersion.boardId)
              .eq("data.base", currentVersion?.version)
          )
          .first();

        if (!nextVersion || nextVersion.type === "snapshot") break;

        chainToDelete.push(nextVersion);
        currentVersion = nextVersion;
      }

      // 3. Удаляем всю цепочку
      await Promise.all([
        ...chainToDelete.map((v) => ctx.db.delete(v._id)),
        ctx.db.delete(args.versionId),
      ]);

      // Обновление текущей версии доски
      const board = await ctx.db.get(targetVersion.boardId);

      if (board) {
        const isCurrentVersionInChain =
          chainToDelete.some((v) => v.version === board?.currentVersion) ||
          targetVersion.version === board?.currentVersion;

        if (isCurrentVersionInChain) {
          const prevVersion = await ctx.db
            .query("boardsHistory")
            .withIndex("by_board", (q) =>
              q.eq("boardId", targetVersion.boardId)
            )
            .order("desc")
            .first();

          if (prevVersion) {
            await ctx.db.patch(board._id, {
              currentVersion: prevVersion.version,
              head: prevVersion._id,
            });
          }
        }
      }

      return { success: true };
    }

    const patchData = targetVersion.data as TBoardPatchDataValue;
    const baseVersion = patchData.base;

    // Для патчей: перенаправление зависимых версий
    const nextVersions = await ctx.db
      .query("boardsHistory")
      .withIndex("by_base", (q) =>
        q
          .eq("boardId", targetVersion.boardId)
          .eq("data.base", targetVersion.version)
      )
      .collect();

    // Находим предыдущую версию
    const previousVersion = await ctx.db
      .query("boardsHistory")
      .withIndex("by_board_version", (q) =>
        q.eq("boardId", targetVersion.boardId).eq("version", baseVersion)
      )
      .order("desc")
      .first();

    if (!previousVersion) {
      throw new Error("Cannot delete base version");
    }

    // Обновляем базовые ссылки у следующих версий
    await Promise.all(
      nextVersions.map(async (version) => {
        if (version.type === "patch") {
          await ctx.db.patch(version._id, {
            data: {
              ...version.data,
              base: previousVersion.version,
            },
          });
        }
      })
    );

    // Удаляем целевой патч
    await ctx.db.delete(targetVersion._id);

    // 5. Обновляем текущую версию доски
    const board = await ctx.db.get(targetVersion.boardId);

    if (board?.currentVersion === targetVersion.version) {
      await ctx.db.patch(board._id, {
        currentVersion: previousVersion.version,
        head: previousVersion._id,
      });
    }

    return { success: true };
  },
});
```


## convex\README.md

```md
# Welcome to your Convex functions directory!

Write your Convex functions here. See
https://docs.convex.dev/using/writing-convex-functions for more.

A query function that takes two arguments looks like:

```ts
// functions.js
import { query } from "./_generated/server";
import { v } from "convex/values";

export const myQueryFunction = query({
  // Validators for arguments.
  args: {
    first: v.number(),
    second: v.string(),
  },

  // Function implementation.
  handler: async (ctx, args) => {
    // Read the database as many times as you need here.
    // See https://docs.convex.dev/database/reading-data.
    const documents = await ctx.db.query("tablename").collect();

    // Arguments passed from the client are properties of the args object.
    console.log(args.first, args.second);

    // Write arbitrary JavaScript here: filter, aggregate, build derived data,
    // remove non-public properties, or create new objects.
    return documents;
  },
});
```

Using this query function in a React component looks like:

```ts
const data = useQuery(api.functions.myQueryFunction, {
  first: 10,
  second: "hello",
});
```

A mutation function looks like:

```ts
// functions.js
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const myMutationFunction = mutation({
  // Validators for arguments.
  args: {
    first: v.string(),
    second: v.string(),
  },

  // Function implementation.
  handler: async (ctx, args) => {
    // Insert or modify documents in the database here.
    // Mutations can also read from the database like queries.
    // See https://docs.convex.dev/database/writing-data.
    const message = { body: args.first, author: args.second };
    const id = await ctx.db.insert("messages", message);

    // Optionally, return a value from your mutation.
    return await ctx.db.get(id);
  },
});
```

Using this mutation function in a React component looks like:

```ts
const mutation = useMutation(api.functions.myMutationFunction);
function handleButtonPress() {
  // fire and forget, the most common way to use mutations
  mutation({ first: "Hello!", second: "me" });
  // OR
  // use the result once the mutation has completed
  mutation({ first: "Hello!", second: "me" }).then((result) =>
    console.log(result)
  );
}
```

Use the Convex CLI to push your functions to a deployment. See everything
the Convex CLI can do by running `npx convex -h` in your project root
directory. To learn more, launch the docs with `npx convex docs`.
```


## convex\schema.ts

```ts
import { v } from "convex/values";
import { defineSchema, defineTable } from "convex/server";
import {
  boardEdgesTypeValue,
  boardHistoryDataValue,
  boardHistoryTypeValue,
} from "./validators/boardData";

export default defineSchema({
  boards: defineTable({
    orgId: v.string(),
    authorId: v.string(),
    authorName: v.string(),
    imageUrl: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    edgesType: v.optional(boardEdgesTypeValue),
    currentVersion: v.number(), // Последняя версия
    head: v.optional(v.id("boardsHistory")), // Ссылка на актуальную версию
    updatedTime: v.optional(v.number()),
  })
    .index("by_org", ["orgId"])
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["orgId"],
    }),
  boardsHistory: defineTable({
    boardId: v.id("boards"),
    version: v.number(),
    type: boardHistoryTypeValue,
    data: boardHistoryDataValue,
    authorId: v.string(),
    authorName: v.optional(v.string()),
    message: v.optional(v.string()),
    restoreByTime: v.optional(v.number()),
  })
    .index("by_board_version", ["boardId", "version"])
    .index("by_board", ["boardId"])
    .index("by_base", ["boardId", "data.base"])
    .searchIndex("search_message", {
      searchField: "message",
      filterFields: ["boardId", "version"],
    }),
  userFavorites: defineTable({
    orgId: v.string(),
    userId: v.string(),
    boardId: v.id("boards"),
  })
    .index("by_board", ["boardId"])
    .index("by_user_org", ["userId", "orgId"])
    .index("by_user_board", ["userId", "boardId"])
    .index("by_user_board_org", ["userId", "boardId", "orgId"]),
});
```


## providers\convex-client-provider.tsx

```tsx
"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { AuthLoading, Authenticated, ConvexReactClient } from "convex/react";
import { Loading } from "@/components/loading";

interface ConvexClientProviderProps {
  children: React.ReactNode;
}

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;

const convex = new ConvexReactClient(convexUrl);

export const ConvexClientProvider = ({
  children,
}: ConvexClientProviderProps) => {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        <Authenticated>{children}</Authenticated>
        <AuthLoading><Loading/></AuthLoading>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};
```


## providers\modal-provider.tsx

```tsx
"use client";

import { useEffect, useState } from "react";
import { RenameModal } from "@/components/modals/rename-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <RenameModal />
    </>
  );
};
```


## utils\adapters.ts

```ts
import { Node, Edge, MarkerType } from "reactflow";
import {
  TNodeValue,
  TEdgeValue,
  TEdgeMarkerEndValue,
} from "@/convex/validators/boardData";

export const toConvexNode = (node: Node): TNodeValue => ({
  id: node.id,
  type: node.type || "default",
  width: node.width || 50,
  height: node.height || 50,
  selected: node.selected || false,
  dragging: node.dragging || false,
  positionAbsolute: {
    x: node.positionAbsolute?.x || 0,
    y: node.positionAbsolute?.y || 0,
  },
  position: {
    x: node.position.x,
    y: node.position.y,
  },
  data: {
    label: node.data.label,
    struct: node.data.struct,
    name: node.data.name,
  },
});

export const toReactFlowNode = (node: TNodeValue): Node => ({
  id: node.id,
  type: node.type,
  position: node.position,
  width: node.width,
  height: node.height,
  data: {
    label: node.data.label,
    struct: node.data.struct,
    name: node.data.name,
  },
  // Остальные поля с дефолтными значениями
  selected: node.selected,
  dragging: node.dragging,
  positionAbsolute: node.positionAbsolute,
});

export const toConvexEdge = (edge: Edge): TEdgeValue => ({
  id: edge.id,
  source: edge.source,
  target: edge.target,
  type: edge.type || "default",
  animated: edge.animated || false,
  data: edge.data || 0,
  selected: edge.selected || false,
  markerEnd: edge.markerEnd as TEdgeMarkerEndValue,
});

export const toReactFlowEdge = (edge: TEdgeValue): Edge => ({
  id: edge.id,
  source: edge.source,
  target: edge.target,
  type: edge.type,
  animated: edge.animated,
  data: edge.data,
  selected: edge.selected,
  markerEnd: edge.markerEnd,
  // Для совместимости с React Flow
  sourceHandle: null,
  targetHandle: null,
});
```


## utils\canvas.ts

```ts
import {
  Camera,
  Color,
  Layer,
  LayerType,
  PathLayer,
  Point,
  Side,
  XYWH
} from "@/app/types/canvas";
import { type ClassValue, clsx } from "clsx"
import { MarkerType } from "reactflow";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const markerEnd = {
  type: MarkerType.ArrowClosed,
  width: 20,
  height: 20,
  color: 'black',
}

const COLORS = [
  "#DC2626",
  "#D97706",
  "#059669",
  "#7C3AED",
  "#DB2777"
];

export function connectionIdToColor(connectionId: number): string {
  return COLORS[connectionId % COLORS.length];
};

export function pointerEventToCanvasPoint(
  e: React.PointerEvent,
  camera: Camera,
) {
  return {
    x: Math.round(e.clientX) - camera.x,
    y: Math.round(e.clientY) - camera.y,
  };
};

export function colorToCss(color: Color) {
  return `#${color.r.toString(16).padStart(2, "0")}${color.g.toString(16).padStart(2, "0")}${color.b.toString(16).padStart(2, "0")}`;
}

export function getSvgPathFromStroke(stroke: number[][]) {
  if (!stroke.length) return "";

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"]
  );

  d.push("Z");
  return d.join(" ");
};

export function resizeBounds(
  bounds: XYWH,
  corner: Side,
  point: Point
): XYWH {
  const result = {
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
  };

  if ((corner & Side.Left) === Side.Left) {
    result.x = Math.min(point.x, bounds.x + bounds.width);
    result.width = Math.abs(bounds.x + bounds.width - point.x);
  }

  if ((corner & Side.Right) === Side.Right) {
    result.x = Math.min(point.x, bounds.x);
    result.width = Math.abs(point.x - bounds.x);
  }

  if ((corner & Side.Top) === Side.Top) {
    result.y = Math.min(point.y, bounds.y + bounds.height);
    result.height = Math.abs(bounds.y + bounds.height - point.y);
  }

  if ((corner & Side.Bottom) === Side.Bottom) {
    result.y = Math.min(point.y, bounds.y);
    result.height = Math.abs(point.y - bounds.y);
  }

  return result;
};

export function findIntersectingLayersWithRectangle(
  layerIds: readonly string[],
  layers: ReadonlyMap<string, Layer>,
  a: Point,
  b: Point,
) {
  const rect = {
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    width: Math.abs(a.x - b.x),
    height: Math.abs(a.y - b.y),
  };

  const ids = [];

  for (const layerId of layerIds) {
    const layer = layers.get(layerId);

    if (layer == null) {
      continue;
    }

    const { x, y, height, width } = layer;

    if (
      rect.x + rect.width > x &&
      rect.x < x + width &&
      rect.y + rect.height > y &&
      rect.y < y + height
    ) {
      ids.push(layerId);
    }
  }

  return ids;
};

export function penPointsToPathLayer(
  points: number[][],
  color: Color,
): PathLayer {
  if (points.length < 2) {
    throw new Error("Cannot transform points with less than 2 points");
  }

  let left = Number.POSITIVE_INFINITY;
  let top = Number.POSITIVE_INFINITY;
  let right = Number.NEGATIVE_INFINITY;
  let bottom = Number.NEGATIVE_INFINITY;

  for (const point of points) {
    const [x, y] = point;

    if (left > x) {
      left = x;
    }

    if (top > y) {
      top = y;
    }

    if (right < x) {
      right = x;
    }

    if (bottom < y) {
      bottom = y;
    }
  }

  return {
    type: LayerType.Path,
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
    fill: color,
    points: points
      .map(([x, y, pressure]) => [x - left, y - top, pressure]),
  };
};
```


## utils\jsonDiff.ts

```ts
import { diff } from "deep-diff";

export const deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj)) as T;

type Operation = "add" | "remove" | "replace";

interface Patch {
  op: Operation;
  path: string;
  value?: any;
  oldValue?: any;
}

export const generatePatches = (prevState: any, newState: any): Patch[] => {
  const differences = diff(prevState, newState) || [];

  return differences.map((delta): Patch => {
    switch (delta.kind) {
      case "E": // Edit
        return {
          op: "replace",
          path: `/${delta.path!.join("/")}`,
          oldValue: delta.lhs,
          value: delta.rhs,
        };

      case "D": // Delete
        return {
          op: "remove",
          path: `/${delta.path!.join("/")}`,
          oldValue: delta.lhs,
        };

      case "N": // New
        return {
          op: "add",
          path: `/${delta.path!.join("/")}`,
          value: delta.rhs,
        };

      case "A": // Array change
        const arrayPath = delta.path?.length
          ? `/${delta.path.join("/")}/${delta.index}`
          : `/${delta.index}`;

        switch (delta.item.kind) {
          case "N":
            return {
              op: "add",
              path: `/${arrayPath}`,
              value: delta.item.rhs,
            };
          case "D":
            return {
              op: "remove",
              path: `/${arrayPath}`,
              oldValue: delta.item.lhs,
            };
          case "E":
            return {
              op: "replace",
              path: `/${arrayPath}`,
              oldValue: delta.item.lhs,
              value: delta.item.rhs,
            };
        }

      default:
        throw new Error(`Unhandled delta kind: ${(delta as any).kind}`);
    }
  });
};

export const applyPatches = (state: any, patches: Patch[]): any => {
  const newState = deepClone(state);

  patches.forEach((patch) => {
    const keys = patch.path.split("/").filter(Boolean);
    let target = newState;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      target = target[key];
    }

    const lastKey = keys[keys.length - 1];

    switch (patch.op) {
      case "add":
        if (Array.isArray(target)) {
          target.splice(Number(lastKey), 0, patch.value);
        } else {
          target[lastKey] = patch.value;
        }
        break;

      case "remove":
        if (Array.isArray(target)) {
          target.splice(Number(lastKey), 1);
        } else {
          delete target[lastKey];
        }
        break;

      case "replace":
        target[lastKey] = patch.value;
        break;
    }
  });

  return newState;
};

export const filterPatches = (patches: Patch[]): Patch[] => {
  return patches.filter((patch) => {
    // Игнорируем временные состояния
    const isTemporary = [
      "/dragging",
      "/selected",
      "/positionAbsolute",
      "/zIndex",
    ].some((s) => patch.path.includes(s));

    // Игнорируем позицию если смещение < 10px
    if (patch.path.endsWith("/position")) {
      const dx = Math.abs(patch.value.x - patch.oldValue.x);
      const dy = Math.abs(patch.value.y - patch.oldValue.y);
      return dx > 10 || dy > 10;
    }

    return !isTemporary;
  });
};
```


## utils\math.ts

```ts
export const randomDistribution = (value: number, edges: number[]) => {
    let totalWeight = edges.reduce((acc, edge) => acc + edge, 0);
    let probabilities = edges.map(edge => edge / totalWeight);

    let remainingResource = value;
    let distributedResources = Array(edges.length).fill(0);

    for (let i = 0; i < edges.length; i++) {
        let randomAmount = Math.floor(Math.random() * (remainingResource + 1));
        let amountToSend = Math.min(randomAmount, remainingResource * probabilities[i]);
        distributedResources[i] += amountToSend;
        remainingResource -= amountToSend;
    }

    while (remainingResource > 0) {
        let randomIndex = Math.floor(Math.random() * edges.length);
        distributedResources[randomIndex]++;
        remainingResource--;
    }

    distributedResources = distributedResources.map(resource => Math.round(resource));

    return distributedResources;
}

// let value = 10;
// let edges = [1, 2, 3, 1]; // Значения ребер
// let distributedResources = randomDistributionWithProbabilities(value, edges);

// Распределенные ресурсы: [ 2, 2, 3, 2 ]
```


## .export-ignore

```
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.
# dependencies
/node_modules
/.pnp
.pnp.js
.yarn/install-state.gz
# testing
/coverage
# next.js
/.next/
/out/
# production
/build
# misc
.DS_Store
*.pem
# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
# local env files
.env*.local
# vercel
.vercel
# typescript
*.tsbuildinfo
next-env.d.ts
.env.local
*.png
*.svg
*.json
```


## .gitignore

```
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js
.yarn/install-state.gz

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

.env.local
```


## export.md

File is too large to process (1550329 bytes)


## liveblocks.config.ts

```ts
import {
  createClient,
  LiveList,
  LiveMap,
  LiveObject,
} from "@liveblocks/client";
import { createLiveblocksContext, createRoomContext } from "@liveblocks/react";
import { Color, Layer } from "./app/types/canvas";
import { Node } from "reactflow";

export const client = createClient({
  // publicApiKey: process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY! as string,
  authEndpoint: "/api/liveblocks-auth",
  throttle: 16,
});

// Presence represents the properties that exist on every user in the Room
// and that will automatically be kept in sync. Accessible through the
// `user.presence` property. Must be JSON-serializable.
type Presence = {
  cursor: { x: number; y: number } | null;
  selection: string[];
  // для рисования карандашем
  pencilDraft: [x: number, y: number, pressure: number][] | null;
  penColor: Color | null;
};

// Optionally, Storage represents the shared document that persists in the
// Room, even after all users leave. Fields under Storage typically are
// LiveList, LiveMap, LiveObject instances, for which updates are
// automatically persisted and synced to all connected clients.
type Storage = {
  // layers: LiveMap<string, LiveObject<Layer>>;
  layers: LiveMap<string, LiveObject<Layer>>;
  layerIds: LiveList<string>;
};

// Optionally, UserMeta represents static/readonly metadata on each user, as
// provided by your own custom auth back end (if used). Useful for data that
// will not change during a session, like a user's name or avatar.
type UserMeta = {
  id?: string;
  info?: {
    name?: string;
    color?: string;
    picture?: string;
  };
};

// Optionally, the type of custom events broadcast and listened to in this
// room. Use a union for multiple events. Must be JSON-serializable.
type RoomEvent = {
  // type: "NOTIFICATION",
  // ...
};

// Optionally, when using Comments, ThreadMetadata represents metadata on
// each thread. Can only contain booleans, strings, and numbers.
export type ThreadMetadata = {
  // resolved: boolean;
  // quote: string;
  // time: number;
};

// Room-level hooks, use inside `RoomProvider`
export const {
  suspense: {
    RoomProvider,
    useRoom,
    useMyPresence,
    useUpdateMyPresence,
    useSelf,
    useOthers,
    useOthersMapped,
    useOthersListener,
    useOthersConnectionIds,
    useOther,
    useBroadcastEvent,
    useEventListener,
    useErrorListener,
    useStorage,
    useBatch,
    useHistory,
    useUndo,
    useRedo,
    useCanUndo,
    useCanRedo,
    useMutation,
    useStatus,
    useLostConnectionListener,
    useThreads,
    useCreateThread,
    useEditThreadMetadata,
    useCreateComment,
    useEditComment,
    useDeleteComment,
    useAddReaction,
    useRemoveReaction,
    useThreadSubscription,
    useMarkThreadAsRead,
    useRoomNotificationSettings,
    useUpdateRoomNotificationSettings,

    // These hooks can be exported from either context
    // useUser,
    // useRoomInfo
  },
} = createRoomContext<Presence, Storage, UserMeta, RoomEvent, ThreadMetadata>(
  client
);

// Project-level hooks, use inside `LiveblocksProvider`
export const {
  suspense: {
    LiveblocksProvider,
    useMarkInboxNotificationAsRead,
    useMarkAllInboxNotificationsAsRead,
    useInboxNotifications,
    useUnreadInboxNotificationsCount,

    // These hooks can be exported from either context
    useUser,
    useRoomInfo,
  },
} = createLiveblocksContext<UserMeta, ThreadMetadata>(client);
```


## middleware.ts

```ts
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
    // Routes that can be accessed while signed out
    // publicRoutes: ['/anyone-can-visit-this-route'],
    // // Routes that can always be accessed, and have
    // // no authentication information
    // ignoredRoutes: ['/no-auth-in-this-route'],
});

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
```


## next.config.mjs

```mjs
/* @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns:[
            {
                protocol: 'https',
                hostname: "img.clerk.com"
            }
        ]
    }
};

export default nextConfig;
```


## postcss.config.js

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```


## rahmankulova.md

```md
# Project Structure

```
.next/
app/
  (dashboard)/
    _components/
      board-card/
        footer.tsx
        index.tsx
      sidebar/
        button.tsx
        index.tsx
        item.tsx
        list.tsx
      board-list.tsx
      empty-board.tsx
      empty-org.tsx
      invite-button.tsx
      navbar.tsx
      new-board-button.tsx
      org-sidebar.tsx
      search-input.tsx
    layout.tsx
    page.tsx
  api/
    liveblocks-auth/
      route.ts
  board/
    [boardId]/
      _components/
        _layer-components.tsx/
          connector/
            connector.tsx
          edge.tsx
          ellipse.tsx
          note.tsx
          path.tsx
          rectangle.tsx
          text.tsx
          triangle.tsx
        canvas.tsx
        color-picker.tsx
        cursor.tsx
        cursors-presence.tsx
        info.tsx
        layer-preview.tsx
        participants.tsx
        selection-box.tsx
        selection-tools.tsx
        tool-button.tsx
        toolbar.tsx
        user-avatar.tsx
      page.tsx
  hooks/
    use-api-mutation.ts
    use-delete-layers.ts
    use-disable-scroll-bounce.ts
    use-selection-bounds.ts
    useInitializeBoard.ts
    useRestoreVersionHandler.tsx
    useSaveHandlerOnKeydown.ts
    useVersionsHistory.ts
  services/
    generateSheme.ts
    parserCode.ts
    parserToJson.ts
  store/
    store.ts
    use-animate-scheme.tsx
    use-custom-edge.tsx
    use-rename-modal.tsx
    useBoardInfo.tsx
  test/
    [boardId]/
      _components/
        _structs/
          nodeComponents/
            consumerNode.tsx
            converterNode.tsx
            delayNode.tsx
            endNode.tsx
            entityNode.tsx
            gateNode.tsx
            nodeStyle.css
            poolNode.tsx
            randomNode.tsx
            sourceNode.tsx
            styled-node.tsx
          custom-edge.tsx
          custom-node.tsx
        BoardInfoModal/
          BoardInfoModal.module.scss
          BoardInfoModal.tsx
          BoardTitle.tsx
        editor/
          editor.module.scss
          editorCoder.tsx
        HistoryModal/
          CollapsibleGroup/
            CollapsibleGroup.module.scss
            CollapsibleGroup.tsx
            index.ts
          HistoryItem/
            HistoryItem.module.scss
            HistoryItem.tsx
            index.ts
          datepicker.css
          HistoryModal.module.scss
          HistoryModal.tsx
          index.ts
        metrics/
          chart.tsx
          chartCard.tsx
          circleChart.tsx
          metrics.tsx
          metricsData.tsx
        panels/
          bottom-panel.tsx
          EdgeTypePanel.tsx
          toolbar.tsx
        sidebar/
          sidebar-board.tsx
        ui/
          EditableText/
            EditableText.module.scss
            EditableText.tsx
            index.ts
          CustomInput.tsx
          DownloadBtn.tsx
          index.ts
          ToolButton.tsx
        context-menu.tsx
        cursor.tsx
        flow.tsx
        games.tsx
        iterations.tsx
      layout.tsx
      page.tsx
      rahmankulova.md
      style-test.css
  types/
    canvas.ts
    history.ts
    structs.ts
  favicon.ico
  globals.css
  layout.tsx
components/
  modals/
    rename-modal.tsx
  ui/
    alert-dialog.tsx
    avatar.tsx
    button.tsx
    dialog.tsx
    dropdown-menu.tsx
    input.tsx
    sonner.tsx
    tooltip.tsx
  actions.tsx
  confirm-modal.tsx
  hint.tsx
  loading.tsx
  room.tsx
convex/
  _generated/
    api.d.ts
    api.js
    dataModel.d.ts
    server.d.ts
    server.js
  validators/
    boardData.ts
  auth.config.ts
  board.ts
  boards.ts
  boardsHistory.ts
  README.md
  schema.ts
  tsconfig.json
providers/
  convex-client-provider.tsx
  modal-provider.tsx
public/
  placeholders/
    example.png
  cover.png
  next.svg
  spin.svg
  vercel.svg
utils/
  adapters.ts
  canvas.ts
  jsonDiff.ts
  math.ts
.eslintrc.json
.export-ignore
.gitignore
components.json
liveblocks.config.ts
middleware.ts
next.config.mjs
package-lock.json
package.json
postcss.config.js
README.md
tailwind.config.ts
tsconfig.json
```


## app\(dashboard)\_components\board-card\footer.tsx

```tsx
import { Star } from "lucide-react";

import { cn } from "@/utils/canvas";

interface FooterProps {
  title: string;
  authorLabel: string;
  createdAtLabel: string;
  isFavorite: boolean;
  onClick: () => void;
  disabled: boolean;
}

export const Footer = ({
  title,
  authorLabel,
  createdAtLabel,
  isFavorite,
  onClick,
  disabled,
}: FooterProps) => {
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();
    event.preventDefault();

    onClick();
  };

  return (
    <div className="relative bg-white p-2">
      <p className="text-[13px] truncate ">{title}</p>
      <p className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] text-muted-foreground truncate">
        {authorLabel}, {createdAtLabel}
      </p>
      <button
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          "opacity-0 group-hover:opacity-100 transition absolute top-3 right-3 text-muted-foreground hover:text-blue-600",
          disabled && "cursor-not-allowed opacity-75"
        )}
      >
        <Star
          className={cn("h-4 w-4", isFavorite && "fill-blue-600 text-blue-600")}
        />
      </button>
    </div>
  );
};
```


## app\(dashboard)\_components\board-card\index.tsx

```tsx
"use client";

import { formatDistanceToNow } from "date-fns";

import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";
import { MoreHorizontal } from "lucide-react";
import { Footer } from "./footer";
import { Actions } from "@/components/actions";
import { useApiMutation } from "@/app/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";

export interface BoardCardProps {
  id: string;
  title: string;
  authorName: string;
  authorId: string;
  createdAt: number;
  imageUrl: string;
  orgId: string;
  isFavorite: boolean;
}

export const BoardCard = ({
  id,
  title,
  authorId,
  authorName,
  createdAt,
  imageUrl,
  orgId,
  isFavorite,
}: BoardCardProps) => {
  const { userId } = useAuth();

  const authorLabel = userId === authorId ? "You" : authorName;
  const createdAtLabel = formatDistanceToNow(createdAt, {
    addSuffix: true,
  });

  const { mutate: onFavorite, pending: pendingFavorite } = useApiMutation(
    api.board.favorite
  );
  const { mutate: onUnfavorite, pending: pendingUnfavorite } = useApiMutation(
    api.board.unfavorite
  );

  const toggleFavorite = () => {
    if (isFavorite) {
      onUnfavorite({ id }).catch(() => toast.error("Failed to unfavorite"));
    } else {
      onFavorite({ id, orgId }).catch(() => toast.error("Failed to favorite"));
    }
  };

  return (
    <Link href={`/test/${id}`}>
      <div className="group aspect-[100/130] border rounded-lg flex flex-col justify-between overflow-hidden">
        <div className="relative flex-1 bg-amber-50">
          <Image src={imageUrl} alt={title} fill className="object-fit" />
          <Actions id={id} title={title} side="right">
            <button className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-2 outline-none">
              <MoreHorizontal className="text-white opacity-75 hover:opacity-100 transition-opacity" />
            </button>
          </Actions>
        </div>
        <Footer
          isFavorite={isFavorite}
          title={title}
          authorLabel={authorLabel}
          createdAtLabel={createdAtLabel}
          onClick={toggleFavorite}
          disabled={pendingFavorite || pendingUnfavorite}
        />
      </div>
    </Link>
  );
};
```


## app\(dashboard)\_components\sidebar\button.tsx

```tsx
"use client";
import { Hint } from "@/components/hint";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CreateOrganization } from "@clerk/nextjs";
import { Plus } from "lucide-react";

export const Button = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="aspect-square">
          <Hint
            label="Create organization"
            side="right"
            align="start"
            sideOffset={18}
          >
            <button
              className="bg-white/25 h-full w-full rounded-md
           flex items-center justify-center opacity-60 hover:opacity-100 transition"
            >
              <Plus className="text-white" />
            </button>
          </Hint>
        </div>
      </DialogTrigger>
      <DialogContent className="p-0 bg-transparent border-none max-w-[480px]">
        <CreateOrganization />
      </DialogContent>
    </Dialog>
  );
};
```


## app\(dashboard)\_components\sidebar\index.tsx

```tsx
import { Button } from "./button";
import { List } from "./list";

export const Sidebar = () => {
  return (
    <aside className="fixed z-[1] left-0 bg-blue-950 h-full w-[70px] flex p-3 flex-col gap-y-4 text-white">
      <List />
      <Button />
    </aside>
  );
};
```


## app\(dashboard)\_components\sidebar\item.tsx

```tsx
"use client";

import Image from "next/image";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { cn } from "@/utils/canvas";
import { Hint } from "@/components/hint";

interface ItemProps {
  id: string;
  name: string;
  imageUrl: string;
}

export const Item = ({ id, name, imageUrl }: ItemProps) => {
  const { organization } = useOrganization();
  const { setActive } = useOrganizationList();

  const isActive = organization?.id === id;

  const onClick = () => {
    if (!setActive) return;

    setActive({ organization: id });
  };

  return (
    <div className="aspect-square relative">
      <Hint label={name} side="right" align="start" sideOffset={18}>
        <Image
          fill
          alt={name}
          src={imageUrl}
          onClick={onClick}
          className={cn(
            "rounded-md cursor-pointer opacity-75 hover:opacity-100 transition",
            isActive && "opacity-100"
          )}
        />
      </Hint>
    </div>
  );
};
```


## app\(dashboard)\_components\sidebar\list.tsx

```tsx
"use client";

import { useOrganizationList } from "@clerk/nextjs";
import { Item } from "./item";

export const List = () => {
  const { userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  if (!userMemberships.data?.length) return null;

  return (
    <ul className="space-y-4">
      {userMemberships.data?.map((member) => (
        <Item
          key={member.organization.id}
          id={member.organization.id}
          name={member.organization.name}
          imageUrl={member.organization.imageUrl}
        />
      ))}
    </ul>
  );
};
```


## app\(dashboard)\_components\board-list.tsx

```tsx
"use client";

import { EmptyBoard } from "./empty-board";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BoardCard } from "./board-card";
import { NewBoardButton } from "./new-board-button";

interface BoardListProps {
  orgId: string;
  query: {
    search?: string;
    favorites?: string;
  };
}

export const BoardList = ({ orgId, query }: BoardListProps) => {
  const data = useQuery(api.boards.get, {
    orgId,
    ...query,
  });

  if (data === undefined) {
    return <div>Loading...</div>;
  }

  if (!data?.length && query.search) {
    return <div>Try searching for something else</div>;
  }

  if (!data?.length && query.favorites) {
    return <div>No favorites</div>;
  }

  if (!data?.length) {
    return <EmptyBoard />;
  }

  return (
    <div>
      <h2 className="text-3xl">
        {query.favorites ? "Favorite boards" : "Team boards"}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
        <NewBoardButton orgId={orgId} />
        {data?.map((board: any) => (
          <BoardCard
            key={board._id}
            id={board._id}
            title={board.title}
            imageUrl={board.imageUrl}
            authorId={board.authorId}
            authorName={board.authorName}
            createdAt={board._creationTime}
            orgId={board.orgId}
            isFavorite={board.isFavorite}
          />
        ))}
      </div>
    </div>
  );
};
```


## app\(dashboard)\_components\empty-board.tsx

```tsx
"use client";

import { useRouter } from "next/navigation";
import { useOrganization } from "@clerk/nextjs";

import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";

import { useApiMutation } from "@/app/hooks/use-api-mutation";
import { toast } from "sonner";

export const EmptyBoard = () => {
  const router = useRouter();
  const { organization } = useOrganization();
  const { mutate, pending } = useApiMutation(api.board.create);

  const onClick = () => {
    if (!organization) return;

    mutate({
      orgId: organization.id,
      title: "Untitled",
    })
      .then((orgId) => {
        toast.success("Board created");
        router.push(`/test/${orgId}`);
      })
      .catch(() => toast.error("Failed to create"));
  };

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="text-xl font-semibold">Empty now</div>
      <h2 className="text-2xl font-semibold mt-6">Create your first board!</h2>
      <p className="text-muted-foreground text-sm mt-2">
        Start by creating a board for your organization
      </p>
      <div className="mt-6">
        <Button disabled={pending} onClick={onClick} size="lg">
          Create board
        </Button>
      </div>
    </div>
  );
};
```


## app\(dashboard)\_components\empty-org.tsx

```tsx
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreateOrganization } from "@clerk/nextjs";

export const EmptyOrganization = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Image src="/cover.png" alt="Empty" height={200} width={200} />
      <h2 className="text-2xl font-semibold mt-6">Welcome to Board</h2>
      <p className="text-muted-foreground text-sm mt-2">
        Create an organization to get started
      </p>
      <div className="mt-6">
        <Dialog>
          <DialogTrigger asChild>
            <Button size="lg">Create organization</Button>
          </DialogTrigger>
          <DialogContent className="p-0 bg-transparent border-none max-w-[480px]">
            <CreateOrganization />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
```


## app\(dashboard)\_components\invite-button.tsx

```tsx
"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { OrganizationProfile } from "@clerk/nextjs";
import { Plus } from "lucide-react";

export const InviteButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Invite members
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 bg-transparent border-none max-w-[880px]">
        <OrganizationProfile />
      </DialogContent>
    </Dialog>
  );
};
```


## app\(dashboard)\_components\navbar.tsx

```tsx
"use client";

import {
  OrganizationSwitcher,
  UserButton,
  useOrganization,
} from "@clerk/nextjs";
import { SearchInput } from "./search-input";
import { InviteButton } from "./invite-button";

export const Navbar = () => {
  const { organization } = useOrganization();

  return (
    <div className="flex items-center gap-x-4 p-5 bg-white">
      <div className="hidden lg:flex lg:flex-1">
        <SearchInput />
      </div>
      <div className="block lg:hidden flex-1">
        <OrganizationSwitcher
          hidePersonal
          appearance={{
            elements: {
              rootBox: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                maxWidth: "376px",
              },
              organizationSwitcherTrigger: {
                padding: "6px",
                width: "100%",
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                justifyContent: "space-between",
                backgroundColor: "white",
              },
            },
          }}
        />
      </div>
      {organization && <InviteButton />}
      <UserButton />
    </div>
  );
};
```


## app\(dashboard)\_components\new-board-button.tsx

```tsx
"use client";

import { toast } from "sonner";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { cn } from "@/utils/canvas";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/app/hooks/use-api-mutation";

interface NewBoardButtonProps {
  orgId: string;
  disabled?: boolean;
}

export const NewBoardButton = ({ orgId, disabled }: NewBoardButtonProps) => {
  const router = useRouter();
  const { mutate, pending } = useApiMutation(api.board.create);

  const onClick = () => {
    mutate({
      orgId,
      title: "Untitled",
    })
      .then((id) => {
        toast.success("Board created");
        router.push(`/test/${id}`);
      })
      .catch(() => toast.error("Failed to create board"));
  };

  return (
    <button
      disabled={pending || disabled}
      onClick={onClick}
      className={cn(
        "col-span-1 aspect-[100/130] bg-blue-600 rounded-lg hover:bg-blue-800 flex flex-col items-center justify-center py-6",
        (pending || disabled) &&
          "opacity-75 hover:bg-blue-600 cursor-not-allowed"
      )}
    >
      <div />
      <Plus className="h-12 w-12 text-white stroke-1" />
      <p className="text-sm text-white font-light">Create new board</p>
    </button>
  );
};
```


## app\(dashboard)\_components\org-sidebar.tsx

```tsx
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils/canvas";
import { OrganizationSwitcher } from "@clerk/nextjs";
import { LayoutDashboard, Star } from "lucide-react";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export const OrgSidebar = () => {
  const searchParams = useSearchParams();
  const favorites = searchParams.get("favorites");

  return (
    <div className="hidden lg:flex flex-col space-y-6 w-[206px] pl-5 pt-5">
      <Link href="/">
        <div className="flex items-center gap-x-2">
          <span className={cn("font-semibold text-2xl", font.className)}>
            Dashboard
          </span>
        </div>
      </Link>
      <OrganizationSwitcher
        hidePersonal
        appearance={{
          elements: {
            rootBox: {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            },
            organizationSwitcherTrigger: {
              padding: "6px",
              width: "100%",
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
              justifyContent: "space-between",
              backgroundColor: "white",
            },
          },
        }}
      />
      <div className="space-y-1 w-full">
        <Button
          variant={favorites ? "ghost" : "secondary"}
          asChild
          size="lg"
          className="font-normal justify-start px-2 w-full"
        >
          <Link href="/">
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Team boards
          </Link>
        </Button>
        <Button
          variant={favorites ? "secondary" : "ghost"}
          asChild
          size="lg"
          className="font-normal justify-start px-2 w-full"
        >
          <Link
            href={{
              pathname: "/",
              query: { favorites: true },
            }}
          >
            <Star className="h-4 w-4 mr-2" />
            Favorite boards
          </Link>
        </Button>
      </div>
    </div>
  );
};
```


## app\(dashboard)\_components\search-input.tsx

```tsx
"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, ChangeEvent } from "react";

import qs from "query-string";
import { useDebounce } from "usehooks-ts";

export const SearchInput = () => {
  const router = useRouter();
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value, 500); //MAYBE its not work? need reaserching

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: "/",
        query: {
          search: debouncedValue,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );
    router.push(url);
  }, [debouncedValue, router]);

  return (
    <div className="w-full relative">
      <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        className="w-full max-w-[516px] pl-9"
        placeholder="Search boards"
        onChange={handleChange}
        value={value}
      />
    </div>
  );
};
```


## app\(dashboard)\layout.tsx

```tsx
import { Navbar } from "./_components/navbar";
import { OrgSidebar } from "./_components/org-sidebar";
import { Sidebar } from "./_components/sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <main className="h-full">
      <Sidebar />
      <div className="pl-[60px] h-full">
        <div className="flex gap-x-3 h-full">
          <OrgSidebar />
          <div className="h-full flex-1">
            <Navbar />
            {children}
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardLayout;
```


## app\(dashboard)\page.tsx

```tsx
"use client";

import { BoardList } from "./_components/board-list";
import { EmptyOrganization } from "./_components/empty-org";
import { useOrganization } from "@clerk/nextjs";

interface DashboardPageProps {
  searchParams: {
    search?: string;
    favorites?: string;
  };
}

const DashboardPage = ({ searchParams }: DashboardPageProps) => {
  const { organization } = useOrganization();

  return (
    <div className="flex-1 h-[calc(100%-80px)] p-6">
      {!organization ? (
        <EmptyOrganization />
      ) : (
        <BoardList orgId={organization.id} query={searchParams} />
      )}
    </div>
  );
};

export default DashboardPage;
```


## app\api\liveblocks-auth\route.ts

```ts
import { auth, currentUser } from "@clerk/nextjs";
import { Liveblocks } from "@liveblocks/node";
import { ConvexHttpClient } from "convex/browser";

import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const liveblocks = new Liveblocks({
  secret: process.env.NEXT_PUBLIC_LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(request: Request) {
  const authorization = await auth();
  const user = await currentUser();

  if (!authorization || !user) {
    return new Response("Unauthorized", { status: 403 });
  }

  const { room } = await request.json();
  const board = await convex.query(api.board.get, { id: room });

  if (board?.orgId !== authorization.orgId) {
    return new Response("Unauthorized", { status: 403 });
  }

  const userInfo = {
    name: user.firstName || "Teammeate",
    picture: user.imageUrl,
  };

  const session = liveblocks.prepareSession(user.id, { userInfo });

  if (room) {
    session.allow(room, session.FULL_ACCESS);
  }

  const { status, body } = await session.authorize();
  return new Response(body, { status });
}
```


## app\board\[boardId]\_components\_layer-components.tsx\connector\connector.tsx

```tsx
"use client";
import { ArrowLayer } from "@/app/types/canvas";
import { colorToCss } from "@/utils/canvas";

interface RectangleProps {
  id: string;
  layer: ArrowLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

const Connector = ({
  id,
  layer,
  onPointerDown,
  selectionColor,
}: RectangleProps) => {
  const { x, y, width, height, fill } = layer;
  return (
    <svg>
      <line
        className="drop-shadow-md"
        onPointerDown={(e) => onPointerDown(e, id)}
        x1={x}
        y1={y + height / 2}
        x2={x + width}
        y2={y + height / 2}
        strokeWidth={2}
        stroke={selectionColor || "#000"}
      />
      {/* <rect
        className="drop-shadow-md"
        onPointerDown={(e) => onPointerDown(e, id)}
        style={{
          transform: `translate(${x}px, ${y}px)`,
        }}
        x={0}
        y={height / 2}
        width={width - 3}
        height={2}
        strokeWidth={2}
        fill={fill ? colorToCss(fill) : "#000"}
        stroke={selectionColor || "#000"}
      /> */}
      <polygon
        className="drop-shadow-md"
        onPointerDown={(e) => onPointerDown(e, id)}
        points={`${x + width - 10},${y + height / 2 - 5} ${x + width - 10},${
          y + height / 2 + 5
        } ${x + width + 2},${y + height / 2}`}
        strokeWidth={1}
        fill={fill ? colorToCss(fill) : "#000"}
        stroke={selectionColor || "#000"}
      />
    </svg>
  );
};

export default Connector;
```


## app\board\[boardId]\_components\_layer-components.tsx\edge.tsx

```tsx
import { EllipseLayer } from "@/app/types/canvas";
import { colorToCss } from "@/utils/canvas";
import { CSSProperties } from "react";

interface EdgeProps {
  id: string;
  layer: EllipseLayer;
  sourceId: string,
  targetId: string,
  inputValue: string,
  animated?: () => void,
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
  style?: CSSProperties;
  deletable?: boolean;
  selected?: boolean;
}

export const Edge = ({
  id,
  layer,
  onPointerDown,
  selectionColor,
}: EdgeProps) => {
  return (
    <ellipse
      className="drop-shadow-md"
      onPointerDown={(e) => onPointerDown(e, id)}
      style={{
        transform: `translate(
          ${layer.x}px,
          ${layer.y}px
        )`,
      }}
      cx={layer.width / 2}
      cy={layer.height / 2}
      rx={layer.width / 2}
      ry={layer.height / 2}
      fill={layer.fill ? colorToCss(layer.fill) : "#000"}
      stroke={selectionColor || "transparent"}
      strokeWidth="1"
    />
  );
};
```


## app\board\[boardId]\_components\_layer-components.tsx\ellipse.tsx

```tsx
import { EllipseLayer } from "@/app/types/canvas";
import { colorToCss } from "@/utils/canvas";

interface EllipseProps {
  id: string;
  layer: EllipseLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

export const Ellipse = ({
  id,
  layer,
  onPointerDown,
  selectionColor,
}: EllipseProps) => {
  return (
    <ellipse
      className="drop-shadow-md"
      onPointerDown={(e) => onPointerDown(e, id)}
      style={{
        transform: `translate(
          ${layer.x}px,
          ${layer.y}px
        )`,
      }}
      cx={layer.width / 2}
      cy={layer.height / 2}
      rx={layer.width / 2}
      ry={layer.height / 2}
      fill={layer.fill ? colorToCss(layer.fill) : "#000"}
      stroke={selectionColor || "transparent"}
      strokeWidth="1"
    />
  );
};
```


## app\board\[boardId]\_components\_layer-components.tsx\note.tsx

```tsx
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { colorToCss } from "@/utils/canvas";
import { useMutation } from "@/liveblocks.config";
import { Color, NoteLayer } from "@/app/types/canvas";

const getContrastingTextColor = (color: Color) => {
  const luminance = 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;
  return luminance > 182 ? "black" : "white";
};

const calculateFontSize = (width: number, height: number) => {
  const maxFontSize = 96;
  const scaleFactor = 0.15;
  const fontSizeBasedOnHeight = height * scaleFactor;
  const fontSizeBasedOnWidth = width * scaleFactor;

  return Math.min(fontSizeBasedOnHeight, fontSizeBasedOnWidth, maxFontSize);
};

interface NoteProps {
  id: string;
  layer: NoteLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

export const Note = ({
  layer,
  onPointerDown,
  id,
  selectionColor,
}: NoteProps) => {
  const { x, y, width, height, fill, value } = layer;

  const updateValue = useMutation(({ storage }, newValue: string) => {
    const liveLayers = storage.get("layers");

    liveLayers.get(id)?.set("value", newValue);
  }, []);

  const handleContentChange = (e: ContentEditableEvent) => {
    updateValue(e.target.value);
  };

  return (
    <foreignObject
      x={x}
      y={y}
      width={width}
      height={height}
      onPointerDown={(e) => onPointerDown(e, id)}
      style={{
        outline: selectionColor ? `1px solid ${selectionColor}` : "none",
        backgroundColor: fill ? colorToCss(fill) : "#000",
      }}
      className="shadow-md drop-shadow-xl"
    >
      <ContentEditable
        html={value || "Text"}
        onChange={handleContentChange}
        className="h-full w-full flex items-center justify-center text-center outline-none"
        style={{
          fontSize: calculateFontSize(width, height),
          color: fill ? getContrastingTextColor(fill) : "#000",
        }}
      />
    </foreignObject>
  );
};
```


## app\board\[boardId]\_components\_layer-components.tsx\path.tsx

```tsx
import getStroke from "perfect-freehand";

import { getSvgPathFromStroke } from "@/utils/canvas";

interface PathProps {
  x: number;
  y: number;
  points: number[][];
  fill: string;
  onPointerDown?: (e: React.PointerEvent) => void;
  stroke?: string;
}

export const Path = ({
  x,
  y,
  points,
  fill,
  onPointerDown,
  stroke,
}: PathProps) => {
  return (
    <path
      className="drop-shadow-md"
      onPointerDown={onPointerDown}
      d={getSvgPathFromStroke(
        getStroke(points, {
          size: 16,
          thinning: 0.5,
          smoothing: 0.5,
          streamline: 0.5,
        })
      )}
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
      x={0}
      y={0}
      fill={fill}
      stroke={stroke}
      strokeWidth={1}
    />
  );
};
```


## app\board\[boardId]\_components\_layer-components.tsx\rectangle.tsx

```tsx
import { RectangleLayer } from "@/app/types/canvas";
import { colorToCss } from "@/utils/canvas";

interface RectangleProps {
  id: string;
  layer: RectangleLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

export const Rectangle = ({
  id,
  layer,
  onPointerDown,
  selectionColor,
}: RectangleProps) => {
  const { x, y, width, height, fill } = layer;

  return (
    // <rect
    //   className="drop-shadow-md"
    //   onPointerDown={(e) => onPointerDown(e, id)}
    //   style={{
    //     transform: `translate(${x}px, ${y}px)`,
    //   }}
    //   x={0}
    //   y={0}
    //   width={width}
    //   height={height}
    //   strokeWidth={1}
    //   fill={fill ? colorToCss(fill) : "#000"}
    //   stroke={selectionColor || "#000"}
    // />
    <svg>
      <rect
        className="drop-shadow-md"
        onPointerDown={(e) => onPointerDown(e, id)}
        style={{
          transform: `translate(${x}px, ${y}px)`,
        }}
        x={0}
        y={0}
        width={width}
        height={height}
        strokeWidth={1}
        fill={fill ? colorToCss(fill) : "#000"}
        stroke={selectionColor || "#000"}
      />
      {/* <text
        x={x + width / 2} // x-координата центра текста
        y={y + height / 2} // y-координата центра текста
        dominantBaseline="middle" // Выравнивание текста по вертикали
        textAnchor="middle" // Выравнивание текста по горизонтали
        fill="#fff" // Цвет текста
        fontSize="16" // Размер шрифта
      >
        Ваш текст
      </text> */}
    </svg>
  );
};
```


## app\board\[boardId]\_components\_layer-components.tsx\text.tsx

```tsx
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";

import { colorToCss } from "@/utils/canvas";
import { useMutation } from "@/liveblocks.config";
import { TextLayer } from "@/app/types/canvas";

const calculateFontSize = (width: number, height: number) => {
  const maxFontSize = 96;
  const scaleFactor = 0.5;
  const fontSizeBasedOnHeight = height * scaleFactor;
  const fontSizeBasedOnWidth = width * scaleFactor;

  return Math.min(fontSizeBasedOnHeight, fontSizeBasedOnWidth, maxFontSize);
};

interface TextProps {
  id: string;
  layer: TextLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

export const TextComponent = ({ layer,onPointerDown,id,selectionColor }: TextProps) => {
  const { x, y, width, height, fill, value } = layer;

  const updateValue = useMutation(({ storage }, newValue: string) => {
    const liveLayers = storage.get("layers");

    liveLayers.get(id)?.set("value", newValue);
  }, []);

  const handleContentChange = (e: ContentEditableEvent) => {
    updateValue(e.target.value);
  };

  return (
    <foreignObject
      x={x}
      y={y}
      width={width}
      height={height}
      onPointerDown={(e) => onPointerDown(e, id)}
      style={{
        outline: selectionColor ? `1px solid ${selectionColor}` : "none",
      }}
    >
      <ContentEditable
        html={value || "Text"}
        onChange={handleContentChange}
        className="h-full w-full flex items-center justify-center text-center drop-shadow-md outline-none"
        style={{
          fontSize: calculateFontSize(width, height),
          color: fill ? colorToCss(fill) : "#000",
        }}
      />
    </foreignObject>
  );
};
```


## app\board\[boardId]\_components\_layer-components.tsx\triangle.tsx

```tsx
import { RectangleLayer } from "@/app/types/canvas";
import { colorToCss } from "@/utils/canvas";

interface TriangleProps {
  id: string;
  layer: RectangleLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

export const Triangle = ({
  id,
  layer,
  onPointerDown,
  selectionColor,
}: TriangleProps) => {
  const { x, y, width, height, fill } = layer;

  return (
    <>
      <svg>
        <polygon
          className="drop-shadow-md"
          onPointerDown={(e) => onPointerDown(e, id)}
          points={`${x},${y + height} ${x + width},${y + height} ${
            x + width / 2
          },${y}`}
          // points={`${x},${y} ${x + width},${y} ${x + width / 2},${y + height}`}
          strokeWidth={1}
          fill={fill ? colorToCss(fill) : "#000"}
          stroke={selectionColor || "#000"}
        />
        {/* Добавление текста внутри треугольника  */}
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          фывыфвфыв
        </text>
        <text
          x={x + width / 2}
          y={y + height + 15}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          еще текст
        </text>
      </svg>
    </>
  );
};
```


## app\board\[boardId]\_components\canvas.tsx

```tsx
"use client";
import { nanoid } from "nanoid";
import {
  Camera,
  CanvasMode,
  CanvasState,
  Color,
  LayerType,
  Point,
  Side,
  XYWH,
} from "@/app/types/canvas";
import {
  useHistory,
  useCanUndo,
  useCanRedo,
  useMutation,
  useStorage,
  useOthersMapped,
  useSelf,
} from "@/liveblocks.config";
import { Info } from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CursorsPresence } from "./cursors-presence";
import {
  colorToCss,
  connectionIdToColor,
  findIntersectingLayersWithRectangle,
  penPointsToPathLayer,
  pointerEventToCanvasPoint,
  resizeBounds,
} from "@/utils/canvas";
import { LiveObject } from "@liveblocks/client";
import { LayerPreview } from "./layer-preview";
import { SelectionBox } from "./selection-box";
import { SelectionTools } from "./selection-tools";
import { Path } from "./_layer-components.tsx/path";
import { useDisableScrollBounce } from "@/app/hooks/use-disable-scroll-bounce";
import { useDeleteLayers } from "@/app/hooks/use-delete-layers";

const MAX_LAYERS = 100;

interface CanvasProps {
  boardId: string;
}

export const Canvas = ({ boardId }: CanvasProps) => {
  const layerIds = useStorage((root) => root.layerIds);
  const pencilDraft = useSelf((me) => me.presence.pencilDraft);
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });
  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });
  const [lastUsedColor, setLastUsedColor] = useState<Color>({
    r: 0,
    g: 0,
    b: 0,
  });
  
  useDisableScrollBounce(); //- это что и для чего?
  const history = useHistory();

  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  //все вытаскивается из room provider
  const insertLayer = useMutation(
    (
      { storage, setMyPresence },
      layerType:
        | LayerType.Ellipse
        | LayerType.Rectangle
        | LayerType.Text
        | LayerType.Note
        | LayerType.Arrow,
      position: Point
    ) => {
      const liveLayers = storage.get("layers");
      if (liveLayers.size >= MAX_LAYERS) {
        return;
      }

      const liveLayerIds = storage.get("layerIds");
      const layerId = nanoid();
      const layer = new LiveObject({
        type: layerType,
        x: position.x,
        y: position.y,
        height: 70,
        width: 70,
        fill: lastUsedColor,
      });

      liveLayerIds.push(layerId);
      liveLayers.set(layerId, layer);

      setMyPresence({ selection: [layerId] }, { addToHistory: true });
      setCanvasState({ mode: CanvasMode.None });
    },
    [lastUsedColor]
  );
  // для рисования карандашем
  const continueDrawing = useMutation(
    ({ self, setMyPresence }, point: Point, e: React.PointerEvent) => {
      const { pencilDraft } = self.presence;

      if (
        canvasState.mode !== CanvasMode.Pencil ||
        e.buttons !== 1 ||
        pencilDraft == null
      ) {
        return;
      }

      setMyPresence({
        cursor: point,
        pencilDraft:
          pencilDraft.length === 1 &&
          pencilDraft[0][0] === point.x &&
          pencilDraft[0][1] === point.y
            ? pencilDraft
            : [...pencilDraft, [point.x, point.y, e.pressure]],
      });
    },
    [canvasState.mode]
  );
  const startDrawing = useMutation(
    ({ setMyPresence }, point: Point, pressure: number) => {
      setMyPresence({
        pencilDraft: [[point.x, point.y, pressure]],
        penColor: lastUsedColor,
      });
    },
    [lastUsedColor]
  );
  const insertPath = useMutation(
    ({ storage, self, setMyPresence }) => {
      const liveLayers = storage.get("layers");
      const { pencilDraft } = self.presence;

      if (
        pencilDraft == null ||
        pencilDraft.length < 2 ||
        liveLayers.size >= MAX_LAYERS
      ) {
        setMyPresence({ pencilDraft: null });
        return;
      }

      const id = nanoid();
      liveLayers.set(
        id,
        new LiveObject(penPointsToPathLayer(pencilDraft, lastUsedColor))
      );

      const liveLayerIds = storage.get("layerIds");
      liveLayerIds.push(id);

      setMyPresence({ pencilDraft: null });
      setCanvasState({ mode: CanvasMode.Pencil });
    },
    [lastUsedColor]
  );

  const unselectLayers = useMutation(({ self, setMyPresence }) => {
    if (self.presence.selection.length > 0) {
      setMyPresence({ selection: [] }, { addToHistory: true });
    }
  }, []);

  const onPointerUp = useMutation(
    ({}, e) => {
      const point = pointerEventToCanvasPoint(e, camera);

      if (
        canvasState.mode === CanvasMode.None ||
        canvasState.mode === CanvasMode.Pressing
      ) {
        unselectLayers();
        setCanvasState({
          mode: CanvasMode.None,
        });
      } else if (canvasState.mode === CanvasMode.Pencil) {
        insertPath();
      } else if (canvasState.mode === CanvasMode.Inserting) {
        insertLayer(canvasState.layerType, point);
      } else {
        setCanvasState({
          mode: CanvasMode.None,
        });
      }

      history.resume();
    },
    [
      setCanvasState,
      camera,
      canvasState,
      history,
      insertLayer,
      unselectLayers,
      insertPath,
    ]
  );

  const onWheel = useCallback((e: React.WheelEvent) => {
    setCamera((camera) => ({
      x: camera.x - e.deltaX,
      y: camera.y - e.deltaY,
    }));
  }, []);

  const resizeSelectedLayer = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Resizing) {
        return;
      }

      const bounds = resizeBounds(
        canvasState.initialBounds,
        canvasState.corner,
        point
      );

      const liveLayers = storage.get("layers");
      const layer = liveLayers.get(self.presence.selection[0]);

      if (layer) {
        layer.update(bounds);
      }
    },
    [camera, canvasState]
  );

  const startMultiSelection = useCallback((current: Point, origin: Point) => {
    if (Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) > 5) {
      setCanvasState({
        mode: CanvasMode.SelectionNet,
        origin,
        current,
      });
    }
  }, []);

  // перемещение объекта
  const translateSelectedLayers = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Translating) {
        return;
      }
      const offset = {
        x: point.x - canvasState.current.x,
        y: point.y - canvasState.current.y,
      };

      const liveLayers = storage.get("layers");

      for (const id of self.presence.selection) {
        const layer = liveLayers.get(id);

        if (layer) {
          layer.update({
            x: layer.get("x") + offset.x,
            y: layer.get("y") + offset.y,
          });
        }
      }

      setCanvasState({ mode: CanvasMode.Translating, current: point });
    },
    [canvasState]
  );
  const updateSelectionNet = useMutation(
    ({ storage, setMyPresence }, current: Point, origin: Point) => {
      const layers = storage.get("layers").toImmutable();
      setCanvasState({
        mode: CanvasMode.SelectionNet,
        origin,
        current,
      });

      const ids = findIntersectingLayersWithRectangle(
        layerIds,
        layers,
        origin,
        current
      );

      setMyPresence({ selection: ids });
    },
    [layerIds]
  );

  const onPointerMove = useMutation(
    ({ setMyPresence }, e: React.PointerEvent) => {
      e.preventDefault();

      const current = pointerEventToCanvasPoint(e, camera);
      if (canvasState.mode === CanvasMode.Pressing) {
        startMultiSelection(current, canvasState.origin);
        //выделение нескольких объектов
      } else if (canvasState.mode === CanvasMode.SelectionNet) {
        updateSelectionNet(current, canvasState.origin);
      }
      //перетаскивание объекта по канвасу
      else if (canvasState.mode === CanvasMode.Translating) {
        translateSelectedLayers(current);
      }
      //если меняем размер объекта
      else if (canvasState.mode === CanvasMode.Resizing) {
        resizeSelectedLayer(current);
      } else if (canvasState.mode === CanvasMode.Pencil) {
        continueDrawing(current, e);
      }

      setMyPresence({ cursor: current });
    },
    [
      canvasState,
      continueDrawing,
      camera,
      canvasState,
      resizeSelectedLayer,
      translateSelectedLayers,
      startMultiSelection,
      updateSelectionNet,
    ]
  );
  //выход за рамки канваса
  const onPointerLeave = useMutation(({ setMyPresence }) => {
    setMyPresence({ cursor: null });
  }, []);

  const selections = useOthersMapped((other) => other.presence.selection);
  //изменение цвета по цвету пользователя
  const layerIdsToColorSelection = useMemo(() => {
    const layerIdsToColorSelection: Record<string, string> = {};

    for (const user of selections) {
      const [connectionId, selection] = user;

      for (const layerId of selection) {
        layerIdsToColorSelection[layerId] = connectionIdToColor(connectionId);
      }
    }

    return layerIdsToColorSelection;
  }, [selections]);

  //нажимать и выделять объект рамкой другим юзером
  const onLayerPointerDown = useMutation(
    ({ self, setMyPresence }, e: React.PointerEvent, layerId: string) => {
      if (
        canvasState.mode === CanvasMode.Pencil ||
        canvasState.mode === CanvasMode.Inserting
      ) {
        return;
      }

      history.pause();
      e.stopPropagation();

      const point = pointerEventToCanvasPoint(e, camera);

      if (!self.presence.selection.includes(layerId)) {
        setMyPresence({ selection: [layerId] }, { addToHistory: true });
      }
      setCanvasState({ mode: CanvasMode.Translating, current: point });
    },
    [setCanvasState, camera, history, canvasState.mode]
  );

  const onResizeHandlePointerDown = useCallback(
    (corner: Side, initialBounds: XYWH) => {
      history.pause();
      setCanvasState({
        mode: CanvasMode.Resizing,
        initialBounds,
        corner,
      });
    },
    [history]
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const point = pointerEventToCanvasPoint(e, camera);

      if (canvasState.mode === CanvasMode.Inserting) {
        return;
      }
      if (canvasState.mode === CanvasMode.Pencil) {
        startDrawing(point, e.pressure);
        return;
      }

      setCanvasState({ origin: point, mode: CanvasMode.Pressing });
    },
    [camera, canvasState.mode, setCanvasState]
  );

  const deleteLayers = useDeleteLayers();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case "Delete":
          deleteLayers();
          break;
        case "z": {
          if (e.ctrlKey || e.metaKey) {
            if (e.shiftKey) {
              history.redo();
            } else {
              history.undo();
            }
            break;
          }
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [deleteLayers, history]);

  return (
    <main className="h-full w-full relative bg-neutral-100 touch-none">
      <Info boardId={boardId} />
      <Participants />
      <Toolbar
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        canRedo={canRedo}
        canUndo={canUndo}
        undo={history.undo}
        redo={history.redo}
      />
      <SelectionTools camera={camera} setLastUsedColor={setLastUsedColor} />
      <svg
        className="h-[100vh] w-[100vw]"
        onWheel={onWheel}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerUp={onPointerUp}
        onPointerDown={onPointerDown}
      >
        <g
          style={{
            transform: `translate(${camera.x}px, ${camera.y}px)`,
          }}
        >
          {layerIds.map((layerId) => (
            <LayerPreview
              key={layerId}
              id={layerId}
              onLayerPointerDown={onLayerPointerDown}
              selectionColor={layerIdsToColorSelection[layerId]}
            />
          ))}
          <SelectionBox onResizeHandlePointerDown={onResizeHandlePointerDown} />
          {/* добавление синего прямоугольника для выделения объектов которых мы хотим выделить */}
          {canvasState.mode === CanvasMode.SelectionNet &&
            canvasState.current != null && (
              <rect
                className="fill-blue-500/5 stroke-blue-500 stroke-1"
                x={Math.min(canvasState.origin.x, canvasState.current.x)}
                y={Math.min(canvasState.origin.y, canvasState.current.y)}
                width={Math.abs(canvasState.origin.x - canvasState.current.x)}
                height={Math.abs(canvasState.origin.y - canvasState.current.y)}
              />
            )}
          <CursorsPresence />
          {/* чтобы отображалось в вмомент рисования а не после завершения */}
          {pencilDraft != null && pencilDraft.length > 0 && (
            <Path
              points={pencilDraft}
              fill={colorToCss(lastUsedColor)}
              x={0}
              y={0}
            />
          )}
        </g>
      </svg>
    </main>
  );
};
```


## app\board\[boardId]\_components\color-picker.tsx

```tsx
"use client";

import { Color } from "@/app/types/canvas";
import { colorToCss } from "@/utils/canvas";

interface ColorPickerProps {
  onChange: (color: Color) => void;
}

export const ColorPicker = ({ onChange }: ColorPickerProps) => {
  return (
    <div className="flex flex-wrap gap-2 items-center max-w-[164px] pr-2 mr-2 border-r border-neutral-200">
      <ColorButton color={{ r: 243, g: 82, b: 35 }} onClick={onChange} />
      <ColorButton color={{ r: 255, g: 249, b: 177 }} onClick={onChange} />
      <ColorButton color={{ r: 68, g: 202, b: 99 }} onClick={onChange} />
      <ColorButton color={{ r: 39, g: 142, b: 237 }} onClick={onChange} />
      <ColorButton color={{ r: 155, g: 105, b: 245 }} onClick={onChange} />
      <ColorButton color={{ r: 252, g: 142, b: 42 }} onClick={onChange} />
      <ColorButton color={{ r: 0, g: 0, b: 0 }} onClick={onChange} />
      <ColorButton color={{ r: 255, g: 255, b: 255 }} onClick={onChange} />
    </div>
  );
};

interface ColorButtonProps {
  onClick: (color: Color) => void;
  color: Color;
}

const ColorButton = ({ onClick, color }: ColorButtonProps) => {
  return (
    <button
      className="w-8 h-8 items-center flex justify-center hover:opacity-75 transition"
      onClick={() => onClick(color)}
    >
      <div
        className="h-8 w-8 rounded-md border border-neutral-300"
        style={{ background: colorToCss(color) }}
      />
    </button>
  );
};
```


## app\board\[boardId]\_components\cursor.tsx

```tsx
"use client";

import { memo } from "react";
import { MousePointer2 } from "lucide-react";

import { useOther } from "@/liveblocks.config";
import { connectionIdToColor } from "@/utils/canvas";

interface CursorProps {
  connectionId: number;
};

export const Cursor = memo(({
  connectionId,
}: CursorProps) => {
  const info = useOther(connectionId, (user) => user?.info);
  const cursor = useOther(connectionId, (user) => user.presence.cursor)

  const name = info?.name || "Teammate";

  if (!cursor) {
    return null;
  }

  const { x, y } = cursor;

  return (
    <foreignObject
      style={{
        transform: `translateX(${x}px) translateY(${y}px)`
      }}
      height={50}
      width={name.length * 10 + 24}
      className="relative drop-shadow-md"
    >
      <MousePointer2
        className="h-5 w-5"
        style={{
          fill: connectionIdToColor(connectionId),
          color: connectionIdToColor(connectionId),
        }}
      />
      <div
        className="absolute left-5 px-1.5 py-0.5 rounded-md text-xs text-white font-semibold"
        style={{ backgroundColor: connectionIdToColor(connectionId) }}
      >
        {name}
      </div>
    </foreignObject>
  )
});

Cursor.displayName = "Cursor";
```


## app\board\[boardId]\_components\cursors-presence.tsx

```tsx
"use client";

import { memo } from "react";
import { shallow } from "@liveblocks/client";

import { 
  useOthersConnectionIds, 
  useOthersMapped
} from "@/liveblocks.config";
import { colorToCss } from "@/utils/canvas";

import { Cursor } from "./cursor";
import { Path } from "./_layer-components.tsx/path";

const Cursors = () => {
  const ids = useOthersConnectionIds();

  return (
    <>
      {ids.map((connectionId) => (
        <Cursor
          key={connectionId}
          connectionId={connectionId}
        />
      ))}
    </>
  );
};

const Drafts = () => {
  const others = useOthersMapped((other) => ({
    pencilDraft: other.presence.pencilDraft,
    penColor: other.presence.penColor,
  }), shallow);

  return (
    <>
      {others.map(([key, other]) => {
        if (other.pencilDraft) {
          return (
            <Path
              key={key}
              x={0}
              y={0}
              points={other.pencilDraft}
              fill={other.penColor ? colorToCss (other.penColor) : "#000"}
            />
          );
        }

        return null;
      })}
    </>
  )
}

export const CursorsPresence = memo(() => {
  return (
    <>
      <Cursors />
    </>
  );
});

CursorsPresence.displayName = "CursorsPresence";
```


## app\board\[boardId]\_components\info.tsx

```tsx
"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { Poppins } from "next/font/google";

import { cn } from "@/utils/canvas";
import { Hint } from "@/components/hint";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";
import { useRenameModal } from "@/app/store/use-rename-modal";

interface InfoProps {
  boardId: string;
}

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

const TabSeparator = () => {
  return <div className="text-neutral-300 px-1.5">|</div>;
};

export const Info = ({ boardId }: InfoProps) => {
  const { onOpen } = useRenameModal();

  const data = useQuery(api.board.get, {
    id: boardId as Id<"boards">,
  });

  if (!data) return <div>No info</div>

  return (
    <div className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md">
      <Hint label="Go to boards" side="bottom" sideOffset={10}>
        <Button asChild variant="ghost" className="px-2">
          <Link href="/">
            <span
              className={cn(
                "font-semibold text-xl ml-2 text-black",
                font.className
              )}
            >
              Dashboard
            </span>
          </Link>
        </Button>
      </Hint>
      <TabSeparator />
      <Hint label="Edit title" side="bottom" sideOffset={10}>
        <Button
          variant="ghost"
          className="text-base font-normal px-2"
          onClick={() => onOpen(data._id, data.title)}
        >
          {data.title}
        </Button>
      </Hint>
    </div>
  );
};
```


## app\board\[boardId]\_components\layer-preview.tsx

```tsx
"use client";

import { memo } from "react";

import { colorToCss } from "@/utils/canvas";
import { useStorage } from "@/liveblocks.config";
import { LayerType } from "@/app/types/canvas";
import { Path } from "./_layer-components.tsx/path";
import { Rectangle } from "./_layer-components.tsx/rectangle";
import { Ellipse } from "./_layer-components.tsx/ellipse";
import { TextComponent } from "./_layer-components.tsx/text";
import { Note } from "./_layer-components.tsx/note";
import { Triangle } from "./_layer-components.tsx/triangle";
import Connector from "./_layer-components.tsx/connector/connector";

interface LayerPreviewProps {
  id: string;
  onLayerPointerDown: (e: React.PointerEvent, layerId: string) => void;
  selectionColor?: string;
}

//отображение объектов на канвасе
export const LayerPreview = memo(
  ({ id, onLayerPointerDown, selectionColor }: LayerPreviewProps) => {
    const layer = useStorage((root) => root.layers.get(id));

    if (!layer) {
      return null;
    }

    switch (layer.type) {
      case LayerType.Path:
        return (
          <Path
            key={id}
            points={layer.points}
            onPointerDown={(e) => onLayerPointerDown(e, id)}
            x={layer.x}
            y={layer.y}
            fill={layer.fill ? colorToCss(layer.fill) : "#000"}
            stroke={selectionColor}
          />
        );
      case LayerType.Note:
        return (
          <Note
            id={id}
            layer={layer}
            onPointerDown={onLayerPointerDown}
            selectionColor={selectionColor}
          />
        );
      case LayerType.Text:
        return (
          <TextComponent
            id={id}
            layer={layer}
            onPointerDown={onLayerPointerDown}
            selectionColor={selectionColor}
          />
        );
      case LayerType.Ellipse:
        return (
          <Ellipse
            id={id}
            layer={layer}
            onPointerDown={onLayerPointerDown}
            selectionColor={selectionColor}
          />
        );
      case LayerType.Rectangle:
        return (
          <Triangle
            id={id}
            layer={layer}
            onPointerDown={onLayerPointerDown}
            selectionColor={selectionColor}
          />
        );
        case LayerType.Arrow:
          return (
            <Connector
              id={id}
              layer={layer}
              onPointerDown={onLayerPointerDown}
              selectionColor={selectionColor}
            />
          );
      default:
        console.warn("Unknown layer type");
        return null;
    }
  }
);

LayerPreview.displayName = "LayerPreview";
```


## app\board\[boardId]\_components\participants.tsx

```tsx
"use client";

import { useOthers, useSelf } from "@/liveblocks.config";

import { UserAvatar } from "./user-avatar";
import { connectionIdToColor } from "@/utils/canvas";

const MAX_SHOWN_USERS = 2;

export const Participants = () => {
  const users = useOthers();
  const currentUser = useSelf();
  const hasMoreUsers = users.length > MAX_SHOWN_USERS;

  return (
    <div className="w-auto bg-white rounded-md p-3 flex items-center shadow-md">
      <div className="flex gap-x-2">
        {currentUser && (
          <UserAvatar
            borderColor={connectionIdToColor(currentUser.connectionId)}
            src={currentUser.info?.picture}
            name={`${currentUser.info?.name} (You)`}
            fallback={currentUser.info?.name?.[0]}
          />
        )}

        {users.slice(0, MAX_SHOWN_USERS).map(({ connectionId, info }) => {
          return (
            <UserAvatar
              borderColor={connectionIdToColor(connectionId)}
              key={connectionId}
              src={info?.picture}
              name={info?.name}
              fallback={info?.name?.[0] || "T"}
            />
          );
        })}

        {hasMoreUsers && (
          <UserAvatar
            name={`${users.length - MAX_SHOWN_USERS} more`}
            fallback={`+${users.length - MAX_SHOWN_USERS}`}
          />
        )}
      </div>
    </div>
  );
};
```


## app\board\[boardId]\_components\selection-box.tsx

```tsx
"use client";

import { memo } from "react";

import { useSelf, useStorage } from "@/liveblocks.config";
import { LayerType, Side, XYWH } from "@/app/types/canvas";
import { useSelectionBounds } from "@/app/hooks/use-selection-bounds";

//чтобы я могла выделять нужный объект по контуру с точками для изменения размера
interface SelectionBoxProps {
  onResizeHandlePointerDown: (corner: Side, initialBounds: XYWH) => void;
}

const HANDLE_WIDTH = 8;

export const SelectionBox = memo(
  ({ onResizeHandlePointerDown }: SelectionBoxProps) => {
    const soleLayerId = useSelf((me) =>
      me.presence.selection.length === 1 ? me.presence.selection[0] : null
    );

    const isShowingHandles = useStorage(
      (root) =>
        soleLayerId && root.layers.get(soleLayerId)?.type !== LayerType.Path
    );

    const bounds = useSelectionBounds();

    if (!bounds) {
      return null;
    }

    return (
      <>
        <rect
          className="fill-transparent stroke-blue-500 stroke-1 pointer-events-none"
          style={{
            transform: `translate(${bounds.x}px, ${bounds.y}px)`,
          }}
          x={0}
          y={0}
          width={bounds.width}
          height={bounds.height}
        />
        {/* если растянуть объект по размеру(выделяет по контуру и меняет курсок ) */}
        {isShowingHandles && (
          <>
            <rect
              className="fill-white stroke-1 stroke-blue-500"
              x={0}
              y={0}
              style={{
                cursor: "nwse-resize",
                width: `${HANDLE_WIDTH}px`,
                height: `${HANDLE_WIDTH}px`,
                transform: `
                translate(
                  ${bounds.x - HANDLE_WIDTH / 2}px,
                  ${bounds.y - HANDLE_WIDTH / 2}px
                )
              `,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onResizeHandlePointerDown(Side.Top + Side.Left, bounds);
              }}
            />
            <rect
              className="fill-white stroke-1 stroke-blue-500"
              x={0}
              y={0}
              style={{
                cursor: "ns-resize",
                width: `${HANDLE_WIDTH}px`,
                height: `${HANDLE_WIDTH}px`,
                transform: `
                translate(
                  ${bounds.x + bounds.width / 2 - HANDLE_WIDTH / 2}px, 
                  ${bounds.y - HANDLE_WIDTH / 2}px
                )
              `,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onResizeHandlePointerDown(Side.Top, bounds);
              }}
            />
            <rect
              className="fill-white stroke-1 stroke-blue-500"
              x={0}
              y={0}
              style={{
                cursor: "nesw-resize",
                width: `${HANDLE_WIDTH}px`,
                height: `${HANDLE_WIDTH}px`,
                transform: `
                translate(
                  ${bounds.x - HANDLE_WIDTH / 2 + bounds.width}px,
                  ${bounds.y - HANDLE_WIDTH / 2}px
                )`,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onResizeHandlePointerDown(Side.Top + Side.Right, bounds);
              }}
            />
            <rect
              className="fill-white stroke-1 stroke-blue-500"
              x={0}
              y={0}
              style={{
                cursor: "ew-resize",
                width: `${HANDLE_WIDTH}px`,
                height: `${HANDLE_WIDTH}px`,
                transform: `
                translate(
                  ${bounds.x - HANDLE_WIDTH / 2 + bounds.width}px, 
                  ${bounds.y + bounds.height / 2 - HANDLE_WIDTH / 2}px
                )`,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onResizeHandlePointerDown(Side.Right, bounds);
              }}
            />
            <rect
              className="fill-white stroke-1 stroke-blue-500"
              x={0}
              y={0}
              style={{
                cursor: "nwse-resize",
                width: `${HANDLE_WIDTH}px`,
                height: `${HANDLE_WIDTH}px`,
                transform: `
                translate(
                  ${bounds.x - HANDLE_WIDTH / 2 + bounds.width}px, 
                  ${bounds.y - HANDLE_WIDTH / 2 + bounds.height}px
                )`,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onResizeHandlePointerDown(Side.Bottom + Side.Right, bounds);
              }}
            />
            <rect
              className="fill-white stroke-1 stroke-blue-500"
              x={0}
              y={0}
              style={{
                cursor: "ns-resize",
                width: `${HANDLE_WIDTH}px`,
                height: `${HANDLE_WIDTH}px`,
                transform: `
                translate(
                  ${bounds.x + bounds.width / 2 - HANDLE_WIDTH / 2}px,
                  ${bounds.y - HANDLE_WIDTH / 2 + bounds.height}px
                )`,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onResizeHandlePointerDown(Side.Bottom, bounds);
              }}
            />
            <rect
              className="fill-white stroke-1 stroke-blue-500"
              x={0}
              y={0}
              style={{
                cursor: "nesw-resize",
                width: `${HANDLE_WIDTH}px`,
                height: `${HANDLE_WIDTH}px`,
                transform: `
                translate(
                  ${bounds.x - HANDLE_WIDTH / 2}px,
                  ${bounds.y - HANDLE_WIDTH / 2 + bounds.height}px
                )`,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onResizeHandlePointerDown(Side.Bottom + Side.Left, bounds);
              }}
            />
            <rect
              className="fill-white stroke-1 stroke-blue-500"
              x={0}
              y={0}
              style={{
                cursor: "ew-resize",
                width: `${HANDLE_WIDTH}px`,
                height: `${HANDLE_WIDTH}px`,
                transform: `
                translate(
                  ${bounds.x - HANDLE_WIDTH / 2}px,
                  ${bounds.y - HANDLE_WIDTH / 2 + bounds.height / 2}px
                )`,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onResizeHandlePointerDown(Side.Left, bounds);
              }}
            />
          </>
        )}
      </>
    );
  }
);

SelectionBox.displayName = "SelectionBox";
```


## app\board\[boardId]\_components\selection-tools.tsx

```tsx
"use client";

import { memo } from "react";
import { BringToFront, SendToBack, Trash2 } from "lucide-react";

import { Hint } from "@/components/hint";

import { Button } from "@/components/ui/button";
import { useMutation, useSelf } from "@/liveblocks.config";
import { Camera, Color } from "@/app/types/canvas";
import { useSelectionBounds } from "@/app/hooks/use-selection-bounds";
import { useDeleteLayers } from "@/app/hooks/use-delete-layers";
import { ColorPicker } from "./color-picker";


interface SelectionToolsProps {
  camera: Camera;
  setLastUsedColor: (color: Color) => void;
}

export const SelectionTools = memo(
  ({ camera, setLastUsedColor }: SelectionToolsProps) => {
    const selection = useSelf((me) => me.presence.selection);

    const moveToFront = useMutation(
      ({ storage }) => {
        const liveLayerIds = storage.get("layerIds");
        const indices: number[] = [];

        const arr = liveLayerIds.toImmutable();

        for (let i = 0; i < arr.length; i++) {
          if (selection.includes(arr[i])) {
            indices.push(i);
          }
        }

        for (let i = indices.length - 1; i >= 0; i--) {
          liveLayerIds.move(
            indices[i],
            arr.length - 1 - (indices.length - 1 - i)
          );
        }
      },
      [selection]
    );

    const moveToBack = useMutation(
      ({ storage }) => {
        const liveLayerIds = storage.get("layerIds");
        const indices: number[] = [];

        const arr = liveLayerIds.toImmutable();

        for (let i = 0; i < arr.length; i++) {
          if (selection.includes(arr[i])) {
            indices.push(i);
          }
        }

        for (let i = 0; i < indices.length; i++) {
          liveLayerIds.move(indices[i], i);
        }
      },
      [selection]
    );

    //изменяет цвет объекта по выбору цвета из ColorPicker
    const setFill = useMutation(
      ({ storage }, fill: Color) => {
        const liveLayers = storage.get("layers");
        setLastUsedColor(fill);

        selection.forEach((id) => {
          liveLayers.get(id)?.set("fill", fill);
        });
      },
      [selection, setLastUsedColor]
    );

    const deleteLayers = useDeleteLayers();

    const selectionBounds = useSelectionBounds();

    if (!selectionBounds) {
      return null;
    }

    const x = selectionBounds.width / 2 + selectionBounds.x + camera.x;
    const y = selectionBounds.y + camera.y;

    return (
      <div
        className="absolute p-3 rounded-xl bg-white shadow-sm border flex select-none"
        style={{
          transform: `translate(
          calc(${x}px - 50%),
          calc(${y - 16}px - 100%)
        )`,
        }}
      >
        <ColorPicker onChange={setFill} />
        <div className="flex flex-col gap-y-0.5">
          <Hint label="Bring to front">
            <Button onClick={moveToFront} variant="ghost" size="icon">
              <BringToFront />
            </Button>
          </Hint>
          <Hint label="Send to back" side="bottom">
            <Button onClick={moveToBack} variant="ghost" size="icon">
              <SendToBack />
            </Button>
          </Hint>
        </div>
        <div className="flex items-center pl-2 ml-2 border-l border-neutral-200">
          <Hint label="Delete">
            <Button variant="ghost" size="icon" onClick={deleteLayers}>
              <Trash2 />
            </Button>
          </Hint>
        </div>
      </div>
    );
  }
);

SelectionTools.displayName = "SelectionTools";
```


## app\board\[boardId]\_components\tool-button.tsx

```tsx
"use client";

import { LucideIcon } from "lucide-react";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";

interface ToolButtonProps {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  isActive?: boolean;
  isDisabled?: boolean;
}

export const ToolButton = ({
  label,
  icon: Icon,
  onClick,
  isActive,
  isDisabled,
}: ToolButtonProps) => {
  return (
    <Hint label={label} side="right" sideOffset={14}>
      <Button
        disabled={isDisabled}
        onClick={onClick}
        size="icon"
        variant={isActive ? "outline" : "default"}
      >
        <Icon />
      </Button>
    </Hint>
  );
};
```


## app\board\[boardId]\_components\toolbar.tsx

```tsx
import { 
  Circle, 
  MousePointer2, 
  Pencil, 
  Redo2, 
  Square, 
  StickyNote, 
  Type,
  Undo2
} from "lucide-react";
import { MoveUpRight } from 'lucide-react';

import { ToolButton } from "./tool-button";
import { CanvasMode, CanvasState, LayerType } from "@/app/types/canvas";

interface ToolbarProps {
  canvasState: CanvasState;
  setCanvasState: (newState: CanvasState) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
};

export const Toolbar = ({
  canvasState,
  setCanvasState,
  undo,
  redo,
  canUndo,
  canRedo,
}: ToolbarProps) => {
  return (
    <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4">
      <div className="bg-white rounded-md p-1.5 flex gap-y-1 flex-col items-center shadow-md">
        <ToolButton
          label="Select"
          icon={MousePointer2}
          onClick={() => setCanvasState({ 
            mode: CanvasMode.None
          })}
          isActive={
            canvasState.mode === CanvasMode.None ||
            canvasState.mode === CanvasMode.Translating ||
            canvasState.mode === CanvasMode.SelectionNet ||
            canvasState.mode === CanvasMode.Pressing ||
            canvasState.mode === CanvasMode.Resizing
          }
        />
        <ToolButton
          label="Text"
          icon={Type}
          onClick={() => setCanvasState({
            mode: CanvasMode.Inserting,
            layerType: LayerType.Text,
          })}
          isActive={
            canvasState.mode === CanvasMode.Inserting &&
            canvasState.layerType === LayerType.Text
          }
        />
        <ToolButton
          label="Sticky note"
          icon={StickyNote}
          onClick={() => setCanvasState({
            mode: CanvasMode.Inserting,
            layerType: LayerType.Note,
          })}
          isActive={
            canvasState.mode === CanvasMode.Inserting &&
            canvasState.layerType === LayerType.Note
          }
        />
        <ToolButton
          label="Rectangle"
          icon={Square}
          onClick={() => setCanvasState({
            mode: CanvasMode.Inserting,
            layerType: LayerType.Rectangle,
          })}
          isActive={
            canvasState.mode === CanvasMode.Inserting &&
            canvasState.layerType === LayerType.Rectangle
          }
        />
         <ToolButton
          label="Arrow"
          icon={MoveUpRight}
          onClick={() => setCanvasState({
            mode: CanvasMode.Inserting,
            layerType: LayerType.Arrow,
          })}
          isActive={
            canvasState.mode === CanvasMode.Inserting &&
            canvasState.layerType === LayerType.Arrow
          }
        />
        <ToolButton
          label="Ellipse"
          icon={Circle}
          onClick={() => setCanvasState({
            mode: CanvasMode.Inserting,
            layerType: LayerType.Ellipse,
          })}
          isActive={
            canvasState.mode === CanvasMode.Inserting &&
            canvasState.layerType === LayerType.Ellipse
          }
        />
        <ToolButton
          label="Pen"
          icon={Pencil}
          onClick={() => setCanvasState({
            mode: CanvasMode.Pencil,
          })}
          isActive={
            canvasState.mode === CanvasMode.Pencil
          }
        />
      </div>
      {/* undo redo */}
      <div className="bg-white rounded-md p-1.5 flex flex-col items-center shadow-md">
        <ToolButton
          label="Undo"
          icon={Undo2}
          onClick={undo}
          isDisabled={!canUndo}
        />
        <ToolButton
          label="Redo"
          icon={Redo2}
          onClick={redo}
          isDisabled={!canRedo}
        />
      </div>
    </div>
  );
};
```


## app\board\[boardId]\_components\user-avatar.tsx

```tsx
import { Hint } from "@/components/hint";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  src?: string;
  name?: string;
  fallback?: string;
  borderColor?: string;
}

export const UserAvatar = ({
  src,
  name,
  fallback,
  borderColor,
}: UserAvatarProps) => {
  return (
    <Hint label={name || "Teammate"} side="bottom" sideOffset={18}>
      <Avatar className="h-8 w-8 border-2" style={{ borderColor }}>
        <AvatarImage src={src} />
        <AvatarFallback className="text-xs font-semibold">
          {fallback}
        </AvatarFallback>
      </Avatar>
    </Hint>
  );
};
```


## app\board\[boardId]\page.tsx

```tsx
import { Room } from "@/components/room";
import { Canvas } from "./_components/canvas";
import { Loading } from "@/components/loading";

interface BoardIdPageProps {
  params: {
    boardId: string;
  };
}

const BoardIdPage = ({ params }: BoardIdPageProps) => {
  return (
    <Room roomId={params.boardId} fallback={<Loading />}>
      <Canvas boardId={params.boardId} />
    </Room>
  );
};

export default BoardIdPage;
```


## app\hooks\use-api-mutation.ts

```ts
import { useState } from "react";
import { useMutation } from "convex/react";

export const useApiMutation = (mutationFunction: any) => {
    const [pending, setPending] = useState(false);
    const apiMutation = useMutation(mutationFunction);

    const mutate = (payload: any) => {
        setPending(true);
        return apiMutation(payload)
            .finally(() => setPending(false))
            .then((result) => {
                return result;
            })
            .catch((error) => {
                throw error;
            });
    };

    return {
        mutate,
        pending,
    };
};
```


## app\hooks\use-delete-layers.ts

```ts
import { useSelf, useMutation } from "@/liveblocks.config";

export const useDeleteLayers = () => {
    const selection = useSelf((me) => me.presence.selection);

    return useMutation((
        { storage, setMyPresence }
    ) => {
        const liveLayers = storage.get("layers");
        const liveLayerIds = storage.get("layerIds");

        for (const id of selection) {
            liveLayers.delete(id);

            const index = liveLayerIds.indexOf(id);

            if (index !== -1) {
                liveLayerIds.delete(index);
            }
        }

        setMyPresence({ selection: [] }, { addToHistory: true });
    }, [selection]);
};
```


## app\hooks\use-disable-scroll-bounce.ts

```ts
import { useEffect } from "react";

export const useDisableScrollBounce = () => {
    useEffect(() => {
        document.body.classList.add("overflow-hidden", "overscroll-none");
        return () => {
            document.body.classList.remove("overflow-hidden", "overscroll-none");
        };
    }, []);
};
```


## app\hooks\use-selection-bounds.ts

```ts
import { shallow } from "@liveblocks/react";

import { useStorage, useSelf } from "@/liveblocks.config";
import { Layer, XYWH } from "../types/canvas";

const boundingBox = (layers: Layer[]): XYWH | null => {
    const first = layers[0];

    if (!first) {
        return null;
    }

    let left = first.x;
    let right = first.x + first.width;
    let top = first.y;
    let bottom = first.y + first.height;

    for (let i = 1; i < layers.length; i++) {
        const { x, y, width, height } = layers[i];

        if (left > x) {
            left = x;
        }

        if (right < x + width) {
            right = x + width;
        }

        if (top > y) {
            top = y;
        }

        if (bottom < y + height) {
            bottom = y + height;
        }
    }

    return {
        x: left,
        y: top,
        width: right - left,
        height: bottom - top,
    };
};

export const useSelectionBounds = () => {
    const selection = useSelf((me) => me.presence.selection);

    return useStorage((root) => {
        const selectedLayers = selection
            .map((layerId) => root.layers.get(layerId)!)
            .filter(Boolean);

        return boundingBox(selectedLayers);
    }, shallow);
};
```


## app\hooks\useInitializeBoard.ts

```ts
import { useEffect } from "react";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toReactFlowNode, toReactFlowEdge } from "@/utils/adapters";

import useStore from "../store/store";
import { useChangeEdgeType } from "../store/use-custom-edge";
import { EdgesTypes } from "../types/structs";

export const useInitializeBoard = (boardId: Id<"boards">) => {
  const boardState = useQuery(api.board.loadBoardState, { boardId });
  const { initialize } = useStore();
  const { onChangeEdgesType } = useChangeEdgeType();

  useEffect(() => {
    if (boardState && !useStore.getState().isInitialized) {
      const nodes = boardState.nodes.map(toReactFlowNode);
      const edges = boardState.edges.map(toReactFlowEdge);

      initialize({
        nodes,
        edges,
        title: boardState.title,
        description: boardState?.description || "",
        edgesType: (boardState?.edgesType as EdgesTypes) || EdgesTypes.DEFAULT,
        version: boardState.version,
        createdAt: boardState._creationTime,
      });
      onChangeEdgesType(
        (boardState?.edgesType as EdgesTypes) || EdgesTypes.DEFAULT
      );
    }
  }, [boardState]);
};
```


## app\hooks\useRestoreVersionHandler.tsx

```tsx
import { useCallback } from "react";
import { useConvex } from "convex/react";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import useStore from "../store/store";

type TUseRestoreVersionHandlerProps = {
  boardId: Id<"boards">;
  onSaveRestoredVersion: (
    isRestore?: boolean,
    restoredVersionTime?: number,
    restoredVersionMessage?: string
  ) => void;
};

export const useRestoreVersionHandler = ({
  boardId,
  onSaveRestoredVersion,
}: TUseRestoreVersionHandlerProps) => {
  const convex = useConvex();
  const { onRestoreVersion } = useStore();

  const handleRestore = useCallback(
    async (versionId: number) => {
      const boardVersion = await convex
        .query(api.boardsHistory.getVersionByNumber, {
          boardId: boardId,
          version: versionId,
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

        await onRestoreVersion(restoredVersion);
        await onSaveRestoredVersion(
          true,
          boardVersion?._creationTime,
          boardVersion?.message
        );
      } catch (error) {
        toast.error("Ошибка при восстановлении версии в истории");
      }
    },
    [boardId]
  );

  return { handleRestore };
};
```


## app\hooks\useSaveHandlerOnKeydown.ts

```ts
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
```


## app\hooks\useVersionsHistory.ts

```ts
import { useCallback, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useMutation } from "convex/react";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import useStore from "@/app/store/store";

import { filterPatches, generatePatches } from "@/utils/jsonDiff";
import { toConvexEdge, toConvexNode } from "@/utils/adapters";
import { BoardSavingStatus } from "../types/history";

export const useVersionsHistory = (boardId: string) => {
  const {
    liveblocks: { isStorageLoading },
    nodes,
    edges,
    previousState,
    setPreviousState,
    savingStatus,
    setSavingStatus,
  } = useStore();
  const createVersion = useMutation(api.boardsHistory.createVersion);

  const patchCounterRef = useRef(0);
  const retryCountRef = useRef(0);

  // Ручное сохранение снапшота
  const manualSave = useCallback(
    async (
      isRestore?: boolean,
      restoredVersionTime?: number,
      restoredVersionMessage?: string
    ) => {
      if (isStorageLoading) {
        toast.error("Дождитесь загрузки хранилища");
        return;
      }

      if (savingStatus === BoardSavingStatus.SAVING) {
        return;
      }

      try {
        setSavingStatus(BoardSavingStatus.SAVING);

        const { version, createdAt } = await createVersion({
          boardId: boardId as Id<"boards">,
          type: "snapshot",
          data: {
            nodes: nodes.map(toConvexNode),
            edges: edges.map(toConvexEdge),
          },
          message:
            isRestore && restoredVersionMessage
              ? `${restoredVersionMessage} (Востанновленная)`
              : undefined,
          restoreByTime:
            isRestore && restoredVersionTime ? restoredVersionTime : undefined,
        });

        setPreviousState({
          nodes,
          edges,
          version,
          createdAt,
        });

        patchCounterRef.current = 0;
      } catch (error) {
        console.error("Ошибка сохранения версии:", error);
        toast.error("Ошибка при сохранении версии");
      } finally {
        setSavingStatus(BoardSavingStatus.IDLE);
      }
    },
    [
      boardId,
      createVersion,
      edges,
      isStorageLoading,
      nodes,
      savingStatus,
      setPreviousState,
      setSavingStatus,
    ]
  );

  // Автосохранение с дебаунсом в 1 минуту
  const savePatch = async () => {
    try {
      if (!previousState) return;

      const patches = filterPatches(
        generatePatches(
          { nodes: previousState.nodes, edges: previousState.edges },
          { nodes, edges }
        )
      );

      if (patches.length === 0) return;

      setSavingStatus(BoardSavingStatus.SAVING);

      const { version, createdAt } = await createVersion({
        boardId: boardId as Id<"boards">,
        type: "patch",
        data: {
          patches,
          base: previousState.version,
        },
      });

      patchCounterRef.current++;
      retryCountRef.current = 0;

      setPreviousState({
        nodes,
        edges,
        version,
        createdAt,
      });

      // Создаем снапшот каждые 25 патчей или раз в 15 минут
      if (patchCounterRef.current >= 25) {
        await manualSave();
      }
    } catch (error) {
      if (retryCountRef.current < 3) {
        retryCountRef.current++;
        setTimeout(savePatch, 5000 * retryCountRef.current);
        return;
      }
      console.error("Ошибка сохранения патча:", error);
      toast.error("Ошибка при автосохранении версии");
    } finally {
      setSavingStatus(BoardSavingStatus.IDLE);
    }
  };

  // Автосохранение каждые 60 секунд
  const autoSave = useDebouncedCallback(savePatch, 60000, {
    leading: false,
    trailing: true,
    maxWait: 60000, // Максимальное время ожидания
  });

  return { autoSave, manualSave };
};
```


## app\services\generateSheme.ts

```ts
import { useGenerate } from "../store/useBoardInfo";
import { EdgesTypes } from "../types/structs";

export interface ITemplate {
  description: string;
  edgeType: EdgesTypes;
  iterationCounts: number;
  timeStep: number;
  gamesCount: number;
  elements: any;
}
export const generateSheme = (
  template: ITemplate | null,
  setDescription: (text: string) => void,
  onChangeEdgesType: (type: EdgesTypes) => void,
  setGames: (count: number) => void,
  setIterations: (count: number) => void,
  setTime: (count: number) => void,
  generateNode: any,
  generateEdge: (
    id: number,
    source: number,
    target: number,
    value: number
  ) => void
) => {
  let type: EdgesTypes | null = EdgesTypes.DEFAULT;

  if (template) {
    if (template.edgeType === EdgesTypes.DEFAULT) type = EdgesTypes.DEFAULT;
    if (template.edgeType === EdgesTypes.SMOOTH_STEP)
      type = EdgesTypes.SMOOTH_STEP;
    if (template.edgeType === EdgesTypes.BEZIER) type = EdgesTypes.BEZIER;

    setDescription(template.description);
    onChangeEdgesType(type);
    setGames(template.gamesCount);
    setIterations(template.iterationCounts);
    setTime(template.timeStep);

    template.elements.map((el: any) => {
      el.element_type === "node"
        ? generateNode(
            el.id,
            el.struct,
            el.label,
            el.position.data.x,
            el.position.data.y
          )
        : "close";
    });

    template.elements.map((el: any) => {
      el.element_type === "edge"
        ? generateEdge(el.id, el.source_id, el.target_id, el.value)
        : "close";
    });
  }
  return "no correct data";
};
```


## app\services\parserCode.ts

```ts
const parseCodeToTemplate = (code: string) => {
  try {
    const parsedData = JSON.parse(code);

    const description = parsedData.description || "";
    const edgeType = parsedData.edge_type || "";
    const iterationCounts = parsedData.iteration_counts || 0;
    const timeStep = parsedData.time_step || 0;
    const gamesCount = parsedData.games_count || 0;
    const elements = parsedData.elements || [];

    return {
      description,
      edgeType,
      iterationCounts,
      timeStep,
      gamesCount,
      elements,
    };
  } catch (error) {
    console.error("Error parsing code:", error);
    return null;
  }
};

export { parseCodeToTemplate };
```


## app\services\parserToJson.ts

```ts
export const parserToJson = (
  description: string,
  currentType: string,
  iterations: number,
  games: number,
  time: number,
  getNodesJson: any,
  getEdgesJson: any
): string => {
  const nodesJson = getNodesJson().join(",\n    ");
  const edgesJson = getEdgesJson().join(",\n    ");

  return `{
  "description": "${description}",
  "edge_type": "${currentType.toLowerCase()}",
  "iteration_counts": ${iterations},
  "time_step": ${time},
  "games_count": ${games},
  "elements": [
    ${nodesJson},
    ${edgesJson}
    ]
}`;
};
```


## app\store\store.ts

```ts
import { createWithEqualityFn } from "zustand/traditional";
import {
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Connection,
} from "reactflow";
import { liveblocks } from "@liveblocks/zustand";
import type { WithLiveblocks } from "@liveblocks/zustand";
import { nanoid } from "nanoid/non-secure";

import { EdgesTypes, Graph, StructType } from "../types/structs";
import { markerEnd } from "@/utils/canvas";
import { client } from "@/liveblocks.config";
import {
  BoardState,
  BoardSavingStatus,
  PreviousState,
  BoardStateData,
} from "../types/history";

export type RFState = {
  graph: Graph;
  title: string;
  description: string | undefined;
  edgesType: string | undefined;
  currentVersion: number;
  updatedTime: number | null;
  savingStatus: BoardSavingStatus;
  nodes: Node[];
  edges: Edge[];
  previousState: PreviousState | null;
  isInitialized: boolean;
  initialize: (state: BoardState) => void;
  setPreviousState: (state: PreviousState) => void;
  onRestoreVersion: (stateData: BoardStateData) => void;
  onDeleteVersion: (stateData: BoardStateData) => void;
  setSavingStatus: (savingStatus: BoardSavingStatus) => void;
  addNode: (struct: StructType) => void;
  deleteNode: (id: string) => void;
  onNodesChange: OnNodesChange;
  setNodeName: (id: string, name: string) => void;
  setNodeLabel: (id: string, count: number) => void;
  onEdgesChange: OnEdgesChange;
  getEdgeTargetNode: (id: string) => void;
  setEdgeData: (id: string, data: number) => void;
  setEdgeAnimated: (isPlay: boolean) => void;
  onConnect: (connection: any) => void;
  getEdgeValues: (id: string) => {
    sourceStruct: any;
    sourceValue: any;
    targetValue: any;
  };
  generateNode: (
    id: number,
    struct: string,
    label: string,
    x: number,
    y: number
  ) => void;
  generateEdge: (
    id: number,
    source: number,
    target: number,
    value: number
  ) => void;
  getNodesJson: () => any;
  getEdgesJson: () => any;
  deleteAll: () => any;
};

const graph: Graph = {
  id: 1,
  countComponents: 1,
  owner: "mc_Valera",
  created: "01.01.2002",
  modified: "01.01.2002",
  title: "Graph",
  description: "",
};

const useStore = createWithEqualityFn<WithLiveblocks<RFState>>()(
  liveblocks(
    (set, get) => ({
      graph: graph,
      savingStatus: BoardSavingStatus.IDLE,
      updatedTime: null,
      currentVersion: 0,
      previousState: null,
      nodes: [],
      edges: [],
      title: "",
      description: "",
      edgesType: "Default",
      isInitialized: false,
      initialize: (state: BoardState) => {
        set({
          nodes: state.nodes,
          edges: state.edges,
          previousState: state,
          currentVersion: state.version,
          title: state.title,
          description: state.description,
          edgesType: state.edgesType,
          isInitialized: true,
        });
      },
      setPreviousState: (state: PreviousState) => {
        set({
          previousState: state,
          currentVersion: state.version,
          updatedTime: state.createdAt,
        });
      },
      onRestoreVersion: (stateData: BoardStateData) => {
        set({
          nodes: stateData.nodes,
          edges: stateData.edges,
        });
      },
      onDeleteVersion: (stateData: BoardStateData) => {
        set({
          nodes: stateData.nodes,
          edges: stateData.edges,
        });
      },
      setSavingStatus: (status: BoardSavingStatus) => {
        set({
          savingStatus: status,
        });
      },
      onNodesChange: (changes: NodeChange[]) => {
        set({
          nodes: applyNodeChanges(changes, get().nodes),
        });
      },
      onEdgesChange: (changes: EdgeChange[]) => {
        set({
          edges: applyEdgeChanges(changes, get().edges),
        });
      },
      onConnect: (connection: Connection) => {
        const newEdge = {
          ...connection,
          id: "id" + new Date(),
          type: "custom",
          animated: false,
          markerEnd: markerEnd,
          data: 1,
        };

        set({
          edges: addEdge(newEdge, get().edges),
        });
      },
      setEdgeData: (id: string, data: number) => {
        const edges = useStore.getState().edges;
        const edgeIndex = edges.findIndex((edge) => edge.id === id);

        if (edgeIndex !== -1) {
          const updatedEdge = {
            ...edges[edgeIndex],
            data: data,
          };
          const updatedEdges = [...edges];
          updatedEdges[edgeIndex] = updatedEdge;
          set({
            edges: updatedEdges,
          });
        }
      },
      deleteNode: (id: string) => {
        set((state) => ({
          nodes: state.nodes.filter((node) => node.id !== id),
          edges: state.edges.filter(
            (edge) => edge.source !== id && edge.target !== id
          ),
        }));
      },
      setEdgeAnimated: (isPlay: boolean) => {
        if (isPlay) {
          const edges = useStore.getState().edges.map((edge) => ({
            ...edge,
            animated: true,
            style: { stroke: "red" },
          }));
          set({
            edges: edges,
          });
        } else {
          const edges = useStore.getState().edges.map((edge) => ({
            ...edge,
            animated: false,
            style: { stroke: "black" },
          }));
          set({
            edges: edges,
          });
        }
      },
      getEdgeTargetNode: (id: string) => {
        const edges: Edge[] = useStore.getState().edges;
        const edge = edges.find((edge: Edge) => edge.id === id);
        return edge?.target;
      },
      getEdgeValues: (id: string) => {
        const edges: Edge[] = useStore.getState().edges;
        const edge = edges.find((edge: Edge) => edge.id === id);
        const nodes: Node[] = useStore.getState().nodes;

        const sourceNode = nodes.find((node) => node.id === edge?.source);
        const targetNode = nodes.find((node) => node.id === edge?.target);

        return {
          sourceStruct: sourceNode?.data.struct,
          sourceValue: sourceNode?.data.label || "0",
          targetValue: targetNode?.data.label || "0",
        };
      },
      setNodeLabel: (id: string, count: number) => {
        const nodes = useStore.getState().nodes;
        const nodeIndex = nodes.findIndex((node) => node.id === id);

        if (nodeIndex !== -1) {
          const updatedNodes = [...nodes];
          updatedNodes[nodeIndex] = {
            ...updatedNodes[nodeIndex],
            data: {
              ...updatedNodes[nodeIndex].data,
              label: count,
            },
          };

          set({
            nodes: updatedNodes,
          });
        }
      },
      setNodeName: (id: string, name: string) => {
        const nodes = useStore.getState().nodes;
        const nodeIndex = nodes.findIndex((node) => node.id === id);

        if (nodeIndex !== -1) {
          const updatedNodes = [...nodes];
          updatedNodes[nodeIndex] = {
            ...updatedNodes[nodeIndex],
            data: {
              ...updatedNodes[nodeIndex].data,
              name: name,
            },
          };

          set({
            nodes: updatedNodes,
          });
        }
      },

      addNode: (struct: StructType) => {
        let newNode;

        newNode = {
          id: nanoid(),
          type: struct.toLowerCase() + "Node",
          data: { label: "0", struct: struct, name: "" },
          position: {
            x: (Math.random() * window.innerWidth) / 2,
            y: (Math.random() * window.innerHeight) / 2,
          },
        };

        set({
          nodes: [...get().nodes, newNode],
        });
      },
      generateNode: (
        id: number,
        structString: string,
        label: string,
        x: number,
        y: number
      ) => {
        let struct = structString[0].toUpperCase() + structString.slice(1);
        let newNode;
        structString === "source"
          ? (newNode = {
              id: id.toString(),
              type: struct.toLowerCase() + "Node",
              data: { label: "0", struct: struct, name: label },
              position: {
                x: x ? x : (Math.random() * window.innerWidth) / 2 / 2,
                y: y ? y : (Math.random() * window.innerHeight) / 2 / 2,
              },
            })
          : structString === "end"
            ? (newNode = {
                id: id.toString(),
                type: struct.toLowerCase() + "Node",
                data: { label: "0", struct: struct, name: label },
                position: {
                  x: x
                    ? x
                    : (Math.random() * window.innerWidth) / 2 +
                      window.innerWidth / 2,
                  y: y
                    ? y
                    : (Math.random() * window.innerHeight) / 2 +
                      window.innerHeight / 2,
                },
              })
            : (newNode = {
                id: id.toString(),
                type: struct.toLowerCase() + "Node",
                data: { label: "0", struct: struct, name: label },
                position: {
                  x: x ? x : (Math.random() * window.innerWidth) / 2,
                  y: y ? y : (Math.random() * window.innerHeight) / 2,
                },
              });

        set({
          nodes: [...get().nodes, newNode],
        });
      },
      generateEdge(id: number, source: number, target: number, value: number) {
        const newEdge = {
          id: id.toString(),
          source: source.toString(),
          target: target.toString(),
          key: "id" + new Date(),
          type: "custom",
          animated: false,
          markerEnd: markerEnd,
          data: value,
        };
        set((state) => ({
          edges: [...get().edges, newEdge],
        }));
      },
      getNodesJson: () => {
        const arr = get().nodes.map((el) => {
          return `    {
          "id": "${el.id}",
          "element_type": "node",
          "type": "${el.type}",
          "struct": "${el.data.struct.toLowerCase()}",
          "label": "${el.data.name ? el.data.name.toLowerCase() : "null"}",
          "position": {
            "data": {
              "x": ${el.position.x},
              "y": ${el.position.y}
            }
          }
        }`;
        });
        return arr;
      },
      getEdgesJson: () => {
        const arr = get().edges.map((el) => {
          return `    {
          "id": "${el.id}",
          "element_type": "edge",
          "source_id": "${el.source}",
          "target_id": "${el.target}",
          "data": "${el?.data}"
        }`;
        });
        return arr;
      },
      deleteAll: () => {
        set((state) => ({
          edges: [],
          nodes: [],
        }));
      },
    }),
    {
      // Add Liveblocks client
      client,
      // presenceMapping: { cursor: true, selection: true },
      // Define the store properties that should be shared in real-time
      storageMapping: {
        nodes: true,
        edges: true,
      },
    }
  )
);

export default useStore;
```


## app\store\use-animate-scheme.tsx

```tsx
import { create } from "zustand";
import useStore from "./store";

interface IAnimateScheme {
  iterations: number;
  games: number;
  iterationsCount: number;
  gamesCount: number;
  isPlay: boolean;
  isReset: boolean;
  intervalId: any;
  time: number;
  resetNodes: () => void;
  setTime: (count: number) => void;
  setIterations: (count: number) => void;
  setGames: (count: number) => void;
  onPlay: () => void;
  onStop: () => void;
  onReset: () => void;
}

export const useAnimateScheme = create<IAnimateScheme>((set) => ({
  iterations: 1,
  time: 1,
  games: 1,
  isPlay: false,
  isReset: false,
  iterationsCount: 0,
  gamesCount: 0,
  intervalId: null,
  setTime: (count: number) => {
    set({ time: count });
  },
  setIterations: (count: number) => {
    set({
      iterations: count,
    });
  },
  setGames: (count: number) => {
    set({
      games: count,
    });
  },
  resetNodes: () => {
    const nodes = useStore.getState().nodes;
    const updatedNodes = nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        label: "0",
      },
    }));

    useStore.setState({
      nodes: updatedNodes,
    });
  },
  onPlay: () => {
    set((state) => {
      if (!state.isPlay && state.iterationsCount < state.iterations) {
        const newIntervalId = setInterval(() => {
          set((state) => {
            const newCount = state.iterationsCount + 1;

            if (state.iterationsCount === +state.iterations) {
              if (state.gamesCount + 1 === +state.games) {
                clearInterval(state.intervalId);
                return {
                  ...state,
                  isPlay: false,
                  intervalId: null,
                  isReset: true,
                };
              } else {
                return {
                  ...state,
                  iterationsCount: 0,
                  gamesCount: state.gamesCount + 1,
                };
              }
            }
            return { ...state, iterationsCount: newCount };
          });
        }, state.time * 1000);

        return {
          ...state,
          isPlay: true,
          intervalId: newIntervalId,
          isReset: false,
        };
      }
      return state;
    });
  },
  onStop: () => {
    set((state) => {
      if (state.intervalId) {
        clearInterval(state.intervalId);
        return { isPlay: false, intervalId: null };
      }
      return state;
    });
  },
  onReset: () =>
    set((state) => {
      clearInterval(state.intervalId);
      state.resetNodes();
      return {
        isPlay: false,
        intervalId: null,
        iterationsCount: 0,
        gamesCount: 0,
        isReset: true,
      };
    }),
}));
```


## app\store\use-custom-edge.tsx

```tsx
import { create } from "zustand";
import { EdgesTypes } from "@/app/types/structs";

interface ICustomEdge {
  error: string | null;
  currentEdgesType: string | EdgesTypes;
  onChangeEdgesType: (type: EdgesTypes) => void;
  setError: (error: string | null) => void;
  analytics: boolean;
  setAnalytics: (isShow: boolean) => void;
}

export const useChangeEdgeType = create<ICustomEdge>((set) => ({
  error: null,
  analytics: false,
  setAnalytics: (isShow: boolean) =>
    set({
      analytics: isShow,
    }),
  currentEdgesType: "Default",
  setError: (error: string | null) =>
    set({
      error: error,
    }),
  onChangeEdgesType: (type: EdgesTypes) =>
    set({
      currentEdgesType: type,
    }),
}));
```


## app\store\use-rename-modal.tsx

```tsx
import { create } from "zustand";

const defaultValues = { id: "", title: "" };

interface IRenameModal {
  isVisibleEditor: boolean;
  isVisibleBoard: boolean;
  isVisibleHistory: boolean;
  isOpen: boolean;
  initialValues: typeof defaultValues;
  setIsVisisble: () => void;
  setIsVisisbleBoard: () => void;
  setIsVisisbleHistory: () => void;
  onOpen: (id: string, title: string) => void;
  onClose: () => void;
}

export const useRenameModal = create<IRenameModal>((set) => ({
  isVisibleEditor: false,
  isVisibleBoard: false,
  isVisibleHistory: false,
  isOpen: false,
  setIsVisisble: () => {
    set((state) => ({
      isVisibleEditor: !state.isVisibleEditor,
    }));
  },
  setIsVisisbleBoard: () => {
    set((state) => ({
      isVisibleBoard: !state.isVisibleBoard,
    }));
  },
  setIsVisisbleHistory: () => {
    set((state) => ({
      isVisibleHistory: !state.isVisibleHistory,
    }));
  },
  onOpen: (id, title) =>
    set({
      isOpen: true,
      initialValues: { id, title },
    }),
  onClose: () =>
    set({
      isOpen: false,
      initialValues: defaultValues,
    }),
  initialValues: defaultValues,
}));
```


## app\store\useBoardInfo.tsx

```tsx
import { create } from "zustand";

interface IGenerateStore {
  description: string;
  setDescription: (text: string) => void;
}

export const useGenerate = create<IGenerateStore>((set) => ({
  description: "Тестовая доска для показа",
  setDescription: (text) => {
    set({
      description: text,
    });
  },
}));
```


## app\test\[boardId]\_components\_structs\nodeComponents\consumerNode.tsx

```tsx
"use client";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect } from "react";
import {
  Edge,
  Node,
  NodeResizer,
  useEdges,
  useNodeId,
  useNodes,
} from "reactflow";
import useStore from "@/app/store/store";
import { StructType } from "@/app/types/structs";
import { StyledNode } from "./styled-node";

interface DataProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
  };
  selected: boolean;
}

const ConsumerNode = ({
  data: { label, struct, name },
  selected,
}: DataProps) => {
  const { isPlay, onStop, onReset, time } = useAnimateScheme();
  const { setNodeLabel, getEdgeValues } = useStore();
  const nodeId = useNodeId();
  const edges = useEdges<any>();
  const nodes = useNodes<any>();

  useEffect(() => {
    let intervalId = null;
    if (nodeId === null) return;
    if (!isPlay) {
      setNodeLabel(nodeId, 0);
    } else {
      setNodeLabel(nodeId, 1);
      let sourceEdge: Edge<Number> = edges.find(
        (edge) => edge?.target === nodeId
      )!;
      // тут в sourceEdge.data хранится значение количество ресурсов
      let targetEdge: Edge<Number> = edges.find(
        (edge) => edge?.source === nodeId
      )!;

      // тут в targetEdge.data хранится значение количества млсекунд * 1000 - то что задержка

      let targetNodeId: Node<any> = nodes.find(
        (node) => node.id === targetEdge?.target
      )!;
      let initialData = +sourceEdge?.data! || 0;

      intervalId = setInterval(() => {
        // Увеличиваем значение sourceEdge.data каждую секунду на 1
        initialData += +sourceEdge?.data!;

        // Обновляем метку узла с новым значением sourceEdge.data
        setNodeLabel(targetNodeId?.id, +initialData);
      }, time * 1000); // Интервал в миллисекундах (1000 миллисекунд = 1 секунда)
    }
    return () => clearInterval(intervalId!);
  }, [isPlay, onStop, onReset]);

  return (
    <>
      <NodeResizer
        color="blue"
        isVisible={selected}
        minWidth={45}
        minHeight={45}
      />
      <StyledNode struct={struct} label={label} name={name} />
    </>
  );
};

export default memo(ConsumerNode);
```


## app\test\[boardId]\_components\_structs\nodeComponents\converterNode.tsx

```tsx
"use client";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect } from "react";
import { Edge, NodeResizer, useEdges, useNodeId, useNodes } from "reactflow";
import useStore from "@/app/store/store";
import { StructType } from "@/app/types/structs";
import { StyledNode } from "./styled-node";

interface DataProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
  };
  selected: boolean;
}

const ConverterNode = ({
  data: { label, struct, name },
  selected,
}: DataProps) => {
  const { isPlay, onStop, onReset, time } = useAnimateScheme();
  const { setNodeLabel, getEdgeValues } = useStore();
  const nodeId = useNodeId();
  const edges = useEdges<any>();
  const nodes = useNodes<any>();

  useEffect(() => {
    let intervalId = null;
    if (isPlay) {


      let newEdges: Edge[] = edges.filter((edge) => edge.target === nodeId)
      let nodeIds: string[] = newEdges.map((edge) => edge.source);

      if (nodeIds.length > 0) {
        nodeIds.forEach(nodeId => {
            let foundNode = nodes.find(node => node.id === nodeId);
            let edge = edges.find(edge => edge.source === foundNode?.id)
            if (foundNode) {
                if (+foundNode.data?.label > edge?.data) {
                    setNodeLabel(foundNode.id, foundNode.data?.label - edge?.data);
                }
            }
        });
    }

      const sumOfData = newEdges.reduce((accumulator, currentEdge) => {
        return accumulator + (+currentEdge.data || 0); 
      }, 0);
      intervalId = setInterval(() => {


        setNodeLabel(nodeId!, (parseInt(label) + sumOfData));
      }, time * 1000);
    }

    return () => clearInterval(intervalId!);

  }, [isPlay, onStop, onReset, label]);

  return (
    <>
      <NodeResizer
        color="blue"
        isVisible={selected}
        minWidth={45}
        minHeight={45}
      />
      <StyledNode struct={struct} label={label} name={name} />
    </>
  );
};

export default memo(ConverterNode);
```


## app\test\[boardId]\_components\_structs\nodeComponents\delayNode.tsx

```tsx
"use client";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect } from "react";
import {
  Edge,
  Node,
  NodeResizer,
  useEdges,
  useNodeId,
  useNodes,
} from "reactflow";
import useStore from "@/app/store/store";
import { StructType } from "@/app/types/structs";
import { StyledNode } from "./styled-node";

interface DataProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
  };
  selected: boolean;
}

const DelayNode = ({ data: { label, struct, name }, selected }: DataProps) => {
  const { isPlay, onStop, onReset, time } = useAnimateScheme();
  const { setNodeLabel, getEdgeValues } = useStore();
  const nodeId = useNodeId();
  const edges = useEdges<any>();
  const nodes = useNodes<any>();

  useEffect(() => {
    let intervalId = null;
    if (!isPlay) {
      setNodeLabel(nodeId!, 0);
    } else {
      setNodeLabel(nodeId!, 1);
      let sourceEdge: Edge<any> = edges.find((edge) => edge?.target === nodeId)!;
      // тут в sourceEdge.data хранится значение количество ресурсов
      let targetEdge: Edge<any> = edges.find((edge) => edge?.source === nodeId)!;

      // тут в targetEdge.data хранится значение количества млсекунд * 1000 - то что задержка

      let targetNodeId: Node<any> = nodes.find(
        (node) => node.id === targetEdge?.target
      )!;
      let initialData = +sourceEdge?.data || 0;

      intervalId = setInterval(() => {
        // Увеличиваем значение sourceEdge.data каждую секунду на 1
        initialData += +sourceEdge?.data;

        // Обновляем метку узла с новым значением sourceEdge.data
        setNodeLabel(targetNodeId?.id, +initialData);
      }, time * 1000); // Интервал в миллисекундах (1000 миллисекунд = 1 секунда)
    }
    return () => clearInterval(intervalId!);
  }, [isPlay, onStop, onReset]);

  return (
    <>
      <NodeResizer
        color="blue"
        isVisible={selected}
        minWidth={45}
        minHeight={45}
      />
      <StyledNode struct={struct} label={label} name={name} />
    </>
  );
};

export default memo(DelayNode);
```


## app\test\[boardId]\_components\_structs\nodeComponents\endNode.tsx

```tsx
"use client";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect } from "react";
import {
  Edge,
  Node,
  NodeResizer,
  useEdges,
  useNodeId,
  useNodes,
} from "reactflow";
import useStore from "@/app/store/store";
import { StructType } from "@/app/types/structs";
import { StyledNode } from "./styled-node";

interface DataProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
  };
  selected: boolean;
}

const EndNode = ({ data: { label, struct, name }, selected }: DataProps) => {
  const { isPlay, onStop, onReset, time } = useAnimateScheme();
  const { setNodeLabel, getEdgeValues } = useStore();
  const nodeId = useNodeId();
  const edges = useEdges<any>();
  const nodes = useNodes<any>();

  useEffect(() => {
    let intervalId = null;
    if (!isPlay) {
      setNodeLabel(nodeId!, 0);
    } else {
      setNodeLabel(nodeId!, 1);
      let sourceEdge: Edge<any> = edges.find((edge) => edge?.target === nodeId)!;
      // тут в sourceEdge.data хранится значение количество ресурсов
      let targetEdge: Edge<any> = edges.find((edge) => edge?.source === nodeId)!;

      // тут в targetEdge.data хранится значение количества млсекунд * 1000 - то что задержка

      let targetNodeId: Node<any> = nodes.find(
        (node) => node.id === targetEdge?.target
      )!;
      let initialData = +sourceEdge?.data || 0;

      intervalId = setInterval(() => {
        // Увеличиваем значение sourceEdge.data каждую секунду на 1
        initialData += +sourceEdge?.data;

        // Обновляем метку узла с новым значением sourceEdge.data
        setNodeLabel(targetNodeId?.id, +initialData);
      }, time * 1000); // Интервал в миллисекундах (1000 миллисекунд = 1 секунда)
    }
    return () => clearInterval(intervalId!);
  }, [isPlay, onStop, onReset]);

  return (
    <>
      <NodeResizer
        color="blue"
        isVisible={selected}
        minWidth={45}
        minHeight={45}
      />
      <StyledNode struct={struct} label={label} name={name} />
    </>
  );
};

export default memo(EndNode);
```


## app\test\[boardId]\_components\_structs\nodeComponents\entityNode.tsx

```tsx
"use client";
import { memo } from "react";
import { NodeResizer } from "reactflow";
import { StructType } from "@/app/types/structs";
import { StyledNode } from "./styled-node";

interface DataProps {
  data: {
    label: string;
    struct: StructType; // Предполагается добавление 'Entity' в Enum
    name?: string;
    properties?: string[];
  };
  selected: boolean;
}

const EntityNode = ({ data: { label, struct, name }, selected }: DataProps) => {
  return (
    <>
      <NodeResizer color="#4A90E2" isVisible={selected} minWidth={60} minHeight={60} />
      {/* Стилизация через StyledNode с иконкой Box или Database */}
      <StyledNode struct={struct} label={label} name={name} />
    </>
  );
};

export default memo(EntityNode);
```


## app\test\[boardId]\_components\_structs\nodeComponents\gateNode.tsx

```tsx
"use client";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect } from "react";
import {
  Edge,
  Node,
  NodeResizer,
  useEdges,
  useNodeId,
  useNodes,
} from "reactflow";
import useStore from "@/app/store/store";
import { StructType } from "@/app/types/structs";
import { StyledNode } from "./styled-node";

interface DataProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
  };
  selected: boolean;
}

const GateNode = ({ data: { label, struct, name }, selected }: DataProps) => {
  const { isPlay, onStop, onReset, time } = useAnimateScheme();
  const { setNodeLabel, getEdgeValues } = useStore();
  const nodeId = useNodeId();
  const edges = useEdges<any>();
  const nodes = useNodes<any>();

  useEffect(() => {
    let intervalId = null;
    if (!isPlay) {
      setNodeLabel(nodeId!, 0);
    } else {
      setNodeLabel(nodeId!, 1);

      let sourceEdge: Edge<any> = edges.find(
        (edge) => edge?.target === nodeId
      )!;
      // тут в sourceEdge.data хранится значение количество ресурсов
      let targetEdge: Edge<any> = edges.find(
        (edge) => edge?.source === nodeId
      )!;

      // тут в targetEdge.data хранится значение количества млсекунд * 1000 - то что задержка
      let targetNodeId: Node<any> = nodes.find(
        (node) => node.id === targetEdge?.target
      )!;
      let initialData = +sourceEdge?.data || 0;

      intervalId = setInterval(() => {
        // Увеличиваем значение sourceEdge.data каждую секунду на 1
        initialData += +sourceEdge?.data;

        // Обновляем метку узла с новым значением sourceEdge.data
        setNodeLabel(targetNodeId?.id, +initialData);
      }, time * 1000); // Интервал в миллисекундах (1000 миллисекунд = 1 секунда)
    }
    return () => clearInterval(intervalId!);
  }, [isPlay, onStop, onReset]);

  return (
    <>
      <NodeResizer
        color="blue"
        isVisible={selected}
        minWidth={45}
        minHeight={45}
      />
      <StyledNode struct={struct} label={label} name={name} />
    </>
  );
};

export default memo(GateNode);
```


## app\test\[boardId]\_components\_structs\nodeComponents\nodeStyle.css

```css
.delayNode{
    border: 2px solid red;
    position: relative;
    height: 50px;
    width: 50px;
    overflow: hidden;
    border-radius: 5px;
    display: flex;
    background: white;
    justify-content: center;
    align-items: center;
    font-weight: bold;
}

.consumerNode{
    border: 2px solid blue;
    position: relative;
    height: 50px;
    width: 50px;
    overflow: hidden;
    border-radius: 100%;
    display: flex;
    background: white;
    justify-content: center;
    align-items: center;
    font-weight: bold;
}

.converterNode{
    border: 2px solid blue;
    position: relative;
    height: 50px;
    width: 50px;
    overflow: hidden;
    border-radius: 100%;
    display: flex;
    background: white;
    justify-content: center;
    align-items: center;
    font-weight: bold;
}

.endNode{
    border: 2px solid black;
    position: relative;
    height: 50px;
    width: 50px;
    overflow: hidden;
    border-radius: 5px;
    display: flex;
    background: white;
    justify-content: center;
    align-items: center;
    font-weight: bold;
}

.gateNode{
    border: 2px solid blue;
    position: relative;
    height: 50px;
    width: 50px;
    overflow: hidden;
    border-radius: 100%;
    display: flex;
    background: white;
    justify-content: center;
    align-items: center;
    font-weight: bold;
}

.poolNode{
    border: 2px solid blue;
    position: relative;
    height: 50px;
    width: 50px;
    overflow: hidden;
    border-radius: 100%;
    display: flex;
    background: white;
    justify-content: center;
    align-items: center;
    font-weight: bold;
}

.sourceNode{
    border: 2px solid greenyellow;
    position: relative;
    height: 50px;
    width: 50px;
    overflow: hidden;
    border-radius: 100%;
    display: flex;
    background: white;
    justify-content: center;
    align-items: center;
    font-weight: bold;
}

.randomNode{
    border: 2px solid red;
    position: relative;
    height: 50px;
    width: 50px;
    overflow: hidden;
    border-radius: 5px;
    display: flex;
    background: white;
    justify-content: center;
    align-items: center;
    font-weight: bold;
}
```


## app\test\[boardId]\_components\_structs\nodeComponents\poolNode.tsx

```tsx
"use client";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect } from "react";
import {
  Edge,
  Node,
  NodeResizer,
  useEdges,
  useNodeId,
  useNodes,
} from "reactflow";
import useStore from "@/app/store/store";
import { StructType } from "@/app/types/structs";
import { StyledNode } from "./styled-node";

interface DataProps {
  id: string;
  data: {
    label: string;
    struct: StructType;
    name?: string | undefined;
  };
  selected: boolean;
}

const PoolNode = ({
  data: { label, struct, name },
  selected,
  id,
}: DataProps) => {
  const { isPlay, onStop, onReset, time, gamesCount, resetNodes } =
    useAnimateScheme();

  const { setNodeLabel, getEdgeValues } = useStore();
  const nodeId = useNodeId();
  const edges = useEdges<any>();
  const nodes = useNodes<any>();

  useEffect(() => {
    let intervalId = null;
    if (isPlay) {
      let newEdges = edges.filter((edge) => edge.target === nodeId);
      const sumOfData = newEdges.reduce((accumulator, currentEdge) => {
        return accumulator + (+currentEdge.data || 0);
      }, 0);
      intervalId = setInterval(() => {
        setNodeLabel(nodeId!, parseInt(label) + sumOfData);
      }, time * 1000);
    }
    return () => clearInterval(intervalId!);
  }, [isPlay, onStop, onReset, label, gamesCount]);

  return (
    <>
      <NodeResizer
        color="blue"
        isVisible={selected}
        minWidth={45}
        minHeight={45}
      />

      <StyledNode struct={struct} label={label} name={name} />
    </>
  );
};

export default memo(PoolNode);
```


## app\test\[boardId]\_components\_structs\nodeComponents\randomNode.tsx

```tsx
"use client";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect } from "react";
import {
  Edge,
  Node,
  NodeResizer,
  useEdges,
  useNodeId,
  useNodes,
} from "reactflow";
import useStore from "@/app/store/store";
import { StructType } from "@/app/types/structs";
import { StyledNode } from "./styled-node";

interface DataProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
  };
  selected: boolean;
}

const RandomNode = ({ data: { label, struct, name }, selected }: DataProps) => {
  const { isPlay, onStop, onReset, time } = useAnimateScheme();
  const { setNodeLabel, getEdgeValues } = useStore();
  const nodeId = useNodeId();
  const edges = useEdges<any>();
  const nodes = useNodes<any>();



  useEffect(() => {
    let intervalId = null;
    if (isPlay) {
      const initialValue = label || null
      let newEdges: Edge[] = edges.filter((edge) => edge.source === nodeId)
      let nodeIds: string[] = newEdges.map(edge => edge.target)      //идишники нод
      
    //   intervalId = setInterval(() => {

    //     setNodeLabel(nodeId, (parseInt(label) + sumOfData).toString());
    //   }, time * 1000);

    
    }
    return () => clearInterval(intervalId!);
  }, [isPlay, onStop, onReset, label]);

  return (
    <>
      <NodeResizer
        color="blue"
        isVisible={selected}
        minWidth={45}
        minHeight={45}
      />
      <StyledNode struct={struct} label={label} name={name} />
    </>
  );
};

export default memo(RandomNode);
```


## app\test\[boardId]\_components\_structs\nodeComponents\sourceNode.tsx

```tsx
"use client";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect } from "react";
import { Edge, NodeResizer, useEdges, useNodeId, useNodes } from "reactflow";
import useStore from "@/app/store/store";
import { StructType } from "@/app/types/structs";
import { StyledNode } from "./styled-node";

interface DataProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
  };
  selected: boolean;
}

const SourceNode = ({ data: { label, struct, name }, selected }: DataProps) => {
  const { isPlay, onStop, onReset, time } = useAnimateScheme();
  const { setNodeLabel, getEdgeValues } = useStore();
  const nodeId = useNodeId();
  const edges = useEdges();
  const nodes = useNodes();

  useEffect(() => {
    let intervalIds: NodeJS.Timeout[] = [];

    if (isPlay && nodeId) {
      let targetEdges: Edge[] = edges.filter((edge) => edge?.source === nodeId);
      targetEdges.forEach((edge) => {
        const targetNode = nodes.find((node) => node.id === edge.target);
        if (!targetNode) return;

        let initialData = 0;

        const intervalId = setInterval(() => {
          initialData += +edge.data;
          setNodeLabel(targetNode?.id!, +initialData);
        }, time * 1000);

        intervalIds.push(intervalId);
      });
    }
    return () => {
      intervalIds.forEach((intervalId) => clearInterval(intervalId));
    };
  }, [isPlay, onStop, onReset, edges, nodeId, nodes, time, setNodeLabel]);

  return (
    <>
      <NodeResizer
        color="blue"
        isVisible={selected}
        minWidth={45}
        minHeight={45}
      />
      <StyledNode struct={struct} label={label} name={name} />
    </>
  );
};

export default memo(SourceNode);
```


## app\test\[boardId]\_components\_structs\nodeComponents\styled-node.tsx

```tsx
"use client";
import {
  ArrowLeftRight,
  Recycle,
  Dices,
  Hourglass,
  Play,
  CheckCheck,
  LucideIcon,
  Minus,
} from "lucide-react";
import "./nodeStyle.css";
import { StructType } from "@/app/types/structs";
import { Handle, Position, useNodeId } from "reactflow";
import { useState } from "react";
import useStore from "@/app/store/store";

interface ITestNodeProps {
  struct: StructType;
  label: string;
  name?: string;
}

type StructStyles = {
  [key in StructType]: string;
};

interface StructIcons {
  [key: string]: LucideIcon;
}

const styleNode: StructStyles = {
  Consumer: "consumerNode",
  Converter: "converterNode",
  Delay: "delayNode",
  End: "endNode",
  Gate: "gateNode",
  Pool: "poolNode",
  Random: "randomNode",
  Source: "sourceNode",
};

const styleNodeIcon: any = {
  Source: <Play />,
  Converter: <Recycle />,
  Consumer: <Minus />,
  Delay: <Hourglass />,
  Gate: <ArrowLeftRight />,
  Random: <Dices />,
  End: <CheckCheck />,
};

export const StyledNode = ({ struct, label, name }: ITestNodeProps) => {
  const { setNodeName } = useStore();
  const nodeId = useNodeId();

  const [value, setValue] = useState(name);
  const onChange = (event: any) => {
    setValue(event.target.value);
    setNodeName(nodeId!, event.target.value);
  };

  return (
    <div>
      {struct !== StructType.Source && (
        <Handle type={"target"} position={Position.Left} />
      )}
      <div className={styleNode[struct]}>
        {struct in styleNodeIcon ? styleNodeIcon[struct] : label}
        {/* {label} */}
      </div>
      {struct !== StructType.End && (
        <Handle type="source" position={Position.Right} />
      )}
      <div className="h-full w-full flex justify-center">
        <input
          className="bg-transparent w-[50px] border-none text-xs font-bold text-center"
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};
```


## app\test\[boardId]\_components\_structs\custom-edge.tsx

```tsx
import { useChangeEdgeType } from "@/app/store/use-custom-edge";
import useStore from "@/app/store/store";
import React, { useEffect, useState } from "react";

import {
  BaseEdge,
  BezierEdge,
  EdgeLabelRenderer,
  EdgeProps,
  StepEdge,
  getBezierPath,
  getStraightPath,
} from "reactflow";

export default function CustomEdge(props: EdgeProps) {
  const {
    error,
    setError,
    currentEdgesType: currentType,
  } = useChangeEdgeType();
  const [localError, setLocalError] = useState<string | null>(null);

  const { setEdgeData } = useStore();
  const {
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    id,
    data: initalValue,
  } = props;

  const [inputValue, setInputValue] = useState<number>(initalValue ?? 1);
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const [basePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const onChange = (event: any) => {
    const newValue = event.target.value;

    if (typeof +newValue !== "number" || isNaN(+newValue)) {
      setLocalError("Must be a numeric");
      setError("error");
      setInputValue(newValue);
    } else {
      setLocalError(null);
      setError(null);
      setInputValue(newValue);
      setEdgeData(id, +newValue);
    }
  };

  useEffect(() => {
    if (typeof +inputValue !== "number" || isNaN(+inputValue)) {
      setLocalError("Must be a numeric");
      setError("error");
    } else {
      setLocalError(null);
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initalValue]);

  return (
    <>
      {currentType === "SmoothStep" && <StepEdge {...props} />}
      {currentType === "Default" && <BaseEdge path={basePath} {...props} />}
      {currentType == "Bezier" && <BezierEdge {...props} />}
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: "all",
          }}
          className="nodrag nopan"
        >
          <input
            className={
              localError
                ? "border-2 border-red-500 w-16 h-7 text-center rounded-sm"
                : "w-16 h-7 text-center rounded-sm"
            }
            value={inputValue}
            onChange={onChange}
          />
          {localError && (
            <p className="text-center text-2 font-bold text-red-500">
              {localError}
            </p>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
```


## app\test\[boardId]\_components\_structs\custom-node.tsx

```tsx
"use client";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect } from "react";
import { NodeResizer, useEdges, useNodeId } from "reactflow";
import useStore from "@/app/store/store";
import { StyledNode } from "./nodeComponents/styled-node";
import { StructType } from "@/app/types/structs";

interface DataProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
  };
  selected: boolean;
}

const CustomNode = ({ data: { label, struct, name }, selected }: DataProps) => {
  const { isPlay, time, onReset, isReset } = useAnimateScheme();
  const { setNodeLabel, getEdgeValues } = useStore();
  const nodeId = useNodeId();
  const edges = useEdges<any>();

  useEffect(() => {
    let newEdges = edges.filter((edge) => edge.target === nodeId);

    let { sourceStruct, sourceValue, targetValue } = getEdgeValues(
      newEdges[0]?.id
    );
  
    const sumOfData = newEdges.reduce((accumulator, currentEdge) => {
      return accumulator + (+currentEdge.data! || 0);
    }, 0);

    let intervalId: any;
    const intervalCallback = () => {
      setNodeLabel(nodeId!, parseInt(label) + sumOfData);
    };

    if (isPlay) {
      intervalId = setInterval(intervalCallback, time * 1000);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [label, nodeId, isPlay, onReset, setNodeLabel, edges]);

  return (
    <>
      <NodeResizer
        color="blue"
        isVisible={selected}
        minWidth={45}
        minHeight={45}
      />
      <StyledNode struct={struct} label={label} name={name} />
    </>
  );
};

export default memo(CustomNode);
```


## app\test\[boardId]\_components\BoardInfoModal\BoardInfoModal.module.scss

```scss
.board {
  background: white;
  height: 800px;
  width: 300px;
  z-index: 1000;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.board h1 {
  font-size: 16px !important;
  padding-bottom: 10px;
}

.hint_btn {
  background: transparent;
  font-size: 20px !important;
  font-weight: 700;
  color: black;
  padding: 0;
}

.content {
  width: 100%;
  height: 100%;
  position: relative;
}
.content__items {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.date_info {
  position: absolute;
  bottom: 1rem;
  > h2 {
    padding-bottom: 0.5rem;
  }
}

.description {
  display: flex;
  flex-direction: column;
  > textarea {
    height: 270px;
    padding: 1rem 0.5rem;
    background: rgb(233, 238, 252);
    border-radius: 10px;
    border: 1px dashed white;
    margin-bottom: 15px;
  }
}
.saveButton {
  padding: 5px 10px;
  background-color: #000000; /* Красный цвет */
  color: #fff; /* Белый цвет текста */
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.closeButton {
  top: 0;
  right: 0;
  padding: 5px 10px;
  background-color: #000000; /* Красный цвет */
  color: #fff; /* Белый цвет текста */
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.closeButton:hover {
  background-color: #cc0000; /* Темно-красный цвет при наведении */
}
```


## app\test\[boardId]\_components\BoardInfoModal\BoardInfoModal.tsx

```tsx
"use client";

import { useCallback, useState } from "react";
import { useQuery } from "convex/react";

import { useRenameModal } from "@/app/store/use-rename-modal";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useApiMutation } from "@/app/hooks/use-api-mutation";
import { useChangeEdgeType } from "@/app/store/use-custom-edge";
import useStore from "@/app/store/store";
import { Participants } from "@/app/board/[boardId]/_components/participants";
import { EdgeTypePanel } from "../panels/EdgeTypePanel";
import { BoardTitle } from "./BoardTitle";

import styles from "./BoardInfoModal.module.scss";

interface IBoardInfoModalProps {
  boardId: string;
  handleSaveVersion: () => void;
}

const BoardInfoModal = ({
  boardId,
  handleSaveVersion,
}: IBoardInfoModalProps) => {
  // const [description, setDescription] = useState("Тестовая доска для показа");
  const boardData = useQuery(api.board.get, {
    id: boardId as Id<"boards">,
  });
  const { title, description, edgesType } = useStore.getState();

  const { mutate: updateMetaInfo, pending: updateMetaInfoPending } =
    useApiMutation(api.board.updateMetaInfo);

  const { currentEdgesType } = useChangeEdgeType();
  // const [boardTitle, setBoardTitle] = useState(boardData?.title);
  const [boardDescription, setBoardDescription] = useState(description || "");

  const { setIsVisisbleBoard } = useRenameModal();

  const handleDescriptionChange = (event: any) => {
    setBoardDescription(event.target.value);
  };

  const handleSave = useCallback(async () => {
    useStore.setState({
      // title: boardData?.title,
      description: boardDescription,
      edgesType: currentEdgesType,
    });

    await updateMetaInfo({
      id: boardData?._id,
      title: boardData?.title,
      description: boardDescription,
      edgesType: currentEdgesType,
    })
      .then(() => {
        handleSaveVersion();
      })
      .catch((e) => {
        console.log(e);
      });
  }, [
    boardData?._id,
    boardData?.title,
    boardDescription,
    currentEdgesType,
    handleSaveVersion,
    updateMetaInfo,
  ]);

  return (
    <div className={styles.board}>
      <div className={styles.content}>
        <div className={styles.content__items}>
          <div className={styles.header}>
            <BoardTitle boardId={boardId} />
            <button className={styles.closeButton} onClick={setIsVisisbleBoard}>
              &#x2716;
            </button>
          </div>

          <div>
            <h1>
              <strong>Owner:</strong> {boardData?.authorName}
            </h1>
            <h1>
              <strong>Participants:</strong>
            </h1>
            <Participants />
          </div>
          <div className={styles.description}>
            <h1>
              <strong>Description:</strong>
            </h1>
            <textarea
              value={boardDescription}
              onChange={handleDescriptionChange}
              className={styles.description}
            />
            <button
              className={styles.saveButton}
              onClick={handleSave}
              disabled={updateMetaInfoPending}
            >
              Save
            </button>
          </div>
          <div>
            <h1>
              <strong>Connection type:</strong>
            </h1>
            <EdgeTypePanel />
          </div>

          <div className={styles.date_info}>
            <h2>
              <strong>Created: </strong>27.10.2024{" "}
            </h2>
            <h2>
              <strong>Updated: </strong>27.10.2024{" "}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardInfoModal;
```


## app\test\[boardId]\_components\BoardInfoModal\BoardTitle.tsx

```tsx
"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { Poppins } from "next/font/google";

import { cn } from "@/utils/canvas";
import { Hint } from "@/components/hint";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";
import { useRenameModal } from "@/app/store/use-rename-modal";
import styles from "./BoardInfoModal.module.scss";

interface InfoProps {
  boardId: string;
}

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

const TabSeparator = () => {
  return <div className="text-neutral-300 px-1.5">|</div>;
};

export const BoardTitle = ({ boardId }: InfoProps) => {
  const { onOpen } = useRenameModal();

  const data = useQuery(api.board.get, {
    id: boardId as Id<"boards">,
  });

  // if (!data) return <div>No info</div>;

  return (
    <div>
      <Hint label="Edit title" side="bottom" sideOffset={10}>
        <Button
          className={styles.hint_btn}
          onClick={() => onOpen(data?._id as string, data?.title || "")}
        >
          <h2>{data?.title}</h2>
        </Button>
      </Hint>
    </div>
  );
};
```


## app\test\[boardId]\_components\editor\editor.module.scss

```scss
.editor_btn {
  background: rgb(24, 24, 24);
  width: 450px;
  display: flex;
  color: white;
  justify-content: space-between;
}
.generate {
  margin: 20px;
  width: 100%;
}
.reset {
  margin: 20px;
  width: 100%;
}
```


## app\test\[boardId]\_components\editor\editorCoder.tsx

```tsx
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
```


## app\test\[boardId]\_components\HistoryModal\CollapsibleGroup\CollapsibleGroup.module.scss

```scss
.group {
  margin-bottom: 1rem;

  &Header {
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;

    color: #5f6368;
    font-size: 14px;
    padding: 8px 0;
    border-bottom: 1px solid #e0e0e0;
    margin-bottom: 12px;

    &:hover {
      background: #f1f3f5;
    }
  }

  &Content {
    padding: 0.5rem;
  }
}

.toggleIcon {
}
```


## app\test\[boardId]\_components\HistoryModal\CollapsibleGroup\CollapsibleGroup.tsx

```tsx
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
```


## app\test\[boardId]\_components\HistoryModal\CollapsibleGroup\index.ts

```ts
export { CollapsibleGroup } from "./CollapsibleGroup";
```


## app\test\[boardId]\_components\HistoryModal\HistoryItem\HistoryItem.module.scss

```scss
.versionItem {
  position: relative;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: background 0.1s;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 8px;
  border: 1px solid #e0e0e0;

  &:hover {
    background: #f8f9fa;
  }

  &.selected {
    border-color: #1971c2;
    background-color: #f8f9fa;
  }

  &Header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 4px;
  }

  &Meta {
    display: flex;
    gap: 0.5rem;
    color: #868e96;
    font-size: 0.875rem;

    &Time {
      font-size: 14px;
      color: #202124;
    }
  }

  &Content {
    display: flex;
    flex-direction: column;

    &Message {
      font-size: 14px;
      color: #5f6368;
      margin-top: 8px;
      font-style: italic;
      padding-left: 6px;
    }

    &Colabarator {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #5f6368;
      padding-left: 8px;
    }
  }

  &Actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 16px;
  }
}

.swatch {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #26a69a;
}
```


## app\test\[boardId]\_components\HistoryModal\HistoryItem\HistoryItem.tsx

```tsx
import { FC, useCallback, useState } from "react";
import { useConvex, useMutation } from "convex/react";
import { toast } from "sonner";

import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/app/hooks/use-api-mutation";
import { Button } from "@/components/ui/button";
import { useRestoreVersionHandler } from "@/app/hooks/useRestoreVersionHandler";
import { EditableText } from "../../ui";
import styles from "./HistoryItem.module.scss";
import useStore from "@/app/store/store";

type THistoryItemProps = {
  boardId: string;
  version: Doc<"boardsHistory">;
  isSelected: boolean;
  onClick: (versionId: Id<"boardsHistory">) => void;
  onSaveRestoredVersion: (
    isRestore?: boolean,
    restoredVersionTime?: number,
    restoredVersionMessage?: string
  ) => void;
};

export const HistoryItem: FC<THistoryItemProps> = ({
  boardId,
  version,
  isSelected: isCurrent,
  onClick,
  onSaveRestoredVersion,
}) => {
  const convex = useConvex();
  const { onDeleteVersion, setPreviousState } = useStore();

  const { mutate: updateVersionMessage, pending: isVersionMessageUpdating } =
    useApiMutation(api.boardsHistory.updateVersionMessage);
  const { handleRestore } = useRestoreVersionHandler({
    boardId: boardId as Id<"boards">,
    onSaveRestoredVersion,
  });
  const deleteVersion = useMutation(api.boardsHistory.deleteVersion);

  const [isHovered, setIsHovered] = useState(false);

  const handleUpdateHistoryItemMessage = useCallback(
    async (versionId: Id<"boardsHistory">, message: string) => {
      await updateVersionMessage({ id: versionId, message })
        .then(() => {
          toast.success(`Версия успешно переименована`);
        })
        .catch(() => toast.error("Ошибка при переименовании версии"));
    },
    []
  );

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (isCurrent) {
        onClick(version._id);
      }

      await deleteVersion({ versionId: version._id });

      const reinitState = await convex.query(api.board.loadBoardState, {
        boardId: boardId as Id<"boards">,
      });

      await onDeleteVersion(reinitState);
      await setPreviousState({
        nodes: reinitState.nodes,
        edges: reinitState.edges,
        version: reinitState.version,
        createdAt: reinitState._creationTime,
      });

      toast.success("Version deleted");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div
      className={`${styles.versionItem} ${isCurrent ? styles.selected : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(version._id)}
    >
      <div className={styles.versionItemMeta}>
        <span className="version-type">
          {version.type === "snapshot" ? "Snapshot" : "Patch"}
        </span>
        <span className={styles.versionItemMetaTime}>
          {new Date(version._creationTime).toLocaleDateString()}
        </span>
      </div>

      <div className={styles.versionItemContent}>
        <div className={styles.versionItemHeader}>
          <EditableText
            initialValue={
              version.message ||
              new Date(version._creationTime).toLocaleTimeString()
            }
            onBlur={(message: string) => {
              handleUpdateHistoryItemMessage(version._id, message);
            }}
          />
        </div>
        <div className={styles.versionItemContentColabarator}>
          <div className={styles.swatch} />
          <span>{version.authorName || version.authorId}</span>
        </div>
        {version.restoreByTime && (
          <div
            className={styles.versionItemContentMessage}
          >{`Востановлена версия от ${new Date(version.restoreByTime).toLocaleTimeString()}`}</div>
        )}
      </div>

      {isHovered && (
        <div className={styles.versionItemActions}>
          {isCurrent && (
            <Button
              variant="default"
              size="sm"
              onClick={() => handleRestore(version.version)}
            >
              Восстановить
            </Button>
          )}
          {version.version !== 0 && (
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              Удалить
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
```


## app\test\[boardId]\_components\HistoryModal\HistoryItem\index.ts

```ts
export { HistoryItem } from "./HistoryItem";
```


## app\test\[boardId]\_components\HistoryModal\datepicker.css

```css

```


## app\test\[boardId]\_components\HistoryModal\HistoryModal.module.scss

```scss
.historySidebar {
  background: white;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  height: 100vh;
  width: 432px;
  z-index: 1000;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.content {
  width: 100%;
  height: 100%;
  position: relative;
  overflow-y: auto;
  padding-right: 16px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.title {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
}

.revisionsList {
  flex: 1;
  overflow-y: auto;
}

.switch {
  width: 42px;
  height: 25px;
  background-color: #4e4c4cb3;
  border-radius: 9999px;
  position: relative;
  box-shadow: 0 2px 10px #00000080;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  &:focus {
    // box-shadow: 0 0 0 2px black;
  }

  &[data-state="checked"] {
    background-color: rgb(61, 175, 72);
  }

  &Wrapper {
    display: flex;
    align-items: center;
    margin: 16px 0px;
  }

  &Thumb {
    display: block;
    width: 21px;
    height: 21px;
    background-color: white;
    border-radius: 9999px;
    box-shadow: 0 2px 2px #00000080;
    transition: transform 100ms;
    transform: translateX(2px);
    will-change: transform;
    &[data-state="checked"] {
      transform: translateX(19px);
    }
  }

  &Label {
    padding-right: 16px;
    font-size: 16px;
    line-height: 1;
    user-select: none;
  }
}

.searchInput {
  margin-bottom: 16px;
  border-color: hsl(218deg 34.85% 74.85%);
  outline: none;

  &:focus-visible {
    box-shadow: none;
    border-color: #3498db;
  }
}

.datePickerLabel {
  font-size: 16px;
  line-height: 1;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  padding-bottom: 8px;
}

.datePickerInput {
  & input {
    border: 1px solid hsl(218deg 34.85% 74.85%);
    border-radius: calc(0.5rem - 2px);
    padding: 0.5rem 0.75rem;
    padding-left: 32px;
    font-size: 0.875rem;
    line-height: 1.25rem;

    &:focus-visible {
      border-color: #3498db;
      outline: none;
    }
  }

  & button {
    font-size: 13px;
  }

  & svg {
    padding-top: 10px !important;
  }
}

.dateGroup {
  color: #5f6368;
  font-size: 14px;
  padding: 8px 0;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 12px;
}

.tile {
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 8px;
  border: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  cursor: pointer;

  &.selected {
    border-color: #1a73e8;
    background-color: #f8f9fa;
  }
}

.tileHeader {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
}

.time {
  font-size: 14px;
  color: #202124;
}

.restoreButton {
  margin-left: auto;
  background: none;
  border: none;
  color: #1a73e8;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  margin-top: 4px;
  align-self: flex-end;

  &:hover {
    background: #e8f0fe;
  }
}

.collaborator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #5f6368;
  padding-left: 8px;
}

.swatch {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #26a69a;
}

.message {
  font-size: 14px;
  color: #5f6368;
  margin-top: 8px;
  font-style: italic;
  padding-left: 6px;
}

.sortType {
  cursor: pointer;
  margin-left: auto;
}

.spinnerWrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding-block: 16px;
}

// SCSS
.spinner {
  $size: 50px;
  $color: #3498db;
  $thickness: 4px;
  $animation-duration: 1s;

  display: inline-block;
  margin-left: auto;
  margin-right: auto;
  align-self: center;
  width: $size;
  height: $size;
  border: $thickness solid rgba($color, 0.2);
  border-radius: 50%;
  border-top-color: $color;
  animation: spin $animation-duration ease-in-out infinite;
  -webkit-animation: spin $animation-duration ease-in-out infinite;
  position: relative;

  // Вариант с дополнительными градиентами
  &::after {
    content: "";
    position: absolute;
    top: -$thickness;
    left: -$thickness;
    right: -$thickness;
    bottom: -$thickness;
    border-radius: 50%;
    border: $thickness solid transparent;
    border-top-color: rgba($color, 0.5);
    animation: spin ($animation-duration * 1.5) ease-in-out infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
      -webkit-transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
      -webkit-transform: rotate(360deg);
    }
  }

  // Модификаторы размеров
  &--small {
    width: $size * 0.5;
    height: $size * 0.5;
    border-width: $thickness * 0.5;
  }

  &--large {
    width: $size * 2;
    height: $size * 2;
    border-width: $thickness * 1.5;
  }

  // Цветовые варианты
  &--primary {
    border-top-color: $color;
    &::after {
      border-top-color: rgba($color, 0.5);
    }
  }

  &--secondary {
    border-top-color: #2ecc71;
    &::after {
      border-top-color: rgba(#2ecc71, 0.5);
    }
  }

  &--white {
    border-top-color: white;
    &::after {
      border-top-color: rgba(white, 0.5);
    }
  }
}

/* Chrome, Edge and Safari */
.content::-webkit-scrollbar {
  height: 7px;
  width: 7px;
}

.content::-webkit-scrollbar-track {
  background-color: #c7e0e4ff;
  border-radius: 5px;
  border: 0px solid #ffffffff;
}

.content::-webkit-scrollbar-track:hover {
  background-color: #acc6caff;
}

.content::-webkit-scrollbar-track:active {
  background-color: #acc6caff;
}

.content::-webkit-scrollbar-thumb {
  background-color: #6b8484ff;
  border-radius: 10px;
  border: 0px solid #ffffffff;
}

.content::-webkit-scrollbar-thumb:hover {
  background-color: #3a4545ff;
}

.content::-webkit-scrollbar-thumb:active {
  background-color: #3a4545ff;
}
```


## app\test\[boardId]\_components\HistoryModal\HistoryModal.tsx

```tsx
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
```


## app\test\[boardId]\_components\HistoryModal\index.ts

```ts
export { HistoryModal } from "./HistoryModal";
```


## app\test\[boardId]\_components\metrics\chart.tsx

```tsx
"use client";
import { AreaChart, Area, XAxis, YAxis, Tooltip, Legend, Line } from "recharts";

export const Chart = ({ data, title }: any) => {
  return (
    <div>
      <h2 className="pt-2 pb-4 text-center">{title}</h2>
      <AreaChart
        width={350}
        height={220}
        data={data[0]}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="iteration" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area
          type="monotone"
          dataKey="iterations"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#colorUv)"
        />
        <Area
          type="monotone"
          dataKey="iterations1"
          stroke="red"
          fillOpacity={1}
          fill="url(#colorXv)"
        />
        <Area
          type="monotone"
          dataKey="iterations"
          stroke="purple"
          fillOpacity={1}
          fill="url(#colorUv)"
        />
        <Area
          type="monotone"
          dataKey="iterations"
          stroke="pink"
          fillOpacity={1}
          fill="url(#colorXv)"
        />
        <Area
          type="monotone"
          dataKey="iterations"
          stroke="blue"
          fillOpacity={1}
          fill="url(#colorXv)"
        />
      </AreaChart>
    </div>
  );
};
```


## app\test\[boardId]\_components\metrics\chartCard.tsx

```tsx
"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { MetricsData } from "./metricsData";
import { CircleChart } from "./circleChart";

export const ChartCard = ({ data, gameCount, stroke, dataKey, percent}: any) => {
  return (
    <div>
      <h2 className="pt-2 pb-2 text-center">
        <strong>Game {gameCount}</strong>
      </h2>
      <small className="ml-10"><strong>Value</strong></small>
      <LineChart width={400} height={230} data={data} className="mt-4">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey={dataKey} stroke={stroke} />
      </LineChart>
      <small className="w-full flex justify-center items-center text-center m-0">
       <strong>Iterations</strong>
      </small>
      <MetricsData average={100} median={50} min={1} max={100} />
      <CircleChart value={percent} />
    </div>
  );
};
```


## app\test\[boardId]\_components\metrics\circleChart.tsx

```tsx
import React, { FC } from "react";
import { PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ["#82ca9d", "#8884d8"];

export const CircleChart: FC<{ value: number }> = ({ value }) => {
  const data = [
    { name: "Total amount of resources in the node", value: value },
    { name: "Remaining amount of resources", value: 100 - value },
  ];
  return (
    <div className="mb-3 mx-5">
      <h2 className="pt-1 pb-2 text-center">
        <strong>Resource allocation</strong>
      </h2>
      <PieChart width={400} height={300}>
        <Pie dataKey="value" data={data} fill="#8884d8" label>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </div>
  );
};
```


## app\test\[boardId]\_components\metrics\metrics.tsx

```tsx
"use client";

import { Panel } from "reactflow";
import { useChangeEdgeType } from "@/app/store/use-custom-edge";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import "./../../style-test.css";
import { MetricsData } from "./metricsData";
import { CircleChart } from "./circleChart";
import { ChartCard } from "./chartCard";

const data = [
  {
    name: 0,
    game1: 0,
    game2: 0,
    game3: 0,
    game4: 0,
    game5: 0,
  },
  {
    name: 1,
    game1: 10,
    game2: 5,
    game3: 5,
    game4: 2,
    game5: 10,
  },
  {
    name: 2,
    game1: 20,
    game2: 10,
    game3: 10,
    game4: 4,
    game5: 20,
  },
  {
    name: 3,
    game1: 30,
    game2: 15,
    game3: 15,
    game4: 9,
    game5: 20,
  },
  {
    name: 4,
    game1: 40,
    game2: 15,
    game3: 20,
    game4: 11,
    game5: 30,
  },
  {
    name: 5,
    game1: 50,
    game2: 15,
    game3: 25,
    game4: 13,
    game5: 40,
  },
  {
    name: 6,
    game1: 70,
    game2: 20,
    game3: 30,
    game4: 18,
    game5: 50,
  },
  {
    name: 7,
    game1: 90,
    game2: 25,
    game3: 25,
    game4: 28,
    game5: 60,
  },
  {
    name: 8,
    game1: 110,
    game2: 27,
    game3: 30,
    game4: 38,
    game5: 70,
  },
  {
    name: 9,
    game1: 130,
    game2: 37,
    game3: 25,
    game4: 48,
    game5: 80,
  },
  {
    name: 10,
    game1: 150,
    game2: 47,
    game3: 30,
    game4: 58,
    game5: 90,
  },
];

export const Metrics = () => {
  const { analytics, setAnalytics } = useChangeEdgeType();
  return (
    <Panel position="top-right" className="analytics_panel">
      <button
        className="bg-black rounded py-1 px-2 text-white absolute top-2 left-2"
        onClick={() => setAnalytics(false)} > &#x2716;
      </button>
      <h1 className="pt-2 text-center text-lg">
        <strong>Node statistics (wood)</strong>
      </h1>

      <h2 className="pt-1 pb-4 text-center">
        <strong>All games</strong>
      </h2>
      <small className="ml-10">
        <strong>Value</strong>
      </small>
      <LineChart width={400} height={230} data={data} className="mt-2">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        {/* <Legend /> */}
        <Line type="monotone" dataKey="game1" stroke="#82ca9d" />
        <Line type="monotone" dataKey="game2" stroke="#8884d8" />
        <Line type="monotone" dataKey="game3" stroke="pink" />
        <Line type="monotone" dataKey="game4" stroke="blue" />
        <Line type="monotone" dataKey="game5" stroke="purple" />
      </LineChart>
      <small className="w-full flex justify-center items-center text-center m-0">
        <strong>Iterations</strong>
      </small>
      <MetricsData
        average={100}
        median={50}
        min={1}
        max={100}
        std={37}
        range={1}
      />
      <ChartCard data={data} gameCount={1} stroke="#82ca9d" dataKey="game1" percent={14}/>
      <ChartCard data={data} gameCount={2} stroke="#8884d8" dataKey="game2" percent={64}/>
      <ChartCard data={data} gameCount={3} stroke="pink" dataKey="game3" percent={92}/>
      <ChartCard data={data} gameCount={4} stroke="blue" dataKey="game4" percent={45}/>
      <ChartCard data={data} gameCount={5} stroke="purple" dataKey="game5" percent={80}/>
    </Panel>
  );
};
```


## app\test\[boardId]\_components\metrics\metricsData.tsx

```tsx
"use client";

import { FC } from "react";
import "./../../style-test.css";

interface MetricsDta {
  average: number;
  median: number;
  min: number;
  max: number;
  std?: number;
  range?: number;
}

export const MetricsData: FC<MetricsDta> = ({
  average,
  median,
  max,
  min,
  std,
  range,
}) => {
  return (
    <div className="values_analytics">
      <div className="analytics__title">
        <h2>
          <strong>Metrics</strong>
        </h2>
        <h2>
          <strong>Value</strong>
        </h2>
      </div>
      <hr />
      <div className="analytics__title">
        <h2>Average value (AVR)</h2>
        <h2>{average}</h2>
      </div>
      <div className="analytics__title">
        <h2>Median (MEDIAN)</h2>
        <h2>{median}</h2>
      </div>
      <div className="analytics__title">
        <h2>Minimum value (MIN)</h2>
        <h2>{min}</h2>
      </div>
      <div className="analytics__title">
        <h2>Maximum value (MAX)</h2>
        <h2>{max}</h2>
      </div>
      {std && (
        <div className="analytics__title">
          <h2>Standard Deviation (STD)</h2>
          <h2>{std}</h2>
        </div>
      )}
      {range && (
        <div className="analytics__title">
          <h2>Range (RANGE)</h2>
          <h2>{range}</h2>
        </div>
      )}
      <hr/>
    </div>
  );
};
```


## app\test\[boardId]\_components\panels\bottom-panel.tsx

```tsx
import { Panel, useEdges, useNodes } from "reactflow";
import { ToolButton } from "../ui/ToolButton";
import { Play, RotateCcw, Pause } from "lucide-react";
import CustomInput from "../ui/CustomInput";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import useStore from "@/app/store/store";
import { useEffect } from "react";
import { Iterations } from "../iterations";
import { useChangeEdgeType } from "@/app/store/use-custom-edge";
import { Games } from "../games";

export const BottomPanel = () => {
  const { isPlay, onPlay, onStop, onReset, time, iterations, games } = useAnimateScheme();
  const { setEdgeAnimated } = useStore();
  useEffect(() => {
    setEdgeAnimated(isPlay);
  }, [isPlay]);

  const edges = useEdges();
  const nodes = useNodes();
  const { error, setError } = useChangeEdgeType();

  return (
    <Panel position="bottom-center">
      <div className="bg-white rounded-md flex gap-x-2 items-center shadow-md py-2 px-2">
        <div className="mr-2 flex gap-x-2 items-center">
          <CustomInput label="Iterations" initialValue={iterations} />
          <CustomInput label="Time(s)" initialValue={time} />
          <CustomInput label="Games" initialValue={games} />
        </div>
        <ToolButton
          label="Play"
          isDisabled={error ? true : isPlay}
          onClick={onPlay}
          isActive={false}
          icon={Play}
          background="blue"
        />
        <ToolButton
          label="Pause"
          isDisabled={!isPlay}
          onClick={onStop}
          isActive={false}
          icon={Pause}
          background="red"
        />
        <ToolButton
          label="Reset"
          onClick={onReset}
          isActive={false}
          icon={RotateCcw}
          background="red"
        />
        <Iterations />
        <Games />
        <div className="text-xs text-center px-1">
          <label>Total count</label>
          <div>{edges.length + nodes.length}</div>
        </div>
      </div>
    </Panel>
  );
};
```


## app\test\[boardId]\_components\panels\EdgeTypePanel.tsx

```tsx
import React from "react";

import { useChangeEdgeType } from "@/app/store/use-custom-edge";
import { EdgesTypes } from "@/app/types/structs";
import useStore from "@/app/store/store";

export const EdgeTypePanel = () => {
  const { onChangeEdgesType } = useChangeEdgeType();
  const { edgesType: currentEdgesTypeValue } = useStore.getState();

  const handleChangeEdgesType = (type: EdgesTypes) => {
    onChangeEdgesType(type);
    useStore.setState({
      edgesType: type,
    });
  };

  return (
    <div className="flex gap-x-2 items-center">
      <button
        className={`bg-blue-100 rounded-md p-2 ${
          currentEdgesTypeValue === EdgesTypes.DEFAULT
            ? "bg-blue-500 text-white"
            : ""
        }`}
        onClick={() => handleChangeEdgesType(EdgesTypes.DEFAULT)}
      >
        Default
      </button>
      <button
        className={`bg-blue-100 rounded-md p-2 ${
          currentEdgesTypeValue === EdgesTypes.SMOOTH_STEP
            ? "bg-blue-500 text-white"
            : ""
        }`}
        onClick={() => handleChangeEdgesType(EdgesTypes.SMOOTH_STEP)}
      >
        SmoothStep
      </button>
      <button
        className={`bg-blue-100 rounded-md mr-16 p-2 ${
          currentEdgesTypeValue === EdgesTypes.BEZIER
            ? "bg-blue-500 text-white"
            : ""
        }`}
        onClick={() => handleChangeEdgesType(EdgesTypes.BEZIER)}
      >
        Bezier
      </button>
    </div>
  );
};
```


## app\test\[boardId]\_components\panels\toolbar.tsx

```tsx
import { StructType } from "@/app/types/structs";
import { ToolButton } from "../ui/ToolButton";
import {
  ArrowLeftRight,
  Recycle,
  Play,
  Dices,
  Hourglass,
  CheckCheck,
  Undo,
  Redo,
  BadgePlus,
  BadgeMinus,
  Eraser,
} from "lucide-react";
import useStore, { RFState } from "@/app/store/store";
import { shallow } from "zustand/shallow";

interface ToolbarProps {
  canvasState: CanvasState;
  onClick: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  addNode: state.addNode,
});

export const Toolbar = () => {
  const { addNode } = useStore(selector, shallow);
  const { deleteAll } = useStore();

  return (
    <div className="absolute top-40 left-2 flex flex-col gap-y-4">
      <div className="bg-white rounded-md p-1.5 flex gap-y-1 flex-col items-center shadow-md">
        <ToolButton
          label="Source"
          onClick={() => addNode(StructType.Source)}
          isActive={false}
          icon={Play}
        />
        <ToolButton
          label="Pool"
          onClick={() => addNode(StructType.Pool)}
          isActive={false}
          icon={BadgePlus}
        />
        <ToolButton
          label="Consumer"
          onClick={() => addNode(StructType.Consumer)}
          isActive={false}
          icon={BadgeMinus}
        />
        <ToolButton
          label="Converter"
          onClick={() => addNode(StructType.Converter)}
          isActive={true}
          icon={Recycle}
        />
        <ToolButton
          label="Gate"
          onClick={() => addNode(StructType.Gate)}
          isActive={false}
          icon={ArrowLeftRight}
        />
        <ToolButton
          label="Random"
          onClick={() => addNode(StructType.Random)}
          isActive={false}
          icon={Dices}
        />
        <ToolButton
          label="Delay"
          onClick={() => addNode(StructType.Delay)}
          isActive={false}
          icon={Hourglass}
        />
        <ToolButton
          label="End"
          onClick={() => addNode(StructType.End)}
          isActive={false}
          icon={CheckCheck}
        />
      </div>
      {/* undo redo */}
      <div className="bg-white rounded-md p-1.5 flex flex-col items-center shadow-md">
        <ToolButton
          label="Undo"
          onClick={() => {}}
          isActive={false}
          icon={Undo}
        />
        <ToolButton
          label="Redo"
          onClick={() => {}}
          isActive={false}
          icon={Redo}
        />
        <ToolButton
          label="Eraser"
          onClick={deleteAll}
          isActive={false}
          icon={Eraser}
        />
      </div>
    </div>
  );
};
```


## app\test\[boardId]\_components\sidebar\sidebar-board.tsx

```tsx
import Link from "next/link";
import React from "react";
import { BoardTitle } from "../BoardInfoModal/BoardTitle";

interface TestIdPageProps {
  params: {
    boardId: string;
  };
}
const BoardSidebar = ({ params }: TestIdPageProps) => {
  return (
    <aside
      id="sidebar"
      className="bg-black text-white w-[150px] pt-10 pl-5 absolute inset-y-0 left-0 
                transform md:relative md:translate-x-0 md:flex
                 md:flex-col gap-y-6"
      data-dev-hint="sidebar">
         <BoardTitle boardId={params.boardId} />
          <Link href="/editor">
            <span>Editor</span>
          </Link>
          {/* <Link href="/lineage">
            <span>Lineage</span>
          </Link>
          <Link href="/tests">
            <span>Tests</span>
          </Link>
          <Link href="/tables">
            <span>Tables</span>
          </Link>
          <Link href="/macros">
            <span>Macros</span>
          </Link> */}
    </aside>
  );
};

export default BoardSidebar;
```


## app\test\[boardId]\_components\ui\EditableText\EditableText.module.scss

```scss
.editableContainer {
  cursor: pointer;
}

.editableText {
  padding: 4px 8px;
  border: 1px solid transparent;
  border-radius: 4px;

  &:hover {
    border-color: #ccc;
    background: #f5f5f5;
  }
}

.editableInput {
  padding: 4px 8px;
  border: 1px solid #007bff;
  border-radius: 4px;
  outline: none;
  background: white;

  &:hover {
    border-color: #0056b3;
  }
}
```


## app\test\[boardId]\_components\ui\EditableText\EditableText.tsx

```tsx
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
```


## app\test\[boardId]\_components\ui\EditableText\index.ts

```ts
import EditableText from "./EditableText";

export { EditableText };
```


## app\test\[boardId]\_components\ui\CustomInput.tsx

```tsx
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
```


## app\test\[boardId]\_components\ui\DownloadBtn.tsx

```tsx
import {
  getTransformForBounds,
  useReactFlow,
  getRectOfNodes,
} from "reactflow";
import { ToolButton } from "./ToolButton";
import { Download } from "lucide-react";

import { toPng } from "html-to-image";

function downloadImage(dataUrl: any) {
  const a = document.createElement("a");
  a.setAttribute("download", "scheme.png");
  a.setAttribute("href", dataUrl);
  a.click();
}

const imageWidth = 1024;
const imageHeight = 768;

export const DownloadBtn = () => {
  const { getNodes } = useReactFlow();
  const onDownload = () => {
    const nodesBounds = getRectOfNodes(getNodes());
    const transform = getTransformForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.5,
      2
    );
    //@ts-ignore
    toPng(document.querySelector(".react-flow__viewport"), {
      backgroundColor: "white",
      width: imageWidth,
      height: imageHeight,
      style: {
        width: imageWidth,
        height: imageHeight,
        transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
      },
    }).then(downloadImage);
  };
  return (
    <div>
      <ToolButton
        label="Download PNG"
        onClick={onDownload}
        isActive={false}
        icon={Download}
      />
    </div>
  );
};
```


## app\test\[boardId]\_components\ui\index.ts

```ts
import CustomInput from "./CustomInput";
import { EditableText } from "./EditableText";
import { ToolButton } from "./ToolButton";
import { DownloadBtn } from "./DownloadBtn";

export { CustomInput, EditableText, ToolButton, DownloadBtn };
```


## app\test\[boardId]\_components\ui\ToolButton.tsx

```tsx
"use client";

import { LucideIcon } from "lucide-react";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";

interface ToolButtonProps {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  isActive?: boolean;
  isDisabled?: boolean;
  background?: string
}

export const ToolButton = ({
  label,
  icon: Icon,
  onClick,
  isActive,
  isDisabled,
  background = "black"
}: ToolButtonProps) => {
  return (
    <Hint label={label}>
      <Button
        disabled={isDisabled}
        onClick={onClick}
        size="icon"
        style={{ margin: "1px", background: background }}
      >
        <Icon />
      </Button>
    </Hint>
  );
};
```


## app\test\[boardId]\_components\context-menu.tsx

```tsx
import React, { useCallback } from "react";
import { Node, useReactFlow } from "reactflow";
import "./../style-test.css"
import { useChangeEdgeType } from "@/app/store/use-custom-edge";

interface ContextMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  top?: any | boolean; // Выбор между числом и строкой для стилей
  left?: any | boolean;
  right?: any | boolean; // Необязательные свойства
  bottom?: any | boolean;
}

export default function ContextMenu({
  id,
  top,
  left,
  right,
  bottom,
  ...props
}: ContextMenuProps): React.JSX.Element {
  const { getNode, setNodes, addNodes, setEdges } = useReactFlow();
  const {setAnalytics} = useChangeEdgeType()
  const duplicateNode = useCallback(() => {
    const node: any = getNode(id);
    const position = {
      x: node.position.x + 50,
      y: node.position.y + 50,
    };

    addNodes({
      ...node,
      selected: false,
      dragging: false,
      id: `${node.id}-copy`,
      position,
    });
  }, [id, getNode, addNodes]);

  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id));
  }, [id, setNodes, setEdges]);


  return (
    <div
      style={{ top, left, right, bottom }}
      className="context-menu"
      {...props}
    >
      <button onClick={duplicateNode}>Copy</button>
      <button onClick={deleteNode}>Delete</button>
      <button onClick={() => setAnalytics(true)}>Analytics</button>
    </div>
  );
}
```


## app\test\[boardId]\_components\cursor.tsx

```tsx
"use client";

import { useOther } from "@/liveblocks.config";
import { MousePointer2 } from "lucide-react";
import { memo } from "react";

interface CursorProps {
  connectionId: number;
}

export const Cursor = memo(({ connectionId }: CursorProps) => {
  const info = useOther(connectionId, (user) => user?.info);
  const cursor = useOther(connectionId, (user) => user.presence.cursor);

  if (!cursor) {
    return null;
  }
  const { x, y } = cursor;
  const name = info?.name || "No name";

  return (
    <foreignObject
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        transform: `translateX(${x}px) translateY(${y}px)`,
      }}
      width={name.length * 10 + 24}
      height="50"
      viewBox="0 0 24 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <MousePointer2
        className="h-5 w-5"
        style={{
          fill: "red",
          color: "red",
        }}
      />
      <div
        className="absolute left-5 px-1.5 py-0.5 rounded-md text-xs text-white font-semibold"
        style={{ backgroundColor: "red" }}
      >
        {name}
      </div>
    </foreignObject>
  );
});

Cursor.displayName = "Cursor";
```


## app\test\[boardId]\_components\flow.tsx

```tsx
"use client";
import "reactflow/dist/style.css";
import ReactFlow, { Controls, Background, Panel } from "reactflow";
// import { shallow } from "zustand/shallow";
import { useMyPresence, useOthers } from "@/liveblocks.config";
import { Cursor } from "./cursor";
import { Toolbar } from "./panels/toolbar";
import { BottomPanel } from "./panels/bottom-panel";
import { DownloadBtn } from "./ui/DownloadBtn";
import useStore, { RFState } from "@/app/store/store";
import { edgeTypes, nodeTypes } from "@/app/types/structs";
import { useCallback, useEffect, useRef, useState } from "react";
import ContextMenu from "./context-menu";
import { useChangeEdgeType } from "@/app/store/use-custom-edge";
import { Metrics } from "./metrics/metrics";
import EditorComponent from "./editor/editorCoder";
import "./../style-test.css";
import { useRenameModal } from "@/app/store/use-rename-modal";
import BoardInfoModal from "./BoardInfoModal/BoardInfoModal";
import { ToolButton } from "./ui/ToolButton";
import { FileJson2, LayoutDashboard, HistoryIcon } from "lucide-react";
import { Loading } from "@/components/loading";
import { useVersionsHistory } from "@/app/hooks/useVersionsHistory";
import { Id } from "@/convex/_generated/dataModel";
import { useSaveHandlerOnHotkeyKeydown } from "@/app/hooks/useSaveHandlerOnKeydown";
import { HistoryModal } from "./HistoryModal";
import { useInitializeBoard } from "@/app/hooks/useInitializeBoard";

// const selector = (state: RFState) => ({
//   nodes: state.nodes,
//   edges: state.edges,
//   deleteNode: state.deleteNode,
//   onNodesChange: state.onNodesChange,
//   onEdgesChange: state.onEdgesChange,
//   onConnect: state.onConnect,
//   addNode: state.addNode,
// });
interface FlowProps {
  boardId: string;
}

interface IContextMenu {
  id: string;
  top: number;
  left: number;
  right: number | boolean;
  bottom: number | boolean;
}

const Flow = ({ boardId }: FlowProps) => {
  useInitializeBoard(boardId as Id<"boards">);

  const {
    liveblocks: { isStorageLoading },
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    deleteNode,
  } = useStore();
  const { autoSave, manualSave } = useVersionsHistory(boardId);
  useSaveHandlerOnHotkeyKeydown(manualSave);

  const [{ cursor }, updateMyPresence] = useMyPresence();
  const others = useOthers();
  const { isVisibleEditor, setIsVisisble, isVisibleBoard, setIsVisisbleBoard } =
    useRenameModal();
  const [isVisibleHistory, setIsVisisbleHistory] = useState(false);
  const { analytics, setAnalytics } = useChangeEdgeType();
  const [menu, setMenu] = useState<IContextMenu | null>(null);
  const ref = useRef(null);

  const onNodeContextMenu = useCallback(
    (event: any, node: any) => {
      event.preventDefault();
      //@ts-ignore
      const pane = ref.current?.getBoundingClientRect();
      let menu = {
        id: node.id,
        top: event.clientY < pane.height - 200 && event.clientY,
        left: event.clientX < pane.width + 200 && event.clientX,
        right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
        bottom:
          event.clientY >= pane.height - 200 && pane.height - event.clientY,
      };
      setMenu(menu);
    },
    [setMenu]
  );

  const onPaneClick = useCallback(() => {
    setMenu(null);
  }, [setMenu]);

  useEffect(() => {
    if (isStorageLoading) return;

    autoSave();
  }, [nodes, edges, autoSave, isStorageLoading]);

  if (isStorageLoading) {
    <Loading />;
  }

  return (
    <main
      className="h-full w-full relative bg-neutral-100 touch-none"
      onPointerMove={(event) => {
        updateMyPresence({
          cursor: {
            x: Math.round(event.clientX),
            y: Math.round(event.clientY),
          },
        });
      }}
      onPointerLeave={() =>
        updateMyPresence({
          cursor: null,
        })
      }
    >
      {!isVisibleEditor && (
        <div className="z-10 w-full relative">
          <Toolbar />
        </div>
      )}

      {others.map(({ connectionId, presence }) => {
        if (presence.cursor === null) {
          return null;
        }
        return <Cursor key={connectionId} connectionId={connectionId} />;
      })}

      <ReactFlow
        ref={ref}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneClick={onPaneClick}
        onNodeContextMenu={onNodeContextMenu}
      >
        {menu && <ContextMenu onClick={onPaneClick} {...menu} />}
        <Controls position="bottom-right" />

        {isVisibleEditor && (
          <Panel position="top-left" className="position_panel">
            <EditorComponent />
          </Panel>
        )}

        <Panel position="top-center">
          <div className="bg-white rounded-md p-1.5 flex gap-x-2 items-center shadow-md">
            <ToolButton
              label="Editor"
              onClick={setIsVisisble}
              isActive={false}
              icon={FileJson2}
            />
            <DownloadBtn />
            <ToolButton
              label="Board"
              onClick={() => {
                if (isVisibleHistory) {
                  setIsVisisbleHistory(!isVisibleHistory);
                }

                setIsVisisbleBoard();
              }}
              isActive={false}
              icon={LayoutDashboard}
            />
            <ToolButton
              label="History"
              onClick={() => {
                if (isVisibleBoard) {
                  setIsVisisbleBoard();
                }

                setIsVisisbleHistory(!isVisibleHistory);
              }}
              isActive={false}
              icon={HistoryIcon}
            />
          </div>
        </Panel>

        {!analytics && !isVisibleBoard && isVisibleHistory && (
          <Panel position="top-right" className="info_panel">
            <HistoryModal
              boardId={boardId}
              onSaveRestoredVersion={manualSave}
              onClose={() => setIsVisisbleHistory(false)}
            />
          </Panel>
        )}

        {!analytics && !isVisibleHistory && isVisibleBoard && (
          <Panel position="top-right" className="info_panel">
            <BoardInfoModal boardId={boardId} handleSaveVersion={manualSave} />
          </Panel>
        )}
        <Background color="blue" gap={16} className="bg-blue-100" />
        {analytics && <Metrics />}
        <BottomPanel />
      </ReactFlow>
    </main>
  );
};

export default Flow;
```


## app\test\[boardId]\_components\games.tsx

```tsx
"use client";

import { useAnimateScheme } from "@/app/store/use-animate-scheme";

export const Games = () => {
  const {  games, gamesCount } = useAnimateScheme();

  return (
    <div className="text-xs text-center px-2">
      <label>Games</label>
      <div className="flex gap-x-3 items-center">
        <div>{gamesCount}</div>
        <div>/</div>
        <div>{games}</div>
      </div>
    </div>
  );
};
```


## app\test\[boardId]\_components\iterations.tsx

```tsx
"use client";

import { useAnimateScheme } from "@/app/store/use-animate-scheme";

export const Iterations = () => {
  const { iterationsCount, iterations } = useAnimateScheme();

  return (
    <div className="text-xs text-center px-2">
      <label>Iterations</label>
      <div className="flex gap-x-3 items-center">
        <div>{iterationsCount}</div>
        <div>/</div>
        <div>{iterations}</div>
      </div>
    </div>
  );
};
```


## app\test\[boardId]\layout.tsx

```tsx
import { BoardTitle } from "./_components/BoardInfoModal/BoardTitle";
import BoardSidebar from "./_components/sidebar/sidebar-board";

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: {
    boardId: string;
  };
}

const DashboardLayout = ({ children, params }: DashboardLayoutProps) => {
  return (
    // <main className="relative min-h-screen md:flex overflow-hidden">
    //   <BoardSidebar params={params}/>
    //   <main
    //     id="content"
    //     className="flex-1 bg-gray-100 max-h-screen overflow-y-auto"
    //   >
        <div className="max-w-full mx-auto h-full">
                   {/* <InfoBoard boardId={params.boardId} /> */}
          <div className="h-full">{children}</div>
        </div>
    //    </main>
    //  </main>
  );
};

export default DashboardLayout;
```


## app\test\[boardId]\page.tsx

```tsx
import Flow from "./_components/Flow";
import { Room } from "@/components/room";
import { Loading } from "@/components/loading";

interface TestIdPageProps {
  params: {
    boardId: string;
  };
}

const TestIdPage = ({ params }: TestIdPageProps) => {
  return (
    <Room roomId={params.boardId} fallback={<Loading />}>
      <Flow boardId={params.boardId} />
    </Room>
  );
};

export default TestIdPage;
```


## app\test\[boardId]\rahmankulova.md

```md
# Project Structure

```
_components/
  _structs/
    nodeComponents/
      consumerNode.tsx
      converterNode.tsx
      delayNode.tsx
      endNode.tsx
      gateNode.tsx
      nodeStyle.css
      poolNode.tsx
      randomNode.tsx
      sourceNode.tsx
      styled-node.tsx
    custom-edge.tsx
    custom-node.tsx
  BoardInfoModal/
    BoardInfoModal.module.scss
    BoardInfoModal.tsx
    BoardTitle.tsx
  editor/
    editor.module.scss
    editorCoder.tsx
  HistoryModal/
    CollapsibleGroup/
      CollapsibleGroup.module.scss
      CollapsibleGroup.tsx
      index.ts
    HistoryItem/
      HistoryItem.module.scss
      HistoryItem.tsx
      index.ts
    datepicker.css
    HistoryModal.module.scss
    HistoryModal.tsx
    index.ts
  metrics/
    chart.tsx
    chartCard.tsx
    circleChart.tsx
    metrics.tsx
    metricsData.tsx
  panels/
    bottom-panel.tsx
    EdgeTypePanel.tsx
    toolbar.tsx
  sidebar/
    sidebar-board.tsx
  ui/
    EditableText/
      EditableText.module.scss
      EditableText.tsx
      index.ts
    CustomInput.tsx
    DownloadBtn.tsx
    index.ts
    ToolButton.tsx
  context-menu.tsx
  cursor.tsx
  flow.tsx
  games.tsx
  iterations.tsx
layout.tsx
page.tsx
style-test.css
```


## _components\_structs\nodeComponents\consumerNode.tsx

```tsx
"use client";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect } from "react";
import {
  Edge,
  Node,
  NodeResizer,
  useEdges,
  useNodeId,
  useNodes,
} from "reactflow";
import useStore from "@/app/store/store";
import { StructType } from "@/app/types/structs";
import { StyledNode } from "./styled-node";

interface DataProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
  };
  selected: boolean;
}

const ConsumerNode = ({
  data: { label, struct, name },
  selected,
}: DataProps) => {
  const { isPlay, onStop, onReset, time } = useAnimateScheme();
  const { setNodeLabel, getEdgeValues } = useStore();
  const nodeId = useNodeId();
  const edges = useEdges<any>();
  const nodes = useNodes<any>();

  useEffect(() => {
    let intervalId = null;
    if (nodeId === null) return;
    if (!isPlay) {
      setNodeLabel(nodeId, 0);
    } else {
      setNodeLabel(nodeId, 1);
      let sourceEdge: Edge<Number> = edges.find(
        (edge) => edge?.target === nodeId
      )!;
      // тут в sourceEdge.data хранится значение количество ресурсов
      let targetEdge: Edge<Number> = edges.find(
        (edge) => edge?.source === nodeId
      )!;

      // тут в targetEdge.data хранится значение количества млсекунд * 1000 - то что задержка

      let targetNodeId: Node<any> = nodes.find(
        (node) => node.id === targetEdge?.target
      )!;
      let initialData = +sourceEdge?.data! || 0;

      intervalId = setInterval(() => {
        // Увеличиваем значение sourceEdge.data каждую секунду на 1
        initialData += +sourceEdge?.data!;

        // Обновляем метку узла с новым значением sourceEdge.data
        setNodeLabel(targetNodeId?.id, +initialData);
      }, time * 1000); // Интервал в миллисекундах (1000 миллисекунд = 1 секунда)
    }
    return () => clearInterval(intervalId!);
  }, [isPlay, onStop, onReset]);

  return (
    <>
      <NodeResizer
        color="blue"
        isVisible={selected}
        minWidth={45}
        minHeight={45}
      />
      <StyledNode struct={struct} label={label} name={name} />
    </>
  );
};

export default memo(ConsumerNode);
```


## _components\_structs\nodeComponents\converterNode.tsx

```tsx
"use client";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect } from "react";
import { Edge, NodeResizer, useEdges, useNodeId, useNodes } from "reactflow";
import useStore from "@/app/store/store";
import { StructType } from "@/app/types/structs";
import { StyledNode } from "./styled-node";

interface DataProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
  };
  selected: boolean;
}

const ConverterNode = ({
  data: { label, struct, name },
  selected,
}: DataProps) => {
  const { isPlay, onStop, onReset, time } = useAnimateScheme();
  const { setNodeLabel, getEdgeValues } = useStore();
  const nodeId = useNodeId();
  const edges = useEdges<any>();
  const nodes = useNodes<any>();

  useEffect(() => {
    let intervalId = null;
    if (isPlay) {


      let newEdges: Edge[] = edges.filter((edge) => edge.target === nodeId)
      let nodeIds: string[] = newEdges.map((edge) => edge.source);

      if (nodeIds.length > 0) {
        nodeIds.forEach(nodeId => {
            let foundNode = nodes.find(node => node.id === nodeId);
            let edge = edges.find(edge => edge.source === foundNode?.id)
            if (foundNode) {
                if (+foundNode.data?.label > edge?.data) {
                    setNodeLabel(foundNode.id, foundNode.data?.label - edge?.data);
                }
            }
        });
    }

      const sumOfData = newEdges.reduce((accumulator, currentEdge) => {
        return accumulator + (+currentEdge.data || 0); 
      }, 0);
      intervalId = setInterval(() => {


        setNodeLabel(nodeId!, (parseInt(label) + sumOfData));
      }, time * 1000);
    }

    return () => clearInterval(intervalId!);

  }, [isPlay, onStop, onReset, label]);

  return (
    <>
      <NodeResizer
        color="blue"
        isVisible={selected}
        minWidth={45}
        minHeight={45}
      />
      <StyledNode struct={struct} label={label} name={name} />
    </>
  );
};

export default memo(ConverterNode);
```


## _components\_structs\nodeComponents\delayNode.tsx

```tsx
"use client";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect } from "react";
import {
  Edge,
  Node,
  NodeResizer,
  useEdges,
  useNodeId,
  useNodes,
} from "reactflow";
import useStore from "@/app/store/store";
import { StructType } from "@/app/types/structs";
import { StyledNode } from "./styled-node";

interface DataProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
  };
  selected: boolean;
}

const DelayNode = ({ data: { label, struct, name }, selected }: DataProps) => {
  const { isPlay, onStop, onReset, time } = useAnimateScheme();
  const { setNodeLabel, getEdgeValues } = useStore();
  const nodeId = useNodeId();
  const edges = useEdges<any>();
  const nodes = useNodes<any>();

  useEffect(() => {
    let intervalId = null;
    if (!isPlay) {
      setNodeLabel(nodeId!, 0);
    } else {
      setNodeLabel(nodeId!, 1);
      let sourceEdge: Edge<any> = edges.find((edge) => edge?.target === nodeId)!;
      // тут в sourceEdge.data хранится значение количество ресурсов
      let targetEdge: Edge<any> = edges.find((edge) => edge?.source === nodeId)!;

      // тут в targetEdge.data хранится значение количества млсекунд * 1000 - то что задержка

      let targetNodeId: Node<any> = nodes.find(
        (node) => node.id === targetEdge?.target
      )!;
      let initialData = +sourceEdge?.data || 0;

      intervalId = setInterval(() => {
        // Увеличиваем значение sourceEdge.data каждую секунду на 1
        initialData += +sourceEdge?.data;

        // Обновляем метку узла с новым значением sourceEdge.data
        setNodeLabel(targetNodeId?.id, +initialData);
      }, time * 1000); // Интервал в миллисекундах (1000 миллисекунд = 1 секунда)
    }
    return () => clearInterval(intervalId!);
  }, [isPlay, onStop, onReset]);

  return (
    <>
      <NodeResizer
        color="blue"
        isVisible={selected}
        minWidth={45}
        minHeight={45}
      />
      <StyledNode struct={struct} label={label} name={name} />
    </>
  );
};

export default memo(DelayNode);
```


## _components\_structs\nodeComponents\endNode.tsx

```tsx
"use client";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect } from "react";
import {
  Edge,
  Node,
  NodeResizer,
  useEdges,
  useNodeId,
  useNodes,
} from "reactflow";
import useStore from "@/app/store/store";
import { StructType } from "@/app/types/structs";
import { StyledNode } from "./styled-node";

interface DataProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
  };
  selected: boolean;
}

const EndNode = ({ data: { label, struct, name }, selected }: DataProps) => {
  const { isPlay, onStop, onReset, time } = useAnimateScheme();
  const { setNodeLabel, getEdgeValues } = useStore();
  const nodeId = useNodeId();
  const edges = useEdges<any>();
  const nodes = useNodes<any>();

  useEffect(() => {
    let intervalId = null;
    if (!isPlay) {
      setNodeLabel(nodeId!, 0);
    } else {
      setNodeLabel(nodeId!, 1);
      let sourceEdge: Edge<any> = edges.find((edge) => edge?.target === nodeId)!;
      // тут в sourceEdge.data хранится значение количество ресурсов
      let targetEdge: Edge<any> = edges.find((edge) => edge?.source === nodeId)!;

      // тут в targetEdge.data хранится значение количества млсекунд * 1000 - то что задержка

      let targetNodeId: Node<any> = nodes.find(
        (node) => node.id === targetEdge?.target
      )!;
      let initialData = +sourceEdge?.data || 0;

      intervalId = setInterval(() => {
        // Увеличиваем значение sourceEdge.data каждую секунду на 1
        initialData += +sourceEdge?.data;

        // Обновляем метку узла с новым значением sourceEdge.data
        setNodeLabel(targetNodeId?.id, +initialData);
      }, time * 1000); // Интервал в миллисекундах (1000 миллисекунд = 1 секунда)
    }
    return () => clearInterval(intervalId!);
  }, [isPlay, onStop, onReset]);

  return (
    <>
      <NodeResizer
        color="blue"
        isVisible={selected}
        minWidth={45}
        minHeight={45}
      />
      <StyledNode struct={struct} label={label} name={name} />
    </>
  );
};

export default memo(EndNode);
```


## _components\_structs\nodeComponents\gateNode.tsx

```tsx
"use client";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect } from "react";
import {
  Edge,
  Node,
  NodeResizer,
  useEdges,
  useNodeId,
  useNodes,
} from "reactflow";
import useStore from "@/app/store/store";
import { StructType } from "@/app/types/structs";
import { StyledNode } from "./styled-node";

interface DataProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
  };
  selected: boolean;
}

const GateNode = ({ data: { label, struct, name }, selected }: DataProps) => {
  const { isPlay, onStop, onReset, time } = useAnimateScheme();
  const { setNodeLabel, getEdgeValues } = useStore();
  const nodeId = useNodeId();
  const edges = useEdges<any>();
  const nodes = useNodes<any>();

  useEffect(() => {
    let intervalId = null;
    if (!isPlay) {
      setNodeLabel(nodeId!, 0);
    } else {
      setNodeLabel(nodeId!, 1);

      let sourceEdge: Edge<any> = edges.find(
        (edge) => edge?.target === nodeId
      )!;
      // тут в sourceEdge.data хранится значение количество ресурсов
      let targetEdge: Edge<any> = edges.find(
        (edge) => edge?.source === nodeId
      )!;

      // тут в targetEdge.data хранится значение количества млсекунд * 1000 - то что задержка
      let targetNodeId: Node<any> = nodes.find(
        (node) => node.id === targetEdge?.target
      )!;
      let initialData = +sourceEdge?.data || 0;

      intervalId = setInterval(() => {
        // Увеличиваем значение sourceEdge.data каждую секунду на 1
        initialData += +sourceEdge?.data;

        // Обновляем метку узла с новым значением sourceEdge.data
        setNodeLabel(targetNodeId?.id, +initialData);
      }, time * 1000); // Интервал в миллисекундах (1000 миллисекунд = 1 секунда)
    }
    return () => clearInterval(intervalId!);
  }, [isPlay, onStop, onReset]);

  return (
    <>
      <NodeResizer
        color="blue"
        isVisible={selected}
        minWidth={45}
        minHeight={45}
      />
      <StyledNode struct={struct} label={label} name={name} />
    </>
  );
};

export default memo(GateNode);
```


## _components\_structs\nodeComponents\nodeStyle.css

```css
.delayNode{
    border: 2px solid red;
    position: relative;
    height: 50px;
    width: 50px;
    overflow: hidden;
    border-radius: 5px;
    display: flex;
    background: white;
    justify-content: center;
    align-items: center;
    font-weight: bold;
}

.consumerNode{
    border: 2px solid blue;
    position: relative;
    height: 50px;
    width: 50px;
    overflow: hidden;
    border-radius: 100%;
    display: flex;
    background: white;
    justify-content: center;
    align-items: center;
    font-weight: bold;
}

.converterNode{
    border: 2px solid blue;
    position: relative;
    height: 50px;
    width: 50px;
    overflow: hidden;
    border-radius: 100%;
    display: flex;
    background: white;
    justify-content: center;
    align-items: center;
    font-weight: bold;
}

.endNode{
    border: 2px solid black;
    position: relative;
    height: 50px;
    width: 50px;
    overflow: hidden;
    border-radius: 5px;
    display: flex;
    background: white;
    justify-content: center;
    align-items: center;
    font-weight: bold;
}

.gateNode{
    border: 2px solid blue;
    position: relative;
    height: 50px;
    width: 50px;
    overflow: hidden;
    border-radius: 100%;
    display: flex;
    background: white;
    justify-content: center;
    align-items: center;
    font-weight: bold;
}

.poolNode{
    border: 2px solid blue;
    position: relative;
    height: 50px;
    width: 50px;
    overflow: hidden;
    border-radius: 100%;
    display: flex;
    background: white;
    justify-content: center;
    align-items: center;
    font-weight: bold;
}

.sourceNode{
    border: 2px solid greenyellow;
    position: relative;
    height: 50px;
    width: 50px;
    overflow: hidden;
    border-radius: 100%;
    display: flex;
    background: white;
    justify-content: center;
    align-items: center;
    font-weight: bold;
}

.randomNode{
    border: 2px solid red;
    position: relative;
    height: 50px;
    width: 50px;
    overflow: hidden;
    border-radius: 5px;
    display: flex;
    background: white;
    justify-content: center;
    align-items: center;
    font-weight: bold;
}
```


## _components\_structs\nodeComponents\poolNode.tsx

```tsx
"use client";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect } from "react";
import {
  Edge,
  Node,
  NodeResizer,
  useEdges,
  useNodeId,
  useNodes,
} from "reactflow";
import useStore from "@/app/store/store";
import { StructType } from "@/app/types/structs";
import { StyledNode } from "./styled-node";

interface DataProps {
  id: string;
  data: {
    label: string;
    struct: StructType;
    name?: string | undefined;
  };
  selected: boolean;
}

const PoolNode = ({
  data: { label, struct, name },
  selected,
  id,
}: DataProps) => {
  const { isPlay, onStop, onReset, time, gamesCount, resetNodes } =
    useAnimateScheme();

  const { setNodeLabel, getEdgeValues } = useStore();
  const nodeId = useNodeId();
  const edges = useEdges<any>();
  const nodes = useNodes<any>();

  useEffect(() => {
    let intervalId = null;
    if (isPlay) {
      let newEdges = edges.filter((edge) => edge.target === nodeId);
      const sumOfData = newEdges.reduce((accumulator, currentEdge) => {
        return accumulator + (+currentEdge.data || 0);
      }, 0);
      intervalId = setInterval(() => {
        setNodeLabel(nodeId!, parseInt(label) + sumOfData);
      }, time * 1000);
    }
    return () => clearInterval(intervalId!);
  }, [isPlay, onStop, onReset, label, gamesCount]);

  return (
    <>
      <NodeResizer
        color="blue"
        isVisible={selected}
        minWidth={45}
        minHeight={45}
      />

      <StyledNode struct={struct} label={label} name={name} />
    </>
  );
};

export default memo(PoolNode);
```


## _components\_structs\nodeComponents\randomNode.tsx

```tsx
"use client";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect } from "react";
import {
  Edge,
  Node,
  NodeResizer,
  useEdges,
  useNodeId,
  useNodes,
} from "reactflow";
import useStore from "@/app/store/store";
import { StructType } from "@/app/types/structs";
import { StyledNode } from "./styled-node";

interface DataProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
  };
  selected: boolean;
}

const RandomNode = ({ data: { label, struct, name }, selected }: DataProps) => {
  const { isPlay, onStop, onReset, time } = useAnimateScheme();
  const { setNodeLabel, getEdgeValues } = useStore();
  const nodeId = useNodeId();
  const edges = useEdges<any>();
  const nodes = useNodes<any>();



  useEffect(() => {
    let intervalId = null;
    if (isPlay) {
      const initialValue = label || null
      let newEdges: Edge[] = edges.filter((edge) => edge.source === nodeId)
      let nodeIds: string[] = newEdges.map(edge => edge.target)      //идишники нод
      
    //   intervalId = setInterval(() => {

    //     setNodeLabel(nodeId, (parseInt(label) + sumOfData).toString());
    //   }, time * 1000);

    
    }
    return () => clearInterval(intervalId!);
  }, [isPlay, onStop, onReset, label]);

  return (
    <>
      <NodeResizer
        color="blue"
        isVisible={selected}
        minWidth={45}
        minHeight={45}
      />
      <StyledNode struct={struct} label={label} name={name} />
    </>
  );
};

export default memo(RandomNode);
```


## _components\_structs\nodeComponents\sourceNode.tsx

```tsx
"use client";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect } from "react";
import { Edge, NodeResizer, useEdges, useNodeId, useNodes } from "reactflow";
import useStore from "@/app/store/store";
import { StructType } from "@/app/types/structs";
import { StyledNode } from "./styled-node";

interface DataProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
  };
  selected: boolean;
}

const SourceNode = ({ data: { label, struct, name }, selected }: DataProps) => {
  const { isPlay, onStop, onReset, time } = useAnimateScheme();
  const { setNodeLabel, getEdgeValues } = useStore();
  const nodeId = useNodeId();
  const edges = useEdges();
  const nodes = useNodes();

  useEffect(() => {
    let intervalIds: NodeJS.Timeout[] = [];

    if (isPlay && nodeId) {
      let targetEdges: Edge[] = edges.filter((edge) => edge?.source === nodeId);
      targetEdges.forEach((edge) => {
        const targetNode = nodes.find((node) => node.id === edge.target);
        if (!targetNode) return;

        let initialData = 0;

        const intervalId = setInterval(() => {
          initialData += +edge.data;
          setNodeLabel(targetNode?.id!, +initialData);
        }, time * 1000);

        intervalIds.push(intervalId);
      });
    }
    return () => {
      intervalIds.forEach((intervalId) => clearInterval(intervalId));
    };
  }, [isPlay, onStop, onReset, edges, nodeId, nodes, time, setNodeLabel]);

  return (
    <>
      <NodeResizer
        color="blue"
        isVisible={selected}
        minWidth={45}
        minHeight={45}
      />
      <StyledNode struct={struct} label={label} name={name} />
    </>
  );
};

export default memo(SourceNode);
```


## _components\_structs\nodeComponents\styled-node.tsx

```tsx
"use client";
import {
  ArrowLeftRight,
  Recycle,
  Dices,
  Hourglass,
  Play,
  CheckCheck,
  LucideIcon,
  Minus,
} from "lucide-react";
import "./nodeStyle.css";
import { StructType } from "@/app/types/structs";
import { Handle, Position, useNodeId } from "reactflow";
import { useState } from "react";
import useStore from "@/app/store/store";

interface ITestNodeProps {
  struct: StructType;
  label: string;
  name?: string;
}

type StructStyles = {
  [key in StructType]: string;
};

interface StructIcons {
  [key: string]: LucideIcon;
}

const styleNode: StructStyles = {
  Consumer: "consumerNode",
  Converter: "converterNode",
  Delay: "delayNode",
  End: "endNode",
  Gate: "gateNode",
  Pool: "poolNode",
  Random: "randomNode",
  Source: "sourceNode",
};

const styleNodeIcon: any = {
  Source: <Play />,
  Converter: <Recycle />,
  Consumer: <Minus />,
  Delay: <Hourglass />,
  Gate: <ArrowLeftRight />,
  Random: <Dices />,
  End: <CheckCheck />,
};

export const StyledNode = ({ struct, label, name }: ITestNodeProps) => {
  const { setNodeName } = useStore();
  const nodeId = useNodeId();

  const [value, setValue] = useState(name);
  const onChange = (event: any) => {
    setValue(event.target.value);
    setNodeName(nodeId!, event.target.value);
  };

  return (
    <div>
      {struct !== StructType.Source && (
        <Handle type={"target"} position={Position.Left} />
      )}
      <div className={styleNode[struct]}>
        {struct in styleNodeIcon ? styleNodeIcon[struct] : label}
        {/* {label} */}
      </div>
      {struct !== StructType.End && (
        <Handle type="source" position={Position.Right} />
      )}
      <div className="h-full w-full flex justify-center">
        <input
          className="bg-transparent w-[50px] border-none text-xs font-bold text-center"
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};
```


## _components\_structs\custom-edge.tsx

```tsx
import { useChangeEdgeType } from "@/app/store/use-custom-edge";
import useStore from "@/app/store/store";
import React, { useEffect, useState } from "react";

import {
  BaseEdge,
  BezierEdge,
  EdgeLabelRenderer,
  EdgeProps,
  StepEdge,
  getBezierPath,
  getStraightPath,
} from "reactflow";

export default function CustomEdge(props: EdgeProps) {
  const {
    error,
    setError,
    currentEdgesType: currentType,
  } = useChangeEdgeType();
  const [localError, setLocalError] = useState<string | null>(null);

  const { setEdgeData } = useStore();
  const {
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    id,
    data: initalValue,
  } = props;

  const [inputValue, setInputValue] = useState<number>(initalValue ?? 1);
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const [basePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const onChange = (event: any) => {
    const newValue = event.target.value;

    if (typeof +newValue !== "number" || isNaN(+newValue)) {
      setLocalError("Must be a numeric");
      setError("error");
      setInputValue(newValue);
    } else {
      setLocalError(null);
      setError(null);
      setInputValue(newValue);
      setEdgeData(id, +newValue);
    }
  };

  useEffect(() => {
    if (typeof +inputValue !== "number" || isNaN(+inputValue)) {
      setLocalError("Must be a numeric");
      setError("error");
    } else {
      setLocalError(null);
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initalValue]);

  return (
    <>
      {currentType === "SmoothStep" && <StepEdge {...props} />}
      {currentType === "Default" && <BaseEdge path={basePath} {...props} />}
      {currentType == "Bezier" && <BezierEdge {...props} />}
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: "all",
          }}
          className="nodrag nopan"
        >
          <input
            className={
              localError
                ? "border-2 border-red-500 w-16 h-7 text-center rounded-sm"
                : "w-16 h-7 text-center rounded-sm"
            }
            value={inputValue}
            onChange={onChange}
          />
          {localError && (
            <p className="text-center text-2 font-bold text-red-500">
              {localError}
            </p>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
```


## _components\_structs\custom-node.tsx

```tsx
"use client";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import { memo, useEffect } from "react";
import { NodeResizer, useEdges, useNodeId } from "reactflow";
import useStore from "@/app/store/store";
import { StyledNode } from "./nodeComponents/styled-node";
import { StructType } from "@/app/types/structs";

interface DataProps {
  data: {
    label: string;
    struct: StructType;
    name?: string;
  };
  selected: boolean;
}

const CustomNode = ({ data: { label, struct, name }, selected }: DataProps) => {
  const { isPlay, time, onReset, isReset } = useAnimateScheme();
  const { setNodeLabel, getEdgeValues } = useStore();
  const nodeId = useNodeId();
  const edges = useEdges<any>();

  useEffect(() => {
    let newEdges = edges.filter((edge) => edge.target === nodeId);

    let { sourceStruct, sourceValue, targetValue } = getEdgeValues(
      newEdges[0]?.id
    );
  
    const sumOfData = newEdges.reduce((accumulator, currentEdge) => {
      return accumulator + (+currentEdge.data! || 0);
    }, 0);

    let intervalId: any;
    const intervalCallback = () => {
      setNodeLabel(nodeId!, parseInt(label) + sumOfData);
    };

    if (isPlay) {
      intervalId = setInterval(intervalCallback, time * 1000);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [label, nodeId, isPlay, onReset, setNodeLabel, edges]);

  return (
    <>
      <NodeResizer
        color="blue"
        isVisible={selected}
        minWidth={45}
        minHeight={45}
      />
      <StyledNode struct={struct} label={label} name={name} />
    </>
  );
};

export default memo(CustomNode);
```


## _components\BoardInfoModal\BoardInfoModal.module.scss

```scss
.board {
  background: white;
  height: 800px;
  width: 300px;
  z-index: 1000;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.board h1 {
  font-size: 16px !important;
  padding-bottom: 10px;
}

.hint_btn {
  background: transparent;
  font-size: 20px !important;
  font-weight: 700;
  color: black;
  padding: 0;
}

.content {
  width: 100%;
  height: 100%;
  position: relative;
}
.content__items {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.date_info {
  position: absolute;
  bottom: 1rem;
  > h2 {
    padding-bottom: 0.5rem;
  }
}

.description {
  display: flex;
  flex-direction: column;
  > textarea {
    height: 270px;
    padding: 1rem 0.5rem;
    background: rgb(233, 238, 252);
    border-radius: 10px;
    border: 1px dashed white;
    margin-bottom: 15px;
  }
}
.saveButton {
  padding: 5px 10px;
  background-color: #000000; /* Красный цвет */
  color: #fff; /* Белый цвет текста */
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.closeButton {
  top: 0;
  right: 0;
  padding: 5px 10px;
  background-color: #000000; /* Красный цвет */
  color: #fff; /* Белый цвет текста */
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.closeButton:hover {
  background-color: #cc0000; /* Темно-красный цвет при наведении */
}
```


## _components\BoardInfoModal\BoardInfoModal.tsx

```tsx
"use client";

import { useCallback, useState } from "react";
import { useQuery } from "convex/react";

import { useRenameModal } from "@/app/store/use-rename-modal";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useApiMutation } from "@/app/hooks/use-api-mutation";
import { useChangeEdgeType } from "@/app/store/use-custom-edge";
import useStore from "@/app/store/store";
import { Participants } from "@/app/board/[boardId]/_components/participants";
import { EdgeTypePanel } from "../panels/EdgeTypePanel";
import { BoardTitle } from "./BoardTitle";

import styles from "./BoardInfoModal.module.scss";

interface IBoardInfoModalProps {
  boardId: string;
  handleSaveVersion: () => void;
}

const BoardInfoModal = ({
  boardId,
  handleSaveVersion,
}: IBoardInfoModalProps) => {
  // const [description, setDescription] = useState("Тестовая доска для показа");
  const boardData = useQuery(api.board.get, {
    id: boardId as Id<"boards">,
  });
  const { title, description, edgesType } = useStore.getState();

  const { mutate: updateMetaInfo, pending: updateMetaInfoPending } =
    useApiMutation(api.board.updateMetaInfo);

  const { currentEdgesType } = useChangeEdgeType();
  // const [boardTitle, setBoardTitle] = useState(boardData?.title);
  const [boardDescription, setBoardDescription] = useState(description || "");

  const { setIsVisisbleBoard } = useRenameModal();

  const handleDescriptionChange = (event: any) => {
    setBoardDescription(event.target.value);
  };

  const handleSave = useCallback(async () => {
    useStore.setState({
      // title: boardData?.title,
      description: boardDescription,
      edgesType: currentEdgesType,
    });

    await updateMetaInfo({
      id: boardData?._id,
      title: boardData?.title,
      description: boardDescription,
      edgesType: currentEdgesType,
    })
      .then(() => {
        handleSaveVersion();
      })
      .catch((e) => {
        console.log(e);
      });
  }, [
    boardData?._id,
    boardData?.title,
    boardDescription,
    currentEdgesType,
    handleSaveVersion,
    updateMetaInfo,
  ]);

  return (
    <div className={styles.board}>
      <div className={styles.content}>
        <div className={styles.content__items}>
          <div className={styles.header}>
            <BoardTitle boardId={boardId} />
            <button className={styles.closeButton} onClick={setIsVisisbleBoard}>
              &#x2716;
            </button>
          </div>

          <div>
            <h1>
              <strong>Owner:</strong> {boardData?.authorName}
            </h1>
            <h1>
              <strong>Participants:</strong>
            </h1>
            <Participants />
          </div>
          <div className={styles.description}>
            <h1>
              <strong>Description:</strong>
            </h1>
            <textarea
              value={boardDescription}
              onChange={handleDescriptionChange}
              className={styles.description}
            />
            <button
              className={styles.saveButton}
              onClick={handleSave}
              disabled={updateMetaInfoPending}
            >
              Save
            </button>
          </div>
          <div>
            <h1>
              <strong>Connection type:</strong>
            </h1>
            <EdgeTypePanel />
          </div>

          <div className={styles.date_info}>
            <h2>
              <strong>Created: </strong>27.10.2024{" "}
            </h2>
            <h2>
              <strong>Updated: </strong>27.10.2024{" "}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardInfoModal;
```


## _components\BoardInfoModal\BoardTitle.tsx

```tsx
"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { Poppins } from "next/font/google";

import { cn } from "@/utils/canvas";
import { Hint } from "@/components/hint";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";
import { useRenameModal } from "@/app/store/use-rename-modal";
import styles from "./BoardInfoModal.module.scss";

interface InfoProps {
  boardId: string;
}

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

const TabSeparator = () => {
  return <div className="text-neutral-300 px-1.5">|</div>;
};

export const BoardTitle = ({ boardId }: InfoProps) => {
  const { onOpen } = useRenameModal();

  const data = useQuery(api.board.get, {
    id: boardId as Id<"boards">,
  });

  // if (!data) return <div>No info</div>;

  return (
    <div>
      <Hint label="Edit title" side="bottom" sideOffset={10}>
        <Button
          className={styles.hint_btn}
          onClick={() => onOpen(data?._id as string, data?.title || "")}
        >
          <h2>{data?.title}</h2>
        </Button>
      </Hint>
    </div>
  );
};
```


## _components\editor\editor.module.scss

```scss
.editor_btn {
  background: rgb(24, 24, 24);
  width: 450px;
  display: flex;
  color: white;
  justify-content: space-between;
}
.generate {
  margin: 20px;
  width: 100%;
}
.reset {
  margin: 20px;
  width: 100%;
}
```


## _components\editor\editorCoder.tsx

```tsx
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
```


## _components\HistoryModal\CollapsibleGroup\CollapsibleGroup.module.scss

```scss
.group {
  margin-bottom: 1rem;

  &Header {
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;

    color: #5f6368;
    font-size: 14px;
    padding: 8px 0;
    border-bottom: 1px solid #e0e0e0;
    margin-bottom: 12px;

    &:hover {
      background: #f1f3f5;
    }
  }

  &Content {
    padding: 0.5rem;
  }
}

.toggleIcon {
}
```


## _components\HistoryModal\CollapsibleGroup\CollapsibleGroup.tsx

```tsx
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
```


## _components\HistoryModal\CollapsibleGroup\index.ts

```ts
export { CollapsibleGroup } from "./CollapsibleGroup";
```


## _components\HistoryModal\HistoryItem\HistoryItem.module.scss

```scss
.versionItem {
  position: relative;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: background 0.1s;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 8px;
  border: 1px solid #e0e0e0;

  &:hover {
    background: #f8f9fa;
  }

  &.selected {
    border-color: #1971c2;
    background-color: #f8f9fa;
  }

  &Header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 4px;
  }

  &Meta {
    display: flex;
    gap: 0.5rem;
    color: #868e96;
    font-size: 0.875rem;

    &Time {
      font-size: 14px;
      color: #202124;
    }
  }

  &Content {
    display: flex;
    flex-direction: column;

    &Message {
      font-size: 14px;
      color: #5f6368;
      margin-top: 8px;
      font-style: italic;
      padding-left: 6px;
    }

    &Colabarator {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #5f6368;
      padding-left: 8px;
    }
  }

  &Actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 16px;
  }
}

.swatch {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #26a69a;
}
```


## _components\HistoryModal\HistoryItem\HistoryItem.tsx

```tsx
import { FC, useCallback, useState } from "react";
import { useConvex, useMutation } from "convex/react";
import { toast } from "sonner";

import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/app/hooks/use-api-mutation";
import { Button } from "@/components/ui/button";
import { useRestoreVersionHandler } from "@/app/hooks/useRestoreVersionHandler";
import { EditableText } from "../../ui";
import styles from "./HistoryItem.module.scss";
import useStore from "@/app/store/store";

type THistoryItemProps = {
  boardId: string;
  version: Doc<"boardsHistory">;
  isSelected: boolean;
  onClick: (versionId: Id<"boardsHistory">) => void;
  onSaveRestoredVersion: (
    isRestore?: boolean,
    restoredVersionTime?: number,
    restoredVersionMessage?: string
  ) => void;
};

export const HistoryItem: FC<THistoryItemProps> = ({
  boardId,
  version,
  isSelected: isCurrent,
  onClick,
  onSaveRestoredVersion,
}) => {
  const convex = useConvex();
  const { onDeleteVersion, setPreviousState } = useStore();

  const { mutate: updateVersionMessage, pending: isVersionMessageUpdating } =
    useApiMutation(api.boardsHistory.updateVersionMessage);
  const { handleRestore } = useRestoreVersionHandler({
    boardId: boardId as Id<"boards">,
    onSaveRestoredVersion,
  });
  const deleteVersion = useMutation(api.boardsHistory.deleteVersion);

  const [isHovered, setIsHovered] = useState(false);

  const handleUpdateHistoryItemMessage = useCallback(
    async (versionId: Id<"boardsHistory">, message: string) => {
      await updateVersionMessage({ id: versionId, message })
        .then(() => {
          toast.success(`Версия успешно переименована`);
        })
        .catch(() => toast.error("Ошибка при переименовании версии"));
    },
    []
  );

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (isCurrent) {
        onClick(version._id);
      }

      await deleteVersion({ versionId: version._id });

      const reinitState = await convex.query(api.board.loadBoardState, {
        boardId: boardId as Id<"boards">,
      });

      await onDeleteVersion(reinitState);
      await setPreviousState({
        nodes: reinitState.nodes,
        edges: reinitState.edges,
        version: reinitState.version,
        createdAt: reinitState._creationTime,
      });

      toast.success("Version deleted");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div
      className={`${styles.versionItem} ${isCurrent ? styles.selected : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(version._id)}
    >
      <div className={styles.versionItemMeta}>
        <span className="version-type">
          {version.type === "snapshot" ? "Snapshot" : "Patch"}
        </span>
        <span className={styles.versionItemMetaTime}>
          {new Date(version._creationTime).toLocaleDateString()}
        </span>
      </div>

      <div className={styles.versionItemContent}>
        <div className={styles.versionItemHeader}>
          <EditableText
            initialValue={
              version.message ||
              new Date(version._creationTime).toLocaleTimeString()
            }
            onBlur={(message: string) => {
              handleUpdateHistoryItemMessage(version._id, message);
            }}
          />
        </div>
        <div className={styles.versionItemContentColabarator}>
          <div className={styles.swatch} />
          <span>{version.authorName || version.authorId}</span>
        </div>
        {version.restoreByTime && (
          <div
            className={styles.versionItemContentMessage}
          >{`Востановлена версия от ${new Date(version.restoreByTime).toLocaleTimeString()}`}</div>
        )}
      </div>

      {isHovered && (
        <div className={styles.versionItemActions}>
          {isCurrent && (
            <Button
              variant="default"
              size="sm"
              onClick={() => handleRestore(version.version)}
            >
              Восстановить
            </Button>
          )}
          {version.version !== 0 && (
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              Удалить
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
```


## _components\HistoryModal\HistoryItem\index.ts

```ts
export { HistoryItem } from "./HistoryItem";
```


## _components\HistoryModal\datepicker.css

```css

```


## _components\HistoryModal\HistoryModal.module.scss

```scss
.historySidebar {
  background: white;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  height: 100vh;
  width: 432px;
  z-index: 1000;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.content {
  width: 100%;
  height: 100%;
  position: relative;
  overflow-y: auto;
  padding-right: 16px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.title {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
}

.revisionsList {
  flex: 1;
  overflow-y: auto;
}

.switch {
  width: 42px;
  height: 25px;
  background-color: #4e4c4cb3;
  border-radius: 9999px;
  position: relative;
  box-shadow: 0 2px 10px #00000080;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  &:focus {
    // box-shadow: 0 0 0 2px black;
  }

  &[data-state="checked"] {
    background-color: rgb(61, 175, 72);
  }

  &Wrapper {
    display: flex;
    align-items: center;
    margin: 16px 0px;
  }

  &Thumb {
    display: block;
    width: 21px;
    height: 21px;
    background-color: white;
    border-radius: 9999px;
    box-shadow: 0 2px 2px #00000080;
    transition: transform 100ms;
    transform: translateX(2px);
    will-change: transform;
    &[data-state="checked"] {
      transform: translateX(19px);
    }
  }

  &Label {
    padding-right: 16px;
    font-size: 16px;
    line-height: 1;
    user-select: none;
  }
}

.searchInput {
  margin-bottom: 16px;
  border-color: hsl(218deg 34.85% 74.85%);
  outline: none;

  &:focus-visible {
    box-shadow: none;
    border-color: #3498db;
  }
}

.datePickerLabel {
  font-size: 16px;
  line-height: 1;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  padding-bottom: 8px;
}

.datePickerInput {
  & input {
    border: 1px solid hsl(218deg 34.85% 74.85%);
    border-radius: calc(0.5rem - 2px);
    padding: 0.5rem 0.75rem;
    padding-left: 32px;
    font-size: 0.875rem;
    line-height: 1.25rem;

    &:focus-visible {
      border-color: #3498db;
      outline: none;
    }
  }

  & button {
    font-size: 13px;
  }

  & svg {
    padding-top: 10px !important;
  }
}

.dateGroup {
  color: #5f6368;
  font-size: 14px;
  padding: 8px 0;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 12px;
}

.tile {
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 8px;
  border: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  cursor: pointer;

  &.selected {
    border-color: #1a73e8;
    background-color: #f8f9fa;
  }
}

.tileHeader {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
}

.time {
  font-size: 14px;
  color: #202124;
}

.restoreButton {
  margin-left: auto;
  background: none;
  border: none;
  color: #1a73e8;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  margin-top: 4px;
  align-self: flex-end;

  &:hover {
    background: #e8f0fe;
  }
}

.collaborator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #5f6368;
  padding-left: 8px;
}

.swatch {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #26a69a;
}

.message {
  font-size: 14px;
  color: #5f6368;
  margin-top: 8px;
  font-style: italic;
  padding-left: 6px;
}

.sortType {
  cursor: pointer;
  margin-left: auto;
}

.spinnerWrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding-block: 16px;
}

// SCSS
.spinner {
  $size: 50px;
  $color: #3498db;
  $thickness: 4px;
  $animation-duration: 1s;

  display: inline-block;
  margin-left: auto;
  margin-right: auto;
  align-self: center;
  width: $size;
  height: $size;
  border: $thickness solid rgba($color, 0.2);
  border-radius: 50%;
  border-top-color: $color;
  animation: spin $animation-duration ease-in-out infinite;
  -webkit-animation: spin $animation-duration ease-in-out infinite;
  position: relative;

  // Вариант с дополнительными градиентами
  &::after {
    content: "";
    position: absolute;
    top: -$thickness;
    left: -$thickness;
    right: -$thickness;
    bottom: -$thickness;
    border-radius: 50%;
    border: $thickness solid transparent;
    border-top-color: rgba($color, 0.5);
    animation: spin ($animation-duration * 1.5) ease-in-out infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
      -webkit-transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
      -webkit-transform: rotate(360deg);
    }
  }

  // Модификаторы размеров
  &--small {
    width: $size * 0.5;
    height: $size * 0.5;
    border-width: $thickness * 0.5;
  }

  &--large {
    width: $size * 2;
    height: $size * 2;
    border-width: $thickness * 1.5;
  }

  // Цветовые варианты
  &--primary {
    border-top-color: $color;
    &::after {
      border-top-color: rgba($color, 0.5);
    }
  }

  &--secondary {
    border-top-color: #2ecc71;
    &::after {
      border-top-color: rgba(#2ecc71, 0.5);
    }
  }

  &--white {
    border-top-color: white;
    &::after {
      border-top-color: rgba(white, 0.5);
    }
  }
}

/* Chrome, Edge and Safari */
.content::-webkit-scrollbar {
  height: 7px;
  width: 7px;
}

.content::-webkit-scrollbar-track {
  background-color: #c7e0e4ff;
  border-radius: 5px;
  border: 0px solid #ffffffff;
}

.content::-webkit-scrollbar-track:hover {
  background-color: #acc6caff;
}

.content::-webkit-scrollbar-track:active {
  background-color: #acc6caff;
}

.content::-webkit-scrollbar-thumb {
  background-color: #6b8484ff;
  border-radius: 10px;
  border: 0px solid #ffffffff;
}

.content::-webkit-scrollbar-thumb:hover {
  background-color: #3a4545ff;
}

.content::-webkit-scrollbar-thumb:active {
  background-color: #3a4545ff;
}
```


## _components\HistoryModal\HistoryModal.tsx

```tsx
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
```


## _components\HistoryModal\index.ts

```ts
export { HistoryModal } from "./HistoryModal";
```


## _components\metrics\chart.tsx

```tsx
"use client";
import { AreaChart, Area, XAxis, YAxis, Tooltip, Legend, Line } from "recharts";

export const Chart = ({ data, title }: any) => {
  return (
    <div>
      <h2 className="pt-2 pb-4 text-center">{title}</h2>
      <AreaChart
        width={350}
        height={220}
        data={data[0]}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="iteration" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area
          type="monotone"
          dataKey="iterations"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#colorUv)"
        />
        <Area
          type="monotone"
          dataKey="iterations1"
          stroke="red"
          fillOpacity={1}
          fill="url(#colorXv)"
        />
        <Area
          type="monotone"
          dataKey="iterations"
          stroke="purple"
          fillOpacity={1}
          fill="url(#colorUv)"
        />
        <Area
          type="monotone"
          dataKey="iterations"
          stroke="pink"
          fillOpacity={1}
          fill="url(#colorXv)"
        />
        <Area
          type="monotone"
          dataKey="iterations"
          stroke="blue"
          fillOpacity={1}
          fill="url(#colorXv)"
        />
      </AreaChart>
    </div>
  );
};
```


## _components\metrics\chartCard.tsx

```tsx
"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { MetricsData } from "./metricsData";
import { CircleChart } from "./circleChart";

export const ChartCard = ({ data, gameCount, stroke, dataKey, percent}: any) => {
  return (
    <div>
      <h2 className="pt-2 pb-2 text-center">
        <strong>Game {gameCount}</strong>
      </h2>
      <small className="ml-10"><strong>Value</strong></small>
      <LineChart width={400} height={230} data={data} className="mt-4">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey={dataKey} stroke={stroke} />
      </LineChart>
      <small className="w-full flex justify-center items-center text-center m-0">
       <strong>Iterations</strong>
      </small>
      <MetricsData average={100} median={50} min={1} max={100} />
      <CircleChart value={percent} />
    </div>
  );
};
```


## _components\metrics\circleChart.tsx

```tsx
import React, { FC } from "react";
import { PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ["#82ca9d", "#8884d8"];

export const CircleChart: FC<{ value: number }> = ({ value }) => {
  const data = [
    { name: "Total amount of resources in the node", value: value },
    { name: "Remaining amount of resources", value: 100 - value },
  ];
  return (
    <div className="mb-3 mx-5">
      <h2 className="pt-1 pb-2 text-center">
        <strong>Resource allocation</strong>
      </h2>
      <PieChart width={400} height={300}>
        <Pie dataKey="value" data={data} fill="#8884d8" label>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </div>
  );
};
```


## _components\metrics\metrics.tsx

```tsx
"use client";

import { Panel } from "reactflow";
import { useChangeEdgeType } from "@/app/store/use-custom-edge";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import "./../../style-test.css";
import { MetricsData } from "./metricsData";
import { CircleChart } from "./circleChart";
import { ChartCard } from "./chartCard";

const data = [
  {
    name: 0,
    game1: 0,
    game2: 0,
    game3: 0,
    game4: 0,
    game5: 0,
  },
  {
    name: 1,
    game1: 10,
    game2: 5,
    game3: 5,
    game4: 2,
    game5: 10,
  },
  {
    name: 2,
    game1: 20,
    game2: 10,
    game3: 10,
    game4: 4,
    game5: 20,
  },
  {
    name: 3,
    game1: 30,
    game2: 15,
    game3: 15,
    game4: 9,
    game5: 20,
  },
  {
    name: 4,
    game1: 40,
    game2: 15,
    game3: 20,
    game4: 11,
    game5: 30,
  },
  {
    name: 5,
    game1: 50,
    game2: 15,
    game3: 25,
    game4: 13,
    game5: 40,
  },
  {
    name: 6,
    game1: 70,
    game2: 20,
    game3: 30,
    game4: 18,
    game5: 50,
  },
  {
    name: 7,
    game1: 90,
    game2: 25,
    game3: 25,
    game4: 28,
    game5: 60,
  },
  {
    name: 8,
    game1: 110,
    game2: 27,
    game3: 30,
    game4: 38,
    game5: 70,
  },
  {
    name: 9,
    game1: 130,
    game2: 37,
    game3: 25,
    game4: 48,
    game5: 80,
  },
  {
    name: 10,
    game1: 150,
    game2: 47,
    game3: 30,
    game4: 58,
    game5: 90,
  },
];

export const Metrics = () => {
  const { analytics, setAnalytics } = useChangeEdgeType();
  return (
    <Panel position="top-right" className="analytics_panel">
      <button
        className="bg-black rounded py-1 px-2 text-white absolute top-2 left-2"
        onClick={() => setAnalytics(false)} > &#x2716;
      </button>
      <h1 className="pt-2 text-center text-lg">
        <strong>Node statistics (wood)</strong>
      </h1>

      <h2 className="pt-1 pb-4 text-center">
        <strong>All games</strong>
      </h2>
      <small className="ml-10">
        <strong>Value</strong>
      </small>
      <LineChart width={400} height={230} data={data} className="mt-2">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        {/* <Legend /> */}
        <Line type="monotone" dataKey="game1" stroke="#82ca9d" />
        <Line type="monotone" dataKey="game2" stroke="#8884d8" />
        <Line type="monotone" dataKey="game3" stroke="pink" />
        <Line type="monotone" dataKey="game4" stroke="blue" />
        <Line type="monotone" dataKey="game5" stroke="purple" />
      </LineChart>
      <small className="w-full flex justify-center items-center text-center m-0">
        <strong>Iterations</strong>
      </small>
      <MetricsData
        average={100}
        median={50}
        min={1}
        max={100}
        std={37}
        range={1}
      />
      <ChartCard data={data} gameCount={1} stroke="#82ca9d" dataKey="game1" percent={14}/>
      <ChartCard data={data} gameCount={2} stroke="#8884d8" dataKey="game2" percent={64}/>
      <ChartCard data={data} gameCount={3} stroke="pink" dataKey="game3" percent={92}/>
      <ChartCard data={data} gameCount={4} stroke="blue" dataKey="game4" percent={45}/>
      <ChartCard data={data} gameCount={5} stroke="purple" dataKey="game5" percent={80}/>
    </Panel>
  );
};
```


## _components\metrics\metricsData.tsx

```tsx
"use client";

import { FC } from "react";
import "./../../style-test.css";

interface MetricsDta {
  average: number;
  median: number;
  min: number;
  max: number;
  std?: number;
  range?: number;
}

export const MetricsData: FC<MetricsDta> = ({
  average,
  median,
  max,
  min,
  std,
  range,
}) => {
  return (
    <div className="values_analytics">
      <div className="analytics__title">
        <h2>
          <strong>Metrics</strong>
        </h2>
        <h2>
          <strong>Value</strong>
        </h2>
      </div>
      <hr />
      <div className="analytics__title">
        <h2>Average value (AVR)</h2>
        <h2>{average}</h2>
      </div>
      <div className="analytics__title">
        <h2>Median (MEDIAN)</h2>
        <h2>{median}</h2>
      </div>
      <div className="analytics__title">
        <h2>Minimum value (MIN)</h2>
        <h2>{min}</h2>
      </div>
      <div className="analytics__title">
        <h2>Maximum value (MAX)</h2>
        <h2>{max}</h2>
      </div>
      {std && (
        <div className="analytics__title">
          <h2>Standard Deviation (STD)</h2>
          <h2>{std}</h2>
        </div>
      )}
      {range && (
        <div className="analytics__title">
          <h2>Range (RANGE)</h2>
          <h2>{range}</h2>
        </div>
      )}
      <hr/>
    </div>
  );
};
```


## _components\panels\bottom-panel.tsx

```tsx
import { Panel, useEdges, useNodes } from "reactflow";
import { ToolButton } from "../ui/ToolButton";
import { Play, RotateCcw, Pause } from "lucide-react";
import CustomInput from "../ui/CustomInput";
import { useAnimateScheme } from "@/app/store/use-animate-scheme";
import useStore from "@/app/store/store";
import { useEffect } from "react";
import { Iterations } from "../iterations";
import { useChangeEdgeType } from "@/app/store/use-custom-edge";
import { Games } from "../games";

export const BottomPanel = () => {
  const { isPlay, onPlay, onStop, onReset, time, iterations, games } = useAnimateScheme();
  const { setEdgeAnimated } = useStore();
  useEffect(() => {
    setEdgeAnimated(isPlay);
  }, [isPlay]);

  const edges = useEdges();
  const nodes = useNodes();
  const { error, setError } = useChangeEdgeType();

  return (
    <Panel position="bottom-center">
      <div className="bg-white rounded-md flex gap-x-2 items-center shadow-md py-2 px-2">
        <div className="mr-2 flex gap-x-2 items-center">
          <CustomInput label="Iterations" initialValue={iterations} />
          <CustomInput label="Time(s)" initialValue={time} />
          <CustomInput label="Games" initialValue={games} />
        </div>
        <ToolButton
          label="Play"
          isDisabled={error ? true : isPlay}
          onClick={onPlay}
          isActive={false}
          icon={Play}
          background="blue"
        />
        <ToolButton
          label="Pause"
          isDisabled={!isPlay}
          onClick={onStop}
          isActive={false}
          icon={Pause}
          background="red"
        />
        <ToolButton
          label="Reset"
          onClick={onReset}
          isActive={false}
          icon={RotateCcw}
          background="red"
        />
        <Iterations />
        <Games />
        <div className="text-xs text-center px-1">
          <label>Total count</label>
          <div>{edges.length + nodes.length}</div>
        </div>
      </div>
    </Panel>
  );
};
```


## _components\panels\EdgeTypePanel.tsx

```tsx
import React from "react";

import { useChangeEdgeType } from "@/app/store/use-custom-edge";
import { EdgesTypes } from "@/app/types/structs";
import useStore from "@/app/store/store";

export const EdgeTypePanel = () => {
  const { onChangeEdgesType } = useChangeEdgeType();
  const { edgesType: currentEdgesTypeValue } = useStore.getState();

  const handleChangeEdgesType = (type: EdgesTypes) => {
    onChangeEdgesType(type);
    useStore.setState({
      edgesType: type,
    });
  };

  return (
    <div className="flex gap-x-2 items-center">
      <button
        className={`bg-blue-100 rounded-md p-2 ${
          currentEdgesTypeValue === EdgesTypes.DEFAULT
            ? "bg-blue-500 text-white"
            : ""
        }`}
        onClick={() => handleChangeEdgesType(EdgesTypes.DEFAULT)}
      >
        Default
      </button>
      <button
        className={`bg-blue-100 rounded-md p-2 ${
          currentEdgesTypeValue === EdgesTypes.SMOOTH_STEP
            ? "bg-blue-500 text-white"
            : ""
        }`}
        onClick={() => handleChangeEdgesType(EdgesTypes.SMOOTH_STEP)}
      >
        SmoothStep
      </button>
      <button
        className={`bg-blue-100 rounded-md mr-16 p-2 ${
          currentEdgesTypeValue === EdgesTypes.BEZIER
            ? "bg-blue-500 text-white"
            : ""
        }`}
        onClick={() => handleChangeEdgesType(EdgesTypes.BEZIER)}
      >
        Bezier
      </button>
    </div>
  );
};
```


## _components\panels\toolbar.tsx

```tsx
import { StructType } from "@/app/types/structs";
import { ToolButton } from "../ui/ToolButton";
import {
  ArrowLeftRight,
  Recycle,
  Play,
  Dices,
  Hourglass,
  CheckCheck,
  Undo,
  Redo,
  BadgePlus,
  BadgeMinus,
  Eraser,
} from "lucide-react";
import useStore, { RFState } from "@/app/store/store";
import { shallow } from "zustand/shallow";

interface ToolbarProps {
  canvasState: CanvasState;
  onClick: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  addNode: state.addNode,
});

export const Toolbar = () => {
  const { addNode } = useStore(selector, shallow);
  const { deleteAll } = useStore();

  return (
    <div className="absolute top-40 left-2 flex flex-col gap-y-4">
      <div className="bg-white rounded-md p-1.5 flex gap-y-1 flex-col items-center shadow-md">
        <ToolButton
          label="Source"
          onClick={() => addNode(StructType.Source)}
          isActive={false}
          icon={Play}
        />
        <ToolButton
          label="Pool"
          onClick={() => addNode(StructType.Pool)}
          isActive={false}
          icon={BadgePlus}
        />
        <ToolButton
          label="Consumer"
          onClick={() => addNode(StructType.Consumer)}
          isActive={false}
          icon={BadgeMinus}
        />
        <ToolButton
          label="Converter"
          onClick={() => addNode(StructType.Converter)}
          isActive={true}
          icon={Recycle}
        />
        <ToolButton
          label="Gate"
          onClick={() => addNode(StructType.Gate)}
          isActive={false}
          icon={ArrowLeftRight}
        />
        <ToolButton
          label="Random"
          onClick={() => addNode(StructType.Random)}
          isActive={false}
          icon={Dices}
        />
        <ToolButton
          label="Delay"
          onClick={() => addNode(StructType.Delay)}
          isActive={false}
          icon={Hourglass}
        />
        <ToolButton
          label="End"
          onClick={() => addNode(StructType.End)}
          isActive={false}
          icon={CheckCheck}
        />
      </div>
      {/* undo redo */}
      <div className="bg-white rounded-md p-1.5 flex flex-col items-center shadow-md">
        <ToolButton
          label="Undo"
          onClick={() => {}}
          isActive={false}
          icon={Undo}
        />
        <ToolButton
          label="Redo"
          onClick={() => {}}
          isActive={false}
          icon={Redo}
        />
        <ToolButton
          label="Eraser"
          onClick={deleteAll}
          isActive={false}
          icon={Eraser}
        />
      </div>
    </div>
  );
};
```


## _components\sidebar\sidebar-board.tsx

```tsx
import Link from "next/link";
import React from "react";
import { BoardTitle } from "../BoardInfoModal/BoardTitle";

interface TestIdPageProps {
  params: {
    boardId: string;
  };
}
const BoardSidebar = ({ params }: TestIdPageProps) => {
  return (
    <aside
      id="sidebar"
      className="bg-black text-white w-[150px] pt-10 pl-5 absolute inset-y-0 left-0 
                transform md:relative md:translate-x-0 md:flex
                 md:flex-col gap-y-6"
      data-dev-hint="sidebar">
         <BoardTitle boardId={params.boardId} />
          <Link href="/editor">
            <span>Editor</span>
          </Link>
          {/* <Link href="/lineage">
            <span>Lineage</span>
          </Link>
          <Link href="/tests">
            <span>Tests</span>
          </Link>
          <Link href="/tables">
            <span>Tables</span>
          </Link>
          <Link href="/macros">
            <span>Macros</span>
          </Link> */}
    </aside>
  );
};

export default BoardSidebar;
```


## _components\ui\EditableText\EditableText.module.scss

```scss
.editableContainer {
  cursor: pointer;
}

.editableText {
  padding: 4px 8px;
  border: 1px solid transparent;
  border-radius: 4px;

  &:hover {
    border-color: #ccc;
    background: #f5f5f5;
  }
}

.editableInput {
  padding: 4px 8px;
  border: 1px solid #007bff;
  border-radius: 4px;
  outline: none;
  background: white;

  &:hover {
    border-color: #0056b3;
  }
}
```


## _components\ui\EditableText\EditableText.tsx

```tsx
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
```


## _components\ui\EditableText\index.ts

```ts
import EditableText from "./EditableText";

export { EditableText };
```


## _components\ui\CustomInput.tsx

```tsx
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
```


## _components\ui\DownloadBtn.tsx

```tsx
import {
  getTransformForBounds,
  useReactFlow,
  getRectOfNodes,
} from "reactflow";
import { ToolButton } from "./ToolButton";
import { Download } from "lucide-react";

import { toPng } from "html-to-image";

function downloadImage(dataUrl: any) {
  const a = document.createElement("a");
  a.setAttribute("download", "scheme.png");
  a.setAttribute("href", dataUrl);
  a.click();
}

const imageWidth = 1024;
const imageHeight = 768;

export const DownloadBtn = () => {
  const { getNodes } = useReactFlow();
  const onDownload = () => {
    const nodesBounds = getRectOfNodes(getNodes());
    const transform = getTransformForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.5,
      2
    );
    //@ts-ignore
    toPng(document.querySelector(".react-flow__viewport"), {
      backgroundColor: "white",
      width: imageWidth,
      height: imageHeight,
      style: {
        width: imageWidth,
        height: imageHeight,
        transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
      },
    }).then(downloadImage);
  };
  return (
    <div>
      <ToolButton
        label="Download PNG"
        onClick={onDownload}
        isActive={false}
        icon={Download}
      />
    </div>
  );
};
```


## _components\ui\index.ts

```ts
import CustomInput from "./CustomInput";
import { EditableText } from "./EditableText";
import { ToolButton } from "./ToolButton";
import { DownloadBtn } from "./DownloadBtn";

export { CustomInput, EditableText, ToolButton, DownloadBtn };
```


## _components\ui\ToolButton.tsx

```tsx
"use client";

import { LucideIcon } from "lucide-react";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";

interface ToolButtonProps {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  isActive?: boolean;
  isDisabled?: boolean;
  background?: string
}

export const ToolButton = ({
  label,
  icon: Icon,
  onClick,
  isActive,
  isDisabled,
  background = "black"
}: ToolButtonProps) => {
  return (
    <Hint label={label}>
      <Button
        disabled={isDisabled}
        onClick={onClick}
        size="icon"
        style={{ margin: "1px", background: background }}
      >
        <Icon />
      </Button>
    </Hint>
  );
};
```


## _components\context-menu.tsx

```tsx
import React, { useCallback } from "react";
import { Node, useReactFlow } from "reactflow";
import "./../style-test.css"
import { useChangeEdgeType } from "@/app/store/use-custom-edge";

interface ContextMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  top?: any | boolean; // Выбор между числом и строкой для стилей
  left?: any | boolean;
  right?: any | boolean; // Необязательные свойства
  bottom?: any | boolean;
}

export default function ContextMenu({
  id,
  top,
  left,
  right,
  bottom,
  ...props
}: ContextMenuProps): React.JSX.Element {
  const { getNode, setNodes, addNodes, setEdges } = useReactFlow();
  const {setAnalytics} = useChangeEdgeType()
  const duplicateNode = useCallback(() => {
    const node: any = getNode(id);
    const position = {
      x: node.position.x + 50,
      y: node.position.y + 50,
    };

    addNodes({
      ...node,
      selected: false,
      dragging: false,
      id: `${node.id}-copy`,
      position,
    });
  }, [id, getNode, addNodes]);

  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id));
  }, [id, setNodes, setEdges]);


  return (
    <div
      style={{ top, left, right, bottom }}
      className="context-menu"
      {...props}
    >
      <button onClick={duplicateNode}>Copy</button>
      <button onClick={deleteNode}>Delete</button>
      <button onClick={() => setAnalytics(true)}>Analytics</button>
    </div>
  );
}
```


## _components\cursor.tsx

```tsx
"use client";

import { useOther } from "@/liveblocks.config";
import { MousePointer2 } from "lucide-react";
import { memo } from "react";

interface CursorProps {
  connectionId: number;
}

export const Cursor = memo(({ connectionId }: CursorProps) => {
  const info = useOther(connectionId, (user) => user?.info);
  const cursor = useOther(connectionId, (user) => user.presence.cursor);

  if (!cursor) {
    return null;
  }
  const { x, y } = cursor;
  const name = info?.name || "No name";

  return (
    <foreignObject
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        transform: `translateX(${x}px) translateY(${y}px)`,
      }}
      width={name.length * 10 + 24}
      height="50"
      viewBox="0 0 24 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <MousePointer2
        className="h-5 w-5"
        style={{
          fill: "red",
          color: "red",
        }}
      />
      <div
        className="absolute left-5 px-1.5 py-0.5 rounded-md text-xs text-white font-semibold"
        style={{ backgroundColor: "red" }}
      >
        {name}
      </div>
    </foreignObject>
  );
});

Cursor.displayName = "Cursor";
```


## _components\flow.tsx

```tsx
"use client";
import "reactflow/dist/style.css";
import ReactFlow, { Controls, Background, Panel } from "reactflow";
// import { shallow } from "zustand/shallow";
import { useMyPresence, useOthers } from "@/liveblocks.config";
import { Cursor } from "./cursor";
import { Toolbar } from "./panels/toolbar";
import { BottomPanel } from "./panels/bottom-panel";
import { DownloadBtn } from "./ui/DownloadBtn";
import useStore, { RFState } from "@/app/store/store";
import { edgeTypes, nodeTypes } from "@/app/types/structs";
import { useCallback, useEffect, useRef, useState } from "react";
import ContextMenu from "./context-menu";
import { useChangeEdgeType } from "@/app/store/use-custom-edge";
import { Metrics } from "./metrics/metrics";
import EditorComponent from "./editor/editorCoder";
import "./../style-test.css";
import { useRenameModal } from "@/app/store/use-rename-modal";
import BoardInfoModal from "./BoardInfoModal/BoardInfoModal";
import { ToolButton } from "./ui/ToolButton";
import { FileJson2, LayoutDashboard, HistoryIcon } from "lucide-react";
import { Loading } from "@/components/loading";
import { useVersionsHistory } from "@/app/hooks/useVersionsHistory";
import { Id } from "@/convex/_generated/dataModel";
import { useSaveHandlerOnHotkeyKeydown } from "@/app/hooks/useSaveHandlerOnKeydown";
import { HistoryModal } from "./HistoryModal";
import { useInitializeBoard } from "@/app/hooks/useInitializeBoard";

// const selector = (state: RFState) => ({
//   nodes: state.nodes,
//   edges: state.edges,
//   deleteNode: state.deleteNode,
//   onNodesChange: state.onNodesChange,
//   onEdgesChange: state.onEdgesChange,
//   onConnect: state.onConnect,
//   addNode: state.addNode,
// });
interface FlowProps {
  boardId: string;
}

interface IContextMenu {
  id: string;
  top: number;
  left: number;
  right: number | boolean;
  bottom: number | boolean;
}

const Flow = ({ boardId }: FlowProps) => {
  useInitializeBoard(boardId as Id<"boards">);

  const {
    liveblocks: { isStorageLoading },
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    deleteNode,
  } = useStore();
  const { autoSave, manualSave } = useVersionsHistory(boardId);
  useSaveHandlerOnHotkeyKeydown(manualSave);

  const [{ cursor }, updateMyPresence] = useMyPresence();
  const others = useOthers();
  const { isVisibleEditor, setIsVisisble, isVisibleBoard, setIsVisisbleBoard } =
    useRenameModal();
  const [isVisibleHistory, setIsVisisbleHistory] = useState(false);
  const { analytics, setAnalytics } = useChangeEdgeType();
  const [menu, setMenu] = useState<IContextMenu | null>(null);
  const ref = useRef(null);

  const onNodeContextMenu = useCallback(
    (event: any, node: any) => {
      event.preventDefault();
      //@ts-ignore
      const pane = ref.current?.getBoundingClientRect();
      let menu = {
        id: node.id,
        top: event.clientY < pane.height - 200 && event.clientY,
        left: event.clientX < pane.width + 200 && event.clientX,
        right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
        bottom:
          event.clientY >= pane.height - 200 && pane.height - event.clientY,
      };
      setMenu(menu);
    },
    [setMenu]
  );

  const onPaneClick = useCallback(() => {
    setMenu(null);
  }, [setMenu]);

  useEffect(() => {
    if (isStorageLoading) return;

    autoSave();
  }, [nodes, edges, autoSave, isStorageLoading]);

  if (isStorageLoading) {
    <Loading />;
  }

  return (
    <main
      className="h-full w-full relative bg-neutral-100 touch-none"
      onPointerMove={(event) => {
        updateMyPresence({
          cursor: {
            x: Math.round(event.clientX),
            y: Math.round(event.clientY),
          },
        });
      }}
      onPointerLeave={() =>
        updateMyPresence({
          cursor: null,
        })
      }
    >
      {!isVisibleEditor && (
        <div className="z-10 w-full relative">
          <Toolbar />
        </div>
      )}

      {others.map(({ connectionId, presence }) => {
        if (presence.cursor === null) {
          return null;
        }
        return <Cursor key={connectionId} connectionId={connectionId} />;
      })}

      <ReactFlow
        ref={ref}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneClick={onPaneClick}
        onNodeContextMenu={onNodeContextMenu}
      >
        {menu && <ContextMenu onClick={onPaneClick} {...menu} />}
        <Controls position="bottom-right" />

        {isVisibleEditor && (
          <Panel position="top-left" className="position_panel">
            <EditorComponent />
          </Panel>
        )}

        <Panel position="top-center">
          <div className="bg-white rounded-md p-1.5 flex gap-x-2 items-center shadow-md">
            <ToolButton
              label="Editor"
              onClick={setIsVisisble}
              isActive={false}
              icon={FileJson2}
            />
            <DownloadBtn />
            <ToolButton
              label="Board"
              onClick={() => {
                if (isVisibleHistory) {
                  setIsVisisbleHistory(!isVisibleHistory);
                }

                setIsVisisbleBoard();
              }}
              isActive={false}
              icon={LayoutDashboard}
            />
            <ToolButton
              label="History"
              onClick={() => {
                if (isVisibleBoard) {
                  setIsVisisbleBoard();
                }

                setIsVisisbleHistory(!isVisibleHistory);
              }}
              isActive={false}
              icon={HistoryIcon}
            />
          </div>
        </Panel>

        {!analytics && !isVisibleBoard && isVisibleHistory && (
          <Panel position="top-right" className="info_panel">
            <HistoryModal
              boardId={boardId}
              onSaveRestoredVersion={manualSave}
              onClose={() => setIsVisisbleHistory(false)}
            />
          </Panel>
        )}

        {!analytics && !isVisibleHistory && isVisibleBoard && (
          <Panel position="top-right" className="info_panel">
            <BoardInfoModal boardId={boardId} handleSaveVersion={manualSave} />
          </Panel>
        )}
        <Background color="blue" gap={16} className="bg-blue-100" />
        {analytics && <Metrics />}
        <BottomPanel />
      </ReactFlow>
    </main>
  );
};

export default Flow;
```


## _components\games.tsx

```tsx
"use client";

import { useAnimateScheme } from "@/app/store/use-animate-scheme";

export const Games = () => {
  const {  games, gamesCount } = useAnimateScheme();

  return (
    <div className="text-xs text-center px-2">
      <label>Games</label>
      <div className="flex gap-x-3 items-center">
        <div>{gamesCount}</div>
        <div>/</div>
        <div>{games}</div>
      </div>
    </div>
  );
};
```


## _components\iterations.tsx

```tsx
"use client";

import { useAnimateScheme } from "@/app/store/use-animate-scheme";

export const Iterations = () => {
  const { iterationsCount, iterations } = useAnimateScheme();

  return (
    <div className="text-xs text-center px-2">
      <label>Iterations</label>
      <div className="flex gap-x-3 items-center">
        <div>{iterationsCount}</div>
        <div>/</div>
        <div>{iterations}</div>
      </div>
    </div>
  );
};
```


## layout.tsx

```tsx
import { BoardTitle } from "./_components/BoardInfoModal/BoardTitle";
import BoardSidebar from "./_components/sidebar/sidebar-board";

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: {
    boardId: string;
  };
}

const DashboardLayout = ({ children, params }: DashboardLayoutProps) => {
  return (
    // <main className="relative min-h-screen md:flex overflow-hidden">
    //   <BoardSidebar params={params}/>
    //   <main
    //     id="content"
    //     className="flex-1 bg-gray-100 max-h-screen overflow-y-auto"
    //   >
        <div className="max-w-full mx-auto h-full">
                   {/* <InfoBoard boardId={params.boardId} /> */}
          <div className="h-full">{children}</div>
        </div>
    //    </main>
    //  </main>
  );
};

export default DashboardLayout;
```


## page.tsx

```tsx
import Flow from "./_components/Flow";
import { Room } from "@/components/room";
import { Loading } from "@/components/loading";

interface TestIdPageProps {
  params: {
    boardId: string;
  };
}

const TestIdPage = ({ params }: TestIdPageProps) => {
  return (
    <Room roomId={params.boardId} fallback={<Loading />}>
      <Flow boardId={params.boardId} />
    </Room>
  );
};

export default TestIdPage;
```


## style-test.css

```css
.context-menu {
  background: white;
  border-style: solid;
  box-shadow: 10px 19px 20px rgba(0, 0, 0, 10%);
  position: absolute;
  font-size: 0.8rem;
  font-weight: bold;
  border-radius: 8px;
  z-index: 10;
}

.context-menu button {
  border: none;
  display: block;
  padding: 0.5em;
  text-align: left;
  width: 100%;
}

.context-menu button:hover {
  background: rgb(234, 248, 252);
  border-radius: 8px;
}

.position_panel {
  margin-top: 0 !important;
  margin-left: 0 !important;
  height: 785px !important;
  z-index: 100 !important;
}
.info_panel {
  margin-top: 0 !important;
  margin-right: 0 !important;
}
.analytics_panel {
  background: white;
  margin-top: 0 !important;
  margin-right: 0 !important;
  z-index: 10000 !important;
  width: 450px;
  height: 785px;
  overflow-y: auto !important;
  padding-top: 10px;
}
.values_analytics {
  margin: 2px 50px 20px;
}
.analytics__title {
  display: flex;
  justify-content: space-between;
}
.vesrsions-diff_panel {
  margin-top: 0 !important;
  margin-left: 0 !important;
  width: 850px !important;
  z-index: 100 !important;
  position: fixed;
  padding-left: 100px;
}
```
```


## app\test\[boardId]\style-test.css

```css
.context-menu {
  background: white;
  border-style: solid;
  box-shadow: 10px 19px 20px rgba(0, 0, 0, 10%);
  position: absolute;
  font-size: 0.8rem;
  font-weight: bold;
  border-radius: 8px;
  z-index: 10;
}

.context-menu button {
  border: none;
  display: block;
  padding: 0.5em;
  text-align: left;
  width: 100%;
}

.context-menu button:hover {
  background: rgb(234, 248, 252);
  border-radius: 8px;
}

.position_panel {
  margin-top: 0 !important;
  margin-left: 0 !important;
  height: 785px !important;
  z-index: 100 !important;
}
.info_panel {
  margin-top: 0 !important;
  margin-right: 0 !important;
}
.analytics_panel {
  background: white;
  margin-top: 0 !important;
  margin-right: 0 !important;
  z-index: 10000 !important;
  width: 450px;
  height: 785px;
  overflow-y: auto !important;
  padding-top: 10px;
}
.values_analytics {
  margin: 2px 50px 20px;
}
.analytics__title {
  display: flex;
  justify-content: space-between;
}
.vesrsions-diff_panel {
  margin-top: 0 !important;
  margin-left: 0 !important;
  width: 850px !important;
  z-index: 100 !important;
  position: fixed;
  padding-left: 100px;
}
```


## app\types\canvas.ts

```ts
export type Color = {
    r: number;
    g: number;
    b: number;
};

export type Camera = {
    x: number;
    y: number;
};
//canvas tools
export enum LayerType {
    Rectangle,
    Ellipse,
    Path,
    Text,
    Note,
    Source,
    Arrow
};

export type RectangleLayer = {
    type: LayerType.Rectangle;
    x: number;
    y: number;
    height: number;
    width: number;
    fill: Color;
    value?: string;
};

export type EllipseLayer = {
    type: LayerType.Ellipse;
    x: number;
    y: number;
    height: number;
    width: number;
    fill: Color;
    value?: string;
};

export type PathLayer = {
    type: LayerType.Path;
    x: number;
    y: number;
    height: number;
    width: number;
    fill: Color;
    points: number[][];
    value?: string;
};

export type ArrowLayer = {
    type: LayerType.Arrow;
    x: number;
    y: number;
    height: number;
    width: number;
    fill: Color;
    value?: string;
};

export type TextLayer = {
    type: LayerType.Text;
    x: number;
    y: number;
    height: number;
    width: number;
    fill: Color;
    value?: string;
};

export type NoteLayer = {
    type: LayerType.Note;
    x: number;
    y: number;
    height: number;
    width: number;
    fill: Color;
    value?: string;
};

export type SourceStruct = {
    type: LayerType.Source;
    x: number;
    y: number;
    height: number;
    width: number;
    fill: Color;
    value?: string;
};

export type Point = {
    x: number;
    y: number;
};

export type XYWH = {
    x: number;
    y: number;
    width: number;
    height: number;
};

export enum Side {
    Top = 1,
    Bottom = 2,
    Left = 4,
    Right = 8,
};

export type CanvasState =
    | {
        mode: CanvasMode.None;
    }
    | {
        mode: CanvasMode.SelectionNet,
        origin: Point;
        current?: Point;
    }
    | {
        mode: CanvasMode.Translating,
        current: Point;
    }
    | {
        mode: CanvasMode.Inserting,
        layerType: LayerType.Ellipse | LayerType.Rectangle | LayerType.Text | LayerType.Note | LayerType.Arrow;
    }
    | {
        mode: CanvasMode.Pencil,
    }
    | {
        mode: CanvasMode.Pressing,
        origin: Point;
    }
    | {
        mode: CanvasMode.Resizing,
        initialBounds: XYWH;
        corner: Side;
    };

export enum CanvasMode {
    None,
    Pressing,
    SelectionNet,
    Translating,
    Inserting,
    Resizing,
    Pencil,
};

export type Layer = RectangleLayer | EllipseLayer | PathLayer | TextLayer | NoteLayer | SourceStruct | ArrowLayer
```


## app\types\history.ts

```ts
import { Node, Edge } from "reactflow";

export type BoardState = {
  title: string;
  description: string;
  edgesType: string;
  nodes: Node[];
  edges: Edge[];
  version: number;
  createdAt: number;
};

export type PreviousState = Omit<
  BoardState,
  "title" | "description" | "edgesType"
>;

export type BoardStateData = Omit<PreviousState, "version" | "createdAt">;

export enum BoardSavingStatus {
  IDLE = "idle",
  SAVING = "saving",
  ERROR = "error",
}
```


## app\types\structs.ts

```ts
import { Node } from "reactflow";
import CustomEdge from "../test/[boardId]/_components/_structs/custom-edge";
import CustomNode from "./../test/[boardId]/_components/_structs/custom-node";
import SourceNode from "./../test/[boardId]/_components/_structs/nodeComponents/sourceNode";
import PoolNode from "./../test/[boardId]/_components/_structs/nodeComponents/poolNode";
import ConsumerNode from "./../test/[boardId]/_components/_structs/nodeComponents/consumerNode";
import ConverterNode from "./../test/[boardId]/_components/_structs/nodeComponents/converterNode";
import GateNode from "./../test/[boardId]/_components/_structs/nodeComponents/gateNode";
import RandomNode from "./../test/[boardId]/_components/_structs/nodeComponents/randomNode";
import DelayNode from "./../test/[boardId]/_components/_structs/nodeComponents/delayNode";
import EndNode from "./../test/[boardId]/_components/_structs/nodeComponents/endNode";
import consumerNode from "./../test/[boardId]/_components/_structs/nodeComponents/consumerNode";

enum StructType {
  Source = "Source",
  Pool = "Pool",
  Consumer = "Consumer",
  Converter = "Converter",
  Gate = "Gate",
  Random = "Random",
  Delay = "Delay",
  End = "End",
}
export { StructType };

export enum EdgesTypes {
  DEFAULT = "Default",
  SMOOTH_STEP = "SmoothStep",
  BEZIER = "Bezier",
}

export type SourceStruct = {
  id: number | string;
  type: StructType.Source;
  value?: string;
};

export type PoolStruct = {
  id: number | string;
  type: StructType.Pool;
  value?: string;
};

export type ConsumerStruct = {
  id: number | string;
  type: StructType.Consumer;
  value?: string;
};

export type ConverterStruct = {
  id: number | string;
  type: StructType.Converter;
  value?: string;
};

export type GateStruct = {
  id: number | string;
  type: StructType.Gate;
  value?: string;
};

export type RandomStruct = {
  id: number | string;
  type: StructType.Random;
  value?: string;
};

export type DelayStruct = {
  id: number | string;
  type: StructType.Delay;
  value?: string;
};

export type EndStruct = {
  id: number | string;
  type: StructType.End;
  value?: string;
};

export type Structs =
  | SourceStruct
  | PoolStruct
  | ConsumerStruct
  | ConverterStruct
  | GateStruct
  | RandomStruct
  | DelayStruct
  | EndStruct;

export const nodeTypes = {
  textUpdater: CustomNode,
  sourceNode: SourceNode,
  poolNode: PoolNode,
  consumerNode: ConsumerNode,
  converterNode: ConverterNode,
  gateNode: GateNode,
  randomNode: RandomNode,
  delayNode: DelayNode,
  endNode: EndNode,
};
export const edgeTypes = { custom: CustomEdge };

export interface Graph {
  id: number;
  countComponents: number;
  owner: string;
  created: string;
  modified: string;
  title: string;
  description: string;
}

export interface CustomNode extends Node {
  sourceStruct: SourceStruct;
  name: string;
  value: string;
}
```


## app\globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
 
html,
body,
:root {
  height: 100%;
}

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;

    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
 
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
 
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
 
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
 
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
 
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
 
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
 
    --radius: 0.5rem;
  }
 
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
 
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
 
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
 
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
 
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
 
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
 
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
 
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
 
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}
 
@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```


## app\layout.tsx

```tsx
import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ConvexClientProvider } from "@/providers/convex-client-provider";
import { Toaster } from "@/components/ui/sonner";
import { ModalProvider } from "@/providers/modal-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Game balancing tool",
  description: "Online game balancing tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConvexClientProvider>
          <Toaster />
          <ModalProvider />
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
```


## components\modals\rename-modal.tsx

```tsx
"use client";

import { FormEventHandler, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogClose,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useRenameModal } from "@/app/store/use-rename-modal";
import { useApiMutation } from "@/app/hooks/use-api-mutation";

export const RenameModal = () => {
  const { mutate, pending } = useApiMutation(api.board.updateTitle);
  const { isOpen, onClose, initialValues } = useRenameModal();
  const [title, setTitle] = useState(initialValues.title);

  useEffect(() => {
    setTitle(initialValues.title);
  }, [initialValues.title]);

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    mutate({
      id: initialValues.id,
      title,
    })
      .then(() => {
        toast.success("Board renamed");
        onClose();
      })
      .catch(() => toast.error("Failed to rename board"));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit board title</DialogTitle>
        </DialogHeader>
        <DialogDescription>Enter a new title for this board</DialogDescription>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            disabled={pending}
            required
            maxLength={60}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Board title"
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button disabled={pending} type="submit">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
```


## components\ui\alert-dialog.tsx

```tsx
"use client"

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

import { cn } from "@/utils/canvas"
import { buttonVariants } from "@/components/ui/button"

const AlertDialog = AlertDialogPrimitive.Root

const AlertDialogTrigger = AlertDialogPrimitive.Trigger

const AlertDialogPortal = AlertDialogPrimitive.Portal

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    />
  </AlertDialogPortal>
))
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants(), className)}
    {...props}
  />
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className
    )}
    {...props}
  />
))
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
```


## components\ui\avatar.tsx

```tsx
"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/utils/canvas"

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
```


## components\ui\button.tsx

```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/utils/canvas"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```


## components\ui\dialog.tsx

```tsx
"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/utils/canvas"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
```


## components\ui\dropdown-menu.tsx

```tsx
"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/utils/canvas"

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}
```


## components\ui\input.tsx

```tsx
import * as React from "react"

import { cn } from "@/utils/canvas"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
```


## components\ui\sonner.tsx

```tsx
"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
```


## components\ui\tooltip.tsx

```tsx
"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/utils/canvas"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
```


## components\actions.tsx

```tsx
"use client";

import { toast } from "sonner";
import { Link2, Pencil, Trash2 } from "lucide-react";
import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useApiMutation } from "@/app/hooks/use-api-mutation";
import { useRenameModal } from "@/app/store/use-rename-modal";
import { ConfirmModal } from "./confirm-modal";

interface ActionsProps {
  children: React.ReactNode;
  side?: DropdownMenuContentProps["side"];
  sideOffset?: DropdownMenuContentProps["sideOffset"];
  id: string;
  title: string;
}

export const Actions = ({
  children,
  side,
  sideOffset,
  id,
  title,
}: ActionsProps) => {
  const { onOpen } = useRenameModal();
  const { mutate, pending } = useApiMutation(api.board.remove);

  const onCopyLink = () => {
    navigator.clipboard
      .writeText(`${window.location.origin}/test/${id}`)
      .then(() => toast.success("Link copied"))
      .catch(() => toast.error("Failed to copy link"));
  };

  const onDelete = () => {
    mutate({ id })
      .then(() => toast.success("Board deleted"))
      .catch(() => toast.error("Failed to delete board"));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        onClick={(e) => e.stopPropagation()}
        side={side}
        sideOffset={sideOffset}
        className="w-60"
      >
        <DropdownMenuItem onClick={onCopyLink} className="p-3 cursor-pointer">
          <Link2 className="h-4 w-4 mr-2" />
          Copy board link
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onOpen(id, title)}
          className="p-3 cursor-pointer"
        >
          <Pencil className="h-4 w-4 mr-2" />
          Rename
        </DropdownMenuItem>
        <ConfirmModal
          header="Delete board?"
          description="This will delete the board and all of its contents."
          disabled={pending}
          onConfirm={onDelete}
        >
          <Button
            variant="ghost"
            className="p-3 cursor-pointer text-sm w-full justify-start font-normal"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button> 
        </ConfirmModal>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
```


## components\confirm-modal.tsx

```tsx
"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ConfirmModalProps {
  children: React.ReactNode;
  onConfirm: () => void;
  disabled?: boolean;
  header: string;
  description?: string;
}

export const ConfirmModal = ({
  children,
  onConfirm,
  disabled,
  header,
  description,
}: ConfirmModalProps) => {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{header}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={disabled} onClick={handleConfirm}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
```


## components\hint.tsx

```tsx
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface HintProps {
  label: string;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
}

export const Hint = ({
  label,
  children,
  side,
  align,
  sideOffset,
  alignOffset,
}: HintProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          className="text-white bg-black border-black"
          side={side}
          align={align}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
        >
          <p className="font-semibold capitalize">{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
```


## components\loading.tsx

```tsx
import Image from "next/image";

export const Loading = () => {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <Image
        src="/spin.svg"
        alt="loading"
        width={120}
        height={120}
        className="animate-pulse duration-700"
      />
    </div>
  );
};
```


## components\room.tsx

```tsx
"use client";

import { ClientSideSuspense } from "@liveblocks/react";
import { LiveMap, LiveList, LiveObject } from "@liveblocks/client";

import { RoomProvider } from "@/liveblocks.config";
import { Layer } from "@/app/types/canvas";
import useStore from "@/app/store/store";
import { useEffect } from "react";

interface RoomProps {
  children: React.ReactNode;
  roomId: string;
  fallback: NonNullable<React.ReactNode> | null;
}

export const Room = ({ children, roomId, fallback }: RoomProps) => {
  const {
    liveblocks: { enterRoom, leaveRoom },
  } = useStore();

  useEffect(() => {
    enterRoom(roomId);
    return () => leaveRoom();
  }, [enterRoom, leaveRoom, roomId]);

  return (
    <RoomProvider
      id={roomId}
      initialPresence={{
        cursor: null,
        selection: [],
        // для рисования карандашем
        pencilDraft: null,
        penColor: null,
      }}
      initialStorage={{
        layers: new LiveMap<string, LiveObject<Layer>>(),
        layerIds: new LiveList([]),
      }}
    >
      <ClientSideSuspense fallback={fallback}>
        {() => children}
      </ClientSideSuspense>
    </RoomProvider>
  );
};
```


## convex\_generated\api.d.ts

```ts
/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as board from "../board.js";
import type * as boards from "../boards.js";
import type * as boardsHistory from "../boardsHistory.js";
import type * as validators_boardData from "../validators/boardData.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  board: typeof board;
  boards: typeof boards;
  boardsHistory: typeof boardsHistory;
  "validators/boardData": typeof validators_boardData;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
```


## convex\_generated\api.js

```js
/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import { anyApi } from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export const api = anyApi;
export const internal = anyApi;
```


## convex\_generated\dataModel.d.ts

```ts
/* eslint-disable */
/**
 * Generated data model types.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  DataModelFromSchemaDefinition,
  DocumentByName,
  TableNamesInDataModel,
  SystemTableNames,
} from "convex/server";
import type { GenericId } from "convex/values";
import schema from "../schema.js";

/**
 * The names of all of your Convex tables.
 */
export type TableNames = TableNamesInDataModel<DataModel>;

/**
 * The type of a document stored in Convex.
 *
 * @typeParam TableName - A string literal type of the table name (like "users").
 */
export type Doc<TableName extends TableNames> = DocumentByName<
  DataModel,
  TableName
>;

/**
 * An identifier for a document in Convex.
 *
 * Convex documents are uniquely identified by their `Id`, which is accessible
 * on the `_id` field. To learn more, see [Document IDs](https://docs.convex.dev/using/document-ids).
 *
 * Documents can be loaded using `db.get(id)` in query and mutation functions.
 *
 * IDs are just strings at runtime, but this type can be used to distinguish them from other
 * strings when type checking.
 *
 * @typeParam TableName - A string literal type of the table name (like "users").
 */
export type Id<TableName extends TableNames | SystemTableNames> =
  GenericId<TableName>;

/**
 * A type describing your Convex data model.
 *
 * This type includes information about what tables you have, the type of
 * documents stored in those tables, and the indexes defined on them.
 *
 * This type is used to parameterize methods like `queryGeneric` and
 * `mutationGeneric` to make them type-safe.
 */
export type DataModel = DataModelFromSchemaDefinition<typeof schema>;
```


## convex\_generated\server.d.ts

```ts
/* eslint-disable */
/**
 * Generated utilities for implementing server-side Convex query and mutation functions.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import {
  ActionBuilder,
  HttpActionBuilder,
  MutationBuilder,
  QueryBuilder,
  GenericActionCtx,
  GenericMutationCtx,
  GenericQueryCtx,
  GenericDatabaseReader,
  GenericDatabaseWriter,
} from "convex/server";
import type { DataModel } from "./dataModel.js";

/**
 * Define a query in this Convex app's public API.
 *
 * This function will be allowed to read your Convex database and will be accessible from the client.
 *
 * @param func - The query function. It receives a {@link QueryCtx} as its first argument.
 * @returns The wrapped query. Include this as an `export` to name it and make it accessible.
 */
export declare const query: QueryBuilder<DataModel, "public">;

/**
 * Define a query that is only accessible from other Convex functions (but not from the client).
 *
 * This function will be allowed to read from your Convex database. It will not be accessible from the client.
 *
 * @param func - The query function. It receives a {@link QueryCtx} as its first argument.
 * @returns The wrapped query. Include this as an `export` to name it and make it accessible.
 */
export declare const internalQuery: QueryBuilder<DataModel, "internal">;

/**
 * Define a mutation in this Convex app's public API.
 *
 * This function will be allowed to modify your Convex database and will be accessible from the client.
 *
 * @param func - The mutation function. It receives a {@link MutationCtx} as its first argument.
 * @returns The wrapped mutation. Include this as an `export` to name it and make it accessible.
 */
export declare const mutation: MutationBuilder<DataModel, "public">;

/**
 * Define a mutation that is only accessible from other Convex functions (but not from the client).
 *
 * This function will be allowed to modify your Convex database. It will not be accessible from the client.
 *
 * @param func - The mutation function. It receives a {@link MutationCtx} as its first argument.
 * @returns The wrapped mutation. Include this as an `export` to name it and make it accessible.
 */
export declare const internalMutation: MutationBuilder<DataModel, "internal">;

/**
 * Define an action in this Convex app's public API.
 *
 * An action is a function which can execute any JavaScript code, including non-deterministic
 * code and code with side-effects, like calling third-party services.
 * They can be run in Convex's JavaScript environment or in Node.js using the "use node" directive.
 * They can interact with the database indirectly by calling queries and mutations using the {@link ActionCtx}.
 *
 * @param func - The action. It receives an {@link ActionCtx} as its first argument.
 * @returns The wrapped action. Include this as an `export` to name it and make it accessible.
 */
export declare const action: ActionBuilder<DataModel, "public">;

/**
 * Define an action that is only accessible from other Convex functions (but not from the client).
 *
 * @param func - The function. It receives an {@link ActionCtx} as its first argument.
 * @returns The wrapped function. Include this as an `export` to name it and make it accessible.
 */
export declare const internalAction: ActionBuilder<DataModel, "internal">;

/**
 * Define an HTTP action.
 *
 * This function will be used to respond to HTTP requests received by a Convex
 * deployment if the requests matches the path and method where this action
 * is routed. Be sure to route your action in `convex/http.js`.
 *
 * @param func - The function. It receives an {@link ActionCtx} as its first argument.
 * @returns The wrapped function. Import this function from `convex/http.js` and route it to hook it up.
 */
export declare const httpAction: HttpActionBuilder;

/**
 * A set of services for use within Convex query functions.
 *
 * The query context is passed as the first argument to any Convex query
 * function run on the server.
 *
 * This differs from the {@link MutationCtx} because all of the services are
 * read-only.
 */
export type QueryCtx = GenericQueryCtx<DataModel>;

/**
 * A set of services for use within Convex mutation functions.
 *
 * The mutation context is passed as the first argument to any Convex mutation
 * function run on the server.
 */
export type MutationCtx = GenericMutationCtx<DataModel>;

/**
 * A set of services for use within Convex action functions.
 *
 * The action context is passed as the first argument to any Convex action
 * function run on the server.
 */
export type ActionCtx = GenericActionCtx<DataModel>;

/**
 * An interface to read from the database within Convex query functions.
 *
 * The two entry points are {@link DatabaseReader.get}, which fetches a single
 * document by its {@link Id}, or {@link DatabaseReader.query}, which starts
 * building a query.
 */
export type DatabaseReader = GenericDatabaseReader<DataModel>;

/**
 * An interface to read from and write to the database within Convex mutation
 * functions.
 *
 * Convex guarantees that all writes within a single mutation are
 * executed atomically, so you never have to worry about partial writes leaving
 * your data in an inconsistent state. See [the Convex Guide](https://docs.convex.dev/understanding/convex-fundamentals/functions#atomicity-and-optimistic-concurrency-control)
 * for the guarantees Convex provides your functions.
 */
export type DatabaseWriter = GenericDatabaseWriter<DataModel>;
```


## convex\_generated\server.js

```js
/* eslint-disable */
/**
 * Generated utilities for implementing server-side Convex query and mutation functions.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import {
  actionGeneric,
  httpActionGeneric,
  queryGeneric,
  mutationGeneric,
  internalActionGeneric,
  internalMutationGeneric,
  internalQueryGeneric,
} from "convex/server";

/**
 * Define a query in this Convex app's public API.
 *
 * This function will be allowed to read your Convex database and will be accessible from the client.
 *
 * @param func - The query function. It receives a {@link QueryCtx} as its first argument.
 * @returns The wrapped query. Include this as an `export` to name it and make it accessible.
 */
export const query = queryGeneric;

/**
 * Define a query that is only accessible from other Convex functions (but not from the client).
 *
 * This function will be allowed to read from your Convex database. It will not be accessible from the client.
 *
 * @param func - The query function. It receives a {@link QueryCtx} as its first argument.
 * @returns The wrapped query. Include this as an `export` to name it and make it accessible.
 */
export const internalQuery = internalQueryGeneric;

/**
 * Define a mutation in this Convex app's public API.
 *
 * This function will be allowed to modify your Convex database and will be accessible from the client.
 *
 * @param func - The mutation function. It receives a {@link MutationCtx} as its first argument.
 * @returns The wrapped mutation. Include this as an `export` to name it and make it accessible.
 */
export const mutation = mutationGeneric;

/**
 * Define a mutation that is only accessible from other Convex functions (but not from the client).
 *
 * This function will be allowed to modify your Convex database. It will not be accessible from the client.
 *
 * @param func - The mutation function. It receives a {@link MutationCtx} as its first argument.
 * @returns The wrapped mutation. Include this as an `export` to name it and make it accessible.
 */
export const internalMutation = internalMutationGeneric;

/**
 * Define an action in this Convex app's public API.
 *
 * An action is a function which can execute any JavaScript code, including non-deterministic
 * code and code with side-effects, like calling third-party services.
 * They can be run in Convex's JavaScript environment or in Node.js using the "use node" directive.
 * They can interact with the database indirectly by calling queries and mutations using the {@link ActionCtx}.
 *
 * @param func - The action. It receives an {@link ActionCtx} as its first argument.
 * @returns The wrapped action. Include this as an `export` to name it and make it accessible.
 */
export const action = actionGeneric;

/**
 * Define an action that is only accessible from other Convex functions (but not from the client).
 *
 * @param func - The function. It receives an {@link ActionCtx} as its first argument.
 * @returns The wrapped function. Include this as an `export` to name it and make it accessible.
 */
export const internalAction = internalActionGeneric;

/**
 * Define a Convex HTTP action.
 *
 * @param func - The function. It receives an {@link ActionCtx} as its first argument, and a `Request` object
 * as its second.
 * @returns The wrapped endpoint function. Route a URL path to this function in `convex/http.js`.
 */
export const httpAction = httpActionGeneric;
```


## convex\validators\boardData.ts

```ts
import { Infer, v } from "convex/values";
import { MarkerType } from "reactflow";

export const boardEdgesTypeValue = v.union(
  v.literal("Default"),
  v.literal("SmoothStep"),
  v.literal("Bezier")
);

const boardHistoryTypeValue = v.union(
  v.literal("snapshot"),
  v.literal("patch")
);

const positionConvexValue = v.object({
  x: v.number(),
  y: v.number(),
});

const nodeDataConvexValue = v.object({
  label: v.union(v.string(), v.number()),
  struct: v.string(),
  name: v.string(),
});

const nodeConvexValue = v.object({
  id: v.string(),
  type: v.string(),
  width: v.number(),
  height: v.number(),
  selected: v.boolean(),
  dragging: v.boolean(),
  positionAbsolute: positionConvexValue,
  position: positionConvexValue,
  data: nodeDataConvexValue,
});

const edgeMarkerEndConvexValue = v.object({
  type: v.union(v.literal(MarkerType.Arrow), v.literal(MarkerType.ArrowClosed)),
  width: v.number(),
  height: v.number(),
  color: v.string(),
});

const edgeConvexValue = v.object({
  source: v.string(),
  target: v.string(),
  id: v.string(),
  type: v.string(),
  animated: v.boolean(),
  data: v.union(v.number(), v.float64(), v.string()),
  selected: v.boolean(),
  markerEnd: v.optional(v.union(v.string(), edgeMarkerEndConvexValue)),
});

const boardDataSnapshotConvexValue = v.object({
  nodes: v.array(nodeConvexValue),
  edges: v.array(edgeConvexValue),
  // layerIds: v.array(v.string()),
  // layers: layersConvexRecord,
});

// const layersFillConvexValue = v.object({
//   r: v.number(),
//   g: v.number(),
//   b: v.number(),
// });

// const layersConvexValue = v.object({
//   type: v.number(),
//   x: v.number(),
//   y: v.number(),
//   height: v.number(),
//   width: v.number(),
//   fill: layersFillConvexValue,
// });

// const layersConvexRecord = v.record(v.string(), layersConvexValue);

const patchesOperationUnionValue = v.union(
  v.literal("add"),
  v.literal("remove"),
  v.literal("replace")
);

const patchConvexValue = v.object({
  op: v.union(v.literal("add"), v.literal("remove"), v.literal("replace")),
  path: v.string(),
  value: v.optional(v.any()),
  oldValue: v.optional(v.any()),
});

const boardDataPatchConvexValue = v.object({
  patches: v.array(patchConvexValue),
  base: v.number(), // Базовый снэпшот
});

const boardHistoryDataValue = v.union(
  boardDataSnapshotConvexValue,
  boardDataPatchConvexValue
);

export {
  boardHistoryTypeValue,
  boardHistoryDataValue,
  boardDataSnapshotConvexValue,
  boardDataPatchConvexValue,
};

export type TBoardEdgesType = Infer<typeof boardEdgesTypeValue>;
export type TBoardHistoryRecordType = Infer<typeof boardHistoryTypeValue>;
export type TBoardHistoryRecordData = Infer<typeof boardHistoryDataValue>;

// Типы для данных доски
export type TPositionValue = Infer<typeof positionConvexValue>;
export type TNodeDataValue = Infer<typeof nodeDataConvexValue>;
export type TNodeValue = Infer<typeof nodeConvexValue>;
export type TEdgeMarkerEndValue = Infer<typeof edgeMarkerEndConvexValue>;
export type TEdgeValue = Infer<typeof edgeConvexValue>;
// export type TLayersFillValue = Infer<typeof layersFillConvexValue>;
// export type TLayerValueValue = Infer<typeof layersConvexValue>;
// export type TLayersValue = Infer<typeof layersConvexRecord>;

// Типы для операций патчей
export type TPatchOperationValue = Infer<typeof patchesOperationUnionValue>;
export type TPatchValue = Infer<typeof patchConvexValue>;

// Типы для данных записи в истории
export type TBoardSnapshotDataValue = Infer<
  typeof boardDataSnapshotConvexValue
>;
export type TBoardPatchDataValue = Infer<typeof boardDataPatchConvexValue>;
```


## convex\auth.config.ts

```ts
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationID: "convex",
    },
  ],
};
```


## convex\board.ts

```ts
import { v } from "convex/values";

import { api } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import {
  boardEdgesTypeValue,
  TBoardPatchDataValue,
  TBoardSnapshotDataValue,
} from "./validators/boardData";
import { applyPatches } from "../utils/jsonDiff";

export const create = mutation({
  args: {
    orgId: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const boardId = await ctx.db.insert("boards", {
      orgId: args.orgId,
      authorId: identity.subject,
      authorName: identity.name!,
      imageUrl: "/placeholders/example.png",
      title: args.title,
      description: "",
      edgesType: "Default",
      currentVersion: 0,
      //head: "" as Id<"boardsHistory">,
    });

    // Создаем начальный снапшот
    const snapshotId = await ctx.db.insert("boardsHistory", {
      boardId: boardId,
      version: 0,
      type: "snapshot",
      data: { nodes: [], edges: [] },
      authorId: identity.subject,
      authorName: identity.name!,
    });

    // Обновляем head доски
    await ctx.db.patch(boardId, { head: snapshotId });

    return boardId;
  },
});

export const updateHead = mutation({
  args: {
    boardId: v.id("boards"),
    newHead: v.id("boardsHistory"),
    newVersion: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.boardId, {
      currentVersion: args.newVersion,
      head: args.newHead,
    });
  },
});

export const updateTitle = mutation({
  args: { id: v.id("boards"), title: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const title = args.title.trim();

    if (!title) {
      throw new Error("Title is required");
    }

    if (title.length > 60) {
      throw new Error("Title cannot be longer than 60 characters");
    }

    const board = await ctx.db.patch(args.id, {
      title: args.title,
    });

    return board;
  },
});

export const updateMetaInfo = mutation({
  args: {
    id: v.id("boards"),
    title: v.string(),
    description: v.string(),
    edgesType: boardEdgesTypeValue,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const title = args.title.trim();

    if (title.length > 60) {
      throw new Error("Title cannot be longer than 60 characters");
    }

    const board = await ctx.db.patch(args.id, {
      title: args.title,
      description: args.description.trim(),
      edgesType: args.edgesType,
      updatedTime: Date.now(),
    });

    return board;
  },
});

export const remove = mutation({
  args: { id: v.id("boards") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const userId = identity.subject;

    const historyRecords = await ctx.db
      .query("boardsHistory")
      .withIndex("by_board", (q) => q.eq("boardId", args.id))
      .collect();

    await Promise.all(
      historyRecords.map((record) => ctx.db.delete(record._id))
    );

    const existingFavorite = await ctx.db
      .query("userFavorites")
      .withIndex("by_user_board", (q) =>
        q.eq("userId", userId).eq("boardId", args.id)
      )
      .unique();

    if (existingFavorite) {
      await ctx.db.delete(existingFavorite._id);
    }

    await ctx.db.delete(args.id);

    return { success: true };
  },
});

export const favorite = mutation({
  args: { id: v.id("boards"), orgId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const board = await ctx.db.get(args.id);

    if (!board) {
      throw new Error("Board not found");
    }

    const userId = identity.subject;

    const existingFavorite = await ctx.db
      .query("userFavorites")
      .withIndex("by_user_board", (q) =>
        q.eq("userId", userId).eq("boardId", board._id)
      )
      .unique();

    if (existingFavorite) {
      throw new Error("Board already favorited");
    }

    await ctx.db.insert("userFavorites", {
      userId,
      boardId: board._id,
      orgId: args.orgId,
    });

    return board;
  },
});

export const unfavorite = mutation({
  args: { id: v.id("boards") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const board = await ctx.db.get(args.id);

    if (!board) {
      throw new Error("Board not found");
    }

    const userId = identity.subject;

    const existingFavorite = await ctx.db
      .query("userFavorites")
      .withIndex("by_user_board", (q) =>
        q.eq("userId", userId).eq("boardId", board._id)
      )
      .unique();

    if (!existingFavorite) {
      throw new Error("Favorite board not found");
    }

    await ctx.db.delete(existingFavorite._id);

    return board;
  },
});

export const get = query({
  args: { id: v.id("boards") },
  handler: async (ctx, args) => {
    try {
      const board = await ctx.db.get(args.id);
      return board;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
});

export const loadBoardState = query({
  args: { boardId: v.id("boards") },
  handler: async (ctx, args) => {
    const board = await ctx.db.get(args.boardId);
    if (!board) throw new Error("Board not found");

    // Получаем последнюю версию из истории
    const headVersion = await ctx.db
      .query("boardsHistory")
      .withIndex("by_board_version", (q) =>
        q.eq("boardId", args.boardId).eq("version", board.currentVersion)
      )
      .unique();

    if (!headVersion) throw new Error("Head version not found");

    // Восстанавливаем состояние через цепочку версий
    let state: TBoardSnapshotDataValue;

    if (headVersion.type === "snapshot") {
      state = headVersion.data as TBoardSnapshotDataValue;
    } else {
      const baseVersion = await ctx.db
        .query("boardsHistory")
        .withIndex("by_board_version", (q) =>
          q
            .eq("boardId", args.boardId)
            .eq("version", (headVersion.data as TBoardPatchDataValue).base)
        )
        .unique();

      if (!baseVersion) throw new Error("Base version not found");

      const baseState = await ctx.runQuery(api.boardsHistory.restoreVersion, {
        versionId: baseVersion._id,
      });

      state = applyPatches(
        baseState,
        (headVersion.data as TBoardPatchDataValue).patches
      );
    }

    return {
      nodes: state.nodes,
      edges: state.edges,
      version: headVersion.version,
      title: board.title,
      description: board.description,
      edgesType: board.edgesType,
      _creationTime: headVersion._creationTime,
    };
  },
});
```


## convex\boards.ts

```ts
import { v } from "convex/values";
import { getAllOrThrow } from "convex-helpers/server/relationships";

import { query } from "./_generated/server";

export const get = query({
  args: {
    orgId: v.string(),
    search: v.optional(v.string()),
    favorites: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    if (args.favorites) {
      const favoritedBoards = await ctx.db
        .query("userFavorites")
        .withIndex("by_user_org", (q) =>
          q.eq("userId", identity.subject).eq("orgId", args.orgId)
        )
        .order("desc")
        .collect();

      const ids = favoritedBoards.map((b) => b.boardId);

      const boards = await getAllOrThrow(ctx.db, ids);

      return boards.map((board: any) => ({
        ...board,
        isFavorite: true,
      }));
    }

    const title = args.search as string;
    let boards = [];

    if (title) {
      boards = await ctx.db
        .query("boards")
        .withSearchIndex("search_title", (q) =>
          q.search("title", title).eq("orgId", args.orgId)
        )
        .collect();
    } else {
      boards = await ctx.db
        .query("boards")
        .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
        .order("desc")
        .collect();
    }

    const boardsWithFavoriteRelation = boards.map((board) => {
      return ctx.db
        .query("userFavorites")
        .withIndex("by_user_board", (q) =>
          q.eq("userId", identity.subject).eq("boardId", board._id)
        )
        .unique()
        .then((favorite) => {
          return {
            ...board,
            isFavorite: !!favorite,
          };
        });
    });

    const boardsWithFavoriteBoolean = Promise.all(boardsWithFavoriteRelation);

    return boardsWithFavoriteBoolean;
  },
});
```


## convex\boardsHistory.ts

```ts
import { Infer, v } from "convex/values";

import { applyPatches } from "../utils/jsonDiff";
import { BoardStateData } from "../app/types/history";

import { mutation, query } from "./_generated/server";
import {
  boardDataPatchConvexValue,
  boardDataSnapshotConvexValue,
  boardHistoryTypeValue,
  TBoardPatchDataValue,
} from "./validators/boardData";
import { Doc, Id } from "./_generated/dataModel";

export const createVersion = mutation({
  args: {
    boardId: v.id("boards"),
    type: boardHistoryTypeValue,
    data: v.union(boardDataSnapshotConvexValue, boardDataPatchConvexValue),
    message: v.optional(v.string()),
    restoreByTime: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Получаем текущую версию
    const board = await ctx.db.get(args.boardId);
    if (!board) throw new Error("Board not found");

    // Валидация для патчей
    if (args.type === "patch") {
      const baseExists = await ctx.db
        .query("boardsHistory")
        .withIndex("by_board_version", (q) =>
          q
            .eq("boardId", args.boardId)
            .eq("version", (args.data as TBoardPatchDataValue).base)
        )
        .unique();
      if (!baseExists) throw new Error("Base version not found");
    }

    const versionId = await ctx.db.insert("boardsHistory", {
      boardId: args.boardId,
      version: board.currentVersion + 1,
      type: args.type,
      data: args.data,
      authorId: identity.subject,
      authorName: identity.name!,
      message: args.message,
      restoreByTime: args.restoreByTime,
    });

    // Получаем полную запись с _creationTime
    const newVersion = await ctx.db.get(versionId);

    if (!newVersion) throw new Error("Failed to create version");

    // Обновляем головную версию доски
    await ctx.db.patch(args.boardId, {
      currentVersion: newVersion?.version,
      head: versionId,
      updatedTime: newVersion?._creationTime,
    });

    return {
      id: versionId,
      version: newVersion.version,
      createdAt: newVersion._creationTime,
    };
  },
});

// Вынесенная обработка результатов
const processResults = (
  results: Doc<"boardsHistory">[],
  groupByBase?: boolean
) => {
  if (groupByBase) {
    const grouped: Record<number, Doc<"boardsHistory">[]> = {};

    let currentBase = 0;

    for (const record of results) {
      if (record.type === "snapshot") {
        currentBase =
          currentBase === record.version ? currentBase : record.version;
        grouped[currentBase] = grouped[currentBase] || [];
        grouped[currentBase].push(record);
      } else {
        grouped[currentBase] = grouped[currentBase] || [];
        grouped[currentBase].push(record);
      }
    }

    return { grouped, results };
  }

  return { grouped: undefined, results };
};

export const getBoardHistory = query({
  args: {
    boardId: v.id("boards"),
    searchQuery: v.optional(v.string()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    groupByBase: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Отдельная обработка поисковых запросов
    if (args.searchQuery) {
      let searchResults = await ctx.db
        .query("boardsHistory")
        .withSearchIndex("search_message", (q) =>
          q.search("message", args.searchQuery!).eq("boardId", args.boardId)
        );

      if (args.startDate || args.endDate) {
        searchResults = await searchResults.filter((q) =>
          q.and(
            args.startDate
              ? q.gte(q.field("_creationTime"), args.startDate)
              : q.and(),
            args.endDate
              ? q.lte(q.field("_creationTime"), args.endDate)
              : q.and()
          )
        );
      }

      // Ручная сортировка результатов поиска
      let sortedResults = await searchResults.collect();

      sortedResults = sortedResults.sort(
        (a, b) => b._creationTime - a._creationTime
      );

      return processResults(sortedResults, args?.groupByBase);
    }

    // Базовый запрос с сортировкой по версии
    let query = ctx.db
      .query("boardsHistory")
      .withIndex("by_board", (q) => q.eq("boardId", args.boardId))
      .order("asc");

    // Фильтрация по дате
    if (args.startDate || args.endDate) {
      query = query.filter((q) =>
        q.and(
          args.startDate
            ? q.gte(q.field("_creationTime"), args.startDate)
            : q.and(),
          args.endDate ? q.lte(q.field("_creationTime"), args.endDate) : q.and()
        )
      );
    }

    const results = await query.collect();

    return processResults(results, args?.groupByBase);
  },
});

export const getVersion = query({
  args: { versionId: v.id("boardsHistory") },
  handler: async (ctx, args) => {
    return ctx.db.get(args.versionId);
  },
});

export const getVersionByNumber = query({
  args: { boardId: v.id("boards"), version: v.number() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("boardsHistory")
      .withIndex("by_board_version", (q) =>
        q.eq("boardId", args.boardId).eq("version", args.version)
      )
      .unique();
  },
});

export const compareVersions = query({
  args: {
    versionId1: v.id("boardsHistory"),
    versionId2: v.id("boardsHistory"),
  },
  handler: async (ctx, args) => {
    const v1 = await ctx.db.get(args.versionId1);
    const v2 = await ctx.db.get(args.versionId2);
    return { v1, v2 };
  },
});

// Восстановление версии
export const restoreVersion = query({
  args: { versionId: v.id("boardsHistory") },
  handler: async (ctx, args) => {
    // Получаем начальную версию
    const initialVersion = await ctx.db.get(args.versionId);

    if (!initialVersion) {
      throw new Error("Version not found");
    }

    const versionChain = [];
    let currentVersion: typeof initialVersion | null = initialVersion;

    while (currentVersion) {
      versionChain.unshift(currentVersion);

      if (currentVersion.type === "snapshot") {
        break;
      }

      const patchData = currentVersion.data as TBoardPatchDataValue;

      const nextVersion = await ctx.db
        .query("boardsHistory")
        .withIndex(
          "by_board_version",
          (q) =>
            q
              .eq("boardId", currentVersion!.boardId) // Явное утверждение non-null
              .eq("version", patchData.base) // Используем номер базовой версии
        )
        .unique();

      currentVersion = nextVersion;
    }

    return versionChain.reduce((acc, version) => {
      if (version.type === "snapshot") return version.data;

      const patchData = version.data as Infer<typeof boardDataPatchConvexValue>;

      return applyPatches(acc, patchData.patches);
    }, {} as BoardStateData);
  },
});

export const searchByMessage = query({
  args: { boardId: v.id("boards"), query: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("boardsHistory")
      .withSearchIndex("search_message", (q) =>
        q.search("message", args.query).eq("boardId", args.boardId)
      )
      .collect();
  },
});

// Удаление старых версий
export const pruneHistory = mutation({
  args: { boardId: v.id("boards"), keepLast: v.number() },
  handler: async (ctx, args) => {
    const history = await ctx.db
      .query("boardsHistory")
      .withIndex("by_board", (q) => q.eq("boardId", args.boardId))
      .order("desc")
      .collect();

    const toDelete = history.slice(args.keepLast);

    await Promise.all(toDelete.map((version) => ctx.db.delete(version._id)));

    return { deleted: toDelete.length };
  },
});

// Получение базового снапшота для патча
export const getBaseSnapshot = query({
  args: { boardId: v.id("boards"), version: v.number() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("boardsHistory")
      .withIndex("by_board_version", (q) =>
        q.eq("boardId", args.boardId).eq("version", args.version)
      )
      .unique();
  },
});

export const updateVersionMessage = mutation({
  args: { id: v.id("boardsHistory"), message: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const message = args.message.trim();

    if (!message) {
      throw new Error("Message is required");
    }

    if (message.length > 60) {
      throw new Error("Message cannot be longer than 60 characters");
    }

    const board = await ctx.db.patch(args.id, {
      message,
    });

    return board;
  },
});

export const deleteVersion = mutation({
  args: { versionId: v.id("boardsHistory") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const targetVersion = await ctx.db.get(args.versionId);
    if (!targetVersion) throw new Error("Version not found");

    // Для снэпшотов: каскадное удаление всех зависимых патчей
    if (targetVersion.type === "snapshot") {
      const chainToDelete: Doc<"boardsHistory">[] = [];
      let currentVersion: typeof targetVersion | null = targetVersion;

      // 2. Находим все зависимые патчи до следующего снэпшота
      while (currentVersion) {
        const nextVersion = await ctx.db
          .query("boardsHistory")
          .withIndex("by_base", (q) =>
            q
              .eq("boardId", targetVersion.boardId)
              .eq("data.base", currentVersion?.version)
          )
          .first();

        if (!nextVersion || nextVersion.type === "snapshot") break;

        chainToDelete.push(nextVersion);
        currentVersion = nextVersion;
      }

      // 3. Удаляем всю цепочку
      await Promise.all([
        ...chainToDelete.map((v) => ctx.db.delete(v._id)),
        ctx.db.delete(args.versionId),
      ]);

      // Обновление текущей версии доски
      const board = await ctx.db.get(targetVersion.boardId);

      if (board) {
        const isCurrentVersionInChain =
          chainToDelete.some((v) => v.version === board?.currentVersion) ||
          targetVersion.version === board?.currentVersion;

        if (isCurrentVersionInChain) {
          const prevVersion = await ctx.db
            .query("boardsHistory")
            .withIndex("by_board", (q) =>
              q.eq("boardId", targetVersion.boardId)
            )
            .order("desc")
            .first();

          if (prevVersion) {
            await ctx.db.patch(board._id, {
              currentVersion: prevVersion.version,
              head: prevVersion._id,
            });
          }
        }
      }

      return { success: true };
    }

    const patchData = targetVersion.data as TBoardPatchDataValue;
    const baseVersion = patchData.base;

    // Для патчей: перенаправление зависимых версий
    const nextVersions = await ctx.db
      .query("boardsHistory")
      .withIndex("by_base", (q) =>
        q
          .eq("boardId", targetVersion.boardId)
          .eq("data.base", targetVersion.version)
      )
      .collect();

    // Находим предыдущую версию
    const previousVersion = await ctx.db
      .query("boardsHistory")
      .withIndex("by_board_version", (q) =>
        q.eq("boardId", targetVersion.boardId).eq("version", baseVersion)
      )
      .order("desc")
      .first();

    if (!previousVersion) {
      throw new Error("Cannot delete base version");
    }

    // Обновляем базовые ссылки у следующих версий
    await Promise.all(
      nextVersions.map(async (version) => {
        if (version.type === "patch") {
          await ctx.db.patch(version._id, {
            data: {
              ...version.data,
              base: previousVersion.version,
            },
          });
        }
      })
    );

    // Удаляем целевой патч
    await ctx.db.delete(targetVersion._id);

    // 5. Обновляем текущую версию доски
    const board = await ctx.db.get(targetVersion.boardId);

    if (board?.currentVersion === targetVersion.version) {
      await ctx.db.patch(board._id, {
        currentVersion: previousVersion.version,
        head: previousVersion._id,
      });
    }

    return { success: true };
  },
});
```


## convex\README.md

```md
# Welcome to your Convex functions directory!

Write your Convex functions here. See
https://docs.convex.dev/using/writing-convex-functions for more.

A query function that takes two arguments looks like:

```ts
// functions.js
import { query } from "./_generated/server";
import { v } from "convex/values";

export const myQueryFunction = query({
  // Validators for arguments.
  args: {
    first: v.number(),
    second: v.string(),
  },

  // Function implementation.
  handler: async (ctx, args) => {
    // Read the database as many times as you need here.
    // See https://docs.convex.dev/database/reading-data.
    const documents = await ctx.db.query("tablename").collect();

    // Arguments passed from the client are properties of the args object.
    console.log(args.first, args.second);

    // Write arbitrary JavaScript here: filter, aggregate, build derived data,
    // remove non-public properties, or create new objects.
    return documents;
  },
});
```

Using this query function in a React component looks like:

```ts
const data = useQuery(api.functions.myQueryFunction, {
  first: 10,
  second: "hello",
});
```

A mutation function looks like:

```ts
// functions.js
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const myMutationFunction = mutation({
  // Validators for arguments.
  args: {
    first: v.string(),
    second: v.string(),
  },

  // Function implementation.
  handler: async (ctx, args) => {
    // Insert or modify documents in the database here.
    // Mutations can also read from the database like queries.
    // See https://docs.convex.dev/database/writing-data.
    const message = { body: args.first, author: args.second };
    const id = await ctx.db.insert("messages", message);

    // Optionally, return a value from your mutation.
    return await ctx.db.get(id);
  },
});
```

Using this mutation function in a React component looks like:

```ts
const mutation = useMutation(api.functions.myMutationFunction);
function handleButtonPress() {
  // fire and forget, the most common way to use mutations
  mutation({ first: "Hello!", second: "me" });
  // OR
  // use the result once the mutation has completed
  mutation({ first: "Hello!", second: "me" }).then((result) =>
    console.log(result)
  );
}
```

Use the Convex CLI to push your functions to a deployment. See everything
the Convex CLI can do by running `npx convex -h` in your project root
directory. To learn more, launch the docs with `npx convex docs`.
```


## convex\schema.ts

```ts
import { v } from "convex/values";
import { defineSchema, defineTable } from "convex/server";
import {
  boardEdgesTypeValue,
  boardHistoryDataValue,
  boardHistoryTypeValue,
} from "./validators/boardData";

export default defineSchema({
  boards: defineTable({
    orgId: v.string(),
    authorId: v.string(),
    authorName: v.string(),
    imageUrl: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    edgesType: v.optional(boardEdgesTypeValue),
    currentVersion: v.number(), // Последняя версия
    head: v.optional(v.id("boardsHistory")), // Ссылка на актуальную версию
    updatedTime: v.optional(v.number()),
  })
    .index("by_org", ["orgId"])
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["orgId"],
    }),
  boardsHistory: defineTable({
    boardId: v.id("boards"),
    version: v.number(),
    type: boardHistoryTypeValue,
    data: boardHistoryDataValue,
    authorId: v.string(),
    authorName: v.optional(v.string()),
    message: v.optional(v.string()),
    restoreByTime: v.optional(v.number()),
  })
    .index("by_board_version", ["boardId", "version"])
    .index("by_board", ["boardId"])
    .index("by_base", ["boardId", "data.base"])
    .searchIndex("search_message", {
      searchField: "message",
      filterFields: ["boardId", "version"],
    }),
  userFavorites: defineTable({
    orgId: v.string(),
    userId: v.string(),
    boardId: v.id("boards"),
  })
    .index("by_board", ["boardId"])
    .index("by_user_org", ["userId", "orgId"])
    .index("by_user_board", ["userId", "boardId"])
    .index("by_user_board_org", ["userId", "boardId", "orgId"]),
});
```


## convex\tsconfig.json

```json
{
  /* This TypeScript project config describes the environment that
   * Convex functions run in and is used to typecheck them.
   * You can modify it, but some settings required to use Convex.
   */
  "compilerOptions": {
    /* These settings are not required by Convex and can be modified. */
    "allowJs": true,
    "strict": true,

    /* These compiler options are required by Convex */
    "target": "ESNext",
    "lib": ["ES2021", "dom"],
    "forceConsistentCasingInFileNames": true,
    "allowSyntheticDefaultImports": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "isolatedModules": true,
    "skipLibCheck": true,
    "noEmit": true
  },
  "include": ["./**/*", "../utils/utils"],
  "exclude": ["./_generated"]
}
```


## providers\convex-client-provider.tsx

```tsx
"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { AuthLoading, Authenticated, ConvexReactClient } from "convex/react";
import { Loading } from "@/components/loading";

interface ConvexClientProviderProps {
  children: React.ReactNode;
}

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;

const convex = new ConvexReactClient(convexUrl);

export const ConvexClientProvider = ({
  children,
}: ConvexClientProviderProps) => {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        <Authenticated>{children}</Authenticated>
        <AuthLoading><Loading/></AuthLoading>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};
```


## providers\modal-provider.tsx

```tsx
"use client";

import { useEffect, useState } from "react";
import { RenameModal } from "@/components/modals/rename-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <RenameModal />
    </>
  );
};
```


## utils\adapters.ts

```ts
import { Node, Edge, MarkerType } from "reactflow";
import {
  TNodeValue,
  TEdgeValue,
  TEdgeMarkerEndValue,
} from "@/convex/validators/boardData";

export const toConvexNode = (node: Node): TNodeValue => ({
  id: node.id,
  type: node.type || "default",
  width: node.width || 50,
  height: node.height || 50,
  selected: node.selected || false,
  dragging: node.dragging || false,
  positionAbsolute: {
    x: node.positionAbsolute?.x || 0,
    y: node.positionAbsolute?.y || 0,
  },
  position: {
    x: node.position.x,
    y: node.position.y,
  },
  data: {
    label: node.data.label,
    struct: node.data.struct,
    name: node.data.name,
  },
});

export const toReactFlowNode = (node: TNodeValue): Node => ({
  id: node.id,
  type: node.type,
  position: node.position,
  width: node.width,
  height: node.height,
  data: {
    label: node.data.label,
    struct: node.data.struct,
    name: node.data.name,
  },
  // Остальные поля с дефолтными значениями
  selected: node.selected,
  dragging: node.dragging,
  positionAbsolute: node.positionAbsolute,
});

export const toConvexEdge = (edge: Edge): TEdgeValue => ({
  id: edge.id,
  source: edge.source,
  target: edge.target,
  type: edge.type || "default",
  animated: edge.animated || false,
  data: edge.data || 0,
  selected: edge.selected || false,
  markerEnd: edge.markerEnd as TEdgeMarkerEndValue,
});

export const toReactFlowEdge = (edge: TEdgeValue): Edge => ({
  id: edge.id,
  source: edge.source,
  target: edge.target,
  type: edge.type,
  animated: edge.animated,
  data: edge.data,
  selected: edge.selected,
  markerEnd: edge.markerEnd,
  // Для совместимости с React Flow
  sourceHandle: null,
  targetHandle: null,
});
```


## utils\canvas.ts

```ts
import {
  Camera,
  Color,
  Layer,
  LayerType,
  PathLayer,
  Point,
  Side,
  XYWH
} from "@/app/types/canvas";
import { type ClassValue, clsx } from "clsx"
import { MarkerType } from "reactflow";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const markerEnd = {
  type: MarkerType.ArrowClosed,
  width: 20,
  height: 20,
  color: 'black',
}

const COLORS = [
  "#DC2626",
  "#D97706",
  "#059669",
  "#7C3AED",
  "#DB2777"
];

export function connectionIdToColor(connectionId: number): string {
  return COLORS[connectionId % COLORS.length];
};

export function pointerEventToCanvasPoint(
  e: React.PointerEvent,
  camera: Camera,
) {
  return {
    x: Math.round(e.clientX) - camera.x,
    y: Math.round(e.clientY) - camera.y,
  };
};

export function colorToCss(color: Color) {
  return `#${color.r.toString(16).padStart(2, "0")}${color.g.toString(16).padStart(2, "0")}${color.b.toString(16).padStart(2, "0")}`;
}

export function getSvgPathFromStroke(stroke: number[][]) {
  if (!stroke.length) return "";

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"]
  );

  d.push("Z");
  return d.join(" ");
};

export function resizeBounds(
  bounds: XYWH,
  corner: Side,
  point: Point
): XYWH {
  const result = {
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
  };

  if ((corner & Side.Left) === Side.Left) {
    result.x = Math.min(point.x, bounds.x + bounds.width);
    result.width = Math.abs(bounds.x + bounds.width - point.x);
  }

  if ((corner & Side.Right) === Side.Right) {
    result.x = Math.min(point.x, bounds.x);
    result.width = Math.abs(point.x - bounds.x);
  }

  if ((corner & Side.Top) === Side.Top) {
    result.y = Math.min(point.y, bounds.y + bounds.height);
    result.height = Math.abs(bounds.y + bounds.height - point.y);
  }

  if ((corner & Side.Bottom) === Side.Bottom) {
    result.y = Math.min(point.y, bounds.y);
    result.height = Math.abs(point.y - bounds.y);
  }

  return result;
};

export function findIntersectingLayersWithRectangle(
  layerIds: readonly string[],
  layers: ReadonlyMap<string, Layer>,
  a: Point,
  b: Point,
) {
  const rect = {
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    width: Math.abs(a.x - b.x),
    height: Math.abs(a.y - b.y),
  };

  const ids = [];

  for (const layerId of layerIds) {
    const layer = layers.get(layerId);

    if (layer == null) {
      continue;
    }

    const { x, y, height, width } = layer;

    if (
      rect.x + rect.width > x &&
      rect.x < x + width &&
      rect.y + rect.height > y &&
      rect.y < y + height
    ) {
      ids.push(layerId);
    }
  }

  return ids;
};

export function penPointsToPathLayer(
  points: number[][],
  color: Color,
): PathLayer {
  if (points.length < 2) {
    throw new Error("Cannot transform points with less than 2 points");
  }

  let left = Number.POSITIVE_INFINITY;
  let top = Number.POSITIVE_INFINITY;
  let right = Number.NEGATIVE_INFINITY;
  let bottom = Number.NEGATIVE_INFINITY;

  for (const point of points) {
    const [x, y] = point;

    if (left > x) {
      left = x;
    }

    if (top > y) {
      top = y;
    }

    if (right < x) {
      right = x;
    }

    if (bottom < y) {
      bottom = y;
    }
  }

  return {
    type: LayerType.Path,
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
    fill: color,
    points: points
      .map(([x, y, pressure]) => [x - left, y - top, pressure]),
  };
};
```


## utils\jsonDiff.ts

```ts
import { diff } from "deep-diff";

export const deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj)) as T;

type Operation = "add" | "remove" | "replace";

interface Patch {
  op: Operation;
  path: string;
  value?: any;
  oldValue?: any;
}

export const generatePatches = (prevState: any, newState: any): Patch[] => {
  const differences = diff(prevState, newState) || [];

  return differences.map((delta): Patch => {
    switch (delta.kind) {
      case "E": // Edit
        return {
          op: "replace",
          path: `/${delta.path!.join("/")}`,
          oldValue: delta.lhs,
          value: delta.rhs,
        };

      case "D": // Delete
        return {
          op: "remove",
          path: `/${delta.path!.join("/")}`,
          oldValue: delta.lhs,
        };

      case "N": // New
        return {
          op: "add",
          path: `/${delta.path!.join("/")}`,
          value: delta.rhs,
        };

      case "A": // Array change
        const arrayPath = delta.path?.length
          ? `/${delta.path.join("/")}/${delta.index}`
          : `/${delta.index}`;

        switch (delta.item.kind) {
          case "N":
            return {
              op: "add",
              path: `/${arrayPath}`,
              value: delta.item.rhs,
            };
          case "D":
            return {
              op: "remove",
              path: `/${arrayPath}`,
              oldValue: delta.item.lhs,
            };
          case "E":
            return {
              op: "replace",
              path: `/${arrayPath}`,
              oldValue: delta.item.lhs,
              value: delta.item.rhs,
            };
        }

      default:
        throw new Error(`Unhandled delta kind: ${(delta as any).kind}`);
    }
  });
};

export const applyPatches = (state: any, patches: Patch[]): any => {
  const newState = deepClone(state);

  patches.forEach((patch) => {
    const keys = patch.path.split("/").filter(Boolean);
    let target = newState;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      target = target[key];
    }

    const lastKey = keys[keys.length - 1];

    switch (patch.op) {
      case "add":
        if (Array.isArray(target)) {
          target.splice(Number(lastKey), 0, patch.value);
        } else {
          target[lastKey] = patch.value;
        }
        break;

      case "remove":
        if (Array.isArray(target)) {
          target.splice(Number(lastKey), 1);
        } else {
          delete target[lastKey];
        }
        break;

      case "replace":
        target[lastKey] = patch.value;
        break;
    }
  });

  return newState;
};

export const filterPatches = (patches: Patch[]): Patch[] => {
  return patches.filter((patch) => {
    // Игнорируем временные состояния
    const isTemporary = [
      "/dragging",
      "/selected",
      "/positionAbsolute",
      "/zIndex",
    ].some((s) => patch.path.includes(s));

    // Игнорируем позицию если смещение < 10px
    if (patch.path.endsWith("/position")) {
      const dx = Math.abs(patch.value.x - patch.oldValue.x);
      const dy = Math.abs(patch.value.y - patch.oldValue.y);
      return dx > 10 || dy > 10;
    }

    return !isTemporary;
  });
};
```


## utils\math.ts

```ts
export const randomDistribution = (value: number, edges: number[]) => {
    let totalWeight = edges.reduce((acc, edge) => acc + edge, 0);
    let probabilities = edges.map(edge => edge / totalWeight);

    let remainingResource = value;
    let distributedResources = Array(edges.length).fill(0);

    for (let i = 0; i < edges.length; i++) {
        let randomAmount = Math.floor(Math.random() * (remainingResource + 1));
        let amountToSend = Math.min(randomAmount, remainingResource * probabilities[i]);
        distributedResources[i] += amountToSend;
        remainingResource -= amountToSend;
    }

    while (remainingResource > 0) {
        let randomIndex = Math.floor(Math.random() * edges.length);
        distributedResources[randomIndex]++;
        remainingResource--;
    }

    distributedResources = distributedResources.map(resource => Math.round(resource));

    return distributedResources;
}

// let value = 10;
// let edges = [1, 2, 3, 1]; // Значения ребер
// let distributedResources = randomDistributionWithProbabilities(value, edges);

// Распределенные ресурсы: [ 2, 2, 3, 2 ]
```

## liveblocks.config.ts

```ts
import {
  createClient,
  LiveList,
  LiveMap,
  LiveObject,
} from "@liveblocks/client";
import { createLiveblocksContext, createRoomContext } from "@liveblocks/react";
import { Color, Layer } from "./app/types/canvas";
import { Node } from "reactflow";

export const client = createClient({
  // publicApiKey: process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY! as string,
  authEndpoint: "/api/liveblocks-auth",
  throttle: 16,
});

// Presence represents the properties that exist on every user in the Room
// and that will automatically be kept in sync. Accessible through the
// `user.presence` property. Must be JSON-serializable.
type Presence = {
  cursor: { x: number; y: number } | null;
  selection: string[];
  // для рисования карандашем
  pencilDraft: [x: number, y: number, pressure: number][] | null;
  penColor: Color | null;
};

// Optionally, Storage represents the shared document that persists in the
// Room, even after all users leave. Fields under Storage typically are
// LiveList, LiveMap, LiveObject instances, for which updates are
// automatically persisted and synced to all connected clients.
type Storage = {
  // layers: LiveMap<string, LiveObject<Layer>>;
  layers: LiveMap<string, LiveObject<Layer>>;
  layerIds: LiveList<string>;
};

// Optionally, UserMeta represents static/readonly metadata on each user, as
// provided by your own custom auth back end (if used). Useful for data that
// will not change during a session, like a user's name or avatar.
type UserMeta = {
  id?: string;
  info?: {
    name?: string;
    color?: string;
    picture?: string;
  };
};

// Optionally, the type of custom events broadcast and listened to in this
// room. Use a union for multiple events. Must be JSON-serializable.
type RoomEvent = {
  // type: "NOTIFICATION",
  // ...
};

// Optionally, when using Comments, ThreadMetadata represents metadata on
// each thread. Can only contain booleans, strings, and numbers.
export type ThreadMetadata = {
  // resolved: boolean;
  // quote: string;
  // time: number;
};

// Room-level hooks, use inside `RoomProvider`
export const {
  suspense: {
    RoomProvider,
    useRoom,
    useMyPresence,
    useUpdateMyPresence,
    useSelf,
    useOthers,
    useOthersMapped,
    useOthersListener,
    useOthersConnectionIds,
    useOther,
    useBroadcastEvent,
    useEventListener,
    useErrorListener,
    useStorage,
    useBatch,
    useHistory,
    useUndo,
    useRedo,
    useCanUndo,
    useCanRedo,
    useMutation,
    useStatus,
    useLostConnectionListener,
    useThreads,
    useCreateThread,
    useEditThreadMetadata,
    useCreateComment,
    useEditComment,
    useDeleteComment,
    useAddReaction,
    useRemoveReaction,
    useThreadSubscription,
    useMarkThreadAsRead,
    useRoomNotificationSettings,
    useUpdateRoomNotificationSettings,

    // These hooks can be exported from either context
    // useUser,
    // useRoomInfo
  },
} = createRoomContext<Presence, Storage, UserMeta, RoomEvent, ThreadMetadata>(
  client
);

// Project-level hooks, use inside `LiveblocksProvider`
export const {
  suspense: {
    LiveblocksProvider,
    useMarkInboxNotificationAsRead,
    useMarkAllInboxNotificationsAsRead,
    useInboxNotifications,
    useUnreadInboxNotificationsCount,

    // These hooks can be exported from either context
    useUser,
    useRoomInfo,
  },
} = createLiveblocksContext<UserMeta, ThreadMetadata>(client);
```


## middleware.ts

```ts
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
    // Routes that can be accessed while signed out
    // publicRoutes: ['/anyone-can-visit-this-route'],
    // // Routes that can always be accessed, and have
    // // no authentication information
    // ignoredRoutes: ['/no-auth-in-this-route'],
});

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
```


## next.config.mjs

```mjs
/* @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns:[
            {
                protocol: 'https',
                hostname: "img.clerk.com"
            }
        ]
    }
};

export default nextConfig;
```
```


## README.md

```md
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
```


## tailwind.config.ts

```ts
import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
```


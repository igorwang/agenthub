"use client";

import { selectedLibrariesType } from "@/components/Library/LibraryCart";
import LibraryListItem from "@/components/Library/LibraryCart/library-item";
import { LibraryCardType } from "@/types/chatTypes";
import { cn } from "@nextui-org/react";
import React from "react";

export type LibraryGridProps = React.HTMLAttributes<HTMLDivElement> & {
  itemClassName?: string;
  libraries?: LibraryCardType[];
  selectedLibraries?: selectedLibrariesType[];
  onAddLibrary?: (libraryId: string) => void;
  onRemoveLibrary?: (libraryId: string) => void;
};

const LibraryGrid = React.forwardRef<HTMLDivElement, LibraryGridProps>(
  (
    {
      itemClassName,
      className,
      onAddLibrary,
      onRemoveLibrary,
      selectedLibraries,
      libraries,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "grid w-full grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
          className,
        )}
        {...props}>
        {libraries &&
          libraries.map((library) => (
            <LibraryListItem
              key={library.id}
              library={library}
              selectedLibraries={selectedLibraries}
              onAddLibrary={onAddLibrary}
              onRemoveLibrary={onRemoveLibrary}
              className={cn("w-full snap-start", itemClassName)}
            />
          ))}
      </div>
    );
  },
);

LibraryGrid.displayName = "ProductsGrid";

export default LibraryGrid;

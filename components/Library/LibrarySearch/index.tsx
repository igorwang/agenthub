"use client";

import { useKnowledgeBaseListQuery } from "@/graphql/generated/types";
import { Icon } from "@iconify/react";
import { Chip, Input } from "@nextui-org/react";
import debounce from "lodash/debounce";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface Library {
  id: string;
  name: string;
}

interface LibrarySearchProps {
  onSelectChange?: (selectedLibraries: Library[]) => void;
  defaultSelectedLibraries?: Library[];
}

const LibrarySearch: React.FC<LibrarySearchProps> = ({
  onSelectChange,
  defaultSelectedLibraries = [],
}) => {
  const session = useSession();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedLibraries, setSelectedLibraries] = useState<Library[]>(
    defaultSelectedLibraries,
  );
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const { data, refetch } = useKnowledgeBaseListQuery({
    variables: {
      where: {
        _or: [
          { is_publish: { _eq: true } },
          { creator_id: { _eq: session.data?.user?.id } },
        ],
      },
      limit: 5,
    },
  });

  const debouncedRefetch = useCallback(
    debounce((term: string) => {
      refetch({
        where: {
          _and: [
            {
              _or: [
                { is_publish: { _eq: true } },
                { creator_id: { _eq: session.data?.user?.id } },
              ],
            },
            term ? { name: { _ilike: `%${term}%` } } : {},
          ],
        },
        limit: 5,
      });
    }, 300),
    [refetch, session.data?.user?.id],
  );

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    debouncedRefetch(value);
  };

  const filteredLibraries =
    data?.knowledge_base
      .filter((lib) => !selectedLibraries.some((selected) => selected.id === lib.id))
      .slice(0, 5) || [];

  const handleSelectLibrary = (library: Library) => {
    setSelectedLibraries((prev) => {
      const updated = [...prev, { id: library.id, name: library.name }];
      onSelectChange?.(updated);
      return updated;
    });
    setSearchTerm("");
  };

  const handleRemoveLibrary = (libraryId: string) => {
    setSelectedLibraries((prev) => {
      const updated = prev.filter((lib) => lib.id !== libraryId);
      onSelectChange?.(updated);
      return updated;
    });
  };

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="w-full space-y-2" ref={searchRef}>
      <Input
        placeholder="Search libraries..."
        value={searchTerm}
        onValueChange={handleSearchChange}
        onFocus={() => setIsInputFocused(true)}
        onBlur={() => setIsInputFocused(false)}
        startContent={<Icon icon="solar:magnifier-linear" className="text-default-400" />}
      />

      {isInputFocused && (
        <div className="w-full rounded-md border border-gray-200 shadow-sm">
          {filteredLibraries.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {filteredLibraries.map((library) => (
                <li
                  key={library.id}
                  className="cursor-pointer px-2 py-1 text-sm hover:bg-gray-50"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelectLibrary(library)}>
                  {library.name}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-1 text-center text-sm text-gray-500">
              No matched library
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-1">
        {selectedLibraries.map((library) => (
          <Chip
            key={library.id}
            onClose={() => handleRemoveLibrary(library.id)}
            variant="flat"
            color="primary"
            size="sm">
            {library.name}
          </Chip>
        ))}
      </div>
    </div>
  );
};

export default LibrarySearch;

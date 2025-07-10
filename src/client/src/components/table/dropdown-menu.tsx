'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenuCheckboxItem,
  DropdownMenu as DropdownMenuComponent,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  getSelectedLanguagesSync,
  setSelectedLanguages,
} from '@/lib/language-store';
import { IconChevronDown, IconLayoutColumns } from '@tabler/icons-react';
import type { Table } from '@tanstack/react-table';
import type { Language } from '@/types/table-types';

interface DropdownMenuProps<TData> {
  table: Table<TData>;
}

export function DropdownMenu<TData>({ table }: DropdownMenuProps<TData>) {
  // Получаем raw список — может быть и string[], и Language[]
  const selectedRaw = getSelectedLanguagesSync();
  const selectedCodes = selectedRaw
    .map(item => (typeof item === 'string' ? item : (item as Language).code))
    .filter((code): code is string => Boolean(code));

  const onToggleColumn = (columnId: string, visible: boolean) => {
    const column = table.getColumn(columnId);
    if (!column) return;
    column.toggleVisibility(visible);

    // Обновляем список кодов
    let newCodes: string[];
    if (visible) {
      newCodes = Array.from(new Set([...selectedCodes, columnId]));
    } else {
      newCodes = selectedCodes.filter(code => code !== columnId);
    }

    // Сохраняем как Language[], сводя к объектам с кодом
    const newSelected = newCodes.map(code => ({ code } as Language));
    setSelectedLanguages(newSelected);
  };

  return (
    <DropdownMenuComponent>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <IconLayoutColumns />
          <span className="hidden lg:inline">Customize Columns</span>
          <span className="lg:hidden">Columns</span>
          <IconChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {table
          .getAllColumns()
          .filter(
            column =>
              typeof column.accessorFn !== 'undefined' &&
              column.getCanHide() &&
              column.id !== 'key'
          )
          .map(column => (
            <DropdownMenuCheckboxItem
              key={column.id}
              className="capitalize"
              checked={column.getIsVisible()}
              onCheckedChange={value => onToggleColumn(column.id, !!value)}
            >
              {column.id}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenuComponent>
  );
}

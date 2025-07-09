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

interface DropdownMenuProps<TData> {
	table: Table<TData>;
}

export function DropdownMenu<TData>({ table }: DropdownMenuProps<TData>) {
	const selectedLangs = getSelectedLanguagesSync();

	const onToggleColumn = (columnId: string, visible: boolean) => {
		const column = table.getColumn(columnId);
		if (!column) return;
		column.toggleVisibility(visible);

		let newSelected: string[] = [];

		if (visible) {
			newSelected = [...selectedLangs, columnId];
		} else {
			newSelected = selectedLangs.filter(lang => lang !== columnId);
		}

		setSelectedLanguages(newSelected as any);
	};

	return (
		<DropdownMenuComponent>
			<DropdownMenuTrigger asChild>
				<Button variant='outline' size='sm'>
					<IconLayoutColumns />
					<span className='hidden lg:inline'>Customize Columns</span>
					<span className='lg:hidden'>Columns</span>
					<IconChevronDown />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' className='w-56'>
				{table
					.getAllColumns()
					.filter(
						column =>
							typeof column.accessorFn !== 'undefined' &&
							column.getCanHide() &&
							column.id !== 'key'
					)
					.map(column => {
						return (
							<DropdownMenuCheckboxItem
								key={column.id}
								className='capitalize'
								checked={column.getIsVisible()}
								onCheckedChange={value => onToggleColumn(column.id, !!value)}
							>
								{column.id}
							</DropdownMenuCheckboxItem>
						);
					})}
			</DropdownMenuContent>
		</DropdownMenuComponent>
	);
}

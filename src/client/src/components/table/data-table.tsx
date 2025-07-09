'use client';

import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
	type ColumnDef,
	type ColumnFiltersState,
} from '@tanstack/react-table';

import { Input } from '@/components/ui/input';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { getSelectedLanguagesSync } from '@/lib/language-store';
import type { Language } from '@/types/table-types';
import React, { useEffect, useState } from 'react';
import { Sheet } from '../sheet/sheet';
import { DataTablePagination } from './data-table-pagination';
import { DropdownMenu } from './dropdown-menu';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export function DataTable<TData, TValue>({
	columns,
	data,
}: DataTableProps<TData, TValue>) {
	const [localData, setLocalData] = useState<TData[]>(data);

	useEffect(() => {
		setLocalData(data);
	}, [data]);

	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);

	const defaultLanguages = getSelectedLanguagesSync();

	const initialVisibility = columns.reduce<Record<string, boolean>>(
		(acc, col) => {
			const id = col.id ?? '';

			if (
				id === 'key' ||
				id === 'actions' ||
				defaultLanguages.includes(id as Language)
			) {
				acc[id] = true;
			} else {
				acc[id] = false;
			}
			return acc;
		},
		{}
	);

	const table = useReactTable({
		data: localData,
		columns,
		initialState: {
			columnVisibility: initialVisibility,
		},
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			columnFilters,
		},
	});

	const handleAddRow = (row: TData) => {
		setLocalData(prev => [...prev, row]);
	};

	return (
		<div>
			<div className='flex items-center justify-between py-4'>
				<Input
					placeholder='Filter keys...'
					value={(table.getColumn('key')?.getFilterValue() as string) ?? ''}
					onChange={event =>
						table.getColumn('key')?.setFilterValue(event.target.value)
					}
					className='max-w-sm'
				/>
				<div className='flex flex-row items-center gap-4'>
					<DropdownMenu table={table} />
					<Sheet onAddRow={handleAddRow} />
				</div>
			</div>
			<div className='rounded-md border mb-2'>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map(headerGroup => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map(header => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
													)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map(row => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}
								>
									{row.getVisibleCells().map(cell => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className='h-24 text-center'
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<DataTablePagination table={table} />
		</div>
	);
}

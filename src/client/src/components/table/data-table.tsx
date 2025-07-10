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
	type PaginationState,
	type Updater,
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
import type { Translation } from '@/types/table-types';
import React, { useEffect, useState } from 'react';
import { Sheet } from '../sheet/sheet';
import { DataTablePagination } from './data-table-pagination';
import { DropdownMenu } from './dropdown-menu';

interface DataTableProps {
	columns: ColumnDef<Translation, any>[];
	data: Translation[];
	manualPagination?: boolean;
	pageCount?: number;
	pageIndex?: number;
	pageSize?: number;
	onPageChange?: (idx: number) => void;
	onPageSizeChange?: (size: number) => void;
}

export function DataTable({
	columns,
	data,
	manualPagination = false,
	pageCount = 1,
	pageIndex = 0,
	pageSize = 10,
	onPageChange,
	onPageSizeChange,
}: DataTableProps) {
	const [localData, setLocalData] = useState<Translation[]>(data);

	useEffect(() => {
		setLocalData(data);
	}, [data]);

	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);

	const selectedCodes = getSelectedLanguagesSync().map(l => l.code);

	const initialVisibility = columns.reduce<Record<string, boolean>>(
		(acc, col) => {
			const id = col.id ?? '';
			acc[id] = id === 'key' || id === 'actions' || selectedCodes.includes(id);
			return acc;
		},
		{}
	);

	const table = useReactTable({
		data: localData,
		columns,
		manualPagination,
		pageCount,
		state: {
			pagination: { pageIndex, pageSize },
			columnFilters,
			columnVisibility: initialVisibility,
		},
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnFiltersChange: setColumnFilters,
		onPaginationChange: (updater: Updater<PaginationState>) => {
			const newState =
				typeof updater === 'function'
					? updater({ pageIndex, pageSize })
					: updater;
			onPageChange?.(newState.pageIndex);
			onPageSizeChange?.(newState.pageSize);
		},
	});

	const handleAddRow = (row: Translation) => {
		setLocalData(prev => [...prev, row]);
	};

	return (
		<div>
			<div className='flex items-center justify-between py-4'>
				<Input
					placeholder='Filter keys...'
					value={(table.getColumn('key')?.getFilterValue() as string) ?? ''}
					onChange={e => table.getColumn('key')?.setFilterValue(e.target.value)}
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
								{headerGroup.headers.map(header => (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.length ? (
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

'use client';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import type { Language, Translation } from '@/types/table-types';
import { IconDotsVertical } from '@tabler/icons-react';
import type { ColumnDef } from '@tanstack/react-table';
import { TableCell } from '@/components/ui/table';
import { DataTableColumnHeader } from './data-table-column-header';

export function columnsFactory(
	languages: Language[],
	onDeleteRow: (id: string) => void,
	onEditCell: (id: string, field: string | 'key', value: string) => void
): ColumnDef<Translation>[] {
	return [
		{
			accessorKey: 'key',
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title='Key' />
			),
			cell: ({ row }) => (
				<Input
					className='w-full bg-transparent outline-none border border-transparent focus:border-gray-300 px-2 py-1 rounded-sm'
					defaultValue={row.original.key}
					onBlur={e =>
						onEditCell(row.original.id.toString(), 'key', e.target.value)
					}
					placeholder='Key'
				/>
			),
		},
		...languages.map<ColumnDef<Translation>>(language => ({
			accessorFn: row => row.translations[language.code],
			id: language.code,
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title={language.name} />
			),
			cell: ({ row }) => {
				const value = row.original.translations[language.code];
				return (
					<Input
						className='w-full bg-transparent outline-none border border-transparent focus:border-gray-300 px-2 py-1 rounded-sm'
						defaultValue={value || ''}
						onBlur={e =>
							onEditCell(row.original.id.toString(), language.code, e.target.value)
						}
						placeholder='Translation'
					/>
				);
			},
		})),
		{
			id: 'actions',
			cell: ({ row }) => (
				<TableCell className='!px-0 text-right'>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant='ghost'
								className='data-[state=open]:bg-muted text-muted-foreground flex size-8'
								size='icon'
							>
								<IconDotsVertical />
								<span className='sr-only'>Open menu</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end' className='w-32'>
							<DropdownMenuItem
								variant='destructive'
								onClick={() => onDeleteRow(row.original.id.toString())}
							>
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</TableCell>
			),
		},
	];
}

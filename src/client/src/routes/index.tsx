'use client';

import { columnsFactory } from '@/components/table/columns';
import { DataTable } from '@/components/table/data-table';
import type { Language, Translation } from '@/types/table-types';
import { getTranslations, getLanguages } from '@/utils/api';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import '../index.css';

export const Route = createFileRoute('/')({
  component: Index,
});

// function Index() {
// 	return (
// 		<div className='p-2'></div>
// 			);
// }

function Index() {
  const [data, setData] = useState<Translation[]>([]);
  const [languages, setLanguages] = useState<Language[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [pageIndex, setPageIndex] = useState(0); // 0‑based
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [{ items, totalPages }, languageData] = await Promise.all([
          getTranslations(pageIndex + 1, pageSize),
          getLanguages(),
        ]);

        setData(items);
        setTotalPages(totalPages);
        setLanguages(languageData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, [pageIndex, pageSize]);

  if (isLoading || !languages) {
    return (
      <div className='p-2'>
        <h3 className='font-semibold text-3xl mb-4'>Translation Service!</h3>
        <div className='flex justify-center items-center py-12'>
          <div className='animate-spin rounded-full h-8 w-8 border-4 border-zinc-900 border-t-transparent' />
        </div>
      </div>
    );
  }

  const handleDeleteRow = (id: string) => {
    setData(prev => prev.filter(row => row.id !== id));
  };

  const handleEditCell = (id: string, field: string | 'key', value: string) => {
    setData(prev =>
      prev.map(row =>
        row.id === id
          ? field === 'key'
            ? { ...row, key: value }
            : {
                ...row,
                translations: { ...row.translations, [field]: value },
              }
          : row
      )
    );
  };

  const columns = columnsFactory(languages, handleDeleteRow, handleEditCell);

  return (
    <div className='p-2'>
      <h3 className='font-semibold text-3xl mb-4'>Translation Service!</h3>
      <DataTable
        columns={columns}
        data={data}
        manualPagination
        pageCount={totalPages}
        pageIndex={pageIndex}
        pageSize={pageSize}
        onPageChange={setPageIndex}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}

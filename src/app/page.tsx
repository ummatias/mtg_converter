/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import Papa from 'papaparse';

import {
  moxfieldToManabox,
  moxfieldToLigamagic,
  manaboxToMoxfield,
  manaboxToLigamagic,
  ligamagicToMoxfield,
  ligamagicToManabox,
} from '@/utils/convertion';

type FormatType = 'MoxField' | 'ManaBox' | 'LigaMagic';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [fromFormat, setFromFormat] = useState<FormatType>('MoxField');
  const [toFormat, setToFormat] = useState<FormatType>('ManaBox');
  const [csvData, setCsvData] = useState<any[]>([]);
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const expectedHeaders: Record<FormatType, string[]> = {
    MoxField: ['Count', 'Name', 'Edition', 'Condition', 'Language'],
    ManaBox: ['Name', 'Set code', 'Collector number', 'Quantity'],
    LigaMagic: ['Card (EN)', 'Quantidade', 'Edicao (Sigla)'],
  };

  const validateHeaders = (headers: string[], format: FormatType) => {
    const required = expectedHeaders[format];
    return required.every((h) => headers.includes(h));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result: any) => {
        const data = result.data as any[];
        const headers = result.meta.fields || [];

        if (!validateHeaders(headers, fromFormat)) {
          setCsvData([]);
          setOutput('');
          setError(`Invalid CSV for ${fromFormat}. Required columns: ${expectedHeaders[fromFormat].join(', ')}`);
          return;
        }

        setError(null);
        setCsvData(data);
        setOutput('');
      },
    });
  };

  const convertCards = (cards: any[], from: FormatType, to: FormatType): any[] => {
    if (from === to) return cards;

    switch (from) {
      case 'MoxField':
        if (to === 'ManaBox') return moxfieldToManabox(cards);
        if (to === 'LigaMagic') return moxfieldToLigamagic(cards);
        break;
      case 'ManaBox':
        if (to === 'MoxField') return manaboxToMoxfield(cards);
        if (to === 'LigaMagic') return manaboxToLigamagic(cards);
        break;
      case 'LigaMagic':
        if (to === 'MoxField') return ligamagicToMoxfield(cards);
        if (to === 'ManaBox') return ligamagicToManabox(cards);
        break;
    }

    return [];
  };

  const handleConvert = () => {
    const converted = convertCards(csvData, fromFormat, toFormat);
    const csv = Papa.unparse(converted);
    setOutput(csv);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `converted_${fromFormat}_to_${toFormat}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md border dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">CSV Converter</h1>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          Convert a CSV file between MoxField, ManaBox, and LigaMagic formats.
        </p>

        {error && (
          <div className="mb-4 px-4 py-2 bg-red-600 text-white text-sm rounded">
            {error}
          </div>
        )}

        <div
          className={`border-2 ${
            error
              ? 'border-red-500'
              : csvData.length
              ? 'border-green-500'
              : 'border-gray-300'
          } border-dashed rounded-lg p-4 text-center transition-all`}
        >
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Choose File
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFile}
            className="w-full text-sm"
          />
        </div>

        <div className="mt-6">
          <label className="block text-gray-700 dark:text-gray-300 mb-1">From</label>
          <select
            value={fromFormat}
            onChange={(e) => setFromFormat(e.target.value as FormatType)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
          >
            <option value="MoxField">MoxField</option>
            <option value="ManaBox">ManaBox</option>
            <option value="LigaMagic">LigaMagic</option>
          </select>
        </div>

        <div className="mt-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-1">To</label>
          <select
            value={toFormat}
            onChange={(e) => setToFormat(e.target.value as FormatType)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
          >
            <option value="MoxField">MoxField</option>
            <option value="ManaBox">ManaBox</option>
            <option value="LigaMagic">LigaMagic</option>
          </select>
        </div>

        <button
          onClick={handleConvert}
          className="cursor-pointer w-full mt-6 block text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition disabled:opacity-50"
          disabled={!csvData.length}
        >
          Convert
        </button>

        <button
          onClick={handleDownload}
          className="cursor-pointer w-full mt-2 block text-center bg-green-600 hover:bg-green-700 text-white py-2 rounded transition disabled:opacity-50"
          disabled={!output}
        >
          Download
        </button>
      </div>
    </div>
  );
}

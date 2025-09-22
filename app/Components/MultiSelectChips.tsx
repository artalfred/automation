"use client";
import { useState } from "react";

type Props = {
  options: string[]; // e.g., ["Alabama","Alaska","Arizona",...]
  onChange: (values: string[]) => void;
};

export default function MultiSelectChips({ options, onChange }: Props) {
  const [current, setCurrent] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const add = () => {
    if (!current) return;
    if (!selected.includes(current)) {
      const next = [...selected, current];
      setSelected(next);
      onChange(next);
    }
    setCurrent("");
  };

  const remove = (val: string) => {
    const next = selected.filter((s) => s !== val);
    setSelected(next);
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-[1rem] ">
        <div className="relative">
          <select
            className="border border-gray-300 rounded-full outline-none text-[14px] text-black"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
          >
            <option value="">Select a state/city…</option>
            {options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="#777"
            className="size-5 absolute right-4 top-3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m19.5 8.25-7.5 7.5-7.5-7.5"
            />
          </svg>
        </div>

        <button
          onClick={add}
          className="px-[4rem] py-2 rounded-full text-white disabled:opacity-50 city-btn "
          disabled={!current}
        >
          Add
        </button>
      </div>

      {/* Chips */}
      <div className="flex flex-wrap gap-2">
        {selected.map((s) => (
          <span
            key={s}
            className="main--color text-[14px] inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
          >
            {s}
            <button
              className="main--color hover:text-gray-800"
              onClick={() => remove(s)}
              aria-label={`Remove ${s}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

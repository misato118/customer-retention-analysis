"use client"

import { useState } from "react";
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { CheckIcon } from '@heroicons/react/20/solid'

const contractOptions = [
  { value: 0, label: "Month-to-Month" },
  { value: 1, label: "One Year" },
  { value: 2, label: "Two Year" },
];

interface ResultData {
  prediction: number;
  churn_probability: number;
  message: string;
}

export default function Home() {
  const [formData, setFormData] = useState({
    tenure: 12,
    monthly_charges: 50,
    total_charges: 600,
    contract_type: contractOptions[0].value,
  });
  const [prediction, setPrediction] = useState<ResultData | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    setPrediction(data);
  };

  return (
    <div className="flex justify-center mt-10">
      <form onSubmit={handleSubmit}>
        <div className="space-y-12">
          <div className="border-b border-white/10 pb-12 mb-3">
            <h2 className="text-2xl/7 font-semibold text-white">Churn Predictor</h2>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label htmlFor="tenure" className="block text-sm/6 font-medium text-white">Tenure</label>
                <div className="mt-2">
                  <div className="flex items-center rounded-md bg-white/5 pl-3 outline-1 -outline-offset-1 outline-white/10 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-500">
                    <input id="tenure" type="number" name="tenure" value={formData.tenure} onChange={(e) => setFormData({...formData, tenure: parseInt(e.target.value)})} className="block min-w-0 grow bg-transparent py-1.5 pr-3 pl-1 text-base text-white placeholder:text-gray-500 focus:outline-none sm:text-sm/6" />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-4">
                <label htmlFor="monthly_charges" className="block text-sm/6 font-medium text-white">Monthly Charges</label>
                <div className="mt-2">
                  <div className="flex items-center rounded-md bg-white/5 pl-3 outline-1 -outline-offset-1 outline-white/10 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-500">
                    <input id="monthly_charges" type="number" name="monthly_charges" value={formData.monthly_charges} onChange={(e) => setFormData({...formData, monthly_charges: parseInt(e.target.value)})} className="block min-w-0 grow bg-transparent py-1.5 pr-3 pl-1 text-base text-white placeholder:text-gray-500 focus:outline-none sm:text-sm/6" />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-4">
                <label htmlFor="total_charges" className="block text-sm/6 font-medium text-white">Total Charges</label>
                <div className="mt-2">
                  <div className="flex items-center rounded-md bg-white/5 pl-3 outline-1 -outline-offset-1 outline-white/10 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-500">
                    <input id="total_charges" type="number" name="total_charges" value={formData.total_charges} onChange={(e) => setFormData({...formData, total_charges: parseInt(e.target.value)})} className="block min-w-0 grow bg-transparent py-1.5 pr-3 pl-1 text-base text-white placeholder:text-gray-500 focus:outline-none sm:text-sm/6" />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-4">
                <Listbox onChange={(value) => setFormData({...formData, contract_type: parseInt(value)})}>
                  <Label className="block text-sm/6 font-medium text-white">Contract</Label>
                  <div className="relative mt-2">
                    <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-gray-800/50 py-1.5 pr-2 pl-3 text-left text-white outline-1 -outline-offset-1 outline-white/10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-500 sm:text-sm/6">
                      <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
                        <span className="block truncate">{contractOptions[formData.contract_type].label}</span>
                      </span>
                      <ChevronDownIcon
                        aria-hidden="true"
                        className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-400 sm:size-4"
                      />
                    </ListboxButton>

                    <ListboxOptions
                      transition
                      className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-gray-800 py-1 text-base outline-1 -outline-offset-1 outline-white/10 data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
                    >
                      {contractOptions.map((contractOption) => (
                        <ListboxOption
                          key={contractOption.label}
                          value={contractOption.value}
                          className="group relative cursor-default py-2 pr-9 pl-3 text-white select-none data-focus:bg-indigo-500 data-focus:outline-hidden"
                        >
                          <div className="flex items-center">
                            <span className="ml-3 block truncate font-normal group-data-selected:font-semibold">{contractOption.label}</span>
                          </div>

                          <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-400 group-not-data-selected:hidden group-data-focus:text-white">
                            <CheckIcon aria-hidden="true" className="size-5" />
                          </span>
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </div>
                </Listbox>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          Predict
        </button>

        <div className="my-5">
        {prediction && (
          <div className={`mt-6 p-4 rounded ${prediction.prediction === 1 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
            <h3 className="font-bold text-lg">{prediction.message}</h3>
            <p>Probability: {(prediction.churn_probability * 100).toFixed(1)}%</p>
          </div>
        )}
      </div>
      </form>
    </div>
  );
}

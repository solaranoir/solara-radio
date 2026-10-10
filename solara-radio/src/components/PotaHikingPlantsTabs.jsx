import { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import POTAWidget from './POTAWidget';
import HikingMapsWidget from './HikingMapsWidget';
import LocalPlantsWidget from './LocalPlantsWidget';

const tabs = [
  { value: 'pota', title: 'Find a POTA park', detail: 'Explore and plan' },
  { value: 'hiking', title: 'Nearby trails', detail: 'Take the long way' },
  { value: 'plants', title: 'Local plants', detail: 'Field observations' },
];

export default function PotaHikingPlantsTabs() {
  const [tab, setTab] = useState('pota');
  return (
    <section id="field-tools" className="w-full" aria-labelledby="field-tools-heading">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.2em] text-[#A3B68D]">Field operations</p>
          <h2 id="field-tools-heading" className="font-heading text-3xl text-[#F2C79D]">Go find some sky</h2>
        </div>
        <span className="text-sm text-[#A3B68D]">POTA · Hiking · Natural history</span>
      </div>
      <Tabs.Root value={tab} onValueChange={setTab} className="w-full">
        <Tabs.List aria-label="Field tools" className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {tabs.map(({value,title,detail}) => (
            <Tabs.Trigger key={value} value={value} className="rounded-xl border border-[#24666D]/60 bg-[#0C2F34] px-4 py-3 text-left text-[#F2C79D] transition hover:border-[#EC935E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#EC935E] data-[state=active]:border-[#EC935E] data-[state=active]:bg-[#24666D]/40">
              <span className="block font-semibold">{title}</span>
              <span className="block text-xs text-[#A3B68D]">{detail}</span>
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        <Tabs.Content value="pota" className="focus-visible:outline-none"><POTAWidget /></Tabs.Content>
        <Tabs.Content value="hiking" className="focus-visible:outline-none"><HikingMapsWidget /></Tabs.Content>
        <Tabs.Content value="plants" className="focus-visible:outline-none"><LocalPlantsWidget /></Tabs.Content>
      </Tabs.Root>
    </section>
  );
}

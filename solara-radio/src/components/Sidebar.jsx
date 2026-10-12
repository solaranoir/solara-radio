import MaidenheadWidget from '../components/MaidenheadWidget';
import TimeAndDateWidget from '../components/TimeAndDateWidget';
import BuyMeCoffeeWidget from '../components/BuyMeCoffeeWidget';
import PskreporterWidget from '../components/PskreporterWidget';
import MUFMapWidget from '../components/MUFMapWidget';

export default function Sidebar() {
  return (
    <aside className="solara-utility-sidebar">
      <div className="solara-utility-sidebar__item">
        <TimeAndDateWidget />
      </div>
      <div className="solara-utility-sidebar__item">
        <MaidenheadWidget />
      </div>
      <div className="solara-utility-sidebar__item">
        <MUFMapWidget />
      </div>
      <div className="solara-utility-sidebar__item">
        <PskreporterWidget />
      </div>
      <div className="solara-utility-sidebar__item">
        <BuyMeCoffeeWidget />
      </div>
    </aside>
  );
}


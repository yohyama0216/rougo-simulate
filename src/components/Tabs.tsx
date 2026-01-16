interface TabsProps {
  activeTab: number;
  onTabChange: (tab: number) => void;
}

const tabs = [
  { id: 0, label: '積立（NISA）' },
  { id: 1, label: '取り崩し' },
  { id: 2, label: '老後の月収' },
];

export default function Tabs({ activeTab, onTabChange }: TabsProps) {
  return (
    <ul className="nav nav-tabs mb-4">
      {tabs.map((tab) => (
        <li key={tab.id} className="nav-item">
          <button
            onClick={() => onTabChange(tab.id)}
            className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
            type="button"
          >
            {tab.label}
          </button>
        </li>
      ))}
    </ul>
  );
}

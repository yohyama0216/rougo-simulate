import React from 'react';

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
    <div style={styles.container}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          style={{
            ...styles.tab,
            ...(activeTab === tab.id ? styles.activeTab : {}),
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
    borderBottom: '2px solid #e0e0e0',
  },
  tab: {
    padding: '12px 24px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    color: '#666',
    borderBottom: '3px solid transparent',
    transition: 'all 0.2s',
  } as React.CSSProperties,
  activeTab: {
    color: '#1976d2',
    borderBottomColor: '#1976d2',
  } as React.CSSProperties,
};

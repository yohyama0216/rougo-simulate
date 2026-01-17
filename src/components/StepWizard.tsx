export type WizardStep = 'preset' | 'accumulation' | 'income' | 'result';

interface StepWizardProps {
  currentStep: WizardStep;
  onStepChange: (step: WizardStep) => void;
}

const steps: { id: WizardStep; label: string; icon: string }[] = [
  { id: 'preset', label: 'かんたんスタート', icon: 'rocket-takeoff' },
  { id: 'accumulation', label: '積立設定', icon: 'piggy-bank' },
  { id: 'income', label: '年金設定', icon: 'wallet2' },
  { id: 'result', label: '結果確認', icon: 'graph-up-arrow' },
];

export default function StepWizard({ currentStep, onStepChange }: StepWizardProps) {
  const currentIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="mb-4">
      {/* Progress bar */}
      <div className="d-none d-md-flex align-items-center justify-content-between mb-3">
        {steps.map((step, index) => {
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex;
          const isClickable = index <= currentIndex;

          return (
            <div key={step.id} className="d-flex align-items-center" style={{ flex: 1 }}>
              {/* Step circle */}
              <button
                type="button"
                className={`rounded-circle d-flex align-items-center justify-content-center
                  ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}
                  ${isActive ? 'bg-primary text-white' : ''}
                  ${isCompleted ? 'bg-success text-white' : ''}
                  ${!isActive && !isCompleted ? 'bg-light text-muted' : ''}
                `}
                style={{
                  width: '48px',
                  height: '48px',
                  border: isActive ? '3px solid #667eea' : '2px solid #dee2e6',
                  transition: 'all 0.3s',
                  cursor: isClickable ? 'pointer' : 'not-allowed',
                }}
                onClick={() => isClickable && onStepChange(step.id)}
                disabled={!isClickable}
              >
                <i className={`bi bi-${isCompleted ? 'check-lg' : step.icon} fs-5`}></i>
              </button>

              {/* Label */}
              <div className="ms-2" style={{ minWidth: '80px' }}>
                <div className={`small fw-bold ${isActive ? 'text-primary' : 'text-muted'}`}>
                  STEP {index + 1}
                </div>
                <div className={`small ${isActive ? 'fw-bold' : ''}`}>
                  {step.label}
                </div>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div 
                  className="flex-grow-1 mx-3"
                  style={{
                    height: '2px',
                    background: isCompleted ? '#28a745' : '#dee2e6',
                    transition: 'background 0.3s',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile progress */}
      <div className="d-md-none">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <span className="small fw-bold text-primary">
            STEP {currentIndex + 1} / {steps.length}
          </span>
          <span className="small text-muted">
            {steps[currentIndex].label}
          </span>
        </div>
        <div className="progress" style={{ height: '6px' }}>
          <div
            className="progress-bar"
            role="progressbar"
            style={{
              width: `${((currentIndex + 1) / steps.length) * 100}%`,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
            aria-valuenow={(currentIndex + 1) / steps.length * 100}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>
    </div>
  );
}

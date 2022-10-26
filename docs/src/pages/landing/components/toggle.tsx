/** @jsxImportSource react */
const Toggle: React.FC<{
  id: string;
  label: string;
  onSelectionChange?: (selected: boolean) => void;
}> = ({ id, label, onSelectionChange = (_: boolean) => {} }) => {
  return (
    <div>
      <span className="mr-4">{label}</span>
      <div className="switch focus-within:outline-black focus-within:outline">
        <input
          id={id}
          type="checkbox"
          role="switch"
          onChange={({ target: { checked } }) => onSelectionChange(checked)}
          className="switch-input sr-only"
        />
        <label htmlFor={id} className="switch-label">
          {label}
        </label>
      </div>
    </div>
  );
};

export default Toggle;

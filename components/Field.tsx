type InputProps = {
  label: string;
  children: React.ReactNode;
};

const Field = ({ label, children }: InputProps) => {
  return (
    <div className="flex-1">
      <label className="text-gray-500 font-bold">
        {label} <br />
        {children}
      </label>
    </div>
  );
};

export default Field;

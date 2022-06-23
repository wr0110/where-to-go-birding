type Props = {
  name: string;
  address?: string;
};

export default function Address({ name, address }: Props) {
  return (
    <div className="mb-2">
      <h3 className="font-bold text-lg">{name}</h3>
      {address && <p className="whitespace-pre-line" dangerouslySetInnerHTML={{ __html: address }} />}
    </div>
  );
}

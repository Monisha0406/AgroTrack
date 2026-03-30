export default function MachineCard({ machine }) {
  return (
    <div className="card">
      <h3>{machine.name}</h3>
      <p>{machine.type}</p>
      <span>Status: {machine.status}</span>
    </div>
  );
}
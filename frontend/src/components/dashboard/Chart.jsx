export default function StatCard({ title, value, subtitle, color }) {
  return (
    <div className={`card ${color}`}>
      <p>{title}</p>
      <h2>{value}</h2>
      <span>{subtitle}</span>
    </div>
  );
}
import BookingForm from "../components/bookings/BookingForm";
import BookingTable from "../components/bookings/BookingTable";

export default function Bookings() {
  return (
    <div>
      <h2>Bookings</h2>

      <BookingForm />
      <br />
      <BookingTable />
    </div>
  );
}
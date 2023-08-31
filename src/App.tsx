import { useState } from "react";
import PlainReactCalendar from "./container/plain-react-calendar";

export default function App() {
  const [date, setDate] = useState(["2023-08-05"]);

  return (
    <div>
      <PlainReactCalendar value={date} onChange={(e) => setDate(e)} />
    </div>
  );
}

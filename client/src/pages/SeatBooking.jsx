import React, { useEffect, useState } from "react";
import API from "../api/api";

function Seat({ seat, me, onClick, selected }) {
  const owned = seat.isBooked && seat.bookedBy && seat.bookedBy._id === me?.id;
  return (
    <button
      onClick={() => onClick(seat)}
      className={`w-14 h-12 m-1 rounded flex items-center justify-center text-sm border
        ${seat.isBooked ? (owned ? "bg-blue-600 text-white" : "bg-red-600 text-white") : "bg-green-600 text-white"}
        ${selected ? "ring-2 ring-yellow-400" : ""}
      `}
    >
      {seat.seatNumber}
    </button>
  );
}

export default function SeatBooking() {
  const [seats, setSeats] = useState([]);
  const [me, setMe] = useState(null);
  const [selectedToUpdate, setSelectedToUpdate] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchSeats(); }, []);

  const fetchSeats = async () => {
    setLoading(true);
    try {
      const res = await API.get("/seats");
      setSeats(res.data);
    } catch (err) {
      alert("Could not load seats");
    } finally { setLoading(false); }
  };

  const handleClickSeat = (seat) => {
    const owned = seat.isBooked && seat.bookedBy?._id === me?.id;
    if (!seat.isBooked) {
      toggleUpdateSelection(seat.seatNumber);
    } else if (owned) {
      // Cancel single booked seat
      cancelSeat(seat.seatNumber);
    }
  };

  const toggleUpdateSelection = (seatNumber) => {
    setSelectedToUpdate(prev =>
      prev.includes(seatNumber) ? prev.filter(s => s !== seatNumber) : [...prev, seatNumber]
    );
  };

  const cancelSeat = async (seatNumber) => {
    try {
      await API.post("/seats/cancel", { seatNumber });
      await fetchSeats();
    } catch (err) {
      alert(err.response?.data?.msg || "Cancel failed");
    }
  };

  const updateBooking = async () => {
    const from = seats.filter(s => s.bookedBy?._id === me.id).map(s => s.seatNumber);
    const to = selectedToUpdate;
    if (to.length === 0) return alert("Select seats to update");
    try {
      await API.post("/seats/update", { from, to });
      setSelectedToUpdate([]);
      await fetchSeats();
    } catch (err) {
      alert(err.response?.data?.msg || "Update failed");
    }
  };

  // Infer user id from token
  useEffect(()=>{
    const token = localStorage.getItem("token");
    if (token) {
      try { const payload = JSON.parse(atob(token.split('.')[1])); setMe({ id: payload.user.id }); }
      catch(e) { console.warn(e); }
    }
  },[]);

  return (
    <div className="max-w-3xl mx-auto ">
      <h1 className="text-2xl font-bold mb-4 text-white  bg-black text-center py-3 underline">Seat Booking</h1>
      <div className="bg-white p-4 rounded shadow">
        {loading ? <p>Loading...</p> : (
          <div className="flex flex-col sm:flex-row sm:flex-wrap">
            {Array.from({ length: 5 }).map((_, r) => (
              <div key={r} className="flex">
                {seats.slice(r*6, r*6+6).map(s => (
                  <Seat
                    key={s.seatNumber}
                    seat={s}
                    me={me}
                    onClick={handleClickSeat}
                    selected={selectedToUpdate.includes(s.seatNumber)}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={fetchSeats} className="bg-gray-600 font-bold text-blue-50 cursor-pointer rounded-2xl px-3 py-1 active:scale-95">Refresh</button>
          <button onClick={updateBooking} className="bg-green-700 cursor-pointer text-blue-50 rounded-2xl px-3 py-1 active:scale-95 font-bold">Update Booking</button>
          <button onClick={()=>{ localStorage.removeItem('token'); setMe(null); alert('Logged out'); }} className="bg-red-600 text-blue-50 cursor-pointer rounded-2xl px-3 py-1 active:scale-95 font-bold">Logout</button>
        </div>
      </div>
      
      
    </div>
  );
}

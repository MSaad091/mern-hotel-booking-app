// import React, { useEffect, useState } from "react";
// import { Rooms } from "../../api";
// import "../stylesheets/Room.css";
// import { useNavigate } from "react-router-dom";
// import Navbar from "./Navbar";

// function AllRoom() {
//   const [rooms, setRooms] = useState([]);
//   const [selectedType, setSelectedTypes] = useState("")
//   const navigate = useNavigate();

//   const fetchRoom = async () => {
//     try {
//       const request = await Rooms();
//       const response = request.data.data;
//       setRooms(response);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handlenavigate = (roomId) => {
//     navigate(`/room/${roomId}`);
//   };

//   const filterProduct = selectedType === "all" ? rooms : rooms.filter((room) =>room.type === selectedType )

//   useEffect(() => {
//     fetchRoom();
//   }, []);


//   return (
//     <>
//       <Navbar />

//       <div className="allroom-container">
//         <h1 className="allroom-title">All Rooms</h1>
//         <button onClick={() => setSelectedTypes("all")}>All</button>
//         <button onClick={() => setSelectedTypes("Suite")}>Suite</button>

//        {
//         filterProduct.length > 0  ? (
//           filterProduct.map((room) => (

//  <div className="room-grid">
//           {rooms.length > 0 ? (
//             rooms.map((room) => (
//               <div className="room-card" key={room._id}>
                
//                 {/* Image */}
//                 {room.images?.[0] && (
//                   <img
//                     src={room.images[0]}
//                     alt={room.name}
//                     className="room-main-img"
//                   />
//                 )}

//                 {/* Info */}
//                 <div className="room-info">
//                   <h2>{room.name}</h2>
//                   <p><strong>Type:</strong> {room.type}</p>
//                   <p><strong>Capacity:</strong> {room.capacity}</p>
//                   <p><strong>Hotel:</strong> {room.hotel?.name}</p>

//                   {/* ❌ isAvailable completely removed */}

//                   <button onClick={() => handlenavigate(room._id)}>
//                     Check Availability
//                   </button>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p>No rooms found.</p>
//           )}
//         </div>

//           ))
//         ) :(
//           <p>Room Not FOund</p>
//         )
//        }
//       </div>
//     </>
//   );
// }

// export default AllRoom;
//   import React, { useEffect, useState } from "react";
// import { Rooms } from "../../api";
// import "../stylesheets/Room.css";
// import { useNavigate } from "react-router-dom";
// import Navbar from "./Navbar";

// function AllRoom() {
//   const [rooms, setRooms] = useState([]);
//   const [selectedType, setSelectedType] = useState("all");

//   const navigate = useNavigate();

//   const fetchRoom = async () => {
//     try {
//       const request = await Rooms();
//       setRooms(request.data.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handlenavigate = (roomId) => {
//     navigate(`/room/${roomId}`);
//   };

//   // ✅ FILTER LOGIC
//   const filterProduct =
//     selectedType === "all"
//       ? rooms
//       : rooms.filter((room) => room.type === selectedType);

//   useEffect(() => {
//     fetchRoom();
//   }, []);

//   return (
//     <>
//       <Navbar />

//       <div className="allroom-container">
//         <h1 className="allroom-title">All Rooms</h1>

//         {/* 🔘 FILTER BUTTONS */}
//         <div className="filter-buttons">
//           <button onClick={() => setSelectedType("all")}>All</button>
//           <button onClick={() => setSelectedType("Suite")}>Suite</button>
//           <button onClick={() => setSelectedType("Deluxe")}>Deluxe</button>
//         </div>

//         <div className="room-grid">
//           {filterProduct.length > 0 ? (
//             filterProduct.map((room) => (
//               <div className="room-card" key={room._id}>
//                 {room.images?.[0] && (
//                   <img
//                     src={room.images[0]}
//                     alt={room.name}
//                     className="room-main-img"
//                   />
//                 )}

//                 <div className="room-info">
//                   <h2>{room.name}</h2>
//                   <p><strong>Type:</strong> {room.type}</p>
//                   <p><strong>Capacity:</strong> {room.capacity}</p>
//                   <p><strong>Hotel:</strong> {room.hotel?.name}</p>

//                   <button onClick={() => handlenavigate(room._id)}>
//                     Check Availability
//                   </button>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p>Room Not Found</p>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }

// export default AllRoom;

import React, { useEffect, useState } from "react";
import { Rooms } from "../../api";
import "../stylesheets/Room.css";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function AllRoom() {
  const [rooms, setRooms] = useState([]);
  const [selectedType, setSelectedType] = useState("all");

  const navigate = useNavigate();

  const fetchRoom = async () => {
    try {
      const request = await Rooms();
      setRooms(request.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handlenavigate = (roomId) => {
    navigate(`/room/${roomId}`);
  };

  const filteredRooms =
    selectedType === "all"
      ? rooms
      : rooms.filter(
          (room) =>
            room.type?.toLowerCase() === selectedType.toLowerCase()
        );

  useEffect(() => {
    fetchRoom();
  }, []);

  return (
    <>
      <Navbar />

      <div className="allroom-container">
        <h1 className="allroom-title">All Rooms</h1>

        {/* FILTER BUTTONS */}
        <div className="filter-buttons">
          <button
            className={selectedType === "all" ? "active" : ""}
            onClick={() => setSelectedType("all")}
          >
            All
          </button>

          <button
            className={selectedType === "Suite" ? "active" : ""}
            onClick={() => setSelectedType("Suite")}
          >
            Suite
          </button>

          <button
            className={selectedType === "Deluxe" ? "active" : ""}
            onClick={() => setSelectedType("Deluxe")}
          >
            Deluxe
          </button>
        </div>

        <div className="room-grid">
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room) => (
              <div className="room-card" key={room._id}>
                {room.images?.[0] && (
                  <img
                    src={room.images[0]}
                    alt={room.name}
                    className="room-main-img"
                  />
                )}

                <div className="room-info">
                  <h2>{room.name}</h2>
                  <p>
                    <strong>Type:</strong> {room.type}
                  </p>
                  <p>
                    <strong>Capacity:</strong> {room.capacity}
                  </p>
                  <p>
                    <strong>Hotel:</strong> {room.hotel?.name}
                  </p>

                  <button onClick={() => handlenavigate(room._id)}>
                    Check Availability
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-room">Room Not Found</p>
          )}
        </div>
      </div>
    </>
  );
}

export default AllRoom;

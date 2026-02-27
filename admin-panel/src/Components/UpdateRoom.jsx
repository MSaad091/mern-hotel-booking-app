// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { updateRoom, getRoomDetails } from "../../api"; // getRoomDetails to prefill
// import { toast } from "react-toastify";
// import "../stylesheets/UpdateRoom.css";

// function UpdateRoom() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [name, setName] = useState("");
//   const [type, setType] = useState("");
//   const [price, setPrice] = useState("");
//   const [capacity, setCapacity] = useState("");
//   const [description, setDescription] = useState("");
//   const [amenities, setAmenities] = useState("");
//   const [images, setImages] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Prefill room details
//   useEffect(() => {
//     const fetchRoom = async () => {
//       try {
//         const res = await getRoomDetails(id);
//         const room = res.data.room;
//         setName(room.name);
//         setType(room.type);
//         setPrice(room.price);
//         setCapacity(room.capacity);
//         setDescription(room.description);
//         setAmenities(room.amenities);
//         // existing images URLs
//         setImages(room.images || []);
//       } catch (err) {
//         toast.error("Failed to load room data");
//       }
//     };
//     fetchRoom();
//   }, [id]);

//   // Handle image selection
//   const handleImages = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     // combine existing + new, max 3
//     const totalFiles = [...images, ...selectedFiles].slice(0, 3);
//     setImages(totalFiles);
//   };

//   // Remove individual image
//   const removeImage = (index) => {
//     setImages(images.filter((_, i) => i !== index));
//   };

//   const handleUpdateRoom = async (e) => {
//     e.preventDefault();
//     if (!name || !type || !price) {
//       toast.error("Please fill required fields");
//       return;
//     }

//     try {
//       setLoading(true);
//       const formdata = new FormData();
//       formdata.append("name", name);
//       formdata.append("type", type);
//       formdata.append("price", price);
//       formdata.append("capacity", capacity);
//       formdata.append("description", description);
//       formdata.append("amenities", amenities);

//       images.forEach((img) => {
//         // only append File objects, not URLs
//         if (img instanceof File) formdata.append("images", img);
//       });

//       const res = await updateRoom(id, formdata);
//       console.log(res.data);
//       toast.success("Room updated successfully");
//       setTimeout(() => navigate("/all-rooms"), 1500);
//     } catch (err) {
//       console.log(err);
//       toast.error("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="update-room-container">
//       <div className="update-room-card">
//         <div className="update-room-header">
//           <h2>Update Room</h2>
//           <p className="subtitle">Edit room information below</p>
//         </div>

//         <form onSubmit={handleUpdateRoom} className="update-room-form">
//           <div className="form-grid">
//             <div className="form-group">
//               <label>
//                 Room Name <span className="required">*</span>
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter room name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className="form-input"
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label>
//                 Room Type <span className="required">*</span>
//               </label>
//               <select
//                 value={type}
//                 onChange={(e) => setType(e.target.value)}
//                 className="form-input"
//                 required
//               >
//                 <option value="">Select room type</option>
//                 <option value="standard">Single</option>
//                 <option value="deluxe">Deluxe</option>
//                 <option value="suite">Suite</option>
//                 <option value="executive">Double</option>
//                 <option value="family">Family</option>
//               </select>
//             </div>

//             <div className="form-group">
//               <label>
//                 Price per Night <span className="required">*</span>
//               </label>
//               <div className="input-with-icon">
//                 <span className="currency-icon">₹</span>
//                 <input
//                   type="number"
//                   placeholder="Enter price"
//                   value={price}
//                   onChange={(e) => setPrice(e.target.value)}
//                   className="form-input"
//                   min="0"
//                   required
//                 />
//               </div>
//             </div>

//             <div className="form-group">
//               <label>Capacity</label>
//               <div className="input-with-icon">
//                 <span className="icon">👥</span>
//                 <input
//                   type="number"
//                   placeholder="Number of guests"
//                   value={capacity}
//                   onChange={(e) => setCapacity(e.target.value)}
//                   className="form-input"
//                   min="1"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="form-group">
//             <label>Description</label>
//             <textarea
//               placeholder="Describe room features..."
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               className="form-textarea"
//               rows="4"
//             />
//           </div>

//           <div className="form-group">
//             <label>Amenities</label>
//             <input
//               type="text"
//               placeholder="wifi, ac, tv, breakfast..."
//               value={amenities}
//               onChange={(e) => setAmenities(e.target.value)}
//               className="form-input"
//             />
//             <small className="helper-text">Separate amenities with commas</small>
//           </div>

//           <div className="form-group">
//             <label>Update Images (max 3)</label>
//             <input
//               type="file"
//               multiple
//               accept="image/*"
//               onChange={handleImages}
//               className="form-input"
//             />

//             {images.length > 0 && (
//               <div className="selected-files">
//                 <p>Selected files: {images.length}</p>
//                 <ul>
//                   {images.map((file, index) => (
//                     <li key={index} className="file-item">
//                       {file.name || file.split("/").pop()}
//                       <button type="button" onClick={() => removeImage(index)}>
//                         ❌
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>

//           <div className="form-actions">
//             <button
//               type="button"
//               className="btn btn-secondary"
//               onClick={() => navigate("/all-rooms")}
//               disabled={loading}
//             >
//               Cancel
//             </button>
//             <button type="submit" className="btn btn-primary" disabled={loading}>
//               {loading ? "Updating..." : "Update Room"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default UpdateRoom;

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateRoom,  RoomInfo } from "../../api"; // getRoomDetails to prefill
import { toast } from "react-toastify";
import "../stylesheets/UpdateRoom.css";

function UpdateRoom() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const [capacity, setCapacity] = useState("");
  const [description, setDescription] = useState("");
  const [amenities, setAmenities] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Prefill room details
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await RoomInfo(id);
        const room = res.data.room;
        setName(room?.name);
        setType(room.type);
        setPrice(room.price);
        setCapacity(room.capacity);
        setDescription(room.description);
        setAmenities(room.amenities);
        // existing images URLs
        setImages(room.images || []);
      } catch (error) {
        toast.error("Failed to load room data");
        console.log(error);
        
      }
    };
    fetchRoom();
  }, [id]);

  // Handle image selection
  const handleImages = (e) => {
    const selectedFiles = Array.from(e.target.files);
    // combine existing + new, max 3
    const totalFiles = [...images, ...selectedFiles].slice(0, 3);
    setImages(totalFiles);
  };

  // Remove individual image
  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleUpdateRoom = async (e) => {
    e.preventDefault();
    if (!name || !type || !price) {
      toast.error("Please fill required fields");
      return;
    }

    try {
      setLoading(true);
      const formdata = new FormData();
      formdata.append("name", name);
      formdata.append("type", type);
      formdata.append("price", price);
      formdata.append("capacity", capacity);
      formdata.append("description", description);
      formdata.append("amenities", amenities);

      images.forEach((img) => {
        // only append File objects, not URLs
        if (img instanceof File) formdata.append("images", img);
      });

      const res = await updateRoom(id, formdata);
      console.log(res.data);
      toast.success("Room updated successfully");
      setTimeout(() => navigate("/all-rooms"), 1500);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-room-container">
      <div className="update-room-card">
        <div className="update-room-header">
          <h2>Update Room</h2>
          <p className="subtitle">Edit room information below</p>
        </div>

        <form onSubmit={handleUpdateRoom} className="update-room-form">
          <div className="form-grid">
            <div className="form-group">
              <label>
                Room Name <span className="required">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter room name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label>
                Room Type <span className="required">*</span>
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="form-input"
                required
              >
                <option value="">Select room type</option>
                <option value="standard">Single</option>
                <option value="deluxe">Deluxe</option>
                <option value="suite">Suite</option>
                <option value="executive">Double</option>
                <option value="family">Family</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                Price per Night <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <span className="currency-icon">₹</span>
                <input
                  type="number"
                  placeholder="Enter price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="form-input"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Capacity</label>
              <div className="input-with-icon">
                <span className="icon">👥</span>
                <input
                  type="number"
                  placeholder="Number of guests"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="form-input"
                  min="1"
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              placeholder="Describe room features..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Amenities</label>
            <input
              type="text"
              placeholder="wifi, ac, tv, breakfast..."
              value={amenities}
              onChange={(e) => setAmenities(e.target.value)}
              className="form-input"
            />
            <small className="helper-text">Separate amenities with commas</small>
          </div>

          <div className="form-group">
            <label>Update Images (max 3)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImages}
              className="form-input"
            />

            {images.length > 0 && (
              <div className="selected-files">
                <p>Selected files: {images.length}</p>
                <ul>
                  {images.map((file, index) => (
                    <li key={index} className="file-item">
                      {file.name || file.split("/").pop()}
                      <button type="button" onClick={() => removeImage(index)}>
                        ❌
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/all-rooms")}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Updating..." : "Update Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateRoom;
